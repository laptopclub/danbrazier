"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ImageParallaxProps = { children: ReactNode; className?: string };

export function ImageParallax({ children, className }: ImageParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const images = Array.from(container.querySelectorAll<HTMLImageElement>("[data-parallax-frame] img, [data-parallax-body] .prose figure img"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const clear = () => images.forEach((image) => { image.style.transform = ""; });
    const update = () => {
      frame = 0;
      if (media.matches) { clear(); return; }
      for (const image of images) {
        const clipped = image.closest<HTMLElement>("[data-parallax-frame]");
        const anchor = clipped ?? image.closest<HTMLElement>("figure");
        if (!anchor) continue;
        const rect = anchor.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / ((window.innerHeight + rect.height) / 2)));
        const distance = progress * (clipped ? Math.min(32, rect.height * 0.11) : 10);
        image.style.transform = `translate3d(0, ${distance.toFixed(2)}px, 0)${clipped ? " scale(1.25)" : ""}`;
      }
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onMotionChange = () => { if (media.matches) clear(); else requestUpdate(); };
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    media.addEventListener("change", onMotionChange);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      media.removeEventListener("change", onMotionChange);
      clear();
    };
  }, []);

  return <div className={className} ref={ref}>{children}</div>;
}
