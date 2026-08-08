import apiClient from '@/lib/api';

/** Fermentation log yang gagal dikirim saat offline, disimpan untuk sync ulang. */
export interface PendingFermentationLog {
  id: string;
  batchId: number;
  payload: Record<string, unknown>;
  createdAt: string;
}

const STORAGE_KEY = 'ecoflow.pending-fermentation-logs';

/** Membaca antrian pending logs dari localStorage (aman untuk SSR). */
function readQueue(): PendingFermentationLog[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Menyimpan antrian pending logs ke localStorage. */
function writeQueue(queue: PendingFermentationLog[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

/**
 * Menambahkan fermentation log ke antrian offline.
 * Dipanggil saat request API gagal (offline) agar data tidak hilang.
 */
export function enqueueFermentationLog(batchId: number, payload: Record<string, unknown>) {
  const queue = readQueue();
  queue.push({
    id: crypto.randomUUID(),
    batchId,
    payload,
    createdAt: new Date().toISOString(),
  });
  writeQueue(queue);
}

/**
 * Mengirim ulang semua pending logs ke server.
 * @returns Jumlah log yang berhasil disinkronkan.
 */
export async function syncPendingFermentationLogs() {
  if (typeof window === 'undefined' || !navigator.onLine) return 0;
  const queue = readQueue();
  if (!queue.length) return 0;

  const remaining: PendingFermentationLog[] = [];
  let synced = 0;
  for (const item of queue) {
    try {
      await apiClient.post(`/api/v1/batches/${item.batchId}/logs`, item.payload);
      synced += 1;
    } catch {
      remaining.push(item);
    }
  }
  writeQueue(remaining);
  return synced;
}

/**
 * Subscribe ke event 'online' browser untuk auto-sync.
 * @returns Fungsi cleanup (unsubscribe).
 */
export function subscribeToOnlineSync(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}
