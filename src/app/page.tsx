"use client";
import Link from "next/link";
import { FORM_KEY, STORAGE_KEY } from "@/lib/api";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-12 lg:max-w-5xl lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-start lg:content-center lg:gap-x-12 lg:pt-12">
      {/* Kolom kiri (atas di mobile): intro */}
      <div className="lg:col-start-1 lg:row-start-1">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />
          Skrining Awal Berbasis AI
        </div>

        {/* Title */}
        <h1 className="mt-4 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-ink lg:text-5xl">
          Hypertens<span className="text-teal-500">AI</span>
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Kenali estimasi risiko hipertensi Anda dari data klinis dan gaya
          hidup, dijelaskan dalam bahasa yang mudah dipahami.
        </p>
      </div>

      {/* Kolom kanan (tengah di mobile): visual + langkah */}
      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
        {/* Signature element: calm ECG line */}
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-teal-700 px-6 py-8 shadow-float lg:mt-0">
          <div className="relative z-10">
            <p className="text-sm font-medium text-teal-100">Tekanan darah</p>
            <p className="mt-1 text-3xl font-bold text-white">Pantau dini.</p>
            <p className="mt-1 text-sm text-teal-100/90">
              Hipertensi sering tanpa gejala.
            </p>
          </div>
          <svg
            className="absolute inset-x-0 bottom-0 h-24 w-full text-teal-100/60"
            viewBox="0 0 400 80"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 40 H120 L135 40 L145 14 L158 66 L170 30 L182 40 H260 L274 40 L284 18 L296 62 L308 36 L320 40 H400"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1000"
              className="animate-ecg"
            />
          </svg>
        </div>

        {/* How it works */}
        <ol className="mt-8 space-y-3">
          {[
            { n: "1", t: "Isi kuesioner demografis dan gaya hidup" },
            {
              n: "2",
              t: "Sistem menganalisis skor risiko dengan model machine learning",
            },
            { n: "3", t: "Terima skor risiko & penjelasan dari AI" },
          ].map((s) => (
            <li key={s.n} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                {s.n}
              </span>
              <span className="text-sm text-ink">{s.t}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Spacer: dorong CTA ke bawah di mobile saja */}
      <div className="flex-1 lg:hidden" />

      {/* Kolom kiri bawah: CTA + disclaimer */}
      <div className="lg:col-start-1 lg:row-start-2">
        <Link
          href="/form"
          onClick={() => {
            try {
              localStorage.removeItem(FORM_KEY);
              localStorage.removeItem(STORAGE_KEY);
            } catch {
              /* abaikan */
            }
          }}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-teal-500 text-base font-semibold text-white shadow-card transition-colors hover:bg-teal-600 active:bg-teal-700 lg:inline-flex lg:w-auto lg:px-12"
        >
          Mulai Deteksi Risiko
        </Link>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted lg:text-left">
          Alat ini adalah opini kedua untuk skrining awal dan{" "}
          <span className="font-semibold text-ink">
            bukan pengganti diagnosis dokter.
          </span>
        </p>
      </div>
    </main>
  );
}
