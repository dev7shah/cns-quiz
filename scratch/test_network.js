const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (!response.ok() && response.url().includes('_next/static')) {
      console.log(`FAILED JS REQUEST: ${response.url()} [${response.status()}]`);
    }
  });

  await page.goto('http://localhost:3000/modules/crypto', { waitUntil: 'networkidle' });
  console.log('Page loaded');
  await browser.close();
})();
