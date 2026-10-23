import {
  LayoutDashboard,
  Car,
  IndianRupee,
  Calendar,
  BarChart3,
  Sprout,
  User,
} from 'lucide-react';
import { useSimulationStore, type P0SubPage } from '../store/useSimulationStore';

interface NavItem {
  id: P0SubPage;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
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
  {
    id: 'PAGE_6_PROFILE',
    title: 'Profile',
    icon: User,
  },
];

export function P0SidebarNav() {
  const { activeP0SubPage, setActiveP0SubPage, setActiveTab, activeTab } = useSimulationStore();

  return (
    <aside className="w-60 xl:w-64 shrink-0 bg-[#07131F] text-slate-300 flex flex-col justify-between p-5 border-r border-slate-800/80 min-h-screen sticky top-0 z-40">
      <div className="space-y-7">
        {/* Brand Header */}
        <div className="px-1 pt-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('P0_GRID'); setActiveP0SubPage('PAGE_1_DASHBOARD'); }}>
            <div className="relative flex items-center justify-center">
              <span className="text-2xl font-black tracking-tight text-white flex items-center font-sans">
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

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isProf = item.id === 'PAGE_6_PROFILE';
            const isActive = isProf
              ? activeTab === 'PROFILE' || activeP0SubPage === 'PAGE_6_PROFILE'
              : activeTab === 'P0_GRID' && activeP0SubPage === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id.toLowerCase()}`}
                type="button"
                onClick={() => {
                  if (isProf) {
                    setActiveTab('PROFILE');
                    setActiveP0SubPage('PAGE_6_PROFILE');
                  } else {
                    setActiveTab('P0_GRID');
                    setActiveP0SubPage(item.id);
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
