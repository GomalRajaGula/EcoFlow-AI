import { test, expect, Page } from '@playwright/test';

/**
 * Tes admin: membutuhkan backend berjalan dan Firebase user ber-role admin.
 *
 * Set env vars untuk menjalankan:
 *   E2E_ADMIN_EMAIL=<email-admin> E2E_ADMIN_PASSWORD=<password> npm run test:e2e
 *
 * Jika env vars tidak diset, seluruh describe ini di-skip (aman untuk CI).
 */

const E2E_ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const E2E_ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

const hasAdminCredentials = Boolean(E2E_ADMIN_EMAIL && E2E_ADMIN_PASSWORD);

async function signInAdmin(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(E2E_ADMIN_EMAIL!);
  await page.getByLabel('Password').fill(E2E_ADMIN_PASSWORD!);
  await page.getByRole('button', { name: /^masuk$/i }).click();
  await expect(page.getByRole('heading', { name: /^Halo / })).toBeVisible({ timeout: 30000 });
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible({ timeout: 30000 });
}

test.describe('Admin dashboard terautentikasi', () => {
  test.setTimeout(90000);
  test.skip(!hasAdminCredentials, 'Set E2E_ADMIN_EMAIL dan E2E_ADMIN_PASSWORD untuk menjalankan tes ini');

  test('memuat statistik komunitas dan model metrics', async ({ page }) => {
    await signInAdmin(page);

    await expect(page.getByText('Community Statistics')).toBeVisible();
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Total Batches')).toBeVisible();
    await expect(page.getByText('AI Model Metrics')).toBeVisible();
    await expect(page.getByText('Precision')).toBeVisible();
  });

  test('membuat dan menghapus product template', async ({ page }) => {
    await signInAdmin(page);

    const templateName = `E2E Template ${Date.now()}`;
    await page.getByLabel('Nama Template').fill(templateName);
    await page.getByLabel('Deskripsi').fill('Template dibuat oleh tes E2E');
    await page.getByLabel('Instruksi Pemrosesan').fill('Instruksi langkah demi langkah untuk E2E');
    await page.getByLabel('Peringatan Keamanan').fill('Gunakan sarung tangan');
    await page.getByRole('button', { name: /tambah template/i }).click();

    const templateCard = page.getByText(templateName);
    await expect(templateCard).toBeVisible({ timeout: 30000 });

    const card = templateCard.locator('..').locator('..');
    await card.getByRole('button', { name: /hapus/i }).click();
    await expect(templateCard).toBeHidden({ timeout: 15000 });
  });
});
