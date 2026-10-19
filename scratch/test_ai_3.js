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
  
  console.log('Page loaded, attempting interactions...');
  await page.waitForTimeout(2000);

  const content = await page.content();
  const index = content.indexOf('Loading');
  if (index !== -1) {
    console.log("Found Loading text!");
    console.log(content.substring(Math.max(0, index - 200), Math.min(content.length, index + 200)));
  } else {
    console.log("No Loading text found.");
  }
  
  // Just click the first button to see if it does anything.
  const buttons = await page.$$('button');
  if (buttons.length > 0) {
    console.log(`Clicking ${await buttons[0].innerText()}...`);
    await buttons[0].click({ timeout: 2000 });
  }

  await browser.close();
})();
