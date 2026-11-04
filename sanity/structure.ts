import { homePageId } from "@laptopclub/foundation-cms";
import type { StructureResolver } from "sanity/structure";

const draftHomePageId = `drafts.${homePageId}`;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .schemaType("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .title("Homepage")
        .schemaType("page")
        .child(S.document().schemaType("page").documentId(homePageId)),
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(
          S.documentTypeList("page")
            .title("Pages")
            .filter(
              "_type == $type && !(_id in [$homePageId, $draftHomePageId])",
            )
            .params({ draftHomePageId, homePageId, type: "page" }),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings", "page"].includes(item.getId() ?? ""),
      ),
    ]);
