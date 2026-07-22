import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

const TOOL_ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(TOOL_ROOT, "../..");
const SCENARIO_ROOT = path.join(TOOL_ROOT, "scenarios");
const ARTIFACT_ROOT = path.resolve(
  process.env.SCREENSHOT_ARTIFACT_DIR
    || path.join(REPOSITORY_ROOT, "artifacts/screenshots"),
);
const IMAGE_ROOT = path.join(ARTIFACT_ROOT, "images");
const MANIFEST_PATH = path.join(ARTIFACT_ROOT, "manifest.json");
const PACKAGE_PATH = path.join(TOOL_ROOT, "package.json");

const ALLOWED_ACTIONS = new Set([
  "assertCountAtLeast",
  "assertFirstText",
  "assertText",
  "assertVisible",
  "click",
  "clickIfVisible",
  "fill",
  "press",
  "scrollIntoView",
  "waitFor",
  "waitForTimeout",
]);

const manifestEntries = new Map();

function fail(message) {
  throw new Error(`Screenshot scenario error: ${message}`);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCommitSha() {
  if (process.env.SCREENSHOT_COMMIT) return process.env.SCREENSHOT_COMMIT;
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;

  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: REPOSITORY_ROOT,
    encoding: "utf8",
  }).trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validateSelector(value, label) {
  if (typeof value !== "string" || !value.trim() || value.length > 300) {
    fail(`${label} must be a non-empty CSS selector under 300 characters`);
  }
}

