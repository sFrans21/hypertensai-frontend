// "use client";

// import { useState } from "react";

// // Label pendek untuk tiap fitur model (kunci = nama fitur dari backend/SHAP).
// // Sesuaikan jika nama fitur di model Anda berbeda.
// const FEATURE_LABELS: Record<string, string> = {
//   age: "Usia",
//   is_female: "Jenis kelamin",
//   bmi: "BMI",
//   waist_cm: "Lingkar pinggang",
//   is_smoker: "Merokok",
//   freq_instant_noodle: "Konsumsi mi instan",
//   ak02: "Aktivitas berat",
//   ak05: "Aktivitas sedang",
//   ak07: "Durasi aktivitas",
//   has_diabetes: "Diabetes",
//   genetic_risk_score: "Riwayat keluarga",
//   ps_A: "Mudah terganggu",
//   ps_B: "Sulit konsentrasi",
//   ps_C: "Perasaan sedih",
//   ps_E: "Optimisme",
//   ps_F: "Kecemasan",
// };

// const COLORS = [
//   "#0A5F5E",
//   "#0E7C7B",
//   "#5FB0AE",
//   "#F59E0B",
//   "#6366F1",
//   "#94A3B8",
// ];

// interface Ranked {
//   key: string;
//   label: string;
//   value: number;
//   percent: number;
//   color: string;
// }

// export default function XaiChart({ data }: { data: Record<string, number> }) {
//   const [view, setView] = useState<"bar" | "pie">("bar");

//   const entries = Object.entries(data ?? {});
//   const total = entries.reduce((sum, [, v]) => sum + Math.abs(v), 0);
//   if (entries.length === 0 || total === 0) return null;

//   // Ranking dari terbesar ke terkecil + hitung persentase.
//   const ranked: Ranked[] = entries
//     .map(([key, value]) => ({
//       key,
//       label: FEATURE_LABELS[key] ?? key,
//       value: Math.abs(value),
//       percent: (Math.abs(value) / total) * 100,
//     }))
//     .sort((a, b) => b.value - a.value)
//     .map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));

//   return (
//     <section className="mt-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
//           Faktor Risiko Utama
//         </h2>
//         <div className="inline-flex rounded-lg border border-line bg-surface p-0.5">
//           <button
//             type="button"
//             onClick={() => setView("bar")}
//             className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
//               view === "bar" ? "bg-teal-500 text-white" : "text-muted"
//             }`}
//           >
//             Batang
//           </button>
//           <button
//             type="button"
//             onClick={() => setView("pie")}
//             className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
//               view === "pie" ? "bg-teal-500 text-white" : "text-muted"
//             }`}
//           >
//             Lingkaran
//           </button>
//         </div>
//       </div>

//       <div className="mt-3 rounded-2xl border border-line bg-surface px-5 py-5">
//         {view === "bar" ? (
//           <BarChart data={ranked} />
//         ) : (
//           <PieChart data={ranked} />
//         )}
//         <p className="mt-4 text-xs leading-relaxed text-muted">
//           Persentase menunjukkan kontribusi relatif tiap faktor terhadap
//           faktor-faktor teratas yang memengaruhi prediksi (analisis SHAP), bukan
//           persentase risiko total Anda.
//         </p>
//       </div>
//     </section>
//   );
// }

// function BarChart({ data }: { data: Ranked[] }) {
//   return (
//     <div className="space-y-3">
//       {data.map((d) => (
//         <div key={d.key}>
//           <div className="flex items-baseline justify-between text-sm">
//             <span className="font-medium text-ink">{d.label}</span>
//             <span className="font-bold text-ink">{d.percent.toFixed(1)}%</span>
//           </div>
//           <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-line">
//             <div
//               className="h-full rounded-full transition-all duration-500"
//               style={{ width: `${d.percent}%`, backgroundColor: d.color }}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function PieChart({ data }: { data: Ranked[] }) {
//   const R = 70;
//   const C = 2 * Math.PI * R;
//   let acc = 0;
//   return (
//     <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
//       <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0">
//         {data.map((d) => {
//           const arc = (d.percent / 100) * C;
//           const el = (
//             <circle
//               key={d.key}
//               cx="100"
//               cy="100"
//               r={R}
//               fill="none"
//               stroke={d.color}
//               strokeWidth="34"
//               strokeDasharray={`${arc} ${C - arc}`}
//               strokeDashoffset={-acc}
//               transform="rotate(-90 100 100)"
//             />
//           );
//           acc += arc;
//           return el;
//         })}
//       </svg>
//       <ul className="w-full space-y-2 sm:w-auto">
//         {data.map((d) => (
//           <li
//             key={d.key}
//             className="flex items-center justify-between gap-4 text-sm sm:justify-start"
//           >
//             <span className="flex items-center gap-2">
//               <span
//                 className="inline-block h-3 w-3 rounded-sm"
//                 style={{ backgroundColor: d.color }}
//               />
//               <span className="text-ink">{d.label}</span>
//             </span>
//             <span className="font-bold text-ink">{d.percent.toFixed(1)}%</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

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
  increases: boolean;
  color: string;
}

export default function XaiChart({ data }: { data: Record<string, number> }) {
  const [view, setView] = useState<"bar" | "pie">("bar");

  const entries = Object.entries(data ?? {});
  const total = entries.reduce((s, [, v]) => s + Math.abs(v), 0);
  if (entries.length === 0 || total === 0) return null;

  const factors: Factor[] = entries
    .map(([key, value]) => ({
      key,
      label: FEATURE_LABELS[key] ?? key,
      percent: (Math.abs(value) / total) * 100,
      increases: value > 0,
      color: value > 0 ? UP : DOWN,
    }))
    .sort((a, b) => b.percent - a.percent);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
          Pengaruh Faktor Risiko
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
          <BarView data={factors} />
        ) : (
          <PieView data={factors} />
        )}

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
          Panjang batang/irisan menunjukkan besar kontribusi relatif tiap
          faktor. Warna menunjukkan arah: hijau menurunkan, merah menaikkan
          estimasi risiko. Ini bukan persentase risiko total Anda.
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
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-ink">{d.label}</span>
            <span className="font-bold" style={{ color: d.color }}>
              {d.percent.toFixed(1)}%
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

