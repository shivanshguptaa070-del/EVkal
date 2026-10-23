import { RotateCcw, Calendar, ChevronDown } from 'lucide-react';
import { TransformerControlPanel } from '../TransformerControlPanel';
import { ScenarioSelector } from '../ScenarioSelector';
import { EVFleetManagerTable } from '../EVFleetManagerTable';
import { BeforeAfterMetricsCard } from '../BeforeAfterMetricsCard';
import { DualCurveLoadChart } from '../DualCurveLoadChart';
import { HourlyScheduleHeatmap } from '../HourlyScheduleHeatmap';
import { useSimulationStore } from '../../store/useSimulationStore';

export function Page1GridOptimizationDashboard() {
  const { resetSimulation } = useSimulationStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT PANEL (Simulation & Fleet Controls) */}
      <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-6">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Simulation &amp; Fleet Controls
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Configure transformer capacity, select a scenario and manage EV sessions.
            </p>
          </div>
          <button
            type="button"
            onClick={resetSimulation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            title="Reset to default benchmark"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* 1. Transformer Capacity Slider & Ring */}
        <TransformerControlPanel />

        {/* 2. Scenario Presets */}
        <ScenarioSelector />

        {/* 3. EV Fleet Sessions Table */}
        <EVFleetManagerTable />
      </section>

      {/* RIGHT PANEL (Load Analysis & Optimization Results) */}
      <section className="lg:col-span-7 space-y-6">
        {/* Top Header & 4 KPI Impact Summary Cards */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Load Analysis &amp; Optimization Results
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Compare baseline vs. optimized load and see the impact on your transformer.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Mon, 23 Oct 2026</span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <BeforeAfterMetricsCard />
        </div>

        {/* Central Dual-Curve Load Chart */}
        <DualCurveLoadChart />

        {/* 24-Hour Demand Tier Strip */}
        <HourlyScheduleHeatmap />
      </section>
    </div>
  );
}
