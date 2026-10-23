import type { EVSessionInput, FeasibilityCheckResult } from '../types/evSession';

/**
 * Validates whether vehicle energy can physically be delivered within the requested
 * arrival and departure window at maximum charger power and rated efficiency.
 *
 * Crosses midnight correctly using modular arithmetic.
 * Computes exact whole-hour extension recommendations when infeasible.
 */
export function validateChargingFeasibility(
  request: EVSessionInput
): FeasibilityCheckResult {
  let windowHours = request.departureDeadlineHour - request.arrivalHour;
  if (windowHours <= 0) {
    windowHours += 24; // Crosses midnight
  }

  const effectivePowerKw = request.chargerMaxPowerKw * request.chargingEfficiency;
  const maxDeliverable = effectivePowerKw * windowHours;
  const minRequiredHours = request.requiredEnergyKwh / effectivePowerKw;

  if (maxDeliverable < request.requiredEnergyKwh) {
    const deficit = Number((request.requiredEnergyKwh - maxDeliverable).toFixed(2));
    const extraHoursNeeded = Math.ceil(deficit / effectivePowerKw);

    return {
      isFeasible: false,
      maxDeliverableEnergyKwh: Number(maxDeliverable.toFixed(2)),
      availableWindowHours: windowHours,
      minimumRequiredHours: Number(minRequiredHours.toFixed(1)),
      deficitKwh: deficit,
      recommendedExtensionHours: extraHoursNeeded,
      rejectionReason: `Requested ${request.requiredEnergyKwh} kWh cannot be delivered within ${windowHours} hours at ${request.chargerMaxPowerKw} kW.`,
      recommendedAdjustment: `Extend departure deadline by at least ${extraHoursNeeded} hour(s) or use a higher-power charger.`,
    };
  }

  return {
    isFeasible: true,
    maxDeliverableEnergyKwh: Number(maxDeliverable.toFixed(2)),
    availableWindowHours: windowHours,
    minimumRequiredHours: Number(minRequiredHours.toFixed(1)),
  };
}
