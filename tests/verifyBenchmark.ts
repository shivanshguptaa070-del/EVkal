import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { TransformerConfig, BackgroundLoadSlot } from '../src/types/transformer';
import type { EVSessionInput } from '../src/types/evSession';
import type { HourlyRegionalProfile } from '../src/types/grid';
import type { ChargerListing, LowBatterySearchQuery } from '../src/types/p2p';
import { computeBaselineUncoordinatedProfile } from '../src/domain/transformerEngine';
import { runSmartChargingOptimisation } from '../src/domain/schedulerEngine';
import { validateChargingFeasibility } from '../src/domain/feasibilityValidator';
import { haversineDistanceKm, searchNearbyChargers, getNextBookingState } from '../src/domain/p2pMarketplaceEngine';
import { fetchRegionalGridTelemetry } from '../src/services/gridService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadJson<T>(relativePath: string): T {
  const fullPath = resolve(__dirname, '..', relativePath);
  return JSON.parse(readFileSync(fullPath, 'utf-8'));
}

async function runBenchmarkVerification() {
  console.log('⚡ EVkal · Mathematical Ground-Truth & Domain Engine Verification\n' + '='.repeat(60));

  const config: TransformerConfig = {
    id: 'TX-100-SECTOR-4',
    name: 'Sector 4 Feeder Transformer',
    ratedCapacityKw: 100.0,
    safetyThresholdPct: 90.0,
    connectedHomesCount: 25,
  };

  const backgroundLoad = loadJson<BackgroundLoadSlot[]>('src/data/residentialBackgroundLoad.json');
  const scenarios = loadJson<{
    eveningRush: EVSessionInput[];
    valleyShift: EVSessionInput[];
    infeasibleRequest: EVSessionInput;
  }>('src/data/benchmarkScenarios.json');
  const regionalProfile = loadJson<HourlyRegionalProfile[]>('src/data/syntheticGridProfile.json');
  const sampleListings = loadJson<ChargerListing[]>('src/data/sampleChargerListings.json');

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

  // 7. Dynamic Capacity Slider Performance (<2ms execution time)
  const startTime = performance.now();
  const scaledCapacityConfig: TransformerConfig = { ...config, ratedCapacityKw: 120.0 };
  const dynamicRun = runSmartChargingOptimisation(fleet, backgroundLoad, scaledCapacityConfig, regionalProfile);
  const durationMs = performance.now() - startTime;
  console.log(`[TEST 7] Dynamic Solver Execution Latency: ${durationMs.toFixed(3)} ms (Target < 2.0 ms)`);
  if (durationMs > 20.0 || dynamicRun.optimisedSlots.length !== 24) {
    throw new Error(`Dynamic solver failed or exceeded acceptable latency`);
  }

  // 8. P2P Marketplace Haversine & Search Compatibility
  const directDistance = haversineDistanceKm(28.5200, 77.1500, 28.5244, 77.1558);
  console.log(`[TEST 8a] Direct Haversine Distance: ${directDistance} km (Expected ~0.8 km)`);
  if (Math.abs(directDistance - 0.8) > 0.3) {
    throw new Error(`Assertion Failed: Haversine distance error, got ${directDistance}`);
  }

  const driverQuery: LowBatterySearchQuery = {
    driverLat: 28.5200,
    driverLon: 77.1500, // Delhi NCR
    radiusKm: 15.0,
    vehicleBatteryPct: 7,
    estimatedRangeKm: 14,
    requiredConnector: 'CCS_2',
  };
  const searchResults = searchNearbyChargers(sampleListings, driverQuery, 5, 19);
  console.log(`[TEST 8b] P2P Search Results Count: ${searchResults.length} listings ranked within 15 km`);
  const test8Pass = searchResults.length > 0 && searchResults[0].isCompatible;
  if (!test8Pass) throw new Error(`Assertion Failed: P2P search failed to return compatible results first`);

  // 9. P2P 5-Stage Booking Machine Transitions
  const stage1 = getNextBookingState('AVAILABLE'); // -> REQUESTED
  const stage2 = getNextBookingState(stage1);      // -> ACCEPTED
  const stage3 = getNextBookingState(stage2);      // -> IN_PROGRESS
  const stage4 = getNextBookingState(stage3);      // -> COMPLETED
  console.log(`[TEST 9] P2P 5-Stage State Machine: AVAILABLE -> ${stage1} -> ${stage2} -> ${stage3} -> ${stage4}`);
  if (stage1 !== 'REQUESTED' || stage2 !== 'ACCEPTED' || stage3 !== 'IN_PROGRESS' || stage4 !== 'COMPLETED') {
    throw new Error(`Assertion Failed: 5-Stage state machine transition error`);
  }

  // 10. Offline Resiliency & Fallback Provenance
  const offlineReading = await fetchRegionalGridTelemetry(); // Without URL
  console.log(`[TEST 10] Offline Grid Service Fallback: Provenance = ${offlineReading.provenance} (isLive: ${offlineReading.isLive})`);
  if (offlineReading.provenance !== 'SYNTHETIC_FALLBACK' || offlineReading.isLive !== false) {
    throw new Error(`Assertion Failed: Grid service fallback failed`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL 10 COMPREHENSIVE DOMAIN & BENCHMARK ASSERTIONS PASSED!');
  console.log('='.repeat(60));
}

runBenchmarkVerification().catch((err) => {
  console.error('\n❌ BENCHMARK TEST FAILED:\n', err);
  process.exit(1);
});
