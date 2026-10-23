import { RotateCcw, Calendar, MapPin, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { TransformerControlPanel } from './components/TransformerControlPanel';
import { ScenarioSelector } from './components/ScenarioSelector';
import { EVFleetManagerTable } from './components/EVFleetManagerTable';
import { BeforeAfterMetricsCard } from './components/BeforeAfterMetricsCard';
import { DualCurveLoadChart } from './components/DualCurveLoadChart';
import { HourlyScheduleHeatmap } from './components/HourlyScheduleHeatmap';
import { EVSessionModal } from './components/EVSessionModal';
import { useSimulationStore } from './store/useSimulationStore';

export default function App() {
  const { activeTab, setActiveTab, resetSimulation } = useSimulationStore();

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
          /* P1: P2P Community Charger Sharing (Preview for Phase 4) */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                P1 &ndash; Community Feature
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                P2P Community Charger Sharing &amp; Emergency Assist
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Peer-to-peer charger discovery marketplace for EV drivers with critical low battery. Includes straight-line
                Haversine radar matching, privacy obfuscation circles, and a 5-stage simulated booking flow.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">Verified Hosts</h4>
                <p className="text-[11px] text-slate-500">6 realistic Delhi NCR listings with host verified status.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">Proximity Radar</h4>
                <p className="text-[11px] text-slate-500">&plusmn;350m privacy circle concealment prior to booking.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <Zap className="h-5 w-5 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900">5-Stage Sim Machine</h4>
                <p className="text-[11px] text-slate-500">Full booking workflow with gate PIN reveal at Stage 3.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('P0_GRID')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Return to Grid &amp; Transformer Optimizer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-600">
        EVkal &middot; Smart EV Charging &amp; P2P Sharing Decision-Support System &middot; Hackathon Problem #053
      </footer>

      {/* Interactive EV Session Modal */}
      <EVSessionModal />
    </div>
  );
}
