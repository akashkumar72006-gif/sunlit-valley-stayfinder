import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({ meta: [{ title: "Cancellation Policy — Sunlit Valley Homestay" }] }),
  component: () => (
    <PolicyPage
      title="Cancellation Policy"
      updated="12 November 2026"
      intro="Plans change, especially in the mountains. This policy explains how to cancel or change your reservation and what applies if you do not arrive."
      sections={[
        {
          heading: "1. Free cancellation",
          paragraphs: [
            "You may cancel your reservation free of charge at any time before your check-in date. There is no cancellation fee and no online payment to refund, because nothing is charged when you book.",
          ],
        },
        {
          heading: "2. How to cancel or change a booking",
          paragraphs: [
            "Call or WhatsApp us at +91 87917 63547 with your booking ID (it looks like SV-XXXXXXXX). We will confirm the cancellation or your new dates right away.",
            "You can also ask us to move your stay to different dates instead of cancelling — subject to room availability.",
          ],
        },
        {
          heading: "3. If you do not arrive",
          paragraphs: [
            "If you do not arrive on your check-in date and have not told us, we will hold the room until 11:00 AM the next morning. After that we may release the room for other guests.",
            "Please let us know as early as you can if your travel plans change — in a small homestay every room matters, and we would rather host you on other dates than lose you entirely.",
          ],
        },
        {
          heading: "4. Cancellations by us",
          paragraphs: [
            "In the rare event we cannot honour your reservation (for example, due to a road closure, natural event or damage to the room), we will tell you as soon as possible and help you find alternative dates or nearby accommodation.",
          ],
        },
      ]}
    />
  ),
});
