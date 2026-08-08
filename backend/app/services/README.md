# Backend Services — Dokumentasi Module

> Dokumentasi setiap service module di `backend/app/services/`.
> Service adalah lapisan business logic yang dipanggil oleh routes (lihat `backend/app/routes/README.md`).

## Daftar Services

| Module | Tanggung Jawab | Dependensi |
|--------|----------------|------------|
| `eco_enzyme.py` | Perhitungan rasio bahan eco-enzyme (1:3:10) | — (pure logic) |
| `fermentation_assistant.py` | Klasifikasi status fermentasi + health score + harvest alert | — (pure logic) |
| `product_recommendation.py` | Ranking rekomendasi produk berdasarkan kesesuaian karakteristik | SQLAlchemy (opsional) |
| `business_analysis.py` | Analisis kelayakan bisnis (COGS, SRP, margin, BEP, proyeksi 12 bulan) | — (pure logic) |
| `environmental_impact.py` | Perhitungan dampak lingkungan (CO₂, metana, air, setara pohon) | — (pure logic) |
| `roadmap.py` | Generate & track roadmap pengolahan produk per template | `app.models.base` |
| `report.py` | Generate PDF (business report, roadmap checklist) via ReportLab | reportlab |
| `admin.py` | Statistik komunitas, tren, metrik model untuk dashboard admin | SQLAlchemy |
| `storage.py` | Upload file ke MinIO (S3-compatible) | boto3, MinIO |

---

## 1. `eco_enzyme.py` — EcoEnzymeService

Rasio ideal eco-enzyme mengikuti formula standar **1 : 3 : 10** (gula : sampah : air).

### `calculate_ingredients(waste_kg, start_date=None) -> dict`
Menghitung bahan ideal dari berat sampah.

```
ideal_water = waste_kg × 3
ideal_sugar = waste_kg × 1
expected_harvest_date = start_date + 90 hari
```

**Return:**
```python
{
  "ideal_water_liters": float,       # air = 3× berat sampah
  "ideal_sugar_kg": float,           # gula = 1× berat sampah
  "expected_harvest_date": datetime  # +90 hari dari start
}
```

### `check_ingredient_deviation(waste_kg, user_water, user_sugar, threshold=0.1) -> dict`
Membandingkan input user dengan nilai ideal dan memberikan warning jika deviasi > threshold (default 10%).

**Return:**
```python
{
  "water_deviation": float,   # 0.0 - 1.0
  "sugar_deviation": float,   # 0.0 - 1.0
  "has_warning": bool,
  "warnings": [str, ...]
}
```

### Dipakai oleh
- `POST /api/v1/batches` (create batch) — untuk menghitung air & gula otomatis.

---

## 2. `fermentation_assistant.py` — FermentationAssistantService

AI klasifikasi status fermentasi. **Deterministic rule-based** (bukan ML eksternal) dengan weighted scoring.

### Kategori Nilai Input

| Parameter | Normal | Caution | Failed |
|-----------|--------|---------|--------|
| Aroma | `sweet`, `sour` | `slightly_rotten`, `unusual` | `strongly_rotten`, `moldy` |
| Warna | `brown`, `dark_brown`, `amber` | `unexpected_shift`, `unusual` | `black`, `green`, `white_mold` |
| Suhu | 20–30°C | di luar range | — |
| Gas (hari ≥ 7) | ada gelembung | tidak ada gelembung | — |

### `classify_fermentation(aroma, color, gas_presence, temperature_c, incubation_day, initial_ratio_ok=True) -> (str, float, str)`

Aturan klasifikasi:
1. **≥ 1 indikator Failed** → status `Failed`, confidence 0.9, saran restart batch.
2. **≥ 2 indikator Caution** → status `Caution`, confidence 0.7, saran korektif spesifik (suhu, aroma, warna).
3. **Selainnya** → status `Normal`, confidence 0.85.

**Return tuple:**
```python
(status: str,          # "Normal" | "Caution" | "Failed"
 confidence: float,    # 0.7 - 0.9
 suggestion: str)      # saran aksi korektif
```

### `calculate_health_score(status, confidence, days_elapsed) -> float (0-100)`

```
base_score:    Normal=80, Caution=50, Failed=10
confidence_bonus = confidence × 20 - 10
progress_bonus   = min(days_elapsed / 90 × 10, 10)
health_score = base + confidence_bonus + progress_bonus  # clamp 0-100
```

### `should_trigger_harvest_alert(status, incubation_day, gas_presence, aroma) -> bool`

True jika **semua** terpenuhi:
- `incubation_day` di 83–97 (jendela panen)
- status `Normal`
- ada gelembung gas **dan** aroma `sweet`/`sour`

### Dipakai oleh
- `POST /api/v1/batches/{batch_id}/logs` (create fermentation log).

---

## 3. `product_recommendation.py` — ProductRecommendationService

Ranking 8 template produk berdasarkan karakteristik akhir fermentasi.

### `calculate_compatibility(product_id, final_color, aroma_intensity, final_volume_liters, user_intent="household", templates=None) -> float (0-100)`

