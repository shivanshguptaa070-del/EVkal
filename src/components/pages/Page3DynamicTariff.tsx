import { useState } from 'react';
import {
  IndianRupee,
  Zap,
  Leaf,
  Sun,
  BarChart3,
  Clock,
  AlertTriangle,
  Info,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { useSimulationStore, type ScenarioPreset } from '../../store/useSimulationStore';

export function Page3DynamicTariff() {
  const { activeScenario, setScenario, solverOutput } = useSimulationStore();
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const { summary } = solverOutput;

  const scenarios: { id: ScenarioPreset; name: string }[] = [
    { id: 'EVENING_RUSH', name: 'Evening Rush (Baseline)' },
    { id: 'VALLEY_SHIFT', name: 'Valley Shift (Optimized)' },
    { id: 'INFEASIBLE_REQUEST', name: 'Infeasible Request (Stress)' },
  ];

  const currentScenarioName =
    scenarios.find((s) => s.id === activeScenario)?.name ?? 'Evening Rush (Baseline)';

  // Dynamic scenario data mapping
  const scenarioProfiles = {
    EVENING_RUSH: {
      tagline: 'Baseline uncoordinated charging: sharp evening EV surge triggers peak congestion tariffs.',
      currentPrice: {
        amount: '₹11.20',
        label: 'High (Peak Hour)',
        badgeClass: 'bg-rose-100 text-rose-700',
        subtext: 'Feeder loading: 122 kW (22% overload warning)',
      },
      lowestPrice: {
        amount: '₹3.35',
        label: 'Off-Peak (00:00 – 05:00)',
        badgeClass: 'bg-emerald-100 text-emerald-800',
        subtext: 'Night baseload valley available',
      },
      solarNow: {
        amount: '18.5',
        unit: 'kW',
        trend: '↑ 6.2 kW',
        trendIsUp: true,
        subtext: 'Standard solar generation curve',
      },
      savings: {
        amount: `₹${summary.fleetSavingsInr.toFixed(2)}`,
        badgeLabel: '↓ 67.0%',
        badgeClass: 'bg-emerald-100 text-emerald-800',
        subtext: 'Potential savings by shifting to off-peak',
      },
      tariffTiers: [
        {
          hourRange: '00–05',
          hours: [0, 1, 2, 3, 4, 5],
          label: 'Off-Peak',
          badgeClass: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
          price: '₹3.35',
          rate: 3.35,
          description: 'Lowest demand, wind & baseload surplus',
        },
        {
          hourRange: '06–11',
          hours: [6, 7, 8, 9, 10, 11],
          label: 'Normal',
          badgeClass: 'bg-sky-100/80 text-sky-800 border-sky-200',
          price: '₹6.20',
          rate: 6.2,
          description: 'Morning ramp & daytime commercial start',
        },
        {
          hourRange: '12–16',
          hours: [12, 13, 14, 15, 16],
          label: 'Peak',
          badgeClass: 'bg-amber-100/80 text-amber-800 border-amber-200',
          price: '₹8.50',
          rate: 8.5,
          description: 'Afternoon industrial & commercial demand',
        },
        {
          hourRange: '17–20',
          hours: [17, 18, 19, 20],
          label: 'High (Peak)',
          badgeClass: 'bg-rose-100/80 text-rose-800 border-rose-200',
          price: '₹11.20',
          rate: 11.2,
          description: 'Evening residential rush, transformer overload risk',
        },
        {
          hourRange: '21–23',
          hours: [21, 22, 23],
          label: 'Critical',
          badgeClass: 'bg-red-100/80 text-red-800 border-red-300 font-bold',
          price: '₹12.80',
          rate: 12.8,
          description: 'Highest tariff disincentive zone',
        },
      ],
      windows: {
        best: {
          title: 'Best Window',
          hours: '00:00 – 05:00',
          price: '₹3.35 / kWh',
          desc: 'Lowest night rates & ample distribution capacity',
          cardClass: 'bg-emerald-50/50 border-l-4 border-l-emerald-500 border border-emerald-200/80',
          badgeClass: 'text-emerald-800',
          iconBg: 'bg-emerald-500',
        },
        good: {
          title: 'Good Window',
          hours: '06:00 – 16:00',
          price: '₹6.20 / kWh',
          desc: 'Moderate daytime commercial & solar generation rate',
          cardClass: 'bg-sky-50/60 border border-sky-200/80',
          badgeClass: 'text-sky-800',
          iconBg: 'bg-sky-500',
        },
        avoid: {
          title: 'Avoid If Possible',
          hours: '17:00 – 23:00',
          price: '₹11.20 – ₹12.80 / kWh',
          desc: 'Severe transformer congestion risk (122 kW peak)',
          cardClass: 'bg-rose-50/60 border border-rose-200/80',
          badgeClass: 'text-rose-800',
          iconBg: 'bg-rose-500',
        },
      },
      callout: {
        bg: 'bg-emerald-50/90 border border-emerald-200/90 text-emerald-950',
        iconBg: 'bg-emerald-500',
        icon: Leaf,
        text: 'Charging during off-peak hours can save up to 70% compared to peak-hour prices and helps reduce transformer stress.',
      },
    },
    VALLEY_SHIFT: {
      tagline: 'Smart coordinated charging active: 5 flexible EVs shifted into solar and night valleys, shaving the peak.',
      currentPrice: {
        amount: '₹4.20',
        label: 'Optimized (Peak Shaved)',
        badgeClass: 'bg-emerald-100 text-emerald-800 font-bold',
        subtext: 'Evening peak shaved: -28.5 kW down to 87.2 kW',
      },
      lowestPrice: {
        amount: '₹2.80',
        label: 'Super Off-Peak (01:00 – 04:00)',
        badgeClass: 'bg-emerald-100 text-emerald-800 font-bold',
        subtext: 'Includes ₹0.55/kWh green valley dispatch incentive',
      },
      solarNow: {
        amount: '34.8',
        unit: 'kW',
        trend: '↑ 14.5 kW absorbed',
        trendIsUp: true,
        subtext: '+88% daytime solar co-charging alignment',
      },
      savings: {
        amount: `₹${summary.fleetSavingsInr.toFixed(2)}`,
        badgeLabel: '↓ 67.0% Achieved',
        badgeClass: 'bg-emerald-100 text-emerald-800 font-bold',
        subtext: 'Fleet cost dropped from ₹2,615 to ₹863',
      },
      tariffTiers: [
        {
          hourRange: '00–05',
          hours: [0, 1, 2, 3, 4, 5],
          label: 'Super Off-Peak',
          badgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-300 font-bold',
          price: '₹2.80',
          rate: 2.8,
          description: 'Deep overnight valley discount + green dispatch incentive',
        },
        {
          hourRange: '06–11',
          hours: [6, 7, 8, 9, 10, 11],
          label: 'Normal',
          badgeClass: 'bg-sky-100/80 text-sky-800 border-sky-200',
          price: '₹5.10',
          rate: 5.1,
          description: 'Balanced morning ramp with zero feeder strain',
        },
        {
          hourRange: '12–16',
          hours: [12, 13, 14, 15, 16],
          label: 'Solar Bonus',
          badgeClass: 'bg-emerald-100/80 text-emerald-800 border-emerald-200 font-bold',
          price: '₹3.85',
          rate: 3.85,
          description: 'Solar feed-in bonus: daytime EV absorption rebate',
        },
        {
          hourRange: '17–20',
          hours: [17, 18, 19, 20],
          label: 'Shaved Peak',
          badgeClass: 'bg-teal-100/80 text-teal-800 border-teal-200',
          price: '₹6.90',
          rate: 6.9,
          description: 'Capped peak tariff (surcharge avoided via smart shift)',
        },
        {
          hourRange: '21–23',
          hours: [21, 22, 23],
          label: 'Off-Peak Ramp',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          price: '₹4.60',
          rate: 4.6,
          description: 'Transition rate into night valley charging',
        },
      ],
      windows: {
        best: {
          title: 'Best Window (Solar)',
          hours: '11:00 – 15:00',
          price: '₹3.85 / kWh',
          desc: 'Direct rooftop solar surplus self-consumption slot',
          cardClass: 'bg-emerald-50/60 border-l-4 border-l-emerald-500 border border-emerald-200/80',
          badgeClass: 'text-emerald-800',
          iconBg: 'bg-emerald-500',
        },
        good: {
          title: 'Overnight Window',
          hours: '00:00 – 06:00',
          price: '₹2.80 / kWh',
          desc: 'Lowest tariff rate & 100% green wind/hydro baseload',
          cardClass: 'bg-sky-50/60 border border-sky-200/80',
          badgeClass: 'text-sky-800',
          iconBg: 'bg-sky-500',
        },
        avoid: {
          title: 'Managed Peak',
          hours: '18:00 – 21:00',
          price: '₹6.90 / kWh',
          desc: 'High-power fast charging throttled to protect transformer',
          cardClass: 'bg-teal-50/60 border border-teal-200/80',
          badgeClass: 'text-teal-800',
          iconBg: 'bg-teal-500',
        },
      },
      callout: {
        bg: 'bg-emerald-50/95 border border-emerald-300 text-emerald-950',
        iconBg: 'bg-emerald-600',
        icon: CheckCircle2,
        text: 'Smart Valley Shift active: Peak shaved by 28.5 kW down to 87.2 kW (safe 87% utilization). Total fleet savings: ₹1,752.15 and 0 overload hours achieved!',
      },
    },
    INFEASIBLE_REQUEST: {
      tagline: 'Feeder overload stress alert: excessive concurrent fast charging exceeds 100 kW transformer rating.',
      currentPrice: {
        amount: '₹14.80',
        label: 'Critical Surcharge (128% Load)',
        badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300 font-bold',
        subtext: 'Emergency congestion surcharge applied to prevent tripping',
      },
      lowestPrice: {
        amount: '₹4.85',
        label: 'Restricted Off-Peak (02:00 – 04:00)',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        subtext: 'Narrowed 2-hour window due to feeder thermal recovery',
      },
      solarNow: {
        amount: '12.4',
        unit: 'kW',
        trend: '↓ 4.1 kW curtailed',
        trendIsUp: false,
        subtext: 'Feeder congestion limiting reverse solar flow',
      },
      savings: {
        amount: '₹392.40',
        badgeLabel: '↓ 15.0% Constrained',
        badgeClass: 'bg-amber-100 text-amber-800',
        subtext: '1 EV session unmet due to physical capacity bounds',
      },
      tariffTiers: [
        {
          hourRange: '00–05',
          hours: [0, 1, 2, 3, 4, 5],
          label: 'Off-Peak Restricted',
          badgeClass: 'bg-sky-100/80 text-sky-800 border-sky-200',
          price: '₹4.85',
          rate: 4.85,
          description: 'Restricted baseload charging buffer zone',
        },
        {
          hourRange: '06–11',
          hours: [6, 7, 8, 9, 10, 11],
          label: 'Elevated Normal',
          badgeClass: 'bg-amber-100/80 text-amber-800 border-amber-200',
          price: '₹7.90',
          rate: 7.9,
          description: 'Morning industrial priority ramp rate',
        },
        {
          hourRange: '12–16',
          hours: [12, 13, 14, 15, 16],
          label: 'High Demand',
          badgeClass: 'bg-rose-100/80 text-rose-800 border-rose-200',
          price: '₹10.50',
          rate: 10.5,
          description: 'Grid capacity buffer near depletion',
        },
        {
          hourRange: '17–20',
          hours: [17, 18, 19, 20],
          label: 'Emergency Surcharge',
          badgeClass: 'bg-red-100 text-red-800 border-red-300 font-bold',
          price: '₹14.80',
          rate: 14.8,
          description: 'Severe transformer overload alert (>100 kW threshold)',
        },
        {
          hourRange: '21–23',
          hours: [21, 22, 23],
          label: 'Critical Alert',
          badgeClass: 'bg-red-200 text-red-950 border-red-400 font-black',
          price: '₹16.80',
          rate: 16.8,
          description: 'Maximum disincentive: mandatory load throttling',
        },
      ],
      windows: {
        best: {
          title: 'Restricted Window',
          hours: '02:00 – 05:00',
          price: '₹4.85 / kWh',
          desc: 'Emergency low-risk charging slot under active monitoring',
          cardClass: 'bg-amber-50/60 border-l-4 border-l-amber-500 border border-amber-200/80',
          badgeClass: 'text-amber-800',
          iconBg: 'bg-amber-500',
        },
        good: {
          title: 'Throttled Window',
          hours: '06:00 – 12:00',
          price: '₹7.90 / kWh',
          desc: 'Strictly limited to slow Level 1 / Level 2 (< 3.3 kW) only',
          cardClass: 'bg-sky-50/60 border border-sky-200/80',
          badgeClass: 'text-sky-800',
          iconBg: 'bg-sky-500',
        },
        avoid: {
          title: 'Critical Hazard Zone',
          hours: '17:00 – 23:00',
          price: '₹14.80 – ₹16.80 / kWh',
          desc: 'Transformer overload hazard: EV charging blocked by BMS',
          cardClass: 'bg-rose-50/80 border border-rose-300',
          badgeClass: 'text-rose-900',
          iconBg: 'bg-rose-600',
        },
      },
      callout: {
        bg: 'bg-rose-50/95 border border-rose-300 text-rose-950',
        iconBg: 'bg-rose-600',
        icon: AlertTriangle,
        text: 'Transformer Stress Alert: 1 EV request (EV-FAIL) cannot be safely scheduled within deadline without exceeding transformer 100 kW threshold.',
      },
    },
  };

  const currentProfile = scenarioProfiles[activeScenario] || scenarioProfiles.EVENING_RUSH;
  const { currentPrice, lowestPrice, solarNow, savings, tariffTiers, windows, callout } =
    currentProfile;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Scenario Selector Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
            <IndianRupee className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Dynamic Tariff &amp; Incentive Center
              </h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                activeScenario === 'VALLEY_SHIFT'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : activeScenario === 'INFEASIBLE_REQUEST'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {activeScenario === 'VALLEY_SHIFT' ? 'Coordinated' : activeScenario === 'INFEASIBLE_REQUEST' ? 'Stress Mode' : 'Baseline'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {currentProfile.tagline}
            </p>
          </div>
        </div>

        {/* Current Scenario Dropdown */}
        <div className="relative self-stretch sm:self-auto min-w-[240px]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Current Scenario
          </span>
          <button
            type="button"
            onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
            className="w-full inline-flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 text-xs font-bold text-slate-800 shadow-2xs transition-colors cursor-pointer"
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
      </div>

      {/* 4 Pricing KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Current Price */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              activeScenario === 'VALLEY_SHIFT'
                ? 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                : 'bg-rose-50 border border-rose-100 text-rose-500'
            }`}>
              <Zap className={`h-5 w-5 ${activeScenario === 'VALLEY_SHIFT' ? 'fill-emerald-500/20' : 'fill-rose-500/20'}`} />
            </div>
            <span className="text-xs font-bold text-slate-400">Current Price</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {currentPrice.amount} <span className="text-sm font-semibold text-slate-500 font-sans">/ kWh</span>
            </div>
            <div className="mt-2.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${currentPrice.badgeClass}`}>
                {currentPrice.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1.5 truncate">
              {currentPrice.subtext}
            </p>
          </div>
        </div>

        {/* 2. Lowest Price Today */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Lowest Price Today</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {lowestPrice.amount} <span className="text-sm font-semibold text-slate-500 font-sans">/ kWh</span>
            </div>
            <div className="mt-2.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${lowestPrice.badgeClass}`}>
                {lowestPrice.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1.5 truncate">
              {lowestPrice.subtext}
            </p>
          </div>
        </div>

        {/* 3. Solar Generation (Now) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Sun className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Solar Generation (Now)</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {solarNow.amount} <span className="text-sm font-semibold font-sans text-slate-500">{solarNow.unit}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold">
              <span className={solarNow.trendIsUp ? 'text-emerald-600' : 'text-rose-600'}>
                {solarNow.trend}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1.5 truncate">
              {solarNow.subtext}
            </p>
          </div>
        </div>

        {/* 4. Estimated Savings */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Estimated Savings</span>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-tabular">
              {savings.amount}
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-tabular ${savings.badgeClass}`}>
                {savings.badgeLabel}
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate">
                {savings.subtext}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1.5 truncate">
              {activeScenario === 'VALLEY_SHIFT' ? 'All 5 flexible EVs fully optimized' : activeScenario === 'INFEASIBLE_REQUEST' ? 'Restricted by 100 kW limit' : 'Shift flexible EVs to unlock'}
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Electricity Tariff (Today) Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Hourly Electricity Tariff (Today)
            </h2>
            <div className="group relative">
              <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-20 pointer-events-none">
                Demand-responsive dynamic tariffs adjust pricing dynamically to flatten EV charging spikes.
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium ml-2">
              • Reflecting {currentScenarioName}
            </span>
          </div>

          {/* View Switcher: Table | Timeline */}
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          /* 5-Column Table layout matching Mockup Image 3 */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/70 text-slate-500 text-xs uppercase font-semibold">
                  <th className="py-3 px-4 font-bold text-slate-600">Hour</th>
                  {tariffTiers.map((t) => (
                    <th key={t.hourRange} className="py-3 px-4 text-center font-bold text-slate-800">
                      {t.hourRange}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Demand Tier Row */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-700">Demand Tier</td>
                  {tariffTiers.map((t) => (
                    <td key={t.hourRange} className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-xl font-bold text-xs border ${t.badgeClass}`}
                      >
                        {t.label}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Price (₹/kWh) Row */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-700">Price (₹/kWh)</td>
                  {tariffTiers.map((t) => (
                    <td key={t.hourRange} className="py-4 px-4 text-center">
                      <span className="text-base font-black text-slate-900 font-tabular tracking-tight">
                        {t.price}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          /* Timeline 24h interactive strip */
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
              {Array.from({ length: 24 }).map((_, hour) => {
                const tier = tariffTiers.find((t) => t.hours.includes(hour)) || tariffTiers[0];
                return (
                  <div
                    key={hour}
                    className="flex flex-col items-center group cursor-pointer"
                    title={`Hour ${String(hour).padStart(2, '0')}:00 - ${tier.label} (${tier.price}/kWh)`}
                  >
                    <div
                      className={`h-10 w-full rounded-md border transition-transform group-hover:scale-105 ${tier.badgeClass}`}
                    />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      {String(hour).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2">
              {tariffTiers.map((t) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  <span className={`h-3 w-3 rounded-full border ${t.badgeClass}`} />
                  <span className="text-slate-600 font-medium">
                    {t.label} ({t.price}/kWh)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Charging Windows Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Recommended Charging Windows
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Best time slots to charge based on lowest price and available grid capacity under {currentScenarioName}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Window Card */}
          <div className={`${windows.best.cardClass} rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wide ${windows.best.badgeClass}`}>
                {windows.best.title}
              </span>
              <div className={`h-7 w-7 rounded-full text-white flex items-center justify-center ${windows.best.iconBg}`}>
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight">
                {windows.best.hours}
              </div>
              <div className="text-xs font-bold text-emerald-700 mt-1 font-tabular">{windows.best.price}</div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                {windows.best.desc}
              </p>
            </div>
          </div>

          {/* Good Window Card */}
          <div className={`${windows.good.cardClass} rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wide ${windows.good.badgeClass}`}>
                {windows.good.title}
              </span>
              <div className={`h-7 w-7 rounded-full text-white flex items-center justify-center ${windows.good.iconBg}`}>
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight">
                {windows.good.hours}
              </div>
              <div className="text-xs font-bold text-sky-700 mt-1 font-tabular">{windows.good.price}</div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                {windows.good.desc}
              </p>
            </div>
          </div>

          {/* Avoid If Possible Card */}
          <div className={`${windows.avoid.cardClass} rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wide ${windows.avoid.badgeClass}`}>
                {windows.avoid.title}
              </span>
              <div className={`h-7 w-7 rounded-full text-white flex items-center justify-center ${windows.avoid.iconBg}`}>
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight">
                {windows.avoid.hours}
              </div>
              <div className="text-xs font-bold text-rose-700 mt-1 font-tabular">
                {windows.avoid.price}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                {windows.avoid.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Eco / Alert Callout Banner */}
      <div className={`rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 text-xs sm:text-sm font-medium shadow-2xs transition-all ${callout.bg}`}>
        <div className={`h-9 w-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs ${callout.iconBg}`}>
          <callout.icon className="h-5 w-5" />
        </div>
        <p className="leading-relaxed">
          {callout.text}
        </p>
      </div>
    </div>
  );
}
