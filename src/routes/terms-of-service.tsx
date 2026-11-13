import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({ meta: [{ title: "Terms of Service — Sunlit Valley Homestay" }] }),
  component: () => (
    <PolicyPage
      title="Terms of Service"
      updated="12 November 2026"
      intro="These terms cover stays booked through this website at Sunlit Valley Homestay, Saree Village, Uttarakhand. Making a reservation means you accept these terms."
      sections={[
        {
          heading: "1. Reservations",
          paragraphs: [
            "A reservation made on this website holds the Mountain View Room for your chosen dates. Reservations are confirmed instantly and are subject to availability.",
            "Each booking covers up to 6 guests. The room is priced per person per night, and the total shown when you book is the amount payable for your stay.",
          ],
        },
        {
          heading: "2. Payment",
          paragraphs: [
            "No payment is taken online. The full amount for your stay is paid at the homestay when you check in. We accept cash and UPI.",
            "The room rate starts at ₹900 per person per night. Any extras you request — meals, taxi pickups, treks or bike rentals — are arranged and settled separately.",
          ],
        },
        {
          heading: "3. Check-in and check-out",
          paragraphs: [
            "Check-in is from 5:00 PM and check-out is by 11:00 AM. Early arrival or late departure may be possible on request — message us before you travel.",
          ],
        },
        {
          heading: "4. During your stay",
          paragraphs: [
            "This is a family home, and we ask guests to treat it as such. Smoking is not allowed inside the rooms. Please keep noise reasonable after 10:00 PM out of respect for other guests and the village.",
            "Guests are responsible for any damage caused to the property during their stay.",
          ],
        },
        {
          heading: "5. Liability",
          paragraphs: [
            "Saree Village is in the Himalayan foothills. Trails, viewpoints and village paths can be uneven and steep, and weather can change quickly. Guests take part in all activities at their own risk.",
            "We are not liable for loss of personal belongings, travel delays, or events beyond our reasonable control. We recommend having your own travel insurance.",
          ],
        },
        {
          heading: "6. Changes to these terms",
          paragraphs: [
            "We may update these terms from time to time. The version published on this page at the time of your booking is the one that applies to your stay.",
          ],
        },
      ]}
    />
  ),
});