function validateScenario(value, sourceName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${sourceName} must contain one JSON object`);
  }

  if (typeof value.id !== "string" || !/^[a-z0-9][a-z0-9-]{1,79}$/.test(value.id)) {
    fail(`${sourceName}: id must use lowercase Latin letters, digits and hyphens`);
  }

  if (typeof value.title !== "string" || !value.title.trim()) {
    fail(`${sourceName}: title is required`);
  }

  if (
    typeof value.path !== "string"
    || !value.path.startsWith("/")
    || value.path.startsWith("//")
    || /^[a-z][a-z0-9+.-]*:/i.test(value.path)
  ) {
    fail(`${sourceName}: path must be a local absolute path such as /`);
  }

  const { viewport } = value;
  if (
    !viewport
    || !Number.isInteger(viewport.width)
    || !Number.isInteger(viewport.height)
    || viewport.width < 320
    || viewport.width > 2560
    || viewport.height < 480
    || viewport.height > 2000
  ) {
    fail(`${sourceName}: viewport must be within 320×480 and 2560×2000`);
  }

  if (!Array.isArray(value.actions) || value.actions.length === 0) {
    fail(`${sourceName}: actions must be a non-empty array`);
  }

  let assertionCount = 0;
  for (const [index, action] of value.actions.entries()) {
    if (!action || typeof action !== "object" || Array.isArray(action)) {
      fail(`${sourceName}: action ${index} must be an object`);
    }
    if (!ALLOWED_ACTIONS.has(action.type)) {
      fail(`${sourceName}: action ${index} has unsupported type ${String(action.type)}`);
    }
    if (action.selector !== undefined) {
      validateSelector(action.selector, `${sourceName}: action ${index} selector`);
    }
    if (String(action.type).startsWith("assert")) assertionCount += 1;
  }

  if (assertionCount === 0) {
    fail(`${sourceName}: at least one assertion is required before capture`);
  }

  if (!value.screenshot || typeof value.screenshot !== "object") {
    fail(`${sourceName}: screenshot settings are required`);
  }
  if (value.screenshot.selector !== undefined) {
    validateSelector(value.screenshot.selector, `${sourceName}: screenshot selector`);
  }
  if (value.screenshot.fullPage !== undefined && typeof value.screenshot.fullPage !== "boolean") {
    fail(`${sourceName}: screenshot.fullPage must be boolean`);
  }

  return value;
}

function loadScenarios() {
  const requested = new Set(
    String(process.env.SCREENSHOT_SCENARIOS || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const files = fs.readdirSync(SCENARIO_ROOT)
    .filter((name) => name.endsWith(".json"))
    .sort();

  if (files.length === 0) fail("no scenario JSON files were found");

  const scenarios = files.map((name) => (
    validateScenario(readJson(path.join(SCENARIO_ROOT, name)), name)
  ));

  const ids = new Set();
  for (const scenario of scenarios) {
    if (ids.has(scenario.id)) fail(`duplicate scenario id: ${scenario.id}`);
    ids.add(scenario.id);
  }

  if (requested.size === 0) return scenarios;

  for (const id of requested) {
    if (!ids.has(id)) fail(`requested scenario does not exist: ${id}`);
  }

  return scenarios.filter((scenario) => requested.has(scenario.id));
}

async function runAction(page, action) {
  const locator = action.selector ? page.locator(action.selector) : null;

  switch (action.type) {
    case "waitFor":
      await locator.waitFor({ state: action.state || "visible" });
      return;
    case "fill":
      if (typeof action.value !== "string") fail("fill action requires string value");
      await locator.fill(action.value);
      return;
    case "press":
      if (typeof action.key !== "string" || !action.key.trim()) {
        fail("press action requires key");
      }
      await locator.press(action.key);
      return;
    case "click":
      await locator.click();
      return;
    case "clickIfVisible":
      if (await locator.isVisible().catch(() => false)) await locator.click();
      return;
    case "scrollIntoView":
      await locator.scrollIntoViewIfNeeded();
      return;
    case "waitForTimeout": {
      const duration = Number(action.milliseconds);
      if (!Number.isInteger(duration) || duration < 0 || duration > 2000) {
        fail("waitForTimeout must be an integer from 0 to 2000 milliseconds");
      }
      await page.waitForTimeout(duration);
      return;
    }
    case "assertVisible":
      await expect(locator).toBeVisible();
      return;
    case "assertText": {
      if (typeof action.text !== "string") fail("assertText requires text");
      const expression = new RegExp(escapeRegExp(action.text), action.ignoreCase ? "i" : "");
      await expect(locator).toContainText(expression);
      return;
    }
    case "assertFirstText": {
      if (typeof action.text !== "string") fail("assertFirstText requires text");
      const expression = new RegExp(`^\\s*${escapeRegExp(action.text)}\\s*$`, action.ignoreCase ? "i" : "");
      await expect(locator.first()).toHaveText(expression);
      return;
    }
    case "assertCountAtLeast": {
      const minimum = Number(action.count);
      if (!Number.isInteger(minimum) || minimum < 1 || minimum > 100) {
        fail("assertCountAtLeast requires count from 1 to 100");
      }
      await expect.poll(() => locator.count()).toBeGreaterThanOrEqual(minimum);
      return;
    }
    default:
      fail(`unhandled action type: ${action.type}`);
  }
}

function readPngDimensions(buffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(signature)) {
    fail("generated screenshot is not a valid PNG");
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

const scenarios = loadScenarios();
const toolPackage = readJson(PACKAGE_PATH);
const commitSha = getCommitSha();

fs.mkdirSync(IMAGE_ROOT, { recursive: true });

for (const scenario of scenarios) {
  test(scenario.title, async ({ page }, testInfo) => {
    await page.setViewportSize(scenario.viewport);

    await page.addInitScript(() => {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch {
        // A fresh Playwright context should still remain usable.
      }
    });

    await page.goto(scenario.path, { waitUntil: "domcontentloaded" });
    await page.locator("#searchInput").waitFor({ state: "visible" });
    await page.locator("#resultCard").waitFor({ state: "visible" });

    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          scroll-behavior: auto !important;
        }
      `,
    });

    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });

    const installClose = page.locator("[data-pwa-close]");
    if (await installClose.isVisible().catch(() => false)) {
      await installClose.click();
    }

    for (const action of scenario.actions) {
      await runAction(page, action);
    }

    await page.evaluate(() => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));

    const fileName = `${scenario.id}.png`;
    const outputPath = path.join(IMAGE_ROOT, fileName);
    const screenshotOptions = {
      path: outputPath,
      animations: "disabled",
      caret: "hide",
    };

    if (scenario.screenshot.selector) {
      const target = page.locator(scenario.screenshot.selector);
      await expect(target).toBeVisible();
      await target.screenshot(screenshotOptions);
    } else {
      await page.screenshot({
        ...screenshotOptions,
        fullPage: Boolean(scenario.screenshot.fullPage),
      });
    }

    const image = fs.readFileSync(outputPath);
    const dimensions = readPngDimensions(image);
    if (image.length < 10_000) fail(`${fileName} is unexpectedly small`);

    const capturedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    manifestEntries.set(scenario.id, {
      id: scenario.id,
      title: scenario.title,
      file: `images/${fileName}`,
      commit: commitSha,
      capturedAt,
      pageUrl: page.url(),
      viewport: scenario.viewport,
      width: dimensions.width,
      height: dimensions.height,
      bytes: image.length,
      screenshot: scenario.screenshot,
    });

    await testInfo.attach(fileName, {
      body: image,
      contentType: "image/png",
    });
  });
}

test.afterAll(() => {
  const manifest = {
    schemaVersion: 1,
    project: "uDream",
    generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    commit: commitSha,
    toolVersion: toolPackage.version,
    playwrightVersion: toolPackage.devDependencies["@playwright/test"],
    scenarios: [...manifestEntries.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };

  fs.mkdirSync(ARTIFACT_ROOT, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
});
