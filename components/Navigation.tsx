'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2ECE9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#CBE5E1] flex items-center justify-center p-1 shadow-xs group-hover:border-[#0A3638] transition-colors">
            <Image
              src="/LabSekolahWFA.png"
              alt="Logo Lab Sekolah WFA"
              width={40}
              height={40}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-[#0A3638] tracking-tight block leading-tight">
              RemoteRate <span className="text-[#0D9488]">by Uqi</span>
            </span>
            <span className="text-[10px] text-[#526A6B] block font-medium">
              Kalkulator Rate &amp; Pricing Objektif
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/tool"
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#0A3638] hover:bg-[#07282A] rounded-xl shadow-xs hover:shadow-card transition-all flex items-center gap-1.5"
          >
            <span>Hitung Rate</span>
            <span className="text-[#2DD4BF] text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E2ECE9] bg-white text-xs text-[#526A6B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Upper Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white border border-[#CBE5E1] p-0.5 shadow-xs">
                <Image
                  src="/LabSekolahWFA.png"
                  alt="Logo Lab Sekolah WFA"
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-extrabold text-sm text-[#0A3638] tracking-tight">
                RemoteRate <span className="text-[#0D9488]">by Uqi</span>
              </span>
            </div>
            <p className="text-xs text-[#526A6B] leading-relaxed">
              Tools kalkulasi rate dan analisis kelayakan finansial objektif untuk membantu talenta freelance &amp; remote worker memasang harga dengan percaya diri.
            </p>
          </div>

          {/* Right Action & Connect */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <a
              href="https://azhardanii.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8F5F3] hover:bg-[#d5eee9] text-[#0A3638] font-bold text-xs transition-all border border-[#CBE5E1] shadow-xs group"
              title="Kunjungi Website Azhar Dani (Uqi)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Connect with Uqi</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 text-[#0D9488] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h4a.75.75 0 0 1 0 1.5h-4Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <Link
              href="/tool"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0A3638] hover:text-[#0D9488] hover:underline"
            >
              <span>Kalkulator Rate</span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E2ECE9] my-6" />

        {/* Bottom Copyright & Notes */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#526A6B]">
          <p>© 2026 RemoteRate by Uqi · Kolaborasi bersama Lab Sekolah WFA.</p>
          <p className="flex items-center gap-2">
            <span>Objektif</span>
            <span>•</span>
            <span>Berbasis Data</span>
            <span>•</span>
            <span>Penuh Percaya Diri</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
