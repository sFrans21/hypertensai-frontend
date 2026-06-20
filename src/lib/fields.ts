import type { AnalyzePayload } from "./types";

// ============================================================================
// Metadata field formulir.
//
// `key`     -> nama kunci JSON yang dikirim ke API (TIDAK BOLEH diubah).
// `label`   -> teks ramah-pengguna dalam Bahasa Indonesia.
// `code`    -> kode teknis variabel (ditampilkan sebagai helper kecil).
// `kind`    -> "number" (input angka) atau "select" (dropdown).
// `options` -> daftar pilihan untuk dropdown.
//
// Makna variabel diturunkan dari dokumen Tugas Akhir (sumber data IFLS-5 /
// skala CES-D), bukan dari PRD, agar label formulir bermakna secara klinis.
// ============================================================================

/** Field formulir di luar kontrak API — dipakai untuk menghitung BMI sebelum dikirim. */
export type ExtraFieldKey = "weight_kg" | "height_cm";

export type FieldKey = keyof AnalyzePayload | ExtraFieldKey;

export interface SelectOption {
  value: number;
  label: string;
}

export interface FieldDef {
  key: FieldKey;
  label: string;
  code: string;
  hint?: string;
  kind: "number" | "select";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  /** Jika true, field boleh dikosongkan (tidak wajib diisi). */
  optional?: boolean;
  options?: SelectOption[];
}

export interface FormStep {
  id: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
}

const yesNo: SelectOption[] = [
  { value: 0, label: "Tidak" },
  { value: 1, label: "Ya" },
];

const cesd: SelectOption[] = [
  { value: 1, label: "1 — Jarang / tidak pernah" },
  { value: 2, label: "2 — Kadang-kadang" },
  { value: 3, label: "3 — Sering" },
];

export const FORM_STEPS: FormStep[] = [
  {
    id: "demografi",
    title: "Demografi & Fisik",
    subtitle: "Data dasar diri Anda.",
    fields: [
      {
        key: "age",
        label: "Usia",
        code: "age",
        kind: "number",
        unit: "tahun",
        min: 1,
        max: 120,
        step: 1,
      },
      {
        key: "is_female",
        label: "Jenis kelamin",
        code: "is_female",
        kind: "select",
        options: [
          { value: 0, label: "Laki-laki" },
          { value: 1, label: "Perempuan" },
        ],
      },
      {
        key: "weight_kg",
        label: "Berat badan",
        code: "weight_kg",
        hint: "Digunakan untuk menghitung BMI",
        kind: "number",
        unit: "kg",
        min: 20,
        max: 300,
        step: 0.1,
      },
      {
        key: "height_cm",
        label: "Tinggi badan",
        code: "height_cm",
        hint: "Digunakan untuk menghitung BMI",
        kind: "number",
        unit: "cm",
        min: 50,
        max: 250,
        step: 0.1,
      },
      {
        key: "waist_cm",
        label: "Lingkar pinggang (opsional)",
        code: "waist_cm",
        kind: "number",
        unit: "cm",
        min: 30,
        max: 250,
        step: 0.1,
        optional: true,
      },
    ],
  },
  {
    id: "gaya-hidup",
    title: "Gaya Hidup",
    subtitle: "Kebiasaan harian yang memengaruhi tekanan darah.",
    fields: [
      {
        key: "is_smoker",
        label: "Status merokok",
        code: "is_smoker",
        hint: "Apakah Anda merokok?",
        kind: "select",
        options: yesNo,
      },
      {
        key: "freq_instant_noodle",
        label: "Frekuensi konsumsi mi instan",
        code: "freq_instant_noodle",
        hint: "Perkiraan porsi dalam seminggu",
        kind: "number",
        unit: "porsi/minggu",
        min: 0,
        max: 50,
        step: 1,
      },
      {
        key: "ak02",
        label: "Aktivitas fisik berat",
        code: "ak02",
        hint: "Hari per minggu dengan aktivitas berat (mis. angkat beban, lari)",
        kind: "number",
        unit: "hari/minggu",
        min: 0,
        max: 7,
        step: 1,
      },
      {
        key: "ak05",
        label: "Aktivitas fisik sedang",
        code: "ak05",
        hint: "Hari per minggu dengan aktivitas sedang (mis. jalan cepat)",
        kind: "number",
        unit: "hari/minggu",
        min: 0,
        max: 7,
        step: 1,
      },
      {
        key: "ak07",
        label: "Durasi aktivitas fisik",
        code: "ak07",
        hint: "Total durasi beraktivitas",
        kind: "number",
        unit: "menit/hari",
        min: 0,
        max: 1440,
        step: 5,
      },
    ],
  },
  {
    id: "riwayat-medis",
    title: "Riwayat Medis",
    subtitle: "Kondisi dan faktor risiko bawaan.",
    fields: [
      {
        key: "has_diabetes",
        label: "Riwayat diabetes",
        code: "has_diabetes",
        hint: "Pernah didiagnosis diabetes?",
        kind: "select",
        options: yesNo,
      },
      {
        key: "genetic_risk_score",
        label: "Skor risiko genetik",
        code: "genetic_risk_score",
        hint: "Berapa banyak keluarga inti dengan riwayat hipertensi",
        kind: "select",
        options: [
          { value: 0, label: "0 — Tidak ada" },
          { value: 1, label: "1 — Sebagian" },
          { value: 2, label: "2 — Banyak / kuat" },
        ],
      },
    ],
  },
  {
    id: "psikososial",
    title: "Indikator Psikososial",
    subtitle:
      "Empat minggu terakhir, seberapa sering Anda merasakan hal berikut? (skala CES-D)",
    fields: [
      {
        key: "ps_A",
        label: "Mudah terganggu oleh berbagai hal",
        code: "ps_A",
        hint: "Komponen afektif — bothered by things",
        kind: "select",
        options: cesd,
      },
      {
        key: "ps_B",
        label: "Sulit berkonsentrasi",
        code: "ps_B",
        hint: "Komponen kognitif — trouble concentrating",
        kind: "select",
        options: cesd,
      },
      {
        key: "ps_C",
        label: "Merasa sedih / murung",
        code: "ps_C",
        hint: "Komponen afektif depresif — felt depressed",
        kind: "select",
        options: cesd,
      },
      {
        key: "ps_E",
        label: "Merasa penuh harapan akan masa depan",
        code: "ps_E",
        hint: "Komponen positif — felt hopeful (reverse scored)",
        kind: "select",
        options: cesd,
      },
      {
        key: "ps_F",
        label: "Merasa takut / cemas",
        code: "ps_F",
        hint: "Komponen kecemasan — felt fearful",
        kind: "select",
        options: cesd,
      },
    ],
  },
];

/** Semua field dalam urutan kontrak API. */
export const ALL_FIELDS: FieldDef[] = FORM_STEPS.flatMap((s) => s.fields);

/** Nilai awal formulir kosong (string agar input terkontrol & mudah divalidasi). */
export function emptyFormValues(): Record<FieldKey, string> {
  return ALL_FIELDS.reduce(
    (acc, f) => {
      acc[f.key] = "";
      return acc;
    },
    {} as Record<FieldKey, string>,
  );
}
