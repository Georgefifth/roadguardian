// Real-browser QA runner for RoadGuardian
// Adapted from ~/.config/opencode/skills/playwright-qa/template.mjs

import { chromium, firefox } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "https://safespace-hacks.vercel.app";
const OUT = process.env.QA_OUT ?? "evidence/stage-3-qa";
const BROWSER = process.env.BROWSER === "firefox" ? "firefox" : "chromium";
const HEADED = process.env.HEADED === "1";

const SHOTS = path.join(OUT, "screens");
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: "mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectVisible(page, selector, timeout = 10000) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: "visible", timeout });
  return locator;
}

async function expectText(page, text, timeout = 10000) {
  const locator = page.getByText(text).first();
  await locator.waitFor({ state: "visible", timeout });
  return locator;
}

function collectIssues(page) {
  const issues = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") issues.push({ kind: "console", text: msg.text() });
  });
  page.on("pageerror", (err) => {
    issues.push({ kind: "pageerror", text: err.message });
  });
  page.on("requestfailed", (req) => {
    const reason = req.failure()?.errorText ?? "request failed";
    if (!reason.includes("ERR_ABORTED")) {
      issues.push({ kind: "requestfailed", text: `${reason} ${req.url()}` });
    }
  });
  page.on("response", (res) => {
    const status = res.status();
    if (status >= 500) issues.push({ kind: "http", text: `${status} ${res.url()}` });
    else if (status >= 400) {
      issues.push({ kind: "http", level: "warn", text: `${status} ${res.url()}` });
    }
  });
  return issues;
}

const scenarios = [
  {
    id: "smoke-landing",
    title: "Landing page renders with zero overflow and active emergency HUD",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await ctx.expectVisible("body");
      ctx.assert((await page.title()).includes("RoadGuardian"), "document.title missing RoadGuardian");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      ctx.assert(overflow <= 1, `horizontal overflow detected: ${overflow}px`);

      // Verify emergency elements
      await ctx.expectText(/Call 911/i);
      await ctx.expectText(/Life-Critical Rule/i);
      await ctx.expectText(/100% Offline/i);

      await ctx.shot("landing");
    },
  },
  {
    id: "core-flow-end-to-end",
    title: "Complete 4-stage emergency intake flow from panic to SHA-256 dossier",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "domcontentloaded" });

      // PHASE 1: Safety Checklist
      await page.click("text=1. Hazard Flashers Activated");
      await page.click("text=2. Engine Switched Off");
      await page.click("text=3. Positioned Behind Guardrail");
      await ctx.shot("phase1-safety-secured");

      // Advance to Phase 2
      await page.click('button:has-text("Proceed to Evidence Capture"), button:has-text("Continue to Evidence Vault")');
      await ctx.expectText(/Standardized Evidence & Exchange Vault/i);

      // PHASE 2: Fill other driver details
      await page.fill('input[placeholder*="John Doe"]', 'Jane Smith');
      await page.fill('input[placeholder*="(555)"]', '(415) 555-8822');
      await page.fill('input[placeholder="PLATE #"]', '7ABC999');
      await page.fill('input[placeholder*="1HGCR2F83HA019284"]', '1HGCR2F83HA019284');

      // Click simulate sample shot for plate
      await page.click('button:has-text("Simulate Sample Shot")');
      await ctx.expectText(/Evidence Secured/i);
      await ctx.shot("phase2-evidence-captured");

      // Advance to Phase 3
      await page.click('button:has-text("Proceed to Tow Truck & Statement Shield")');
      await ctx.expectText(/Bandit Tow Truck Defense Shield/i);

      // PHASE 3: Tow Shield & Neutral Statement
      await page.fill('input[placeholder*="City Fleet Towing"]', 'Bay Towing Authority');
      await page.fill('input[placeholder*="Northbound Lane 1"]', 'Highway 280 Northbound Lane 3');
      await ctx.expectText(/Neutral Statement Shield/i);
      await ctx.shot("phase3-tow-shield");

      // Advance to Phase 4
      await page.click('button:has-text("Compile & Export Final Incident Dossier")');
      await ctx.expectText(/OFFICIAL INCIDENT DOSSIER/i);
      await ctx.expectText(/Cryptographic Integrity Seal/i);

      // Verify business outcomes in final dossier
      const dossierText = await page.textContent("article");
      ctx.assert(dossierText.includes("Jane Smith"), "Dossier missing other driver name");
      ctx.assert(dossierText.includes("7ABC999"), "Dossier missing license plate");
      ctx.assert(dossierText.includes("1HGCR2F83HA019284"), "Dossier missing VIN");
      ctx.assert(dossierText.includes("Bay Towing Authority"), "Dossier missing verified tow company");

      await ctx.shot("phase4-dossier-exported");
    },
  },
  {
    id: "state-persistence-reload",
    title: "Incident data survives full browser reload via local cryptographic storage",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "domcontentloaded" });

      // Load practice drill
      await page.click('button:has-text("Load Highway Crash Drill")');
      await page.waitForTimeout(400);

      // Verify practice drill is active
      await ctx.expectText(/Marcus Vance/i, 2000).catch(async () => {
        // Switch to step 2 to confirm data
        await page.click('button:has-text("2. Evidence Vault")');
      });

      const plateBefore = await page.inputValue('input[placeholder="PLATE #"]');
      ctx.assert(plateBefore === "8XYZ419", `Expected plate 8XYZ419, got ${plateBefore}`);

      // Hard reload page
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);

      // Navigate to step 2 to verify persistence
      await page.click('button:has-text("2. Evidence Vault")');
      const plateAfter = await page.inputValue('input[placeholder="PLATE #"]');
      ctx.assert(plateAfter === "8XYZ419", `Persistence failed! Plate after reload: ${plateAfter}`);

      const driverAfter = await page.inputValue('input[placeholder*="John Doe"]');
      ctx.assert(driverAfter === "Marcus Vance", `Persistence failed! Driver after reload: ${driverAfter}`);

      await ctx.shot("persistence-after-reload");
    },
  },
  {
    id: "tow-shield-anti-extortion",
    title: "Anti-bandit tow truck verification warns on unsolicited arrivals",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.click('button:has-text("3. Tow Shield")');

      // Click "Arrived Unsolicited"
      await page.click('button:has-text("Arrived Unsolicited")');
      await ctx.expectText(/Crucial Consumer Protection Rule/i);

      // Verify defensive shield toggle
      await ctx.expectText(/Defensive Shield Verified/i);
      await ctx.shot("tow-shield-unsolicited-alert");
    },
  },
  {
    id: "incident-vault-lifecycle",
    title: "Incident vault modal allows switching, managing, and creating new sessions",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "domcontentloaded" });

      // Open vault modal
      await page.click('button:has-text("Vault")');
      await ctx.expectText(/Local Storage Incident Vault/i);
      await ctx.shot("vault-modal-open");

      // Click close
      await page.click('button:has-text("Create New")');
      await page.waitForTimeout(300);

      // Verify new incident initiated
      await ctx.expectText(/Immediate Life-Safety Checklist/i);
      await ctx.shot("vault-new-session");
    },
  },
];

