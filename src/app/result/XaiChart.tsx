"use client";

import { displayInputValue } from "@/lib/fields";

// Label untuk 11 fitur model CatBoost (`best_hipertensi_model.pkl`). Kunci di
// sini harus sama persis dengan `feature_names` model agar hasil SHAP dari
// backend tampil dengan label Bahasa Indonesia, bukan kunci mentah.
const FEATURE_LABELS: Record<string, string> = {
  age: "Usia",
  is_female: "Jenis kelamin",
  bmi: "BMI",
  has_tobacco: "Konsumsi tembakau",
  has_diabetes: "Riwayat Diabetes",
  has_high_cholesterol: "Riwayat Kolesterol tinggi",
  has_kidney_disease: "Riwayat Penyakit ginjal",
  has_stroke: "Riwayat stroke",
  active_status: "Status aktivitas fisik",
  freq_noodles: "Frekuensi mie instan",
  freq_fast_food: "Frekuensi makanan cepat saji",
};

const UP = "#DC2626"; // merah: menaikkan risiko
const DOWN = "#16A34A"; // hijau: menurunkan risiko

interface Factor {
  key: string;
  label: string;
  percent: number; // share magnitudo (0-100)
  color: string;
  input: string | null; // nilai input pengguna untuk fitur ini
}

export default function XaiChart({
  data,
  inputs,
}: {
  data: Record<string, number>;
  inputs?: Record<string, string>;
}) {
  const entries = Object.entries(data ?? {});
  const total = entries.reduce((s, [, v]) => s + Math.abs(v), 0);
  if (entries.length === 0 || total === 0) return null;

  const factors: Factor[] = entries
    .map(([key, value]) => ({
      key,
      label: FEATURE_LABELS[key] ?? key,
      percent: (Math.abs(value) / total) * 100,
      color: value > 0 ? UP : DOWN,
      input: inputs ? displayInputValue(key, inputs) : null,
    }))
    .sort((a, b) => b.percent - a.percent);

  return (
    <section className="mt-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
        Grafik/Chart Kontribusi Fitur
      </h2>

      <div className="mt-3 rounded-2xl border border-line bg-surface px-5 py-5">
        <BarView data={factors} />

        {/* Legenda arah */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4">
          <span className="flex items-center gap-2 text-xs text-muted">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: DOWN }}
            />
            Mengurangi risiko
          </span>
          <span className="flex items-center gap-2 text-xs text-muted">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: UP }}
            />
            Meningkatkan risiko
          </span>
        </div>

        {/* <p className="mt-3 text-xs leading-relaxed text-muted">
          Persentase (%) pada Grafik/Chart Kontribusi Fitur menunjukkan porsi
          kontribusi atau seberapa besar pengaruh faktor tersebut dalam
          menentukan status risiko anda, bukan nilai risiko fitur itu sendiri.
          Warna menunjukkan arah: hijau menurunkan, merah menaikkan estimasi
          risiko. Ini bukan persentase risiko total Anda. pada frekuensi makan
          cepat saji dan mie instan, Konsumsi minimal 3 hari per minggu
          tergolong sering.",
        </p> */}
      </div>

      <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-muted list-disc list-inside">
        <li>
          <strong className="text-ink">Persentase (%):</strong> Menunjukkan
          porsi kontribusi faktor terhadap status risiko, bukan nilai risiko
          total Anda.
        </li>
        <li>
          <strong className="text-ink">Warna:</strong> Hijau menurunkan estimasi
          risiko, sedangkan merah meningkatkan estimasi risiko.
        </li>
        <li>
          <strong className="text-ink">Frekuensi Makan:</strong> Konsumsi
          minimal <strong>3 hari per minggu</strong> tergolong kategori{" "}
          <em>Sering</em>, dibawahnya tergolong Jarang.
        </li>
      </ul>
    </section>
  );
}

function BarView({ data }: { data: Factor[] }) {
  const max = data[0]?.percent || 1; // skala relatif ke faktor terbesar
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.key}>
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="font-medium text-ink">{d.label}</span>
            <span className="flex items-baseline gap-2">
              {d.input && (
                <span className="text-xs font-semibold text-muted">
                  {d.input}
                </span>
              )}
              <span className="font-bold" style={{ color: d.color }}>
                {d.percent.toFixed(1)}%
              </span>
              <span className="text-[11px] font-normal text-ink">
                (dari total pengaruh)
              </span>
            </span>
          </div>
          <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(d.percent / max) * 100}%`,
                backgroundColor: d.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
