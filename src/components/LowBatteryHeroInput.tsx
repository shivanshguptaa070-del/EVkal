import { AlertTriangle, Navigation, Zap, Search, ArrowRight } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ConnectorType } from '../types/p2p';

export function LowBatteryHeroInput() {
  const { p2pQuery, setP2PQuery } = useSimulationStore();
  const isCritical = p2pQuery.vehicleBatteryPct <= 10;

  const handleBatteryChange = (pct: number) => {
    // Dynamic estimated range based on ~1.7 km per 1% SOC for typical Indian EV
    const estimatedKm = Math.max(2, Math.round(pct * 1.7));
    setP2PQuery({
      vehicleBatteryPct: pct,
      estimatedRangeKm: estimatedKm,
    });
  };

  return (
    <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/80 to-orange-50/90 border border-orange-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top 4-Column Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-center">
        {/* 1. Alert Banner Badge (4 cols) */}
        <div className="lg:col-span-4 flex items-center gap-3.5 pr-2 border-b lg:border-b-0 lg:border-r border-orange-200/70 pb-3 lg:pb-0">
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isCritical
                ? 'bg-orange-500 text-white animate-pulse shadow-orange-500/30'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-amber-950 tracking-tight">
                Critical Low Battery Alert
              </h2>
              {isCritical && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider animate-bounce">
                  Emergency
                </span>
              )}
            </div>
            <p className="text-xs text-amber-900/80 font-medium leading-relaxed">
              Find a nearby charger to reach your destination safely.
            </p>
          </div>
        </div>

        {/* 2. Battery Slider (2.5 cols) */}
        <div className="lg:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Current Battery</span>
            <span
              className={`font-black text-sm tabular-nums ${
                isCritical ? 'text-orange-600 animate-pulse' : 'text-slate-900'
              }`}
            >
              {p2pQuery.vehicleBatteryPct}%
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="range"
              min={2}
              max={30}
              step={1}
              value={p2pQuery.vehicleBatteryPct}
              onChange={(e) => handleBatteryChange(Number(e.target.value))}
              className="w-full h-2 bg-orange-200/70 rounded-lg appearance-none cursor-pointer accent-orange-600"
              aria-label="Current EV Battery Percentage"
            />
          </div>
        </div>

        {/* 3. Estimated Reachable Range (2 cols) */}
        <div className="lg:col-span-2 space-y-1">
          <span className="text-slate-600 font-semibold text-xs block">
            Estimated Reachable Range
          </span>
          <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm">
            <Navigation className="h-4 w-4 text-emerald-600 fill-emerald-600" />
            <span>{p2pQuery.estimatedRangeKm} km remaining</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            (Straight-line estimate)
          </span>
        </div>

        {/* 4. Connector Dropdown (2 cols) */}
        <div className="lg:col-span-2 space-y-1">
          <label htmlFor="connector-select" className="text-slate-600 font-semibold text-xs block">
            Connector Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <select
              id="connector-select"
              value={p2pQuery.requiredConnector}
              onChange={(e) =>
                setP2PQuery({ requiredConnector: e.target.value as ConnectorType })
              }
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="TYPE_2">Type 2 (AC)</option>
              <option value="CCS_2">CCS 2 (DC)</option>
              <option value="CHADEMO">CHAdeMO (DC)</option>
              <option value="BHARAT_AC001">Bharat AC001</option>
            </select>
          </div>
        </div>

        {/* 5. Search Radius Slider (1.5 cols) */}
        <div className="lg:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Search Radius</span>
            <span className="font-black text-slate-900 text-xs tabular-nums">
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
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            aria-label="Search Radius"
          />
          <div className="flex justify-between text-[10px] text-slate-600 font-medium">
            <span>1 km</span>
            <span>10 km</span>
          </div>
        </div>
      </div>

      {/* Prominent Wide Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            // Re-trigger visual feedback
            const el = document.getElementById('available-chargers-heading');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span>Find Compatible Nearby Chargers</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
