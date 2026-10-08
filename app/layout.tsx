import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FREELANCER TOOLS BY UQI | Kalkulator Rate & Pricing Objektif",
  description:
    "Hitung harga jasa freelance ideal, batas floor hourly rate, dan analisis kapasitas bulanan dengan engine kalkulasi deterministik oleh Uqi (Lab Sekolah WFA).",
  keywords: [
    "freelancer tools by uqi",
    "rate freelance indonesia",
    "kalkulator harga jasa",
    "freelance pricing calculator",
    "hourly rate freelancer",
    "lab sekolah wfa",
    "harga jasa video editing",
    "harga jasa desain grafis",
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full bg-[#F8FBFA]">
      <body className="min-h-full flex flex-col font-sans text-[#102A2B] bg-[#F8FBFA] antialiased">
        {children}
      </body>
    </html>
  );
}
