import Link from "next/link";

const house = [
  ".....#.....",
  "....###....",
  "...#####...",
  "..###.###..",
  ".###...###.",
  "..##...##..",
  "..##...##..",
  "..##.#.##..",
  "..##.#.##..",
  "..#######..",
  "..........."
];

const horns = [
  "...........",
  "..##...##..",
  "..##...##..",
  "..##...##..",
  "..##...##..",
  "..#######..",
  ".########..",
  ".########..",
  "..######...",
  "...####....",
  "...####...."
];

export function PixelHomeLink() {
  return (
    <Link aria-label="Home" className="pixel-home-link inline-flex size-12 items-center justify-center rounded-md text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950" href="/">
      <svg aria-hidden="true" className="size-8" shapeRendering="crispEdges" viewBox="0 0 11 11">
        {house.flatMap((row, y) => [...row].map((pixel, x) => {
          const home = pixel === "#";
          const hand = horns[y]?.[x] === "#";
          if (!home && !hand) return null;
          const state = home && hand ? "shared" : home ? "house" : "horns";
          return <rect className={`pixel-home-${state}`} fill="currentColor" height="1" key={`${x}-${y}`} width="1" x={x} y={y} />;
        }))}
      </svg>
    </Link>
  );
}
