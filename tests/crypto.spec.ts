import { test, expect } from '@playwright/test';

test.describe('Cryptography Module Tests', () => {
  test('Loads Cryptography module and verifies tabs', async ({ page }) => {
    await page.goto('/modules/crypto');
    await expect(page).toHaveTitle(/CNS Security Lab/);

    // Verify left sticky rail title
    await expect(page.locator('h1', { hasText: 'Cryptography' })).toBeVisible();

    // Verify all 5 tabs exist with new numbering
    await expect(page.locator('button', { hasText: '01 Learn' })).toBeVisible();
    await expect(page.locator('button', { hasText: '02 Try' })).toBeVisible();
    await expect(page.locator('button', { hasText: '03 Cost' })).toBeVisible();
    await expect(page.locator('button', { hasText: '04 Quiz' })).toBeVisible();
    await expect(page.locator('button', { hasText: '05 Recap' })).toBeVisible();

    // Verify Guided Lesson renders
    await expect(page.locator('h2', { hasText: 'Hashing: The One-Way Blender' })).toBeVisible();

    // Go to Try tab
    await page.locator('button', { hasText: '02 Try' }).click();
    await expect(page.locator('h3', { hasText: 'SHA-256 Hashing' })).toBeVisible();

    // Go to Cost tab
    await page.locator('button', { hasText: '03 Cost' }).click();
    await expect(page.locator('h3', { hasText: 'Cryptographic Complexity' })).toBeVisible();
  });

  test('Presenter Mode opens via button and keyboard shortcut', async ({ page }) => {
    await page.goto('/modules/crypto');
    
    // Click Present button
    await page.locator('button', { hasText: 'Present [P]' }).click();
    
    // Verify Presenter Mode UI renders
    await expect(page.locator('h1', { hasText: 'Hashing: The One-Way Blender' }).nth(0)).toBeVisible();
    await expect(page.locator('text=Step 1 of 3')).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    
    // Verify it closed
    await expect(page.locator('text=Step 1 of 3')).not.toBeVisible();

    // Trigger via P key
    await page.keyboard.press('P');
    await expect(page.locator('text=Step 1 of 3')).toBeVisible();

    // Toggle Speaker Notes
    await page.keyboard.press('s');
    await expect(page.locator('text=Speaker Notes')).toBeVisible();
    await page.keyboard.press('s');
    await expect(page.locator('text=Speaker Notes')).not.toBeVisible();
  });
});
