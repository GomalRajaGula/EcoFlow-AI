import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('renders email/password and toggle states', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /^masuk$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^masuk$/i }).last()).toBeVisible();

    await page.getByText('Daftar', { exact: true }).last().click();
    await expect(page.getByLabel('Nama lengkap')).toBeVisible();
    await expect(page.getByLabel('Nomor telepon')).toBeVisible();
    await expect(page.getByRole('button', { name: /^daftar$/i })).toBeVisible();
    await expect(page.getByText(/sudah punya akun/i)).toBeVisible();
  });

  test('validates required fields in browser', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /^masuk$/i }).click();
    await expect(page.getByLabel('Email')).toBeFocused();
  });
});