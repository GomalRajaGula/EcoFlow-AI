# 🌱 EcoFlow AI - Smart Eco-Enzyme Fermentation Assistant

> AI-powered fermentation monitoring and product recommendation platform untuk mengoptimalkan proses pembuatan eco-enzyme.

## 🎯 Apa Itu EcoFlow?

EcoFlow adalah aplikasi web yang membantu Anda:
- **Memantau fermentasi** dengan analisis real-time menggunakan AI
- **Membuat rekomendasi produk** berdasarkan karakteristik hasil fermentasi
- **Menganalisis kelayakan bisnis** dengan perhitungan cost, harga, dan proyeksi profit
- **Mengelola batch fermentasi** dari awal hingga panen

Didesain untuk skala rumahan hingga komersial, cocok untuk entrepreneur eco-enzyme.

---

## 🚀 Quick Start (5 Menit)

### Prerequisites
- Node.js 18+
- Python 3.14+
- npm/yarn

### Setup Lokal

**1. Clone Repository**
```bash
git clone https://github.com/GomalRajaGula/EcoFlow-AI.git
cd EcoFlow-AI
```

**2. Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # atau: venv\Scripts\activate (Windows)
pip install -r requirements.txt
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
```

**4. Run Dev Servers**

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**5. Akses Aplikasi**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📱 Cara Pakai

### 1. **Login/Sign Up**
- Buka http://localhost:3000/login
- Buat akun baru atau login dengan email
- Dashboard akan terbuka otomatis setelah login

### 2. **Buat Batch Baru**
- Klik "Create New Batch"
- Isi:
  - **Batch Name**: Nama batch (misal: "Kitchen Waste - July")
  - **Waste Weight (kg)**: Berat sampah organik (misal: 10 kg)
  - **Start Date**: Tanggal mulai fermentasi
- Sistem otomatis hitung kebutuhan air dan gula
- Klik "Create Batch"

### 3. **Catat Progress Fermentasi**
- Di dashboard, klik batch yang aktif
- Klik "Add Fermentation Log"
- Isi observasi:
  - **Log Date**: Tanggal pencatatan
  - **Aroma**: Pilih (Sweet, Sour, Fruity, dll)
  - **Color**: Pilih warna liquid
  - **Gas Presence**: Ada gelembung atau tidak
  - **Temperature**: Suhu ruangan fermentasi
- AI akan otomatis memprediksi status fermentasi (Normal/Caution/Failed)

### 4. **Dapatkan Rekomendasi Produk**
- Setelah fermentasi selesai, klik "Get Product Recommendations"
- Isi:
  - **Harvest Volume**: Jumlah liquid hasil panen (liter)
  - **Final Color**: Warna akhir
  - **Aroma Intensity**: Intensitas aroma
  - **Intent**: Household atau Commercial
- Sistem merekomendasikan 8 produk dengan skor kesesuaian

### 5. **Analisis Bisnis**
- Klik "Business Analysis" pada batch
- Isi detail biaya:
  - **Product Name**: Nama produk yang akan dijual
  - **Production Volume**: Berapa liter produksi
  - **Cost Structure**: Biaya bahan baku, packaging, labor, overhead
  - **Monthly Fixed Costs**: Biaya tetap per bulan
- Sistem akan hitung:
  - COGS (Cost of Goods Sold) per unit
  - Harga jual yang disarankan
  - Profit margin %
  - Break-even point
  - Proyeksi 6 bulan ke depan

---

## 🏗️ Struktur Aplikasi

```
EcoFlow-AI/
├── backend/                 # Python FastAPI server
│   ├── app/
│   │   ├── main.py         # API endpoints utama
│   │   ├── routes/         # Route handlers (recommendations, etc)
│   │   ├── services/       # Business logic
│   │   │   ├── eco_enzyme.py           # Perhitungan rasio bahan
│   │   │   ├── fermentation_assistant.py   # AI klasifikasi status
│   │   │   ├── product_recommendation.py   # Ranking produk
│   │   │   └── business_analysis.py        # Kalkulasi bisnis
│   │   ├── models/         # Database schemas
│   │   ├── schemas/        # Request/response formats
│   │   └── core/           # Auth, database, Firebase
│   ├── tests/              # Unit tests
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js React app
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── login/          # Auth page
│   │   └── dashboard/      # Main dashboard
│   ├── components/         # Reusable UI components
│   │   ├── BatchCard.tsx
│   │   ├── CreateBatchModal.tsx
│   │   ├── FermentationLogModal.tsx
│   │   ├── ProductRecommendationModal.tsx
│   │   └── BusinessAnalysisModal.tsx
│   ├── lib/               # Utilities
│   │   ├── api.ts         # API client
│   │   └── firebase.ts    # Firebase config
│   └── package.json       # Node dependencies
│
├── docs/                  # Documentation
├── ROADMAP.md
└── README.md
```

> Catatan: seluruh dokumentasi berada di file markdown pada root repo (API.md, DATABASE.md, ARCHITECTURE.md, dll), bukan folder `docs/`.

---

## 🔧 Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL 16 (via Docker + Alembic migrations)
- **Auth**: Firebase Authentication
- **ORM**: SQLAlchemy 2.x
- **Storage**: MinIO (S3-compatible)
- **Rate Limiting**: Redis-backed (fallback in-memory)

### Frontend
- **Framework**: Next.js 15 (React 19)
- **UI Library**: Chakra UI v2
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Auth**: Firebase SDK

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

Cek coverage:
```bash
pytest tests/ --cov=app --cov-report=html
```

### Run Frontend Lint
```bash
cd frontend
npm run lint
```

---

## 📚 API Endpoints

### Batch Management
- `POST /api/v1/batches` - Buat batch baru
- `GET /api/v1/batches` - List semua batch user
- `GET /api/v1/batches/{id}` - Detail batch spesifik

### Fermentation Logs
- `POST /api/v1/batches/{id}/logs` - Catat log fermentasi
- `GET /api/v1/batches/{id}/logs` - List logs batch

### Recommendations
- `POST /api/v1/batches/{id}/recommendation` - Get product recommendations
- `POST /api/v1/batches/{id}/business-analysis` - Run business analysis
- `GET /api/v1/batches/{id}/dashboard` - Get dashboard summary

Lihat dokumentasi interaktif di: http://localhost:8000/docs

---

## 🚀 Quick Start

### 1. Database (PostgreSQL + MinIO)
```bash
docker compose up -d postgres minio
```

### 2. Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # isi FIREBASE_CREDENTIALS_PATH & SECRET_KEY
alembic upgrade head          # jalankan migrasi schema
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local    # isi kredensial Firebase
npm install
npm run dev                   # http://localhost:3000
```

