const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`PAGE CONSOLE [${msg.type()}]: ${msg.text()}`);
    } else {
      console.log(`PAGE CONSOLE [${msg.type()}]: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  page.on('requestfailed', request => {
    console.log(`FAILED REQUEST: ${request.url()} - ${request.failure().errorText}`);
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  console.log('Page loaded, attempting interactions...');
  await page.waitForTimeout(2000);

  const buttons = await page.$$('button');
  if (buttons.length > 0) {
    console.log(`Clicking ${await buttons[0].innerText()}...`);
    await buttons[0].click({ timeout: 2000 });
  }

  await browser.close();
})();
