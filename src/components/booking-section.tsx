import { useState } from "react";
import { BadgeCheck, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRICE_PER_PERSON_PER_NIGHT, supabase, type RoomBooking } from "@/lib/supabase";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const rupees = (n: number) => fmt.format(n);

const today = () => new Date().toISOString().slice(0, 10);

function addDays(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string) {
  const ms = new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

type Step = "form" | "confirming" | "confirmation";

export function BookingSection() {
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState(addDays(today(), 1));
  const [checkOut, setCheckOut] = useState(addDays(today(), 3));
  const [step, setStep] = useState<Step>("form");
  const [booking, setBooking] = useState<RoomBooking | null>(null);
  const [error, setError] = useState("");

  const nights = Math.max(0, nightsBetween(checkIn, checkOut));
  const totalPrice = nights * guests * PRICE_PER_PERSON_PER_NIGHT;
  const valid = guestName.trim().length > 1 && guestPhone.trim().length >= 10 && nights >= 1;
  const shortBookingId = booking ? `SV-${booking.id.slice(0, 8).toUpperCase()}` : "";

  async function confirmReservation() {
    setStep("confirming");
    setError("");
    const { data, error: insErr } = await supabase
      .from("room_bookings")
      .insert({
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim(),
        guests,
        check_in: checkIn,
        check_out: checkOut,
        nights,
        total_price: totalPrice,
        advance_amount: 0,
      })
      .select()
      .single();
    if (insErr || !data) {
      setError("We couldn't save your reservation. Please try again or contact us on WhatsApp.");
      setStep("form");
      return;
    }
    setBooking(data);
    setStep("confirmation");
  }

  function reset() {
    setStep("form");
    setBooking(null);
    setError("");
    setGuestName("");
    setGuestPhone("");
    setGuests(2);
    setCheckIn(addDays(today(), 1));
    setCheckOut(addDays(today(), 3));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      {/* FORM */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
        <h3 className="font-display text-2xl">Reserve your room</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your dates and guests — the total updates as you go. Confirm directly and pay at
          the homestay when you arrive.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Check-in
            </span>
            <input
              type="date"
              value={checkIn}
              min={today()}
              onChange={(e) => {
                const v = e.target.value;
                setCheckIn(v);
                if (nightsBetween(v, checkOut) < 1) setCheckOut(addDays(v, 1));
              }}
              className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Check-out
            </span>
            <input
              type="date"
              value={checkOut}
              min={addDays(checkIn, 1)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Number of guests
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} guest{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Your name
            </span>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Full name"
              className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Phone (WhatsApp preferred)
            </span>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>
        </div>

        <Button
          variant="stay"
          disabled={!valid || step === "confirming"}
          onClick={confirmReservation}
          className="luxury-cta mt-6 h-auto min-h-12 w-full rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarCheck2 aria-hidden="true" className="h-4 w-4" />
          {step === "confirming" ? "Confirming your reservation…" : "Confirm Reservation"}
        </Button>
        {!valid && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Fill your name, a valid phone number and dates to continue.
          </p>
        )}
      </div>

      {/* LIVE PRICE BREAKDOWN */}
      <aside
        className="h-fit rounded-2xl border bg-secondary p-6 shadow-soft sm:p-8"
        aria-live="polite"
      >
        <h3 className="font-display text-2xl">Your stay summary</h3>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Price per person per night</dt>
            <dd className="font-semibold">{rupees(PRICE_PER_PERSON_PER_NIGHT)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Guests</dt>
            <dd className="font-semibold">{guests}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Nights</dt>
            <dd className="font-semibold">{nights || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t pt-3">
            <dt className="font-semibold">Total stay price</dt>
            <dd className="font-display text-2xl text-primary">{rupees(totalPrice)}</dd>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              <BadgeCheck aria-hidden="true" className="h-4 w-4 text-accent" /> Nothing to pay now
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              No advance or online payment — the full {rupees(totalPrice || 0)} is paid at the
              homestay during check-in.
            </p>
          </div>
        </dl>
      </aside>

      {/* CONFIRMATION MODAL */}
      <Dialog
        open={step === "confirmation"}
        onOpenChange={(isOpen) => {
          if (!isOpen) reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Room reserved!</DialogTitle>
            <DialogDescription>
              Your reservation is confirmed. Pay the full amount at check-in.
            </DialogDescription>
          </DialogHeader>
          {booking && (
            <div className="space-y-4">
              <dl className="space-y-2 rounded-lg border bg-secondary p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Booking ID</dt>
                  <dd className="font-mono font-semibold">{shortBookingId}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Guest</dt>
                  <dd className="font-semibold">{booking.guest_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Dates</dt>
                  <dd className="font-semibold">
                    {booking.check_in} → {booking.check_out}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Guests</dt>
                  <dd className="font-semibold">{booking.guests}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total stay</dt>
                  <dd className="font-semibold">{rupees(booking.total_price)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t pt-2">
                  <dt className="text-muted-foreground">Payment</dt>
                  <dd className="font-semibold">Pay {rupees(booking.total_price)} at check-in</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                    Reserved
                  </dd>
                </div>
              </dl>
              <p className="text-center text-sm text-muted-foreground">
                Show booking ID{" "}
                <span className="font-mono font-semibold text-foreground">{shortBookingId}</span> at
                check-in. We'll also WhatsApp you to say hello.
              </p>
              <Button
                variant="stay"
                onClick={reset}
                className="luxury-cta h-auto min-h-12 w-full rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground"
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {error && step === "form" && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
    </div>
  );
}
