import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: { persistSession: false },
});

export type RoomBooking = {
  id: string;
  guest_name: string;
  guests: number;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  advance_amount: number;
  payment_status: "pending" | "advance_paid";
  status: "reserved" | "cancelled";
  created_at: string;
};

export const PRICE_PER_PERSON_PER_NIGHT = 900;

export function advanceForGuests(guests: number): number {
  return guests === 1 ? 500 : 1000;
}
