import { useEffect, useRef } from "react";

export function useStayMotion() {
  const heroRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = [...document.querySelectorAll<HTMLElement>(".reveal")];
    const reveal = (element: HTMLElement) => {
      element.classList.remove("reveal-pending");
      element.classList.add("in");
    };
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          }
        }), { rootMargin: "0px 0px 80px 0px", threshold: 0 })
      : null;
    elements.forEach((element) => {
      if (motion.matches || !observer || element.getBoundingClientRect().top <= window.innerHeight) reveal(element);
      else {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      elements.forEach((element) => {
        if (motion.matches || element.getBoundingClientRect().top <= window.innerHeight) reveal(element);
      });
      heroRef.current?.style.setProperty("--parallax-offset", motion.matches ? "0px" : `${Math.min(window.scrollY * 0.14, 100)}px`);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", onScroll);
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", onScroll);
      elements.forEach(reveal);
    };
  }, []);
  return heroRef;
}