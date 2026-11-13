import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/policy-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Sunlit Valley Homestay" }] }),
  component: () => (
    <PolicyPage
      title="Privacy Policy"
      updated="12 November 2026"
      intro="Sunlit Valley Homestay ('we', 'us') respects your privacy. This policy explains what information we collect when you make a booking enquiry or reservation on this website, and how we use it."
      sections={[
        {
          heading: "1. Information we collect",
          paragraphs: [
            "When you make a reservation we collect the details you enter: your name, your phone number, your check-in and check-out dates, and the number of guests in your party.",
            "We do not collect card or bank details on this website. Payments are taken in person at the homestay, not online.",
          ],
        },
        {
          heading: "2. How we use your information",
          paragraphs: [
            "We use your booking details only to manage your stay: to hold your room, to contact you about your arrival, and to welcome you when you check in.",
            "We may message you on WhatsApp or by phone about your booking. We will not send you marketing messages unless you ask us to.",
          ],
        },
        {
          heading: "3. What we do not do",
          paragraphs: [
            "We do not sell, rent or trade your personal information to anyone.",
            "We do not use your details for advertising, and we do not run advertising trackers on this website.",
          ],
        },
        {
          heading: "4. How long we keep your information",
          paragraphs: [
            "We keep booking records for as long as needed to run the homestay and meet any legal record-keeping duties. If you would like your booking details deleted, contact us and we will remove them.",
          ],
        },
        {
          heading: "5. Your choices",
          paragraphs: [
            "You can ask us at any time to see, correct or delete the personal details we hold about you. Call or WhatsApp +91 87917 63547 and we will take care of it.",
          ],
        },
      ]}
    />
  ),
});
