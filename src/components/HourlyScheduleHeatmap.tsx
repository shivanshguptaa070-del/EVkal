import { Info } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function HourlyScheduleHeatmap() {
  const { solverOutput } = useSimulationStore();
  const { optimisedSlots } = solverOutput;

  // Group consecutive hours with identical tier into clean span blocks
  interface TierSpan {
    label: string;
    startHour: number;
    colSpan: number;
    colorClass: string;
  }

  const tierSpans: TierSpan[] = [];
  if (optimisedSlots.length > 0) {
    let currentSpan: TierSpan = {
      label: getFriendlyTierLabel(optimisedSlots[0].localTier),
      startHour: 0,
      colSpan: 1,
      colorClass: getTierColorClass(optimisedSlots[0].localTier),
    };

    for (let i = 1; i < optimisedSlots.length; i++) {
      const slot = optimisedSlots[i];
      const friendlyLabel = getFriendlyTierLabel(slot.localTier);

      if (friendlyLabel === currentSpan.label) {
        currentSpan.colSpan += 1;
      } else {
        tierSpans.push(currentSpan);
        currentSpan = {
          label: friendlyLabel,
          startHour: i,
          colSpan: 1,
          colorClass: getTierColorClass(slot.localTier),
        };
      }
    }
    tierSpans.push(currentSpan);
  }

  function getFriendlyTierLabel(tier: string): string {
    switch (tier) {
      case 'LOCAL_OFF_PEAK':
        return 'Off-Peak';
      case 'LOCAL_NORMAL':
        return 'Normal';
      case 'LOCAL_CONGESTED':
      case 'LOCAL_OVERLOAD':
        return 'Peak / Congested';
      default:
        return 'Normal';
    }
  }

  function getTierColorClass(tier: string): string {
    switch (tier) {
      case 'LOCAL_OFF_PEAK':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200/80';
      case 'LOCAL_NORMAL':
        return 'bg-blue-100 text-blue-800 border-blue-200/80';
      case 'LOCAL_CONGESTED':
      case 'LOCAL_OVERLOAD':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Title with Info icon */}
      <div className="flex items-center gap-2">
        <h3 className="text-base font-bold tracking-tight text-slate-800">
          24-Hour Demand Tier &amp; Illustrative Tariff
        </h3>
        <span
          title="Dynamic demand-responsive tariff bands classified per hour"
          className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Info className="h-4 w-4" />
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <table className="w-full min-w-[620px] text-center border-collapse text-xs font-mono table-fixed">
          <thead>
            <tr className="border-b border-slate-200/80 text-slate-600 font-bold">
              <th className="py-2 px-2 text-left font-sans text-slate-700 w-24 text-xs">
                Hour
              </th>
              {optimisedSlots.map((slot) => (
                <th key={slot.hour} className="py-2 px-0 text-[10px] font-mono text-slate-600">
                  {String(slot.hour).padStart(2, '0')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Continuous Grouped Demand Tier Blocks */}
            <tr className="border-b border-slate-100">
              <td className="py-2.5 px-2 text-left font-sans text-xs font-bold text-slate-700">
                Demand Tier
              </td>
              {tierSpans.map((span, idx) => (
                <td
                  key={idx}
                  colSpan={span.colSpan}
                  className="p-0.5"
                >
                  <div
                    className={`py-1.5 px-1 text-[10px] font-sans font-semibold rounded-lg border text-center shadow-2xs truncate ${span.colorClass}`}
                    title={`${span.label} (Hours ${span.startHour}:00 - ${span.startHour + span.colSpan - 1}:00)`}
                  >
                    {span.label}
                  </div>
                </td>
              ))}
            </tr>

            {/* Illustrative Rate Strip (₹/kWh) */}
            <tr>
              <td className="py-2 px-2 text-left font-sans text-xs font-bold text-slate-700">
                Rate (&#8377;/kWh)
              </td>
              {optimisedSlots.map((slot) => (
                <td
                  key={slot.hour}
                  className="py-2 px-0 text-[10px] text-slate-600 font-mono font-medium"
                >
                  {slot.illustrativeRatePerKwh.toFixed(1)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mandatory Honest Data Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="h-4 w-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Info className="h-2.5 w-2.5" />
        </div>
        <span>
          Illustrative demand-responsive tariff model. Not an official DISCOM billing schedule.
        </span>
      </div>
    </div>
  );
}
