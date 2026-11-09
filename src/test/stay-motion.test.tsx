import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useStayMotion } from "@/hooks/use-stay-motion";

afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function belowViewport() {
  const element = document.createElement("div");
  element.className = "reveal";
  element.getBoundingClientRect = () => ({ top: 2000, bottom: 2100, left: 0, right: 100, width: 100, height: 100, x: 0, y: 2000, toJSON: () => ({}) });
  document.body.append(element);
  return element;
}

describe("Stay motion safety", () => {
  it("reveals off-screen content when the observer is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    // Removing the property models browsers without the API, not an undefined constructor.
    Reflect.deleteProperty(window, "IntersectionObserver");
    const element = belowViewport();
    renderHook(() => useStayMotion());
    expect(element.classList.contains("reveal-pending")).toBe(false);
    expect(element.classList.contains("in")).toBe(true);
  });

  it("reveals a pending section as soon as it intersects", () => {
    let notify: IntersectionObserverCallback | undefined;
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) { notify = callback; }
      observe() {} unobserve() {} disconnect() {}
    });
    const element = belowViewport();
    renderHook(() => useStayMotion());
    expect(element.classList.contains("reveal-pending")).toBe(true);
    const bounds = element.getBoundingClientRect();
    act(() => notify?.([{ target: element, isIntersecting: true, boundingClientRect: bounds, intersectionRatio: 1, intersectionRect: bounds, rootBounds: null, time: 0 }], {} as IntersectionObserver));
    expect(element.classList.contains("reveal-pending")).toBe(false);
    expect(element.classList.contains("in")).toBe(true);
  });

  it("keeps every section visible for reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} } as unknown as MediaQueryList);
    const element = belowViewport();
    renderHook(() => useStayMotion());
    expect(element.classList.contains("reveal-pending")).toBe(false);
    expect(element.classList.contains("in")).toBe(true);
  });
});