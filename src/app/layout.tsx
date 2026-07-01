import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HypertensAI — Skrining Risiko Hipertensi",
  description:
    "Skrining awal risiko hipertensi berbasis Explainable AI & Large Language Model. Bukan pengganti diagnosis dokter.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E7C7B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="font-sans antialiased">
        {/* Responsif: latar mengisi penuh viewport; lebar konten diatur per-halaman
            (mobile-first lalu melebar di tablet/desktop). */}
        <div className="flex min-h-screen w-full flex-col bg-canvas">
          {children}
        </div>
      </body>
    </html>
  );
}
