import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemoteRate by Uqi | Kalkulator Rate & Pricing Objektif",
  description:
    "Hitung harga jasa ideal, batas tarif minimum per jam, dan analisis kapasitas bulanan dengan engine kalkulasi deterministik oleh RemoteRate (Lab Sekolah WFA).",
  keywords: [
    "remoterate",
    "remoterate by uqi",
    "kalkulator rate freelance",
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
