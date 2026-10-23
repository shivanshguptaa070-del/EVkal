import { useState } from 'react';
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

export function Page4Scheduler() {
  const { solverOutput, runSolver, openSessionModal } = useSimulationStore();
  const { summary } = solverOutput;

  const [optGoal, setOptGoal] = useState<'cost' | 'peak' | 'fair'>('cost');
  const [respectConstraints, setRespectConstraints] = useState(true);
  const [allowPartial, setAllowPartial] = useState(true);
  const [useDynamicTariff, setUseDynamicTariff] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      runSolver();
      setIsOptimizing(false);
    }, 400);
  };

  // Schedule row specifications aligned with solver output & mockup
  const scheduleRows = [
    {
      id: 1,
      model: 'Tata Nexon EV',
      energy: 22.0,
      scheduledTime: '00:00 – 04:00 (4h)',
      timeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      power: '7.4 kW (AC)',
      cost: '₹73.70',
      status: 'Scheduled',
      feasible: true,
    },
    {
      id: 2,
      model: 'Hyundai Ioniq 5',
      energy: 38.0,
      scheduledTime: '01:00 – 06:00 (5h)',
      timeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      power: '7.4 kW (AC)',
      cost: '₹126.40',
      status: 'Scheduled',
      feasible: true,
    },
    {
      id: 3,
      model: 'Tata Tiago EV',
      energy: 18.0,
      scheduledTime: '02:00 – 05:30 (3.5h)',
      timeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      power: '3.3 kW (AC)',
      cost: '₹60.30',
      status: 'Scheduled',
      feasible: true,
    },
    {
      id: 4,
      model: 'MG ZS EV',
      energy: 32.0,
      scheduledTime: '23:00 – 04:00 (5h)',
      timeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      power: '7.4 kW (AC)',
      cost: '₹104.20',
      status: 'Scheduled',
      feasible: true,
    },
    {
      id: 5,
      model: 'Mahindra XUV400',
      energy: 28.0,
      scheduledTime: '00:30 – 05:00 (4.5h)',
      timeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      power: '7.4 kW (AC)',
      cost: '₹89.60',
      status: 'Scheduled',
      feasible: true,
    },
    {
      id: 6,
      model: 'BYD Atto 3',
      energy: 21.0,
      scheduledTime: '19:00 – 23:00 (4h)',
      timeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      power: '11 kW (AC)',
      cost: '₹393.00',
      status: 'Infeasible',
      feasible: false,
    },
  ];

  const totalVehiclesCount = 6;
  const feasibleCount = scheduleRows.filter((r) => r.feasible).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner matching Image 4 */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
            <Calendar className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Smart Charging Scheduler
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Optimized charging schedule for all EVs based on grid load, dynamic tariff and user constraints.
            </p>
          </div>
        </div>

        {/* Right Action Controls: Date Dropdown + Generate Schedule Button */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>Mon, 23 Oct 2026</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:shadow cursor-pointer active:scale-98"
          >
            {isOptimizing ? (
              <RotateCcw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <span className="text-sm leading-none">+</span>
            )}
            <span>Generate Schedule</span>
          </button>
        </div>
      </div>

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
              {totalVehiclesCount}
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
              182.0 <span className="text-sm font-semibold font-sans text-slate-500">kWh</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">100% of demand</span>
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
              ₹1,048.20
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 font-tabular">
              ↓ -60.2% vs Immediate
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
              {feasibleCount} / {totalVehiclesCount}
            </div>
            <span className="text-xs font-semibold text-rose-600">1 infeasible request</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Left Schedule Table + Right Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Optimized Schedule Table (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Optimized Schedule
          </h2>

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
                {scheduleRows.map((row) => (
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
                      {row.cost}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {row.feasible ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Scheduled</span>
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
                        onClick={() => openSessionModal()}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
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
                onChange={(e) => setOptGoal(e.target.value as any)}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
              >
                <option value="cost">Minimize Cost (Default)</option>
                <option value="peak">Peak Load Shaving</option>
                <option value="fair">Fair Share Allocation</option>
              </select>
              <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3 Interactive Toggles matching Image 4 */}
          <div className="space-y-3.5 pt-1">
            {/* Toggle 1: Respect User Constraints */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">
                Respect User Constraints
              </span>
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
              <span className="text-xs font-semibold text-slate-700">
                Allow Partial Charging
              </span>
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
              <span className="text-xs font-semibold text-slate-700">
                Use Dynamic Tariff
              </span>
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
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow cursor-pointer active:scale-98"
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

      {/* Bottom Smart Schedule Ready Banner matching Image 4 */}
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
                {summary.peakReductionPct.toFixed(1)}%
              </div>
              <span className="text-[11px] font-tabular font-medium text-slate-500">
                {summary.baselinePeakKw.toFixed(1)} kW → {summary.optimisedPeakKw.toFixed(1)} kW
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
                ₹{summary.fleetSavingsInr.toFixed(2)}
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
