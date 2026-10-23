import { useState } from 'react';
import {
  IndianRupee,
  Zap,
  Leaf,
  Sun,
  BarChart3,
  Clock,
  AlertTriangle,
  Info,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { useSimulationStore, type ScenarioPreset } from '../../store/useSimulationStore';

export function Page3DynamicTariff() {
  const { activeScenario, setScenario, solverOutput } = useSimulationStore();
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const { summary } = solverOutput;

  // Hourly tariff data tiers matching mockup
  const tariffTiers = [
    {
      hourRange: '00–05',
      hours: [0, 1, 2, 3, 4, 5],
      label: 'Off-Peak',
      badgeClass: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
      price: '₹3.35',
      rate: 3.35,
      description: 'Lowest demand, wind & baseload surplus',
    },
    {
      hourRange: '06–11',
      hours: [6, 7, 8, 9, 10, 11],
      label: 'Normal',
      badgeClass: 'bg-sky-100/80 text-sky-800 border-sky-200',
      price: '₹6.20',
      rate: 6.2,
      description: 'Morning ramp & daytime commercial start',
    },
    {
      hourRange: '12–16',
      hours: [12, 13, 14, 15, 16],
      label: 'Peak',
      badgeClass: 'bg-amber-100/80 text-amber-800 border-amber-200',
      price: '₹8.50',
      rate: 8.5,
      description: 'Afternoon industrial & commercial demand',
    },
    {
      hourRange: '17–20',
      hours: [17, 18, 19, 20],
      label: 'High (Peak)',
      badgeClass: 'bg-rose-100/80 text-rose-800 border-rose-200',
      price: '₹11.20',
      rate: 11.2,
      description: 'Evening residential rush, transformer overload risk',
    },
    {
      hourRange: '21–23',
      hours: [21, 22, 23],
      label: 'Critical',
      badgeClass: 'bg-red-100/80 text-red-800 border-red-300 font-bold',
      price: '₹12.80',
      rate: 12.8,
      description: 'Highest tariff disincentive zone',
    },
  ];

  const scenarios: { id: ScenarioPreset; name: string }[] = [
    { id: 'EVENING_RUSH', name: 'Evening Rush (Baseline)' },
    { id: 'VALLEY_SHIFT', name: 'Valley Shift (Optimized)' },
    { id: 'INFEASIBLE_REQUEST', name: 'Infeasible Request (Stress)' },
  ];

  const currentScenarioName =
    scenarios.find((s) => s.id === activeScenario)?.name ?? 'Evening Rush (Baseline)';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Scenario Selector Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
            <IndianRupee className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dynamic Tariff &amp; Incentive Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              View real-time demand-based electricity prices and recommended charging windows.
            </p>
          </div>
        </div>

        {/* Current Scenario Dropdown */}
        <div className="relative self-stretch sm:self-auto min-w-[240px]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Current Scenario
          </span>
          <button
            type="button"
            onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
            className="w-full inline-flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 text-xs font-bold text-slate-800 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="truncate">{currentScenarioName}</span>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </button>

          {scenarioDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 divide-y divide-slate-100">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setScenario(sc.id);
                    setScenarioDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    activeScenario === sc.id ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{sc.name}</span>
                  {activeScenario === sc.id && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4 Pricing KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Current Price */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <Zap className="h-5 w-5 fill-rose-500/20" />
            </div>
            <span className="text-xs font-bold text-slate-400">Current Price</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              ₹11.20 <span className="text-sm font-semibold text-slate-500 font-sans">/ kWh</span>
            </div>
            <div className="mt-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                High (Peak Hour)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Lowest Price Today */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Lowest Price Today</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              ₹3.35 <span className="text-sm font-semibold text-slate-500 font-sans">/ kWh</span>
            </div>
            <div className="mt-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Off-Peak (00:00 – 05:00)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Solar Generation (Now) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Sun className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Solar Generation (Now)</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              18.5 <span className="text-sm font-semibold font-sans text-slate-500">kW</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span>↑ 6.2 kW</span>
            </div>
          </div>
        </div>

        {/* 4. Estimated Savings */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Estimated Savings</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              ₹{summary.fleetSavingsInr.toFixed(2)}
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 font-tabular">
                ↓ 67.0%
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate">
                By shifting to optimal slots
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Electricity Tariff (Today) Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Hourly Electricity Tariff (Today)
            </h2>
            <div className="group relative">
              <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-20 pointer-events-none">
                Demand-responsive dynamic tariffs adjust pricing dynamically to flatten EV charging spikes.
              </div>
            </div>
          </div>

          {/* View Switcher: Table | Timeline */}
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          /* 5-Column Table layout matching Mockup Image 3 */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/70 text-slate-500 text-xs uppercase font-semibold">
                  <th className="py-3 px-4 font-bold text-slate-600">Hour</th>
                  {tariffTiers.map((t) => (
                    <th key={t.hourRange} className="py-3 px-4 text-center font-bold text-slate-800">
                      {t.hourRange}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Demand Tier Row */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-700">Demand Tier</td>
                  {tariffTiers.map((t) => (
                    <td key={t.hourRange} className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-xl font-bold text-xs border ${t.badgeClass}`}
                      >
                        {t.label}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Price (₹/kWh) Row */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-700">Price (₹/kWh)</td>
                  {tariffTiers.map((t) => (
                    <td key={t.hourRange} className="py-4 px-4 text-center">
                      <span className="text-base font-black text-slate-900 font-tabular tracking-tight">
                        {t.price}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          /* Timeline 24h interactive strip */
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
              {Array.from({ length: 24 }).map((_, hour) => {
                const tier = tariffTiers.find((t) => t.hours.includes(hour)) || tariffTiers[0];
                return (
                  <div
                    key={hour}
                    className="flex flex-col items-center group cursor-pointer"
                    title={`Hour ${String(hour).padStart(2, '0')}:00 - ${tier.label} (${tier.price}/kWh)`}
                  >
                    <div
                      className={`h-10 w-full rounded-md border transition-transform group-hover:scale-105 ${tier.badgeClass}`}
                    />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      {String(hour).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2">
              {tariffTiers.map((t) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  <span className={`h-3 w-3 rounded-full border ${t.badgeClass}`} />
                  <span className="text-slate-600 font-medium">
                    {t.label} ({t.price}/kWh)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Charging Windows Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Recommended Charging Windows
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Best time slots to charge based on lowest price and available grid capacity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Window Card */}
          <div className="bg-emerald-50/50 border-l-4 border-l-emerald-500 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Best Window
              </span>
              <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight">
                00:00 – 05:00
              </div>
              <div className="text-xs font-bold text-emerald-700 mt-1 font-tabular">₹3.35 / kWh</div>
            </div>
          </div>

          {/* Good Window Card */}
          <div className="bg-sky-50/60 border border-sky-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                Good Window
              </span>
              <div className="h-7 w-7 rounded-full bg-sky-500 text-white flex items-center justify-center">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight">
                06:00 – 16:00
              </div>
              <div className="text-xs font-bold text-sky-700 mt-1 font-tabular">₹6.20 / kWh</div>
            </div>
          </div>

          {/* Avoid If Possible Card */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
                Avoid If Possible
              </span>
              <div className="h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight">
                17:00 – 23:00
              </div>
              <div className="text-xs font-bold text-rose-700 mt-1 font-tabular">
                ₹11.20 – ₹12.80 / kWh
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Green Eco Callout Banner */}
      <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200/90 p-4 sm:p-5 flex items-center gap-3.5 text-xs sm:text-sm text-emerald-950 font-medium shadow-2xs">
        <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Leaf className="h-5 w-5" />
        </div>
        <p className="leading-relaxed">
          Charging during off-peak hours can save up to <strong className="text-emerald-800 font-bold">70%</strong>{' '}
          compared to peak-hour prices and helps reduce transformer stress.
        </p>
      </div>
    </div>
  );
}
