import {
  Home,
  LayoutDashboard,
  Car,
  IndianRupee,
  Calendar,
  BarChart3,
  Sprout,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useSimulationStore, type P0SubPage } from '../store/useSimulationStore';

interface NavItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isLanding?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'LANDING',
    title: 'Landing Page',
    icon: Home,
    isLanding: true,
  },
  {
    id: 'PAGE_1_DASHBOARD',
    title: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'PAGE_2_FLEET',
    title: 'EV Fleet',
    icon: Car,
  },
  {
    id: 'PAGE_3_TARIFF',
    title: 'Dynamic Tariff',
    icon: IndianRupee,
  },
  {
    id: 'PAGE_4_SCHEDULER',
    title: 'Scheduler',
    icon: Calendar,
  },
  {
    id: 'PAGE_5_RESULTS',
    title: 'Results',
    icon: BarChart3,
  },
];

export function P0SidebarNav() {
  const { activeP0SubPage, setActiveP0SubPage, setActiveTab, activeTab } = useSimulationStore();

  return (
    <aside className="w-60 xl:w-64 shrink-0 bg-[#07131F] text-slate-300 flex flex-col justify-between p-5 border-r border-slate-800/80 sticky top-0 h-screen z-40">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-1 pt-1">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab('LANDING')}
            title="Go to EVkal Landing Page"
          >
            <div className="relative flex items-center justify-center">
              <span className="text-2xl font-black tracking-tight text-white flex items-center font-sans group-hover:text-emerald-400 transition-colors">
                E
                <span className="relative">
                  V
                  <Sprout className="h-4 w-4 text-emerald-400 absolute -top-2.5 -right-1 transform rotate-12 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                </span>
                <span className="text-2xl font-black tracking-tight text-emerald-400 ml-0.5">kal</span>
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-1">
            Smarter Charging &bull; Stronger Grids
          </p>
        </div>

        {/* Switch to P2P Community Sharing (P1) Button */}
        <div className="pt-1">
          <button
            type="button"
            id="p0-switch-to-p1-p2p"
            onClick={() => setActiveTab('P1_P2P')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-850 text-slate-300 hover:text-white transition-all text-left shadow-sm group cursor-pointer"
            title="Switch to P1 Community Charger Sharing"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white leading-tight">
                  P2P Charger Sharing (P1)
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Delhi Community Radar
                </div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isLanding = item.isLanding;
            const isActive = isLanding
              ? activeTab === 'LANDING'
              : activeTab === 'P0_GRID' && activeP0SubPage === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id.toLowerCase()}`}
                type="button"
                onClick={() => {
                  if (isLanding) {
                    setActiveTab('LANDING');
                  } else {
                    setActiveTab('P0_GRID');
                    setActiveP0SubPage(item.id as P0SubPage);
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00A86B] text-white shadow-lg shadow-emerald-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="tracking-wide text-[13px]">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Eco Callout Card (media_1792781020968.jpg) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#063326] to-[#021A13] border border-emerald-800/50 p-4 text-left shadow-lg">
        <div className="relative z-10 space-y-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">Cleaner Grids</h4>
            <p className="text-[11px] text-emerald-400/90 font-medium">Greener Tomorrow</p>
          </div>
        </div>

        {/* Decorative Wind Turbine & Rolling Hills SVG graphic */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-30">
          <svg width="100" height="70" viewBox="0 0 100 70" fill="none">
            {/* Hills */}
            <path d="M-10 70 Q 25 45 60 70 Z" fill="#10B981" />
            <path d="M40 70 Q 75 40 110 70 Z" fill="#059669" />
            {/* Wind turbine mast */}
            <line x1="75" y1="20" x2="75" y2="60" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
            {/* Wind turbine rotor */}
            <circle cx="75" cy="20" r="2.5" fill="#34D399" />
            <line x1="75" y1="20" x2="60" y2="10" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="75" y1="20" x2="90" y2="15" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="75" y1="20" x2="75" y2="35" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
