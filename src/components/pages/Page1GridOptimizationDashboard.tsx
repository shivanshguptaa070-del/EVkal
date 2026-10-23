import { RotateCcw, Calendar, ChevronDown, Sprout, Clock, MapPin, Zap, LayoutDashboard } from 'lucide-react';
import { TransformerControlPanel } from '../TransformerControlPanel';
import { ScenarioSelector } from '../ScenarioSelector';
import { EVFleetManagerTable } from '../EVFleetManagerTable';
import { BeforeAfterMetricsCard } from '../BeforeAfterMetricsCard';
import { DualCurveLoadChart } from '../DualCurveLoadChart';
import { HourlyScheduleHeatmap } from '../HourlyScheduleHeatmap';
import { useSimulationStore } from '../../store/useSimulationStore';

export function Page1GridOptimizationDashboard() {
  const { resetSimulation, isLive, toggleNetworkFallback, setActiveTab, setActiveP0SubPage } = useSimulationStore();

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col font-sans">
      {/* ─── Top Header Bar ─── */}
      <header className="bg-[#0B1522] border-b border-slate-800/90 px-4 sm:px-6 py-3 shrink-0">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Brand + Status Badges */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* EVkal Logo */}
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { setActiveTab('P0_GRID'); setActiveP0SubPage('PAGE_1_DASHBOARD'); }}>
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                E
                <span className="relative">
                  V
                  <Sprout className="h-4 w-4 text-emerald-400 absolute -top-2.5 -right-1 transform rotate-12 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                </span>
                <span className="text-2xl font-black tracking-tight text-emerald-400 ml-0.5">kal</span>
              </span>
            </div>

            {/* LIVE API Pill */}
            <button
              type="button"
              onClick={toggleNetworkFallback}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 text-xs font-semibold text-slate-200 transition-colors shadow-inner"
              title="Toggle API Source"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </span>
              <span>{isLive ? 'LIVE API: Grid-India (NR)' : 'SYNTHETIC_FALLBACK'}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Regional Status */}
            <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono font-semibold text-blue-400 tracking-wider">
              REGIONAL_NORMAL
            </div>

            {/* Clock */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono font-semibold text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>19:00 IST</span>
            </div>
          </div>

          {/* Right Mode Switcher Tabs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => { setActiveTab('P0_GRID'); setActiveP0SubPage('PAGE_1_DASHBOARD'); }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline">Overview</span>
            </button>

            {/* Active Pill: Grid & Transformer Optimizer */}
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A7F3D0] border border-emerald-300 text-xs font-black text-[#064E3B] shadow-md transition-all cursor-default"
            >
              <Zap className="h-3.5 w-3.5 text-[#064E3B]" />
              <span>Grid &amp; Transformer Optimizer</span>
            </button>

            {/* P2P Charger Sharing Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('P1_P2P')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">P2P Charger Sharing</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main 2-Column Content Area ─── */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT PANEL: Simulation & Fleet Controls */}
          <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
            {/* Panel Header */}
            <div className="px-5 py-4 flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-white fill-white" />
                  </div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">
                    Simulation &amp; Fleet Controls
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium pl-8">
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

            <div className="p-5 space-y-6">
              <TransformerControlPanel />
              <ScenarioSelector />
              <EVFleetManagerTable />
            </div>
          </section>

          {/* RIGHT PANEL: Load Analysis & Optimization Results */}
          <section className="lg:col-span-7 space-y-5">
            {/* KPI Header Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="h-6 w-6 rounded-lg bg-violet-500 flex items-center justify-center">
                      <LayoutDashboard className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Load Analysis &amp; Optimization Results
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium pl-8">
                    Compare baseline vs. optimized load and see the impact on your transformer.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Mon, 23 Oct 2026</span>
                  <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
                </div>
              </div>
              <div className="p-5">
                <BeforeAfterMetricsCard />
              </div>
            </div>

            {/* Central Dual-Curve Load Chart */}
            <DualCurveLoadChart />

            {/* 24-Hour Demand Tier Strip */}
            <HourlyScheduleHeatmap />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-4 text-center text-xs text-slate-500 font-medium">
        EVkal &middot; Smarter Charging &middot; Stronger Grids &middot; Hackathon Problem #053
      </footer>
    </div>
  );
}
