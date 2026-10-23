import { RotateCcw, Calendar } from 'lucide-react';
import { Header } from './components/Header';
import { LandingHeroPage } from './components/LandingHeroPage';
import { TransformerControlPanel } from './components/TransformerControlPanel';
import { ScenarioSelector } from './components/ScenarioSelector';
import { EVFleetManagerTable } from './components/EVFleetManagerTable';
import { BeforeAfterMetricsCard } from './components/BeforeAfterMetricsCard';
import { DualCurveLoadChart } from './components/DualCurveLoadChart';
import { HourlyScheduleHeatmap } from './components/HourlyScheduleHeatmap';
import { EVSessionModal } from './components/EVSessionModal';
import { P2PChargerSharingTab } from './components/P2PChargerSharingTab';
import { BookingSimModal } from './components/BookingSimModal';
import { useSimulationStore } from './store/useSimulationStore';

export default function App() {
  const { activeTab, resetSimulation } = useSimulationStore();

  if (activeTab === 'LANDING') {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        <LandingHeroPage />
        {/* Interactive EV Session Modal (P0) */}
        <EVSessionModal />
        {/* Interactive 5-Stage P2P Booking Modal (P1) */}
        <BookingSimModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* Persistent Global Header */}
      <Header />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'P0_GRID' ? (
          /* P0: Smart Grid & Transformer Optimizer (Screen 1 Mockup) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT PANEL (35% - 4.5 cols) */}
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
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

            {/* RIGHT PANEL (65% - 7.5 cols) */}
            <section className="lg:col-span-7 space-y-5">
              {/* Top Banner Row */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      Load Analysis &amp; Optimization Results
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Compare baseline vs. optimized load and see the impact on your transformer.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Mon, 23 Oct 2026</span>
                  </div>
                </div>

                {/* 4 KPI Impact Summary Cards */}
                <BeforeAfterMetricsCard />
              </div>

              {/* Central Dual-Curve Load Chart */}
              <DualCurveLoadChart />

              {/* 24-Hour Demand Tier Strip */}
              <HourlyScheduleHeatmap />
            </section>
          </div>
        ) : (
          /* P1: P2P Community Charger Sharing (Screen 3 & 4 Mockup) */
          <P2PChargerSharingTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-600">
        EVkal &middot; Smart EV Charging &amp; P2P Sharing Decision-Support System &middot; Hackathon Problem #053
      </footer>

      {/* Interactive EV Session Modal (P0) */}
      <EVSessionModal />

      {/* Interactive 5-Stage P2P Booking Modal (P1) */}
      <BookingSimModal />
    </div>
  );
}
