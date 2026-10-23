import { useMemo } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  AlertCircle,
  PlusCircle,
  Zap,
  ShieldCheck,
  Warehouse,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { searchNearbyChargers } from '../domain/p2pMarketplaceEngine';
import { NearbyChargerCard } from './NearbyChargerCard';

export function NearbyChargersList() {
  const {
    p2pQuery,
    p2pSortBy,
    setP2PSortBy,
    p2pFilters,
    setP2PFilter,
    resetP2PFilters,
    chargerListings,
    openListChargerModal,
  } = useSimulationStore();

  // Run pure domain search
  const rawResults = useMemo(() => {
    return searchNearbyChargers(
      chargerListings,
      p2pQuery,
      5,
      19
    );
  }, [chargerListings, p2pQuery]);

  // Apply minimal filter chips
  const filteredResults = useMemo(() => {
    return rawResults.filter((result) => {
      const { listing, isAvailableNow } = result;
      if (p2pFilters.fastOnly && listing.maxPowerKw < 7.4) return false;
      if (p2pFilters.verifiedOnly && !listing.isHostVerified) return false;
      if (p2pFilters.coveredOnly && !listing.accessNotes.toLowerCase().includes('covered')) return false;
      if (p2pFilters.availableNowOnly && !isAvailableNow) return false;
      return true;
    });
  }, [rawResults, p2pFilters]);

  // Apply sorting
  const sortedResults = useMemo(() => {
    const list = [...filteredResults];
    if (p2pSortBy === 'PRICE') {
      return list.sort((a, b) => a.listing.pricePerKwhInr - b.listing.pricePerKwhInr);
    }
    if (p2pSortBy === 'POWER') {
      return list.sort((a, b) => b.listing.maxPowerKw - a.listing.maxPowerKw);
    }
    // Default: compatible first, then shortest distance
    return list.sort((a, b) => {
      if (a.isCompatible !== b.isCompatible) return a.isCompatible ? -1 : 1;
      return a.straightLineDistanceKm - b.straightLineDistanceKm;
    });
  }, [filteredResults, p2pSortBy]);

  const activeFilterCount = Object.values(p2pFilters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* List Header & Sorting */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3
              id="available-chargers-heading"
              className="text-base font-black text-slate-900 tracking-tight"
            >
              Available Chargers Nearby{' '}
              <span className="text-slate-600 font-semibold text-xs">
                ({sortedResults.length} within {p2pQuery.radiusKm.toFixed(1)} km)
              </span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Ranked by connector compatibility and straight-line distance.
            </p>
          </div>

          {/* Actions: Sort & Host Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={openListChargerModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>List Your Charger</span>
            </button>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Sort by</span>
              <div className="relative">
                <select
                  value={p2pSortBy}
                  onChange={(e) =>
                    setP2PSortBy(e.target.value as 'DISTANCE' | 'PRICE' | 'POWER')
                  }
                  className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="DISTANCE">Distance (Nearest)</option>
                  <option value="PRICE">Price (Lowest)</option>
                  <option value="POWER">Power (Highest)</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Filter Chips Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Filters:
          </span>

          <button
            type="button"
            onClick={() => setP2PFilter('fastOnly', !p2pFilters.fastOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              p2pFilters.fastOnly
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <Zap className={`h-3 w-3 ${p2pFilters.fastOnly ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span>Fast (≥7.4 kW)</span>
          </button>

          <button
            type="button"
            onClick={() => setP2PFilter('verifiedOnly', !p2pFilters.verifiedOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              p2pFilters.verifiedOnly
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <ShieldCheck className={`h-3 w-3 ${p2pFilters.verifiedOnly ? 'text-white' : 'text-emerald-600'}`} />
            <span>Verified Resident</span>
          </button>

          <button
            type="button"
            onClick={() => setP2PFilter('coveredOnly', !p2pFilters.coveredOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              p2pFilters.coveredOnly
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <Warehouse className={`h-3 w-3 ${p2pFilters.coveredOnly ? 'text-white' : 'text-blue-500'}`} />
            <span>Covered Parking</span>
          </button>

          <button
            type="button"
            onClick={() => setP2PFilter('availableNowOnly', !p2pFilters.availableNowOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              p2pFilters.availableNowOnly
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <Clock className={`h-3 w-3 ${p2pFilters.availableNowOnly ? 'text-white' : 'text-teal-600'}`} />
            <span>Available Now</span>
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetP2PFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 ml-auto px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Chargers List */}
      {sortedResults.length > 0 ? (
        <div className="space-y-3.5">
          {sortedResults.map((result, idx) => (
            <NearbyChargerCard
              key={result.listing.id}
              result={result}
              isRecommended={idx === 0 && result.isCompatible}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900">No Chargers in Radius</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try expanding your search radius to 7 km or 10 km to discover available host sockets.
          </p>
        </div>
      )}
    </div>
  );
}
