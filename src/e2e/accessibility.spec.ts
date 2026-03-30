/**
 * Automated accessibility audit — axe-core × Playwright
 *
 * Scans all 6 crypto stations for WCAG 2.1 AA violations.
 * CI fails on any critical or serious violation.
 *
 * Strategy: Each station uses framer-motion with isInView-dependent
 * animations. Only the currently centered station has proper colors
 * and opacity. We scroll each station into viewport center before
 * scanning to ensure accurate contrast evaluation.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const STATIONS = ["caesar", "des", "aes", "rsa", "ecc", "pqc"] as const;
const REPORT_DIR = join(process.cwd(), "a11y-report");

/** Scroll a station to viewport center so isInView triggers, then wait for animations. */
async function activateStation(
  page: import("@playwright/test").Page,
  stationId: string
) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const elementCenter = window.scrollY + rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      window.scrollTo({ top: elementCenter - viewportCenter, behavior: "instant" });
    }
  }, stationId);
  // Wait for IntersectionObserver (-25% margin) + framer-motion animations
  await page.waitForTimeout(1200);
}

/** Generate a simple HTML report from axe results. */
function generateHtmlReport(
  results: { station: string; violations: AxeViolation[]; passes: number }[]
): string {
  const totalViolations = results.reduce(
    (sum, r) => sum + r.violations.length,
    0
  );
  const critical = results.reduce(
    (sum, r) =>
      sum +
      r.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      ).length,
    0
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessibility Audit Report — Crypto Timeline</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1rem; background: #0f172a; color: #e2e8f0; }
    h1 { color: #38bdf8; }
    h2 { color: #f8fafc; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }
    .summary { background: #1e293b; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
    .pass { color: #4ade80; } .fail { color: #f87171; }
    .violation { background: #1e293b; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #f87171; }
    .violation.serious { border-left-color: #fb923c; }
    .violation.moderate { border-left-color: #fbbf24; }
    .violation.minor { border-left-color: #94a3b8; }
    .impact { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
    .impact-critical { background: #991b1b; color: #fecaca; }
    .impact-serious { background: #9a3412; color: #fed7aa; }
    .impact-moderate { background: #854d0e; color: #fef3c7; }
    .impact-minor { background: #334155; color: #94a3b8; }
    code { background: #334155; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    .nodes { margin-top: 0.5rem; padding-left: 1rem; }
    .node-target { color: #93c5fd; }
  </style>
</head>
<body>
  <h1>Accessibility Audit Report</h1>
  <div class="summary">
    <p>Stations scanned: <strong>${results.length}</strong></p>
    <p>Total violations: <strong class="${totalViolations === 0 ? "pass" : "fail"}">${totalViolations}</strong></p>
    <p>Critical/Serious: <strong class="${critical === 0 ? "pass" : "fail"}">${critical}</strong></p>
    <p>Total passing rules: <strong class="pass">${results.reduce((s, r) => s + r.passes, 0)}</strong></p>
  </div>
  ${results
    .map(
      (r) => `
  <h2 id="${r.station}">Station: ${r.station.toUpperCase()}</h2>
  ${
    r.violations.length === 0
      ? '<p class="pass">No violations found.</p>'
      : r.violations
          .map(
            (v) => `
  <div class="violation ${v.impact}">
    <span class="impact impact-${v.impact}">${v.impact}</span>
    <strong>${v.id}</strong>: ${v.description}
    <br><a href="${v.helpUrl}" style="color:#38bdf8">${v.help}</a>
    <div class="nodes">
      ${v.nodes.map((n) => `<div class="node-target"><code>${escapeHtml(n.target)}</code> — ${escapeHtml(n.failureSummary)}</div>`).join("")}
    </div>
  </div>`
          )
          .join("")
  }`
    )
    .join("")}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface AxeViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: { target: string; failureSummary: string }[];
}

function mapViolations(raw: unknown[]): AxeViolation[] {
  return (raw as Record<string, unknown>[]).map((v) => ({
    id: v.id as string,
    impact: v.impact as string,
    description: v.description as string,
    help: v.help as string,
    helpUrl: v.helpUrl as string,
    nodes: (v.nodes as Record<string, unknown>[]).map((n) => ({
      target: Array.isArray(n.target)
        ? (n.target as string[]).join(", ")
        : String(n.target),
      failureSummary: String(n.failureSummary ?? ""),
    })),
  }));
}

// ─── Per-Station Scans (Dark Theme — default) ────────────────────────────────

test.describe("Accessibility audit — axe-core (dark theme)", () => {
  test.use({ reducedMotion: "reduce" });
  test.setTimeout(60_000);

  for (const station of STATIONS) {
    test(`station "${station}" has no critical or serious a11y violations`, async ({
      page,
    }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);
      await activateStation(page, station);

      const results = await new AxeBuilder({ page })
        .include(`#${station}`)
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const criticalOrSerious = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(
        criticalOrSerious,
        `Station "${station}" has ${criticalOrSerious.length} critical/serious a11y violations:\n` +
          criticalOrSerious
            .map((v) => `  [${v.impact}] ${v.id}: ${v.help}`)
            .join("\n")
      ).toHaveLength(0);
    });
  }

  // ─── Generate HTML Report ─────────────────────────────────────────────────

  test("generate a11y HTML report for all stations", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const allResults: {
      station: string;
      violations: AxeViolation[];
      passes: number;
    }[] = [];

    // Scan each station while it's active (centered in viewport)
    for (const station of STATIONS) {
      await activateStation(page, station);

      const results = await new AxeBuilder({ page })
        .include(`#${station}`)
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      allResults.push({
        station,
        violations: mapViolations(results.violations),
        passes: results.passes.length,
      });
    }

    // Write HTML report
    mkdirSync(REPORT_DIR, { recursive: true });
    const html = generateHtmlReport(allResults);
    writeFileSync(join(REPORT_DIR, "index.html"), html, "utf-8");

    // Write JSON report for programmatic consumption
    writeFileSync(
      join(REPORT_DIR, "results.json"),
      JSON.stringify(allResults, null, 2),
      "utf-8"
    );

    // Log summary
    const totalViolations = allResults.reduce(
      (sum, r) => sum + r.violations.length,
      0
    );
    console.log(
      `\nA11y report generated: ${REPORT_DIR}/index.html (${totalViolations} violations found)\n`
    );
  });
});

// ─── Light Theme Scans ──────────────────────────────────────────────────────

/** Switch to light theme by setting data-theme attribute and localStorage. */
async function enableLightTheme(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("crypto-timeline-theme", "light");
  });
  await page.waitForTimeout(500);
}

test.describe("Accessibility audit — axe-core (light theme)", () => {
  test.use({ reducedMotion: "reduce" });
  test.setTimeout(60_000);

  for (const station of STATIONS) {
    test(`station "${station}" has no critical or serious a11y violations in light theme`, async ({
      page,
    }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);
      await enableLightTheme(page);
      await activateStation(page, station);

      const results = await new AxeBuilder({ page })
        .include(`#${station}`)
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const criticalOrSerious = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(
        criticalOrSerious,
        `Station "${station}" has ${criticalOrSerious.length} critical/serious a11y violations in light theme:\n` +
          criticalOrSerious
            .map((v) => `  [${v.impact}] ${v.id}: ${v.help}`)
            .join("\n")
      ).toHaveLength(0);
    });
  }

  test("generate light theme a11y report for all stations", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await enableLightTheme(page);

    const allResults: {
      station: string;
      violations: AxeViolation[];
      passes: number;
    }[] = [];

    for (const station of STATIONS) {
      await activateStation(page, station);

      const results = await new AxeBuilder({ page })
        .include(`#${station}`)
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      allResults.push({
        station,
        violations: mapViolations(results.violations),
        passes: results.passes.length,
      });
    }

    mkdirSync(REPORT_DIR, { recursive: true });
    writeFileSync(
      join(REPORT_DIR, "light-theme-results.json"),
      JSON.stringify(allResults, null, 2),
      "utf-8"
    );

    const totalViolations = allResults.reduce(
      (sum, r) => sum + r.violations.length,
      0
    );
    console.log(
      `\nLight theme a11y report: ${REPORT_DIR}/light-theme-results.json (${totalViolations} violations found)\n`
    );
  });
});
