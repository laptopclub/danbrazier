import { defineArrayMember, defineField, defineType } from "sanity";

export const randomQuoteBlock = defineType({
  name: "randomQuoteBlock",
  title: "Random quote",
  type: "object",
  fields: [
    defineField({ name: "staggered", title: "Offset quote lines", type: "boolean", initialValue: true }),
    defineField({ name: "quotes", title: "Quotes", type: "array", validation: (rule) => rule.min(1).required(), of: [defineArrayMember({ type: "object", fields: [defineField({ name: "text", title: "Quote", type: "text", rows: 4, validation: (rule) => rule.required() }), defineField({ name: "author", title: "Attribution", type: "string" })] })] })
  ],
  preview: { select: { title: "quotes.0.text" }, prepare: ({ title }) => ({ title: title || "Random quote" }) }
});
