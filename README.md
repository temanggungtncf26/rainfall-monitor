# 🌧️ Monitoring Curah Hujan TNCF — PWA

Aplikasi Monitoring Curah Hujan berbasis **Progressive Web App (PWA)** yang terhubung ke Google Apps Script sebagai backend.

---

## 📁 Struktur File

```
pwa-curah-hujan/
├── index.html          ← Aplikasi utama (UI + semua logic)
├── manifest.json       ← Konfigurasi PWA (nama, ikon, warna)
├── sw.js               ← Service Worker (Cache First + Background Sync)
├── icons/
│   ├── icon-192.svg    ← Ikon PWA 192x192 (bisa diganti)
│   └── icon-512.svg    ← Ikon PWA 512x512 (bisa diganti)
└── README.md           ← Dokumentasi ini
```

---

## 🚀 Cara Deploy ke GitHub Pages

### Langkah 1 — Upload ke GitHub

1. Buat repository baru di GitHub (contoh: `curah-hujan-app`)
2. Upload semua file di folder ini ke repository tersebut
3. Pastikan struktur folder `icons/` ikut terupload

### Langkah 2 — Aktifkan GitHub Pages

1. Buka Settings → Pages
2. Source: pilih **Deploy from a branch**
3. Branch: pilih **main** → folder **/ (root)**
4. Klik **Save**
5. Tunggu 1–2 menit, aplikasi akan live di: `https://[username].github.io/[repo-name]/`

### Langkah 3 — Test PWA

Buka URL aplikasi di **Chrome** (desktop atau Android), lalu:

1. Buka DevTools (`F12`) → tab **Application**
2. Klik **Service Workers** — pastikan SW terdaftar dan status `activated`
3. Klik **Manifest** — pastikan semua field terisi dan ikon muncul
4. Untuk test offline: DevTools → Network → centang **Offline** → reload halaman

---

## 📲 Cara Install di HP (Android)

1. Buka URL aplikasi di **Chrome for Android**
2. Tunggu beberapa detik, akan muncul banner **"Install app Curah Hujan di HP kamu?"**
3. Klik **Install** — aplikasi akan tersimpan di home screen
4. Atau: menu Chrome (titik tiga) → **"Add to Home Screen"**

## 🍎 Cara Install di iPhone/iPad (iOS)

1. Buka URL di **Safari** (bukan Chrome)
2. Tap ikon **Share** (kotak dengan panah ke atas)
3. Scroll ke bawah → tap **"Add to Home Screen"**
4. Klik **Add**

> ⚠️ iOS tidak mendukung Background Sync API. Sinkronisasi data otomatis hanya bekerja di Chrome/Android. Di iOS, sync akan berjalan saat kamu membuka app kembali dalam kondisi online.

---

## 🔄 Fitur Offline & Sinkronisasi

| Fitur | Online | Offline |
|-------|--------|---------|
| Login | ✅ | ❌ (perlu koneksi) |
| Dashboard & Grafik | ✅ | ✅ (dari cache) |
| Input Data | ✅ | ✅ (tersimpan lokal) |
| Edit Data | ✅ | ✅ (tersimpan lokal) |
| Rekapitulasi | ✅ | ✅ (dari cache) |
| Export Excel/PNG | ✅ | ✅ |
| Kelola User/OBS | ✅ | ❌ |

Data yang diinput saat offline akan otomatis dikirim ke server saat koneksi kembali (badge kuning akan muncul).

---

## 🖼️ Cara Ganti Ikon

Ikon saat ini adalah SVG placeholder. Untuk menggantinya dengan ikon asli:

### Opsi A — Ganti dengan PNG

1. Siapkan file PNG berukuran **192×192** dan **512×512** piksel
2. Letakkan di folder `icons/` dengan nama:
   - `icon-192.png`
   - `icon-512.png`
3. Edit `manifest.json`, ubah:
   ```json
   "icons": [
     { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
     { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
   ]
   ```
4. Edit `index.html`, update baris apple-touch-icon:
   ```html
   <link rel="apple-touch-icon" sizes="192x192" href="icons/icon-192.png">
   ```

### Opsi B — Tetap Gunakan SVG

Edit file `icons/icon-192.svg` dan `icons/icon-512.svg` sesuai kebutuhan.

---

## ⚙️ Konfigurasi GAS (CORS)

Pastikan deployment Google Apps Script dikonfigurasi dengan akses:
- **Execute as**: Me
- **Who has access**: **Anyone** (atau Anyone with Google Account)

Jika akses dibatasi, fetch dari PWA akan gagal karena CORS.

---

## 🔧 Update Cache (Setelah Deploy Ulang)

Setiap kali kamu mengupdate `index.html`, naikkan versi cache di `sw.js`:

```javascript
const CACHE_NAME = 'curah-hujan-v1.0.1'; // ← Naikkan versi ini
```

Ini memaksa browser mengunduh file terbaru dan menghapus cache lama.

---

## ❓ Troubleshooting

**PWA tidak bisa diinstall?**
→ Pastikan akses via HTTPS (GitHub Pages sudah HTTPS otomatis). Localhost harus diakses lewat `127.0.0.1` atau HTTPS.

**Data tidak muncul / kosong?**
→ Periksa Network tab di DevTools apakah request ke GAS berhasil. Pastikan GAS deployment aktif dan akses "Anyone".

**Service Worker tidak update?**
→ DevTools → Application → Service Workers → klik **Update** atau naikkan versi `CACHE_NAME` di `sw.js`.

**Background sync tidak jalan di iOS?**
→ Normal. iOS Safari tidak mendukung Background Sync API. Data akan tersync saat app dibuka kembali dalam kondisi online.
