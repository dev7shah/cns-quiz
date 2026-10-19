const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`PAGE CONSOLE [${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', error => console.log(`PAGE ERROR: ${error.message}`));
  
  await page.goto('http://localhost:3000/modules/ai', { waitUntil: 'networkidle' });
  console.log('Page loaded');
  
  const buttons = await page.$$('button');
  console.log(`Found ${buttons.length} buttons`);
  for (let i = 0; i < buttons.length; i++) {
    try {
      await buttons[i].click({ timeout: 1000 });
      console.log(`Clicked button ${i + 1}`);
      await page.waitForTimeout(500);
    } catch (e) {
      console.log(`Failed to click button ${i + 1}: ${e.message}`);
    }
  }
  
  await browser.close();
})();
