export type DataProvenance = 'LIVE_API' | 'SYNTHETIC_FALLBACK' | 'LOCAL_SIMULATION';

export type RegionalGridStress = 'REGIONAL_LOW' | 'REGIONAL_NORMAL' | 'REGIONAL_HIGH' | 'REGIONAL_CRITICAL';
export type GridStress = RegionalGridStress;

export interface RegionalGridReading {
  timestamp: string;                  // ISO 8601 format
  provenance: DataProvenance;         // Explicitly labeled source
  sourceName: string;                 // e.g., "Grid-India Open Data" or "Synthetic Regional Demo Baseline"
  regionName: string;                 // e.g., "Northern Regional Grid (NR)"
  regionalDemandMw: number;           // Macro grid demand in MW
  regionalGridStress: RegionalGridStress;
  isLive: boolean;                    // True if returned from an active network request
  fallbackReason?: string;            // Present if synthetic dataset was loaded
}

export interface HourlyRegionalProfile {
  hour: number;                       // 0 to 23
  demandMw: number;
  regionalGridStress: RegionalGridStress;
}
