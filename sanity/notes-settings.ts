import { defineArrayMember, defineField, defineType } from "sanity";

export const notesSettings = defineType({
  name: "notesSettings",
  title: "Notes settings",
  type: "document",
  fields: [
    defineField({
      name: "featuredArticles",
      title: "Selected articles",
      description: "Choose up to five articles for the Notes sidebar, in display order.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
      validation: (rule) => rule.max(5).unique()
    })
  ],
  preview: { prepare: () => ({ title: "Notes settings" }) }
});
