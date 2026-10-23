import { TrendingDown, ShieldCheck, AlertOctagon, IndianRupee } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function BeforeAfterMetricsCard() {
  const { solverOutput } = useSimulationStore();
  const { summary } = solverOutput;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Peak Load Drop */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingDown className="h-4 w-4" />
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800">
            &darr; {summary.peakReductionPct.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Peak Load Drop</span>
          <div className="text-base font-extrabold text-slate-900 tracking-tight font-mono-numbers">
            {summary.baselinePeakKw.toFixed(1)} kW &rarr; {summary.optimisedPeakKw.toFixed(1)} kW
          </div>
        </div>
      </div>

      {/* 2. Overload Avoided */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Overload Avoided</span>
          <div className="text-base font-extrabold text-slate-900 tracking-tight font-mono-numbers">
            {summary.optimisedOverloadHours === 0 ? '100% Eliminated' : `${summary.optimisedOverloadHours}h Remaining`}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 font-mono-numbers">
            {summary.overloadEnergyAvoidedKwh.toFixed(1)} kWh saved
          </span>
        </div>
      </div>

      {/* 3. Critical Degradation Hours */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertOctagon className="h-4 w-4" />
          </div>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Critical Degradation Hours</span>
          <div className="text-base font-extrabold text-slate-900 tracking-tight font-mono-numbers">
            {summary.optimisedOverloadHours} Hours
          </div>
          <span className="text-[11px] font-semibold text-slate-500">in Danger Zone</span>
        </div>
      </div>

      {/* 4. Fleet Cost Savings */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <IndianRupee className="h-4 w-4" />
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800">
            &darr; {summary.fleetSavingsPct.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Fleet Cost Savings</span>
          <div className="text-base font-extrabold text-slate-900 tracking-tight font-mono-numbers">
            &#8377;{summary.fleetSavingsInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
