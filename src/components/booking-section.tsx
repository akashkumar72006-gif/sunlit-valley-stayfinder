import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, PartyPopper, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PRICE_PER_PERSON_PER_NIGHT,
  advanceForGuests,
  supabase,
  type RoomBooking,
} from "@/lib/supabase";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const rupees = (n: number) => fmt.format(n);

const today = () => new Date().toISOString().slice(0, 10);

type Step = "form" | "paying" | "confirmation";

function addDays(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string) {
  const ms = new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

export function BookingSection() {
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState(addDays(today(), 1));
  const [checkOut, setCheckOut] = useState(addDays(today(), 3));
  const [step, setStep] = useState<Step>("form");
  const [payMethod, setPayMethod] = useState<"upi" | "qr">("upi");
  const [booking, setBooking] = useState<RoomBooking | null>(null);
  const [error, setError] = useState("");

  const nights = Math.max(0, nightsBetween(checkIn, checkOut));
  const totalPrice = nights * guests * PRICE_PER_PERSON_PER_NIGHT;
  const advance = advanceForGuests(guests);
  const balance = Math.max(0, totalPrice - advance);
  const valid = guestName.trim().length > 1 && guestPhone.trim().length >= 10 && nights >= 1;

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: "sunlitvalley@upi",
      pn: "Sunlit Valley Homestay",
      am: String(advance),
      cu: "INR",
      tn: `Advance for ${guestName || "booking"} (${guests} guest${guests > 1 ? "s" : ""})`,
    });
    return `upi://pay?${params.toString()}`;
  }, [advance, guestName, guests]);

  async function confirmPayment() {
    setStep("paying");
    setError("");
    if (booking) {
      const { error: updErr } = await supabase
        .from("room_bookings")
        .update({ payment_status: "advance_paid" })
        .eq("id", booking.id);
      if (updErr) {
        setError("We couldn't record your payment. Please try again or contact us on WhatsApp.");
        setStep("paying");
        return;
      }
      setBooking({ ...booking, payment_status: "advance_paid" });
      return;
    }
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
        advance_amount: advance,
      })
      .select()
      .single();
    if (insErr || !data) {
      setError("We couldn't save your booking. Please try again or contact us on WhatsApp.");
      setStep("form");
      return;
    }
    setBooking(data);
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

  const shortBookingId = booking ? `SV-${booking.id.slice(0, 8).toUpperCase()}` : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      {/* FORM */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
        <h3 className="font-display text-2xl">Reserve your room</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your dates and guests — the price updates as you go. You pay only a small advance
          now to hold the room.
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
          disabled={!valid}
          onClick={() => setStep("paying")}
          className="luxury-cta mt-6 h-auto min-h-12 w-full rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pay Advance & Reserve Room
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
          <div className="border-t pt-3">
            <div className="flex justify-between gap-4">
              <dt className="font-semibold">Total stay price</dt>
              <dd className="font-display text-2xl text-primary">{rupees(totalPrice)}</dd>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-accent" /> Advance to pay
                now
              </dt>
              <dd className="font-display text-xl text-accent">{rupees(advance)}</dd>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {guests === 1
                ? "Fixed advance for solo guests."
                : "Fixed advance for 2 or more guests."}
            </p>
            <div className="mt-3 flex items-center justify-between gap-4 border-t pt-3">
              <dt className="text-muted-foreground">Balance at check-in</dt>
              <dd className="font-semibold">{rupees(balance)}</dd>
            </div>
          </div>
        </dl>
      </aside>

      {/* PAYMENT MODAL */}
      <Dialog
        open={step === "paying"}
        onOpenChange={(isOpen) => {
          if (!isOpen && !booking) setStep("form");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Pay advance to reserve</DialogTitle>
            <DialogDescription>
              Pay {rupees(advance)} now to hold the room. The remaining {rupees(balance)} is paid at
              check-in.
            </DialogDescription>
          </DialogHeader>

          {!booking ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-secondary p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                  Advance amount
                </p>
                <p className="mt-1 font-display text-4xl text-primary">{rupees(advance)}</p>
              </div>
              <div className="flex gap-2" role="tablist" aria-label="Payment method">
                <button
                  type="button"
                  role="tab"
                  aria-selected={payMethod === "upi"}
                  onClick={() => setPayMethod("upi")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${payMethod === "upi" ? "border-accent bg-accent/10 text-accent" : "hover:border-border"}`}
                >
                  <Smartphone aria-hidden="true" className="h-4 w-4" /> UPI app
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={payMethod === "qr"}
                  onClick={() => setPayMethod("qr")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${payMethod === "qr" ? "border-accent bg-accent/10 text-accent" : "hover:border-border"}`}
                >
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" /> QR code
                </button>
              </div>
              {payMethod === "upi" ? (
                <a
                  href={upiLink}
                  className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
                >
                  <Smartphone aria-hidden="true" className="h-4 w-4" /> Open UPI app to pay{" "}
                  {rupees(advance)}
                </a>
              ) : (
                <div className="rounded-lg border bg-card p-4 text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`}
                    alt={`QR code to pay ${rupees(advance)} advance`}
                    width={180}
                    height={180}
                    className="mx-auto"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Scan with any UPI app to pay {rupees(advance)}
                  </p>
                </div>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                variant="stay"
                onClick={confirmPayment}
                className="luxury-cta h-auto min-h-12 w-full rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground"
              >
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> I have paid — confirm
                reservation
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                This is a demo checkout. Confirming marks your room as reserved and records the
                advance as paid.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
                <PartyPopper aria-hidden="true" className="h-8 w-8 shrink-0 text-green-600" />
                <div>
                  <p className="font-display text-xl leading-tight">Room reserved!</p>
                  <p className="text-sm">Advance of {rupees(booking.advance_amount)} recorded.</p>
                </div>
              </div>
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
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Advance paid</dt>
                  <dd className="font-semibold text-green-700">
                    {rupees(booking.advance_amount)} — paid
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t pt-2">
                  <dt className="text-muted-foreground">Balance at check-in</dt>
                  <dd className="font-semibold">
                    {rupees(Math.max(0, booking.total_price - booking.advance_amount))}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                    <Loader2 aria-hidden="true" className="hidden" /> Reserved
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
    </div>
  );
}
