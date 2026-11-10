import { visionTool } from "@sanity/vision";
import { defineConfig, type Template } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { resolve } from "./sanity/presentation";
import { siteSchemaTypes } from "./sanity/schema-types";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const title = process.env.NEXT_PUBLIC_SITE_NAME ?? "Dan Brazier";
const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3333";

export default defineConfig({
  basePath: "/studio",
  dataset,
  name: "danbrazier",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable"
        }
      },
      resolve
    }),
    visionTool(),
    unsplashImageAsset()
  ],
  projectId,
  schema: { types: siteSchemaTypes },
  templates: (templates: Template[]) => templates.filter((template) => !["siteSettings", "notesSettings"].includes(template.schemaType)),
  title,
  document: {
    actions: (actions, context) => {
      if (!["siteSettings", "notesSettings"].includes(context.schemaType)) {
        return actions;
      }

      return actions.filter((action) => !["delete", "duplicate"].includes(action.action ?? ""));
    }
  }
});
