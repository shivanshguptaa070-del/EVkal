import { CheckCircle2, MapPin, Zap, Calendar, ArrowRight, Ban } from 'lucide-react';
import type { NearbyChargerSearchResult } from '../types/p2p';
import { useSimulationStore } from '../store/useSimulationStore';

interface NearbyChargerCardProps {
  result: NearbyChargerSearchResult;
  isRecommended?: boolean;
}

export function NearbyChargerCard({ result, isRecommended = false }: NearbyChargerCardProps) {
  const { openBookingModal } = useSimulationStore();
  const { listing, straightLineDistanceKm, isCompatible } = result;

  // Approximate drive time based on straight-line distance (urban ~3.2 min/km)
  const estMinutes = Math.round(straightLineDistanceKm * 3.2);

  return (
    <div
      className={`relative bg-white rounded-2xl border p-4.5 transition-all duration-200 shadow-sm hover:shadow-md ${
        isRecommended
          ? 'border-emerald-300 ring-1 ring-emerald-200/80 bg-gradient-to-br from-emerald-50/20 via-white to-white'
          : isCompatible
          ? 'border-slate-200/90 hover:border-slate-300'
          : 'border-slate-200/60 bg-slate-50/50 opacity-80'
      }`}
    >
      {/* Recommended Top Ribbon */}
      {isRecommended && (
        <div className="absolute -top-3 left-4 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
          <span>★ Recommended</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Left Photo Thumbnail */}
        <div className="relative w-full sm:w-32 h-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
          <img
            src="/assets/images/garage_rajesh.jpg"
            alt={`${listing.hostName} charging location`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback gradient if image load fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Connector Badge Overlay on image */}
          <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold">
            {listing.connectorTypes[0].replace('_', ' ')}
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 w-full space-y-3">
          {/* Header Row: Host Name & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-900 tracking-tight">
                  {listing.hostName}
                </h4>
                {listing.isHostVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Verified Resident</span>
                  </span>
                )}
                {listing.isDemoListing && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    Demo Listing
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">Residential Charger</p>
            </div>

            {/* Distance / Travel Time */}
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              <span>
                {straightLineDistanceKm.toFixed(1)} km away{' '}
                <span className="text-slate-600 font-medium">(Est. {estMinutes} min drive)</span>
              </span>
            </div>
          </div>

          {/* Specs Grid: Power, Rate, Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100 text-xs">
            {/* Power & Connector */}
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-bold text-slate-900">{listing.maxPowerKw} kW AC</span>
                <span className="block text-[10px] text-slate-600">
                  ({listing.connectorTypes.join(', ')})
                </span>
              </div>
            </div>

            {/* Price Rate */}
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                ₹
              </div>
              <div>
                <span className="font-bold text-slate-900">
                  ₹{listing.pricePerKwhInr.toFixed(2)} / kWh
                </span>
                <span className="block text-[10px] text-slate-600">Host Set Rate</span>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Available Today</span>
                <span className="block text-[10px] text-slate-600">
                  {listing.availabilityWindows[0]
                    ? `${String(listing.availabilityWindows[0].startHour).padStart(2, '0')}:00 – ${String(
                        listing.availabilityWindows[0].endHour
                      ).padStart(2, '0')}:00`
                    : '10:00 – 18:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-600 font-medium">
              Approx. locality: {listing.location.approximateLocality}
            </span>

            {isCompatible ? (
              <button
                type="button"
                onClick={() => openBookingModal(listing)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isRecommended
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span>Request Charging Slot</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 cursor-not-allowed border border-slate-200"
                title={`Listing offers ${listing.connectorTypes.join(', ')} while your search requires a different connector.`}
              >
                <Ban className="h-3.5 w-3.5 text-slate-400" />
                <span>Incompatible Plug Type</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
