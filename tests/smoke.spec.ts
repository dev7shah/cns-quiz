import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/quiz',
  '/revision',
  '/modules/crypto',
  '/modules/auth',
  '/modules/firewall',
  '/modules/cloud',
  '/modules/attacks',
  '/modules/ids',
  '/modules/tls',
  '/modules/ai'
];

for (const route of routes) {
  test(`Route ${route} should not have console errors and buttons should work`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        // Ignore next-dev/turbopack warnings
        if (!msg.text().includes('Fast Refresh') && !msg.text().includes('turbopack')) {
          errors.push(`[${msg.type()}] ${msg.text()}`);
        }
      }
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });

    if (errors.length > 0) {
      throw new Error(`Console errors found on ${route}: ${errors.join('\\n')}`);
    }

    // Try to click every button to verify interaction (skip links that navigate away from domain for testing)
    const buttons = await page.$$('button');
    for (let i = 0; i < buttons.length; i++) {
      try {
        await buttons[i].click({ timeout: 1000 });
        await page.waitForTimeout(200); // Wait for potential state changes or errors
      } catch (e: any) {
        // It's expected that some buttons might unmount others (e.g. tabs) or be covered
        if (!e.message.includes('not attached to the DOM') && !e.message.includes('intercepts pointer events')) {
          console.log(`Failed to click button ${i} on ${route}: ${e.message}`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Console errors found after interaction on ${route}: ${errors.join('\\n')}`);
    }
  });
}
