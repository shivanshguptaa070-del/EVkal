import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSimulationStore } from '../store/useSimulationStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function DualCurveLoadChart() {
  const { solverOutput, transformerConfig } = useSimulationStore();
  const { baselineSlots, optimisedSlots } = solverOutput;
  const capacity = transformerConfig.ratedCapacityKw;

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

  const baselineLoads = baselineSlots.map((s) => s.totalLoadKw);
  const optimisedLoads = optimisedSlots.map((s) => s.totalLoadKw);
  const capacityLine = new Array(24).fill(capacity);

  // Compute peak indices
  const maxBaseline = Math.max(...baselineLoads);
  const maxOptimised = Math.max(...optimisedLoads);
  const peakHourIndex = baselineLoads.indexOf(maxBaseline);

  const data: ChartData<'line'> = {
    labels: hours,
    datasets: [
      {
        label: 'Baseline (Uncoordinated)',
        data: baselineLoads,
        borderColor: '#EF4444',
        borderWidth: 2.2,
        borderDash: [6, 4],
        pointRadius: (ctx) => (ctx.dataIndex === peakHourIndex ? 6 : 2),
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        tension: 0.35,
        // Crimson fill in the overload zone (between baseline and rated capacity line at index 2)
        fill: {
          target: 2,
          above: 'rgba(239, 68, 68, 0.18)',
          below: 'transparent',
        },
      },
      {
        label: 'EVkal Optimized',
        data: optimisedLoads,
        borderColor: '#10B981',
        borderWidth: 2.5,
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        pointRadius: (ctx) => (ctx.dataIndex === peakHourIndex ? 6 : 2),
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        tension: 0.35,
        fill: 'origin',
      },
      {
        label: `Rated Capacity (${capacity.toFixed(0)} kW)`,
        data: capacityLine,
        borderColor: '#475569',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  // Custom Chart Plugin for Callout Badges and Labels matching the mockup
  const calloutsPlugin: Plugin<'line'> = {
    id: 'peakCallouts',
    afterDatasetsDraw(chart) {
      const { ctx, scales } = chart;
      const x = scales.x;
      const y = scales.y;
      if (!x || !y) return;

      const xPos = x.getPixelForValue(peakHourIndex >= 0 ? peakHourIndex : 19);
      const yBase = y.getPixelForValue(maxBaseline);
      const yOpt = y.getPixelForValue(maxOptimised);
      const yCap = y.getPixelForValue(capacity);

      ctx.save();

      // 1. OVERLOAD ZONE text & Rated Capacity label
      if (maxBaseline > capacity) {
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('OVERLOAD ZONE', xPos + 32, yCap - 18);

        ctx.fillStyle = '#475569';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.fillText(`Rated Capacity (${capacity.toFixed(0)} kW)`, xPos + 32, yCap + 14);

        // Red 122.8 kW Badge
        const baseBadge = `${maxBaseline.toFixed(1)} kW`;
        ctx.font = 'bold 11px monospace';
        const baseW = ctx.measureText(baseBadge).width + 16;
        const baseH = 22;
        const baseX = xPos + 8;
        const baseY = yBase - baseH / 2;

        ctx.fillStyle = '#EF4444';
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(baseX, baseY, baseW, baseH, 11);
          ctx.fill();
        } else {
          ctx.fillRect(baseX, baseY, baseW, baseH);
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(baseBadge, baseX + baseW / 2, baseY + baseH / 2);
      }

      // Green 79.2 kW Badge
      const optBadge = `${maxOptimised.toFixed(1)} kW`;
      ctx.font = 'bold 11px monospace';
      const optW = ctx.measureText(optBadge).width + 16;
      const optH = 22;
      const optX = xPos + 8;
      const optY = yOpt - optH / 2;

      ctx.fillStyle = '#10B981';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(optX, optY, optW, optH, 11);
        ctx.fill();
      } else {
        ctx.fillRect(optX, optY, optW, optH);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(optBadge, optX + optW / 2, optY + optH / 2);

      ctx.restore();
    },
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        borderColor: 'rgba(51, 65, 85, 0.8)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        cornerRadius: 8,
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          weight: 'bold',
          size: 13,
        },
        bodyFont: {
          family: "'JetBrains Mono', monospace",
          size: 11,
        },
        callbacks: {
          title: (items) => `${items[0].label}:00 IST`,
          label: (context) => {
            const val = Number(context.raw).toFixed(1);
            return ` ${context.dataset.label}: ${val} kW`;
          },
          afterBody: (items) => {
            const h = items[0].dataIndex;
            const bSlot = baselineSlots[h];
            const optSlot = optimisedSlots[h];
            const rateStr = optSlot.illustrativeRatePerKwh.toFixed(2);
            const tierName = optSlot.localTier.replace('LOCAL_', '');
            return [
              '───────────────────────',
              `Background Load: ${bSlot.backgroundLoadKw.toFixed(1)} kW`,
              `EV Load: ${bSlot.evChargingLoadKw.toFixed(1)} kW`,
              `Demand Tier: ${tierName} (₹${rateStr}/kWh)`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          font: {
            family: "'JetBrains Mono', monospace",
            size: 10,
          },
          color: '#64748B',
          callback: (_, index) => (index % 2 === 0 ? String(index).padStart(2, '0') : ''),
        },
        title: {
          display: true,
          text: 'Hour of Day',
          color: '#64748B',
          font: { size: 11, weight: 'bold' },
        },
      },
      y: {
        min: 0,
        max: Math.max(140, Math.ceil((maxBaseline + 15) / 20) * 20),
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          stepSize: 20,
          font: {
            family: "'JetBrains Mono', monospace",
            size: 10,
          },
          color: '#64748B',
          callback: (value) => `${value} kW`,
        },
      },
    },
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
      {/* Chart Header & Inline Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-800">
            24-Hour Load Profile Comparison
          </h3>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-red-500 inline-block"></span>
            <span>Baseline (Uncoordinated)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-emerald-500 inline-block"></span>
            <span className="font-semibold text-emerald-700">EVkal Optimized</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 border-t border-dashed border-slate-500 inline-block"></span>
            <span className="text-slate-500">Rated Capacity ({capacity.toFixed(0)} kW)</span>
          </div>
        </div>
      </div>

      {/* Floating Peak Badges */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
        {maxBaseline > capacity && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-300 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
            Baseline Peak: {maxBaseline.toFixed(1)} kW (OVERLOAD ZONE)
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          Optimized Peak: {maxOptimised.toFixed(1)} kW (SAFE)
        </span>
      </div>

      {/* Canvas */}
      <div className="h-72 md:h-80 w-full pt-1">
        <Line data={data} options={options} plugins={[calloutsPlugin]} />
      </div>
    </div>
  );
}
