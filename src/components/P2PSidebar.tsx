import {
  Compass,
  PlusCircle,
  Calendar,
  Wallet,
  Crown,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useSimulationStore, type P2PSubView } from '../store/useSimulationStore';

export function P2PSidebar() {
  const { p2pSubView, setP2PSubView } = useSimulationStore();

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
      sublabel: '₹4,662 this month',
      icon: Wallet,
      badge: '+12%',
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
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-[#059669] text-white flex items-center justify-center font-black text-xs shadow-xs">
          ST
        </div>
        <div className="leading-tight overflow-hidden">
          <div className="text-xs font-black text-slate-900 truncate">
            Shivharsh T.
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
            <ShieldCheck className="h-3 w-3" />
            <span>Community Host</span>
          </div>
        </div>
      </div>

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
