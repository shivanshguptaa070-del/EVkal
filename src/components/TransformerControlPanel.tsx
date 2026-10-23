import { Home, Zap } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function TransformerControlPanel() {
  const { transformerConfig, setTransformerCapacity, solverOutput, activeScenario } = useSimulationStore();

  const capacity = transformerConfig.ratedCapacityKw;
  const safetyMarginKw = (capacity * 0.9).toFixed(1);

  const activeSlots =
    activeScenario === 'EVENING_RUSH' ? solverOutput.baselineSlots : solverOutput.optimisedSlots;
  const peakSlot = activeSlots.reduce((max, s) => (s.totalLoadKw > max.totalLoadKw ? s : max), activeSlots[0]);
  const utilizationPct = peakSlot.utilisationPct;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(utilizationPct, 150) / 100) * circumference;

  let gaugeColor = '#10B981';
  let textColor = 'text-emerald-600';
  let statusBg = 'bg-emerald-50';
  let statusBorder = 'border-emerald-200';
  let statusText = 'text-emerald-700';
  let statusDot = 'bg-emerald-500';
  let statusLabel = 'Normal';

  if (utilizationPct > 100.0) {
    gaugeColor = '#EF4444';
    textColor = 'text-red-600';
    statusBg = 'bg-red-50';
    statusBorder = 'border-red-200';
    statusText = 'text-red-700';
    statusDot = 'bg-red-500';
    statusLabel = 'Overload Risk';
  } else if (utilizationPct >= 75.0) {
    gaugeColor = '#F59E0B';
    textColor = 'text-amber-600';
    statusBg = 'bg-amber-50';
    statusBorder = 'border-amber-200';
    statusText = 'text-amber-700';
    statusDot = 'bg-amber-500';
    statusLabel = 'High Load';
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold tracking-tight text-slate-800 flex items-center gap-2">
        <span className="h-5 w-5 rounded bg-emerald-100 flex items-center justify-center">
          <Zap className="h-3 w-3 text-emerald-600" />
        </span>
        1. Transformer Capacity &amp; Feeder Settings
      </h3>

      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-4">
        {/* Capacity Readout & Safety Margin */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-0.5">Transformer Capacity</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {capacity.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-slate-500">kW</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block mb-0.5">Safety Margin (90%)</span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-lg font-bold text-slate-700 font-mono">{safetyMarginKw}</span>
              <span className="text-xs font-semibold text-slate-500">kW</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBg} ${statusBorder} ${statusText}`}>
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${statusDot}`} />
            {statusLabel} &mdash; {utilizationPct.toFixed(1)}% utilization
          </span>
        </div>

        {/* Capacity Slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={capacity}
            onChange={(e) => setTransformerCapacity(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            aria-label="Transformer Capacity Slider"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500 font-medium">
            <span>50 kW</span>
            <span>200 kW</span>
          </div>
        </div>

        {/* Bottom Split: Homes Count & Circular Utilization Ring */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Connected Residential Homes</span>
              <span className="text-sm font-bold text-slate-900">{transformerConfig.connectedHomesCount} homes</span>
            </div>
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative flex items-center justify-center w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.35s ease, stroke 0.35s ease', filter: `drop-shadow(0 0 4px ${gaugeColor}88)` }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-xs font-black tracking-tighter font-mono ${textColor}`}>
                {utilizationPct.toFixed(1)}%
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Utilization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
