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

/**
 * Field formulir di luar kontrak API (`AnalyzePayload`). Nilainya dipakai untuk
 * menurunkan fitur model sebelum dikirim, bukan dikirim langsung:
 *  - `weight_kg` & `height_cm` -> dihitung menjadi `bmi`.
 *  - `hard_act_last7d`, `moderate_act_last7d`, `walking_last7d` -> diturunkan
 *    menjadi `active_status` (aktif bila berat dan/atau sedang; kurang aktif
 *    bila hanya jalan kaki).
 *  - `has_noodles` + `noodles_days_last7d` -> diturunkan menjadi
 *    `freq_noodles`, dan `has_fast_food` + `fast_food_days_last7d` menjadi
 *    `freq_fast_food`. Pasangan ini meniru struktur kuesioner IFLS-5 buku 3B
 *    modul FM (FM02 = pernah/tidak, FM03 = jumlah hari), sehingga jawaban
 *    "tidak" otomatis berarti nol hari alias kategori jarang.
 */
export type ExtraFieldKey =
  | "weight_kg"
  | "height_cm"
  | "hard_act_last7d"
  | "moderate_act_last7d"
  | "walking_last7d"
  | "has_noodles"
  | "noodles_days_last7d"
  | "has_fast_food"
  | "fast_food_days_last7d";

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
  /**
   * Tampilkan field hanya bila field lain bernilai tertentu (skip pattern
   * kuesioner). Field yang tersembunyi tidak divalidasi dan tidak wajib diisi.
   */
  showIf?: { key: FieldKey; equals: string };
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
    id: "gaya-hidup",
    title: "Gaya Hidup",
    subtitle: "Kebiasaan yang memengaruhi tekanan darah.",
    fields: [
      {
        key: "has_tobacco",
        label:
          "Apakah Anda pernah atau sedang aktif mengonsumsi tembakau (merokok, melinting, pipa, atau mengunyah)?",
        code: "has_tobacco",
        kind: "select",
        options: yesNo,
      },
      {
        key: "has_noodles",
        label: "Dalam 7 hari terakhir, apakah Anda makan mie instan?",
        code: "fm02 (fmtype K)",
        kind: "select",
        options: yesNo,
      },
      {
        key: "noodles_days_last7d",
        label: "Berapa hari Anda makan mie instan dalam 7 hari terakhir?",
        code: "fm03 (fmtype K)",
        hint: "Konsumsi minimal 3 hari per minggu tergolong sering.",
        kind: "number",
        unit: "hari",
        min: 1,
        max: 7,
        step: 1,
        showIf: { key: "has_noodles", equals: "1" },
      },
      {
        key: "has_fast_food",
        label:
          "Dalam 7 hari terakhir, apakah Anda makan makanan cepat saji (misal: KFC, burger, pizza)?",
        code: "fm02 (fmtype L)",
        kind: "select",
        options: yesNo,
      },
      {
        key: "fast_food_days_last7d",
        label:
          "Berapa hari Anda makan makanan cepat saji dalam 7 hari terakhir?",
        code: "fm03 (fmtype L)",
        hint: "Konsumsi minimal 3 hari per minggu tergolong sering.",
        kind: "number",
        unit: "hari",
        min: 1,
        max: 7,
        step: 1,
        showIf: { key: "has_fast_food", equals: "1" },
      },
    ],
  },
  {
    id: "aktivitas-fisik",
    title: "Aktivitas Fisik",
    subtitle: "Aktivitas fisik responden",
    fields: [
      {
        key: "hard_act_last7d",
        label:
          "Selama 7 hari terakhir, apakah anda melakukan kegiatan fisik berat selama 10 menit berturut-turut? (Kegiatan fisik berat, yaitu kegiatan yang membuat anda bernafas jauh lebih berat dari biasanya, misal: mengangkat barang berat, menggali, mencangkul, bersepeda sambil membawa beban berat, dan sebagainya)",
        code: "hard_act_last7d",
        kind: "select",
        options: yesNo,
      },
      {
        key: "moderate_act_last7d",
        label:
          "Selama 7 hari terakhir, apakah anda melakukan kegiatan fisik sedang selama 10 menit berturut-turut? (Kegiatan fisik sedang, yaitu kegiatan yang membuat anda bernafas agak lebih berat dari biasanya, seperti mengangkat barang yang tidak terlalu berat, bersepeda dalam kecepatan biasa, atau mengepel lantai (tidak termasuk berjalan kaki)",
        code: "moderate_act_last7d",
        kind: "select",
        options: yesNo,
      },
      {
        key: "walking_last7d",
        label:
          "Selama 7 hari terakhir, apakah anda melakukan jalan kaki selama 10 menit berturut-turut? (jalan kaki, termasuk berjalan kaki di pekerjaan, di rumah, atau dari satu tempat ke tempat lain. Ini termasuk juga pada saat berekreasi, olahraga, atau di waktu luang.)",
        code: "walking_last7d",
        kind: "select",
        options: yesNo,
      },
    ],
  },
  {
    id: "riwayat-medis",
    title: "Riwayat Medis",
    subtitle: "Riwayat penyakit",
    fields: [
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
      {
        key: "has_kidney_disease",
        label:
          "Apakah Dokter/Paramedis/Perawat/Bidan pernah mengatakan bahwa Anda memiliki penyakit ginjal?",
        code: "has_kidney_disease",
        kind: "select",
        options: yesNo,
      },
      {
        key: "has_stroke",
        label:
          "Apakah Dokter/Paramedis/Perawat/Bidan pernah mengatakan bahwa Anda memiliki penyakit stroke?",
        code: "has_stroke",
        kind: "select",
        options: yesNo,
      },
    ],
  },
];

