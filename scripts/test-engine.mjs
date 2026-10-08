// Native test runner for engine calculations
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Import pure functions
const DEFAULT_ASSUMPTIONS = {
  overhead: 500_000,
  bufferPct: 0.15,
  workDays: 20,
  billableRatio: 0.6,
};

function computeFloor(i) {
  const overhead = i.overhead ?? DEFAULT_ASSUMPTIONS.overhead;
  const bufferPct = i.bufferPct ?? DEFAULT_ASSUMPTIONS.bufferPct;
  const workDays = i.workDays ?? DEFAULT_ASSUMPTIONS.workDays;
  const billableRatio = i.billableRatio ?? DEFAULT_ASSUMPTIONS.billableRatio;

  const requiredGross = Math.round((i.targetNet + overhead) * (1 + bufferPct));
  const billableHours = i.hoursPerDay * workDays * billableRatio;
  const floorPerHour = requiredGross / billableHours;

  return { requiredGross, billableHours, floorPerHour };
}

function computeGap(i) {
  const unitsNeeded = Math.ceil(i.requiredGross / i.recommendedPrice);
  const unitsCapacity = Math.floor(i.billableHours / i.estHoursPerUnit);
  const feasible = unitsNeeded <= unitsCapacity;
  const gapUnits = unitsNeeded - unitsCapacity;

  return { unitsNeeded, unitsCapacity, feasible, gapUnits };
}

function roundToNearest5000(val) {
  return Math.round(val / 5000) * 5000;
}

test('Test 1: targetNet 5.000.000, jam 6', () => {
  const result = computeFloor({ targetNet: 5_000_000, hoursPerDay: 6 });
  assert.equal(result.requiredGross, 6_325_000);
  assert.equal(result.billableHours, 72);
  // floorPerHour sekitar 87.847
  assert.ok(Math.abs(result.floorPerHour - 87_847.22) < 1, `Got ${result.floorPerHour}`);

  const estHoursPerUnit = 2.5;
  const floorPerUnit = result.floorPerHour * estHoursPerUnit;
  // floorPerUnit sekitar 219.618
  assert.ok(Math.abs(floorPerUnit - 219_618.05) < 1, `Got ${floorPerUnit}`);
});

test('Test 2: targetNet 3.000.000, jam 4', () => {
  const result = computeFloor({ targetNet: 3_000_000, hoursPerDay: 4 });
  assert.equal(result.requiredGross, 4_025_000);
  assert.equal(result.billableHours, 48);
  // floorPerHour sekitar 83.854
  assert.ok(Math.abs(result.floorPerHour - 83_854.16) < 1, `Got ${result.floorPerHour}`);
});

test('Test 3: targetNet 10.000.000, jam 8', () => {
  const result = computeFloor({ targetNet: 10_000_000, hoursPerDay: 8 });
  assert.equal(result.requiredGross, 12_075_000);
  assert.equal(result.billableHours, 96);
  // floorPerHour sekitar 125.781
  assert.ok(Math.abs(result.floorPerHour - 125_781.25) < 1, `Got ${result.floorPerHour}`);
});

test('Test 4: Gap analysis with requiredGross 6.325.000, recommended 150.000, billableHours 72, estHours 2.5', () => {
  const gap = computeGap({
    requiredGross: 6_325_000,
    recommendedPrice: 150_000,
    billableHours: 72,
    estHoursPerUnit: 2.5,
  });

  assert.equal(gap.unitsNeeded, 43);
  assert.equal(gap.unitsCapacity, 28);
  assert.equal(gap.feasible, false);
});

test('Test Rounding to nearest 5.000', () => {
  assert.equal(roundToNearest5000(152300), 150000);
  assert.equal(roundToNearest5000(152500), 155000);
  assert.equal(roundToNearest5000(154999), 155000);
});
