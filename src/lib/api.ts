import type { AnalyzePayload, AnalyzeResponse } from "./types";

const ENDPOINT_PATH = "/api/v1/analyze";

/** Kunci LocalStorage yang dipakai untuk menyimpan hasil analisis (sesuai PRD). */
export const STORAGE_KEY = "analysisResult";

/** Hasil yang disimpan ke LocalStorage: respons API + penanda apakah simulasi. */
export interface StoredResult extends AnalyzeResponse {
  _simulated?: boolean;
}

function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Memanggil endpoint backend untuk menganalisis risiko hipertensi.
 *
 * Mengembalikan objek respons yang sesuai kontrak API. Jika backend tidak
 * dapat dihubungi DAN mode demo aktif (NEXT_PUBLIC_DEMO_MODE=true), fungsi
 * mengembalikan hasil SIMULASI yang ditandai `_simulated: true` agar UI dapat
 * menampilkannya secara jujur sebagai data simulasi, bukan prediksi nyata.
 */
export async function analyzeRisk(
  payload: AnalyzePayload,
): Promise<StoredResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    if (isDemoMode()) return simulateResult(payload);
    throw new Error(
      "Konfigurasi NEXT_PUBLIC_API_URL belum diatur. Tambahkan di file .env.local.",
    );
  }

  const url = `${baseUrl.replace(/\/+$/, "")}${ENDPOINT_PATH}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server membalas dengan status ${res.status}.`);
    }

    const json = (await res.json()) as AnalyzeResponse;

    if (!json?.data?.prediction) {
      throw new Error("Format respons dari server tidak sesuai.");
    }

    return json;
  } catch (err) {
    // Jika mode demo aktif, jangan gagalkan alur presentasi — beri hasil simulasi.
    if (isDemoMode()) return simulateResult(payload);

    if (err instanceof TypeError) {
      // Kegagalan jaringan / CORS / server mati.
      throw new Error(
        "Tidak dapat terhubung ke server analisis. Pastikan backend berjalan dan NEXT_PUBLIC_API_URL benar.",
      );
    }
    throw err instanceof Error ? err : new Error("Terjadi kesalahan tak terduga.");
  }
}

// ----------------------------------------------------------------------------
// Mode DEMO — hanya untuk presentasi tanpa backend.
// Heuristik transparan & sederhana; HASIL TIDAK VALID secara medis.
// ----------------------------------------------------------------------------
function simulateResult(p: AnalyzePayload): StoredResult {
  let score = 0.12;
  if (p.age >= 45) score += 0.18;
  if (p.bmi >= 27) score += 0.15;
  if (p.waist_cm !== null && p.waist_cm >= 90) score += 0.1;
  if (p.is_smoker === 1) score += 0.1;
  if (p.has_diabetes === 1) score += 0.15;
  score += p.genetic_risk_score * 0.08;
  score += Math.max(0, p.freq_instant_noodle - 3) * 0.01;
  if (p.ak02 + p.ak05 === 0) score += 0.06;
  const psychoLoad = p.ps_A + p.ps_B + p.ps_C + p.ps_F - p.ps_E;
  score += Math.max(0, psychoLoad - 6) * 0.015;

  const risk_score = Math.min(0.97, Math.max(0.03, score));
  const high = risk_score >= 0.5;

  const narrative = high
    ? `Berdasarkan data simulasi, profil Anda menunjukkan beberapa faktor yang perlu diperhatikan.\n\nKombinasi faktor seperti usia, indeks massa tubuh, dan gaya hidup berkontribusi pada estimasi risiko ini. Pertimbangkan untuk berkonsultasi dengan tenaga kesehatan untuk pemeriksaan tekanan darah secara langsung.\n\nLangkah awal yang dapat membantu: aktivitas fisik teratur, mengurangi konsumsi garam dan makanan olahan, serta menjaga berat badan ideal.`
    : `Berdasarkan data simulasi, profil Anda saat ini berada pada kategori risiko yang relatif rendah.\n\nTetap pertahankan gaya hidup sehat: aktivitas fisik rutin, pola makan seimbang, dan pengelolaan stres yang baik.\n\nSkrining ini bersifat awal. Pemeriksaan tekanan darah berkala tetap dianjurkan.`;

  return {
    status: "success",
    data: {
      prediction: {
        risk_score,
        risk_status: high ? "High Risk" : "Low Risk",
      },
      xai_analysis: {},
      clinical_narrative: narrative,
    },
    _simulated: true,
  };
}
