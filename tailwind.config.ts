import foundationPreset from "@laptopclub/foundation-config/tailwind/preset";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@laptopclub/foundation-ui/dist/**/*.{js,mjs}"
  ],
  presets: [foundationPreset],
  plugins: [typography]
} satisfies Config;

export default config;
