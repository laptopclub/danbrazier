import { createBlockRegistry } from "@laptopclub/foundation-ui";
import { RandomQuote } from "../components/random-quote";

export const siteBlockRegistry = createBlockRegistry({ randomQuoteBlock: RandomQuote as never });
