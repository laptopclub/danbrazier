import { createSchemaTypes } from "@laptopclub/foundation-cms";
import { randomQuoteBlock } from "./random-quote-block";

export const siteSchemaTypes = createSchemaTypes({
  additionalPageBlockTypes: ["randomQuoteBlock"],
  additionalTypes: [randomQuoteBlock]
});
