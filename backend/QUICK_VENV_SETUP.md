# Quick: Aktifkan venv di Terminal

## 1️⃣ Aktivasi venv

```bash
cd /home/gomallinux/Documents/ITechno2026/prd-ecoflow-ai/backend
source venv/bin/activate
```

Output: prompt berubah menjadi `(venv) user@...`

## 2️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

## 3️⃣ Verify

```bash
python -c "import fastapi; import sqlalchemy; print('✅ All imports OK')"
```

## 4️⃣ Di VS Code

- Ctrl+Shift+P → "Python: Select Interpreter"
- Pilih yang path-nya: `/venv/bin/python`
- Buka terminal baru (Ctrl+`)
- Otomatis akan aktif venv

---

**Done!** Semua error import di VS Code hilang.