// function PieView({ data }: { data: Factor[] }) {
//   const R = 70;
//   const C = 2 * Math.PI * R;
//   const GAP = 1.2;
//   let acc = 0;
//   return (
//     <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
//       <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0">
//         {data.map((d) => {
//           const arc = (d.percent / 100) * C;
//           const dash = Math.max(arc - GAP, 0);
//           const el = (
//             <circle
//               key={d.key}
//               cx="100"
//               cy="100"
//               r={R}
//               fill="none"
//               stroke={d.color}
//               strokeWidth="34"
//               strokeDasharray={`${dash} ${C - dash}`}
//               strokeDashoffset={-acc}
//               transform="rotate(-90 100 100)"
//             />
//           );
//           acc += arc;
//           return el;
//         })}
//       </svg>
//       <ul className="w-full space-y-2">
//         {data.map((d) => (
//           <li
//             key={d.key}
//             className="flex items-center justify-between gap-4 text-sm"
//           >
//             <span className="flex items-center gap-2">
//               <span
//                 className="inline-block h-3 w-3 rounded-sm"
//                 style={{ backgroundColor: d.color }}
//               />
//               <span className="text-ink">{d.label}</span>
//             </span>
//             <span className="font-bold" style={{ color: d.color }}>
//               {d.percent.toFixed(1)}%
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

const GROUP_THRESHOLD = 5; // fitur dengan kontribusi < 5% digabung jadi "Lainnya"

interface PieSlice {
  key: string;
  label: string;
  percent: number;
  color: string;
  members?: Factor[]; // terisi jika irisan ini kelompok "Lainnya"
}

// Khusus diagram lingkaran: fitur < 5% dikelompokkan menjadi "Lainnya",
// dipisah menurut arah/warna (merah = menaikkan, hijau = menurunkan risiko).
function groupForPie(data: Factor[]): PieSlice[] {
  const major: PieSlice[] = [];
  const minorUp: Factor[] = [];
  const minorDown: Factor[] = [];

  for (const d of data) {
    if (d.percent >= GROUP_THRESHOLD) {
      major.push({ key: d.key, label: d.label, percent: d.percent, color: d.color });
    } else if (d.increases) {
      minorUp.push(d);
    } else {
      minorDown.push(d);
    }
  }

  const sum = (arr: Factor[]) => arr.reduce((s, d) => s + d.percent, 0);
  const groups: PieSlice[] = [];
  if (minorUp.length > 0) {
    groups.push({
      key: "__others_up",
      label: "Lainnya (meningkatkan risiko)",
      percent: sum(minorUp),
      color: UP,
      members: minorUp,
    });
  }
  if (minorDown.length > 0) {
    groups.push({
      key: "__others_down",
      label: "Lainnya (menurunkan risiko)",
      percent: sum(minorDown),
      color: DOWN,
      members: minorDown,
    });
  }

  // Irisan besar tetap urut dari terbesar; kelompok "Lainnya" diletakkan di akhir.
  return [...major, ...groups];
}

function PieView({ data }: { data: Factor[] }) {
  const pieData = groupForPie(data);
  const R = 70;
  const C = 2 * Math.PI * R;
  const GAP = 1.2;
  let acc = 0; // akumulasi panjang arc (untuk posisi irisan)
  let accPct = 0; // akumulasi persen (untuk posisi nomor)

  const slices = pieData.map((d, i) => {
    const arc = (d.percent / 100) * C;
    const dash = Math.max(arc - GAP, 0);
    const offset = -acc;
    const midPct = accPct + d.percent / 2;
    const angle = (midPct / 100) * 2 * Math.PI; // 0 = atas, searah jarum jam
    const lx = 100 + R * Math.sin(angle);
    const ly = 100 - R * Math.cos(angle);
    acc += arc;
    accPct += d.percent;
    return { ...d, num: i + 1, dash, offset, lx, ly };
  });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0">
        {slices.map((s) => (
          <circle
            key={`arc-${s.key}`}
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth="34"
            strokeDasharray={`${s.dash} ${C - s.dash}`}
            strokeDashoffset={s.offset}
            transform="rotate(-90 100 100)"
          />
        ))}
        {slices.map((s) => (
          <text
            key={`lbl-${s.key}`}
            x={s.lx}
            y={s.ly}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="700"
            fill="#ffffff"
          >
            {s.num}
          </text>
        ))}
      </svg>

      <ul className="w-full space-y-2">
        {slices.map((s) => (
          <li key={s.key}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white"
                  style={{ backgroundColor: s.color }}
                >
                  {s.num}
                </span>
                <span className="text-ink">{s.label}</span>
              </span>
              <span className="font-bold" style={{ color: s.color }}>
                {s.percent.toFixed(1)}%
              </span>
            </div>

            {/* Rincian anggota kelompok "Lainnya" */}
            {s.members && (
              <ul className="ml-7 mt-2 space-y-1.5 border-l border-line pl-3">
                {s.members.map((m) => (
                  <li
                    key={m.key}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="text-muted">{m.label}</span>
                    </span>
                    <span className="font-semibold" style={{ color: m.color }}>
                      {m.percent.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
