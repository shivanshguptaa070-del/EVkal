import { CircleDollarSign, PiggyBank, Receipt, Sparkles } from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';

export function Page4TariffEconomics() {
  const { solverOutput } = useSimulationStore();
  const { summary, optimisedSlots } = solverOutput;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold font-mono mb-2">
            <CircleDollarSign className="h-3.5 w-3.5 text-purple-600" />
            <span>P0 MODULE 04</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Demand-Responsive Tariff &amp; Economics
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Dynamic Time-of-Use pricing, bill reductions, and transformer capacity deferral savings.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
          <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">Total Fleet Savings</span>
          <span className="text-2xl font-black text-emerald-700 font-mono">
            &#8377;{summary.fleetSavingsInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-800 block font-semibold mt-0.5">
            &darr; {summary.fleetSavingsPct.toFixed(1)}% bill reduction
          </span>
        </div>
      </div>

      {/* Economics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Receipt className="h-5 w-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Uncoordinated Baseline Bill</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            &#8377;{(summary.fleetSavingsInr / (summary.fleetSavingsPct / 100)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-slate-500">Charging immediately during peak tariff hours (₹11.20/kWh).</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PiggyBank className="h-5 w-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">EVkal Optimized Bill</span>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            &#8377;{((summary.fleetSavingsInr / (summary.fleetSavingsPct / 100)) - summary.fleetSavingsInr).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-slate-500">Valley-shifted overnight to off-peak tariff (₹3.35/kWh).</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">DISCOM CapEx Deferral</span>
          <div className="text-2xl font-black text-blue-700 font-mono">
            &#8377;4.50 Lakhs
          </div>
          <p className="text-xs text-slate-500">Avoids immediate substation transformer upgrade expenditure.</p>
        </div>
      </div>

      {/* Hourly Pricing & Rate Schedule Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          24-Hour Tariff Matrix &amp; Demand Classification
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Hour</th>
                <th className="py-2.5 px-3">Demand Tier</th>
                <th className="py-2.5 px-3 text-right">Illustrative Tariff (&#8377;/kWh)</th>
                <th className="py-2.5 px-3 text-right">Transformer Load (kW)</th>
                <th className="py-2.5 px-3 text-right">EV Charging (kW)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {optimisedSlots.map((slot) => {
                const tierName = slot.localTier.replace('LOCAL_', '');
                const isPeak = tierName === 'CONGESTED' || tierName === 'OVERLOAD';
                return (
                  <tr key={slot.hour} className={isPeak ? 'bg-amber-50/30' : 'hover:bg-slate-50/60'}>
                    <td className="py-2 px-3 font-bold text-slate-800">{String(slot.hour).padStart(2, '0')}:00</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tierName === 'OFF_PEAK'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tierName === 'NORMAL'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {tierName}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">&#8377;{slot.illustrativeRatePerKwh.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-slate-600">{slot.totalLoadKw.toFixed(1)} kW</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">{slot.evChargingLoadKw.toFixed(1)} kW</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
