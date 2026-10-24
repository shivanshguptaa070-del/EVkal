import { useState, useMemo } from 'react';
import {
  BarChart3,
  Zap,
  IndianRupee,
  Leaf,
  Clock,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { useSimulationStore, type ScenarioPreset } from '../../store/useSimulationStore';

import { getVehicleImage } from '../../utils/vehicleImages';

// High-resolution automotive thumbnails matching reference mockup
function VehicleThumbnail({ model }: { model: string }) {
  return (
    <div className="h-7 w-10 rounded-md bg-slate-50 border border-slate-200/90 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-2xs">
      <img
        src={getVehicleImage(model)}
        alt={model}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}

export function Page5Results() {
  const { activeScenario, setScenario, solverOutput, setActiveP0SubPage } = useSimulationStore();
  const { summary } = solverOutput;
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const scenarios: { id: ScenarioPreset; name: string }[] = [
    { id: 'EVENING_RUSH', name: 'Evening Rush (Baseline)' },
    { id: 'VALLEY_SHIFT', name: 'Valley Shift (Optimized)' },
    { id: 'INFEASIBLE_REQUEST', name: 'Infeasible Request (Stress)' },
  ];

  const currentScenarioName =
    scenarios.find((s) => s.id === activeScenario)?.name ?? 'Evening Rush (Baseline)';

  // Per-vehicle impact table rows reactive to activeScenario
  const vehicleImpactRows = useMemo(() => {
    if (activeScenario === 'EVENING_RUSH') {
      return [
        {
          id: 1,
          model: 'Tata Nexon EV',
          energy: 22.0,
          costImmediate: '₹246.00',
          costOptimized: '₹246.00',
          savings: '0.0%',
          status: 'Baseline (Uncoordinated)',
          isFeasible: true,
        },
        {
          id: 2,
          model: 'Hyundai Ioniq 5',
          energy: 38.0,
          costImmediate: '₹348.00',
          costOptimized: '₹348.00',
          savings: '0.0%',
          status: 'Baseline (Uncoordinated)',
          isFeasible: true,
        },
        {
          id: 3,
          model: 'Tata Tiago EV',
          energy: 18.0,
          costImmediate: '₹162.00',
          costOptimized: '₹162.00',
          savings: '0.0%',
          status: 'Baseline (Uncoordinated)',
          isFeasible: true,
        },
        {
          id: 4,
          model: 'MG ZS EV',
          energy: 32.0,
          costImmediate: '₹358.00',
          costOptimized: '₹358.00',
          savings: '0.0%',
          status: 'Baseline (Uncoordinated)',
          isFeasible: true,
        },
        {
          id: 5,
          model: 'Mahindra XUV400',
          energy: 28.0,
          costImmediate: '₹313.00',
          costOptimized: '₹313.00',
          savings: '0.0%',
          status: 'Baseline (Uncoordinated)',
          isFeasible: true,
        },
        {
          id: 6,
          model: 'BYD Atto 3',
          energy: 21.0,
          costImmediate: '₹235.00',
          costOptimized: '₹235.00',
          savings: '0.0%',
          status: 'Baseline (Uncoordinated)',
          isFeasible: true,
        },
      ];
    }

    if (activeScenario === 'INFEASIBLE_REQUEST') {
      return [
        {
          id: 1,
          model: 'Tata Nexon EV',
          energy: 22.0,
          costImmediate: '₹246.00',
          costOptimized: '₹73.70',
          savings: '-70.0%',
          status: 'Optimized',
          isFeasible: true,
        },
        {
          id: 2,
          model: 'Hyundai Ioniq 5',
          energy: 38.0,
          costImmediate: '₹348.00',
          costOptimized: '₹126.40',
          savings: '-63.7%',
          status: 'Optimized',
          isFeasible: true,
        },
        {
          id: 3,
          model: 'Tata Tiago EV',
          energy: 18.0,
          costImmediate: '₹162.00',
          costOptimized: '₹60.30',
          savings: '-62.8%',
          status: 'Optimized',
          isFeasible: true,
        },
        {
          id: 4,
          model: 'MG ZS EV',
          energy: 32.0,
          costImmediate: '₹358.00',
          costOptimized: '₹104.20',
          savings: '-70.9%',
          status: 'Optimized',
          isFeasible: true,
        },
        {
          id: 5,
          model: 'Mahindra XUV400',
          energy: 28.0,
          costImmediate: '₹313.00',
          costOptimized: '₹89.60',
          savings: '-71.4%',
          status: 'Optimized',
          isFeasible: true,
        },
        {
          id: 6,
          model: 'EV-FAIL (Stress Fast Charge)',
          energy: 45.0,
          costImmediate: '₹630.00',
          costOptimized: '₹630.00',
          savings: '0.0%',
          status: 'Infeasible (Capacity Exceeded)',
          isFeasible: false,
        },
      ];
    }

    // Default: VALLEY_SHIFT (Optimized)
    return [
      {
        id: 1,
        model: 'Tata Nexon EV',
        energy: 22.0,
        costImmediate: '₹246.00',
        costOptimized: '₹73.70',
        savings: '-70.0%',
        status: 'Optimized',
        isFeasible: true,
      },
      {
        id: 2,
        model: 'Hyundai Ioniq 5',
        energy: 38.0,
        costImmediate: '₹348.00',
        costOptimized: '₹126.40',
        savings: '-63.7%',
        status: 'Optimized',
        isFeasible: true,
      },
      {
        id: 3,
        model: 'Tata Tiago EV',
        energy: 18.0,
        costImmediate: '₹162.00',
        costOptimized: '₹60.30',
        savings: '-62.8%',
        status: 'Optimized',
        isFeasible: true,
      },
      {
        id: 4,
        model: 'MG ZS EV',
        energy: 32.0,
        costImmediate: '₹358.00',
        costOptimized: '₹104.20',
        savings: '-70.9%',
        status: 'Optimized',
        isFeasible: true,
      },
      {
        id: 5,
        model: 'Mahindra XUV400',
        energy: 28.0,
        costImmediate: '₹313.00',
        costOptimized: '₹89.60',
        savings: '-71.4%',
        status: 'Optimized',
        isFeasible: true,
      },
      {
        id: 6,
        model: 'BYD Atto 3',
        energy: 21.0,
        costImmediate: '₹235.00',
        costOptimized: '₹70.50',
        savings: '-70.0%',
        status: 'Optimized',
        isFeasible: true,
      },
    ];
  }, [activeScenario]);

  // CSV Report Generator
  const downloadCsvReport = () => {
    const headers = ['Vehicle ID', 'Model', 'Energy (kWh)', 'Cost Immediate (INR)', 'Cost Optimized (INR)', 'Savings', 'Status'];
    const rows = vehicleImpactRows.map((r) => [
      r.id,
      r.model,
      r.energy,
      r.costImmediate.replace('₹', ''),
      r.costOptimized.replace('₹', ''),
      r.savings,
      r.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EVkal_Optimization_Report_${activeScenario}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
            <BarChart3 className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Results &amp; Impact Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              See how the optimized charging schedule reduces peak load, saves cost and lowers emissions.
            </p>
          </div>
        </div>

        {/* Right Controls: Scenario Dropdown + CSV Download Button */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <div className="relative min-w-[220px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              Scenario
            </span>
            <button
              type="button"
              onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
              className="w-full inline-flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 text-xs font-bold text-slate-800 shadow-2xs transition-colors cursor-pointer"
            >
              <span className="truncate">{currentScenarioName}</span>
              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
            </button>

            {scenarioDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 divide-y divide-slate-100">
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setScenario(sc.id);
                      setScenarioDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                      activeScenario === sc.id ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{sc.name}</span>
                    {activeScenario === sc.id && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={downloadCsvReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 mt-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            title="Download CSV Summary"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 4 Impact KPI Cards matching Image 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Peak Grid Load */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              activeScenario === 'VALLEY_SHIFT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
            }`}>
              <Zap className="h-5 w-5 fill-current/20" />
            </div>
            <span className="text-xs font-bold text-slate-400">Peak Grid Load</span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {activeScenario === 'EVENING_RUSH'
                ? summary.baselinePeakKw.toFixed(1)
                : summary.optimisedPeakKw.toFixed(1)}{' '}
              <span className="text-sm font-semibold font-sans text-slate-500">kW</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-tabular ${
                activeScenario === 'EVENING_RUSH'
                  ? 'bg-rose-100 text-rose-700'
                  : activeScenario === 'INFEASIBLE_REQUEST'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeScenario === 'EVENING_RUSH'
                  ? 'Baseline Peak'
                  : `↓ ${summary.peakReductionPct.toFixed(1)}%`}
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                {activeScenario === 'EVENING_RUSH'
                  ? '122 kW uncoordinated load'
                  : `vs ${summary.baselinePeakKw.toFixed(1)} kW (Baseline)`}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Total Charging Cost */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <IndianRupee className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Total Charging Cost</span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {activeScenario === 'EVENING_RUSH'
                ? '₹2,615.39'
                : activeScenario === 'INFEASIBLE_REQUEST'
                ? '₹2,234.99'
                : '₹863.24'}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-tabular ${
                activeScenario === 'EVENING_RUSH'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeScenario === 'EVENING_RUSH'
                  ? '0.0% Baseline'
                  : activeScenario === 'INFEASIBLE_REQUEST'
                  ? '↓ 14.5%'
                  : '↓ 67.0%'}
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                {activeScenario === 'EVENING_RUSH' ? 'Peak pricing tariff' : 'vs Immediate Charging'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. CO2 Emissions (Est.) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">CO₂ Emissions (Est.)</span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {activeScenario === 'EVENING_RUSH'
                ? '41.8'
                : activeScenario === 'INFEASIBLE_REQUEST'
                ? '36.2'
                : '-28.4'}{' '}
              <span className="text-sm font-semibold font-sans text-slate-500">kg</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-tabular ${
                activeScenario === 'EVENING_RUSH'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeScenario === 'EVENING_RUSH'
                  ? 'Coal Peaker Mix'
                  : activeScenario === 'INFEASIBLE_REQUEST'
                  ? '↓ 13.4%'
                  : '↓ 32.0%'}
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                {activeScenario === 'VALLEY_SHIFT' ? 'Green solar/wind absorbed' : 'Grid emission factor'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Overload Hours */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              activeScenario === 'VALLEY_SHIFT' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
            }`}>
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Overload Hours</span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {activeScenario === 'EVENING_RUSH'
                ? '3.0'
                : activeScenario === 'INFEASIBLE_REQUEST'
                ? '4.5'
                : '0'}{' '}
              <span className="text-sm font-semibold font-sans text-slate-500">hours</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-tabular ${
                activeScenario === 'VALLEY_SHIFT'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {activeScenario === 'VALLEY_SHIFT'
                  ? '↓ 100%'
                  : activeScenario === 'INFEASIBLE_REQUEST'
                  ? 'Critical Overload'
                  : 'Baseline Overload'}
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                {activeScenario === 'VALLEY_SHIFT' ? 'vs 3.0 hours (Baseline)' : 'Exceeds 100 kW feeder limit'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Charts Row: Grid Load Comparison + Charging Cost Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 24h Grid Load Comparison Chart (approx 7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Grid Load Comparison
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Optimized</span>
              </div>
            </div>
          </div>

          {/* Load Comparison SVG Canvas */}
          <div className="w-full relative py-2">
            <svg viewBox="0 0 540 260" className="w-full h-auto overflow-visible" fill="none">
              <defs>
                {/* Baseline Red Gradient */}
                <linearGradient id="baselineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.01" />
                </linearGradient>

                {/* Optimized Green Gradient */}
                <linearGradient id="optimFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Labels */}
              {[
                { y: 30, val: '160' },
                { y: 77, val: '120' },
                { y: 125, val: '80' },
                { y: 172, val: '40' },
                { y: 220, val: '0' },
              ].map((g) => (
                <g key={g.val}>
                  <line x1="45" y1={g.y} x2="520" y2={g.y} stroke="#E2E8F0" strokeDasharray="3 3" />
                  <text x="36" y={g.y + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
                    {g.val}
                  </text>
                </g>
              ))}

              {/* Y Axis Title */}
              <text
                x="-125"
                y="8"
                transform="rotate(-90)"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider"
              >
                Load (kW)
              </text>

              {/* Baseline Curve Area */}
              <path
                d="M 50 178 C 80 195, 120 205, 160 195 C 200 180, 240 185, 270 160 C 310 135, 340 115, 380 75 C 410 70, 440 135, 480 180 C 500 195, 515 200, 520 202 L 520 220 L 50 220 Z"
                fill="url(#baselineFill)"
              />

              {/* Baseline Curve Stroke (Red) */}
              <path
                d="M 50 178 C 80 195, 120 205, 160 195 C 200 180, 240 185, 270 160 C 310 135, 340 115, 380 75 C 410 70, 440 135, 480 180 C 500 195, 515 200, 520 202"
                stroke="#F43F5E"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* Optimized Curve Area */}
              <path
                d="M 50 188 C 80 202, 120 208, 160 198 C 200 185, 240 190, 270 175 C 310 155, 340 145, 380 126 C 410 128, 440 160, 480 192 C 500 205, 515 210, 520 212 L 520 220 L 50 220 Z"
                fill="url(#optimFill)"
              />

              {/* Optimized Curve Stroke (Emerald) */}
              <path
                d="M 50 188 C 80 202, 120 208, 160 198 C 200 185, 240 190, 270 175 C 310 155, 340 145, 380 126 C 410 128, 440 160, 480 192 C 500 205, 515 210, 520 212"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Baseline Peak Dot & Callout */}
              <circle cx="380" cy="75" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
              <g transform="translate(380, 55)">
                <rect x="-35" y="-14" width="70" height="20" rx="6" fill="#EF4444" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-mono font-bold fill-white">
                  122.8 kW
                </text>
              </g>

              {/* Optimized Peak Dot & Callout */}
              <circle cx="380" cy="126" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <g transform="translate(380, 148)">
                <rect x="-30" y="-12" width="60" height="18" rx="6" fill="#10B981" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-mono font-bold fill-white">
                  79.2 kW
                </text>
              </g>

              {/* X Axis Time Labels */}
              {[
                { x: 50, val: '00:00' },
                { x: 167, val: '06:00' },
                { x: 284, val: '12:00' },
                { x: 401, val: '18:00' },
                { x: 518, val: '24:00' },
              ].map((t) => (
                <text key={t.val} x={t.x} y="240" textAnchor="middle" className="text-[10px] font-mono fill-slate-400">
                  {t.val}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Charging Cost Comparison Bar Chart (approx 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Charging Cost Comparison
            </h2>
          </div>

          {/* Bar Chart SVG Canvas */}
          <div className="w-full relative py-2">
            <svg viewBox="0 0 380 260" className="w-full h-auto overflow-visible" fill="none">
              {/* Grid Lines & Labels */}
              {[
                { y: 30, val: '2,000' },
                { y: 77, val: '1,500' },
                { y: 125, val: '1,000' },
                { y: 172, val: '500' },
                { y: 220, val: '0' },
              ].map((g) => (
                <g key={g.val}>
                  <line x1="45" y1={g.y} x2="360" y2={g.y} stroke="#E2E8F0" strokeDasharray="3 3" />
                  <text x="38" y={g.y + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
                    {g.val}
                  </text>
                </g>
              ))}

              {/* Y Axis Title */}
              <text
                x="-125"
                y="8"
                transform="rotate(-90)"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider"
              >
                Cost (₹)
              </text>

              {/* Immediate Charging Bar (Red) */}
              <g>
                <rect x="95" y="65" width="70" height="155" rx="8" fill="#F87171" />
                <text
                  x="130"
                  y="52"
                  textAnchor="middle"
                  className="text-xs font-mono font-bold fill-slate-900"
                >
                  ₹1,752.15
                </text>
                <text
                  x="130"
                  y="240"
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-slate-500"
                >
                  Immediate Charging
                </text>
              </g>

              {/* Optimized Charging Bar (Emerald) */}
              <g>
                <rect x="235" y="122" width="70" height="98" rx="8" fill="#34D399" />
                <text
                  x="270"
                  y="108"
                  textAnchor="middle"
                  className="text-xs font-mono font-bold fill-slate-900"
                >
                  ₹1,048.20
                </text>
                <text
                  x="270"
                  y="240"
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-slate-500"
                >
                  Optimized (EVkal)
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Section: Per-Vehicle Impact Summary Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Per-Vehicle Impact Summary
          </h2>

          <button
            type="button"
            onClick={() => setActiveP0SubPage('PAGE_4_SCHEDULER')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View Detailed Schedule</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-2 text-center w-8">#</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3 text-center">Energy (kWh)</th>
                <th className="py-3 px-3 text-right">Cost (Immediate)</th>
                <th className="py-3 px-3 text-right">Cost (Optimized)</th>
                <th className="py-3 px-3 text-center">Savings</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicleImpactRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-2 text-center text-slate-400 font-tabular font-semibold">
                    {row.id}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <VehicleThumbnail model={row.model} />
                      <span className="font-bold text-slate-800">{row.model}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-tabular font-medium text-slate-700">
                    {row.energy.toFixed(1)}
                  </td>

                  <td className="py-3 px-3 text-right font-tabular text-slate-500">
                    {row.costImmediate}
                  </td>

                  <td className="py-3 px-3 text-right font-tabular font-bold text-slate-800">
                    {row.costOptimized}
                  </td>

                  <td className="py-3 px-3 text-center font-tabular font-bold text-emerald-600">
                    {row.savings}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {row.isFeasible ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        <span>Optimized</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100/90 text-rose-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        <span>Infeasible</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
