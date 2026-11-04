"use client";

import Link from "next/link";
import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool) {
    return null;
  }

  return (
    <Link
      className="fixed bottom-4 right-4 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
      href="/api/draft-mode/disable"
    >
      Disable Draft Mode
    </Link>
  );
}
