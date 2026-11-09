import { defineArrayMember, defineField, defineType } from "sanity";

export const highlightsBlock = defineType({
  name: "highlightsBlock",
  title: "Article highlights",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Highlights", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Introduction", type: "text", rows: 3 }),
    defineField({
      name: "articles",
      title: "Highlighted articles",
      description: "Select up to three articles and drag them into order. Leave empty to hide this section.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
      validation: (rule) => rule.max(3).unique()
    })
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Article highlights" }) }
});
