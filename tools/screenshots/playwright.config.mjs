import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";

const TOOL_ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(TOOL_ROOT, "../..");
const ARTIFACT_ROOT = path.resolve(
  process.env.SCREENSHOT_ARTIFACT_DIR
    || path.join(REPOSITORY_ROOT, "artifacts/screenshots"),
);

export default defineConfig({
  testDir: TOOL_ROOT,
  testMatch: "capture.spec.mjs",
  outputDir: path.join(ARTIFACT_ROOT, "test-results"),
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: {
    timeout: 12_000,
  },
  reporter: [
    ["line"],
    ["json", { outputFile: path.join(ARTIFACT_ROOT, "playwright-results.json") }],
  ],
  use: {
    baseURL: process.env.UDREAM_BASE_URL || "http://127.0.0.1:8019/",
    browserName: "chromium",
    colorScheme: "light",
    locale: "ru-RU",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    screenshot: "off",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 8019 --bind 127.0.0.1",
    cwd: REPOSITORY_ROOT,
    url: "http://127.0.0.1:8019/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
