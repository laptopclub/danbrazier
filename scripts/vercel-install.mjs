import { spawnSync } from "node:child_process";
import { chmodSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const token = process.env.NPM_TOKEN;

if (!token) {
  throw new Error("NPM_TOKEN is required to install private Foundation packages");
}

const npmrcPath = join(homedir(), ".npmrc");

writeFileSync(
  npmrcPath,
  `@laptopclub:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${token}\nalways-auth=true\n`,
  { mode: 0o600 }
);
chmodSync(npmrcPath, 0o600);

const result = spawnSync("pnpm", ["install", "--frozen-lockfile"], {
  env: process.env,
  stdio: "inherit"
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
