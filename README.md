# 🌧️ Rainfall Monitoring PWA Wrapper
> Generated for TNCF Temanggung | @rochmadjeka

Folder ini berisi semua file yang dibutuhkan untuk membungkus
Google Apps Script kamu menjadi PWA yang bisa diinstall seperti aplikasi native.

---

## 📁 Struktur File

```
pwa-wrapper/
├── index.html          ← Halaman utama PWA (iframe wrapper)
├── manifest.json       ← Konfigurasi PWA (nama, warna, icon)
├── sw.js               ← Service Worker (cache & offline)
├── generate-icons.js   ← Script untuk generate icon (opsional)
└── icons/              ← Folder icon (buat manual atau pakai script)
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

---

## 🚀 Langkah Deploy (GitHub Pages)

### 1. Ganti URL Google Apps Script

Buka `index.html`, cari baris ini dan ganti dengan URL deploy GAS kamu:

```javascript
const GAS_URL = 'GANTI_DENGAN_URL_GAS_KAMU';
```

Contoh:
```javascript
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxxx/exec';
```

### 2. Buat Icon PWA

**Opsi A — Pakai tools online (paling mudah):**
- Buka https://www.pwabuilder.com/imageGenerator
- Upload satu gambar persegi (minimal 512×512px), bisa logo perusahaan
- Download hasilnya, ekstrak ke folder `icons/`

**Opsi B — Generate via Node.js:**
```bash
npm install canvas
node generate-icons.js
```

**Opsi C — Buat manual:**
Buat 8 file PNG dengan ukuran:
72, 96, 128, 144, 152, 192, 384, 512 pixel persegi
Simpan di folder `icons/` dengan nama `icon-[ukuran].png`

### 3. Upload ke GitHub

```bash
# Buat repo baru di GitHub (misal: rainfall-pwa)
git init
git add .
git commit -m "Initial PWA wrapper"
git branch -M main
git remote add origin https://github.com/USERNAME/rainfall-pwa.git
git push -u origin main
```

### 4. Aktifkan GitHub Pages

1. Buka repo di GitHub
2. Settings → Pages
3. Source: **Deploy from a branch** → Branch: `main` / `root`
4. Klik Save
5. Tunggu ~1-2 menit, URL kamu akan muncul:
   `https://USERNAME.github.io/rainfall-pwa/`

---

## 📱 Cara Install PWA

### Android (Chrome)
- Buka URL GitHub Pages di Chrome
- Akan muncul banner **"Install Rainfall Monitor"** otomatis
- Klik **Install** → aplikasi muncul di home screen

### iPhone / iPad (Safari)
- Buka URL di Safari
- Akan muncul petunjuk di bawah layar
- Ketuk ikon Share (kotak ↑) → **"Add to Home Screen"**

### Desktop (Chrome / Edge)
- Buka URL
- Di address bar akan muncul ikon install (⊕)
- Atau klik menu → "Install Rainfall Monitoring System"

---

## ⚠️ Catatan Penting

1. **Koneksi internet tetap diperlukan** untuk mengakses data — GAS tetap butuh online
2. PWA wrapper ini hanya mengcache **shell** aplikasi (loading screen, offline notice)
3. Pastikan URL GAS di-deploy sebagai **"Anyone"** bukan "Anyone with Google account"
   karena iframe tidak bisa handle login Google

---

## 🔧 Kustomisasi

### Ganti nama app
Edit `manifest.json`:
```json
"name": "Rainfall Monitoring System",
"short_name": "RainfallMon"
```

### Ganti warna tema
Edit `manifest.json` dan `index.html`:
```json
"theme_color": "#319795",
"background_color": "#e2e8f0"
```

### Update app (setelah ada perubahan)
Ganti versi cache di `sw.js`:
```javascript
const CACHE_NAME = 'rainfall-pwa-v2'; // naikan versi
```
