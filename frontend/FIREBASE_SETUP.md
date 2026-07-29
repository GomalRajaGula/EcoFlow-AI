# Firebase Setup Guide

Ikuti langkah-langkah berikut untuk mendapatkan Firebase credentials:

## 1. Buka Firebase Console
Pergi ke https://console.firebase.google.com

## 2. Buat atau pilih project
- Klik "Create Project" atau pilih project yang sudah ada
- Nama project: "EcoFlow-AI" (atau sesuai keinginan)

## 3. Daftarkan aplikasi web
- Klik ikon `</>` (Web) di bawah "Get started by adding Firebase to your app"
- Nama aplikasi: "ecoflow-web"
- Klik "Register app"

## 4. Salin Firebase Config
Setelah register, Firebase akan menampilkan code seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxx...",
  authDomain: "ecoflow-ai.firebaseapp.com",
  projectId: "ecoflow-ai",
  storageBucket: "ecoflow-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg..."
};
```

## 5. Isi `.env.local` di frontend
Buka file `/frontend/.env.local` dan isi dengan nilai dari Firebase Config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxxxxx...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecoflow-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecoflow-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecoflow-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdefg...
```

## 6. Aktifkan Email/Password Authentication
- Di Firebase Console, pergi ke: **Authentication** → **Sign-in method**
- Aktifkan **Email/Password** provider
- Klik tombol Enable, simpan

## 7. Restart dev server
```bash
npm run dev
```

## Catatan Penting
- File `.env.local` sudah disiapkan di `/frontend/.env.local`
- Jangan commit `.env.local` ke git (sudah ada di `.gitignore`)
- Pastikan Next.js app di-restart setelah mengubah `.env.local`
