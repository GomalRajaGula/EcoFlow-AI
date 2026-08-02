import { test, expect } from '@playwright/test';

test.describe('Auth route guards', () => {
  test('dashboard redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('admin page redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('login page is reachable and renders auth form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /^masuk$/i })).toBeVisible();
  });
});