```
color_match  = _color_similarity()     # bobot 0.4
aroma_match  = _aroma_similarity()     # bobot 0.4
volume_match = min(volume / 10, 1.0)   # bobot 0.2
intent_bonus = 1.2 jika intent="commercial" dan produk bukan [6, 7] (Odor Neutralizer, Cosmetic Base)

score = (color×0.4 + aroma×0.4 + volume×0.2) × intent_bonus × 100
```

### Similarity Rules

**`_color_similarity(user, ideal)`**
- Sama persis → 1.0
- Grup sama (`brown`/`dark_brown`/`light_brown`, `amber`/`gold`/`honey`, `dark_brown`/`black`/`very_dark`) → 0.75
- Lainnya → 0.3

**`_aroma_similarity(user, ideal)`**
- Sama persis → 1.0
- `sweet`↔`fruity` atau `sour`↔`tangy` → 0.85
- Lainnya → 0.4

### `get_ranked_recommendations(final_color, aroma_intensity, final_volume_liters, user_intent="household", db=None) -> List[dict]`

Menghitung score untuk semua template (dari DB, fallback ke `PRODUCT_TEMPLATES_DEFAULT`), sort descending, return **top 8**.

### `PRODUCT_TEMPLATES_DEFAULT` (fallback tanpa DB)

| ID | Nama | Ideal pH | Aroma | Warna |
|----|------|----------|-------|-------|
| 1 | Household Cleaner | 3.0–4.0 | sour | brown |
| 2 | Disinfectant | 2.5–3.5 | sour | dark_brown |
| 3 | Liquid Fertilizer | 3.5–5.0 | sweet | amber |
| 4 | Pest Repellent | 3.0–4.0 | sour | brown |
| 5 | Drain Cleaner | 2.5–3.5 | sour | dark_brown |
| 6 | Odor Neutralizer | 3.5–5.0 | sweet | light_brown |
| 7 | Cosmetic Base | 4.0–5.5 | sweet | amber |
| 8 | Animal Feed Additive | 3.5–5.0 | sweet | light_brown |

### Dipakai oleh
- `POST /api/v1/batches/{batch_id}/recommendations` (lihat `routes/recommendations.py`).

---

## 4. `business_analysis.py` — BusinessAnalysisService

Analisis kelayakan bisnis produksi eco-enzyme.

### Pipeline `run_analysis(production_volume_liters, raw_material_cost, packaging_cost, labor_cost, overhead_cost, monthly_fixed_costs, regional_average_price=None) -> dict`

```
1. calculate_cogs      → total_cost, cogs_per_liter
2. calculate_srp       → cogs × 1.5; jika regional price ada → max(cogs×1.5, regional×0.9)
3. calculate_margins   → gross margin / liter, %, total revenue, total gross profit
4. calculate_break_even → units & revenue BEP (fixed_costs × 12)
5. calculate_12month_projection → monthly revenue/cogs/gross/net, yearly net, breakeven months
6. sensitivity_analysis → base / pessimistic / optimistic (±10%)
7. determine_viability → "Viable" | "Marginal" | "Not Viable"
```

### Rule Viability Rating

| Rating | Syarat |
|--------|--------|
| **Viable** | yearly_net_profit > 5000 **dan** gross_margin > 30% |
| **Marginal** | yearly_net_profit > 1000 **dan** gross_margin > 20% |
| **Not Viable** | selain di atas |

### Dipakai oleh
- `POST /api/v1/batches/{batch_id}/recommendations` (dengan intent commercial)
- `GET /api/v1/batches/{batch_id}/business-analysis`

---

## 5. `environmental_impact.py` — EnvironmentalImpactService

### Konstanta

| Konstanta | Nilai | Arti |
|-----------|-------|------|
| `CO2_PER_KG_WASTE` | 1.9 kg | CO₂ yang dihindari per kg sampah |
| `METHANE_PER_KG_WASTE` | 0.06 kg | Metana yang dihindari per kg sampah |
| `WATER_SAVED_PER_KG` | 5.0 L | Air yang dihemat per kg sampah |
| `EQUIVALENT_TREES_PER_TON_CO2` | 45 | Pohon setara per ton CO₂ |

### `calculate_batch_impact(waste_weight_kg) -> dict`
```python
{
  "co2_avoided_kg": float,
  "methane_avoided_kg": float,
  "water_saved_liters": float,
  "equivalent_trees_planted": float,  # (co2/1000) × 45
}
```

### `calculate_user_impact(total_waste_kg, total_batches) -> dict`
Gabungan batch impact + `total_batches` + `total_waste_diverted_kg`.

### `calculate_impact_summary(batches: list) -> dict`
Aggregate dari list batch object (memakai `waste_weight_kg`).

### Dipakai oleh
- `GET /api/v1/impact` (lihat `routes/impact.py`).

---

## 6. `roadmap.py` — RoadmapService

### `generate_roadmap(product_template_id, db) -> dict`

