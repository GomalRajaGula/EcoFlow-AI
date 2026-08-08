# CHANGELOG.md: EcoFlow AI

> Semua perubahan penting pada proyek EcoFlow AI.
> Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/) dan semantik versioning ([SemVer](https://semver.org/)).

---

## [Unreleased]

### Added
- Dokumentasi operasional lengkap: `DEPLOYMENT.md`, `OPERATIONS.md`, `MONITORING.md`, `LICENSE`
- Dokumentasi teknis: `DATA_DICTIONARY.md`, `ALGORITHM_DOCUMENTATION.md`, `TESTING_GUIDE.md`, `DEVELOPMENT.md`, `FIREBASE_INTEGRATION.md`, `USER_MANUAL.md`, `ADMIN_MANUAL.md`, `PRIVACY_POLICY.md`, `TERMS_OF_SERVICE.md`, `CHANGELOG.md`
- README dokumentasi per-module: `backend/app/services/README.md`, `backend/app/routes/README.md`, `frontend/components/README.md`

---

## [0.2.0] - 2026-08-03

### Added
- Redesign sidebar: interactive nav, hover states, collapsed tooltips
- Detailed sign-up flow (name/email/phone/password) + Google logo
- Auth-aware landing page
- Select-product wiring ke recommendation modal (pick product for roadmap)
- Offline roadmap cache (localStorage)
- Photo upload + offline sync E2E tests (17 total)

### Fixed
- Font preload warning
- Scroll-behavior warning
- E2E flakiness: exact Password label match, loopback rate-limit exemption, correct admin creds
- CORS untuk localhost:3001
- `.env` auto-load

### Changed
- Light-friendly dashboard color palette

### Tests
- Playwright E2E: 17/17 passing (landing, login, auth guards, dashboard, admin)

---

## [0.1.2] - 2026-08-01

### Added
- FR-9: product templates diambil dari database (tidak hanya hardcoded)
- FR-1: deviation warning endpoint (`POST /api/v1/check-ingredient-ratio`)
- Community dashboard dengan region filtering dan CSV compliance export (`/api/v1/admin/*`)
- Env-config CORS/TrustedHost, Redis-backed rate limiting, security tests, CI/CD pipeline
- Backup, retention cleanup, dan user deletion compliance scripts
- Image upload ke MinIO untuk fermentation logs
- Admin: komunitas, template produk (CRUD + import pricing), model metrics, user roles

### Fixed
- CRITICAL + HIGH audit findings (lihat `SECURITY_HARDENING_REPORT.md`)
- Secret files dihapus dari tracking + update `.gitignore`
- Duplicate schema definitions di `base.py`

### Security
- Security headers (X-Frame-Options, CSP, HSTS, dll)
- Rate limiting (60 req/min/IP, configurable via env)
- TrustedHost middleware + CORS whitelist production

### Tests
- Unit + integration: eco enzyme, fermentation assistant, ratio API, security (headers/CORS/rate limit)
- E2E: expanded ke 14–16 test (auth guards, dashboard flows, admin, photo upload, offline sync)

---

## [0.1.1] - 2026-07-31

### Added
- Image upload ke MinIO untuk fermentation logs
- Migration: `selected_product_id` di `fermentation_batches`, `image_url` di `fermentation_logs`

### Fixed
- Duplicate schema definitions di `base.py`
- Secret files dihapus dari git tracking (`.gitignore` diperbarui)

---

## [0.1.0] - 2026-07-29

### Added — MVP Lengkap

**Backend (FastAPI):**
- Endpoints batch: create, list, detail, logs (create/list)
- AI Fermentation Assistant: klasifikasi status (Normal/Caution/Failed), health score, harvest alert
- Product Recommendation: compatibility scoring + ranking top 8
- Business Analysis: COGS, SRP, margins, break-even, proyeksi 12 bulan, sensitivity, viability rating
- Environmental Impact: CO₂, metana, air, setara pohon
- Roadmap: generate per template, step tracking, PDF download (dengan QR code)
- Report: business report PDF, roadmap checklist PDF
- Firebase Auth integration + auto-register user
- Rate limiting (in-memory)
- Security headers + CORS + TrustedHost

**Frontend (Next.js 15 + Chakra UI):**
- Landing page, login (email/password + Google), dashboard
- Batch cards, create batch modal, fermentation log modal
- Product recommendation modal, business analysis modal, roadmap modal
- Milestones panel, responsive design

**Infrastructure:**
- PostgreSQL 16 + MinIO + Docker Compose
- Alembic migrations
- CI/CD (GitHub Actions): backend tests + frontend lint/build
- Dokumentasi lengkap (PRD, Architecture, API, Database, dll.)

### Fixed
- Critical MVP bugs: harvest date calculation, health score, intent bonus, recommendation upsert, validasi input
- 422/400 validasi yang salah untuk payload valid

### Known Issues (saat rilis)
- Rate limiter in-memory tidak konsisten antar worker (solved di 0.2.0 dengan Redis)
- Product templates hardcoded di service (solved di 0.1.2 dengan DB)

---

## Format Entri Changelog (untuk kontributor)

```
### Added       — Fitur baru
### Changed     — Perubahan perilaku yang ada
### Deprecated  — Fitur yang akan dihapus
### Removed     — Fitur yang dihapus
### Fixed       — Bug fix
### Security    — Perbaikan keamanan
### Tests       — Perubahan/penambahan test
```

**Aturan:**
1. Buat entri `[Unreleased]` saat menambah perubahan, pindahkan ke rilis saat versi dirilis.
2. Version bump: `0.1.0` (initial) → `0.2.0` (fitur) → `1.0.0` (production launch).
3. Referensikan issue/PR number jika ada.
