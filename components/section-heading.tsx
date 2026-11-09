import { Parallax } from "./parallax";

export function SectionHeading({ heading, backgroundLabel = heading }: { heading: string; backgroundLabel?: string }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 sm:-left-10 lg:-left-16">
        <Parallax className="whitespace-nowrap font-heading text-[clamp(6rem,20vw,16rem)] font-bold leading-none tracking-[-0.08em] text-neutral-950 opacity-[0.07]" speed={42}>{backgroundLabel}</Parallax>
      </div>
      <h2 className="font-heading relative z-10 text-4xl font-normal tracking-tight text-neutral-950 sm:text-5xl">{heading}</h2>
    </div>
  );
}
