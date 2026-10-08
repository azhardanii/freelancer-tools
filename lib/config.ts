export type ExperienceLevel =
  | 'belum_pernah'
  | 'kurang_1_tahun'
  | '1_3_tahun'
  | 'lebih_3_tahun';

export type ClientSegment =
  | 'umkm'
  | 'startup'
  | 'corporate'
  | 'overseas';

export type ProofLevel =
  | 'belum_ada'
  | 'latihan'
  | '1_3_proyek'
  | '4_plus_proyek';

export const DEFAULT_ASSUMPTIONS = {
  overhead: 500_000,
  bufferPct: 0.15,
  workDays: 20,
  billableRatio: 0.6,
  hoursPerDayDefault: 6,
  minTargetNet: 500_000,
};

export const EXPERIENCE_PERCENTILES: Record<ExperienceLevel, number> = {
  belum_pernah: 0.15,
  kurang_1_tahun: 0.30,
  '1_3_tahun': 0.55,
  lebih_3_tahun: 0.80,
};

export const PROOF_ADJUSTMENTS: Record<ProofLevel, number> = {
  belum_ada: -0.10,
  latihan: -0.05,
  '1_3_proyek': 0.0,
  '4_plus_proyek': 0.10,
};

export const PERCENTILE_LIMITS = {
  min: 0.05,
  max: 0.95,
};

export const SEGMENT_MULTIPLIERS: Record<ClientSegment, number> = {
  umkm: 1.0,
  startup: 1.25,
  corporate: 1.6,
  overseas: 1.8,
};

export const PACKAGE_MULTIPLIERS = {
  basic: 0.7,
  standard: 1.0,
  premium: 1.6,
};

export const FIRST_CLIENT_PROMO = {
  discountPct: 0.30, // Diskon 30% untuk 2-3 klien pertama
  maxClients: 3,
};
