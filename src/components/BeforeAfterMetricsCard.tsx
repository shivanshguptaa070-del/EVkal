import { BarChart2, Shield, Clock, IndianRupee } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function BeforeAfterMetricsCard() {
  const { solverOutput } = useSimulationStore();
  const { summary } = solverOutput;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {/* 1. Peak Load Drop */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart2 className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-semibold block mb-0.5">Peak Load Drop</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-semibold block mb-0.5">Overload Avoided</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
            {summary.optimisedOverloadHours === 0 ? '100% Eliminated' : `${summary.optimisedOverloadHours}h Remaining`}
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">
            {summary.overloadEnergyAvoidedKwh.toFixed(1)} kWh saved
          </span>
        </div>
      </div>

      {/* 3. Critical Degradation Hours */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-semibold block mb-0.5">Critical Degradation Hours</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
            {summary.optimisedOverloadHours} Hours
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">
            in Danger Zone
          </span>
        </div>
      </div>

      {/* 4. Fleet Cost Savings */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <IndianRupee className="h-5 w-5" />
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-semibold block mb-0.5">Fleet Cost Savings</span>
          <div className="text-base font-black text-slate-900 tracking-tight font-mono leading-tight">
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
