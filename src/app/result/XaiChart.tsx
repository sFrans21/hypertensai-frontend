"use client";

import { displayInputValue } from "@/lib/fields";

const FEATURE_LABELS: Record<string, string> = {
  age: "Usia",
  is_female: "Jenis kelamin",
  bmi: "BMI",
  waist_cm: "Lingkar pinggang",
  is_smoker: "Merokok",
  freq_instant_noodle: "Konsumsi mi instan",
  ak02: "Aktivitas berat",
  ak05: "Aktivitas sedang",
  ak07: "Durasi aktivitas",
  has_diabetes: "Diabetes",
  has_high_cholesterol: "Kolesterol tinggi",
  sleep_quality: "Kualitas tidur",
  sleep_disturbance: "Gangguan tidur",
  genetic_risk_score: "Riwayat keluarga",
  ps_A: "Mudah terganggu",
  ps_B: "Sulit konsentrasi",
  ps_C: "Perasaan sedih",
  ps_E: "Optimisme",
  ps_F: "Kecemasan",
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
        Pengaruh Faktor Risiko
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

        <p className="mt-3 text-xs leading-relaxed text-muted">
          Panjang batang menunjukkan besar kontribusi relatif tiap faktor. Warna
          menunjukkan arah: hijau menurunkan, merah menaikkan estimasi risiko.
          Ini bukan persentase risiko total Anda.
        </p>
      </div>
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
                <span className="text-xs font-normal text-muted">
                  {d.input}
                </span>
              )}
              <span className="font-bold" style={{ color: d.color }}>
                {d.percent.toFixed(1)}%
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
