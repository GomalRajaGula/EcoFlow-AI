import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('renders email/password and toggle states', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^sign up$/i }).last()).toBeVisible();

    await page.getByRole('button', { name: /^sign up$/i }).last().click();
    await expect(page.getByRole('button', { name: /^sign up$/i }).first()).toBeVisible();
    await expect(page.getByText(/already have an account/i)).toBeVisible();
  });

  test('validates required fields in browser', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page.getByLabel('Email')).toBeFocused();
  });
});
