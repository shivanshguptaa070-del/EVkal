import {
  Zap,
  ArrowRight,
  Calendar,
  Sun,
  Shield,
  IndianRupee,
  ChevronRight,
  BarChart2,
  Lightbulb,
  Car,
  Sprout,
  ShieldCheck,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';

export function Page1GridDashboard() {
  const {
    solverOutput,
    transformerConfig,
    setActiveP0SubPage,
    openSessionModal,
    isAdmin,
    adminId,
    activeScenario,
    userProfile,
  } = useSimulationStore();

  const { baselineSlots, optimisedSlots, summary } = solverOutput;
  const capacity = transformerConfig.ratedCapacityKw;

  // Real-time slot 19 data (or peak load slot)
  const activeSlots = activeScenario === 'EVENING_RUSH' ? baselineSlots : optimisedSlots;
  const currentSlot = activeSlots[19] ?? activeSlots[0];
  const currentLoadKw = currentSlot.totalLoadKw;
  const currentRate =
    activeScenario === 'EVENING_RUSH' ? 11.20 : activeScenario === 'INFEASIBLE_REQUEST' ? 14.80 : 4.20;
  const utilizationPct = (currentLoadKw / capacity) * 100;

  // Max scale for the status bar (160 kW)
  const maxScaleKw = 160;
  const capacityPct = (capacity / maxScaleKw) * 100;
  const loadPositionPct = Math.min((currentLoadKw / maxScaleKw) * 100, 100);

  return (
    <div className="space-y-6">
      {/* 1. HERO SECTION */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-mono block">
              WELCOME BACK, {(userProfile?.personal?.fullName || 'DRIVER').trim().split(/\s+/)[0].toUpperCase()}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 leading-[1.15]">
              Powering a{' '}
              <span className="text-[#00A86B] drop-shadow-xs">Smarter</span>{' '}
              Tomorrow
            </h1>

            <p className="text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
              Optimize EV charging, reduce peak demand and keep our grids reliable.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveP0SubPage('PAGE_4_SCHEDULER')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00A86B] hover:bg-[#00925c] text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer group"
              >
                <span>Plan Charging</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveP0SubPage('PAGE_4_SCHEDULER')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>View Schedule</span>
              </button>
            </div>
          </div>

          {/* Right Hero Graphic with Badge */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Top Right Mini Floating Badge */}
            <div className="absolute top-0 right-0 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm text-xs">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-[#00A86B]">
                <Sprout className="h-3 w-3" />
              </div>
              <div className="text-left leading-tight">
                <span className="font-bold text-slate-800 block text-[11px]">Balanced Grids</span>
                <span className="text-[10px] text-slate-500 block">Reliable Communities</span>
              </div>
            </div>

            {/* Generated Hero Image */}
            <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-md border border-slate-100 relative group">
              <img
                src="/assets/images/dashboard_hero_ev.jpg"
                alt="Modern EV plugged into a home charger with solar rooftops"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR KEY INDICATORS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Grid Load */}
        <div
          onClick={() => setActiveP0SubPage('PAGE_4_SCHEDULER')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Zap className="h-5 w-5 fill-red-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block mb-0.5">Current Grid Load</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight">
              {currentLoadKw.toFixed(1)} kW
            </div>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
              High (Peak Hour)
            </span>
            <span className="text-[11px] text-slate-400 font-tabular">19:00 - 21:00</span>
          </div>
        </div>

        {/* Card 2: Current Price */}
        <div
          onClick={() => setActiveP0SubPage('PAGE_3_TARIFF')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block mb-0.5">Current Price</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight">
              &#8377;{currentRate.toFixed(2)} / kWh
            </div>
          </div>

          <div>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
              Peak Hour
            </span>
          </div>
        </div>

        {/* Card 3: Solar Generation */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Sun className="h-5 w-5 fill-amber-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block mb-0.5">Solar Generation</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight">
              18.5 kW
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 font-tabular inline-flex items-center gap-0.5">
              &uarr; +6.2 kW
            </span>
          </div>
        </div>

        {/* Card 4: Transformer Status */}
        <div
          onClick={() => setActiveP0SubPage('PAGE_5_RESULTS')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Shield className="h-5 w-5 fill-blue-500" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block mb-0.5">Transformer Status</span>
            <div className="text-2xl font-black text-slate-900 font-tabular tracking-tight">
              {utilizationPct.toFixed(1)}%
            </div>
          </div>

          <div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              utilizationPct > 100
                ? 'bg-red-100 text-red-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {utilizationPct > 100 ? 'Overload Risk' : 'Safe Operating Zone'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. GRID STATUS GAUGE & TODAY'S INSIGHT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Grid Status Gauge (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-[#00A86B]" />
              <h3 className="text-sm font-bold text-slate-900">Grid Status</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A86B] animate-pulse" />
              Live
            </span>
          </div>

          {/* Interactive Range Gauge */}
          <div className="relative pt-6 pb-2">
            {/* Dynamic Value Tooltip / Marker */}
            <div
              className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
              style={{ left: `${loadPositionPct}%` }}
            >
              <span className="text-xs font-black font-tabular text-red-600 tracking-tight">
                {currentLoadKw.toFixed(1)} kW
              </span>
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-red-600" />
            </div>

            {/* Continuous Gradient Bar: Green -> Amber -> Red */}
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 relative shadow-inner">
              {/* Rated Capacity Vertical Dashed Line Marker */}
              <div
                className="absolute -top-1 bottom-0 w-0.5 border-l-2 border-dashed border-slate-800 pointer-events-none"
                style={{ left: `${capacityPct}%` }}
              />
            </div>

            {/* Markers underneath */}
            <div className="flex items-center justify-between text-[11px] font-tabular text-slate-500 pt-2 font-medium">
              <span>0 kW</span>
              <span className="text-slate-800 font-bold" style={{ marginLeft: `${capacityPct - 50}%` }}>
                Capacity: {capacity.toFixed(0)} kW
              </span>
              <span>{maxScaleKw} kW</span>
            </div>
          </div>
        </div>

        {/* Right: Today's Insight (5 cols) */}
        <div
          onClick={() => setActiveP0SubPage('PAGE_4_SCHEDULER')}
          className="lg:col-span-5 bg-gradient-to-br from-[#EBFBF3] to-[#E3F8EE] border border-emerald-200/90 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between cursor-pointer group"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Today's Insight</h3>
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium pr-6">
              Evening charging demand is high. Shifting flexible EV charging to off-peak hours can save up to{' '}
              <span className="font-bold text-emerald-800">{summary.fleetSavingsPct.toFixed(0)}%</span> and reduce
              transformer stress by <span className="font-bold text-emerald-800">{summary.peakReductionPct.toFixed(1)}%</span>.
            </p>
          </div>

          {/* Decorative Leaf Art on corner */}
          <div className="absolute -right-3 -bottom-3 opacity-30 text-emerald-600 pointer-events-none">
            <Sprout className="h-20 w-20" />
          </div>
        </div>
      </section>

      {/* 4. QUICK ACTIONS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#00A86B] fill-[#00A86B]" />
          <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Add EV */}
          <button
            type="button"
            onClick={() => {
              openSessionModal();
              setActiveP0SubPage('PAGE_2_FLEET');
            }}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">
                  Add EV
                </span>
                <span className="text-[11px] text-slate-500 block leading-snug">
                  Add a new vehicle and charging requirements
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 shrink-0 ml-1 transition-colors" />
          </button>

          {/* Action 2: Set Charging Schedule */}
          <button
            type="button"
            onClick={() => setActiveP0SubPage('PAGE_4_SCHEDULER')}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-[#00A86B] transition-colors">
                  Set Charging Schedule
                </span>
                <span className="text-[11px] text-slate-500 block leading-snug">
                  Optimize charging times based on grid and price
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 shrink-0 ml-1 transition-colors" />
          </button>

          {/* Action 3: View Dynamic Tariff */}
          <button
            type="button"
            onClick={() => setActiveP0SubPage('PAGE_3_TARIFF')}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-600 transition-colors">
                  View Dynamic Tariff
                </span>
                <span className="text-[11px] text-slate-500 block leading-snug">
                  Check today's electricity prices and incentives
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 shrink-0 ml-1 transition-colors" />
          </button>

          {/* Action 4: View Results */}
          <button
            type="button"
            onClick={() => setActiveP0SubPage('PAGE_5_RESULTS')}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all text-left flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BarChart2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-600 transition-colors">
                  View Results
                </span>
                <span className="text-[11px] text-slate-500 block leading-snug">
                  See impact on grid, cost and emissions
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 shrink-0 ml-1 transition-colors" />
          </button>
        </div>

        {/* Admin Feeder Control Banner (Only visible when logged in with Admin ID) */}
        {isAdmin && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-[#170E30] to-[#0D1527] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-purple-500/30 animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 shadow-inner">
                <Zap className="h-5 w-5 text-purple-400 fill-purple-400/30" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-purple-300" />
                    Admin Mode Active
                  </span>
                  <span className="text-xs text-purple-300 font-mono font-bold">ID: {adminId}</span>
                </div>
                <h4 className="text-sm font-black text-white mt-1">Full Grid &amp; Transformer Optimizer Suite</h4>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed mt-0.5">
                  Launch the complete simulation workspace: configure rated transformer capacity &amp; safety thresholds, compare Evening Rush / Valley Shift scenarios, and inspect hourly load curves.
                </p>
              </div>
            </div>
            <button
              type="button"
              id="admin-launch-optimizer-btn"
              onClick={() => setActiveP0SubPage('PAGE_0_OPTIMIZER')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Launch Grid Optimizer</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
