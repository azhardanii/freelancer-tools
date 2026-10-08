'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, Footer } from '@/components/Navigation';
import {
  SparklesIcon,
  CalculatorIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  CheckIcon,
  CopyIcon,
  PrinterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertCircleIcon,
  ClockIcon,
  CoinsIcon,
  FileTextIcon,
  MessageSquareIcon,
  LockIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  StoreIcon,
  RocketIcon,
  Building2Icon,
  GlobeIcon,
  GraduationCapIcon,
  ZapIcon,
  BriefcaseIcon,
  TrophyIcon,
  PaletteIcon,
  SlidersIcon,
} from '@/components/icons';
import { trackEvent } from '@/lib/analytics';

// Preset Chips for Service
const SERVICE_CHIPS = [
  'Editing Video Reels / TikTok',
  'Desain Feed Instagram',
  'Landing Page Web UMKM',
  'Data Entry Spreadsheet',
  'Copywriting Caption Sosmed',
];

// Tactile Experience Options
const EXPERIENCE_OPTIONS = [
  {
    id: 'belum_pernah',
    title: 'Baru Mulai',
    subtitle: 'Belum pernah dapat bayaran jasa',
    icon: GraduationCapIcon,
    tag: 'Start',
  },
  {
    id: 'kurang_1_tahun',
    title: '< 1 Tahun',
    subtitle: 'Sedang bangun jam terbang',
    icon: SparklesIcon,
    tag: 'Eksplorasi',
  },
  {
    id: '1_3_tahun',
    title: '1–3 Tahun',
    subtitle: 'Rutin garap proyek klien',
    icon: ZapIcon,
    tag: 'Menengah',
  },
  {
    id: 'lebih_3_tahun',
    title: '> 3 Tahun',
    subtitle: 'Reputasi & portofolio matang',
    icon: TrophyIcon,
    tag: 'Mahir',
  },
];

// Tactile Client Segment Options
const CLIENT_OPTIONS = [
  {
    id: 'umkm',
    title: 'UMKM & Perorangan',
    subtitle: 'Budget efisien, keputusan cepat',
    icon: StoreIcon,
    tag: 'Lokal',
  },
  {
    id: 'startup',
    title: 'Brand & Startup',
    subtitle: 'Fokus konversi & visual estetik',
    icon: RocketIcon,
    tag: 'Agil',
  },
  {
    id: 'corporate',
    title: 'Korporasi / PT',
    subtitle: 'Budget stabil, butuh SOP resmi',
    icon: Building2Icon,
    tag: 'Resmi',
  },
  {
    id: 'overseas',
    title: 'Klien Luar Negeri',
    subtitle: 'Standar global, bayar valas ($)',
    icon: GlobeIcon,
    tag: 'Global',
  },
];

// Tactile Proof / Portfolio Options
const PROOF_OPTIONS = [
  {
    id: 'belum_ada',
    title: 'Belum Ada Bukti',
    subtitle: 'Baru ingin mencari klien perdana',
    icon: AlertCircleIcon,
  },
  {
    id: 'latihan',
    title: 'Karya Latihan / Mandiri',
    subtitle: 'Punya karya pribadi atau studi tiru',
    icon: PaletteIcon,
  },
  {
    id: '1_3_proyek',
    title: '1–3 Proyek untuk Klien',
    subtitle: 'Pernah tuntaskan pekerjaan nyata',
    icon: BriefcaseIcon,
  },
  {
    id: '4_plus_proyek',
    title: '4+ Proyek / Klien Tetap',
    subtitle: 'Rekam jejak dan testimoni kuat',
    icon: TrophyIcon,
  },
];

// Preset Targets Net
const NET_TARGET_PRESETS = [
  { label: 'Rp 3 Jt', value: 3_000_000 },
  { label: 'Rp 5 Jt (Populer)', value: 5_000_000 },
  { label: 'Rp 8 Jt', value: 8_000_000 },
  { label: 'Rp 12 Jt', value: 12_000_000 },
  { label: 'Rp 20 Jt', value: 20_000_000 },
];

