"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Result = { slug: string; title: string; excerpt: string };
type SearchState = "idle" | "loading" | "ready" | "error";

export function ArticleSearch() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [state, setState] = useState<SearchState>("idle");

  useEffect(() => {
    if (!open || query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setState("loading");
      try {
        const response = await fetch("/api/search", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: query.trim() }), signal: controller.signal });
        if (!response.ok) throw new Error("Search unavailable");
        const data: { results: Result[] } = await response.json();
        setResults(data.results);
        setState("ready");
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [open, query]);

  function showSearch() {
    dialogRef.current?.showModal();
    setOpen(true);
    inputRef.current?.focus();
  }

  function closeSearch() {
    dialogRef.current?.close();
  }

  function resetSearch() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setState("idle");
  }

  return <><button aria-haspopup="dialog" className="font-button inline-flex min-h-12 items-center gap-2 text-base text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950" onClick={showSearch} type="button"><i aria-hidden="true" className="bi bi-search" />Search</button><dialog aria-labelledby="search-title" className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-2xl backdrop:bg-neutral-950/60 sm:p-8" onClose={resetSearch} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeSearch(); } }} ref={dialogRef}><div className="flex items-center justify-between gap-6"><h2 className="text-2xl font-medium" id="search-title">Search notes</h2><button aria-label="Close search" className="flex size-11 items-center justify-center rounded-md text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950" onClick={closeSearch} type="button"><i aria-hidden="true" className="bi bi-x-lg" /></button></div><label className="mt-6 block text-sm font-medium" htmlFor="article-search-input">Search articles</label><input autoComplete="off" className="mt-2 w-full rounded-lg border border-neutral-400 bg-white px-4 py-3 text-base text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950" id="article-search-input" maxLength={120} onChange={(event) => { setQuery(event.target.value); setResults([]); setState("idle"); }} placeholder="Search notes" ref={inputRef} type="search" value={query} /><div aria-live="polite" aria-atomic="true" className="mt-6"><p className="text-sm text-neutral-600">{query.trim().length < 2 ? "Enter at least two characters to search." : state === "loading" ? "Searching…" : state === "error" ? "Search is temporarily unavailable. Please try again." : state === "ready" ? `${results.length} ${results.length === 1 ? "result" : "results"}` : ""}</p>{state === "ready" && results.length ? <ul className="mt-4 max-h-[50vh] space-y-4 overflow-y-auto">{results.map((result) => <li className="border-t border-neutral-200 pt-4" key={result.slug}><Link className="font-heading-mono text-base text-neutral-950 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" href={`/notes/${result.slug}`} onClick={closeSearch}>{result.title}</Link>{result.excerpt ? <p className="mt-2 text-sm leading-6 text-neutral-600">{result.excerpt}</p> : null}</li>)}</ul> : null}</div></dialog></>;
}
