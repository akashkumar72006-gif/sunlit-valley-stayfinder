import { describe, expect, it } from "vitest";

import { site } from "@/content/site";

// Walk every string in the site content so a leftover placeholder can't hide.
function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

describe("Site content", () => {
  it("shows the confirmed check-in and check-out times", () => {
    const facts = Object.fromEntries(site.about.quickFacts.map((f) => [f.label, f.value]));
    expect(facts["Check-in"]).toBe("5:00 PM");
    expect(facts["Check-out"]).toBe("11:00 AM");
  });

  it("prices Mountain View Rooms at ₹900 per person per night", () => {
    expect(site.rooms.list.length).toBeGreaterThan(0);
    for (const room of site.rooms.list) {
      expect(room.name).toMatch(/Mountain View/);
      expect(room.price.some((t) => t.value.includes("₹900 per person per night"))).toBe(true);
    }
  });

  it("lists the confirmed facilities", () => {
    const items = site.facilities.groups.flatMap((g) => g.items).map((i) => i.toLowerCase());
    for (const facility of ["free wi-fi", "power backup", "bonfire", "parking", "geyser", "heater", "mountain view balcony"]) {
      expect(items).toContain(facility);
    }
  });

  it("keeps only the confirmed contact blocks", () => {
    expect(site.contact.blocks.map((b) => b.label)).toEqual(["Phone", "WhatsApp", "Address"]);
    expect(site.contact.blocks.every((b) => !b.value.includes("["))).toBe(true);
  });

  it("has no bracketed placeholder text left anywhere", () => {
    expect(stringsIn(site).filter((s) => s.includes("[") || s.includes("___"))).toEqual([]);
  });
});
