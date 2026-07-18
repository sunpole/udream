import test from "node:test";
import assert from "node:assert/strict";

import {
  getInstructionHtml,
  isTrustedHtmlTranslation,
  normalizeLanguage,
  translate,
} from "../src/i18n.js";

test("language normalization accepts only supported values", () => {
  assert.equal(normalizeLanguage("en"), "en");
  assert.equal(normalizeLanguage("ru"), "ru");
  assert.equal(normalizeLanguage("EN"), "ru");
  assert.equal(normalizeLanguage(null), "ru");
});

test("translations interpolate every placeholder occurrence and fall back safely", () => {
  assert.equal(translate("en", "matches", { count: 2 }), "Matches: 2");
  assert.equal(translate("broken", "searchBtn"), "Найти");
  assert.equal(translate("en", "missing-key"), "missing-key");
});

test("only reviewed translations are allowed to contain trusted HTML", () => {
  assert.equal(isTrustedHtmlTranslation("thanks"), true);
  assert.equal(isTrustedHtmlTranslation("searchBtn"), false);
  assert.match(translate("ru", "thanks"), /<br>/);
});

test("instructions make only verified claims about language and installation", () => {
  const ru = getInstructionHtml("ru");
  const en = getInstructionHtml("en");

  assert.match(ru, /Записи словаря остаются/);
  assert.match(en, /compatible browser may offer/);
  assert.doesNotMatch(`${ru}${en}`, /работает офлайн|works offline|after a few visits/i);
});
