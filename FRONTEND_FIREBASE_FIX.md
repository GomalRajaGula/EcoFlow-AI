# Frontend Firebase Error Fix Guide

**Problem:** `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`

Error ini bisa terjadi karena beberapa alasan. Berikut panduan lengkap untuk memperbaikinya.

---

## 🔍 Diagnosis: Identifikasi Penyebab Error

### Kemungkinan 1: Environment Variable Tidak Terbaca

**Cek di Browser Console (DevTools):**

1. Buka http://localhost:3000 atau http://localhost:3001
2. Tekan **F12** (atau Ctrl+Shift+I) → buka **Console** tab
3. Ketik perintah berikut:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
   ```
4. Tekan Enter

**Hasilnya:**
- ✅ Jika output: `AIzaSy...` (nilai API key) → env terbaca dengan benar
- ❌ Jika output: `undefined` → env TIDAK terbaca

---

## ✅ Solusi: Perbaiki Environment Variables

### Step 1: Cek File `.env.local`

**File:** `/frontend/.env.local`

Pastikan file ini ada dan berisi:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCwMbULjNs1bcVDjxwh_-VheRV89WUM-U
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecoflow-ai-1941c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecoflow-ai-1941c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecoflow-ai-1941c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=578214959538
NEXT_PUBLIC_FIREBASE_APP_ID=1:578214959538:web:e2b582d277891c56652cab
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**PENTING: Format yang BENAR adalah:**
- ❌ Jangan ada spasi sekitar `=`: ~~`NEXT_PUBLIC_FIREBASE_API_KEY = ...`~~
- ❌ Jangan ada kutip di akhir: ~~`AIzaSy...",`~~ atau ~~`AIzaSy...",`~~
- ❌ Jangan ada newline atau whitespace tersembunyi di akhir nilai
- ✅ Benar: `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCwMbULjNs1bcVDjxwh_-VheRV89WUM-U`

---

### Step 2: Cek dan Bersihkan File `.env.local`

**Terminal Command:**

```bash
cd /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/frontend

# Lihat isi file
cat .env.local

# Cek ada kutip atau karakter aneh
od -c .env.local | head -20
```

Jika output `od -c` menunjukkan `"` atau `,` di akhir nilai, itu masalahnya.

**Cara Bersihkan:**

Buka file di text editor (VS Code, Sublime, etc) dan pastikan format persis seperti di Step 1.

**Atau gunakan terminal command:**

```bash
# Replace dengan format yang benar
cat > /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/frontend/.env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCwMbULjNs1bcVDjxwh_-VheRV89WUM-U
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecoflow-ai-1941c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecoflow-ai-1941c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecoflow-ai-1941c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=578214959538
NEXT_PUBLIC_FIREBASE_APP_ID=1:578214959538:web:e2b582d277891c56652cab
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

---

### Step 3: Verifikasi Firebase Initialization Code

**File:** `/frontend/lib/firebase.ts`

Kode seharusnya persis seperti ini:

```typescript
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

