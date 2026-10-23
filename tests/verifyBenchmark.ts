import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { TransformerConfig, BackgroundLoadSlot } from '../src/types/transformer';
import type { EVSessionInput } from '../src/types/evSession';
import type { HourlyRegionalProfile } from '../src/types/grid';
import { computeBaselineUncoordinatedProfile } from '../src/domain/transformerEngine';
import { runSmartChargingOptimisation } from '../src/domain/schedulerEngine';
import { validateChargingFeasibility } from '../src/domain/feasibilityValidator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadJson<T>(relativePath: string): T {
  const fullPath = resolve(__dirname, '..', relativePath);
  return JSON.parse(readFileSync(fullPath, 'utf-8'));
}

async function runBenchmarkVerification() {
  console.log('⚡ EVkal · Mathematical Ground-Truth Benchmark Verification\n' + '='.repeat(60));

  const config: TransformerConfig = {
    id: 'TX-100-SECTOR-4',
    name: 'Sector 4 Feeder Transformer',
    ratedCapacityKw: 100.0,
    safetyThresholdPct: 90.0,
    connectedHomesCount: 25,
  };

  const backgroundLoad = loadJson<BackgroundLoadSlot[]>('src/data/residentialBackgroundLoad.json');
  const scenarios = loadJson<{ eveningRush: EVSessionInput[]; valleyShift: EVSessionInput[]; infeasibleRequest: EVSessionInput }>(
    'src/data/benchmarkScenarios.json'
  );
  const regionalProfile = loadJson<HourlyRegionalProfile[]>('src/data/syntheticGridProfile.json');

  const fleet = scenarios.eveningRush;

  // 1. Calculate Baseline Uncoordinated Charging
  const baselineSlots = computeBaselineUncoordinatedProfile(config, fleet, backgroundLoad, regionalProfile);
  const baselineHour19 = baselineSlots[19];

  console.log(`[TEST 1] Baseline Hour 19 Load: Expected 122.80 kW | Received: ${baselineHour19.totalLoadKw.toFixed(2)} kW`);
  const test1Pass = Math.abs(baselineHour19.totalLoadKw - 122.80) < 0.05;
  if (!test1Pass) throw new Error(`Assertion Failed: Expected baseline Hour 19 to be 122.80 kW, got ${baselineHour19.totalLoadKw}`);

  // 2. Run Smart Charging Optimization
  const { optimisedSlots, summary } = runSmartChargingOptimisation(fleet, backgroundLoad, config, regionalProfile);
  const optHour19 = optimisedSlots[19];

  console.log(`[TEST 2] Optimised Hour 19 Load: Expected 79.20 kW | Received: ${optHour19.totalLoadKw.toFixed(2)} kW`);
  const test2Pass = Math.abs(optHour19.totalLoadKw - 79.20) < 0.05;
  if (!test2Pass) throw new Error(`Assertion Failed: Expected optimised Hour 19 to be 79.20 kW, got ${optHour19.totalLoadKw}`);

  // 3. Peak Reduction Calculation
  console.log(`[TEST 3] Peak Reduction %: Expected 35.50% | Received: ${summary.peakReductionPct.toFixed(2)}%`);
  const test3Pass = Math.abs(summary.peakReductionPct - 35.50) < 0.1;
  if (!test3Pass) throw new Error(`Assertion Failed: Expected peak reduction to be 35.50%, got ${summary.peakReductionPct}`);

  // 4. Overload Avoidance (Zero Overload Hours)
  console.log(`[TEST 4] Optimised Overload Hours: Expected 0 h | Received: ${summary.optimisedOverloadHours} h`);
  console.log(`         Thermal Overload kWh Avoided: Expected 41.90 kWh | Received: ${summary.overloadEnergyAvoidedKwh.toFixed(2)} kWh`);
  const test4Pass = summary.optimisedOverloadHours === 0 && Math.abs(summary.overloadEnergyAvoidedKwh - 41.90) < 0.1;
  if (!test4Pass) throw new Error(`Assertion Failed: Overload hours or energy avoided mismatch`);

  // 5. Fleet Financial Savings
  console.log(`[TEST 5] Fleet Savings: Expected ₹1,752.15 | Received: ₹${summary.fleetSavingsInr.toFixed(2)} (${summary.fleetSavingsPct.toFixed(2)}%)`);
  const test5Pass = Math.abs(summary.fleetSavingsInr - 1752.15) < 1.0;
  if (!test5Pass) throw new Error(`Assertion Failed: Expected fleet savings ₹1,752.15, got ₹${summary.fleetSavingsInr}`);

  // 6. Feasibility Check with Infeasible Request (3.3 kW, 25 kWh, 3-hour window)
  const infeasibleResult = validateChargingFeasibility(scenarios.infeasibleRequest);
  console.log(`[TEST 6] Feasibility Constraint Check:`);
  console.log(`         isFeasible: Expected false | Received: ${infeasibleResult.isFeasible}`);
  console.log(`         recommendedExtension: Expected 6 h | Received: ${infeasibleResult.recommendedExtensionHours} h`);
  const test6Pass = !infeasibleResult.isFeasible && infeasibleResult.recommendedExtensionHours === 6;
  if (!test6Pass) throw new Error(`Assertion Failed: Infeasibility validator failed to recommend +6 hours`);

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL 6 MATHEMATICAL BENCHMARK GROUND-TRUTH ASSERTIONS PASSED!');
  console.log('='.repeat(60));
}

runBenchmarkVerification().catch((err) => {
  console.error('\n❌ BENCHMARK TEST FAILED:\n', err);
  process.exit(1);
});
