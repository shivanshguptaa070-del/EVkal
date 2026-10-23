import { BarChart2, Shield, Clock, IndianRupee } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function BeforeAfterMetricsCard() {
  const { solverOutput } = useSimulationStore();
  const { summary } = solverOutput;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {/* 1. Peak Load Drop */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-200">
            <BarChart2 className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Peak Load Drop</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
            {summary.baselinePeakKw.toFixed(1)} kW &rarr; {summary.optimisedPeakKw.toFixed(1)} kW
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 w-fit">
            &darr; -{summary.peakReductionPct.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{summary.overloadEnergyAvoidedKwh.toFixed(1)} kWh saved</span>
        </div>
      </div>

      {/* 2. Overload Avoided */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <Shield className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Overload Avoided</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
            {summary.optimisedOverloadHours === 0 ? '100% Eliminated' : `${summary.optimisedOverloadHours}h Remaining`}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full w-fit ${summary.optimisedOverloadHours === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
            {summary.optimisedOverloadHours === 0 ? '✓ Safe' : '⚠ At Risk'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{summary.overloadEnergyAvoidedKwh.toFixed(1)} kWh saved</span>
        </div>
      </div>

      {/* 3. Critical Degradation Hours */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm shadow-amber-200">
            <Clock className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Critical Degradation</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
            {summary.optimisedOverloadHours} Hours
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 w-fit">
            in Danger Zone
          </span>
          <span className="text-[10px] text-slate-400">After optimization</span>
        </div>
      </div>

      {/* 4. Fleet Cost Savings */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-sm shadow-violet-200">
            <IndianRupee className="h-5 w-5 text-white" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Fleet Cost Savings</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
            &#8377;{summary.fleetSavingsInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 w-fit">
            &darr; -{summary.fleetSavingsPct.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400">vs. uncoordinated</span>
        </div>
      </div>
    </div>
  );
}
