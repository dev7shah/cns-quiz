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
  if (content.includes("Loading AI Security Module...")) {
    console.log("FOUND 'Loading AI Security Module...' IN PAGE CONTENT!");
  } else {
    console.log("Did NOT find 'Loading AI Security Module...' in page content.");
  }

  // Find all buttons but don't click "Present [P]"
  const buttons = await page.$$('button');
  console.log(`Found ${buttons.length} buttons.`);
  
  for (let i = 0; i < buttons.length; i++) {
    try {
      const text = await buttons[i].innerText();
      if (text.includes('Present')) {
        console.log("Skipping Present button to avoid unmounting ModuleShell");
        continue;
      }
      console.log(`Clicking button: ${text.substring(0, 30)}`);
      await buttons[i].click({ timeout: 1000 });
      await page.waitForTimeout(200);
    } catch (e) {
      console.log(`Failed to click button ${i}: ${e.message.split('\\n')[0]}`);
    }
  }

  // Click tabs if they use div/span instead of button
  const tabs = await page.$$('[role="tab"]');
  console.log(`Found ${tabs.length} tabs.`);
  for (let i = 0; i < tabs.length; i++) {
    try {
      const text = await tabs[i].innerText();
      console.log(`Clicking tab: ${text.substring(0, 30)}`);
      await tabs[i].click({ timeout: 1000 });
      await page.waitForTimeout(200);
    } catch (e) {
      console.log(`Failed to click tab ${i}: ${e.message.split('\\n')[0]}`);
    }
  }

  await browser.close();
})();
