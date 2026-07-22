import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOOL_ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(TOOL_ROOT, "../..");
const artifactRoot = path.resolve(
  process.env.SCREENSHOT_ARTIFACT_DIR
    || path.join(REPOSITORY_ROOT, "artifacts/screenshots"),
);
const expectedSuffix = path.join("artifacts", "screenshots");

if (!artifactRoot.endsWith(expectedSuffix)) {
  throw new Error(
    `Refusing to clean unexpected artifact directory: ${artifactRoot}`,
  );
}

fs.rmSync(artifactRoot, { recursive: true, force: true });
fs.mkdirSync(path.join(artifactRoot, "images"), { recursive: true });
fs.mkdirSync(path.join(artifactRoot, "entries"), { recursive: true });

console.log(`Prepared screenshot artifact directory: ${artifactRoot}`);
