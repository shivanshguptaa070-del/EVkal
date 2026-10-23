import { useMemo } from 'react';
import { ChevronDown, SlidersHorizontal, AlertCircle, PlusCircle } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { searchNearbyChargers } from '../domain/p2pMarketplaceEngine';
import { NearbyChargerCard } from './NearbyChargerCard';

export function NearbyChargersList() {
  const { p2pQuery, p2pSortBy, setP2PSortBy, chargerListings, openListChargerModal } = useSimulationStore();

  // Run pure domain search
  const rawResults = useMemo(() => {
    return searchNearbyChargers(
      chargerListings,
      p2pQuery,
      5,
      19
    );
  }, [chargerListings, p2pQuery]);

  // Apply sorting
  const sortedResults = useMemo(() => {
    const list = [...rawResults];
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
  }, [rawResults, p2pSortBy]);

  return (
    <div className="space-y-4">
      {/* List Header & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
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
