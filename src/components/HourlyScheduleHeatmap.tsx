import { useState } from 'react';
import {
  Info,
  Moon,
  Sun,
  CloudSun,
  Zap,
  Clock,
  Layers,
  List,
  Sparkles,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function HourlyScheduleHeatmap() {
  const { solverOutput } = useSimulationStore();
  const { optimisedSlots } = solverOutput;
  const [viewMode, setViewMode] = useState<'GRID' | 'COLUMNS' | 'BANDS' | 'TABLE'>('GRID');

  // Period definitions for the vertical cards
  const periods = [
    {
      id: 'night',
      title: 'Night Valley',
      timeRange: '00:00 – 05:00',
      icon: Moon,
      bgClass: 'bg-indigo-50/40 border-indigo-200/80',
      headerClass: 'text-indigo-950 border-indigo-100',
      hours: [0, 1, 2, 3, 4, 5],
      advice: 'Optimal deep overnight charging window; minimal transformer stress.',
      accentColor: 'text-indigo-600',
    },
    {
      id: 'morning',
      title: 'Morning Solar',
      timeRange: '06:00 – 11:00',
      icon: Sun,
      bgClass: 'bg-amber-50/40 border-amber-200/80',
      headerClass: 'text-amber-950 border-amber-100',
      hours: [6, 7, 8, 9, 10, 11],
      advice: 'Daytime solar absorption & commute; balanced residential baseline.',
      accentColor: 'text-amber-600',
    },
    {
      id: 'afternoon',
      title: 'Afternoon Base',
      timeRange: '12:00 – 17:00',
      icon: CloudSun,
      bgClass: 'bg-sky-50/40 border-sky-200/80',
      headerClass: 'text-sky-950 border-sky-100',
      hours: [12, 13, 14, 15, 16, 17],
      advice: 'Moderate grid baseline; pre-peak ramp before evening surge.',
      accentColor: 'text-sky-600',
    },
    {
      id: 'evening',
      title: 'Evening Rush Peak',
      timeRange: '18:00 – 23:00',
      icon: Zap,
      bgClass: 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-400/20',
      headerClass: 'text-rose-950 border-rose-200',
      hours: [18, 19, 20, 21, 22, 23],
      advice: 'Critical transformer overload danger zone (122.8 kW spike at 19:00).',
      accentColor: 'text-rose-600',
      isPeakGroup: true,
    },
  ];

  function getTierPill(tier: string, isOverloaded?: boolean, compact?: boolean) {
    const textClass = compact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5';
    if (isOverloaded || tier === 'LOCAL_OVERLOAD') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-md font-black bg-red-100 text-red-700 border border-red-300 shadow-2xs whitespace-nowrap leading-none ${textClass}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0 animate-pulse" />
          <span>Overload</span>
        </span>
      );
    }
    switch (tier) {
      case 'LOCAL_OFF_PEAK':
        return (
          <span className={`inline-flex items-center gap-1 rounded-md font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/90 whitespace-nowrap leading-none ${textClass}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Off-Peak</span>
          </span>
        );
      case 'LOCAL_NORMAL':
        return (
          <span className={`inline-flex items-center gap-1 rounded-md font-bold bg-blue-100 text-blue-800 border border-blue-200/90 whitespace-nowrap leading-none ${textClass}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>Normal</span>
          </span>
        );
      case 'LOCAL_CONGESTED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-md font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap leading-none ${textClass}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Peak</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded-md font-bold bg-slate-100 text-slate-700 whitespace-nowrap leading-none ${textClass}`}>
            <span>Normal</span>
          </span>
        );
    }
  }

  // Grouped continuous bands for the summary view
  const summaryBands = [
    {
      title: 'Night Deep Off-Peak Window',
      hoursRange: '00:00 – 06:00 (Hours 00–05)',
      tier: 'LOCAL_OFF_PEAK',
      rate: '₹3.40 / kWh',
      duration: '6 Hours',
      description: 'Lowest tariff tier. Transformer operates below 40% capacity. Best for overnight fleet bulk charging.',
      badgeText: 'Cheapest Rate (₹3.40)',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      title: 'Daytime Solar Absorption Period',
      hoursRange: '06:00 – 17:00 (Hours 06–16)',
      tier: 'LOCAL_OFF_PEAK',
      rate: '₹3.90 / kWh',
      duration: '11 Hours',
      description: 'High solar generation and steady residential baseline. Ideal for daytime workplace and public charging.',
      badgeText: 'Solar Hours (₹3.90)',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      title: 'Pre-Peak Shoulder Ramp',
      hoursRange: '17:00 – 18:00 (Hour 17)',
      tier: 'LOCAL_NORMAL',
      rate: '₹7.00 / kWh',
      duration: '1 Hour',
      description: 'Residents return home; household baseline begins climbing. Smart scheduler prepares to throttle EV charging.',
      badgeText: 'Shoulder (₹7.00)',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      title: 'Critical Evening Peak & Overload Risk',
      hoursRange: '18:00 – 21:00 (Hours 18–20)',
      tier: 'LOCAL_OVERLOAD',
      rate: '₹11.20 / kWh',
      duration: '3 Hours',
      description: 'Transformer exceeds 100 kW threshold in uncoordinated charging (122.8 kW spike at 19:00). Highest penalty tariff.',
      badgeText: 'Peak / Overload (₹11.20)',
      badgeClass: 'bg-red-100 text-red-800 border-red-300 font-black',
      isCritical: true,
    },
    {
      title: 'Post-Peak Safe Recovery Window',
      hoursRange: '21:00 – 24:00 (Hours 21–23)',
      tier: 'LOCAL_OFF_PEAK',
      rate: '₹3.40 – ₹7.00 / kWh',
      duration: '3 Hours',
      description: 'Evening household appliances switch off; load recedes safely below 80 kW. Deferred EV fleet resumes smart charging.',
      badgeText: 'Recovery Tier',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* ── Header: Title, Description & Layout Switcher ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shadow-2xs">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight text-slate-900">
                24-Hour Demand Tier &amp; Illustrative Tariff
              </h3>
              <span
                title="Dynamic demand-responsive tariff bands classified per hour with zero overlap"
                className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Vertical time-of-day periods with perfectly aligned hours, tier badges, and tariff rates.
            </p>
          </div>
        </div>

        {/* View Layout Switcher Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('GRID')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'GRID'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Spacious 2x2 Grid with full load metrics"
          >
            <Layers className="h-3.5 w-3.5 text-purple-600" />
            <span>2x2 Spacious Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('COLUMNS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'COLUMNS'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Side-by-side 4 Period Columns (Stacked cards)"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>4 Columns</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('BANDS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'BANDS'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Grouped Time Bands (Summary Cards)"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Summary Bands</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'TABLE'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Vertical 24-Hour Timeline List"
          >
            <List className="h-3.5 w-3.5 text-blue-600" />
            <span>Full 24h List</span>
          </button>
        </div>
      </div>

      {/* ── VIEW 1: 2x2 SPACIOUS GRID (DEFAULT - ZERO SQUISHING, 100% PERFECT ALIGNMENT) ── */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {periods.map((period) => {
            const PeriodIcon = period.icon;
            return (
              <div
                key={period.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between shadow-xs transition-all ${period.bgClass}`}
              >
                <div>
                  {/* Period Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-xl bg-white shadow-2xs flex items-center justify-center border border-slate-200/60 ${period.accentColor}`}>
                        <PeriodIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 tracking-tight">
                            {period.title}
                          </h4>
                          {period.isPeakGroup ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-300 shadow-2xs">
                              PEAK OVERLOAD
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white text-slate-600 border border-slate-200 shadow-2xs">
                              6 Hours
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          Window: {period.timeRange}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table Column Headers */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2 border-b border-slate-200/50 mb-1.5">
                    <span className="w-16 text-left">Time</span>
                    <span className="w-24 text-center">Demand Tier</span>
                    <span className="w-20 text-center hidden sm:inline-block">Grid Load</span>
                    <span className="w-24 text-right">Tariff Rate</span>
                  </div>

                  {/* Hourly Rows */}
                  <div className="space-y-1">
                    {period.hours.map((h) => {
                      const slot = optimisedSlots[h] ?? {
                        hour: h,
                        localTier: 'LOCAL_OFF_PEAK',
                        illustrativeRatePerKwh: 3.4,
                        isOverloaded: false,
                        totalLoadKw: 35.0,
                      };

                      const isCriticalHour = h === 19;
                      const isPeak = slot.localTier === 'LOCAL_CONGESTED' || slot.localTier === 'LOCAL_OVERLOAD';

                      return (
                        <div
                          key={h}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                            isCriticalHour
                              ? 'bg-red-50 border border-red-300 font-bold shadow-xs'
                              : isPeak
                              ? 'bg-amber-50/70 border border-amber-200/80 hover:bg-amber-50'
                              : 'bg-white/80 border border-slate-100 hover:bg-white shadow-2xs'
                          }`}
                        >
                          {/* Hour */}
                          <div className="w-16 text-left font-mono font-bold text-slate-800 text-xs">
                            {String(h).padStart(2, '0')}:00
                          </div>

                          {/* Demand Tier Pill */}
                          <div className="w-24 flex justify-center">
                            {getTierPill(slot.localTier, slot.isOverloaded)}
                          </div>

                          {/* Grid Load */}
                          <div className="w-20 text-center font-mono text-xs text-slate-500 hidden sm:block">
                            <span className={isCriticalHour ? 'text-red-700 font-bold' : ''}>
                              {slot.totalLoadKw.toFixed(1)} kW
                            </span>
                          </div>

                          {/* Rate */}
                          <div className="w-24 text-right font-mono font-black text-slate-900 text-xs">
                            <span className={isCriticalHour ? 'text-red-700 font-black' : ''}>
                              ₹{slot.illustrativeRatePerKwh.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal font-sans ml-1">
                              /kWh
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Period Micro-advice Footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <span className="text-slate-400">💡</span>
                  <span>{period.advice}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIEW 1B: 4-PERIOD COLUMNS (STACKED MINI-CARDS FOR ZERO OVERFLOW) ── */}
      {viewMode === 'COLUMNS' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
          {periods.map((period) => {
            const PeriodIcon = period.icon;
            return (
              <div
                key={period.id}
                className={`rounded-xl border p-3 flex flex-col justify-between shadow-2xs transition-all ${period.bgClass}`}
              >
                <div>
                  {/* Period Header */}
                  <div className="pb-2.5 mb-2 border-b border-slate-200/70">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`h-6 w-6 rounded-md bg-white shadow-2xs flex items-center justify-center shrink-0 ${period.accentColor}`}>
                          <PeriodIcon className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 truncate">
                          {period.title}
                        </h4>
                      </div>
                      {period.isPeakGroup ? (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-300">
                          PEAK
                        </span>
                      ) : (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white text-slate-600 border border-slate-200">
                          6h
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Window:</span>
                      <span className="font-bold text-slate-700">{period.timeRange}</span>
                    </div>
                  </div>

                  {/* Hourly Stacked Mini-Cards (Guaranteed Zero Overlap) */}
                  <div className="space-y-1.5">
                    {period.hours.map((h) => {
                      const slot = optimisedSlots[h] ?? {
                        hour: h,
                        localTier: 'LOCAL_OFF_PEAK',
                        illustrativeRatePerKwh: 3.4,
                        isOverloaded: false,
                        totalLoadKw: 35.0,
                      };

                      const isCriticalHour = h === 19;

                      return (
                        <div
                          key={h}
                          className={`p-2 rounded-lg border transition-all text-xs space-y-1 ${
                            isCriticalHour
                              ? 'bg-red-50 border-red-300 font-bold shadow-2xs'
                              : 'bg-white/80 border-slate-100 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-bold text-slate-800">
                              {String(h).padStart(2, '0')}:00
                            </span>
                            <span className="font-extrabold text-slate-900">
                              ₹{slot.illustrativeRatePerKwh.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-center">
                            {getTierPill(slot.localTier, slot.isOverloaded, true)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Advice Footer */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium leading-tight">
                  {period.advice}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIEW 2: TIER SUMMARY BANDS (VERTICAL CARDS) ── */}
      {viewMode === 'BANDS' && (
        <div className="space-y-3">
          {summaryBands.map((band, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                band.isCritical
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-400/20'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    {band.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${band.badgeClass}`}>
                    {band.badgeText}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {band.hoursRange}
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {band.description}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-medium block">Tariff Rate</span>
                <span className="text-lg font-black font-mono text-slate-900">
                  {band.rate}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Duration: {band.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── VIEW 3: FULL 24-HOUR VERTICAL TIMELINE LIST ── */}
      {viewMode === 'TABLE' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs border-b border-slate-200 z-10 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 w-28">Time Slot</th>
                  <th className="py-2.5 px-4 w-36">Demand Tier</th>
                  <th className="py-2.5 px-4 w-32 text-right">Rate (&#8377;/kWh)</th>
                  <th className="py-2.5 px-4">Grid Condition &amp; EV Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {optimisedSlots.map((slot) => {
                  const isPeak = slot.hour >= 18 && slot.hour <= 20;
                  const isCritical = slot.hour === 19;

                  return (
                    <tr
                      key={slot.hour}
                      className={`transition-colors ${
                        isCritical
                          ? 'bg-red-50/70 font-semibold'
                          : isPeak
                          ? 'bg-amber-50/40'
                          : slot.hour % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/40'
                      }`}
                    >
                      <td className="py-2 px-4 font-mono font-bold text-slate-800">
                        {String(slot.hour).padStart(2, '0')}:00 – {String(slot.hour + 1).padStart(2, '0')}:00
                      </td>
                      <td className="py-2 px-4">
                        {getTierPill(slot.localTier, slot.isOverloaded)}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-bold text-slate-900">
                        &#8377;{slot.illustrativeRatePerKwh.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-slate-600 text-[11px]">
                        {isCritical ? (
                          <span className="text-red-700 font-bold">
                            ⚠️ Transformer overload danger (122.8 kW uncoordinated peak). Smart schedule actively defers load.
                          </span>
                        ) : isPeak ? (
                          <span className="text-amber-800 font-medium">
                            ⚡ Evening peak demand period. Disincentivized charging window.
                          </span>
                        ) : slot.hour >= 0 && slot.hour <= 5 ? (
                          <span className="text-emerald-700 font-medium">
                            🌙 Super off-peak valley. Recommended window for full battery recharge.
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            ☀️ Normal operational baseline. Steady grid load.
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Legend Bar & Data Disclaimer ── */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-medium text-[11px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tiers:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Off-Peak (&#8377;3.40–&#8377;3.90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-700">Normal (&#8377;7.00)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700">Peak / Congested (&#8377;11.20)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-red-700 font-bold">Overload Hour (19:00)</span>
          </div>
        </div>

        {/* Mandatory Honest Data Disclaimer */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>Illustrative demand-responsive tariff model. Not an official DISCOM billing schedule.</span>
        </div>
      </div>
    </div>
  );
}
