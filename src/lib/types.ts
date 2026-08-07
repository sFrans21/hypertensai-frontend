// ============================================================================
// Kontrak data API HypertensAI.
// Struktur ini terikat secara absolut dengan backend FastAPI.
// JANGAN mengubah nama kunci (key) di bawah ini.
// ============================================================================

/**
 * Payload yang dikirim ke POST {NEXT_PUBLIC_API_URL}/api/v1/analyze
 *
 * Berisi TEPAT 11 fitur yang dipakai model (CatBoost `best_hipertensi_model.pkl`),
 * dengan urutan mengikuti `feature_names` model. Tiga di antaranya adalah fitur
 * turunan yang dihitung di sisi klien, bukan diinput langsung:
 *  - `bmi`            <- berat (kg) dan tinggi (cm).
 *  - `active_status`  <- aktif (1) bila responden melakukan aktivitas fisik
 *                        berat dan/atau sedang, kurang aktif (0) bila hanya
 *                        aktivitas ringan (jalan kaki).
 *  - `freq_noodles` & `freq_fast_food` <- sering (1) bila dikonsumsi minimal
 *                        3 hari dalam 7 hari terakhir, jarang (0) bila paling
 *                        banyak 2 hari (termasuk yang tidak mengonsumsi sama
 *                        sekali). Ambang mengikuti Destiani dkk. (2021).
 * Pertanyaan mentah penurunnya hanya dipakai di formulir, tidak dikirim ke API.
 */
export interface AnalyzePayload {
  // Identitas log opsional (nama/alias). BUKAN fitur model — hanya metadata
  // audit log di backend, tidak masuk preprocessing/inferensi/SHAP/LLM.
  name?: string;
  age: number;
  is_female: number;
  bmi: number;
  has_tobacco: number;
  has_diabetes: number;
  has_high_cholesterol: number;
  has_kidney_disease: number;
  has_stroke: number;
  active_status: number;
  freq_noodles: number;
  freq_fast_food: number;
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
