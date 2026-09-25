const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5050', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  
  // Find the logo strip specifically
  const logoStrip = await page.$('.cl-eyebrow');
  if (logoStrip) {
    const section = await page.evaluateHandle(el => el.closest('section'), logoStrip);
    await section.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    // Now scroll down more to see the logo strip at bottom of section
    await page.evaluate(() => {
      const el = document.querySelector('.cl-eyebrow');
      if (el) {
        const section = el.closest('section');
        const rect = section.getBoundingClientRect();
        // Scroll to show bottom of section (logo strip)
        window.scrollBy(0, rect.height - 400);
      }
    });
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: '/tmp/logos_strip.png' });
  await browser.close();
  console.log('done');
})();
