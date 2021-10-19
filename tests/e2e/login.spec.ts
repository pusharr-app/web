import { test, expect } from '@playwright/test';
import { generateUser, User } from './helpers';

test.describe('Login page:', () => {
  test.describe('When a user exist', () => {
    let user: User;

    test.beforeEach(async ({ page }) => {
      user = await generateUser(true);
      await page.goto('/login');
    });

    test('it logs in with the correct password', async ({ page }) => {
      await page.click('.firebaseui-idp-password');
      await page.fill('.firebaseui-id-email', user.email);
      await page.click('text=Next');
      await page.fill('.firebaseui-id-password', user.password);
      await page.click('.firebaseui-id-submit');
      await page.waitForTimeout(2000);

      const url = page.url();
      expect(url.endsWith('/dashboard')).toBeTruthy();
      const title = page.locator('h1');
      await expect(title).toHaveText('Dashboard');
    });

    test('it gets a warning when using the wrong password', async ({
      page,
    }) => {
      await page.click('.firebaseui-idp-password');
      await page.fill('.firebaseui-id-email', user.email);
      await page.click('text=Next');
      await page.fill('.firebaseui-id-password', 'wrong');
      await page.click('.firebaseui-id-submit');

      const title = page.locator('.firebaseui-id-password-error');
      await expect(title).toHaveText(
        "The email and password you entered don't match",
      );
    });
  });

  test.describe('When a user does not exist', () => {
    let user: User;

    test.beforeEach(async ({ page }) => {
      user = await generateUser(false);
      await page.goto('/login');
    });

    test('it shows a signup prompt', async ({ page }) => {
      await page.click('.firebaseui-idp-password');
      await page.fill('.firebaseui-id-email', user.email);
      await page.click('text=Next');

      const title = page.locator('.firebaseui-title');
      await expect(title).toHaveText('Create account');
    });

    test('it signs them up', async ({ page }) => {
      await page.click('.firebaseui-idp-password');
      await page.fill('.firebaseui-id-email', user.email);
      await page.click('text=Next');
      await page.fill('.firebaseui-id-new-password', user.password);
      await page.click('text=Save');
      await page.waitForTimeout(2000);

      const url = page.url();
      expect(url.endsWith('/dashboard')).toBeTruthy();
      const title = page.locator('h1');
      await expect(title).toHaveText('Dashboard');
    });
  });
});
