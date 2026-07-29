# Firebase Backend Credentials Fix Guide

**Problem:** `Firebase initialization warning: Failed to initialize a certificate credential. Caused by: "Unable to load PEM file... InvalidData(InvalidPadding)"`

Ini berarti file `firebase-credentials.json` milikmu rusak formatnya, terutama di bagian `private_key`.

---

## ✅ Solusi: Download Service Account Key yang Baru

### Step 1: Buka Firebase Console
1. Pergi ke: https://console.firebase.google.com
2. Login dengan akun Google kamu
3. Pilih project **"ecoflow-ai-1941c"** (atau nama project kamu)

### Step 2: Navigate ke Project Settings
- Klik icon **gear/settings** (⚙️) di kiri atas
- Pilih **Project Settings**

### Step 3: Buka Tab Service Accounts
- Di halaman Project Settings, cari tab **"Service Accounts"**
- Klik tab tersebut

### Step 4: Generate Private Key Baru
Di bagian **"Firebase Admin SDK"**, kamu akan melihat bahasa pemrograman (Python, Node.js, dll).

- Pastikan pilihan bahasa adalah **Python** atau **General**
- Klik tombol **"Generate New Private Key"** (atau "Generate Private Key")

### Step 5: File JSON akan ter-download
Sebuah file dengan nama seperti:
```
ecoflow-ai-1941c-xxxxxxxxxxxxx.json
```

akan ter-download ke folder **Downloads** kamu.

---

## 🎯 Step 6: Replace File Lama dengan yang Baru

### Option A: Pakai File Manager (Rekomendasi untuk User Biasa)

1. Buka **File Manager** di desktop kamu
2. Navigasi ke folder project:
   ```
   /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/backend/
   ```
3. Cari file **`firebase-credentials.json`** (file lama)
4. Buka folder **Downloads** (di tab baru)
5. Cari file JSON yang baru ter-download (nama seperti `ecoflow-ai-1941c-xxxxx.json`)
6. **Copy** file JSON baru
7. Kembali ke folder backend
8. **Paste** dan ganti nama file menjadi **`firebase-credentials.json`**
9. Jika ada dialog "Replace?", klik **Yes / Replace**

### Option B: Terminal Command (Untuk Advanced User)

Ganti `FILENAME_DARI_DOWNLOADS` dengan nama file yang ter-download:

```bash
cp ~/Downloads/ecoflow-ai-1941c-xxxxxxxxxxxxx.json \
   /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/backend/firebase-credentials.json
```

Atau langsung rename setelah copy:

```bash
# Copy
cp ~/Downloads/ecoflow-ai-1941c-*.json /tmp/cred.json

# Ganti nama dan pindah
mv /tmp/cred.json \
   /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/backend/firebase-credentials.json
```

---

## ✅ Step 7: Verifikasi File Sudah Benar

**Terminal Command:**

```bash
cd /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/backend

# Cek file ada
ls -lh firebase-credentials.json

# Cek format JSON valid
python -m json.tool firebase-credentials.json | head -20
```

**Output seharusnya:**
```json
{
  "type": "service_account",
  "project_id": "ecoflow-ai-1941c",
  "private_key_id": "xxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...",
  ...
}
```

**Jika error `InvalidData`, berarti:**
- ❌ File belum benar-benar diganti
- ❌ Ada whitespace/karakter aneh di file
- ❌ File lama masih dipakai

---

## ✅ Step 8: Restart Backend dan Test

**Terminal:**

```bash
cd /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Output seharusnya:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

❌ **Jika masih ada error:**
```
Firebase initialization warning: Failed to initialize a certificate credential...
```

Berarti file MASIH belum diganti dengan benar. Cek:
1. Apakah nama file sudah tepat: `firebase-credentials.json` (bukan `.JSON` atau nama lain)?
2. Apakah lokasi file sudah benar: di dalam folder `backend/` (bukan subfolder lain)?
3. Apakah file sudah full ter-copy (bukan setengah)?

---

## 🧪 Test Integrasi Frontend + Backend

Setelah backend berjalan tanpa error:

### 1. Jalankan Frontend (terminal baru)
```bash
cd /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/frontend
npm run dev
```

### 2. Akses di browser
```
http://localhost:3000 atau http://localhost:3001
```

### 3. Test sign up/login
- Klik tombol **"Mulai Sekarang"** atau **"Login"**
- Masukkan email dan password baru
- Klik **Sign Up**

**Jika berhasil:**
- ✅ Tidak ada error di browser console
- ✅ Redirect ke `/dashboard`
- ✅ Backend log tidak ada Firebase error

---

## 📝 Troubleshooting Checklist

| Masalah | Solusi |
|---------|--------|
| Frontend masih error "auth/api-key-not-valid" | Cek `frontend/.env.local` — apakah nilai sudah benar tanpa kutip/koma? Restart dev server. |
| Backend masih error "InvalidPadding" | Download Private Key baru dari Firebase Console, replace `firebase-credentials.json`, restart backend. |
| File tidak ter-download | Cek popup blocker, atau download manual dari Firebase Console → Project Settings → Service Accounts |
| Tidak bisa find file di File Manager | Cek path: `/home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/backend/` — pastikan di folder **backend** bukan **frontend** |

---

## 🔐 Security Reminders

⚠️ **JANGAN pernah:**
- Share `firebase-credentials.json` ke siapa pun
- Commit file ini ke GitHub (sudah di `.gitignore`)
- Ubah `FIREBASE_CREDENTIALS_PATH` di `.env` kecuali ada alasan khusus

✅ **HARUS:**
- Keep file ini lokal saja
- Rotate private key secara berkala (generate baru setiap 6-12 bulan)
- Untuk production, gunakan env var atau secret manager (AWS Secrets, Google Secret Manager, dll)

---

## 📞 Jika Masih Stuck

1. Buka terminal backend dan jalankan:
   ```bash
   python -m json.tool /path/to/firebase-credentials.json
   ```
   Jika output error → file rusak, download ulang.

2. Cek ukuran file:
   ```bash
   ls -lh firebase-credentials.json
   ```
   Seharusnya **1-3 KB** (bukan 0 byte atau >10 MB).

3. Baca error message lengkap di backend terminal — ada clue detail di sana.
