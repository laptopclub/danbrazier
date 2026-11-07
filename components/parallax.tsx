"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  direction?: "down" | "up";
  speed?: number;
};

export function Parallax({ children, className, direction = "up", speed = 28 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, ((window.innerHeight / 2) - (rect.top + rect.height / 2)) / window.innerHeight));
      element.style.transform = `translate3d(0, ${progress * speed * (direction === "up" ? -1 : 1)}px, 0)`;
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => { if (frame) window.cancelAnimationFrame(frame); window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); element.style.transform = ""; };
  }, [direction, speed]);

  return <div aria-hidden="true" className={className} ref={ref}>{children}</div>;
}
