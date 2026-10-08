import {
  ClientSegment,
  DEFAULT_ASSUMPTIONS,
  ExperienceLevel,
  EXPERIENCE_PERCENTILES,
  PACKAGE_MULTIPLIERS,
  PERCENTILE_LIMITS,
  ProofLevel,
  PROOF_ADJUSTMENTS,
  SEGMENT_MULTIPLIERS,
} from './config';

export interface ComputeFloorInput {
  targetNet: number;
  hoursPerDay: number;
  overhead?: number;
  bufferPct?: number;
  workDays?: number;
  billableRatio?: number;
}

export interface ComputeFloorResult {
  requiredGross: number;
  billableHours: number;
  floorPerHour: number;
}

/**
 * Langkah 1: Floor (batas bawah agar target pendapatan tercapai)
 */
export function computeFloor(i: ComputeFloorInput): ComputeFloorResult {
  const overhead = i.overhead ?? DEFAULT_ASSUMPTIONS.overhead;
  const bufferPct = i.bufferPct ?? DEFAULT_ASSUMPTIONS.bufferPct;
  const workDays = i.workDays ?? DEFAULT_ASSUMPTIONS.workDays;
  const billableRatio = i.billableRatio ?? DEFAULT_ASSUMPTIONS.billableRatio;

  const requiredGross = Math.round((i.targetNet + overhead) * (1 + bufferPct));
  const billableHours = i.hoursPerDay * workDays * billableRatio;
  const floorPerHour = requiredGross / billableHours;

  return { requiredGross, billableHours, floorPerHour };
}

/**
 * Bulatkan angka ke Rp 5.000 terdekat
 */
export function roundToNearest5000(val: number): number {
  return Math.round(val / 5000) * 5000;
}

export interface ComputePriceInput {
  floorPerHour: number;
  estHoursPerUnit: number;
  marketLow: number;
  marketHigh: number;
  experience: ExperienceLevel;
  proof: ProofLevel;
  targetClient: ClientSegment;
}

export interface ComputePriceResult {
  floorPerUnit: number;
  rawPercentile: number;
  percentile: number;
  segmentMultiplier: number;
  recommended: number;
  packages: {
    basic: number;
    standard: number;
    premium: number;
  };
}

/**
 * Langkah 3: Hitung harga rekomendasi dan paket
 */
export function computePrice(i: ComputePriceInput): ComputePriceResult {
  const floorPerUnit = i.floorPerHour * i.estHoursPerUnit;
  const basePercentile = EXPERIENCE_PERCENTILES[i.experience] ?? 0.30;
  const proofAdjustment = PROOF_ADJUSTMENTS[i.proof] ?? 0.0;
  const rawPercentile = basePercentile + proofAdjustment;
  const percentile = Math.min(
    PERCENTILE_LIMITS.max,
    Math.max(PERCENTILE_LIMITS.min, rawPercentile)
  );

  const segmentMultiplier = SEGMENT_MULTIPLIERS[i.targetClient] ?? 1.0;
  const rawRecommended =
    (i.marketLow + (i.marketHigh - i.marketLow) * percentile) * segmentMultiplier;

  const recommended = roundToNearest5000(rawRecommended);

  const packages = {
    basic: roundToNearest5000(recommended * PACKAGE_MULTIPLIERS.basic),
    standard: recommended,
    premium: roundToNearest5000(recommended * PACKAGE_MULTIPLIERS.premium),
  };

  return {
    floorPerUnit,
    rawPercentile,
    percentile,
    segmentMultiplier,
    recommended,
    packages,
  };
}

export interface ComputeGapInput {
  requiredGross: number;
  recommendedPrice: number;
  billableHours: number;
  estHoursPerUnit: number;
}

export interface ComputeGapResult {
  unitsNeeded: number;
  unitsCapacity: number;
  feasible: boolean;
  gapUnits: number;
}

/**
 * Langkah 4: Analisis gap antara kebutuhan pendapatan dan kapasitas kerja
 */
export function computeGap(i: ComputeGapInput): ComputeGapResult {
  const unitsNeeded = Math.ceil(i.requiredGross / i.recommendedPrice);
  const unitsCapacity = Math.floor(i.billableHours / i.estHoursPerUnit);
  const feasible = unitsNeeded <= unitsCapacity;
  const gapUnits = unitsNeeded - unitsCapacity;

  return {
    unitsNeeded,
    unitsCapacity,
    feasible,
    gapUnits,
  };
}
