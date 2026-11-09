"use client";

import { useState } from "react";

export function LinkedInVideo({ activityId }: { activityId: string }) {
  const [loaded, setLoaded] = useState(false);
  if (!/^\d{15,25}$/.test(activityId)) return null;

  const embedUrl = `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}?compact=true`;
  const postUrl = `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}/`;

  return (
    <section aria-labelledby="linkedin-video-heading" className="px-6 pb-16">
      <h2 className="text-2xl font-medium tracking-tight" id="linkedin-video-heading">Event video</h2>
      <p className="mt-4 text-sm leading-6 text-neutral-700">This video is hosted by LinkedIn. Loading it connects your browser to LinkedIn.</p>
      {loaded ? <iframe allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen className="mt-5 aspect-video w-full rounded-2xl border border-neutral-200" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" src={embedUrl} title="LinkedIn event video" /> : <button className="font-button mt-5 rounded-full bg-neutral-950 px-6 py-3 text-sm text-white hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" onClick={() => setLoaded(true)} type="button">Load LinkedIn video</button>}
      <p className="mt-4 text-sm"><a className="underline underline-offset-4" href={postUrl} rel="noopener noreferrer" target="_blank">Watch on LinkedIn</a></p>
    </section>
  );
}
