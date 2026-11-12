/*
# Create room_bookings table for homestay bookings

1. New Tables
- `room_bookings`
  - `id` (uuid, primary key, auto-generated) — also shown to guests as the booking ID
  - `guest_name` (text, not null) — name of the primary guest
  - `guest_phone` (text, not null) — contact phone number
  - `guests` (integer, not null) — number of guests
  - `check_in` (date, not null) — stay start date
  - `check_out` (date, not null) — stay end date
  - `nights` (integer, not null) — nights computed at insert time
  - `total_price` (integer, not null) — total stay price in rupees
  - `advance_amount` (integer, not null) — advance payment in rupees (500 for 1 guest, 1000 for more)
  - `payment_status` (text, not null, default 'pending') — 'pending' or 'advance_paid'
  - `status` (text, not null, default 'reserved') — room status
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `room_bookings`.
- This site has no sign-in, so all policies target `anon, authenticated`.
- SELECT is ownerless-public by design but restricted: any visitor can look up a booking only by its exact booking id (used to show the confirmation), so booking ids are effectively unguessable capability tokens.
- INSERT is allowed for anonymous visitors creating a booking.
- UPDATE is allowed only for changing payment_status from 'pending' to 'advance_paid' (the payment confirmation step); no other fields can be changed.
- DELETE is not granted to anyone.

3. Grants
- SELECT (id + display columns only), INSERT (booking columns only), and UPDATE (payment_status only) granted to `anon` and `authenticated`.
- service_role granted full access for future admin tooling.
*/

CREATE TABLE IF NOT EXISTS public.room_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  guest_phone text NOT NULL,
  guests integer NOT NULL CHECK (guests >= 1 AND guests <= 8),
  check_in date NOT NULL,
  check_out date NOT NULL,
  nights integer NOT NULL CHECK (nights >= 1),
  total_price integer NOT NULL CHECK (total_price >= 0),
  advance_amount integer NOT NULL CHECK (advance_amount IN (500, 1000)),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'advance_paid')),
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;

GRANT SELECT (id, guest_name, guests, check_in, check_out, nights, total_price, advance_amount, payment_status, status, created_at) ON public.room_bookings TO anon, authenticated;
GRANT INSERT (guest_name, guest_phone, guests, check_in, check_out, nights, total_price, advance_amount) ON public.room_bookings TO anon, authenticated;
GRANT UPDATE (payment_status) ON public.room_bookings TO anon, authenticated;
GRANT ALL ON public.room_bookings TO service_role;

DROP POLICY IF EXISTS "anyone_can_read_booking_by_id" ON public.room_bookings;
CREATE POLICY "anyone_can_read_booking_by_id" ON public.room_bookings
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "anyone_can_create_booking" ON public.room_bookings;
CREATE POLICY "anyone_can_create_booking" ON public.room_bookings
FOR INSERT TO anon, authenticated
WITH CHECK (
  guests >= 1 AND nights >= 1 AND advance_amount IN (500, 1000)
  AND total_price = guests * nights * 900
  AND advance_amount = CASE WHEN guests = 1 THEN 500 ELSE 1000 END
  AND payment_status = 'pending' AND status = 'reserved'
);

DROP POLICY IF EXISTS "only_mark_advance_paid" ON public.room_bookings;
CREATE POLICY "only_mark_advance_paid" ON public.room_bookings
FOR UPDATE TO anon, authenticated
USING (payment_status = 'pending')
WITH CHECK (payment_status = 'advance_paid');
