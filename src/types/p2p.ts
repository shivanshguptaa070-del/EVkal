export type ConnectorType = 'TYPE_2' | 'CCS_2' | 'CHADEMO' | 'BHARAT_AC001';

export type BookingStatus =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface DayTimeWindow {
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7; // ISO convention: 1 = Monday, 7 = Sunday
  startHour: number;                     // 0 to 23
  endHour: number;                       // 0 to 24 (if endHour <= startHour, spans midnight)
}

export interface ChargerListing {
  id: string;                            // e.g., "HOST-DEL-042"
  hostName: string;                      // e.g., "Rajesh K."
  isHostVerified: boolean;               // Demonstration mock status
  isDemoListing: boolean;                // ALWAYS true for hackathon listings
  connectorTypes: ConnectorType[];
  maxPowerKw: number;                    // e.g., 7.4 kW
  pricePerKwhInr: number;                // e.g., ₹12.50 / kWh
  availabilityWindows: DayTimeWindow[];
  location: {
    latitude: number;
    longitude: number;
    approximateLocality: string;         // e.g., "Vasant Kunj Sector C, New Delhi"
    exactAddress?: string;               // Concealed until booking is ACCEPTED
  };
  accessNotes: string;                   // e.g., "Covered parking slot #14, gate entry code needed"
  gatePin?: string;                      // Concealed until booking is ACCEPTED
}

export interface LowBatterySearchQuery {
  driverLat: number;
  driverLon: number;
  radiusKm: number;                      // e.g., 5.0 km
  vehicleBatteryPct: number;             // e.g., 7%
  estimatedRangeKm: number;              // Manual entry or vehicle telemetry
  requiredConnector: ConnectorType;
}

export interface NearbyChargerSearchResult {
  listing: ChargerListing;
  straightLineDistanceKm: number;        // Haversine formula
  isCompatible: boolean;
  isAvailableNow: boolean;
  estimatedCostFor15KwhInr: number;      // 15 kWh * pricePerKwhInr
  distanceDisclaimer: string;            // "Straight-line distance. Road travel time varies with traffic."
}
