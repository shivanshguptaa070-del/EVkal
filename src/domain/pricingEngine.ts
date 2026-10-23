import type { LocalTransformerTier } from '../types/transformer';
import type { RegionalGridStress } from '../types/grid';

export const BASE_RATE_INR_PER_KWH = 7.00;
export const MAX_RATE_INR_PER_KWH = 16.80;

/**
 * Classifies the distribution transformer operating tier strictly based on
 * capacity utilisation percentage.
 *
 * < 50.0%             -> LOCAL_OFF_PEAK
 * 50.0% <= util < 75% -> LOCAL_NORMAL
 * 75.0% <= util <= 100% -> LOCAL_CONGESTED
 * > 100.0%            -> LOCAL_OVERLOAD
 */
export function classifyLocalTier(utilisationPct: number): LocalTransformerTier {
  if (utilisationPct > 100.0) {
    return 'LOCAL_OVERLOAD';
  }
  if (utilisationPct >= 75.0) {
    return 'LOCAL_CONGESTED';
  }
  if (utilisationPct >= 50.0) {
    return 'LOCAL_NORMAL';
  }
  return 'LOCAL_OFF_PEAK';
}

/**
 * Returns the tier multiplier M_local.
 */
export function getLocalTierMultiplier(tier: LocalTransformerTier): number {
  switch (tier) {
    case 'LOCAL_OFF_PEAK':
      return 0.55; // ₹3.85 / kWh
    case 'LOCAL_NORMAL':
      return 1.00; // ₹7.00 / kWh
    case 'LOCAL_CONGESTED':
      return 1.60; // ₹11.20 / kWh
    case 'LOCAL_OVERLOAD':
      return 2.40; // ₹16.80 / kWh
  }
}

/**
 * Calculates hourly illustrative tariff in ₹ / kWh:
 * R(t) = R_base * M_local(t) - I_regional(t)
 *
 * Where:
 * - R_base = ₹7.00
 * - I_regional = ₹0.50 discount if regionalGridStress is 'REGIONAL_LOW', else ₹0.00
 */
export function calculateHourlyIllustrativeRate(
  tier: LocalTransformerTier,
  regionalStress?: RegionalGridStress
): number {
  const multiplier = getLocalTierMultiplier(tier);
  const baseTariff = BASE_RATE_INR_PER_KWH * multiplier;
  const regionalDiscount = regionalStress === 'REGIONAL_LOW' ? 0.50 : 0.00;
  const finalRate = Math.max(2.50, baseTariff - regionalDiscount);
  return Number(finalRate.toFixed(2));
}
