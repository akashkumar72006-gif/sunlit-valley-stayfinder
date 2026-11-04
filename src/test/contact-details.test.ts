import { describe, expect, it } from "vitest";

import { site, telUrl, whatsappUrl } from "@/content/site";

describe("Contact details", () => {
  it("uses the confirmed phone number everywhere", () => {
    expect(site.phoneDisplay).toBe("+91 87917 63547");
    expect(site.phoneTel).toBe("+918791763547");
    expect(site.whatsapp).toBe("918791763547");
    expect(telUrl).toBe("tel:+918791763547");
  });

  it("opens a direct WhatsApp chat with the exact enquiry message", () => {
    expect(site.whatsappMessage).toBe("Hello! I want to inquire about booking at Sunlit Valley Homestay.");
    expect(whatsappUrl).toBe(
      "https://wa.me/918791763547?text=Hello!%20I%20want%20to%20inquire%20about%20booking%20at%20Sunlit%20Valley%20Homestay.",
    );
  });
});
