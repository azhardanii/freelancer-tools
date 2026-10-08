'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart3Icon } from './icons';

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
              FREELANCER TOOLS <span className="text-[#0D9488]">BY UQI</span>
            </span>
            <span className="text-[10px] text-[#526A6B] block font-medium">
              Kalkulator Rate &amp; Pricing Objektif
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/analytics"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0A3638] hover:text-[#0D9488] bg-[#E8F5F3] hover:bg-[#d5eee9] rounded-lg border border-[#CBE5E1] transition-colors"
            title="Lihat Dashboard Analytics"
          >
            <BarChart3Icon className="w-4 h-4 text-[#0A3638]" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <Link
            href="/tool"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#0A3638] hover:bg-[#07282A] rounded-lg shadow-sm transition-all"
          >
            Hitung Rate
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E2ECE9] bg-white py-8 text-xs text-[#526A6B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 rounded overflow-hidden">
              <Image
                src="/LabSekolahWFA.png"
                alt="Logo Lab Sekolah WFA"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <p className="font-bold text-[#0A3638]">
              FREELANCER TOOLS BY UQI
            </p>
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <p>
            Dibuat untuk membantu talenta freelance Indonesia memasang harga dengan percaya diri.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          {/* Connect with Uqi link */}
          <a
            href="https://azhardanii.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E8F5F3] hover:bg-[#d5eee9] text-[#0A3638] font-semibold text-xs transition-colors border border-[#CBE5E1]"
            title="Kunjungi Website Azhar Dani (Uqi)"
          >
            <span>Connect with Uqi</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 text-[#0D9488]"
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

          <Link href="/analytics" className="text-[#0A3638] hover:underline flex items-center gap-1 font-medium">
            <BarChart3Icon className="w-3.5 h-3.5" />
            Analytics
          </Link>
          <Link href="/tool" className="text-[#0A3638] hover:underline font-medium">
            Mulai Hitung
          </Link>
        </div>
      </div>
    </footer>
  );
}
