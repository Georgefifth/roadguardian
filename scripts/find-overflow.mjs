import { chromium } from 'playwright';

async function findOverflow() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('https://safespace-hacks.vercel.app');
  await page.waitForTimeout(500);

  const overflows = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const bad = [];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 2) {
        bad.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          text: (el.textContent || '').slice(0, 50).trim(),
        });
      }
    }
    return bad;
  });

  console.log('Doc width: 390. Overflowing elements count:', overflows.length);
  console.log('Top overflowing elements:', overflows.slice(0, 10));

  await browser.close();
}

findOverflow().catch(console.error);
