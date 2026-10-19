const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`PAGE CONSOLE [${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', error => console.log(`PAGE ERROR: ${error.message}`));
  
  await page.goto('https://cns-quiz-eight.vercel.app/modules/ai', { waitUntil: 'networkidle' });
  console.log('Page loaded');
  await page.waitForTimeout(2000);
  
  const presentBtn = await page.getByText('Present [P]');
  if (await presentBtn.count() > 0) {
    console.log('Clicking Present [P]...');
    await presentBtn.click();
    await page.waitForTimeout(1000);
    
    // Check if Presenter Mode opened
    const presenterMode = await page.getByText('ESC to Exit');
    if (await presenterMode.count() > 0) {
      console.log('Presenter Mode OPENED SUCCESSFULLY!');
    } else {
      console.log('Presenter Mode DID NOT OPEN!');
    }
  } else {
    console.log('Present button not found!');
  }
  
  await browser.close();
})();
