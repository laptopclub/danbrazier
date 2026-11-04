import { writeFileSync } from "node:fs";

const imageIds = [
  "image-a8fd6cc0631c87b2b89e9762ea22748ab77175b2-900x900-jpg",
  "image-d23f19c4923fd644f2118064d946600bac472974-900x900-jpg",
  "image-258bf58f04bb9e6c6f74e7a96c915fec5189aded-900x900-jpg",
  "image-bc53d342c8b25de23309a750efd6536a5e7a3595-900x900-jpg",
  "image-ce9ddca2ab4380a80777ea81590d788fdef92791-900x900-jpg",
  "image-61a4aa162d3a2753b83c99035c6fdcd128918cce-900x900-jpg"
];

function key(value) {
  return value.replace(/[^a-z0-9]/gi, "").slice(0, 12);
}

function paragraph(text) {
  return {
    _key: key(text),
    _type: "block",
    children: [{ _key: `${key(text)}text`, _type: "span", marks: [], text }],
    markDefs: [],
    style: "normal"
  };
}

function contentBlock(content, title) {
  return { _key: key(title ?? content[0]?.children[0]?.text ?? "content"), _type: "richTextBlock", content, title };
}

function image(asset) {
  return { _type: "image", asset: { _ref: asset, _type: "reference" } };
}

const pages = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    description: "Dan Brazier - strategy, craft and execution. Engineering, music, photography, writing and personal projects.",
    logoText: "Dan Brazier",
    socialLinks: [
      { _key: "github", _type: "link", href: "https://github.com/danbrazieruk", label: "GitHub", linkType: "external", openInNewTab: true },
      { _key: "linkedin", _type: "link", href: "https://www.linkedin.com/in/danbrazieruk", label: "LinkedIn", linkType: "external", openInNewTab: true }
    ],
    title: "Dan Brazier"
  },
  {
    _id: "page.home",
    _type: "page",
    blocks: [
      { _key: "hero", _type: "heroBlock", backgroundStyle: "light", body: "", eyebrow: "Strategy / Craft / Execution", layout: "textOnly", textAlign: "left", title: "Things & stuff", typographyScale: "editorial", verticalSpacing: "tall" },
      contentBlock([paragraph("Hey there, I'm Dan."), paragraph("I love finding out how things work and I'm driven by the details. By day I work with commerce solutions. Outside of that I play music, take photographs, and tinker with personal projects.")]),
      {
        _key: "everything",
        _type: "featureGridBlock",
        background: "plain",
        cardStyle: "outlined",
        columns: "3",
        features: [
          { _key: "rebuild", _type: "object", body: "Why I moved off an ageing template and onto a clean, CMS-driven stack.", title: "Rebuilding my site with Next.js and Storyblok" },
          { _key: "street", _type: "object", body: "A handful of frames from recent walks.", image: image(imageIds[0]), title: "Street & light - a small set" },
          { _key: "acoustic", _type: "object", body: "A stripped-back solo acoustic set. Just guitar and vocals.", title: "Live session - solo acoustic" },
          { _key: "project", _type: "object", body: "A short summary of the problem, my role, and the outcome.", title: "Example Project" }
        ],
        spacing: "standard",
        title: "Everything"
      }
    ],
    title: "Home"
  },
  {
    _id: "page.photography-street-and-light",
    _type: "page",
    blocks: [
      { _key: "hero", _type: "heroBlock", backgroundStyle: "light", body: "A handful of frames from recent walks.", image: image(imageIds[0]), layout: "imageRight", title: "Street & light - a small set" },
      contentBlock([paragraph("Photography is where I slow down. A few recent frames below.")]),
      { _key: "gallery", _type: "galleryBlock", columns: "3", images: imageIds.map((asset) => image(asset)), title: "Street & light" }
    ],
    seo: { description: "A handful of frames from recent walks.", title: "Street & light - a small set" },
    slug: { _type: "slug", current: "photography/street-and-light" },
    title: "Street & light - a small set"
  },
  {
    _id: "page.music-solo-acoustic-session",
    _type: "page",
    blocks: [
      { _key: "hero", _type: "heroBlock", backgroundStyle: "light", body: "A stripped-back solo acoustic set. Just guitar and vocals.", layout: "textOnly", title: "Live session - solo acoustic" },
      contentBlock([paragraph("A recent solo acoustic session. I play in a band and also perform solo - this is the quieter side of things.")]),
      { _key: "video", _type: "ctaBlock", body: "Watch the acoustic session on YouTube.", primaryAction: { _key: "watch", _type: "link", href: "https://www.youtube.com/watch?v=jfKfPfyJRdk", label: "Watch on YouTube", linkType: "external", openInNewTab: true }, title: "Acoustic session" }
    ],
    seo: { description: "A stripped-back solo acoustic set. Just guitar and vocals.", title: "Live session - solo acoustic" },
    slug: { _type: "slug", current: "music/solo-acoustic-session" },
    title: "Live session - solo acoustic"
  },
  {
    _id: "page.work-example-project",
    _type: "page",
    blocks: [
      { _key: "hero", _type: "heroBlock", backgroundStyle: "light", body: "A short summary of the problem, my role, and the outcome.", layout: "textOnly", title: "Example Project" },
      contentBlock([paragraph("Acme Co. - Lead Engineer - 2025")]),
      contentBlock([paragraph("Quote here"), paragraph("Me, probably")], "Quote"),
      contentBlock([paragraph("This is a placeholder case study. Replace it with a real project: the challenge, your approach, and the results.")])
    ],
    seo: { description: "A short summary of the problem, my role, and the outcome.", title: "Example Project" },
    slug: { _type: "slug", current: "work/example-project" },
    title: "Example Project"
  },
  {
    _id: "page.personal-rebuilding-my-site",
    _type: "page",
    blocks: [
      { _key: "hero", _type: "heroBlock", backgroundStyle: "light", body: "Why I moved off an ageing template and onto a clean, CMS-driven stack.", layout: "textOnly", title: "Rebuilding my site with Next.js and Storyblok" },
      contentBlock([paragraph("I rebuilt this site on Next.js 15, Tailwind CSS and Storyblok. The goal was simple: keep it lightweight, easy to write in, and easy to extend."), paragraph("Storyblok gives me a proper editing experience for posts and case studies, while Next.js keeps the front end fast and flexible.")])
    ],
    seo: { description: "Why I moved off an ageing template and onto a clean, CMS-driven stack.", title: "Rebuilding my site with Next.js and Storyblok" },
    slug: { _type: "slug", current: "personal/rebuilding-my-site" },
    title: "Rebuilding my site with Next.js and Storyblok"
  }
];

const output = process.argv[2] ?? "/tmp/danbrazier-sanity-import.ndjson";
writeFileSync(output, `${pages.map((document) => JSON.stringify(document)).join("\n")}\n`);
console.log(`Wrote ${pages.length} documents to ${output}`);
