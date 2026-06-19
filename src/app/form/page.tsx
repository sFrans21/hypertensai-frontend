"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FORM_STEPS,
  emptyFormValues,
  type FieldDef,
  type FieldKey,
} from "@/lib/fields";
import { analyzeRisk, STORAGE_KEY } from "@/lib/api";
import type { AnalyzePayload } from "@/lib/types";

export default function FormPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldKey, string>>(
    emptyFormValues(),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const step = FORM_STEPS[stepIndex];
  const isLastStep = stepIndex === FORM_STEPS.length - 1;
  const progress = ((stepIndex + 1) / FORM_STEPS.length) * 100;

  function update(key: FieldKey, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setApiError(null);
  }

  function validateField(field: FieldDef, raw: string): string | undefined {
    if (raw === "" || raw === undefined) return "Wajib diisi.";
    const num = Number(raw);
    if (!Number.isFinite(num)) return "Masukkan angka yang valid.";
    if (field.min !== undefined && num < field.min)
      return `Minimal ${field.min}.`;
    if (field.max !== undefined && num > field.max)
      return `Maksimal ${field.max}.`;
    return undefined;
  }

  function validateStep(): boolean {
    const next: Partial<Record<FieldKey, string>> = {};
    let ok = true;
    for (const field of step.fields) {
      const msg = validateField(field, values[field.key]);
      if (msg) {
        next[field.key] = msg;
        ok = false;
      }
    }
    setErrors((e) => ({ ...e, ...next }));
    return ok;
  }

  function handleNext() {
    if (!validateStep()) return;
    setStepIndex((i) => Math.min(i + 1, FORM_STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildPayload(): AnalyzePayload {
    // Semua nilai dikirim sebagai tipe numerik sesuai kontrak API.
    const out = {} as Record<FieldKey, number>;
    for (const s of FORM_STEPS) {
      for (const f of s.fields) {
        out[f.key] = Number(values[f.key]);
      }
    }
    return out as unknown as AnalyzePayload;
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const result = await analyzeRisk(buildPayload());
      // Simpan respons ke LocalStorage dengan key "analysisResult" (sesuai PRD).
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      router.push("/result");
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col px-6 pb-8 pt-8">
      {/* Header + progress */}
      <header>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            ← Beranda
          </Link>
          <span className="text-xs font-semibold text-muted">
            Langkah {stepIndex + 1} dari {FORM_STEPS.length}
          </span>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Step heading */}
      <div key={step.id} className="mt-6 animate-fade-up">
        <h1 className="text-xl font-bold text-ink">{step.title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {step.subtitle}
        </p>

        {/* Fields */}
        <div className="mt-6 space-y-5">
          {step.fields.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={values[field.key]}
              error={errors[field.key]}
              onChange={(val) => update(field.key, val)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* API error */}
      {apiError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {apiError}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="h-14 flex-1 rounded-2xl border border-line bg-surface text-base font-semibold text-ink transition-colors hover:bg-canvas disabled:opacity-50"
          >
            Kembali
          </button>
        )}
        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-2xl bg-teal-500 text-base font-semibold text-white shadow-card transition-colors hover:bg-teal-600 active:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Spinner />
                Menganalisis...
              </>
            ) : (
              "Kirim & Analisis"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="h-14 flex-[2] rounded-2xl bg-teal-500 text-base font-semibold text-white shadow-card transition-colors hover:bg-teal-600 active:bg-teal-700"
          >
            Lanjutkan
          </button>
        )}
      </div>
    </main>
  );
}

function Field({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: string;
  error?: string;
  onChange: (val: string) => void;
}) {
  const inputId = `field-${field.key}`;
  const describedBy = useMemo(() => {
    const ids: string[] = [];
    if (field.hint) ids.push(`${inputId}-hint`);
    if (error) ids.push(`${inputId}-error`);
    return ids.join(" ") || undefined;
  }, [field.hint, error, inputId]);

  const base =
    "mt-2 w-full rounded-xl border bg-surface px-4 text-base text-ink shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100";
  const borderClass = error ? "border-red-300" : "border-line";

  return (
    <div>
      <label
        htmlFor={inputId}
        className="flex items-baseline justify-between gap-2"
      >
        <span className="text-sm font-semibold text-ink">{field.label}</span>
        <span className="font-mono text-[0.65rem] uppercase tracking-wide text-muted/70">
          {field.code}
        </span>
      </label>

      {field.kind === "select" ? (
        <select
          id={inputId}
          value={value}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${borderClass} h-12 appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235B7174' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="" disabled>
            Pilih…
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            value={value}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder="0"
            aria-describedby={describedBy}
            aria-invalid={!!error}
            onChange={(e) => onChange(e.target.value)}
            className={`${base} ${borderClass} h-12 ${field.unit ? "pr-20" : ""}`}
          />
          {field.unit && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
              {field.unit}
            </span>
          )}
        </div>
      )}

      {field.hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-muted">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
