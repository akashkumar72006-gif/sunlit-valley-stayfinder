import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Index } from "@/routes/index";
import { site, whatsappUrl } from "@/content/site";

const EXACT_WA_LINK =
  "https://wa.me/918791763547?text=Hello!%20I%20want%20to%20inquire%20about%20booking%20at%20Sunlit%20Valley%20Homestay.";

describe("WhatsApp enquiry buttons", () => {
  it("every WhatsApp button uses the exact chat link and opens in a new tab", () => {
    const { container } = render(<Index />);
    const anchors = [...container.querySelectorAll('a[href^="https://wa.me"]')];

    expect(anchors.length).toBeGreaterThanOrEqual(6);
    for (const a of anchors) {
      expect(a.getAttribute("href")).toBe(EXACT_WA_LINK);
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("phone and WhatsApp content blocks point at the confirmed number", () => {
    const { container } = render(<Index />);
    const tels = [...container.querySelectorAll('a[href="tel:+918791763547"]')];
    expect(tels.length).toBeGreaterThanOrEqual(3);
    expect(site.whatsappChatUrl).toBe(EXACT_WA_LINK);
    expect(whatsappUrl).toBe(EXACT_WA_LINK);
  });
});
