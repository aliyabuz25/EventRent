const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5050', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await page.evaluate(() => {
    const el = document.querySelector('.cl-eyebrow');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo(0, document.body.scrollHeight * 0.62);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/clients_viewport.png' });
  await browser.close();
  console.log('done');
})();