function getFirebaseEnvValue(name: string, value: string | undefined): string {
  const cleanedValue = value?.trim().replace(/^[\s"',]+|[\s"',]+$/g, '');

  if (!cleanedValue || cleanedValue.startsWith('YOUR_')) {
    throw new Error(`Missing Firebase environment variable: ${name}`);
  }

  return cleanedValue;
}

const firebaseConfig = {
  apiKey: getFirebaseEnvValue('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: getFirebaseEnvValue('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: getFirebaseEnvValue('NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: getFirebaseEnvValue('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getFirebaseEnvValue('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: getFirebaseEnvValue('NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
```

**Penjelasan:**
- `getFirebaseEnvValue()` = fungsi untuk membersihkan kutip/koma/spasi otomatis
- `getApps().length ? getApp() : initializeApp()` = cegah Firebase double initialization
- Error message jelas jika ada env var yang missing/invalid

---

### Step 4: Restart Dev Server

**PENTING:** Kamu HARUS restart dev server setelah mengubah `.env.local`.

**Terminal:**

```bash
# Stop server saat ini (Ctrl+C)
# Lalu:

cd /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/frontend
npm run dev
```

**Output seharusnya:**
```
▲ Next.js 15.5.22
 - Local:        http://localhost:3000 (atau 3001)
 - Environments: .env.local
 ✓ Ready in X.X s
```

---

## 🧪 Test Firebase Connection

### Test 1: Buka Browser dan Cek Console

1. Buka http://localhost:3000 (atau 3001)
2. Tekan **F12** → **Console** tab
3. Cari message seperti:
   - ❌ Error? → `Uncaught Error: Missing Firebase environment variable`
   - ❌ Error? → `Firebase: Error (auth/api-key-not-valid)`
   - ✅ Tidak ada error? → Bagus!

### Test 2: Cek Firebase Initialization di Console

```javascript
// Di browser console, ketik:
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
```

Semua seharusnya menampilkan nilai, bukan `undefined`.

### Test 3: Try Sign Up

1. Klik tombol **"Mulai Sekarang"** atau ke http://localhost:3000/login
2. Masukkan email dan password baru
3. Klik **Sign Up**

**Expected:**
- ✅ Berhasil sign up → redirect ke dashboard
- ✅ Tidak ada error di console

**Jika masih error:**
- ❌ `auth/api-key-not-valid` → env var salah atau API key tidak valid
- ❌ `auth/operation-not-allowed` → Email/Password authentication belum diaktifkan di Firebase Console
- ❌ Lainnya → lihat error detail di console, copy error message untuk research

---

## 🔍 Advanced Debugging

### Jika masih error, cek apakah API Key valid di Firebase Console:

1. Buka https://console.firebase.google.com
2. Pilih project **ecoflow-ai-1941c**
3. Pergi ke **Settings** → **Project Settings**
4. Tab **General**
5. Cari bagian **"Your API Keys"**
6. Lihat API Key yang ter-list
7. Copy salah satu dan bandingkan dengan nilai di `.env.local`

**Harus cocok persis**, termasuk karakter `_` dan `-`.

---

### Jika API Key valid tapi masih error, cek Firebase Authentication:

1. Di Firebase Console, pergi ke **Authentication**
2. Klik tab **Sign-in method**
3. Cari provider **Email/Password**
4. Status seharusnya **Enabled** (warna hijau)
5. Jika belum, klik tombol untuk **Enable**
6. Klik **Save**

---

## 📝 Troubleshooting Checklist

| Masalah | Solusi |
|---------|--------|
| Console log env var = `undefined` | Pastikan `.env.local` ada di folder `frontend/`. Restart dev server. Jika masih undefined, mungkin Next.js cache lama — hapus folder `.next` dan rebuild. |
| API Key value muncul tapi masih error | API Key mungkin tidak valid. Re-generate di Firebase Console → Project Settings → API Keys. Update `.env.local`. |
| Env var benar, tapi "auth/operation-not-allowed" | Email/Password authentication belum diaktifkan. Pergi Firebase Console → Authentication → Sign-in method → Enable Email/Password. |
| Semuanya benar tapi masih error | Clear browser cache (Ctrl+Shift+Delete), lalu refresh. Atau coba incognito mode. Jika masih gagal, cek Firebase project — apakah sudah benar-benar ter-setup? |

---

## 🎯 Quick Checklist Sebelum Sign Up

Pastikan semua ini sudah ✅:

1. ✅ `.env.local` ada di `/frontend/`
2. ✅ Format `.env.local` benar (no quotes, no commas)
3. ✅ API Key di `.env.local` cocok dengan Firebase Console
4. ✅ Email/Password authentication ENABLED di Firebase Console
5. ✅ Dev server sudah di-restart setelah mengubah `.env.local`
6. ✅ Browser cache sudah di-clear
7. ✅ Tidak ada error di browser console sebelum sign up

Kalau semua ✅, seharusnya bisa sign up tanpa masalah.

---

## 📞 Jika Masih Stuck

1. Buka **DevTools Console** (F12)
2. Copy error message lengkap (bukan ringkasan)
3. Cek **Network tab** → request apa yang fail?
4. Cek backend terminal — apakah ada request masuk dari frontend?
   - Jika tidak ada → masalah di frontend/env
   - Jika ada tapi error → masalah di backend Firebase config

Kalau semua sudah dicek dan masih error, ada kemungkinan:
- Firebase project tidak ter-setup dengan benar
- API Key sudah ter-disable
- Regional restrictions atau IP blocking
- Firebase project di-delete atau di-suspend
