'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Navigation, Footer } from '@/components/Navigation';
import {
  SparklesIcon,
  CalculatorIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  CheckIcon,
  ArrowRightIcon,
  MessageSquareIcon,
  FileTextIcon,
} from '@/components/icons';
import { trackEvent } from '@/lib/analytics';

export default function HomePage() {
  useEffect(() => {
    trackEvent('landing_view');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFA]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#E2ECE9] bg-gradient-to-b from-[#E8F5F3]/60 via-[#F8FBFA] to-[#F8FBFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge Hook */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F5F3] border border-[#CBE5E1] text-[#0A3638] text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <SparklesIcon className="w-4 h-4 text-[#0D9488]" />
            <span>Kalkulator Rate Freelance Pertama Berbasis Data Objektif</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A3638] tracking-tight leading-[1.15] mb-6">
            Paham Harga Jasamu.{' '}
            <span className="block text-[#0D9488]">
              Jelas, Objektif &amp; Percaya Diri.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-[#526A6B] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
            Bukan sekadar tebak-tebak buah manggis. Hitung floor rate amanmu, bandingkan dengan acuan pasar Indonesia, dan dapatkan paket harga 3 level serta script negosiasi taktis siap kirim.
          </p>

          {/* Primary CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <Link
              href="/tool"
              onClick={() => trackEvent('tool_start', { source: 'hero_cta' })}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0A3638] hover:bg-[#07282A] text-white font-bold text-base shadow-card hover:shadow-hover transition-all flex items-center justify-center gap-2 group"
            >
              <span>Mulai Hitung Rate Saya</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Micro Trust Proof */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#526A6B] font-medium">
            <div className="flex items-center gap-1.5">
              <CheckIcon className="w-4 h-4 text-[#0D9488]" />
              <span>100% Gratis & Tanpa Login</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckIcon className="w-4 h-4 text-[#0D9488]" />
              <span>Kalkulasi Cepat &lt; 3 Detik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckIcon className="w-4 h-4 text-[#0D9488]" />
              <span>Engine Deterministik Teruji</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Grid */}
      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A3638] tracking-tight mb-3">
            Kenapa Banyak Freelancer Terjebak Pasang Harga Murah?
          </h2>
          <p className="text-sm sm:text-base text-[#526A6B]">
            Kebanyakan freelancer menentukan tarif dari rasa cemas, bukan dari hitungan kapasitas kerja dan target realistis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle hover:border-[#CBE5E1] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#0A3638] mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h3 className="text-lg font-bold text-[#0A3638] mb-2">
              1. Batas Minimum Aman (Floor Rate)
            </h3>
            <p className="text-sm text-[#526A6B] leading-relaxed">
              Batas tarif per jam dan per unit terendah agar target bulananmu tetap tercapai setelah dihitung buffer darurat dan jam non-billable.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle hover:border-[#CBE5E1] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#0A3638] mb-4">
              <TrendingUpIcon className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h3 className="text-lg font-bold text-[#0A3638] mb-2">
              2. Paket Harga 3 Level
            </h3>
            <p className="text-sm text-[#526A6B] leading-relaxed">
              Dapatkan rekomendasi paket Basic, Standard, dan Premium secara otomatis. Memudahkan klien memilih tanpa langsung menolak.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle hover:border-[#CBE5E1] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5F3] flex items-center justify-center text-[#0A3638] mb-4">
              <MessageSquareIcon className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h3 className="text-lg font-bold text-[#0A3638] mb-2">
              3. Script Nego Siap Pakai
            </h3>
            <p className="text-sm text-[#526A6B] leading-relaxed">
              Balasan chat taktis saat klien bilang kemahalan, minta diskon mendadak, atau minta tambah revisi tanpa biaya. Tinggal copy-paste!
            </p>
          </div>
        </div>
      </section>

      {/* Sneak Peek Preview of Output */}
      <section className="py-12 sm:py-16 bg-[#E8F5F3]/40 border-y border-[#E2ECE9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-[#CBE5E1] p-6 sm:p-8 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2ECE9] gap-4">
              <div>
                <span className="text-xs font-semibold text-[#0D9488] tracking-wider uppercase">
                  Contoh Hasil Perhitungan
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A3638]">
                  Editing Video Reels untuk UMKM
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5F3] text-[#0A3638] text-xs font-semibold rounded-full border border-[#CBE5E1] self-start sm:self-auto">
                <CheckIcon className="w-3.5 h-3.5 text-[#0D9488]" />
                Keyakinan Tinggi
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                <span className="text-xs font-medium text-[#526A6B] block mb-1">
                  Paket Basic
                </span>
                <div className="text-lg sm:text-xl font-bold text-[#0A3638]">
                  Rp 175.000
                </div>
                <span className="text-[11px] text-[#526A6B]">per video (hemat)</span>
              </div>
              <div className="p-4 rounded-xl bg-[#E8F5F3] border-2 border-[#0A3638] relative">
                <span className="absolute -top-2.5 right-3 bg-[#0A3638] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Rekomendasi
                </span>
                <span className="text-xs font-semibold text-[#0A3638] block mb-1">
                  Paket Standard
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#0A3638]">
                  Rp 250.000
                </div>
                <span className="text-[11px] text-[#0D9488] font-medium">per video ideal</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                <span className="text-xs font-medium text-[#526A6B] block mb-1">
                  Paket Premium
                </span>
                <div className="text-lg sm:text-xl font-bold text-[#0A3638]">
                  Rp 400.000
                </div>
                <span className="text-[11px] text-[#526A6B]">per video prioritas</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#E8F5F3]/70 border border-[#CBE5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0A3638]">
              <div>
                <p className="font-semibold text-sm mb-0.5">Analisis Kapasitas Bulanan:</p>
                <p className="text-[#526A6B]">
                  Butuh <span className="font-bold text-[#0A3638]">25 video</span> untuk mencapai target Rp 5.000.000 bersih. Kapasitas kerjamu: <span className="font-bold text-[#0A3638]">28 video</span> per bulan.
                </p>
              </div>
              <div className="shrink-0 px-3 py-1.5 bg-[#0D9488] text-white rounded-lg font-bold text-xs text-center">
                Target Feasible (Aman)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Pro Document Generator Preview */}
      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#CBE5E1] shadow-subtle relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F3] text-[#0A3638] text-xs font-bold mb-4">
            <FileTextIcon className="w-3.5 h-3.5 text-[#0D9488]" />
            Coming Soon di Versi Pro
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A3638] mb-3">
            Generator Dokumen Penawaran & Surat Kontrak Resmi
          </h2>
          <p className="text-sm sm:text-base text-[#526A6B] max-w-xl mx-auto mb-6">
            Ingin langsung mencetak PDF Penawaran Harga resmi A4 dan surat kontrak kerja yang rapi dalam 1 klik? Fitur ini sedang kami siapkan!
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A3638] hover:bg-[#07282A] text-white font-bold text-sm shadow-sm transition-all"
          >
            <span>Coba Kalkulator Rate Sekarang</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
