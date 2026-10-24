import { useState, useMemo } from 'react';
import {
  Calendar,
  Car,
  Zap,
  IndianRupee,
  ShieldCheck,
  Settings,
  Leaf,
  BarChart3,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';
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

const DATE_OPTIONS = [
  { label: 'Mon, 23 Oct 2026', desc: 'Benchmark Scenario (Default)' },
  { label: 'Tue, 24 Oct 2026', desc: 'Solar Peak Shift Window' },
  { label: 'Wed, 25 Oct 2026', desc: 'Grid Stress & Valley Shaving' },
  { label: 'Thu, 26 Oct 2026', desc: 'Forecasted Live Discom Day' },
];

export function Page4Scheduler() {
  const { runSolver, openSessionModal } = useSimulationStore();

  const [optGoal, setOptGoal] = useState<'cost' | 'peak' | 'fair'>('cost');
  const [respectConstraints, setRespectConstraints] = useState(true);
  const [allowPartial, setAllowPartial] = useState(true);
  const [useDynamicTariff, setUseDynamicTariff] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Mon, 23 Oct 2026');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [lastOptimizedTime, setLastOptimizedTime] = useState('10:48 AM');
  const [isTableFlashing, setIsTableFlashing] = useState(false);

  // Dynamic Schedule calculation reactive to all settings & optimization goal
  const calculated = useMemo(() => {
    let rows = [
      {
        id: 1,
        evId: 'EV-01',
        model: 'Tata Nexon EV',
        energy: 22.0,
        scheduledTime:
          optGoal === 'cost'
            ? '00:00 – 04:00 (4h)'
            : optGoal === 'peak'
            ? '01:00 – 05:00 (4h)'
            : '00:30 – 04:30 (4h)',
        timeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        power: optGoal === 'peak' ? '5.5 kW (AC)' : '7.4 kW (AC)',
        costNum: useDynamicTariff
          ? optGoal === 'cost'
            ? 73.70
            : optGoal === 'peak'
            ? 82.40
            : 79.20
          : 22.0 * 8.50,
        status: 'Scheduled',
        feasible: true,
        deliveredEnergy: 22.0,
      },
      {
        id: 2,
        evId: 'EV-04',
        model: 'Hyundai Ioniq 5',
        energy: 38.0,
        scheduledTime:
          optGoal === 'cost'
            ? '01:00 – 06:00 (5h)'
            : optGoal === 'peak'
            ? '23:30 – 05:30 (6h)'
            : '00:30 – 06:00 (5.5h)',
        timeColor: 'bg-sky-50 text-sky-800 border-sky-200',
        power: optGoal === 'peak' ? '6.3 kW (AC)' : '7.4 kW (AC)',
        costNum: useDynamicTariff
          ? optGoal === 'cost'
            ? 126.40
            : optGoal === 'peak'
            ? 141.20
            : 135.00
          : 38.0 * 8.50,
        status: 'Scheduled',
        feasible: true,
        deliveredEnergy: 38.0,
      },
      {
        id: 3,
        evId: 'EV-06',
        model: 'Tata Tiago EV',
        energy: 18.0,
        scheduledTime:
          optGoal === 'cost'
            ? '02:00 – 05:30 (3.5h)'
            : optGoal === 'peak'
            ? '01:00 – 06:30 (5.5h)'
            : '01:30 – 06:00 (4.5h)',
        timeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        power: '3.3 kW (AC)',
        costNum: useDynamicTariff
          ? optGoal === 'cost'
            ? 60.30
            : optGoal === 'peak'
            ? 64.50
            : 62.00
          : 18.0 * 8.50,
        status: 'Scheduled',
        feasible: true,
        deliveredEnergy: 18.0,
      },
      {
        id: 4,
        evId: 'EV-03',
        model: 'MG ZS EV',
        energy: 32.0,
        scheduledTime:
          optGoal === 'cost'
            ? '23:00 – 04:00 (5h)'
            : optGoal === 'peak'
            ? '00:00 – 05:30 (5.5h)'
            : '23:30 – 05:00 (5.5h)',
        timeColor: 'bg-sky-50 text-sky-800 border-sky-200',
        power: optGoal === 'peak' ? '5.8 kW (AC)' : '7.4 kW (AC)',
        costNum: useDynamicTariff
          ? optGoal === 'cost'
            ? 104.20
            : optGoal === 'peak'
            ? 118.00
            : 112.50
          : 32.0 * 8.50,
        status: 'Scheduled',
        feasible: true,
        deliveredEnergy: 32.0,
      },
      {
        id: 5,
        evId: 'EV-02',
        model: 'Mahindra XUV400',
        energy: 28.0,
        scheduledTime:
          optGoal === 'cost'
            ? '00:30 – 05:00 (4.5h)'
            : optGoal === 'peak'
            ? '23:00 – 04:30 (5.5h)'
            : '00:00 – 05:00 (5h)',
        timeColor: 'bg-purple-50 text-purple-800 border-purple-200',
        power: optGoal === 'peak' ? '5.1 kW (AC)' : '7.4 kW (AC)',
        costNum: useDynamicTariff
          ? optGoal === 'cost'
            ? 89.60
            : optGoal === 'peak'
            ? 101.40
            : 96.00
          : 28.0 * 8.50,
        status: 'Scheduled',
        feasible: true,
        deliveredEnergy: 28.0,
      },
      {
        id: 6,
        evId: 'EV-05',
        model: 'BYD Atto 3',
        energy: 21.0,
        scheduledTime: !respectConstraints
          ? '23:00 – 03:00 (4h)'
          : allowPartial
          ? '19:30 – 23:00 (3.5h)'
          : '19:00 – 23:00 (4h)',
        timeColor: !respectConstraints
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : allowPartial
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-rose-50 text-rose-800 border-rose-200',
        power: !respectConstraints ? '7.4 kW (AC)' : allowPartial ? '4.8 kW (AC)' : '11 kW (AC)',
        costNum: !respectConstraints
          ? useDynamicTariff
            ? 70.35
            : 21.0 * 8.50
          : allowPartial
          ? useDynamicTariff
            ? 168.00
            : 15.0 * 8.50
          : useDynamicTariff
          ? 393.00
          : 21.0 * 8.50,
        status: !respectConstraints ? 'Scheduled' : allowPartial ? 'Partial (71%)' : 'Infeasible',
        feasible: !respectConstraints ? true : allowPartial ? true : false,
        deliveredEnergy: !respectConstraints || !allowPartial ? 21.0 : 15.0,
      },
    ];

    if (selectedDate.includes('Tue')) {
      rows = rows.map((r) => ({
        ...r,
        costNum: Number((r.costNum * 0.94).toFixed(2)),
      }));
    }

    const totalVehiclesCount = rows.length;
    const feasibleCount = rows.filter((r) => r.feasible).length;
    const infeasibleCount = totalVehiclesCount - feasibleCount;
    const totalEnergyScheduled = rows.reduce(
      (sum, r) => sum + (r.deliveredEnergy ?? r.energy),
      0
    );
    const totalCost = rows.reduce((sum, r) => sum + r.costNum, 0);

    const immediateBaselineCost = 2615.39;
    const savingsPct = Math.max(0, ((immediateBaselineCost - totalCost) / immediateBaselineCost) * 100);
    const fleetSavingsInr = Math.max(0, immediateBaselineCost - totalCost);

    let peakReductionPct = 36.8;
    let baselinePeakKw = 68.0;
    let optimisedPeakKw = 43.0;

    if (optGoal === 'peak') {
      peakReductionPct = 44.5;
      optimisedPeakKw = 37.7;
    } else if (optGoal === 'fair') {
      peakReductionPct = 39.2;
      optimisedPeakKw = 41.3;
    }

    return {
      rows,
      totalVehiclesCount,
      feasibleCount,
      infeasibleCount,
      totalEnergyScheduled,
      totalCost,
      savingsPct,
      fleetSavingsInr,
      peakReductionPct,
      baselinePeakKw,
      optimisedPeakKw,
    };
  }, [optGoal, respectConstraints, allowPartial, useDynamicTariff, selectedDate]);

  // Handler for BOTH "+ Generate Schedule" and "▶ Run Optimization"
  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setIsTableFlashing(true);
    setShowToast(false);

    setTimeout(() => {
      runSolver();
      setIsOptimizing(false);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastOptimizedTime(currentTime);

      const goalLabel =
        optGoal === 'cost'
          ? 'Minimize Cost'
          : optGoal === 'peak'
          ? 'Peak Load Shaving'
          : 'Fair Share Allocation';

      setToastMessage(
        `Optimization completed (${goalLabel}) for ${selectedDate}. Feasibility: ${calculated.feasibleCount}/${calculated.totalVehiclesCount} EVs scheduled • Estimated Cost: ₹${calculated.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (↓ -${calculated.savingsPct.toFixed(1)}% savings).`
      );
      setShowToast(true);

      setTimeout(() => {
        setIsTableFlashing(false);
      }, 1000);

      setTimeout(() => {
        setShowToast(false);
      }, 6000);
    }, 500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner matching Mockup */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
            <Calendar className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Smart Charging Scheduler
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Solver Live</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Optimized charging schedule for all EVs based on grid load, dynamic tariff and user constraints.
            </p>
          </div>
        </div>

        {/* Right Action Controls: Date Dropdown + Generate Schedule Button */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* Interactive Date Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>{selectedDate}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                  dateDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDateDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 z-30 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Simulation Date
                  </div>
                  <div className="py-1 space-y-0.5">
                    {DATE_OPTIONS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setSelectedDate(item.label);
                          setDateDropdownOpen(false);
                          handleRunOptimization();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          selectedDate === item.label
                            ? 'bg-emerald-50 text-emerald-800 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div>
                          <div className="leading-tight">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                        {selectedDate === item.label && (
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Top-Right "Generate Schedule" Button */}
          <button
            type="button"
            id="generate-schedule-btn"
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-80 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all hover:shadow cursor-pointer active:scale-98"
          >
            {isOptimizing ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                <span>Generating Schedule...</span>
              </>
            ) : (
              <>
                <span className="text-sm leading-none">+</span>
                <span>Generate Schedule</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Feedback Notification Banner */}
      {showToast && (
        <div className="bg-emerald-50/95 border border-emerald-200/90 rounded-2xl p-4 shadow-sm flex items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
                <span>Optimal Charging Schedule Generated</span>
                <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded">
                  Updated at {lastOptimizedTime}
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-800 mt-0.5">
                {toastMessage}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="p-1 rounded-lg text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100/80 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4 Summary Cards matching Mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Vehicles */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-sky-600">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-0.5">Total Vehicles</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              {calculated.totalVehiclesCount}
            </div>
            <span className="text-xs font-semibold text-slate-500">Scheduled</span>
          </div>
        </div>

        {/* 2. Total Energy Scheduled */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-0.5">Total Energy Scheduled</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              {calculated.totalEnergyScheduled.toFixed(1)}{' '}
              <span className="text-sm font-semibold font-sans text-slate-500">kWh</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {((calculated.totalEnergyScheduled / 182.0) * 100).toFixed(0)}% of demand
            </span>
          </div>
        </div>

        {/* 3. Estimated Charging Cost */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600">
            <IndianRupee className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-0.5">Estimated Charging Cost</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              ₹{calculated.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 font-tabular">
              ↓ -{calculated.savingsPct.toFixed(1)}% vs Immediate
            </span>
          </div>
        </div>

        {/* 4. Feasible Schedule */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-sky-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-0.5">Feasible Schedule</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              {calculated.feasibleCount} / {calculated.totalVehiclesCount}
            </div>
            <span
              className={`text-xs font-semibold ${
                calculated.infeasibleCount > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {calculated.infeasibleCount > 0
                ? `${calculated.infeasibleCount} infeasible request`
                : 'All requests feasible'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Left Schedule Table + Right Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Optimized Schedule Table (8 cols on lg) */}
        <div
          className={`lg:col-span-8 bg-white border ${
            isTableFlashing
              ? 'border-emerald-400 ring-2 ring-emerald-200/50'
              : 'border-slate-200/90'
          } rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Optimized Schedule
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline-block">
                Mode:
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {optGoal === 'cost'
                  ? 'Cost Minimization'
                  : optGoal === 'peak'
                  ? 'Peak Shaving'
                  : 'Fair Allocation'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-2 text-center w-8">#</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3 text-center">Energy (kWh)</th>
                  <th className="py-3 px-3 text-center">Scheduled Time</th>
                  <th className="py-3 px-3 text-center">Charging Power</th>
                  <th className="py-3 px-3 text-right">Cost (₹)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculated.rows.map((row) => (
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

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border font-tabular ${row.timeColor}`}
                      >
                        {row.scheduledTime}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-600 font-medium">
                      {row.power}
                    </td>

                    <td className="py-3 px-3 text-right font-tabular font-bold text-slate-800">
                      ₹{row.costNum.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {row.status === 'Scheduled' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Scheduled</span>
                        </span>
                      ) : row.status.includes('Partial') ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-800">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{row.status}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100/90 text-rose-800">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Infeasible</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => openSessionModal(row.evId)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        title="View EV charging parameters"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Scheduling Settings Panel (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Settings className="h-4 w-4" />
            </div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Scheduling Settings
            </h2>
          </div>

          {/* Optimization Goal Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Optimization Goal</label>
            <div className="relative">
              <select
                value={optGoal}
                onChange={(e) => setOptGoal(e.target.value as 'cost' | 'peak' | 'fair')}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
              >
                <option value="cost">Minimize Cost (Default)</option>
                <option value="peak">Peak Load Shaving</option>
                <option value="fair">Fair Share Allocation</option>
              </select>
              <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3 Interactive Toggles matching Mockup */}
          <div className="space-y-3.5 pt-1">
            {/* Toggle 1: Respect User Constraints */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Respect User Constraints
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Strict departure deadlines
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRespectConstraints(!respectConstraints)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  respectConstraints ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    respectConstraints ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Allow Partial Charging */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Allow Partial Charging
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Deliver available kWh if constrained
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAllowPartial(!allowPartial)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowPartial ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    allowPartial ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Use Dynamic Tariff */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Use Dynamic Tariff
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Apply ToD day-ahead rates
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUseDynamicTariff(!useDynamicTariff)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  useDynamicTariff ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    useDynamicTariff ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Big Green Run Optimization Button */}
          <button
            type="button"
            id="run-optimization-btn"
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-80 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow cursor-pointer active:scale-98"
          >
            {isOptimizing ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                <span>Solving LP Constraints...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Run Optimization</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Smart Schedule Ready Banner matching Mockup */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-3.5 max-w-xl">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Smart Schedule Ready
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
              Charging has been shifted to low-cost, low-demand hours, reducing grid stress and saving costs.
            </p>
          </div>
        </div>

        {/* Right Metric Highlights */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 self-stretch md:self-auto border-t md:border-t-0 border-slate-200 pt-4 md:pt-0">
          {/* Peak Load Reduction */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Peak Load Reduction
              </span>
              <div className="text-xl font-black text-slate-900 font-tabular leading-none">
                {calculated.peakReductionPct.toFixed(1)}%
              </div>
              <span className="text-[11px] font-tabular font-medium text-slate-500">
                {calculated.baselinePeakKw.toFixed(1)} kW → {calculated.optimisedPeakKw.toFixed(1)} kW
              </span>
            </div>
          </div>

          {/* Estimated Savings */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Estimated Savings
              </span>
              <div className="text-xl font-black text-slate-900 font-tabular leading-none">
                ₹{calculated.fleetSavingsInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Compared to immediate charging
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
