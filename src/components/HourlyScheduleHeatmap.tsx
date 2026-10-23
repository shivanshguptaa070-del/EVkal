import { Info } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function HourlyScheduleHeatmap() {
  const { solverOutput } = useSimulationStore();
  const { optimisedSlots } = solverOutput;

  const getTierColorClass = (tier: string) => {
    switch (tier) {
      case 'LOCAL_OFF_PEAK':
        return 'bg-emerald-100/80 text-emerald-800 border-emerald-200';
      case 'LOCAL_NORMAL':
        return 'bg-blue-100/80 text-blue-800 border-blue-200';
      case 'LOCAL_CONGESTED':
        return 'bg-amber-100/80 text-amber-800 border-amber-200';
      case 'LOCAL_OVERLOAD':
        return 'bg-red-100/90 text-red-800 border-red-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'LOCAL_OFF_PEAK':
        return 'Off-Peak';
      case 'LOCAL_NORMAL':
        return 'Normal';
      case 'LOCAL_CONGESTED':
        return 'Congested';
      case 'LOCAL_OVERLOAD':
        return 'Overload';
      default:
        return tier;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold tracking-tight text-slate-800">
          24-Hour Demand Tier &amp; Illustrative Tariff
        </h3>
        <span title="Dynamic Time-of-Use pricing based on transformer utilization" className="cursor-pointer">
          <Info className="h-4 w-4 text-slate-500 hover:text-slate-700 transition-colors" />
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <table className="min-w-full text-center border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold">
              <th className="py-1.5 px-2 text-left font-sans text-slate-700 min-w-[90px]">Hour</th>
              {optimisedSlots.map((slot) => (
                <th key={slot.hour} className="py-1.5 px-1 min-w-[32px] text-[11px]">
                  {String(slot.hour).padStart(2, '0')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Demand Tier Strip */}
            <tr className="border-b border-slate-100">
              <td className="py-2 px-2 text-left font-sans text-[11px] font-semibold text-slate-700">
                Demand Tier
              </td>
              {optimisedSlots.map((slot) => (
                <td key={slot.hour} className="p-0.5">
                  <div
                    className={`py-1 text-[9px] font-sans font-semibold rounded border ${getTierColorClass(
                      slot.localTier
                    )} truncate`}
                    title={`Hour ${slot.hour}: ${slot.localTier}`}
                  >
                    {getTierLabel(slot.localTier)[0]}
                  </div>
                </td>
              ))}
            </tr>

            {/* Illustrative Rate Strip */}
            <tr>
              <td className="py-2 px-2 text-left font-sans text-[11px] font-semibold text-slate-700">
                Rate (&#8377;/kWh)
              </td>
              {optimisedSlots.map((slot) => (
                <td key={slot.hour} className="py-1.5 px-0.5 text-[10px] text-slate-700 font-semibold">
                  {slot.illustrativeRatePerKwh.toFixed(1)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mandatory Honest Data Disclaimer from D02 / D04 */}
      <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1">
        <Info className="h-3.5 w-3.5 shrink-0 text-slate-600" />
        <span>
          Illustrative demand-responsive tariff model. Not an official DISCOM regulatory billing schedule.
        </span>
      </div>
    </div>
  );
}
