"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { STORAGE_KEY, FORM_KEY, type StoredResult } from "@/lib/api";
import XaiChart from "./XaiChart";

type LoadState =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "ready"; result: StoredResult };

interface RiskTheme {
  card: string; // background container (mengikuti aturan warna mutlak PRD)
  meter: string;
  pill: string;
  label: string;
}

function themeFor(status: string): RiskTheme {
  const s = status.trim().toLowerCase();
  if (s === "low risk" || s === "low") {
    // Low Risk -> hijau (bg-green-500) sesuai PRD.
    return {
      card: "bg-green-500",
      meter: "bg-green-500",
      pill: "bg-green-50 text-green-700",
      label: "Risiko Rendah",
    };
  }
  if (s.includes("high")) {
    // Kategori lebih tinggi -> merah.
    return {
      card: "bg-red-500",
      meter: "bg-red-500",
      pill: "bg-red-50 text-red-700",
      label: "Risiko Tinggi",
    };
  }
  // Kategori lain (mis. "Medium") -> kuning.
  return {
    card: "bg-amber-500",
    meter: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700",
    label: "Risiko Sedang",
  };
}

export default function ResultPage() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  // Nilai input yang pengguna masukkan (untuk ditampilkan di samping kontribusi faktor).
  const [inputs, setInputs] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    try {
      const rawInput = localStorage.getItem(FORM_KEY);
      if (rawInput) setInputs(JSON.parse(rawInput) as Record<string, string>);
    } catch {
      /* abaikan input rusak */
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setState({ kind: "empty" });
        return;
      }
      const parsed = JSON.parse(raw) as StoredResult;
      if (!parsed?.data?.prediction) {
        setState({ kind: "empty" });
        return;
      }
      setState({ kind: "ready", result: parsed });
    } catch {
      setState({ kind: "empty" });
    }
  }, []);

  if (state.kind === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center px-6">
        <p className="text-sm text-muted">Memuat hasil…</p>
      </main>
    );
  }

  if (state.kind === "empty") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-lg font-bold text-ink">Belum ada hasil</h1>
        <p className="mt-2 max-w-xs text-sm text-muted">
          Isi formulir skrining terlebih dahulu untuk melihat estimasi risiko
          Anda.
        </p>
        <Link
          href="/form"
          className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-teal-500 px-8 text-sm font-semibold text-white shadow-card transition-colors hover:bg-teal-600"
        >
          Mulai Skrining
        </Link>
      </main>
    );
  }

  const { result } = state;
  const { prediction, clinical_narrative, xai_analysis } = result.data;
  const theme = themeFor(prediction.risk_status);
  const percent = Math.round(prediction.risk_score * 1000) / 10; // 1 desimal
  const isSimulated = result._simulated === true;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8 lg:max-w-5xl">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          ← Beranda
        </Link>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
          Hasil Skrining
        </span>
      </header>

      {isSimulated && (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
          ⚠ DATA SIMULASI — Mode demo aktif. Hasil ini dihasilkan tanpa backend
          dan tidak valid secara medis.
        </div>
      )}

      {/* Desktop: 2 kolom — kiri (status + faktor risiko), kanan (penjelasan). Mobile: menumpuk. */}
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        {/* Kolom kiri */}
        <div>
      {/* Hero Section: status risiko */}
      <section
        className={`mt-5 animate-fade-up rounded-3xl ${theme.card} px-6 py-8 text-white shadow-float`}
      >
        <p className="text-sm font-medium uppercase tracking-wide text-white/80">
          Status Risiko
        </p>
        <p className="mt-1 text-4xl font-extrabold leading-tight">
          {prediction.risk_status}
        </p>

        {/* Probabilitas */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-white/80">
              Probabilitas risiko
            </span>
            <span className="text-2xl font-bold">{percent}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            />
          </div>
        </div>
      </section>

      <XaiChart data={xai_analysis} inputs={inputs ?? undefined} />
        </div>

        {/* Kolom kanan */}
        <div>
      {/* Clinical Narrative Section */}
      <section className="mt-6 lg:mt-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
          Penjelasan Klinis
        </h2>
        <div className="mt-3 rounded-2xl border border-line bg-gray-50 px-5 py-5">
          <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-ink">
            {clinical_narrative}
          </p>
          <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
            <svg
              className="h-4 w-4 shrink-0 text-teal-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 1.5l6.5 2.5v5c0 4-2.8 6.8-6.5 8-3.7-1.2-6.5-4-6.5-8v-5L10 1.5zm3.3 6.2a.9.9 0 00-1.3-1.2L9 9.5 7.9 8.4a.9.9 0 10-1.3 1.2l1.8 1.8c.4.4 1 .4 1.3 0l3.6-3.7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </section>
        </div>
      </div>

      <div className="flex-1 lg:hidden" />

      {/* Disclaimer */}
      <p className="mt-8 rounded-xl bg-teal-50 px-4 py-3 text-xs leading-relaxed text-teal-700">
        Hasil ini merupakan <span className="font-semibold">opini kedua</span>{" "}
        untuk skrining awal dan tidak menggantikan diagnosis dokter.
        Konsultasikan kondisi Anda dengan tenaga kesehatan profesional.
      </p>

      {/* Actions */}
      <button
        type="button"
        onClick={() => router.push("/form")}
        className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl bg-teal-500 text-base font-semibold text-white shadow-card transition-colors hover:bg-teal-600 active:bg-teal-700 lg:w-auto lg:px-10"
      >
        Edit Data &amp; Hitung Ulang
      </button>
    </main>
  );
}
