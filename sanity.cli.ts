import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "zul5551z";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineCliConfig({
  api: {
    dataset,
    projectId
  },
  deployment: {
    appId: "ki8e65v7o87n8931c7jhzls8"
  },
  typegen: {
    generates: "./sanity.types.ts",
    path: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
    schema: "./schema.json"
  }
});
