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

  const data: ChartData<'line'> = {
    labels: hours,
    datasets: [
      {
        label: 'Baseline (Uncoordinated)',
        data: baselineLoads,
        borderColor: '#EF4444',
        borderWidth: 2.5,
        borderDash: [6, 4],
        pointRadius: (ctx) => (ctx.raw === maxBaseline ? 6 : 2),
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        tension: 0.35,
        fill: false,
      },
      {
        label: 'EVkal Optimized',
        data: optimisedLoads,
        borderColor: '#10B981',
        borderWidth: 2.5,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        pointRadius: (ctx) => (ctx.raw === maxOptimised ? 6 : 2),
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        tension: 0.35,
        fill: true,
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

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // Customized in JSX header for pixel-perfection matching screen 1
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
            return [
              '───────────────────────',
              `Background Load: ${bSlot.backgroundLoadKw.toFixed(1)} kW`,
              `EV Load (Baseline): ${bSlot.evChargingLoadKw.toFixed(1)} kW`,
              `EV Load (Optimised): ${optSlot.evChargingLoadKw.toFixed(1)} kW`,
              `Illustrative Rate: ₹${optSlot.illustrativeRatePerKwh.toFixed(2)} / kWh`,
              `Local Tier: ${optSlot.localTier.replace('LOCAL_', '')}`,
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
        max: Math.max(140, Math.ceil((maxBaseline + 10) / 20) * 20),
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
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
      {/* Chart Header & Inline Legend Matching screen 1 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-800">
            24-Hour Load Profile Comparison
          </h3>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-red-500 inline-block"></span>
            <span>Baseline (Uncoordinated)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-500 inline-block"></span>
            <span className="font-semibold text-emerald-700">EVkal Optimized</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-slate-600 inline-block"></span>
            <span className="text-slate-500">Rated Capacity ({capacity.toFixed(0)} kW)</span>
          </div>
        </div>
      </div>

      {/* Floating Peak Badges Overlay */}
      <div className="flex items-center gap-3 pt-1 text-xs font-mono">
        {maxBaseline > capacity && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-300 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
            Baseline Peak: {maxBaseline.toFixed(1)} kW (OVERLOAD ZONE)
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          Optimized Peak: {maxOptimised.toFixed(1)} kW (SAFE)
        </span>
      </div>

      {/* Canvas */}
      <div className="h-64 md:h-72 w-full pt-1">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
