import { useState, useMemo } from 'react';
import {
  MapPin,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { haversineDistanceKm } from '../domain/p2pMarketplaceEngine';
import type { ConnectorType } from '../types/p2p';

interface P2PNearbyChargersListProps {
  searchQuery?: string;
  selectedConnector?: string;
  selectedRadius?: number;
  isSearchTriggered?: boolean;
  onResetSearch?: () => void;
  onConnectorChange?: (connector: string) => void;
  onRadiusChange?: (radius: number) => void;
}

const LISTING_IMAGES: Record<string, string> = {
  'HOST-DEL-001': '/assets/images/garage_rajesh.jpg',  // Rajesh K. (Vasant Kunj)
  'HOST-DEL-002': '/assets/images/dr_neha_villa.jpg', // Dr. Neha Sharma (Hauz Khas)
  'HOST-DEL-003': '/assets/images/arjun_garage.jpg',  // Arjun Bhasin (Saket)
  'HOST-DEL-004': '/assets/images/dashboard_hero_ev.jpg', // GreenRide (Chanakyapuri)
  'HOST-DEL-005': '/assets/images/vipin_home.jpg',    // Vipin Singhal (Malviya Nagar)
  'HOST-DEL-006': '/assets/images/shivharsh_villa.jpg', // Suresh Goel (Mehrauli)
  'HOST-DEL-007': '/assets/images/garage_rajesh.jpg', // Vikramaditya Mehta (Connaught Place)
  'HOST-DEL-008': '/assets/images/dr_neha_villa.jpg', // Sunita Rao (Dwarka)
  'HOST-DEL-009': '/assets/images/arjun_garage.jpg',  // Amit Malhotra (Rohini)
  'HOST-DEL-010': '/assets/images/vipin_home.jpg',    // Priya Taneja (Greater Kailash II)
  'HOST-DEL-011': '/assets/images/shivharsh_villa.jpg', // Raghav Singhania (Lajpat Nagar)
  'HOST-DEL-012': '/assets/images/garage_rajesh.jpg', // Harpreet Singh (Karol Bagh)
  'HOST-DEL-013': '/assets/images/dr_neha_villa.jpg', // Deepa Nair (Janakpuri)
  'HOST-DEL-014': '/assets/images/dashboard_hero_ev.jpg', // Aerocity EV Gateway
  'HOST-DEL-015': '/assets/images/arjun_garage.jpg',  // Alok Verma (Mayur Vihar)
  'HOST-DEL-016': '/assets/images/vipin_home.jpg',    // Shivani Bansal (Noida)
  'HOST-DEL-017': '/assets/images/dashboard_hero_ev.jpg', // Kabir Oberoi (Cyber City Gurugram)
  'HOST-DEL-018': '/assets/images/shivharsh_villa.jpg', // Rakesh Aggarwal (Indirapuram)
  'HOST-DEL-019': '/assets/images/dr_neha_villa.jpg', // Ananya Kapoor (Nehru Place)
  'HOST-DEL-020': '/assets/images/garage_rajesh.jpg', // Rohit Choudhary (South Extension)
};

const CONNECTOR_LABELS: Record<string, string> = {
  TYPE_2: 'Type 2 (AC)',
  CCS_2: 'CCS 2 (DC)',
  BHARAT_AC001: 'Bharat AC001',
  CHADEMO: 'CHAdeMO',
  ALL: 'All Connectors',
};

export function P2PNearbyChargersList({
  searchQuery = '',
  selectedConnector = 'TYPE_2',
  selectedRadius = 5,
  isSearchTriggered = false,
  onResetSearch,
  onConnectorChange,
  onRadiusChange,
}: P2PNearbyChargersListProps) {
  const { chargerListings, openBookingModal, p2pQuery } = useSimulationStore();
  const [sortBy, setSortBy] = useState<'DISTANCE' | 'PRICE' | 'POWER'>('DISTANCE');

  const driverLat = p2pQuery.driverLat || 28.5355;
  const driverLon = p2pQuery.driverLon || 77.1735;

  // Filter listings based on query, connector, and radius
  const filteredListings = useMemo(() => {
    const queryClean = searchQuery.trim().toLowerCase();

    return chargerListings.filter((item) => {
      // 1. Text search match across locality, address, and host name
      if (queryClean) {
        const matchesLocality = item.location.approximateLocality.toLowerCase().includes(queryClean);
        const matchesAddress = item.location.exactAddress ? item.location.exactAddress.toLowerCase().includes(queryClean) : false;
        const matchesHost = item.hostName.toLowerCase().includes(queryClean);

        if (!matchesLocality && !matchesAddress && !matchesHost) {
          return false;
        }
      }

      // 2. Connector match
      if (
        selectedConnector !== 'ALL' &&
        !item.connectorTypes.includes(selectedConnector as ConnectorType)
      ) {
        return false;
      }

      // 3. Proximity / Radius filter
      // When a user specifically searches for an area (e.g. "Connaught Place", "Dwarka", "Noida"),
      // allow results from that area across Delhi NCR without being blocked by current GPS proximity
      if (!queryClean) {
        const distance = haversineDistanceKm(
          driverLat,
          driverLon,
          item.location.latitude,
          item.location.longitude
        );
        if (distance > selectedRadius) {
          return false;
        }
      }

      return true;
    });
  }, [chargerListings, searchQuery, selectedConnector, selectedRadius, driverLat, driverLon]);

  // Sort listings
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    if (sortBy === 'PRICE') {
      return list.sort((a, b) => a.pricePerKwhInr - b.pricePerKwhInr);
    }
    if (sortBy === 'POWER') {
      return list.sort((a, b) => b.maxPowerKw - a.maxPowerKw);
    }
    // Default by distance
    return list.sort((a, b) => {
      const distA = haversineDistanceKm(driverLat, driverLon, a.location.latitude, a.location.longitude);
      const distB = haversineDistanceKm(driverLat, driverLon, b.location.latitude, b.location.longitude);
      return distA - distB;
    });
  }, [filteredListings, sortBy, driverLat, driverLon]);

  return (
    <div id="nearby-chargers-section" className="space-y-4 scroll-mt-24 transition-all">
      {/* List Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Nearby Chargers
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              {sortedListings.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Showing chargers within {selectedRadius} km
            {selectedConnector !== 'ALL' && ` • ${CONNECTOR_LABELS[selectedConnector] || selectedConnector}`}
          </p>
        </div>

        {/* Sort by Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'DISTANCE' | 'PRICE' | 'POWER')}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              <option value="DISTANCE">Distance</option>
              <option value="PRICE">Price</option>
              <option value="POWER">Power</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Search & Compatibility Banner */}
      {isSearchTriggered && (
        <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="h-5 w-5 fill-white/30" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-emerald-950">
                  {sortedListings.length} Compatible {sortedListings.length === 1 ? 'Station' : 'Stations'} Found
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-900 text-[10px] font-bold">
                  {CONNECTOR_LABELS[selectedConnector] || selectedConnector}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/80 border border-emerald-300/60 text-emerald-800 text-[10px] font-bold">
                  Within {selectedRadius} km
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                All stations reachable with current <strong>{p2pQuery.vehicleBatteryPct}% battery</strong> ({p2pQuery.estimatedRangeKm} km reachable range).
              </p>
            </div>
          </div>

          {onResetSearch && (
            <button
              type="button"
              onClick={onResetSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      )}

      {/* Empty State when no chargers match */}
      {sortedListings.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-4 shadow-xs animate-fade-in">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No Compatible Chargers Found Nearby
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No chargers offering {CONNECTOR_LABELS[selectedConnector] || selectedConnector} were found within {selectedRadius} km of your location.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {onRadiusChange && selectedRadius < 10 && (
              <button
                type="button"
                onClick={() => onRadiusChange(10)}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
              >
                Expand Search to 10 km
              </button>
            )}
            {onConnectorChange && selectedConnector !== 'TYPE_2' && (
              <button
                type="button"
                onClick={() => onConnectorChange('TYPE_2')}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
              >
                Switch to Type 2 (AC)
              </button>
            )}
            {onConnectorChange && selectedConnector !== 'ALL' && (
              <button
                type="button"
                onClick={() => onConnectorChange('ALL')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Show All Available Chargers
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="space-y-3.5">
        {sortedListings.map((listing) => {
          const isRecommended = listing.id === 'HOST-DEL-002';
          const imgSrc = LISTING_IMAGES[listing.id] || '/assets/images/garage_rajesh.jpg';

          // Calculate precise distance & travel time
          const distance = haversineDistanceKm(
            driverLat,
            driverLon,
            listing.location.latitude,
            listing.location.longitude
          );
          const travelTimeMin = Math.max(2, Math.round(distance * 3.2));
          const isReachable = distance <= p2pQuery.estimatedRangeKm;
          const rangeMargin = Number((p2pQuery.estimatedRangeKm - distance).toFixed(1));

          return (
            <div
              key={listing.id}
              className={`bg-white rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isRecommended
                  ? 'border-emerald-300/80 ring-1 ring-emerald-200/50'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Thumbnail Photo */}
                <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={imgSrc}
                    alt={`${listing.hostName} charging station`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* "Recommended" Green Pill Badge */}
                  {isRecommended && (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#059669] text-white text-[10px] font-bold tracking-wide shadow-sm">
                      Recommended
                    </div>
                  )}
                </div>

                {/* Info Center */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Host Name + Verified Checkmark + Compatibility Tag */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                      {listing.hostName}
                    </h3>
                    {listing.isHostVerified && (
                      <CheckCircle2 className="h-4 w-4 text-[#059669] fill-[#059669]/10 shrink-0" />
                    )}
                    {isReachable ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        ✓ 100% Compatible (+{rangeMargin} km margin)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                        ⚠️ High Range Risk
                      </span>
                    )}
                  </div>

                  {/* Distance & Travel Time */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>
                      {distance.toFixed(1)} km &bull; {travelTimeMin} min drive &bull; {listing.location.approximateLocality}
                    </span>
                  </div>

                  {/* Specs & Pricing Row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium pt-0.5">
                    {/* Power & Connector */}
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
                      <span className="font-semibold text-slate-800">
                        {listing.connectorTypes.map(c => CONNECTOR_LABELS[c] || c).join(', ')} &bull; {listing.maxPowerKw} kW
                      </span>
                    </div>

                    {/* Availability Hours */}
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>08:00 - 22:00</span>
                    </div>

                    {/* Price Rate */}
                    <div className="flex items-center gap-0.5 font-bold text-slate-900">
                      <span>₹{listing.pricePerKwhInr.toFixed(2)} / kWh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: View → */}
              <div className="shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => openBookingModal(listing)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isRecommended
                      ? 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm shadow-emerald-600/20'
                      : 'border border-[#059669] text-[#059669] hover:bg-emerald-50'
                  }`}
                >
                  <span>View</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
