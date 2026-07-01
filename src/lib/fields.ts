import type { AnalyzePayload } from "./types";

// ============================================================================
// Metadata field formulir.
//
// `key`     -> nama kunci JSON yang dikirim ke API (TIDAK BOLEH diubah).
// `label`   -> teks ramah-pengguna dalam Bahasa Indonesia.
// `code`    -> kode teknis variabel (dokumentasi internal; tidak ditampilkan).
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

const sleepQuality: SelectOption[] = [
  { value: 1, label: "1 — Sangat buruk" },
  { value: 2, label: "2 — Buruk" },
  { value: 3, label: "3 — Cukup" },
  { value: 4, label: "4 — Baik" },
  { value: 5, label: "5 — Sangat baik" },
];

const sleepDisturbance: SelectOption[] = [
  { value: 1, label: "1 — Jarang / tidak pernah" },
  { value: 2, label: "2 — Kadang-kadang" },
  { value: 3, label: "3 — Cukup sering" },
  { value: 4, label: "4 — Sering" },
  { value: 5, label: "5 — Selalu" },
];

export const FORM_STEPS: FormStep[] = [
  {
    id: "demografi",
    title: "Demografi & Fisik",
    subtitle: "Data dasar diri Anda.",
    fields: [
      {
        key: "age",
        label: "Berapa usia Anda?",
        code: "age",
        kind: "number",
        unit: "tahun",
        min: 1,
        max: 120,
        step: 1,
      },
      {
        key: "is_female",
        label: "Apa jenis kelamin Anda?",
        code: "is_female",
        kind: "select",
        options: [
          { value: 0, label: "Laki-laki" },
          { value: 1, label: "Perempuan" },
        ],
      },
      {
        key: "weight_kg",
        label: "Berapa berat badan Anda?",
        code: "weight_kg",
        kind: "number",
        unit: "kg",
        min: 20,
        max: 300,
        step: 0.1,
      },
      {
        key: "height_cm",
        label: "Berapa tinggi badan Anda?",
        code: "height_cm",
        kind: "number",
        unit: "cm",
        min: 50,
        max: 250,
        step: 0.1,
      },
    ],
  },
  {
    id: "riwayat-medis",
    title: "Riwayat Medis & Gaya Hidup",
    subtitle: "Kondisi kesehatan dan kebiasaan yang memengaruhi tekanan darah.",
    fields: [
      {
        key: "is_smoker",
        label: "Apakah Anda pernah mempunyai kebiasaan menghisap rokok?",
        code: "is_smoker",
        kind: "select",
        options: yesNo,
      },
      {
        key: "has_diabetes",
        label:
          "Apakah Dokter/Paramedis/Perawat/Bidan pernah mengatakan bahwa Anda memiliki penyakit diabetes?",
        code: "has_diabetes",
        kind: "select",
        options: yesNo,
      },
      {
        key: "has_high_cholesterol",
        label:
          "Apakah Dokter/Paramedis/Perawat/Bidan pernah mengatakan bahwa Anda memiliki penyakit kolesterol tinggi?",
        code: "has_high_cholesterol",
        kind: "select",
        options: yesNo,
      },
    ],
  },
  {
    id: "tidur",
    title: "Kualitas Tidur",
    subtitle: "Pola tidur Anda dalam sebulan terakhir.",
    fields: [
      {
        key: "sleep_quality",
        label: "Dalam 1 minggu terakhir, kualitas tidur Anda…",
        code: "sleep_quality",
        kind: "select",
        options: sleepQuality,
      },
      {
        key: "sleep_disturbance",
        label:
          "Seberapa sering Anda mengalami gangguan tidur (sulit tidur atau sering terbangun)?",
        code: "sleep_disturbance",
        kind: "select",
        options: sleepDisturbance,
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
