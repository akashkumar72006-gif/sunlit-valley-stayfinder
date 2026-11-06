import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Index } from "@/routes/index";

// The page fades sections in as you scroll. Nothing may stay invisible: a section
// that never reveals reads as a blank block with no text on the live site.
describe("Section reveal", () => {
  it("reveals every section instead of leaving blank blocks on the page", () => {
    const { container } = render(<Index />);

    const hidden = [...container.querySelectorAll(".reveal")].filter(
      (el) => !el.classList.contains("in"),
    );

    expect(container.querySelectorAll(".reveal").length).toBeGreaterThan(10);
    expect(hidden).toHaveLength(0);
  });
});