### 4. Tes
```bash
cd backend && pytest tests/ -q          # 26+ backend tests
cd frontend && npm run lint && npm run build
cd frontend && npm run test:e2e         # Playwright (landing + login)
```

---

## 🚨 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://ecoflow_user:ecoflow_password@localhost:5432/ecoflow
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
SECRET_KEY=your-secret-key
ENVIRONMENT=development
ADMIN_UIDS=firebase_uid_1,firebase_uid_2   # otomatis diberi role admin
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=ecoflow-bucket
# Optional: CORS_ORIGINS, ALLOWED_HOSTS, RATE_LIMIT, REDIS_URL, RETENTION_DAYS
```
Lihat `backend/.env.example` untuk daftar lengkap.

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
```
Salin dari `frontend/.env.example`.

---

## 📊 Business Logic

### Eco-Enzyme Calculation
Rasio ideal untuk fermentasi:
- **Water**: 3x berat waste
- **Brown Sugar**: 1x berat waste
- **Duration**: 90 hari (dapat disesuaikan)

Contoh: 10 kg sampah → 30 L air + 10 kg gula

### Fermentation Status Classification
- **Normal**: Aroma manis/asam, warna coklat, ada gas
- **Caution**: Ada tanda-tanda minor (suhu tidak ideal, no gas di hari 30+)
- **Failed**: Aroma busuk, warna hijau/hitam, tanda kontaminasi

### Business Analysis
- **COGS Calculation**: (Raw Material + Packaging + Labor + Overhead) / Production Volume
- **Profit Margin**: (Selling Price - COGS) / Selling Price × 100%
- **Break-even**: Monthly Fixed Costs / Margin per Unit
- **Projection**: Based on average market adoption curve

---

## 🤝 Contributing

Baca [CONTRIBUTING.md](./CONTRIBUTING.md) untuk panduan berkontribusi.

### Development Workflow
1. Fork repository
2. Buat branch feature: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add: description"`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

### Code Standards
- Backend: PEP 8 (Black formatter)
- Frontend: ESLint + Prettier
- Commit messages: Conventional Commits

---

## 📋 Roadmap

### ✅ MVP (Q3 2026 - Selesai)
- [x] Batch management (CRUD)
- [x] Fermentation monitoring dengan AI
- [x] Product recommendations
- [x] Business analysis & projections
- [x] User authentication
- [x] Dashboard UI

### 🔄 P1 Features (Q4 2026)
- [x] Admin dashboard untuk monitoring multi-user
- [x] PDF export untuk laporan bisnis dan roadmap
- [x] Environmental impact metrics (CO₂ diverted)
- [x] Community monitoring trends dan engagement
- [x] Content CRUD untuk product templates
- [ ] Community batch sharing & tips
- [ ] Regional market data integration

### 🎯 P2 Features (Q1 2027)
- [ ] Mobile app (React Native)
- [ ] ML model optimization dan retraining
- [ ] Offline sync lanjutan
- [ ] Multi-language support
- [ ] Advanced analytics & insights

---

## 🐛 Known Issues & Limitations

1. **Firebase Setup**: Memerlukan credentials file (setup manual di cloud)
2. **Auth Token**: Firebase ID token wajib tersedia untuk endpoint terproteksi
3. **Database**: PostgreSQL tersedia melalui Docker Compose dan Alembic
4. **AI Model**: Rule-based classifier; advanced ML dijadwalkan untuk post-launch
5. **Offline Sync**: Catatan dapat diantrikan di browser dan disinkronkan saat koneksi kembali

---

## 📞 Support & Contact

- **Issues**: https://github.com/GomalRajaGula/EcoFlow-AI/issues
- **Discussions**: https://github.com/GomalRajaGula/EcoFlow-AI/discussions
- **Email**: contact@ecoflow.local (TBD)

---

## 📄 License

Proyek ini dibuat untuk kompetisi ITechnoCup 2026. Hak cipta © 2026 EcoFlow AI Team. Semua hak dilindungi.

---

**Dibuat dengan ❤️ untuk sustainable living | EcoFlow AI © 2026**
