import { Parallax } from "./parallax";

type Quote = { author?: string; text?: string };

type RandomQuoteBlock = { quotes?: Quote[]; staggered?: boolean };

// A restrained offset keeps the quote centred while giving each line a little movement.
const offsets = ["-12%", "-6%", "6%", "12%", "-9%", "9%"];

function lines(text: string): string[] {
  if (text.includes("\n")) return text.split("\n").map((line) => line.trim()).filter(Boolean);
  const words = text.split(/\s+/);
  const target = Math.min(4, Math.max(2, Math.round(text.length / 22)));
  const limit = Math.ceil(text.length / target);
  return words.reduce<string[]>((result, word) => {
    const current = result.at(-1);
    if (!current || `${current} ${word}`.length > limit) result.push(word);
    else result[result.length - 1] = `${current} ${word}`;
    return result;
  }, []);
}

export function RandomQuote({ block }: { block: RandomQuoteBlock }) {
  const quotes = (block.quotes ?? []).map((quote) => ({ quote, lines: lines(quote.text?.trim() ?? "") })).filter(({ lines: quoteLines }) => quoteLines.length);
  if (!quotes.length) return null;
  const selected = quotes[Math.floor(Math.random() * quotes.length)]!;
  const { quote, lines: quoteLines } = selected;

  return <section className="relative overflow-x-clip overflow-y-visible px-6 py-20 sm:py-28"><div aria-hidden="true" className="pointer-events-none absolute right-[-0.12em] top-0 z-0 -translate-y-[25%]"><Parallax className="select-none font-serif text-[clamp(14rem,34vw,30rem)] leading-none text-neutral-100" direction="down" speed={42}>”</Parallax></div><div className="relative z-10 mx-auto max-w-7xl text-center"><blockquote>{block.staggered !== false ? <div className="text-3xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">{quoteLines.map((line, index) => <span className="block" key={`${line}-${index}`} style={{ transform: `translateX(${index ? offsets[Math.floor(Math.random() * offsets.length)] : "0%"})` }}>{line}</span>)}</div> : <p className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">“{quote.text}”</p>}{quote.author ? <cite className="font-quote-attribution mt-10 block not-italic text-neutral-500">{quote.author}</cite> : null}</blockquote></div></section>;
}
