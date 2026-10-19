const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const route = process.argv[2] || '/modules/ai';
  console.log(`Testing route: ${route}`);
  
  page.on('console', msg => {
    console.log(`PAGE CONSOLE [${msg.type()}]: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
  
  console.log('Page loaded, waiting for 5 seconds...');
  await page.waitForTimeout(5000);
  
  // Try to click "02 Try" tab
  const tabs = await page.$$('[role="tab"]');
  if (tabs.length > 1) {
    console.log(`Clicking tab: ${await tabs[1].innerText()}`);
    await tabs[1].click({ timeout: 1000 });
  }

  await browser.close();
})();
