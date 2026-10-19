const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));

  // Test module tabs
  await page.goto('http://localhost:3000/modules/crypto', { waitUntil: 'networkidle' });
  const tabs = await page.$$eval('[role=tab]', els => els.map(e => e.textContent));
  console.log('Tab buttons found:', tabs);

  // Click "02 Try" tab
  const tryTab = page.locator('[role=tab]', { hasText: '02 Try' });
  await tryTab.click();
  await page.waitForTimeout(500);
  const playgroundVisible = await page.isVisible('text=SHA-256');
  console.log('Playground visible after tab click:', playgroundVisible);

  // Check active tab
  const activeTab = await page.$eval('[data-state=active]', el => el.textContent).catch(() => 'N/A');
  console.log('Active tab after click:', activeTab);

  // Check quiz play page buttons
  await page.goto('http://localhost:3000/quiz', { waitUntil: 'networkidle' });
  const btns = await page.$$eval('button', els => els.map(e => ({ text: e.textContent, visible: e.offsetParent !== null })));
  console.log('Quiz setup buttons:', btns.slice(0, 10));

  console.log('Errors:', errors);
  await browser.close();
})();
