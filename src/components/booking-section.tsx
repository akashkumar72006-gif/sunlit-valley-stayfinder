import { useEffect, useRef, useState } from "react";
import { BadgeCheck, CalendarCheck2, Check, Loader2 } from "lucide-react";
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
  supabase,
  type RoomAvailability,
  type RoomBooking,
} from "@/lib/supabase";

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
  const [rooms, setRooms] = useState<RoomAvailability[] | null>(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [booking, setBooking] = useState<RoomBooking | null>(null);
  const [bookedRoomNames, setBookedRoomNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const availRequestId = useRef(0);

  const nights = Math.max(0, nightsBetween(checkIn, checkOut));
  const totalPrice = nights * guests * PRICE_PER_PERSON_PER_NIGHT;
  const selectedCapacity = (rooms ?? [])
    .filter((r) => selectedRoomIds.includes(r.id))
    .reduce((sum, r) => sum + r.max_guests, 0);
  const someRoomAvailable = (rooms ?? []).some((r) => r.available);
  const availabilityChecked = rooms !== null;
  const noRoomsAtAll = availabilityChecked && rooms.length > 0 && !someRoomAvailable;
  const valid =
    guestName.trim().length > 1 &&
    guestPhone.trim().length >= 10 &&
    nights >= 1 &&
    selectedRoomIds.length > 0;
  const shortBookingId = booking ? `SV-${booking.id.slice(0, 8).toUpperCase()}` : "";

  // Real-time availability: every time the dates change, re-check the 4 rooms.
  useEffect(() => {
    if (nights < 1) return;
    const requestId = ++availRequestId.current;
    setChecking(true);
    supabase
      .rpc("available_rooms", { p_check_in: checkIn, p_check_out: checkOut })
      .then(({ data, error: rpcErr }) => {
        if (requestId !== availRequestId.current) return;
        if (rpcErr || !data) {
          setRooms(null);
          setError("We couldn't check room availability. Please try again.");
        } else {
          const list = data as RoomAvailability[];
          setRooms(list);
          setError("");
          setSelectedRoomIds((prev) =>
            prev.filter((id) => list.some((r) => r.id === id && r.available)),
          );
        }
        setChecking(false);
      })
      .catch(() => {
        if (requestId !== availRequestId.current) return;
        setRooms(null);
        setChecking(false);
        setError("We couldn't check room availability. Please try again.");
      });
  }, [checkIn, checkOut, nights]);

  function toggleRoom(id: string) {
    setSelectedRoomIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  async function confirmReservation() {
    setStep("confirming");
    setError("");
    const { data, error: rpcErr } = await supabase.rpc("create_booking", {
      p_guest_name: guestName.trim(),
      p_guest_phone: guestPhone.trim(),
      p_guests: guests,
      p_check_in: checkIn,
      p_check_out: checkOut,
      p_room_ids: selectedRoomIds,
    });
    if (rpcErr || !data) {
      const reason = (rpcErr as { message?: string } | null)?.message ?? "";
      setError(
        reason.includes("NO_ROOMS_AVAILABLE")
          ? "Sorry! No rooms available — someone just booked one of those rooms. Please pick different dates or rooms."
          : "We couldn't save your reservation. Please try again or contact us on WhatsApp.",
      );
      setStep("form");
      const { data: fresh } = await supabase.rpc("available_rooms", {
        p_check_in: checkIn,
        p_check_out: checkOut,
      });
      if (fresh) setRooms(fresh as RoomAvailability[]);
      return;
    }
    const names = (rooms ?? []).filter((r) => selectedRoomIds.includes(r.id)).map((r) => r.name);
    setBooking(data as RoomBooking);
    setBookedRoomNames(names);
    setStep("confirmation");
  }

  function reset() {
    setStep("form");
    setBooking(null);
    setBookedRoomNames([]);
    setError("");
    setGuestName("");
    setGuestPhone("");
    setGuests(2);
    setSelectedRoomIds([]);
    setCheckIn(addDays(today(), 1));
    setCheckOut(addDays(today(), 3));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      {/* FORM */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
        <h3 className="font-display text-2xl">Reserve your room</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your dates to see which of our rooms are free, then pick one or more rooms. Confirm
          directly and pay at the homestay when you arrive.
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

        {/* ROOM PICKER */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Choose your room{checkIn && checkOut ? ` · ${checkIn} → ${checkOut}` : ""}
          </p>
          {checking && !rooms && (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Checking which rooms
              are free…
            </p>
          )}
          {rooms && !noRoomsAtAll && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {rooms.map((room) => {
                const selected = selectedRoomIds.includes(room.id);
                return (
                  <button
                    key={room.id}
                    type="button"
                    disabled={!room.available}
                    aria-pressed={selected}
                    onClick={() => toggleRoom(room.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition duration-300 ${
                      !room.available
                        ? "cursor-not-allowed border-border bg-secondary/50 opacity-60"
                        : selected
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border hover:border-accent/60"
                    }`}
                  >
                    <span>
                      <span className="block font-semibold">{room.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        Sleeps up to {room.max_guests}
                      </span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border"
                      }`}
                    >
                      {room.available ? (
                        selected ? (
                          <Check aria-hidden="true" className="h-4 w-4" />
                        ) : null
                      ) : (
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Full
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {noRoomsAtAll && (
            <div
              role="status"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 p-5 text-center"
            >
              <p className="font-display text-xl text-red-900">Sorry! No rooms available</p>
              <p className="mt-1 text-sm text-red-800/80">
                All our rooms are booked for {checkIn} → {checkOut}. Please try different dates, or
                message us on WhatsApp — we may be able to help.
              </p>
            </div>
          )}
          {selectedRoomIds.length > 0 && selectedCapacity < guests && (
            <p className="mt-2 text-xs text-red-700">
              Your selection sleeps {selectedCapacity} — add another room for {guests} guests.
            </p>
          )}
        </div>

        <Button
          variant="stay"
          disabled={!valid || step === "confirming" || !availabilityChecked || checking}
          onClick={confirmReservation}
          className="luxury-cta mt-6 h-auto min-h-12 w-full rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarCheck2 aria-hidden="true" className="h-4 w-4" />
          {step === "confirming" ? "Confirming your reservation…" : "Confirm Reservation"}
        </Button>
        {!valid && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Fill your name, a valid phone number, dates and at least one room to continue.
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
            <dt className="text-muted-foreground">Rooms selected</dt>
            <dd className="font-semibold">{selectedRoomIds.length || "—"}</dd>
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
                  <dt className="text-muted-foreground">
                    Room{bookedRoomNames.length > 1 ? "s" : ""}
                  </dt>
                  <dd className="text-right font-semibold">{bookedRoomNames.join(", ")}</dd>
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
