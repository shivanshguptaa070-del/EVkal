import { useState } from 'react';
import { AlertTriangle, Navigation, Zap, Search, ArrowRight, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ConnectorType } from '../types/p2p';

interface LowBatteryHeroInputProps {
  onFindChargers?: () => void;
}

export function LowBatteryHeroInput({ onFindChargers }: LowBatteryHeroInputProps) {
  const { p2pQuery, setP2PQuery } = useSimulationStore();
  const [isSearching, setIsSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState(false);
  const isCritical = p2pQuery.vehicleBatteryPct <= 10;

  const handleBatteryChange = (pct: number) => {
    // Range estimation: ~1.73 km per 1% SOC
    const estimatedKm = Math.max(2, Math.round(pct * 1.73));
    setP2PQuery({
      vehicleBatteryPct: pct,
      estimatedRangeKm: estimatedKm,
    });
  };

  const handleExecuteSearch = () => {
    setIsSearching(true);
    setSearchFeedback(true);

    // Call callback to sync filters and trigger active search in parent
    onFindChargers?.();

    // Smooth scroll to the chargers section with pulse highlight
    setTimeout(() => {
      setIsSearching(false);
      const el = document.getElementById('nearby-chargers-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-emerald-400', 'ring-offset-2');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-emerald-400', 'ring-offset-2');
        }, 2000);
      }
    }, 250);

    setTimeout(() => {
      setSearchFeedback(false);
    }, 3500);
  };

  return (
    <div className="bg-[#FFFDF5] border border-[#FDE68A] rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 transition-all">
      {/* Top Controls Flex/Grid Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6">
        {/* 1. Alert Banner Icon & Text */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="h-11 w-11 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Critical Low Battery Alert
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Find a nearby charger to reach your destination safely.
            </p>
          </div>
        </div>

        {/* Vertical Divider for Desktop */}
        <div className="hidden lg:block w-px h-10 bg-amber-200/80 mx-1 shrink-0" />

        {/* 2. Current Battery Slider */}
        <div className="w-full lg:w-40 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 text-[11px]">Current Battery</span>
            <span className="font-bold text-slate-900 text-sm">
              {p2pQuery.vehicleBatteryPct}%
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={30}
            step={1}
            value={p2pQuery.vehicleBatteryPct}
            onChange={(e) => handleBatteryChange(Number(e.target.value))}
            className="w-full h-1.5 bg-[#FDE68A] rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
            aria-label="Current EV Battery Percentage"
          />
        </div>

        {/* 3. Estimated Reachable Range */}
        <div className="w-full lg:w-44 space-y-0.5">
          <span className="text-slate-500 text-[11px] font-semibold block">
            Estimated Reachable Range
          </span>
          <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm">
            <Navigation className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600 rotate-45 shrink-0" />
            <span>{p2pQuery.estimatedRangeKm} km remaining</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">
            (Straight-line estimate)
          </span>
        </div>

        {/* 4. Connector Type Dropdown */}
        <div className="w-full lg:w-36 space-y-1">
          <label htmlFor="hero-connector-select" className="text-slate-500 text-[11px] font-semibold block">
            Connector Type
          </label>
          <div className="relative">
            <select
              id="hero-connector-select"
              value={p2pQuery.requiredConnector}
              onChange={(e) =>
                setP2PQuery({ requiredConnector: e.target.value as ConnectorType })
              }
              className="w-full appearance-none pl-7 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="TYPE_2">Type 2 (AC)</option>
              <option value="CCS_2">CCS 2 (DC)</option>
              <option value="BHARAT_AC001">Bharat AC001</option>
              <option value="CHADEMO">CHAdeMO</option>
            </select>
            <Zap className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-600 fill-emerald-600 pointer-events-none" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 5. Search Radius Slider */}
        <div className="w-full lg:w-40 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 text-[11px]">Search Radius</span>
            <span className="font-bold text-slate-900 text-xs">
              {p2pQuery.radiusKm.toFixed(1)} km
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={p2pQuery.radiusKm}
            onChange={(e) => setP2PQuery({ radiusKm: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
            aria-label="Search Radius"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>1 km</span>
            <span>10 km</span>
          </div>
        </div>
      </div>

      {/* Honest Range Advisory Banner if Critical (≤ 10%) */}
      {isCritical && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100/70 border border-orange-200/90 text-[11px] text-amber-950 font-medium animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5 text-orange-600 shrink-0" />
          <span>
            <strong>Honest Range Advisory:</strong> Battery is critically low. Road travel distance and traffic will reduce reachable range.
          </span>
        </div>
      )}

      {/* Bottom Full-Width Emerald CTA Button */}
      <button
        type="button"
        id="find-nearby-chargers-btn"
        disabled={isSearching}
        onClick={handleExecuteSearch}
        className="w-full py-3 px-5 bg-[#059669] hover:bg-[#047857] active:scale-[0.99] disabled:opacity-85 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSearching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Searching Compatible Chargers...</span>
          </>
        ) : searchFeedback ? (
          <>
            <Check className="h-4 w-4" />
            <span>Filtering Compatible Nearby Chargers...</span>
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            <span>Find Compatible Nearby Chargers</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
