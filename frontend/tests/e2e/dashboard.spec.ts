import { test, expect, Page } from '@playwright/test';

/**
 * Tes terautentikasi: membutuhkan backend berjalan di http://localhost:8000
 * (PostgreSQL + `./venv/bin/python -m uvicorn app.main:app`) dan Firebase test user.
 *
 * Set env vars untuk menjalankan:
 *   E2E_EMAIL=<email-firebase-test-user> E2E_PASSWORD=<password> npm run test:e2e
 *
 * Jika env vars tidak diset, seluruh describe ini di-skip (aman untuk CI).
 */

const E2E_EMAIL = process.env.E2E_EMAIL;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

const hasCredentials = Boolean(E2E_EMAIL && E2E_PASSWORD);

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

async function signIn(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(E2E_EMAIL!);
  await page.getByLabel('Password').fill(E2E_PASSWORD!);
  await page.getByRole('button', { name: /^masuk$/i }).click();
  await expect(page.getByRole('heading', { name: /^Halo / })).toBeVisible({ timeout: 15000 });
}

async function createBatch(page: Page, name: string) {
  await page.getByRole('button', { name: /mulai batch baru/i }).click();
  await page.getByLabel('Nama Batch').fill(name);
  await page.getByLabel('Berat Limbah (kg)').fill('2');
  await page.getByLabel('Tanggal Mulai').fill(today());
  await page.getByRole('button', { name: /^buat batch$/i }).click();
  const card = page.locator('.chakra-card').filter({ hasText: name });
  await expect(card).toBeVisible({ timeout: 30000 });
  return card;
}

