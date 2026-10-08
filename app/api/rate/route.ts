import { NextRequest, NextResponse } from 'next/server';
import { computeFloor, computeGap, computePrice } from '@/lib/engine';
import { normalizeService } from '@/lib/llm';
import { trackServerEvent } from '@/lib/server-analytics';
import {
  ClientSegment,
  DEFAULT_ASSUMPTIONS,
  ExperienceLevel,
  FIRST_CLIENT_PROMO,
  ProofLevel,
} from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Guardrail: Sanitize & validate input
    const serviceRaw = String(body.service || '').slice(0, 80).trim();
    if (!serviceRaw) {
      return NextResponse.json(
        { error: 'Nama jasa wajib diisi (maks 80 karakter).' },
        { status: 400 }
      );
    }

    const experience = (body.experience || 'kurang_1_tahun') as ExperienceLevel;
    const targetClient = (body.targetClient || 'umkm') as ClientSegment;
    const targetNet = Math.max(
      DEFAULT_ASSUMPTIONS.minTargetNet,
      Number(body.targetNet) || 5_000_000
    );
    const hoursPerDay = Math.min(12, Math.max(1, Number(body.hoursPerDay) || 6));
    const proof = (body.proof || 'belum_ada') as ProofLevel;
    const projectStory = String(body.projectStory || '').slice(0, 400).trim();
    const portfolioLink = String(body.portfolioLink || '').trim();

    // Panel Asumsi (opsional dari user)
    const overhead = body.overhead !== undefined ? Number(body.overhead) : DEFAULT_ASSUMPTIONS.overhead;
    const bufferPct = body.bufferPct !== undefined ? Number(body.bufferPct) : DEFAULT_ASSUMPTIONS.bufferPct;
    const workDays = body.workDays !== undefined ? Number(body.workDays) : DEFAULT_ASSUMPTIONS.workDays;
    const billableRatio = body.billableRatio !== undefined ? Number(body.billableRatio) : DEFAULT_ASSUMPTIONS.billableRatio;

    // 1. Normalisasi Jasa (AI / Seed Data)
    const serviceParams = await normalizeService(serviceRaw);

    // 2. Engine: Floor Calculation
    const floor = computeFloor({
      targetNet,
      hoursPerDay,
      overhead,
      bufferPct,
      workDays,
      billableRatio,
    });

    // 3. Engine: Recommended Price & Packages
    const pricing = computePrice({
      floorPerHour: floor.floorPerHour,
      estHoursPerUnit: serviceParams.estHoursPerUnit,
      marketLow: serviceParams.marketLow,
      marketHigh: serviceParams.marketHigh,
      experience,
      proof,
      targetClient,
    });

    // 4. Engine: Gap Analysis
    const gap = computeGap({
      requiredGross: floor.requiredGross,
      recommendedPrice: pricing.recommended,
      billableHours: floor.billableHours,
      estHoursPerUnit: serviceParams.estHoursPerUnit,
    });

    // 5. Paket Perdana (Khusus jika belum ada bukti kerja / baru latihan)
    const needsFirstClientPromo = proof === 'belum_ada' || proof === 'latihan';
    const firstClientPromo = needsFirstClientPromo
      ? {
          active: true,
          discountPct: FIRST_CLIENT_PROMO.discountPct * 100,
          promoPrice: Math.round((pricing.recommended * (1 - FIRST_CLIENT_PROMO.discountPct)) / 5000) * 5000,
          strategy:
            'Tawarkan diskon khusus hingga 30% untuk 2–3 klien pertama, dengan syarat wajib memberikan testimoni tertulis dan izin menampilkan hasil sebagai portofolio/studi kasus.',
        }
      : null;

    // 6. Siapkan Script Nego Cerdas Siap Kirim
    const unitText = serviceParams.pricingUnit;
    const formattedStandard = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pricing.recommended);
    const formattedBasic = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pricing.packages.basic);

    const negotiationScripts = [
      {
        id: 'kemahalan',
        title: 'Klien bilang kemahalan',
        situation: 'Klien merasa harga di atas ekspektasi / budget awal mereka.',
        script: `Halo kak, terima kasih atas responsnya. Rate ${formattedStandard} ${unitText} ini sudah mencakup ${serviceParams.typicalDeliverable} dengan standar kualitas tinggi dan garansi revisi terarah. Jika ada batas budget tertentu, kita bisa sesuaikan cakupan pekerjaannya atau mulai dengan opsi Basic di ${formattedBasic}. Bagaimana menurut kakak?`,
      },
      {
        id: 'minta_diskon',
        title: 'Klien minta diskon langsung',
        situation: 'Klien menawar harga tanpa mengubah ruang lingkup pekerjaan.',
        script: `Terima kasih tawarannya kak. Untuk menjaga standar hasil kerja dan fokus waktu pengerjaan, rate paket Standard adalah ${formattedStandard}. Namun jika kakak ingin harga lebih hemat, saya bisa tawarkan penyesuaian scope kerja (mengurangi 1 fitur/putaran revisi) agar masuk di budget kakak.`,
      },
      {
        id: 'tambah_scope',
        title: 'Klien minta tambah scope tanpa biaya',
        situation: 'Klien meminta revisi di luar kesepakatan atau tambahan deliverable gratis.',
        script: `Senang bisa bantu maksimalkan proyek ini kak! Untuk penambahan request tersebut berada di luar scope awal paket yang disepakati. Saya siap kerjakan tambahan ini dengan biaya add-on penyesuaian. Mau saya buatkan rincian tambahannya sekarang?`,
      },
    ];

    // Track Server Analytics
    trackServerEvent({
      event: 'rate_result_view',
      properties: {
        service: serviceParams.serviceName,
        seedKey: serviceParams.seedKey,
        confidence: serviceParams.confidence,
        experience,
        targetClient,
        targetNet,
        recommendedPrice: pricing.recommended,
        feasible: gap.feasible,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userInput: {
          service: serviceRaw,
          experience,
          targetClient,
          targetNet,
          hoursPerDay,
          proof,
          projectStory,
          portfolioLink,
          assumptions: {
            overhead,
            bufferPct,
            workDays,
            billableRatio,
          },
        },
        serviceParams,
        floor,
        pricing,
        gap,
        firstClientPromo,
        negotiationScripts,
      },
    });
  } catch (error: any) {
    console.error('Rate calculation error:', error);
    return NextResponse.json(
      {
        error:
          'Terjadi kendala saat menghitung rate. Mohon periksa kembali isian form Anda.',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
