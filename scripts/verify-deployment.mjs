import { chromium } from 'playwright';

async function verifyDeployed() {
  console.log('Verifying deployed app at https://safespace-hacks.vercel.app ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  const resp = await page.goto('https://safespace-hacks.vercel.app');
  console.log('Deployed HTTP status:', resp.status());
  await page.waitForTimeout(800);

  const title = await page.title();
  console.log('Page title:', title);

  // Click Practice Drill
  await page.click('button:has-text("Load Highway Crash Drill")');
  await page.waitForTimeout(600);

  // Check Step 1 GPS coordinates
  const step1Text = await page.textContent('body');
  const hasCoordinates = step1Text.includes('37.7749') && step1Text.includes('-122.4194');
  console.log('Step 1 contains GPS coordinates (37.7749, -122.4194):', hasCoordinates);

  // Go to step 2 (Evidence Vault)
  await page.click('button:has-text("2. Evidence Vault")');
  await page.waitForTimeout(600);

  // Read driver name input value
  const driverName = await page.inputValue('input[placeholder*="John Doe"]');
  console.log('Step 2 Driver Name input value:', driverName);

  // Read license plate input value
  const plateVal = await page.inputValue('input[placeholder="PLATE #"]');
  console.log('Step 2 License Plate input value:', plateVal);

  // Read VIN input value
  const vinVal = await page.inputValue('input[placeholder*="1HGCR2F83HA019284"]');
  console.log('Step 2 VIN input value:', vinVal);

  // Go to step 3 (Tow Shield)
  await page.click('button:has-text("3. Tow Shield")');
  await page.waitForTimeout(600);
  const towCompany = await page.inputValue('input[placeholder*="City Fleet Towing"]');
  console.log('Step 3 Tow Company input value:', towCompany);
  const step3Text = await page.textContent('body');
  console.log('Step 3 Anti-Extortion Shield visible:', step3Text.includes('Bandit Tow Truck Defense Shield'));

  // Go to step 4 (Incident Packet / Dossier)
  await page.click('button:has-text("4. Incident Packet")');
  await page.waitForTimeout(600);
  const dossierText = await page.textContent('body');
  console.log('Step 4 contains SHA-256 seal:', dossierText.includes('Cryptographic Integrity Seal (SHA-256)'));
  console.log('Step 4 contains US-101 location:', dossierText.includes('US-101 Southbound'));
  console.log('Step 4 contains Marcus Vance:', dossierText.includes('Marcus Vance'));
  console.log('Console errors count:', errors.length);

  await browser.close();

  if (hasCoordinates && driverName === 'Marcus Vance' && plateVal === '8XYZ419' && errors.length === 0) {
    console.log('✓ ALL CRITICAL CHECKS PASSED ON PRODUCTION DEPLOYMENT!');
  } else {
    throw new Error('Production verification failed assertions');
  }
}

verifyDeployed().catch((err) => {
  console.error(err);
  process.exit(1);
});
