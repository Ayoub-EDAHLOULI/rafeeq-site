// Copy checks, run with `npm run check:copy` (no dependencies):
// 1. Every locale file has exactly the same keys as messages/en.json.
// 2. No message, and no string in src/lib/release.ts, contains a bracketed
//    placeholder such as "[to confirm]" or "[you]".
import { readFileSync } from "node:fs";

const LOCALES = ["en", "fr", "es", "de", "ar", "zh"];
const PLACEHOLDER = /\[[^\]\n]{1,80}\]/;

const problems = [];

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === "object"
      ? flatten(value, `${prefix}${key}.`)
      : [[`${prefix}${key}`, value]],
  );
}

const messages = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    new Map(
      flatten(JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"))),
    ),
  ]),
);

const reference = messages.en;
for (const locale of LOCALES) {
  const current = messages[locale];
  for (const key of reference.keys()) {
    if (!current.has(key)) problems.push(`${locale}: missing key ${key}`);
  }
  for (const [key, value] of current) {
    if (!reference.has(key)) problems.push(`${locale}: extra key ${key}`);
    if (typeof value === "string" && PLACEHOLDER.test(value)) {
      problems.push(`${locale}: placeholder in ${key}: ${value}`);
    }
  }
}

const release = readFileSync("src/lib/release.ts", "utf8");
for (const [, , literal] of release.matchAll(/(["'`])((?:(?!\1).)*)\1/g)) {
  if (PLACEHOLDER.test(literal)) {
    problems.push(`src/lib/release.ts: placeholder in string "${literal}"`);
  }
}

if (problems.length > 0) {
  console.error(`check:copy found ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(
  `check:copy passed: ${LOCALES.length} locales, ${reference.size} keys each, no placeholders.`,
);
