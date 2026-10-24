import {
  Compass,
  AlertTriangle,
  PlusCircle,
  CalendarCheck,
  TrendingUp,
  Sprout,
  Zap,
  User,
  ShieldCheck,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { useSimulationStore, type P1SubPage } from '../store/useSimulationStore';
import { getUserInitials } from '../utils/userInitials';

interface P2PNavItem {
  id: P1SubPage;
  title: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const P2P_NAV_ITEMS: P2PNavItem[] = [
  {
    id: 'P2P_EXPLORE',
    title: 'Explore & Map',
    badge: 'Live',
    icon: Compass,
  },
  {
    id: 'P2P_EMERGENCY',
    title: 'Emergency Assist',
    badge: 'SOS',
    icon: AlertTriangle,
  },
  {
    id: 'P2P_LIST_CHARGER',
    title: 'List Your Charger',
    badge: '₹4,662/m',
    icon: PlusCircle,
  },
  {
    id: 'P2P_BOOKINGS',
    title: 'My Bookings',
    badge: 'Passcode',
    icon: CalendarCheck,
  },
  {
    id: 'P2P_EARNINGS',
    title: 'Host Hub & Earnings',
    badge: 'Wallbox',
    icon: TrendingUp,
  },
];

export function P1SidebarNav() {
  const {
    activeP1SubPage,
    setActiveP1SubPage,
    setActiveTab,
    p2pQuery,
    userProfile,
    openProfileView,
  } = useSimulationStore();

  const isCriticalBattery = (p2pQuery.vehicleBatteryPct ?? 7) <= 10;

  return (
    <aside className="w-60 xl:w-64 shrink-0 bg-[#07131F] text-slate-300 flex flex-col justify-between p-5 border-r border-slate-800/80 sticky top-0 h-screen z-40 overflow-y-auto">
      <div className="space-y-5">
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

          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black tracking-wider uppercase">
              P2P Community
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Radio className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
              <span>Delhi-NCR</span>
            </span>
          </div>
        </div>

        {/* Switch to Grid Management (P0) Button */}
        <div className="pt-1">
          <button
            type="button"
            id="p2p-switch-to-p0-grid"
            onClick={() => setActiveTab('P0_GRID')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-850 text-slate-300 hover:text-white transition-all text-left shadow-sm group cursor-pointer"
            title="Switch back to Grid Dashboard (P0)"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white leading-tight">
                  Grid Dashboard (P0)
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Feeder &amp; EV Fleet
                </div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Marketplace Functions
          </div>

          <nav className="space-y-1.5">
            {P2P_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeP1SubPage === item.id;
              const isEmergency = item.id === 'P2P_EMERGENCY';

              return (
                <button
                  key={item.id}
                  id={`p2p-nav-${item.id.toLowerCase()}`}
                  type="button"
                  onClick={() => setActiveP1SubPage(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00A86B] text-white shadow-lg shadow-emerald-600/30 font-bold'
                      : isEmergency && isCriticalBattery
                      ? 'text-amber-400 hover:text-white hover:bg-amber-500/10 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : isEmergency && isCriticalBattery
                          ? 'text-amber-400 animate-pulse'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="tracking-wide text-[12.5px] text-left">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isEmergency && isCriticalBattery
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Profile + Community Callout */}
      <div className="space-y-3 pt-4 border-t border-slate-800/60">
        {/* User Mini Profile */}
        <div
          onClick={openProfileView}
          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-colors"
          title="Open Profile Settings"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full ring-1 ring-emerald-500/60 overflow-hidden bg-slate-800 shrink-0">
              <img
                src={userProfile.personal.avatarUrl}
                alt={userProfile.personal.fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="h-full w-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {getUserInitials(userProfile?.personal?.fullName)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {userProfile.personal.fullName}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Host</span>
              </div>
            </div>
          </div>
          <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        </div>

        {/* Community Impact Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#062633] to-[#02141A] border border-cyan-800/40 p-3.5 text-left shadow-md">
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                Neighborhood Net
              </span>
            </div>
            <div className="text-xs font-bold text-white">42 Community Wallboxes</div>
            <p className="text-[10.5px] text-cyan-300/80 font-medium">
              Relieving up to 310 kW peak residential grid stress
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
