import {
  Info,
  Moon,
  Sun,
  CloudSun,
  Zap,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function HourlyScheduleHeatmap() {
  const { solverOutput } = useSimulationStore();
  const { optimisedSlots } = solverOutput;

  // 4 continuous time-of-day periods (6 hours each) arranged vertically
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
      advice: 'Critical transformer overload danger zone (122.8 kW uncoordinated spike at 19:00).',
      accentColor: 'text-rose-600',
      isPeakGroup: true,
    },
  ];

  function getTierPill(tier: string, isOverloaded?: boolean) {
    if (isOverloaded || tier === 'LOCAL_OVERLOAD') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-700 border border-red-300 shadow-2xs whitespace-nowrap leading-none">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0 animate-pulse" />
          <span>Overload</span>
        </span>
      );
    }
    switch (tier) {
      case 'LOCAL_OFF_PEAK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/90 whitespace-nowrap leading-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Off-Peak</span>
          </span>
        );
      case 'LOCAL_NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200/90 whitespace-nowrap leading-none">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>Normal</span>
          </span>
        );
      case 'LOCAL_CONGESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap leading-none">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Peak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap leading-none">
            <span>Normal</span>
          </span>
        );
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* ── Header: Title, Description & Clean Live Badge (No extra switcher buttons) ── */}
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

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Feeder Schedule &middot; 24h Synchronized</span>
        </div>
      </div>

      {/* ── VERTICAL 4-PERIOD LAYOUT: 2x2 GRID (PERFECT ALIGNMENT, ZERO OVERLAP) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {periods.map((period) => {
          const PeriodIcon = period.icon;
          return (
            <div
              key={period.id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all ${period.bgClass}`}
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

                {/* Table Column Headers: Exactly Aligned with Rows */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2 border-b border-slate-200/50 mb-1.5">
                  <span className="w-16 text-left">Time</span>
                  <span className="w-24 text-center">Demand Tier</span>
                  <span className="w-20 text-center hidden sm:inline-block">Grid Load</span>
                  <span className="w-24 text-right">Tariff Rate</span>
                </div>

                {/* Hourly Rows: Fully Expanded, No Truncation or Overlap */}
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

      {/* ── Legend Bar & Data Disclaimer ── */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-medium text-[11px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tiers:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Off-Peak (₹3.40–₹3.90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-700">Normal (₹7.00)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700">Peak / Congested (₹11.20)</span>
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