Generate step-by-step roadmap dari template produk:
- Step 1: Gathering Ingredients (dari `template.ingredients`)
- Step 2: Preparing Equipment (dari `template.equipment`)
- Step khusus per template id (1–8): dilution ratio, testing, patch test, dll.
- Fallback: "Processing" dari `template.processing_instructions`

**Return:** `{template_name, time_estimate_hours, safety_warnings, steps: [{title, description, details, completed}]}`

### `update_step_status(roadmap, step_index, completed, db) -> dict`

Update status step & recompute progress:
- 0 selesai → `not_started`
- Semua selesai → `completed` (+ set `completed_at`)
- Sebagian → `in_progress` (+ set `started_at` jika pertama kali)

### `get_progress_summary(roadmap) -> dict`

```python
{
  "id", "batch_id", "product_template_id",
  "status",                    # not_started | in_progress | completed
  "current_step", "total_steps", "completed_steps",
  "progress_percentage",       # 0-100
  "steps", "started_at", "completed_at"
}
```

### Dipakai oleh
- `POST /api/v1/batches/{batch_id}/roadmap`
- `PATCH /api/v1/roadmap/{roadmap_id}/steps/{step_index}`

---

## 7. `report.py` — ReportService

Generasi PDF dengan ReportLab (A4, Helvetica).

### `generate_business_report(batch_id, analysis_data) -> dict`
PDF berisi: Financial Summary (COGS, SRP, margin, BEP, yearly profit, viability), 12-Month Projection, Sensitivity Analysis.
**Return:** `{title, batch_id, generated_at, content: bytes}`

### `generate_roadmap_pdf(batch_id, roadmap_data) -> bytes`
PDF checklist roadmap: daftar step dengan checkbox `[x]`/`[ ]`, safety warnings, tutorial URL + QR code.
**Return:** raw PDF bytes.

### `generate_roadmap_report(batch_id, roadmap_data) -> dict`
Versi structured JSON report (bukan PDF) dengan sections: Product Strategy, Action Plan, Milestones & Timeline.

### Dipakai oleh
- `GET /api/v1/batches/{batch_id}/reports/business` (PDF download)
- `GET /api/v1/batches/{batch_id}/reports/roadmap`

---

## 8. `admin.py` — AdminService

Statistik untuk dashboard admin. Semua method menerima `db: Session`.

### `get_community_stats(db, community_id=None, start_date=None, end_date=None) -> dict`

```
{
  "total_users", "total_batches", "total_waste_processed_kg",
  "success_rate_percentage",          # % log dengan ai_status=Normal
  "normal_logs", "caution_logs", "failed_logs", "total_logs",
  "users_with_logs",
  "engagement": {
    "log_adoption_percentage",          # users_with_logs / total_users
    "recommendation_adoption_percentage",
    "roadmap_adoption_percentage",
    "average_logs_per_user",
  }
}
```

Filter opsional: `community_id`, rentang tanggal (inclusive start, exclusive end+1 hari).

### `get_community_trends(db, days=30, community_id=None) -> dict`
Tren harian `logs` & `success_rate_percentage` untuk N hari terakhir (`days` di-clamp 7–90). Mengisi tanggal kosong dengan 0.

### `get_model_metrics(db=None) -> dict`
Metrik AI: total predictions, distribusi status, success rate, average health score, uptime.

### Dipakai oleh
- Routes `admin.py` (hanya user dengan role admin, lihat `ADMIN_UIDS` env).

---

## 9. `storage.py` — upload_file_to_storage

### Konfigurasi (dari env)

| Env | Default |
|-----|---------|
| `MINIO_ENDPOINT` | `http://localhost:9000` |
| `MINIO_ACCESS_KEY` | `minioadmin` |
| `MINIO_SECRET_KEY` | `minioadmin` |
| `MINIO_BUCKET_NAME` | `ecoflow-bucket` |

### `ensure_bucket_exists()`
Membuat bucket jika belum ada + set policy public-read (GetObject untuk semua).

> **Catatan keamanan:** Policy public-read dibuat otomatis. Jika bucket berisi data sensitif, nonaktifkan policy ini (lihat SECURITY_HARDENING_REPORT.md).

### `async upload_file_to_storage(file: UploadFile, folder="general") -> str`

Proses:
1. Pastikan bucket ada.
2. Generate nama unik: `{folder}/{uuid4}{ext}`.
3. `put_object` ke MinIO dengan ContentType asli.
4. Return URL publik: `{MINIO_ENDPOINT}/{BUCKET}/{key}`.

### Dipakai oleh
- `POST /api/v1/upload` (image upload, folder `users/{user_id}/logs`).

---

## Menambahkan Service Baru

1. Buat file `backend/app/services/<nama>.py`.
2. Gunakan `@staticmethod` atau `@classmethod` pada method (tidak ada instance state).
3. Tulis docstring + tipe return (lihat pola di atas).
4. Jangan import `Session` dari routes — terima `db` sebagai parameter agar mudah di-test.
5. Tambahkan unit test di `backend/tests/` (lihat TESTING.md).
6. Update README ini dengan entry baru.
