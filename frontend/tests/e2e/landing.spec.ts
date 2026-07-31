import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('shows hero content and CTA links', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /kelola fermentasi eco-enzyme lebih cerdas/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /mulai sekarang/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /buat batch pertamamu/i })).toBeVisible();
    await expect(page.getByText(/platform inovatif untuk memonitor kesehatan fermentasi/i)).toBeVisible();
  });

  test('CTA menuju halaman login tersedia', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /mulai sekarang/i });
    await expect(cta).toHaveAttribute('href', '/login');
    await expect(page.getByRole('link', { name: /masuk/i })).toHaveAttribute('href', '/login');
  });
});
