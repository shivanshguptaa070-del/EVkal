import {
  Compass,
  PlusCircle,
  Calendar,
  Wallet,
  Crown,
  Zap,
  ShieldCheck,
  ArrowRight,
  Home,
  Lock,
} from 'lucide-react';
import { useSimulationStore, type P2PSubView } from '../store/useSimulationStore';

export function P2PSidebar() {
  const { p2pSubView, setP2PSubView, setActiveTab, isHostAuthenticated } = useSimulationStore();

  const isCurrent = (view: P2PSubView) => {
    if (view === 'FIND_CHARGERS' && (p2pSubView === 'FIND_CHARGERS' || p2pSubView === 'BROWSE')) {
      return true;
    }
    return p2pSubView === view;
  };

  const navItems = [
    {
      id: 'FIND_CHARGERS' as P2PSubView,
      label: 'Find Chargers',
      sublabel: 'Map & Proximity Radar',
      icon: Compass,
      badge: null,
    },
    {
      id: 'HOST_DASHBOARD' as P2PSubView,
      label: 'Host Dashboard',
      sublabel: 'Charger & Requests',
      icon: Home,
      badge: '2 New',
    },
    {
      id: 'LIST_CHARGER' as P2PSubView,
      label: 'List a Charger',
      sublabel: 'Earn passive income',
      icon: PlusCircle,
      badge: 'New',
    },
    {
      id: 'MY_BOOKINGS' as P2PSubView,
      label: 'My Bookings',
      sublabel: 'Track active sessions',
      icon: Calendar,
      badge: '2',
    },
    {
      id: 'HOST_EARNINGS' as P2PSubView,
      label: 'Host Earnings',
      sublabel: isHostAuthenticated ? '₹4,662 this month' : 'Host Login Required',
      icon: isHostAuthenticated ? Wallet : Lock,
      badge: isHostAuthenticated ? '+12%' : 'Locked',
    },
    {
      id: 'MEMBERSHIP' as P2PSubView,
      label: 'Membership',
      sublabel: 'Plans & Pricing',
      icon: Crown,
      badge: 'PRO',
    },
  ];

  return (
    <aside className="w-full lg:w-60 shrink-0 bg-white rounded-3xl border border-slate-200/90 p-3.5 shadow-sm space-y-4 select-none">
      {/* Top Profile / Platform Status Mini Card */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs shadow-xs shrink-0 ${
              isHostAuthenticated ? 'bg-[#059669] text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {isHostAuthenticated ? 'ST' : 'EV'}
          </div>
          <div className="leading-tight overflow-hidden">
            <div className="text-xs font-black text-slate-900 truncate">
              {isHostAuthenticated ? 'Shivharsh T.' : 'Guest Driver'}
            </div>
            <div
              className={`flex items-center gap-1 text-[10px] font-bold mt-0.5 truncate ${
                isHostAuthenticated ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              {isHostAuthenticated ? (
                <>
                  <ShieldCheck className="h-3 w-3 shrink-0" />
                  <span>Verified Host</span>
                </>
              ) : (
                <span>Public Driver</span>
              )}
            </div>
          </div>
        </div>

        {!isHostAuthenticated && (
          <button
            type="button"
            onClick={() => setP2PSubView('HOST_EARNINGS')}
            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0"
            title="Login as Host"
          >
            Host Login
          </button>
        )}
      </div>

      {/* Switch to Grid Management (P0) Button */}
      <button
        type="button"
        id="p2p-switch-to-p0-grid"
        onClick={() => setActiveTab('P0_GRID')}
        className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all text-left shadow-xs cursor-pointer group"
        title="Switch to Grid Dashboard (P0)"
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

      {/* Navigation Links Group */}
      <nav className="space-y-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
        {navItems.map((item) => {
          const active = isCurrent(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setP2PSubView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer shrink-0 lg:shrink ${
                active
                  ? 'bg-[#ECFDF5] text-[#059669] font-black shadow-2xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-bold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors ${
                    active ? 'bg-[#059669] text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs tracking-tight">{item.label}</div>
                  <div
                    className={`text-[10px] font-medium hidden lg:block ${
                      active ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {/* Badge */}
              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ml-2 ${
                    active
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Help / Green Community Box */}
      <div className="hidden lg:block p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white space-y-2 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-black">
          <Zap className="h-3.5 w-3.5 fill-white text-white" />
          <span>EVkal Network</span>
        </div>
        <p className="text-[11px] text-emerald-100 font-medium leading-relaxed">
          Sharing excess home solar energy to power South Delhi neighbors safely.
        </p>
      </div>
    </aside>
  );
}
