import { test, expect } from '@playwright/test';

const MODULES = ['crypto', 'auth', 'firewall', 'cloud', 'attacks', 'ids', 'tls', 'ai'];
const TABS = ['Learn', 'Playground', 'Complexity', 'Quiz', 'Cheat Sheet'];

test.describe('Smoke Tests for CNS Security Lab', () => {
  // Capture console errors
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console Error: "${msg.text()}"`);
      }
    });
    page.on('pageerror', exception => {
      console.log(`Page Error: "${exception}"`);
    });
    page.on('requestfailed', request => {
      console.log(`Request Failed: "${request.url()}" - ${request.failure()?.errorText}`);
    });
  });

  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CNS Security Lab/);
    await expect(page.locator('text=CNS Security Lab').first()).toBeVisible();
  });

  test('Visit all modules and their tabs', async ({ page }) => {
    for (const mod of MODULES) {
      await page.goto(`/modules/${mod}`);
      // Wait for network idle to ensure module is loaded
      await page.waitForLoadState('networkidle');
      
      // Click through all tabs
      for (const tab of TABS) {
        const tabLocator = page.locator(`button:has-text("${tab}")`);
        if (await tabLocator.isVisible()) {
          await tabLocator.click();
          // Short wait for tab content to render
          await page.waitForTimeout(200);
        }
      }
    }
  });

  test('Quiz flow completes without crashing', async ({ page }) => {
    await page.goto('/quiz');
    // We expect the setup screen
    // Let's click "Start Quick Match"
    const startButton = page.locator('button:has-text("Start Quick Match")');
    if (await startButton.isVisible()) {
      await startButton.click();
    }
    
    // Check if we are in the quiz
    await page.waitForTimeout(1000); // Wait for potential state changes
    // Just a basic check that it doesn't hard crash
    expect(await page.locator('body').innerText()).toContain('Team');
  });

  test('Revision Hub flashcards render', async ({ page }) => {
    await page.goto('/revision');
    const flipButton = page.locator('button:has-text("Flip")');
    if (await flipButton.isVisible()) {
      await flipButton.click();
    }
    // Make sure no crash
    await page.waitForTimeout(500);
  });
});
