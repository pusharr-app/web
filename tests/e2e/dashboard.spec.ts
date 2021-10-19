import { test, expect } from '@playwright/test';
import { generateUser, login, User } from './helpers';

test.describe('Dashboard:', () => {
  let user: User;

  test.describe('When the user is logged in', () => {
    test.beforeEach(async ({ page }) => {
      user = await generateUser(true);
      await page.goto('/dashboard');
      await login(page, user);
    });

    test('they should see the dashboard', async ({ page }) => {
      const title = page.locator('h1');
      await expect(title).toHaveText('Dashboard');
    });

    test('added events should be shown', async ({ page }) => {
      await Promise.all([
        page.click('#add-radarr-test-data'),
        page.click('#add-sonarr-test-data'),
      ]);

      await expect(page.locator('tbody tr')).toHaveCount(2);
    });
  });
});
