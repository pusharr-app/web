import { test, expect } from '@playwright/test';

test('Index', async ({ page }) => {
  await page.goto('/');
  const title = page.locator('h1');
  await expect(title).toHaveText('Push notifications for pirates');
});
