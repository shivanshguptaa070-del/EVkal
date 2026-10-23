import { BarChart2, Shield, Clock, IndianRupee } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function BeforeAfterMetricsCard() {
  const { solverOutput } = useSimulationStore();
  const { summary } = solverOutput;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Peak Load Drop */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <BarChart2 className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Peak Load Drop</span>
          <div className="text-lg font-black text-slate-900 tracking-tight font-mono-numbers">
            {summary.baselinePeakKw.toFixed(1)} kW &rarr; {summary.optimisedPeakKw.toFixed(1)} kW
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            &darr; -{summary.peakReductionPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 2. Overload Avoided */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Overload Avoided</span>
          <div className="text-lg font-black text-slate-900 tracking-tight font-mono-numbers">
            {summary.optimisedOverloadHours === 0 ? '100% Eliminated' : `${summary.optimisedOverloadHours}h Remaining`}
          </div>
        </div>
        <div className="text-xs font-medium text-slate-500 font-mono-numbers">
          {summary.overloadEnergyAvoidedKwh.toFixed(1)} kWh saved
        </div>
      </div>

      {/* 3. Critical Degradation Hours */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Critical Degradation Hours</span>
          <div className="text-lg font-black text-slate-900 tracking-tight font-mono-numbers">
            {summary.optimisedOverloadHours} Hours
          </div>
        </div>
        <div className="text-xs font-medium text-slate-500">
          in Danger Zone
        </div>
      </div>

      {/* 4. Fleet Cost Savings */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <IndianRupee className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-1">Fleet Cost Savings</span>
          <div className="text-lg font-black text-slate-900 tracking-tight font-mono-numbers">
            &#8377;{summary.fleetSavingsInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            &darr; -{summary.fleetSavingsPct.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
