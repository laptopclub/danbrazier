import { readFile, writeFile } from "node:fs/promises";

const filePath = new URL("../sanity.types.ts", import.meta.url);
const content = await readFile(filePath, "utf8");
const marker = "\n// Query TypeMap\n";
const markerIndex = content.indexOf(marker);

if (markerIndex !== -1) {
  await writeFile(filePath, `${content.slice(0, markerIndex)}\n`, "utf8");
}
