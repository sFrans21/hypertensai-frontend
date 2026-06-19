// ============================================================================
// Kontrak data API HypertensAI.
// Struktur ini terikat secara absolut dengan backend FastAPI.
// JANGAN mengubah nama kunci (key) di bawah ini.
// ============================================================================

/** Payload yang dikirim ke POST {NEXT_PUBLIC_API_URL}/api/v1/analyze */
export interface AnalyzePayload {
  age: number;
  is_female: number; // 1 = Perempuan, 0 = Laki-laki
  bmi: number;
  waist_cm: number;
  is_smoker: number; // 1 = Ya, 0 = Tidak
  freq_instant_noodle: number; // porsi per minggu
  ak02: number; // hari/minggu aktivitas fisik berat
  ak05: number; // hari/minggu aktivitas fisik sedang
  ak07: number; // total durasi aktivitas (menit/hari)
  has_diabetes: number; // 1 = Ya, 0 = Tidak
  genetic_risk_score: number; // skala 0-2
  ps_A: number; // CES-D afektif (1-3)
  ps_B: number; // CES-D kognitif (1-3)
  ps_C: number; // CES-D afektif depresif (1-3)
  ps_E: number; // CES-D afektif positif / reverse (1-3)
  ps_F: number; // CES-D kecemasan (1-3)
}

export interface Prediction {
  risk_score: number; // 0..1
  risk_status: string; // "Low Risk" | "High Risk" | dst.
}

export interface AnalyzeData {
  prediction: Prediction;
  xai_analysis: Record<string, unknown>;
  clinical_narrative: string;
}

export interface AnalyzeResponse {
  status: string; // "success"
  data: AnalyzeData;
}
