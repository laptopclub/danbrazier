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
      description: "Select and drag articles into the order they should appear. Leave empty to hide this section.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
      validation: (rule) => rule.max(6).unique()
    })
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Article highlights" }) }
});