function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export default function ToolPage() {
  // Form State
  const [service, setService] = useState('');
  const [experience, setExperience] = useState('kurang_1_tahun');
  const [targetClient, setTargetClient] = useState('umkm');
  const [targetNet, setTargetNet] = useState<number>(5_000_000);
  const [hoursPerDay, setHoursPerDay] = useState<number>(6);
  const [proof, setProof] = useState('belum_ada');
  const [projectStory, setProjectStory] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  // Assumptions Panel State
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [overhead, setOverhead] = useState(500_000);
  const [bufferPct, setBufferPct] = useState(0.15);
  const [workDays, setWorkDays] = useState(20);
  const [billableRatio, setBillableRatio] = useState(0.6);

  // Result & Calculation State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'rate' | 'scripts' | 'proposal_coming_soon'>('rate');
  const [showMathDetails, setShowMathDetails] = useState(false);

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [priceFeeling, setPriceFeeling] = useState<string | null>(null);
  const [willUse, setWillUse] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  // Pro Waitlist Lead State
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    trackEvent('tool_start');
    try {
      const savedResult = localStorage.getItem('freelance_tool_rate_result');
      if (savedResult) {
        setResult(JSON.parse(savedResult));
      }
    } catch (e) {
      // Ignore localStorage error
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.trim()) {
      setErrorMsg('Mohon isi nama jasa yang ingin kamu hitung.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: service.trim(),
          experience,
          targetClient,
          targetNet,
          hoursPerDay,
          proof,
          projectStory: projectStory.trim(),
          portfolioLink: portfolioLink.trim(),
          overhead,
          bufferPct,
          workDays,
          billableRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghitung rate.');
      }

      setResult(data.data);
      setActiveTab('rate');
      try {
        localStorage.setItem('freelance_tool_rate_result', JSON.stringify(data.data));
      } catch (err) {
        // ignore
      }

      trackEvent('tool_complete', {
        service: data.data.serviceParams?.serviceName,
        confidence: data.data.serviceParams?.confidence,
        recommended: data.data.pricing?.recommended,
      });

      // Smooth scroll to result
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const { serviceParams, pricing, floor, gap } = result;
    const text = `📋 RINGKASAN RATE FREELANCE: ${serviceParams.serviceName}
• Paket Basic: ${formatRupiah(pricing.packages.basic)} / ${serviceParams.pricingUnit}
• Paket Standard (Rekomendasi): ${formatRupiah(pricing.recommended)} / ${serviceParams.pricingUnit}
• Paket Premium: ${formatRupiah(pricing.packages.premium)} / ${serviceParams.pricingUnit}

💡 Analisis Kapasitas:
• Floor Rate Aman: ${formatRupiah(floor.floorPerHour)}/jam
• Target Bulanan: Butuh ${gap.unitsNeeded} unit (Kapasitas: ${gap.unitsCapacity} unit)
Status: ${gap.feasible ? 'Target Feasible (Aman)' : 'Perlu Penyesuaian Strategi'}

Dihitung via FREELANCER TOOLS BY UQI (https://azhardanii.github.io)`;

    navigator.clipboard.writeText(text);
    trackEvent('action_copy', { type: 'summary' });
    showToast('Ringkasan rate berhasil disalin ke clipboard!');
  };

  const handleCopyScript = (scriptText: string, scriptTitle: string) => {
    navigator.clipboard.writeText(scriptText);
    trackEvent('action_copy', { type: 'script', title: scriptTitle });
    showToast(`Script "${scriptTitle}" berhasil disalin!`);
  };

  const handlePrint = () => {
    trackEvent('action_print');
    window.print();
  };

  const handleAutoFeedback = async (type: 'price' | 'usage', value: string) => {
    const newPriceFeeling = type === 'price' ? value : priceFeeling || 'pas';
    const newWillUse = type === 'usage' ? value : willUse || 'mungkin';

    if (type === 'price') {
      setPriceFeeling(value);
      trackEvent('feedback_price_feel', { feeling: value });
    } else {
      setWillUse(value);
      trackEvent('feedback_will_use', { willUse: value });
    }

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceFeeling: newPriceFeeling,
          willUse: newWillUse,
          feedbackNotes,
          service: result?.serviceParams?.serviceName,
          recommendedRate: result?.pricing?.recommended,
        }),
      });
      setFeedbackSubmitted(true);
      showToast(type === 'price' ? 'Pendapatmu tercatat, terima kasih! 🎯' : 'Terima kasih atas responsmu! 👍');
    } catch (e) {
      // ignore
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!priceFeeling && !willUse && !feedbackNotes) return;
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceFeeling: priceFeeling || 'pas',
          willUse: willUse || 'mungkin',
          feedbackNotes,
          service: result?.serviceParams?.serviceName,
          recommendedRate: result?.pricing?.recommended,
        }),
      });
      setFeedbackSubmitted(true);
      showToast('Terima kasih banyak atas feedback & catatanmu!');
    } catch (e) {
      // ignore
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes('@')) return;
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail,
          role: 'freelancer',
          notes: `Interested from tool page. Service: ${result?.serviceParams?.serviceName || service}`,
        }),
      });
      setLeadSubmitted(true);
      showToast('Kamu sudah terdaftar di waitlist fitur Pro!');
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFA]">
      <div className="no-print">
        <Navigation />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A3638] text-white px-4 py-3 rounded-xl shadow-hover flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-bounce no-print">
          <CheckIcon className="w-4 h-4 text-[#2DD4BF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 no-print">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F3] text-[#0A3638] text-xs font-semibold mb-3 border border-[#CBE5E1]">
            <SparklesIcon className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Kalkulator Rate Freelance Objektif</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A3638] tracking-tight mb-2">
            Hitung Rate & Batas Aman Jasamu
          </h1>
          <p className="text-xs sm:text-sm text-[#526A6B]">
            Bukan sekadar tebak harga. Dapatkan rekomendasi floor rate aman, 3 level paket harga, dan script negosiasi taktis siap kirim.
          </p>
        </div>

        {/* LIVE SIMULATION HUD (Studio Deck) */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A3638] to-[#114E52] text-white shadow-card relative overflow-hidden no-print">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-[#2DD4BF]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0">
                <CalculatorIcon className="w-5 h-5 text-[#2DD4BF]" />
              </div>
              <div>
                <span className="text-[10px] tracking-wider uppercase font-bold text-[#A3D9D0]">
                  Simulasi Kapasitas Real-Time
                </span>
                <div className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                  <span>{formatRupiah(targetNet)}</span>
                  <span className="text-xs font-normal text-white/70">/ bln (Target Bersih)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 text-xs w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <div className="bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                <span className="text-[10px] text-white/60 block">Waktu Proyek Efektif</span>
                <span className="font-bold text-[#2DD4BF] text-sm">
                  ~{Math.round(hoursPerDay * workDays * billableRatio)} jam/bln
                </span>
              </div>
              <div className="bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                <span className="text-[10px] text-white/60 block">Estimasi Floor Per Jam</span>
                <span className="font-bold text-white text-sm">
                  ~{formatRupiah(Math.round(((targetNet + overhead) / (1 - bufferPct)) / Math.max(1, hoursPerDay * workDays * billableRatio)))}/jam
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Form */}
        <div className="bg-white rounded-3xl border border-[#E2ECE9] shadow-subtle p-5 sm:p-8 mb-8 no-print">
          <form onSubmit={handleCalculate} className="space-y-7">
            {/* Field 1: Jasa */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A3638]">
                  <span className="w-5 h-5 rounded-full bg-[#0A3638] text-white text-[11px] flex items-center justify-center font-mono">1</span>
                  <span>Nama Jasa Freelance <span className="text-red-500">*</span></span>
                </label>
                <span className="text-[11px] text-[#526A6B]">Maks. 80 karakter</span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Contoh: editing video Reels untuk UMKM"
                className="w-full px-4 py-3 rounded-xl border border-[#CBE5E1] bg-[#F8FBFA] focus:bg-white focus:outline-none focus:border-[#0A3638] focus:ring-2 focus:ring-[#0A3638]/10 text-sm text-[#0A3638] font-medium placeholder:text-[#526A6B]/50 transition-all"
              />
              <p className="text-[11px] text-[#526A6B] mt-2 font-medium">
                Tip: Makin spesifik keahlian dan segmenmu, makin akurat perhitungan rate pasarnya.
              </p>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5">
                <span className="text-[11px] text-[#526A6B] self-center mr-1">Rekomendasi:</span>
                {SERVICE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setService(chip)}
                    className="text-[11px] px-3 py-1 rounded-lg bg-[#E8F5F3] hover:bg-[#d5eee9] text-[#0A3638] font-semibold border border-[#CBE5E1] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 2: Pengalaman Freelance (Tactile 4-Grid Cards) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A3638]">
                  <span className="w-5 h-5 rounded-full bg-[#0A3638] text-white text-[11px] flex items-center justify-center font-mono">2</span>
                  <span>Pengalaman & Jam Terbang</span>
                </label>
                <span className="text-[11px] text-[#526A6B]">Pilih tingkat pengalamanmu</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {EXPERIENCE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = experience === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setExperience(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#0A3638] bg-[#E8F5F3] shadow-sm ring-2 ring-[#0A3638]/20 scale-[1.01]'
                          : 'border-[#E2ECE9] bg-white hover:border-[#CBE5E1] hover:bg-[#F8FBFA]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#0A3638] text-white' : 'bg-[#E8F5F3] text-[#0A3638] group-hover:bg-[#d5eee9]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#0A3638] text-white' : 'bg-gray-100 text-[#526A6B]'
                        }`}>
                          {opt.tag}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#0A3638]">{opt.title}</div>
                        <div className="text-[11px] text-[#526A6B] mt-0.5 leading-snug">{opt.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 3: Target Segmen Klien (Tactile 4-Grid Cards) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A3638]">
                  <span className="w-5 h-5 rounded-full bg-[#0A3638] text-white text-[11px] flex items-center justify-center font-mono">3</span>
                  <span>Target Segmen Klien</span>
                </label>
                <span className="text-[11px] text-[#526A6B]">Menentukan kelipatan daya beli</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CLIENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = targetClient === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTargetClient(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#0A3638] bg-[#E8F5F3] shadow-sm ring-2 ring-[#0A3638]/20 scale-[1.01]'
                          : 'border-[#E2ECE9] bg-white hover:border-[#CBE5E1] hover:bg-[#F8FBFA]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#0A3638] text-white' : 'bg-[#E8F5F3] text-[#0A3638] group-hover:bg-[#d5eee9]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#0A3638] text-white' : 'bg-gray-100 text-[#526A6B]'
                        }`}>
                          {opt.tag}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#0A3638]">{opt.title}</div>
                        <div className="text-[11px] text-[#526A6B] mt-0.5 leading-snug">{opt.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4 & 5: Target Net Income & Jam Kerja per Hari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              {/* Field 4: Target Pendapatan Bersih */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FBFA] border border-[#E2ECE9]">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A3638]">
                    <span className="w-5 h-5 rounded-full bg-[#0A3638] text-white text-[11px] flex items-center justify-center font-mono">4</span>
                    <span>Target Bersih / Bulan</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#0D9488] bg-[#E8F5F3] px-2 py-0.5 rounded-md">
                    Take Home Pay
                  </span>
                </div>
                <div className="relative mb-3">
                  <span className="absolute left-3.5 top-3 text-xs sm:text-sm text-[#526A6B] font-bold">
                    Rp
                  </span>
                  <input
                    type="number"
                    step={100000}
                    min={500000}
                    value={targetNet}
                    onChange={(e) => setTargetNet(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBE5E1] bg-white focus:outline-none focus:border-[#0A3638] focus:ring-2 focus:ring-[#0A3638]/10 text-sm sm:text-base text-[#0A3638] font-extrabold"
                  />
                </div>
                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {NET_TARGET_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setTargetNet(p.value)}
                      className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        targetNet === p.value
                          ? 'bg-[#0A3638] text-white border-[#0A3638] font-bold shadow-xs'
                          : 'bg-white text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 5: Jam Kerja per Hari (Slider & Gauge) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FBFA] border border-[#E2ECE9]">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A3638]">
                    <span className="w-5 h-5 rounded-full bg-[#0A3638] text-white text-[11px] flex items-center justify-center font-mono">5</span>
                    <span>Jam Kerja per Hari</span>
                  </label>
                  <span className="text-xs font-bold text-white bg-[#0A3638] px-2.5 py-0.5 rounded-md shadow-xs">
                    {hoursPerDay} jam / hari
                  </span>
                </div>
                
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#CBE5E1] rounded-lg appearance-none cursor-pointer accent-[#0A3638] my-3"
                />

                <div className="flex justify-between items-center text-[10px] text-[#526A6B]">
                  <span>1 Jam (Sambilan)</span>
                  <span className="font-bold text-[#0A3638]">
                    {hoursPerDay <= 4 ? 'Part-time / Santai' : hoursPerDay <= 7 ? 'Standar Ideal Freelancer' : 'Intensitas Penuh / Lembur'}
                  </span>
                  <span>12 Jam (Maks)</span>
                </div>

                {/* Quick hour chips */}
                <div className="flex gap-2 mt-3 pt-2 border-t border-[#E2ECE9]">
                  {[4, 6, 8].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHoursPerDay(h)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        hoursPerDay === h
                          ? 'bg-[#0A3638] text-white border-[#0A3638] font-bold'
                          : 'bg-white text-[#526A6B] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                      }`}
                    >
                      {h} Jam {h === 6 ? '(Rekomendasi)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 6: Bukti Kerja & Portfolio (Tactile 4-Grid Cards) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A3638]">
                  <span className="w-5 h-5 rounded-full bg-[#0A3638] text-white text-[11px] flex items-center justify-center font-mono">6</span>
                  <span>Bukti Kerja & Portofolio Saat Ini</span>
                </label>
                <span className="text-[11px] text-[#526A6B]">Tentukan kesiapan negosiasi</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {PROOF_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = proof === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setProof(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#0A3638] bg-[#E8F5F3] shadow-sm ring-2 ring-[#0A3638]/20 scale-[1.01]'
                          : 'border-[#E2ECE9] bg-white hover:border-[#CBE5E1] hover:bg-[#F8FBFA]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-[#E8F5F3] text-[#0A3638]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#0A3638]">{opt.title}</div>
                        <div className="text-[11px] text-[#526A6B] mt-0.5 leading-snug">{opt.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 2 Optional Fields for Story & Link */}
              <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#E2ECE9] space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-[#526A6B] mb-1 font-semibold">
                    <span>Ceritakan 1–2 hasil karya atau proyek terbaikmu (Opsional)</span>
                    <span>{projectStory.length}/400</span>
                  </div>
                  <textarea
                    maxLength={400}
                    rows={2}
                    value={projectStory}
                    onChange={(e) => setProjectStory(e.target.value)}
                    placeholder="Contoh: Mengedit 10 video Reels edukasi yang menaikkan views klien hingga 80.000 penonton..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBE5E1] bg-white focus:outline-none focus:border-[#0A3638] text-xs sm:text-sm text-[#0A3638] placeholder:text-[#526A6B]/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#526A6B] mb-1 font-semibold">
                    Link Portofolio (Opsional, Google Drive / Behance / Web)
                  </label>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://drive.google.com/... atau https://behance.net/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBE5E1] bg-white focus:outline-none focus:border-[#0A3638] text-xs sm:text-sm text-[#0A3638] placeholder:text-[#526A6B]/50"
                  />
                </div>
              </div>
            </div>

            {/* Collapsed Panel: Asumsi Biaya & Waktu (Humanized) */}
            <div className="border border-[#E2ECE9] rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0A3638] hover:bg-[#E8F5F3]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersIcon className="w-4 h-4 text-[#0D9488]" />
                  <span>⚙️ Atur Asumsi Kerja & Modal Bulanan (Opsional)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#526A6B]">
                  <span>{showAssumptions ? 'Tutup' : 'Sesuaikan'}</span>
                  {showAssumptions ? (
                    <ChevronUpIcon className="w-4 h-4 text-[#526A6B]" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-[#526A6B]" />
                  )}
                </div>
              </button>

              {showAssumptions && (
                <div className="p-4 sm:p-6 border-t border-[#E2ECE9] bg-[#F8FBFA] space-y-6 text-xs">
                  <p className="text-[11px] text-[#526A6B] leading-relaxed">
                    Semua angka di bawah sudah kami isi otomatis dengan standar wajar freelancer Indonesia. Silakan sesuaikan jika kondisimu berbeda.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Item 1: Modal & Kuota Bulanan */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#CBE5E1]">
                      <label className="block font-bold text-[#0A3638] mb-1">
                        1. Biaya Modal & Kuota Bulanan
                      </label>
                      <p className="text-[11px] text-[#526A6B] mb-2 leading-relaxed">
                        Tagihan internet, listrik kerja, dan langganan software pendukung (Canva, Adobe, dll).
                      </p>
                      <div className="relative mb-2">
                        <span className="absolute left-3 top-2 text-[#526A6B] font-bold">Rp</span>
                        <input
                          type="number"
                          step={50000}
                          value={overhead}
                          onChange={(e) => setOverhead(Number(e.target.value))}
                          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#CBE5E1] text-[#0A3638] font-bold text-xs"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[250000, 500000, 1000000].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setOverhead(v)}
                            className={`text-[10px] px-2 py-0.5 rounded border ${
                              overhead === v ? 'bg-[#0A3638] text-white border-[#0A3638]' : 'bg-[#E8F5F3] text-[#0A3638] border-[#CBE5E1]'
                            }`}
                          >
                            Rp {v >= 1000000 ? `${v / 1000000} Jt` : `${v / 1000} Rb`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Item 2: Dana Cadangan & Sakit (Safety Net) */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#CBE5E1]">
                      <label className="block font-bold text-[#0A3638] mb-1">
                        2. Dana Cadangan & Sakit (Safety Net)
                      </label>
                      <p className="text-[11px] text-[#526A6B] mb-2 leading-relaxed">
                        Cadangan ekstra jaga-jaga kalau ada bulan sepi proyek, butuh libur, atau bayar pajak.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: '10% (Ringan)', val: 0.10 },
                          { label: '15% (Ideal Standar)', val: 0.15 },
                          { label: '20% (Aman & Nyaman)', val: 0.20 },
                          { label: '25% (Konservatif)', val: 0.25 },
                        ].map((b) => (
                          <button
                            key={b.val}
                            type="button"
                            onClick={() => setBufferPct(b.val)}
                            className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-semibold transition-all ${
                              bufferPct === b.val
                                ? 'bg-[#0A3638] text-white border-[#0A3638] shadow-xs'
                                : 'bg-[#F8FBFA] text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Item 3: Porsi Waktu Fokus Garap Proyek */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#CBE5E1]">
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-[#0A3638]">
                          3. Porsi Waktu Fokus Proyek
                        </label>
                        <span className="text-[11px] font-bold text-[#0D9488]">
                          {Math.round(billableRatio * 100)}% Waktu Aktif
                        </span>
                      </div>
                      <p className="text-[11px] text-[#526A6B] mb-2 leading-relaxed">
                        Sebagai freelancer, tidak 100% jam kerjamu dibayar. Sebagian waktu terpakai untuk riset, revisi, chat klien, dan proposal.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        {[
                          { label: '50% (Banyak Riset/Admin)', val: 0.50 },
                          { label: '60% (Standar Freelance)', val: 0.60 },
                          { label: '70% (Fokus Cepat)', val: 0.70 },
                          { label: '80% (Hampir Nonstop)', val: 0.80 },
                        ].map((r) => (
                          <button
                            key={r.val}
                            type="button"
                            onClick={() => setBillableRatio(r.val)}
                            className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-semibold transition-all ${
                              billableRatio === r.val
                                ? 'bg-[#0A3638] text-white border-[#0A3638] shadow-xs'
                                : 'bg-[#F8FBFA] text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#0D9488] font-medium bg-[#E8F5F3] p-2 rounded-lg">
                        💡 Dari {hoursPerDay} jam kerja/hari, kamu aktif dibayar ~{(hoursPerDay * billableRatio).toFixed(1)} jam/hari untuk proyek klien. Sisanya ({(hoursPerDay * (1 - billableRatio)).toFixed(1)} jam) untuk admin & riset.
                      </p>
                    </div>

                    {/* Item 4: Hari Kerja per Bulan */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#CBE5E1]">
                      <label className="block font-bold text-[#0A3638] mb-1">
                        4. Hari Kerja per Bulan
                      </label>
                      <p className="text-[11px] text-[#526A6B] mb-2 leading-relaxed">
                        Berapa hari dalam sebulan kamu membuka layanan freelance untuk klien?
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { label: '16 Hari (4 hari/minggu · Santai)', val: 16 },
                          { label: '20 Hari (Senin–Jumat · Standar Rekomendasi)', val: 20 },
                          { label: '24 Hari (Senin–Sabtu · Padat & Sibuk)', val: 24 },
                        ].map((d) => (
                          <button
                            key={d.val}
                            type="button"
                            onClick={() => setWorkDays(d.val)}
                            className={`w-full px-3 py-1.5 rounded-lg border text-left text-[11px] font-semibold transition-all ${
                              workDays === d.val
                                ? 'bg-[#0A3638] text-white border-[#0A3638] shadow-xs'
                                : 'bg-[#F8FBFA] text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircleIcon className="w-5 h-5 shrink-0 text-red-600" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 sm:py-5 rounded-2xl bg-[#0A3638] hover:bg-[#07282A] text-white font-extrabold text-sm sm:text-base shadow-card hover:shadow-hover transition-all flex items-center justify-center gap-3 disabled:opacity-60 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
              {loading ? (
                <>
                  <RefreshCwIcon className="w-5 h-5 animate-spin text-[#2DD4BF]" />
                  <span>Sedang Menganalisis Pasar & Menghitung Rate...</span>
                </>
              ) : (
                <>
                  <span>Hitung Rate & Rekomendasi Harga Saya</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#2DD4BF]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ================= RESULTS SECTION ================= */}
        {result && (
          <div id="results-section" className="space-y-6 pt-2">
            {/* Tab Navigation (3 Tabs) */}
            <div className="flex border-b border-[#E2ECE9] gap-2 overflow-x-auto no-print">
              <button
                type="button"
                onClick={() => setActiveTab('rate')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'rate'
                    ? 'border-[#0A3638] text-[#0A3638]'
                    : 'border-transparent text-[#526A6B] hover:text-[#0A3638]'
                }`}
              >
                <CoinsIcon className="w-4 h-4 text-[#0D9488]" />
                <span>1. Rekomendasi Rate & Analisis</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('scripts')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'scripts'
                    ? 'border-[#0A3638] text-[#0A3638]'
                    : 'border-transparent text-[#526A6B] hover:text-[#0A3638]'
                }`}
              >
                <MessageSquareIcon className="w-4 h-4 text-[#0D9488]" />
                <span>2. Script Negosiasi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('proposal_coming_soon')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'proposal_coming_soon'
                    ? 'border-[#0A3638] text-[#0A3638]'
                    : 'border-transparent text-[#526A6B] hover:text-[#0A3638]'
                }`}
              >
                <FileTextIcon className="w-4 h-4 text-[#0D9488]" />
                <span>3. Dokumen Penawaran</span>
                <span className="bg-[#E8F5F3] text-[#0A3638] text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Coming Soon
                </span>
              </button>
            </div>

            {/* TAB 1: REKOMENDASI RATE & ANALISIS */}
            {activeTab === 'rate' && (
              <div className="space-y-6">
                {/* Result Header & Export Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#E2ECE9] shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0D9488] uppercase tracking-wider">
                        Hasil Analisis Rate
                      </span>
                      {/* Confidence Badge */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          result.serviceParams.confidence === 'tinggi'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        Keyakinan: {result.serviceParams.confidence === 'tinggi' ? 'Tinggi (Riset Pasar)' : 'Rendah (Estimasi AI)'}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0A3638] mt-0.5">
                      {result.serviceParams.serviceName}
                    </h2>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 no-print">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0A3638] bg-[#E8F5F3] hover:bg-[#d5eee9] rounded-lg border border-[#CBE5E1] flex items-center gap-1.5 transition-colors"
                      title="Salin Ringkasan Rate"
                    >
                      <CopyIcon className="w-3.5 h-3.5 text-[#0A3638]" />
                      <span>Salin Rate</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0A3638] hover:bg-[#07282A] rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Cetak atau Simpan PDF"
                    >
                      <PrinterIcon className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Main Package Cards (Basic, Standard, Premium) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Basic */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#526A6B] block mb-1">
                        Paket Basic (0.7x)
                      </span>
                      <div className="text-xl sm:text-2xl font-bold text-[#0A3638]">
                        {formatRupiah(result.pricing.packages.basic)}
                      </div>
                      <span className="text-xs text-[#526A6B] mt-0.5 block">
                        {result.serviceParams.pricingUnit}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#526A6B] mt-4 pt-3 border-t border-[#E2ECE9]">
                      Cocok untuk klien dengan scope minimal atau klien pertama untuk bangun reputasi.
                    </p>
                  </div>

                  {/* Standard (Featured) */}
                  <div className="p-5 rounded-2xl bg-[#E8F5F3] border-2 border-[#0A3638] shadow-card relative flex flex-col justify-between">
                    <span className="absolute -top-3 right-4 bg-[#0A3638] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Rate Rekomendasi
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#0A3638] block mb-1">
                        Paket Standard (1.0x)
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#0A3638]">
                        {formatRupiah(result.pricing.recommended)}
                      </div>
                      <span className="text-xs font-semibold text-[#0D9488] mt-0.5 block">
                        {result.serviceParams.pricingUnit}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#0A3638] font-medium mt-4 pt-3 border-t border-[#CBE5E1]">
                      Harga pas target bulanan + estimasi waktu kerja {result.serviceParams.estHoursPerUnit} jam/unit.
                    </p>
                  </div>

                  {/* Premium */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#526A6B] block mb-1">
                        Paket Premium (1.6x)
                      </span>
                      <div className="text-xl sm:text-2xl font-bold text-[#0A3638]">
                        {formatRupiah(result.pricing.packages.premium)}
                      </div>
                      <span className="text-xs text-[#526A6B] mt-0.5 block">
                        {result.serviceParams.pricingUnit}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#526A6B] mt-4 pt-3 border-t border-[#E2ECE9]">
                      Untuk pengerjaan ekspres, revisi unlimited, atau klien dengan kebutuhan skala besar.
                    </p>
                  </div>
                </div>

                {/* Quick Interactive Reaction Poll (High-Conversion Feedback) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#CBE5E1] shadow-card no-print">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-[#0D9488] animate-pulse" />
                        <h3 className="font-extrabold text-xs sm:text-sm text-[#0A3638]">
                          Gimana menurutmu angka rate Standard ({formatRupiah(result.pricing.recommended)}) ini?
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#526A6B] mt-0.5">
                        Bantu kami validasi &amp; kalibrasi data (cukup 1 klik tanpa perlu ngetik):
                      </p>
                    </div>

                    {/* 1-Click Price Perception Options */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {[
                        { id: 'kemurahan', label: '😅 Kemurahan' },
                        { id: 'pas', label: '🎯 Pas Banget' },
                        { id: 'kemahalan', label: '💸 Kemahalan' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleAutoFeedback('price', opt.id)}
                          className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
                            priceFeeling === opt.id
                              ? 'bg-[#0A3638] text-white border-[#0A3638] ring-2 ring-[#0A3638]/20 scale-105'
                              : 'bg-[#F8FBFA] text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3] hover:border-[#0D9488]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {priceFeeling === opt.id && <CheckIcon className="w-3.5 h-3.5 text-[#2DD4BF]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smooth Micro-Expansion: Question 2 after clicking option 1 */}
                  {priceFeeling && (
                    <div className="mt-4 pt-3.5 border-t border-[#E2ECE9]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#0A3638]">
                            👍 Makasih responnya! Apakah rate ini bakal kamu pakai ke calon klien?
                          </p>
                          <span className="text-[10px] text-[#526A6B]">Klik untuk melengkapi validasi data:</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {[
                            { id: 'pasti_pakai', label: '✅ Pasti Pakai' },
                            { id: 'mungkin', label: '🤔 Mungkin / Acuan' },
                            { id: 'tidak_yakin', label: '❌ Belum Yakin' },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleAutoFeedback('usage', opt.id)}
                              className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1 ${
                                willUse === opt.id
                                  ? 'bg-[#0D9488] text-white border-[#0D9488] ring-2 ring-[#0D9488]/20'
                                  : 'bg-[#F8FBFA] text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {willUse === opt.id && <CheckIcon className="w-3 h-3 text-white" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floor Price Card & Gap Analysis Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Floor Card */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle">
                    <div className="flex items-center gap-2 mb-2 text-[#0A3638]">
                      <ShieldCheckIcon className="w-5 h-5 text-[#0D9488]" />
                      <h3 className="font-bold text-sm sm:text-base">
                        Floor Price (Batas Bawah Aman)
                      </h3>
                    </div>
                    <div className="space-y-2 text-xs text-[#526A6B]">
                      <div className="flex justify-between items-center py-1 border-b border-[#E2ECE9]">
                        <span>Batas Aman per Jam:</span>
                        <span className="font-bold text-[#0A3638]">
                          {formatRupiah(result.floor.floorPerHour)} / jam
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-[#E2ECE9]">
                        <span>Batas Aman per Unit:</span>
                        <span className="font-bold text-[#0A3638]">
                          {formatRupiah(result.pricing.floorPerUnit)} / {result.serviceParams.pricingUnit}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#526A6B] pt-1">
                        Jangan terima proyek di bawah angka ini agar waktu kerja dan biaya operasionalmu tetap tertutup dengan aman.
                      </p>
                    </div>
                  </div>

                  {/* Gap Card */}
                  <div
                    className={`p-5 rounded-2xl border shadow-subtle ${
                      result.gap.feasible
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm sm:text-base text-[#0A3638]">
                        Analisis Kapasitas Bulanan
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          result.gap.feasible
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {result.gap.feasible ? 'Target Feasible (Aman)' : 'Perlu Penyesuaian'}
                      </span>
                    </div>

                    <p className="text-xs text-[#0A3638] mb-3">
                      Butuh <span className="font-bold">{result.gap.unitsNeeded} unit</span> per bulan untuk mencapai targetmu. Kapasitas kerjamu:{' '}
                      <span className="font-bold">{result.gap.unitsCapacity} unit</span>.
                    </p>

                    {!result.gap.feasible ? (
                      <div className="text-[11px] text-amber-900 space-y-1 bg-white/70 p-2.5 rounded-xl border border-amber-200">
                        <p className="font-semibold">Saran Strategi agar Target Tercapai:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          <li>Naik ke segmen klien lebih tinggi (startup/perusahaan).</li>
                          <li>Tawarkan paket retainer bulanan (kontrak berlangganan).</li>
                          <li>Tambah add-on upsell atau sesuaikan target pendapatan sementara.</li>
                        </ul>
                      </div>
                    ) : (
                      <p className="text-[11px] text-emerald-900 font-medium">
                        Target pendapatan bersihmu sangat realistis dicapai dengan alokasi jam kerja saat ini.
                      </p>
                    )}
                  </div>
                </div>

                {/* Paket Perdana Card (Only if Proof is Belum Ada / Latihan) */}
                {result.firstClientPromo?.active && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#E8F5F3] to-[#d8f0ec] border border-[#CBE5E1] shadow-subtle">
                    <div className="flex items-center gap-2 mb-1.5 text-[#0A3638]">
                      <SparklesIcon className="w-5 h-5 text-[#0D9488]" />
                      <h3 className="font-bold text-sm sm:text-base">
                        Strategi Khusus: Paket Perdana (Untuk Bangun Portofolio Pertama)
                      </h3>
                    </div>
                    <p className="text-xs text-[#0A3638] leading-relaxed mb-3">
                      {result.firstClientPromo.strategy}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#CBE5E1] text-xs font-bold text-[#0A3638]">
                      <span>Harga Promo Perdana (Diskon {result.firstClientPromo.discountPct}%):</span>
                      <span className="text-[#0D9488] text-sm">
                        {formatRupiah(result.firstClientPromo.promoPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Accordion: Kenapa Angkanya Segini? */}
                <div className="border border-[#E2ECE9] rounded-2xl bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setShowMathDetails(!showMathDetails)}
                    className="w-full px-5 py-4 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0A3638] hover:bg-[#F8FBFA] transition-colors"
                  >
                    <span>Kenapa angkanya segini? (Transparansi Langkah Hitung)</span>
                    {showMathDetails ? (
                      <ChevronUpIcon className="w-4 h-4 text-[#526A6B]" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-[#526A6B]" />
                    )}
                  </button>

                  {showMathDetails && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#526A6B] space-y-3 border-t border-[#E2ECE9]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                          <span className="font-semibold text-[#0A3638] block mb-1">
                            Langkah 1: Required Gross
                          </span>
                          <p className="text-[11px]">
                            (Target Net {formatRupiah(result.userInput.targetNet)} + Overhead {formatRupiah(result.userInput.assumptions.overhead)}) &times; (1 + Buffer {result.userInput.assumptions.bufferPct * 100}%) ={' '}
                            <span className="font-bold text-[#0A3638]">
                              {formatRupiah(result.floor.requiredGross)}
                            </span>
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                          <span className="font-semibold text-[#0A3638] block mb-1">
                            Langkah 2: Jam Billable
                          </span>
                          <p className="text-[11px]">
                            {result.userInput.hoursPerDay} jam/hari &times; {result.userInput.assumptions.workDays} hari &times; {result.userInput.assumptions.billableRatio * 100}% rasio ={' '}
                            <span className="font-bold text-[#0A3638]">
                              {result.floor.billableHours} jam kerja produktif/bulan
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                        <span className="font-semibold text-[#0A3638] block mb-1">
                          Langkah 3: Bobot Pengalaman & Segmen Pasar
                        </span>
                        <p className="text-[11px]">
                          Percentile posisi tarif: {(result.pricing.percentile * 100).toFixed(0)}% (berdasarkan pengalaman &amp; bukti kerja), dengan Multiplier segmen klien: {result.pricing.segmentMultiplier}x.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <p className="text-center text-[11px] text-[#526A6B] italic">
                  * Estimasi objektif, bukan jaminan harga pasar mutlak. Sesuaikan dengan kompleksitas spesifik tiap calon klien.
                </p>
              </div>
            )}

            {/* TAB 2: SCRIPT NEGOSIASI */}
            {activeTab === 'scripts' && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-[#E2ECE9] shadow-xs">
                  <h3 className="font-bold text-base text-[#0A3638] mb-1">
                    Script Balasan Negosiasi Taktis Siap Kirim
                  </h3>
                  <p className="text-xs text-[#526A6B]">
                    Gunakan balasan sopan namun tegas ini saat berhadapan dengan klien yang mencoba menekan tarifmu.
                  </p>
                </div>

                {result.negotiationScripts?.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider block">
                          Skenario
                        </span>
                        <h4 className="font-bold text-base text-[#0A3638]">{item.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyScript(item.script, item.title)}
                        className="self-start sm:self-auto px-3 py-1.5 text-xs font-bold text-[#0A3638] bg-[#E8F5F3] hover:bg-[#d5eee9] rounded-lg border border-[#CBE5E1] flex items-center gap-1.5 transition-colors"
                      >
                        <CopyIcon className="w-3.5 h-3.5" />
                        <span>Salin Script</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#526A6B] italic bg-[#F8FBFA] p-2.5 rounded-lg border border-[#E2ECE9]">
                      Situasi: {item.situation}
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#E8F5F3]/50 border border-[#CBE5E1] text-xs sm:text-sm text-[#0A3638] font-medium leading-relaxed">
                      &ldquo;{item.script}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: DOKUMEN PENAWARAN (COMING SOON) */}
            {activeTab === 'proposal_coming_soon' && (
              <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#CBE5E1] shadow-card text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F5F3] flex items-center justify-center text-[#0A3638] mx-auto">
                  <FileTextIcon className="w-7 h-7 text-[#0D9488]" />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider bg-[#E8F5F3] px-3 py-1 rounded-full border border-[#CBE5E1]">
                    Segera Hadir di Versi Pro
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0A3638] mt-3">
                    Generator Dokumen Penawaran & Kontrak Resmi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#526A6B] max-w-md mx-auto mt-2 leading-relaxed">
                    Fitur pembuatan dokumen proposal otomatis, rincian timeline deliverable, dan surat kontrak siap cetak PDF A4 sedang dalam tahap pengembangan final.
                  </p>
                </div>

                {/* Feature Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left text-xs">
                  <div className="p-3.5 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                    <div className="font-bold text-[#0A3638] mb-1">Export PDF A4 Resmi</div>
                    <p className="text-[#526A6B] text-[11px]">Format standar agensi profesional siap kirim ke klien.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                    <div className="font-bold text-[#0A3638] mb-1">Editor Inline Fleksibel</div>
                    <p className="text-[#526A6B] text-[11px]">Ubah scope, batas revisi, dan termin DP langsung di halaman.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8FBFA] border border-[#E2ECE9]">
                    <div className="font-bold text-[#0A3638] mb-1">Klausul Perlindungan</div>
                    <p className="text-[#526A6B] text-[11px]">Pasal hak cipta, termin pelunasan, dan pembatalan proyek.</p>
                  </div>
                </div>

                {/* Lead Form for Pro Feature */}
                <div className="max-w-md mx-auto pt-2">
                  {leadSubmitted ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      Terima kasih! Email kamu sudah dicatat. Kami akan kabari segera saat fitur dokumen penawaran rilis!
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Masukkan emailmu..."
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBE5E1] text-xs text-[#0A3638] focus:outline-none focus:border-[#0A3638]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0A3638] hover:bg-[#07282A] text-white text-xs font-bold transition-colors"
                      >
                        Ikut Waitlist Pro
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* ================= 2 PERTANYAAN FEEDBACK ================= */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle space-y-4 no-print">
              <div className="border-b border-[#E2ECE9] pb-3">
                <h3 className="font-bold text-sm sm:text-base text-[#0A3638]">
                  Bantu Kami Mengkalibrasi: 2 Pertanyaan Singkat
                </h3>
                <p className="text-xs text-[#526A6B]">
                  Opasimu sangat berharga untuk membuat kalkulator ini semakin akurat bagi seluruh freelancer Indonesia.
                </p>
              </div>

              {feedbackSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                  Terima kasih banyak atas feedbackmu! Masukanmu membantu freelancer lain mendapatkan tarif yang lebih adil.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pertanyaan 1: Price Feel */}
                  <div>
                    <label className="block text-xs font-bold text-[#0A3638] mb-2">
                      1. Menurutmu, bagaimana angka rate Standard ({formatRupiah(result.pricing.recommended)}) ini?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'kemurahan', label: 'Kemurahan' },
                        { id: 'pas', label: 'Pas / Realistis' },
                        { id: 'kemahalan', label: 'Kemahalan' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setPriceFeeling(opt.id);
                            trackEvent('feedback_price_feel', { feeling: opt.id });
                          }}
                          className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-colors ${
                            priceFeeling === opt.id
                              ? 'bg-[#0A3638] text-white border-[#0A3638]'
                              : 'bg-[#F8FBFA] text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pertanyaan 2: Will Use */}
                  <div>
                    <label className="block text-xs font-bold text-[#0A3638] mb-2">
                      2. Apakah kamu akan menggunakan angka ini ke calon klien?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'pasti_pakai', label: 'Pasti pakai' },
                        { id: 'mungkin', label: 'Mungkin / jadikan acuan' },
                        { id: 'tidak_yakin', label: 'Tidak yakin' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setWillUse(opt.id);
                            trackEvent('feedback_will_use', { willUse: opt.id });
                          }}
                          className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-colors ${
                            willUse === opt.id
                              ? 'bg-[#0A3638] text-white border-[#0A3638]'
                              : 'bg-[#F8FBFA] text-[#0A3638] border-[#CBE5E1] hover:bg-[#E8F5F3]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <label className="block text-[11px] text-[#526A6B] mb-1 font-medium">
                      Catatan atau saran tambahan (opsional):
                    </label>
                    <input
                      type="text"
                      maxLength={500}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="Contoh: Di kotaku biasanya harga segini sudah termasuk 2 kali revisi..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#CBE5E1] text-xs text-[#0A3638] focus:outline-none focus:border-[#0A3638]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleFeedbackSubmit}
                    disabled={!priceFeeling && !willUse}
                    className="px-5 py-2 rounded-xl bg-[#0A3638] hover:bg-[#07282A] text-white text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    Kirim Feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