test.describe('Dashboard terautentikasi', () => {
  test.skip(!hasCredentials, 'Set E2E_EMAIL dan E2E_PASSWORD untuk menjalankan tes ini');

  test('sign-in dan melihat statistik dashboard', async ({ page }) => {
    await signIn(page);

    await expect(page.getByText('Total Batch')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Batch Aktif' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Batch Selesai' })).toBeVisible();
    await expect(page.getByText('Total Limbah Diproses')).toBeVisible();
    await expect(page.getByText('CO₂ Dihindari (estimasi)')).toBeVisible();
  });

  test('membuat batch fermentasi dengan rasio air/gula dihitung otomatis', async ({ page }) => {
    await signIn(page);

    const card = await createBatch(page, `E2E Batch ${Date.now()}`);
    await expect(card.getByText('6 L')).toBeVisible();
    await expect(card.getByText('2 kg')).toHaveCount(2);
  });

  test('mendapatkan rekomendasi produk setelah harvest dan memilih produk untuk roadmap', async ({ page }) => {
    await signIn(page);

    const card = await createBatch(page, `E2E Rekom ${Date.now()}`);
    await card.getByRole('button', { name: /dapatkan rekomendasi produk/i }).click();
    await page.getByLabel('Volume Panen (Liter)').fill('5');
    await page.getByRole('button', { name: /^dapatkan rekomendasi$/i }).click();

    await expect(page.getByText('Produk yang Direkomendasikan:')).toBeVisible({ timeout: 15000 });
    const firstProduct = page.getByRole('button', { name: /pilih untuk roadmap/i }).first();
    await firstProduct.click();
    await expect(page.getByText(/✓ terpilih/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('menjalankan analisis bisnis dan melihat hasil kelayakan', async ({ page }) => {
    await signIn(page);

    const card = await createBatch(page, `E2E Analisis ${Date.now()}`);
    await card.getByRole('button', { name: /analisis bisnis/i }).click();
    await page.getByLabel('Nama Produk').fill('Pembersih Eco-Enzyme E2E');
    await page.getByLabel('Volume Produksi (Liter)').fill('100');
    await page.getByLabel('Bahan Baku (Rp)').fill('100000');
    await page.getByLabel('Kemasan (Rp)').fill('50000');
    await page.getByLabel('Tenaga Kerja (Rp)').fill('30000');
    await page.getByLabel('Biaya Operasional (Rp)').fill('20000');
    await page.getByLabel('Biaya Tetap Bulanan (Rp)').fill('500000');
    await page.getByRole('button', { name: /jalankan analisis/i }).click();

    await expect(page.getByText('Hasil Analisis:')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Kelayakan:')).toBeVisible();
  });

  test('membuka modal catatan fermentasi dan roadmap', async ({ page }) => {
    await signIn(page);

    const card = await createBatch(page, `E2E Modal ${Date.now()}`);

    await card.getByRole('button', { name: /tambah catatan fermentasi/i }).click();
    await expect(page.getByText(/Catatan Fermentasi - /).first()).toBeVisible();
    await page.getByRole('button', { name: 'Tutup dialog catatan fermentasi' }).click();

    await card.getByRole('button', { name: /lihat roadmap pemrosesan/i }).click();
    await expect(page.getByRole('button', { name: 'Tutup dialog roadmap' })).toBeVisible({ timeout: 15000 });
  });

  test('mencatat fermentasi lengkap dengan foto dan melihat prediksi AI', async ({ page }) => {
    await signIn(page);

    const card = await createBatch(page, `E2E Log ${Date.now()}`);
    await card.getByRole('button', { name: /tambah catatan fermentasi/i }).click();

    await page.getByLabel('Suhu (°C)').fill('27');
    await page.getByLabel('Catatan', { exact: true }).fill('E2E observation with photo');
    await page.locator('#observation-photo').setInputFiles('tests/e2e/fixtures/sample.png');
    await expect(page.getByAltText('Preview')).toBeVisible();

    await page.getByRole('button', { name: /simpan catatan/i }).click();
    await expect(page.getByText('Health Score:')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Saran:')).toBeVisible();

    await expect(page.getByRole('button', { name: /simpan catatan/i })).toBeHidden({ timeout: 10000 });
  });

  test('menyimpan catatan offline lalu menyinkronkan saat online', async ({ page, context }) => {
    await signIn(page);

    const card = await createBatch(page, `E2E Offline ${Date.now()}`);

    await context.setOffline(true);
    await card.getByRole('button', { name: /tambah catatan fermentasi/i }).click();
    await page.getByLabel('Catatan', { exact: true }).fill('E2E offline queued log');
    await page.getByRole('button', { name: /simpan catatan/i }).click();

    await expect(page.getByText(/disimpan offline/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /simpan catatan/i })).toBeHidden({ timeout: 10000 });

    const queued = await page.evaluate(
      () => JSON.parse(localStorage.getItem('ecoflow.pending-fermentation-logs') || '[]').length
    );
    expect(queued).toBe(1);

    await context.setOffline(false);
    await page.waitForFunction(
      () => JSON.parse(localStorage.getItem('ecoflow.pending-fermentation-logs') || '[]').length === 0,
      undefined,
      { timeout: 15000 }
    );
  });

  test('roadmap tersimpan di cache dan tetap tampil saat offline', async ({ page, context }) => {
    await signIn(page);

    const card = await createBatch(page, `E2E Cache ${Date.now()}`);

    await card.getByRole('button', { name: /lihat roadmap pemrosesan/i }).click();
    await expect(page.getByRole('button', { name: 'Unduh Checklist PDF' })).toBeVisible({ timeout: 20000 });
    await page.getByRole('button', { name: 'Tutup dialog roadmap' }).click();

    const cachedCount = await page.evaluate(
      () => Object.keys(JSON.parse(localStorage.getItem('ecoflow.roadmap-cache') || '{}')).length
    );
    expect(cachedCount).toBeGreaterThan(0);

    await context.setOffline(true);
    await card.getByRole('button', { name: /lihat roadmap pemrosesan/i }).click();
    await expect(page.getByText(/mode offline/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Unduh Checklist PDF' })).toBeVisible({ timeout: 10000 });
  });
});
