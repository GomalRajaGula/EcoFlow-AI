# EcoFlow AI — Frontend

Next.js frontend untuk platform EcoFlow AI (ITechnoCup 2026).

## Getting Started

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Backend berjalan di `http://localhost:8000` (lihat `lib/api.ts` / `.env.local` untuk konfigurasi `NEXT_PUBLIC_API_URL`).

## Scripts

```bash
npm run lint       # ESLint
npm run build      # Production build
npm run test:e2e   # Playwright E2E (membutuhkan backend + frontend berjalan)
```

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Playwright (E2E)

## Konfigurasi

Salin `.env.example` → `.env.local` untuk konfigurasi lokal. Lihat `.env.example` untuk daftar variabel (mis. `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_FIREBASE_*`).
