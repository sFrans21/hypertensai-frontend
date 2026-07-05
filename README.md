# HypertensAI — Frontend

Antarmuka web responsif untuk **Sistem Prediksi Risiko Hipertensi
berbasis Explainable AI & Large Language Model**. Aplikasi mengirim 8 parameter
klinis & gaya hidup ke backend FastAPI, lalu menampilkan skor risiko dan narasi
medis dari LLM.

> Alat ini adalah **opini kedua untuk skrining awal** dan **bukan pengganti
> diagnosis dokter**.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS 3.4**
- State: React Hooks (`useState`, `useEffect`) + **LocalStorage**
- Integrasi: `fetch` ke `POST {NEXT_PUBLIC_API_URL}/api/v1/analyze`

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # lalu sesuaikan NEXT_PUBLIC_API_URL
npm run dev
```

Buka http://localhost:3000

### Variabel lingkungan

| Variabel                | Keterangan                                                             |
| ----------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`   | URL dasar backend FastAPI (mis. `http://localhost:8000`).              |
| `NEXT_PUBLIC_DEMO_MODE` | `true` untuk hasil **simulasi** tanpa backend (untuk demo/presentasi). |

> **Mode Demo:** jika `NEXT_PUBLIC_DEMO_MODE=true`, aplikasi akan menampilkan
> hasil simulasi yang diberi label jelas **"DATA SIMULASI"** ketika backend tidak
> tersedia. Gunakan hanya untuk presentasi — hasil simulasi tidak valid secara
> medis. Untuk produksi, biarkan `false`.

## Struktur

```
src/
├─ app/
│  ├─ layout.tsx        Root layout (mobile constraint max-w-md)
│  ├─ page.tsx          Landing page
│  ├─ form/page.tsx     Wizard formulir 16 input (4 langkah)
│  ├─ result/page.tsx   Halaman hasil (status, probabilitas, narasi)
│  └─ globals.css
└─ lib/
   ├─ types.ts          Tipe kontrak API
   ├─ fields.ts         Metadata & label field formulir
   └─ api.ts            Logika fetch + penyimpanan LocalStorage
```

## Kontrak API

**Request** — `POST {NEXT_PUBLIC_API_URL}/api/v1/analyze` (JSON numerik):

```json
{
  "age": 38,
  "is_female": 0,
  "bmi": 26.4,
  "waist_cm": 172,
  "is_smoker": 0,
  "freq_instant_noodle": 2,
  "ak02": 0,
  "ak05": 2,
  "ak07": 120,
  "has_diabetes": 0,
  "genetic_risk_score": 1,
  "ps_A": 2,
  "ps_B": 2,
  "ps_C": 1,
  "ps_E": 2,
  "ps_F": 2
}
```

**Response** — aplikasi merender `data.prediction` dan `data.clinical_narrative`:

```json
{
  "status": "success",
  "data": {
    "prediction": { "risk_score": 0.3666, "risk_status": "Low Risk" },
    "xai_analysis": {},
    "clinical_narrative": "Teks narasi medis berbahasa Indonesia…"
  }
}
```

Aturan warna kartu hasil: `Low Risk` → hijau, `High Risk` → merah, kategori lain
→ kuning.

## Deploy ke Vercel

1. Push repositori ini ke GitHub.
2. Impor di [vercel.com](https://vercel.com) (framework terdeteksi otomatis: Next.js).
3. Tambahkan Environment Variable `NEXT_PUBLIC_API_URL` (dan opsional
   `NEXT_PUBLIC_DEMO_MODE`).
4. Deploy.

> Pastikan backend FastAPI mengizinkan **CORS** dari domain frontend Anda.

## Catatan implementasi

- Label formulir diturunkan dari dokumen Tugas Akhir (sumber data IFLS-5 & skala
  CES-D) agar bermakna klinis; **nama kunci JSON tetap persis** sesuai kontrak.
- Formulir dibuat dalam bentuk **wizard 3 langkah** dengan validasi per langkah,
  sesuai kebutuhan "Wizard Form" pada PRD.
- Out of scope (sesuai PRD): autentikasi, penyimpanan riwayat ke database, dan
  plot SHAP — penjelasan XAI didelegasikan ke narasi LLM.
