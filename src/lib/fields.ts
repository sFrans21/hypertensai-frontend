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
    ],
  },
  {
    id: "riwayat-medis",
    title: "Riwayat Medis & Gaya Hidup",
    subtitle: "Kondisi kesehatan dan kebiasaan yang memengaruhi tekanan darah.",
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
        key: "has_diabetes",
        label: "Riwayat diabetes",
        code: "has_diabetes",
        hint: "Pernah didiagnosis diabetes?",
        kind: "select",
        options: yesNo,
      },
      {
        key: "has_high_cholesterol",
        label: "Riwayat kolesterol tinggi",
        code: "has_high_cholesterol",
        hint: "Pernah didiagnosis kolesterol tinggi?",
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
        label: "Kualitas tidur",
        code: "sleep_quality",
        hint: "Seberapa baik kualitas tidur Anda secara keseluruhan?",
        kind: "select",
        options: sleepQuality,
      },
      {
        key: "sleep_disturbance",
        label: "Gangguan tidur",
        code: "sleep_disturbance",
        hint: "Seberapa sering Anda mengalami gangguan tidur (sulit tidur, sering terbangun)?",
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
