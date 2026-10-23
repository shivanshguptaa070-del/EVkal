import type {
  ChargerListing,
  LowBatterySearchQuery,
  NearbyChargerSearchResult,
  BookingStatus,
} from '../types/p2p';

/**
 * Calculates straight-line distance between two geo-coordinates in kilometers
 * using the Haversine formula.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371.0; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(1));
}

/**
 * Checks whether a charger listing is available at a given day of week (1=Mon..7=Sun) and hour.
 */
export function isListingAvailableAt(
  listing: ChargerListing,
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  hour: number
): boolean {
  return listing.availabilityWindows.some((window) => {
    if (window.dayOfWeek !== dayOfWeek) return false;
    if (window.startHour <= window.endHour) {
      return hour >= window.startHour && hour < window.endHour;
    }
    // Midnight crossing
    return hour >= window.startHour || hour < window.endHour;
  });
}

/**
 * Filters and ranks nearby charger listings based on driver emergency search query.
 */
export function searchNearbyChargers(
  listings: ChargerListing[],
  query: LowBatterySearchQuery,
  currentDayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 5,
  currentHour: number = 19
): NearbyChargerSearchResult[] {
  const results: NearbyChargerSearchResult[] = listings.map((listing) => {
    const distanceKm = haversineDistanceKm(
      query.driverLat,
      query.driverLon,
      listing.location.latitude,
      listing.location.longitude
    );

    const isCompatible = listing.connectorTypes.includes(query.requiredConnector);
    const isAvailableNow = isListingAvailableAt(listing, currentDayOfWeek, currentHour);
    const estimatedCost = Number((15.0 * listing.pricePerKwhInr).toFixed(2));

    return {
      listing,
      straightLineDistanceKm: distanceKm,
      isCompatible,
      isAvailableNow,
      estimatedCostFor15KwhInr: estimatedCost,
      distanceDisclaimer:
        'Straight-line distance. Road travel distance and duration vary with urban traffic.',
    };
  });

  // Filter within radius and sort: compatible first, then shortest distance
  return results
    .filter((r) => r.straightLineDistanceKm <= query.radiusKm)
    .sort((a, b) => {
      if (a.isCompatible !== b.isCompatible) return a.isCompatible ? -1 : 1;
      return a.straightLineDistanceKm - b.straightLineDistanceKm;
    });
}

/**
 * 5-Stage P2P Booking State Machine Transitions:
 * AVAILABLE -> REQUESTED -> ACCEPTED -> IN_PROGRESS -> COMPLETED
 */
export function getNextBookingState(current: BookingStatus): BookingStatus {
  switch (current) {
    case 'AVAILABLE':
      return 'REQUESTED';
    case 'REQUESTED':
      return 'ACCEPTED';
    case 'ACCEPTED':
      return 'IN_PROGRESS';
    case 'IN_PROGRESS':
      return 'COMPLETED';
    case 'COMPLETED':
    case 'DECLINED':
    case 'CANCELLED':
      return current;
  }
}
