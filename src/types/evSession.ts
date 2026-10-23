export interface EVSessionInput {
  id: string;                         // e.g. "EV-01"
  driverName: string;
  vehicleModel: string;
  batteryCapacityKwh: number;
  initialSocPct: number;
  targetSocPct: number;
  requiredEnergyKwh: number;          // BatteryCapacity * (target - initial) / 100
  chargerMaxPowerKw: number;          // e.g., 7.4 kW or 11.0 kW
  arrivalHour: number;                // Integer: 0 to 23
  departureDeadlineHour: number;      // Integer: 0 to 23 (crosses midnight if <= arrivalHour)
  chargingEfficiency: number;         // Default: 0.92 (92%)
  isFlexibilityOptIn: boolean;        // True if driver permits smart rescheduling
}

export interface FeasibilityCheckResult {
  isFeasible: boolean;
  maxDeliverableEnergyKwh: number;
  availableWindowHours: number;
  minimumRequiredHours: number;
  deficitKwh?: number;
  recommendedExtensionHours?: number;
  rejectionReason?: string;
  recommendedAdjustment?: string;
}

export interface EVSlotAllocation {
  evId: string;
  hour: number;                       // 0 to 23
  allocatedPowerKw: number;
  energyKwh: number;
  hourlyRateInr: number;
  costInr: number;
}

export interface EVScheduleResult {
  evId: string;
  allocations: EVSlotAllocation[];
  totalDeliveredKwh: number;
  unmetEnergyKwh: number;
  totalCostInr: number;
  isFullyCharged: boolean;
}
