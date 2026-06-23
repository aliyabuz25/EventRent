const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5050', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  
  // Find and scroll to end of HomeClients section (logo strip area)
  await page.evaluate(() => {
    const el = document.querySelector('.cl-eyebrow');
    if (el) {
      const section = el.closest('section');
      if (section) {
        const rect = section.getBoundingClientRect();
        const bottomY = window.pageYOffset + rect.bottom - 400;
        window.scrollTo(0, bottomY);
      }
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/logos_bottom.png' });
  await browser.close();
  console.log('done');
})();
