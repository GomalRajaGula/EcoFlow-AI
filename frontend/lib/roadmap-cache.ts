const STORAGE_KEY = 'ecoflow.roadmap-cache';

/** Entri cache roadmap per batch di localStorage. */
interface CachedRoadmap {
  batchId: number;
  productTemplateId: number;
  data: unknown;
  cachedAt: string;
}

/** Membaca seluruh cache roadmap dari localStorage (aman untuk SSR). */
function readCache(): Record<string, CachedRoadmap> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Menyimpan seluruh cache roadmap ke localStorage. */
function writeCache(cache: Record<string, CachedRoadmap>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
}

/** Menyimpan roadmap suatu batch ke cache lokal (key: batchId). */
export function cacheRoadmap(batchId: number, productTemplateId: number, data: unknown) {
  const cache = readCache();
  cache[String(batchId)] = {
    batchId,
    productTemplateId,
    data,
    cachedAt: new Date().toISOString(),
  };
  writeCache(cache);
}

/** Mengambil roadmap ter-cache untuk batch, atau null jika belum ada. */
export function getCachedRoadmap(batchId: number): CachedRoadmap | null {
  const cache = readCache();
  const entry = cache[String(batchId)];
  return entry || null;
}

/** Menghapus cache roadmap untuk batch (dipanggil saat data berubah). */
export function invalidateRoadmapCache(batchId: number) {
  const cache = readCache();
  delete cache[String(batchId)];
  writeCache(cache);
}
