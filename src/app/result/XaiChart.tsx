"use client";

import { useState } from "react";

// Label pendek untuk tiap fitur model (kunci = nama fitur dari backend/SHAP).
// Sesuaikan jika nama fitur di model Anda berbeda.
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
  genetic_risk_score: "Riwayat keluarga",
  ps_A: "Mudah terganggu",
  ps_B: "Sulit konsentrasi",
  ps_C: "Perasaan sedih",
  ps_E: "Optimisme",
  ps_F: "Kecemasan",
};

const COLORS = [
  "#0A5F5E",
  "#0E7C7B",
  "#5FB0AE",
  "#F59E0B",
  "#6366F1",
  "#94A3B8",
];

interface Ranked {
  key: string;
  label: string;
  value: number;
  percent: number;
  color: string;
}

export default function XaiChart({ data }: { data: Record<string, number> }) {
  const [view, setView] = useState<"bar" | "pie">("bar");

  const entries = Object.entries(data ?? {});
  const total = entries.reduce((sum, [, v]) => sum + Math.abs(v), 0);
  if (entries.length === 0 || total === 0) return null;

  // Ranking dari terbesar ke terkecil + hitung persentase.
  const ranked: Ranked[] = entries
    .map(([key, value]) => ({
      key,
      label: FEATURE_LABELS[key] ?? key,
      value: Math.abs(value),
      percent: (Math.abs(value) / total) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
          Faktor Risiko Utama
        </h2>
        <div className="inline-flex rounded-lg border border-line bg-surface p-0.5">
          <button
            type="button"
            onClick={() => setView("bar")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              view === "bar" ? "bg-teal-500 text-white" : "text-muted"
            }`}
          >
            Batang
          </button>
          <button
            type="button"
            onClick={() => setView("pie")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              view === "pie" ? "bg-teal-500 text-white" : "text-muted"
            }`}
          >
            Lingkaran
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-surface px-5 py-5">
        {view === "bar" ? (
          <BarChart data={ranked} />
        ) : (
          <PieChart data={ranked} />
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Persentase menunjukkan kontribusi relatif tiap faktor terhadap
          faktor-faktor teratas yang memengaruhi prediksi (analisis SHAP), bukan
          persentase risiko total Anda.
        </p>
      </div>
    </section>
  );
}

function BarChart({ data }: { data: Ranked[] }) {
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.key}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-ink">{d.label}</span>
            <span className="font-bold text-ink">{d.percent.toFixed(1)}%</span>
          </div>
          <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${d.percent}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }: { data: Ranked[] }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
      <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0">
        {data.map((d) => {
          const arc = (d.percent / 100) * C;
          const el = (
            <circle
              key={d.key}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={d.color}
              strokeWidth="34"
              strokeDasharray={`${arc} ${C - arc}`}
              strokeDashoffset={-acc}
              transform="rotate(-90 100 100)"
            />
          );
          acc += arc;
          return el;
        })}
      </svg>
      <ul className="w-full space-y-2 sm:w-auto">
        {data.map((d) => (
          <li
            key={d.key}
            className="flex items-center justify-between gap-4 text-sm sm:justify-start"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-ink">{d.label}</span>
            </span>
            <span className="font-bold text-ink">{d.percent.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
