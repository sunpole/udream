#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const EXPECTED_PLAYWRIGHT_VERSION = "1.61.1";
const EXPECTED_TOOL_VERSION = "23.8.7";
const EXPECTED_CAPTURE_SCRIPT = "node prepare-artifacts.mjs && playwright test --config=playwright.config.mjs";
const REQUIRED_SCENARIOS = new Set([
  "homepage-desktop",
  "russian-alias-mobile",
  "search-water-desktop",
  "search-water-mobile",
]);
const ASSERTION_ACTIONS = new Set([
  "assertCountAtLeast",
  "assertFirstText",
  "assertText",
  "assertVisible",
]);
const ALLOWED_ACTIONS = new Set([
  ...ASSERTION_ACTIONS,
  "click",
  "clickIfVisible",
  "fill",
  "press",
  "scrollIntoView",
  "waitFor",
  "waitForTimeout",
]);

function fail(message) {
  throw new Error(`Screenshot tooling: ${message}`);
}

async function requireFile(root, relativePath) {
  await access(path.join(root, relativePath));
}

async function readText(root, relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function readJson(root, relativePath) {
  const source = await readText(root, relativePath);
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
  }
}

function validateScenario(value, fileName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${fileName}: expected a JSON object`);
  }

  if (typeof value.id !== "string" || !/^[a-z0-9][a-z0-9-]{1,79}$/.test(value.id)) {
    fail(`${fileName}: invalid scenario id`);
  }

  if (typeof value.title !== "string" || !value.title.trim()) {
    fail(`${fileName}: title is required`);
  }

  if (
    typeof value.path !== "string"
    || !value.path.startsWith("/")
    || value.path.startsWith("//")
    || /^[a-z][a-z0-9+.-]*:/i.test(value.path)
  ) {
    fail(`${fileName}: path must remain local`);
  }

  if (
    !value.viewport
    || !Number.isInteger(value.viewport.width)
    || !Number.isInteger(value.viewport.height)
    || value.viewport.width < 320
    || value.viewport.width > 2560
    || value.viewport.height < 480
    || value.viewport.height > 2000
  ) {
    fail(`${fileName}: invalid viewport`);
  }

  if (!Array.isArray(value.actions) || value.actions.length === 0) {
    fail(`${fileName}: actions must be a non-empty array`);
  }

  let assertions = 0;
  for (const [index, action] of value.actions.entries()) {
    if (!action || typeof action !== "object" || Array.isArray(action)) {
      fail(`${fileName}: action ${index} must be an object`);
    }
    if (!ALLOWED_ACTIONS.has(action.type)) {
      fail(`${fileName}: unsupported action ${String(action.type)}`);
    }
    if (ASSERTION_ACTIONS.has(action.type)) assertions += 1;
    if (action.selector !== undefined && (
      typeof action.selector !== "string"
      || !action.selector.trim()
      || action.selector.length > 300
    )) {
      fail(`${fileName}: action ${index} has an invalid selector`);
    }
  }

  if (assertions === 0) {
    fail(`${fileName}: capture requires at least one assertion`);
  }

  if (!value.screenshot || typeof value.screenshot !== "object") {
    fail(`${fileName}: screenshot settings are required`);
  }

  return value;
}

export async function validateScreenshotTooling(root = process.cwd()) {
  const requiredFiles = [
    ".github/workflows/capture-screenshots.yml",
    ".gitignore",
    "tools/screenshots/README.md",
    "tools/screenshots/package.json",
    "tools/screenshots/package-lock.json",
    "tools/screenshots/playwright.config.mjs",
    "tools/screenshots/prepare-artifacts.mjs",
    "tools/screenshots/capture.spec.mjs",
  ];
  await Promise.all(requiredFiles.map((file) => requireFile(root, file)));

  const packageJson = await readJson(root, "tools/screenshots/package.json");
  const packageLock = await readJson(root, "tools/screenshots/package-lock.json");
  const rootPackage = await readJson(root, "package.json");

  if (packageJson.private !== true) fail("package.json must be private");
  if (packageJson.type !== "module") fail("package.json type must be module");
  if (packageJson.version !== EXPECTED_TOOL_VERSION) {
    fail(`package version must be ${EXPECTED_TOOL_VERSION}`);
  }
  if (packageJson.devDependencies?.["@playwright/test"] !== EXPECTED_PLAYWRIGHT_VERSION) {
    fail(`@playwright/test must be pinned to ${EXPECTED_PLAYWRIGHT_VERSION}`);
  }
  if (packageJson.scripts?.capture !== EXPECTED_CAPTURE_SCRIPT) {
    fail("capture script is missing artifact preparation or changed unexpectedly");
  }

  if (packageLock.lockfileVersion !== 3) fail("package-lock must use lockfileVersion 3");
  if (packageLock.packages?.[""]?.devDependencies?.["@playwright/test"] !== EXPECTED_PLAYWRIGHT_VERSION) {
    fail("package-lock root dependency does not match package.json");
  }
  for (const dependencyPath of [
    "node_modules/@playwright/test",
    "node_modules/playwright",
    "node_modules/playwright-core",
  ]) {
    if (packageLock.packages?.[dependencyPath]?.version !== EXPECTED_PLAYWRIGHT_VERSION) {
      fail(`${dependencyPath} is not locked to ${EXPECTED_PLAYWRIGHT_VERSION}`);
    }
  }

  const rootDependencies = {
    ...(rootPackage.dependencies || {}),
    ...(rootPackage.devDependencies || {}),
  };
  for (const name of ["@playwright/test", "playwright", "playwright-core"]) {
    if (rootDependencies[name]) fail(`${name} must not be a root runtime dependency`);
  }

  const workflow = await readText(root, ".github/workflows/capture-screenshots.yml");
  for (const requiredText of [
    "contents: read",
    "npm ci",
    "playwright install --with-deps chromium",
    "npm run capture",
    "actions/upload-artifact@v5",
    "artifacts/screenshots/",
  ]) {
    if (!workflow.includes(requiredText)) {
      fail(`capture workflow is missing: ${requiredText}`);
    }
  }
  for (const forbiddenText of ["contents: write", "git push", "git commit"]) {
    if (workflow.includes(forbiddenText)) {
      fail(`capture workflow must remain read-only: ${forbiddenText}`);
    }
  }

  const prepareSource = await readText(root, "tools/screenshots/prepare-artifacts.mjs");
  for (const requiredText of [
    "artifacts/screenshots",
    "fs.rmSync",
    "images",
    "entries",
  ]) {
    if (!prepareSource.includes(requiredText)) {
      fail(`prepare-artifacts.mjs is missing: ${requiredText}`);
    }
  }
  if (!prepareSource.includes("endsWith(expectedSuffix)")) {
    fail("prepare-artifacts.mjs must guard the cleanup path");
  }

  const ignoreFile = await readText(root, ".gitignore");
  for (const ignoredPath of [
    "artifacts/",
    "tools/screenshots/node_modules/",
    "tools/screenshots/playwright-report/",
  ]) {
    if (!ignoreFile.includes(ignoredPath)) {
      fail(`.gitignore is missing ${ignoredPath}`);
    }
  }

  const scenarioDirectory = path.join(root, "tools/screenshots/scenarios");
  const scenarioFiles = (await readdir(scenarioDirectory))
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (scenarioFiles.length < REQUIRED_SCENARIOS.size) {
    fail(`expected at least ${REQUIRED_SCENARIOS.size} scenarios`);
  }

  const ids = new Set();
  let desktopCount = 0;
  let mobileCount = 0;
  for (const fileName of scenarioFiles) {
    const scenario = validateScenario(
      await readJson(root, path.posix.join("tools/screenshots/scenarios", fileName)),
      fileName,
    );
    if (ids.has(scenario.id)) fail(`duplicate scenario id: ${scenario.id}`);
    ids.add(scenario.id);
    if (scenario.viewport.width >= 1000) desktopCount += 1;
    if (scenario.viewport.width <= 500) mobileCount += 1;
  }

  for (const requiredId of REQUIRED_SCENARIOS) {
    if (!ids.has(requiredId)) fail(`required scenario is missing: ${requiredId}`);
  }
  if (desktopCount === 0 || mobileCount === 0) {
    fail("both desktop and mobile scenario coverage are required");
  }

  const runtimeFiles = [
    "index.html",
    "script.js",
    "sw.js",
    ...(await readdir(path.join(root, "src")))
      .filter((name) => name.endsWith(".js"))
      .map((name) => path.posix.join("src", name)),
  ];
  for (const file of runtimeFiles) {
    const source = await readText(root, file);
    if (source.includes("tools/screenshots") || source.includes("@playwright/test")) {
      fail(`${file} must not import or reference screenshot tooling`);
    }
  }

  return {
    scenarios: scenarioFiles.length,
    desktop: desktopCount,
    mobile: mobileCount,
    playwrightVersion: EXPECTED_PLAYWRIGHT_VERSION,
  };
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  validateScreenshotTooling().then((result) => {
    console.log(
      `Screenshot tooling passed: ${result.scenarios} scenario(s), `
      + `${result.desktop} desktop, ${result.mobile} mobile, `
      + `Playwright ${result.playwrightVersion}.`,
    );
  }).catch((error) => {
    console.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}
