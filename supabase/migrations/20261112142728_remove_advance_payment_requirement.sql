/*
# Remove advance payment requirement from bookings

1. Modified Tables
- `room_bookings`
  - `advance_amount` now defaults to 0 (bookings no longer collect an advance online).
  - The check that limited advance_amount to 500/1000 now also allows 0.
  - Guests confirm reservations directly; payment happens at check-in.

2. Security changes
- The INSERT policy no longer requires an advance-payment amount matching guest count.
- The total-price check remains: total_price must equal guests × nights × 900.
- UPDATE policy unchanged (still locked to anon users; payment status is managed offline).

3. Notes
- No data is dropped or deleted. Existing bookings keep their values.
*/

ALTER TABLE public.room_bookings ALTER COLUMN advance_amount SET DEFAULT 0;

ALTER TABLE public.room_bookings DROP CONSTRAINT IF EXISTS room_bookings_advance_amount_check;
ALTER TABLE public.room_bookings ADD CONSTRAINT room_bookings_advance_amount_check CHECK (advance_amount IN (0, 500, 1000));

DROP POLICY IF EXISTS "anyone_can_create_booking" ON public.room_bookings;
CREATE POLICY "anyone_can_create_booking" ON public.room_bookings
FOR INSERT TO anon, authenticated
WITH CHECK (
  guests >= 1 AND nights >= 1
  AND total_price = guests * nights * 900
  AND payment_status = 'pending' AND status = 'reserved'
);
