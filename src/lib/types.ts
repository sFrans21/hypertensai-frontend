// ============================================================================
// Kontrak data API HypertensAI.
// Struktur ini terikat secara absolut dengan backend FastAPI.
// JANGAN mengubah nama kunci (key) di bawah ini.
// ============================================================================

/** Payload yang dikirim ke POST {NEXT_PUBLIC_API_URL}/api/v1/analyze */
export interface AnalyzePayload {
  age: number;
  is_female: number; // 1 = Perempuan, 0 = Laki-laki
  bmi: number; // dihitung dari weight_kg & height_cm
  is_smoker: number; // 1 = Ya, 0 = Tidak
  has_diabetes: number; // 1 = Ya, 0 = Tidak
  has_high_cholesterol: number; // 1 = Ya, 0 = Tidak
  sleep_quality: number; // 1–5 (1 = sangat buruk, 5 = sangat baik)
  sleep_disturbance: number; // 1–5 (1 = jarang, 5 = selalu)
}

export interface Prediction {
  risk_score: number; // 0..1
  risk_status: string; // "Low Risk" | "High Risk" | dst.
}

export interface AnalyzeData {
  prediction: Prediction;
  xai_analysis: Record<string, number>;
  clinical_narrative: string;
}

export interface AnalyzeResponse {
  status: string; // "success"
  data: AnalyzeData;
}
