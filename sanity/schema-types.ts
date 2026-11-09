import { article, createSchemaTypes } from "@laptopclub/foundation-cms";
import { defineField } from "sanity";
import { randomQuoteBlock } from "./random-quote-block";
import { notesSettings } from "./notes-settings";
import { highlightsBlock } from "./highlights-block";

const siteArticle = {
  ...article,
  fields: [
    ...article.fields.map((field) => field.name === "coverImage" ? { ...field, title: "Primary image", description: "Optional. If empty, the first image in the article body is used for cards and highlights." } : field),
    defineField({
      name: "linkedinVideoActivityId",
      title: "LinkedIn video activity ID",
      type: "string",
      description: "Optional numeric activity ID for a public LinkedIn video. Visitors choose whether to load it.",
      validation: (rule) => rule.regex(/^\d{15,25}$/, { name: "LinkedIn activity ID" }).error("Enter the numeric LinkedIn activity ID only.")
    })
  ]
};

export const siteSchemaTypes = createSchemaTypes({
  additionalPageBlockTypes: ["randomQuoteBlock", "highlightsBlock"],
  additionalTypes: [randomQuoteBlock, notesSettings, highlightsBlock]
}).map((type) => type.name === "article" ? siteArticle : type);
