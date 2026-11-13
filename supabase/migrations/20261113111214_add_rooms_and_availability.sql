/*
# Add 4 rooms and real-time availability with double-booking prevention

1. New Tables
- `rooms`
  - `id` (uuid, primary key)
  - `name` (text, unique, not null) — room name shown to guests
  - `max_guests` (integer, not null) — how many guests the room sleeps
  - `active` (boolean, default true) — inactive rooms are hidden and never bookable
  - `sort_order` (integer, default 0) — display order
- `booking_rooms`
  - `id` (uuid, primary key)
  - `booking_id` (uuid, references room_bookings, cascade delete)
  - `room_id` (uuid, references rooms)
  - `check_in` / `check_out` (date) — the nights this room is held
  - `active` (boolean, default true) — set false when a booking is cancelled, releasing the room
  - EXCLUSION constraint using btree_gist: the same room cannot have two active stays
    whose date ranges overlap. This makes double booking impossible at the database level,
    even under concurrent requests.

2. Seed data
- 4 rooms inserted: Mountain View Room (sleeps 4), Valley View Room (sleeps 3),
  Garden View Room (sleeps 2), Family Room (sleeps 4). Idempotent by unique name.

3. New Functions
- `available_rooms(p_check_in date, p_check_out date)` — SECURITY DEFINER, STABLE.
  Returns every active room with an `available` boolean for the requested date range.
  Guests only learn room names/capacity/availability, never other guests' bookings.
- `create_booking(p_guest_name, p_guest_phone, p_guests, p_check_in, p_check_out, p_room_ids uuid[])`
  — SECURITY DEFINER. Atomically re-checks availability, computes nights and total
  (nights × guests × 900), inserts the booking and one booking_rooms row per room inside
  a single transaction. Raises 'NO_ROOMS_AVAILABLE' if any room is already held, and
  translates exclusion-constraint violations into the same error. Returns the booking row.

4. Security
- RLS enabled on both new tables.
- `rooms`: anon + authenticated can SELECT active rooms.
- `booking_rooms`: no policies — locked to everyone; access only through the functions.
- EXECUTE on both functions granted to anon + authenticated, revoked from PUBLIC.
- The front end calls these with the anon key; guests still cannot modify or read raw bookings.
*/

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  max_guests integer NOT NULL CHECK (max_guests >= 1),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

INSERT INTO public.rooms (name, max_guests, sort_order) VALUES
  ('Mountain View Room', 4, 1),
  ('Valley View Room', 3, 2),
  ('Garden View Room', 2, 3),
  ('Family Room', 4, 4)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.booking_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.room_bookings(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES public.rooms(id),
  check_in date NOT NULL,
  check_out date NOT NULL,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT booking_rooms_valid_dates CHECK (check_out > check_in),
  CONSTRAINT booking_rooms_no_overlap EXCLUDE USING gist (
    room_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  ) WHERE (active)
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_rooms ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.rooms TO anon, authenticated;

DROP POLICY IF EXISTS "anyone_can_view_active_rooms" ON public.rooms;
CREATE POLICY "anyone_can_view_active_rooms" ON public.rooms
FOR SELECT TO anon, authenticated
USING (active);

CREATE OR REPLACE FUNCTION public.available_rooms(p_check_in date, p_check_out date)
RETURNS TABLE (id uuid, name text, max_guests integer, available boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.name, r.max_guests,
    NOT EXISTS (
      SELECT 1 FROM public.booking_rooms br
      WHERE br.room_id = r.id
        AND br.active
        AND daterange(br.check_in, br.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
    ) AS available
  FROM public.rooms r
  WHERE r.active
  ORDER BY r.sort_order;
$$;

CREATE OR REPLACE FUNCTION public.create_booking(
  p_guest_name text,
  p_guest_phone text,
  p_guests integer,
  p_check_in date,
  p_check_out date,
  p_room_ids uuid[]
)
RETURNS public.room_bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nights integer;
  v_total integer;
  v_capacity integer;
  v_booking public.room_bookings;
BEGIN
  IF p_check_out <= p_check_in THEN
    RAISE EXCEPTION 'INVALID_DATES';
  END IF;
  IF p_guests < 1 THEN
    RAISE EXCEPTION 'INVALID_GUESTS';
  END IF;
  IF p_room_ids IS NULL OR cardinality(p_room_ids) < 1 THEN
    RAISE EXCEPTION 'NO_ROOMS_SELECTED';
  END IF;
  IF length(trim(p_guest_name)) < 2 OR length(trim(p_guest_phone)) < 10 THEN
    RAISE EXCEPTION 'INVALID_GUEST_DETAILS';
  END IF;

  v_nights := p_check_out - p_check_in;
  v_total := v_nights * p_guests * 900;

  SELECT coalesce(sum(r.max_guests), 0) INTO v_capacity
  FROM public.rooms r
  WHERE r.id = ANY(p_room_ids) AND r.active;
  IF v_capacity IS NULL OR cardinality(p_room_ids) > (SELECT count(*) FROM public.rooms WHERE active) THEN
    RAISE EXCEPTION 'INVALID_ROOMS';
  END IF;
  IF v_capacity < p_guests THEN
    RAISE EXCEPTION 'CAPACITY_EXCEEDED';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.booking_rooms br
    WHERE br.room_id = ANY(p_room_ids)
      AND br.active
      AND daterange(br.check_in, br.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
  ) THEN
    RAISE EXCEPTION 'NO_ROOMS_AVAILABLE';
  END IF;

  INSERT INTO public.room_bookings (guest_name, guest_phone, guests, check_in, check_out, nights, total_price, advance_amount)
  VALUES (trim(p_guest_name), trim(p_guest_phone), p_guests, p_check_in, p_check_out, v_nights, v_total, 0)
  RETURNING * INTO v_booking;

  INSERT INTO public.booking_rooms (booking_id, room_id, check_in, check_out)
  SELECT v_booking.id, rid, p_check_in, p_check_out
  FROM unnest(p_room_ids) AS rid;

  RETURN v_booking;
EXCEPTION
  WHEN exclusion_violation THEN
    RAISE EXCEPTION 'NO_ROOMS_AVAILABLE';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_booking(text, text, integer, date, date, uuid[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.available_rooms(date, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking(text, text, integer, date, date, uuid[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.available_rooms(date, date) TO anon, authenticated;
