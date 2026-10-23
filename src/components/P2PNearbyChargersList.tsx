import { useState, useMemo } from 'react';
import {
  MapPin,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

interface P2PNearbyChargersListProps {
  searchQuery?: string;
  selectedConnector?: string;
  selectedRadius?: number;
}

const LISTING_IMAGES: Record<string, string> = {
  'HOST-DEL-002': '/assets/images/dr_neha_villa.jpg', // Dr. Neha Sharma
  'HOST-DEL-001': '/assets/images/garage_rajesh.jpg',  // Rajesh K.
  'HOST-DEL-003': '/assets/images/arjun_garage.jpg',  // Arjun Bhasin
  'HOST-DEL-005': '/assets/images/vipin_home.jpg',    // Vipin Singhal
};

export function P2PNearbyChargersList({
  searchQuery = '',
  selectedConnector = 'TYPE_2',
  selectedRadius = 5,
}: P2PNearbyChargersListProps) {
  const { chargerListings, openBookingModal } = useSimulationStore();
  const [sortBy, setSortBy] = useState<'DISTANCE' | 'PRICE' | 'POWER'>('DISTANCE');

  // Filter listings based on query, connector, and radius
  const filteredListings = useMemo(() => {
    return chargerListings.filter((item) => {
      // Search text match
      if (
        searchQuery &&
        !item.hostName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.location.approximateLocality.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Connector match
      if (
        selectedConnector !== 'ALL' &&
        !item.connectorTypes.includes(selectedConnector as any)
      ) {
        return false;
      }
      return true;
    });
  }, [chargerListings, searchQuery, selectedConnector]);

  // Sort listings
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    if (sortBy === 'PRICE') {
      return list.sort((a, b) => a.pricePerKwhInr - b.pricePerKwhInr);
    }
    if (sortBy === 'POWER') {
      return list.sort((a, b) => b.maxPowerKw - a.maxPowerKw);
    }
    // Default: Dr. Neha first (0.6 km), then Rajesh (2.1 km), Arjun (3.3 km), Vipin (3.6 km)
    const priorityOrder: Record<string, number> = {
      'HOST-DEL-002': 1,
      'HOST-DEL-001': 2,
      'HOST-DEL-003': 3,
      'HOST-DEL-005': 4,
    };
    return list.sort((a, b) => {
      const orderA = priorityOrder[a.id] || 99;
      const orderB = priorityOrder[b.id] || 99;
      return orderA - orderB;
    });
  }, [filteredListings, sortBy]);

  // Exact mock distances & drive times matching user's image
  const getDistanceMeta = (id: string) => {
    switch (id) {
      case 'HOST-DEL-002':
        return { dist: '0.6 km', time: '2 min', availableText: 'Available Today' };
      case 'HOST-DEL-001':
        return { dist: '2.1 km', time: '7 min', availableText: '08:00 - 22:00' };
      case 'HOST-DEL-003':
        return { dist: '3.3 km', time: '11 min', availableText: 'Evening / Night' };
      case 'HOST-DEL-005':
        return { dist: '3.6 km', time: '12 min', availableText: '10:00 - 19:00' };
      default:
        return { dist: '1.8 km', time: '6 min', availableText: 'Available Today' };
    }
  };

  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Nearby Chargers
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Showing chargers within {selectedRadius} km
          </p>
        </div>

        {/* Sort by Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'DISTANCE' | 'PRICE' | 'POWER')}
              className="appearance-none pl-3 pr-7 py-1.5 bg-transparent border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="DISTANCE">Distance</option>
              <option value="PRICE">Price</option>
              <option value="POWER">Power</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3.5">
        {sortedListings.map((listing) => {
          const isRecommended = listing.id === 'HOST-DEL-002';
          const meta = getDistanceMeta(listing.id);
          const imgSrc = LISTING_IMAGES[listing.id] || '/assets/images/garage_rajesh.jpg';

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
                  {/* Host Name + Green Checkmark */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                      {listing.hostName}
                    </h3>
                    {listing.isHostVerified && (
                      <CheckCircle2 className="h-4 w-4 text-[#059669] fill-[#059669]/10 shrink-0" />
                    )}
                  </div>

                  {/* Distance & Travel Time */}
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>
                      {meta.dist} &bull; {meta.time}
                    </span>
                  </div>

                  {/* Specs & Pricing Row Matching Mockup */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium pt-0.5">
                    {/* Power & Connector */}
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
                      <span>
                        Type 2 AC &bull; {listing.maxPowerKw} kW
                      </span>
                    </div>

                    {/* Availability Hours */}
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{meta.availableText}</span>
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
                {isRecommended ? (
                  <button
                    type="button"
                    onClick={() => openBookingModal(listing)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
                  >
                    <span>View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openBookingModal(listing)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-[#059669] text-[#059669] hover:bg-emerald-50 text-xs font-bold transition-all"
                  >
                    <span>View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
