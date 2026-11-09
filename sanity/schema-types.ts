import { createSchemaTypes } from "@laptopclub/foundation-cms";
import { randomQuoteBlock } from "./random-quote-block";
import { notesSettings } from "./notes-settings";
import { highlightsBlock } from "./highlights-block";

export const siteSchemaTypes = createSchemaTypes({
  additionalPageBlockTypes: ["randomQuoteBlock", "highlightsBlock"],
  additionalTypes: [randomQuoteBlock, notesSettings, highlightsBlock]
});
