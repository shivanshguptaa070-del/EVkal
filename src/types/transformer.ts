export type LocalTransformerTier = 'LOCAL_OFF_PEAK' | 'LOCAL_NORMAL' | 'LOCAL_CONGESTED' | 'LOCAL_OVERLOAD';

export type ScheduleStatus = 'OPTIMAL_RESOLVED' | 'MITIGATED_PARTIAL_OVERLOAD' | 'INFEASIBLE_UNMET_ENERGY';

export interface TransformerConfig {
  id: string;                         // e.g., "TX-100-SECTOR-4"
  name: string;                       // e.g., "Sector 4 Feeder Transformer"
  ratedCapacityKw: number;            // Fixed at 100.0 kW for benchmark
  safetyThresholdPct: number;         // 90.0 (%)
  connectedHomesCount: number;        // 25 residential units
}

export interface BackgroundLoadSlot {
  hour: number;                       // 0 to 23
  baseLoadKw: number;                 // Non-EV residential load in kW
}

export interface SlotLoadRecord {
  hour: number;                       // 0 to 23
  backgroundLoadKw: number;           // Residential load
  evChargingLoadKw: number;           // Aggregate EV charging power in this slot
  totalLoadKw: number;                // backgroundLoadKw + evChargingLoadKw
  transformerCapacityKw: number;      // 100.0 kW
  utilisationPct: number;             // (totalLoadKw / transformerCapacityKw) * 100
  isOverloaded: boolean;              // totalLoadKw > transformerCapacityKw
  overloadKw: number;                 // Math.max(0, totalLoadKw - transformerCapacityKw)
  localTier: LocalTransformerTier;    // Local classification
  illustrativeRatePerKwh: number;     // In ₹ / kWh
}

export interface ScheduleImpactSummary {
  baselinePeakKw: number;
  optimisedPeakKw: number;
  peakReductionPct: number;
  baselineOverloadHours: number;
  optimisedOverloadHours: number;
  overloadEnergyAvoidedKwh: number;
  baselineFleetCostInr: number;
  optimisedFleetCostInr: number;
  fleetSavingsInr: number;
  fleetSavingsPct: number;
  scheduleStatus: ScheduleStatus;
}