async function main() {
  const browserType = BROWSER === "firefox" ? firefox : chromium;
  console.log(`Launching ${BROWSER} testing against ${BASE}...`);
  const browser = await browserType.launch({ headless: !HEADED });
  const startedAt = new Date().toISOString();
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      baseURL: BASE,
      viewport: vp.viewport,
      deviceScaleFactor: vp.deviceScaleFactor,
    });

    for (const scenario of scenarios) {
      const page = await context.newPage();
      const issues = collectIssues(page);
      const screenshots = [];
      const started = Date.now();
      let status = "pass";
      let error = null;

      const ctx = {
        assert,
        expectVisible: (selector, timeout) => expectVisible(page, selector, timeout),
        expectText: (text, timeout) => expectText(page, text, timeout),
        shot: async (name, opts = {}) => {
          const file = path.join(SHOTS, `${scenario.id}-${name}-${vp.name}.png`);
          await page.screenshot({ path: file, fullPage: opts.fullPage ?? true });
          screenshots.push(file);
          return file;
        },
      };

      try {
        await scenario.run(page, ctx);
      } catch (err) {
        status = "fail";
        error = err.message;
      } finally {
        await page.close().catch(() => {});
      }

      const errors = issues.filter((i) => (i.level ?? "error") === "error");
      const warnings = issues.filter((i) => i.level === "warn");
      if (status === "pass" && errors.length > 0) {
        status = "fail";
        error = errors.map((i) => `${i.kind}: ${i.text}`).join(" | ");
      }

      results.push({
        viewport: vp.name,
        id: scenario.id,
        title: scenario.title,
        status,
        ms: Date.now() - started,
        error,
        errors,
        warnings,
        screenshots,
      });

      console.log(
        `${status === "pass" ? "✓" : "✗"} [${vp.name}] ${scenario.id}` +
          (error ? ` — ${error}` : "")
      );
    }

    await context.close();
  }

  await browser.close();

  const summary = {
    total: results.length,
    pass: results.filter((r) => r.status === "pass").length,
    fail: results.filter((r) => r.status === "fail").length,
  };
  const finishedAt = new Date().toISOString();
  const report = {
    base: BASE,
    browser: BROWSER,
    headed: HEADED,
    startedAt,
    finishedAt,
    summary,
    results,
  };

  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(report, null, 2));

  const warnings = results.flatMap((r) =>
    r.warnings.map((w) => `- [${r.viewport}] ${r.id}: ${w.kind} — ${w.text}`)
  );
  const md = [
    `# Playwright QA Report — ${finishedAt}`,
    "",
    `- **Base URL Tested**: ${BASE}`,
    `- **Browser**: ${BROWSER} (${HEADED ? "headed" : "headless"})`,
    `- **Total Scenarios**: ${summary.total}`,
    `- **Pass**: ${summary.pass}`,
    `- **Fail**: ${summary.fail}`,
    "",
    "| Viewport | Scenario ID | Status | Duration (ms) | Detail |",
    "|---|---|---|---|---|",
    ...results.map(
      (r) =>
        `| ${r.viewport} | ${r.id} | ${r.status === "pass" ? "PASSED" : "FAILED"} | ${r.ms} | ${(r.error ?? "All assertions passed, zero console errors").replace(/\|/g, "\\|")} |`
    ),
    "",
    ...(warnings.length ? ["## Warnings", "", ...warnings, ""] : []),
    "## Visual Screenshot Evidence",
    "",
    ...results.flatMap((r) => r.screenshots.map((s) => `- \`${s}\``)),
    "",
  ];
  fs.writeFileSync(path.join(OUT, "report.md"), md.join("\n"));

  console.log(`\nQA Result: ${summary.pass}/${summary.total} passed — see ${OUT}/report.md`);
  if (summary.fail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("QA runner error:", err);
  process.exit(2);
});
