import { chromium } from 'playwright';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../evidence/stage-2-build/frontend');

async function main() {
  console.log('Starting Vite preview server...');
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5174 },
  });
  await server.listen();
  const url = 'http://localhost:5174';
  console.log(`Vite running at ${url}`);

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Screenshots (1440x900)
  console.log('Capturing Desktop screenshots (1440px)...');
  const contextDesk = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const pageDesk = await contextDesk.newPage();
  await pageDesk.goto(url);
  await pageDesk.waitForTimeout(600);

  // Step 1: Triage HUD
  await pageDesk.screenshot({ path: path.join(outDir, '01-desktop-step1-triage.png'), fullPage: true });
  console.log('Saved 01-desktop-step1-triage.png');

  // Load practice drill so that subsequent screens have rich content
  await pageDesk.click('button:has-text("Load Highway Crash Drill")');
  await pageDesk.waitForTimeout(400);

  // Re-capture Step 1 with checklist completed
  await pageDesk.screenshot({ path: path.join(outDir, '01-desktop-step1-safety-secured.png'), fullPage: true });

  // Step 2: Evidence Vault
  await pageDesk.click('button:has-text("2. Evidence Vault")');
  await pageDesk.waitForTimeout(400);
  await pageDesk.screenshot({ path: path.join(outDir, '02-desktop-step2-evidence-vault.png'), fullPage: true });
  console.log('Saved 02-desktop-step2-evidence-vault.png');

  // Step 3: Tow Shield
  await pageDesk.click('button:has-text("3. Tow Shield")');
  await pageDesk.waitForTimeout(400);
  await pageDesk.screenshot({ path: path.join(outDir, '03-desktop-step3-tow-shield.png'), fullPage: true });
  console.log('Saved 03-desktop-step3-tow-shield.png');

  // Step 4: Incident Dossier Export
  await pageDesk.click('button:has-text("4. Incident Packet")');
  await pageDesk.waitForTimeout(400);
  await pageDesk.screenshot({ path: path.join(outDir, '04-desktop-step4-dossier-export.png'), fullPage: true });
  console.log('Saved 04-desktop-step4-dossier-export.png');

  // Incident Vault Modal
  await pageDesk.click('button:has-text("Vault")');
  await pageDesk.waitForTimeout(400);
  await pageDesk.screenshot({ path: path.join(outDir, '05-desktop-vault-modal.png'), fullPage: true });
  console.log('Saved 05-desktop-vault-modal.png');

  await pageDesk.close();
  await contextDesk.close();

  // 2. Mobile Screenshots (390x844 iPhone 13/14/15 size)
  console.log('Capturing Mobile screenshots (390px)...');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto(url);
  await pageMobile.waitForTimeout(600);

  // Mobile Step 1: Triage HUD
  await pageMobile.screenshot({ path: path.join(outDir, '01-mobile-step1-triage.png'), fullPage: true });
  console.log('Saved 01-mobile-step1-triage.png');

  // Load drill
  await pageMobile.click('button:has-text("Load Highway Crash Drill")');
  await pageMobile.waitForTimeout(400);

  // Mobile Step 2: Evidence Vault
  await pageMobile.click('button:has-text("2. Evidence Vault")');
  await pageMobile.waitForTimeout(400);
  await pageMobile.screenshot({ path: path.join(outDir, '02-mobile-step2-evidence-vault.png'), fullPage: true });
  console.log('Saved 02-mobile-step2-evidence-vault.png');

  // Mobile Step 3: Tow Shield
  await pageMobile.click('button:has-text("3. Tow Shield")');
  await pageMobile.waitForTimeout(400);
  await pageMobile.screenshot({ path: path.join(outDir, '03-mobile-step3-tow-shield.png'), fullPage: true });
  console.log('Saved 03-mobile-step3-tow-shield.png');

  // Mobile Step 4: Incident Dossier Export
  await pageMobile.click('button:has-text("4. Incident Packet")');
  await pageMobile.waitForTimeout(400);
  await pageMobile.screenshot({ path: path.join(outDir, '04-mobile-step4-dossier-export.png'), fullPage: true });
  console.log('Saved 04-mobile-step4-dossier-export.png');

  await pageMobile.close();
  await contextMobile.close();

  await browser.close();
  await server.close();
  console.log('All screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Error running screenshot script:', err);
  process.exit(1);
});
