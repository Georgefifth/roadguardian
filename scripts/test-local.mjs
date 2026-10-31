import { chromium } from 'playwright';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLocal() {
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { port: 5178 },
  });
  await server.listen();
  console.log('Vite test server listening on http://localhost:5178');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5178');
  await page.waitForTimeout(500);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  console.log(`Local mobile 390px overflow: ${overflow}px`);

  await browser.close();
  await server.close();
}

testLocal().catch(console.error);
