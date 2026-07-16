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

// Skala IFLS-5 `tdr01` (PSQI, tdrtype=2): 1 = kualitas terbaik ... 5 = terburuk.
// Model dilatih pada skala mentah ini (nilai tinggi = tidur makin buruk = risiko
// hipertensi makin tinggi). Label WAJIB mengikuti arah tersebut, jika terbalik
// maka "Sangat buruk" justru terkirim sebagai nilai 1 dan SHAP salah arah.
const sleepQuality: SelectOption[] = [
  { value: 1, label: "1 — Sangat buruk" },
  { value: 2, label: "2 — Buruk" },
  { value: 3, label: "3 — Cukup" },
  { value: 4, label: "4 — Baik" },
  { value: 5, label: "5 — Sangat baik" },
];

// const sleepQuality: SelectOption[] = [
//   { value: 5, label: "1 — Sangat buruk" },
//   { value: 4, label: "2 — Buruk" },
//   { value: 3, label: "3 — Cukup" },
//   { value: 2, label: "4 — Baik" },
//   { value: 1, label: "5 — Sangat baik" },
// ];

const sleepDisturbance: SelectOption[] = [
  { value: 1, label: "1 — Tidak pernah" },
  { value: 2, label: "2 — Jarang" },
  { value: 3, label: "3 — Kadang-kadang" },
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
        label:
          "Apakah Anda pernah atau sedang aktif mengonsumsi tembakau (merokok, melinting, pipa, atau mengunyah)?",
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
          "Apakah Dokter/Paramedis/Perawat/Bidan pernah mengatakan bahwa Anda memiliki kolesterol tinggi?",
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
        label:
          "Dalam 1 minggu terakhir, bagaimana Anda menilai kualitas tidur Anda?",
        code: "sleep_quality",
        kind: "select",
        options: sleepQuality,
      },
      {
        key: "sleep_disturbance",
        label:
          "Dalam satu minggu terakhir, seberapa sering Anda mengalami gangguan tidur (sulit tidur atau sering terbangun)?",
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

/**
 * Nilai input pengguna untuk sebuah fitur model, diformat untuk ditampilkan
 * di hasil analisis (mis. "30 tahun", "Laki-laki", "Cukup").
 * `bmi` dihitung dari berat & tinggi karena tidak diinput langsung.
 * Mengembalikan null jika data tidak tersedia.
 */
export function displayInputValue(
  featureKey: string,
  values: Record<string, string>,
): string | null {
  if (featureKey === "bmi") {
    const weight = Number(values.weight_kg);
    const heightM = Number(values.height_cm) / 100;
    if (weight > 0 && heightM > 0)
      return (weight / (heightM * heightM)).toFixed(1);
    return null;
  }

  const field = ALL_FIELDS.find((f) => f.key === featureKey);
  const raw = values[featureKey];
  if (!field || raw === undefined || raw === "") return null;

  if (field.kind === "select" && field.options) {
    const opt = field.options.find((o) => String(o.value) === raw);
    // Buang awalan skala numerik, mis. "3 — Cukup" -> "Cukup".
    if (opt) return opt.label.replace(/^\d+\s*—\s*/, "").trim();
    return raw;
  }

  return field.unit ? `${raw} ${field.unit}` : raw;
}
