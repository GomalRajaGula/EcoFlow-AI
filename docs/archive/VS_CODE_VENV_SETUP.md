# Cara Mengaktifkan Virtual Environment di VS Code

Error "Import could not be resolved" terjadi karena VS Code belum menggunakan Python interpreter dari virtual environment. Berikut cara mengatasinya.

---

## ✅ Solusi: Select Python Interpreter dari venv

### Step 1: Buka Folder Backend di VS Code

```bash
# Di terminal, buka folder backend
cd /path/ke/proyek/backend
code .
```

Atau:
- Buka VS Code
- File → Open Folder
- Navigasi ke folder `backend` dari proyek ini
- Klik Open

---

### Step 2: Buka Command Palette

Tekan **Ctrl+Shift+P** (atau Cmd+Shift+P di Mac)

Akan muncul input field di atas. Ketik:
```
Python: Select Interpreter
```

Klik opsi yang muncul.

---

### Step 3: Pilih Interpreter dari venv

Seharusnya ada list interpreter:
- `/usr/bin/python3` (system Python)
- `/path/ke/proyek/backend/venv/bin/python` ← **Pilih ini**
- Atau ada path ke venv lainnya

**Pilih yang path-nya mengandung `/venv/bin/python`.**

---

### Step 4: Verifikasi di Terminal VS Code

Buka Terminal di VS Code: **View → Terminal** (atau Ctrl+`)

Harusnya sudah ada `(venv)` prefix di depan prompt:
```
(venv) user@machine:~/backend$
```

Jika belum, aktifkan manual:
```bash
source venv/bin/activate
```

---

### Step 5: Install Dependencies (jika belum)

```bash
pip install -r requirements.txt
```

---

## ✅ Setelah Itu, Errors di VS Code Akan Hilang

Buka file `app/core/auth.py` → semua import errors akan resolved ✅

---

## 🔧 Alternative: Perbaiki di Settings.json

Jika method di atas tidak bekerja, kamu bisa set manual di `.vscode/settings.json`:

**Buka Command Palette (Ctrl+Shift+P) → ketik "Open Settings (JSON)"**

Tambahkan baris ini:
```json
{
  "python.defaultInterpreterPath": "/path/ke/proyek/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

Save → Reload VS Code.

---

## 📋 Checklist

- ✅ Python interpreter pointing ke venv
- ✅ `(venv)` visible di terminal VS Code
- ✅ Import errors hilang
- ✅ requirements.txt sudah installed

Done! Syntax errors di VS Code seharusnya sudah clear.