/** Semua field dalam urutan kontrak API. */
export const ALL_FIELDS: FieldDef[] = FORM_STEPS.flatMap((s) => s.fields);

/** Ambang kategori "sering" untuk frekuensi makan (hari per minggu). */
export const AMBANG_SERING_HARI = 3;

/**
 * Pasangan pertanyaan FM02/FM03 -> fitur kategorikal frekuensi makan.
 * Dipakai bersama oleh formulir (penyusunan payload) dan halaman hasil
 * (penampilan nilai input), agar aturannya hanya ditulis satu kali.
 */
export const FREQ_DERIVED: Record<
  "freq_noodles" | "freq_fast_food",
  { hasKey: ExtraFieldKey; daysKey: ExtraFieldKey }
> = {
  freq_noodles: {
    hasKey: "has_noodles",
    daysKey: "noodles_days_last7d",
  },
  freq_fast_food: {
    hasKey: "has_fast_food",
    daysKey: "fast_food_days_last7d",
  },
};

/**
 * Menurunkan kategori frekuensi makan dari jawaban FM02 + FM03.
 * Menjawab "tidak" berarti nol hari, sehingga otomatis tergolong jarang (0) —
 * persis seperti penanganan structural missing di pipeline data preparation.
 * Mengembalikan null bila pertanyaan pokoknya belum dijawab.
 */
export function deriveFreq(
  hasRaw: string | undefined,
  daysRaw: string | undefined,
): number | null {
  if (hasRaw === undefined || hasRaw === "") return null;
  if (Number(hasRaw) !== 1) return 0;
  const days = Number(daysRaw);
  if (!Number.isFinite(days) || daysRaw === "" || daysRaw === undefined)
    return null;
  return days >= AMBANG_SERING_HARI ? 1 : 0;
}

/** Field yang sedang tampil menurut aturan `showIf` (skip pattern kuesioner). */
export function isFieldVisible(
  field: FieldDef,
  values: Record<string, string>,
): boolean {
  if (!field.showIf) return true;
  return values[field.showIf.key] === field.showIf.equals;
}

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

  // `active_status` tidak diinput langsung — diturunkan dari pertanyaan aktivitas
  // fisik: aktif bila berat dan/atau sedang, kurang aktif bila hanya jalan kaki.
  if (featureKey === "active_status") {
    const hard = values.hard_act_last7d;
    const moderate = values.moderate_act_last7d;
    if (hard === "" && moderate === "") return null;
    return Number(hard) === 1 || Number(moderate) === 1
      ? "Aktif"
      : "Kurang aktif";
  }

  // Frekuensi makan: diturunkan dari pasangan FM02 (pernah/tidak) + FM03 (hari).
  if (featureKey === "freq_noodles" || featureKey === "freq_fast_food") {
    const { hasKey, daysKey } = FREQ_DERIVED[featureKey];
    const freq = deriveFreq(values[hasKey], values[daysKey]);
    if (freq === null) return null;
    if (Number(values[hasKey]) !== 1) return "Jarang (tidak konsumsi)";
    const days = Number(values[daysKey]);
    return `${freq === 1 ? "Sering" : "Jarang"} (${days} hari/minggu)`;
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
