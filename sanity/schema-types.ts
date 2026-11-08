import { createSchemaTypes } from "@laptopclub/foundation-cms";
import { randomQuoteBlock } from "./random-quote-block";
import { notesSettings } from "./notes-settings";

export const siteSchemaTypes = createSchemaTypes({
  additionalPageBlockTypes: ["randomQuoteBlock"],
  additionalTypes: [randomQuoteBlock, notesSettings]
});
