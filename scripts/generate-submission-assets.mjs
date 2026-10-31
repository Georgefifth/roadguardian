import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../submission/assets');

async function generateAssets() {
  console.log('Generating Devpost submission assets in 3:2 aspect ratio (1200x800)...');
  const browser = await chromium.launch({ headless: true });

  // 1. Generate Thumbnail (1200x800)
  const thumbPage = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
  const thumbHtml = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; box-sizing: border-box; }
      body {
        width: 1200px; height: 800px;
        background: #0B0F17;
        color: #F8FAFC;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        display: flex; flex-direction: column; justify-content: space-between;
        padding: 64px 80px;
        position: relative;
        overflow: hidden;
      }
      .bg-grid {
        position: absolute; inset: 0;
        background-image:
          radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.18) 0%, transparent 55%),
          radial-gradient(circle at 15% 85%, rgba(239, 68, 68, 0.12) 0%, transparent 45%),
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 100% 100%, 100% 100%, 48px 48px, 48px 48px;
        pointer-events: none;
      }
      .header-badge {
        display: inline-flex; align-items: center; gap: 10px;
        background: rgba(245, 158, 11, 0.15);
        border: 1px solid rgba(245, 158, 11, 0.35);
        border-radius: 999px;
        padding: 8px 22px;
        color: #F59E0B;
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px; font-weight: 700;
        letter-spacing: 0.12em; text-transform: uppercase;
      }
      .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; }
      h1 {
        font-size: 78px; font-weight: 900; line-height: 1.05;
        letter-spacing: -0.03em; margin-top: 24px;
        color: #FFFFFF;
      }
      .accent-text {
        background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .sub {
        font-size: 26px; font-weight: 500; color: #94A3B8;
        line-height: 1.4; max-width: 860px; margin-top: 18px;
      }
      .features-row {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        margin-top: 40px;
      }
      .feature-card {
        background: rgba(21, 29, 42, 0.85);
        border: 1px solid #263447;
        border-radius: 16px;
        padding: 20px;
      }
      .feature-kicker {
        font-family: 'JetBrains Mono', monospace; font-size: 12px;
        color: #F59E0B; font-weight: 700; text-transform: uppercase;
      }
      .feature-title { font-size: 18px; font-weight: 800; color: #F1F5F9; margin-top: 6px; }
      .feature-desc { font-size: 13px; color: #94A3B8; margin-top: 4px; line-height: 1.35; }
      .footer {
        display: flex; justify-content: space-between; align-items: center;
        border-top: 1px solid #1E293B; padding-top: 24px;
        font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #64748B;
      }
      .foot-url { color: #CBD5E1; font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="bg-grid"></div>
    <div>
      <div class="header-badge">
        <span class="badge-dot"></span>
        <span>SafeSpace Hacks 2026 • 100% Offline PWA</span>
      </div>
      <h1>Road<span class="accent-text">Guardian</span></h1>
      <p class="sub">
        Offline-first roadside emergency copilot that shields drivers from secondary collisions, missed evidence, and predatory tow truck extortion.
      </p>

      <div class="features-row">
        <div class="feature-card">
          <div class="feature-kicker">Phase 01 • Life Safety</div>
          <div class="feature-title">Secondary Crash Shield</div>
          <div class="feature-desc">Enforces engine cut &amp; barrier positioning to prevent highway fatalities.</div>
        </div>
        <div class="feature-card">
          <div class="feature-kicker">Phase 02 • Evidence</div>
          <div class="feature-title">Guided Camera Vault</div>
          <div class="feature-desc">Standardized intake for plates, VIN, insurance, and damage with timestamps.</div>
        </div>
        <div class="feature-card">
          <div class="feature-kicker">Phase 03 &amp; 04 • Defense</div>
          <div class="feature-title">Bandit Tow &amp; SHA-256</div>
          <div class="feature-desc">Refuses blank invoices and seals dossier with tamper-evident cryptography.</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>safespace-hacks.vercel.app</span>
      <span class="foot-url">github.com/Georgefifth/roadguardian</span>
    </div>
  </body>
  </html>`;

  await thumbPage.setContent(thumbHtml);
  await thumbPage.waitForTimeout(500);
  await thumbPage.screenshot({ path: path.join(assetsDir, 'thumbnail.png') });
  console.log('Saved thumbnail.png (1200x800)');
  await thumbPage.close();

  // 2. Generate Gallery Images from live deployed site (1200x800 3:2 ratio)
  const appPage = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
  await appPage.goto('https://safespace-hacks.vercel.app');
  await appPage.waitForTimeout(800);

  // Gallery 1: Safety Triage HUD
  await appPage.screenshot({ path: path.join(assetsDir, '01-immediate-safety-triage.png') });
  console.log('Saved 01-immediate-safety-triage.png');

  // Load drill
  await appPage.click('button:has-text("Load Highway Crash Drill")');
  await appPage.waitForTimeout(400);

  // Gallery 2: Evidence Vault
  await appPage.click('button:has-text("2. Evidence Vault")');
  await appPage.waitForTimeout(400);
  await appPage.screenshot({ path: path.join(assetsDir, '02-guided-evidence-vault.png') });
  console.log('Saved 02-guided-evidence-vault.png');

  // Gallery 3: Tow Truck Defense Shield
  await appPage.click('button:has-text("3. Tow Shield")');
  await appPage.waitForTimeout(400);
  await appPage.screenshot({ path: path.join(assetsDir, '03-bandit-tow-defense-shield.png') });
  console.log('Saved 03-bandit-tow-defense-shield.png');

  // Gallery 4: Neutral Statement Generator
  await appPage.evaluate(() => window.scrollTo(0, 450));
  await appPage.waitForTimeout(300);
  await appPage.screenshot({ path: path.join(assetsDir, '04-neutral-statement-shield.png') });
  console.log('Saved 04-neutral-statement-shield.png');

  // Gallery 5: Official Dossier & SHA-256 Cryptographic Seal
  await appPage.click('button:has-text("4. Incident Packet")');
  await appPage.waitForTimeout(400);
  await appPage.evaluate(() => window.scrollTo(0, 0));
  await appPage.screenshot({ path: path.join(assetsDir, '05-official-dossier-sha256.png') });
  console.log('Saved 05-official-dossier-sha256.png');

  // Gallery 6: Offline Storage Vault
  await appPage.click('button:has-text("Vault")');
  await appPage.waitForTimeout(400);
  await appPage.screenshot({ path: path.join(assetsDir, '06-offline-local-vault.png') });
  console.log('Saved 06-offline-local-vault.png');
  await appPage.keyboard.press('Escape');
  await appPage.close();

  // Gallery 7: Mobile 390px Viewport
  const mobPage = await browser.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2 });
  await mobPage.goto('https://safespace-hacks.vercel.app');
  await mobPage.click('button:has-text("Load Highway Crash Drill")');
  await mobPage.waitForTimeout(400);
  await mobPage.screenshot({ path: path.join(assetsDir, '07-mobile-responsive-flow.png') });
  console.log('Saved 07-mobile-responsive-flow.png');
  await mobPage.close();

  await browser.close();

  // Copy demo video
  fs.copyFileSync(
    path.resolve(__dirname, '../evidence/stage-4-demo/demo.mp4'),
    path.join(assetsDir, 'demo.mp4')
  );
  console.log('Copied demo.mp4 to submission/assets/demo.mp4');

  console.log('All submission assets generated successfully!');
}

generateAssets().catch(console.error);
