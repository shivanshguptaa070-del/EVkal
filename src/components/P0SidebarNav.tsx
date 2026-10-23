import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Car,
  CircleDollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useSimulationStore, type P0SubPage } from '../store/useSimulationStore';

interface NavItem {
  id: P0SubPage;
  pageNumber: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'PAGE_1_OPTIMIZER',
    pageNumber: '01',
    title: 'Grid Optimization',
    subtitle: 'Dual-curve load & fleet controls',
    icon: LayoutDashboard,
    tag: 'Main',
  },
  {
    id: 'PAGE_2_TRANSFORMER',
    pageNumber: '02',
    title: 'Transformer Analytics',
    subtitle: 'Feeder load & thermal health',
    icon: Cpu,
    tag: 'Feeder',
  },
  {
    id: 'PAGE_3_FLEET',
    pageNumber: '03',
    title: 'EV Fleet Scheduling',
    subtitle: 'Roster & flexibility solver',
    icon: Car,
    tag: 'Fleet',
  },
  {
    id: 'PAGE_4_TARIFF',
    pageNumber: '04',
    title: 'Tariff & Economics',
    subtitle: 'TOU pricing & fleet savings',
    icon: CircleDollarSign,
    tag: 'Tariff',
  },
  {
    id: 'PAGE_5_DIAGNOSTICS',
    pageNumber: '05',
    title: 'Feasibility & Alerts',
    subtitle: 'Overload alerts & deadline checks',
    icon: AlertTriangle,
    tag: 'Safety',
  },
];

export function P0SidebarNav() {
  const { activeP0SubPage, setActiveP0SubPage } = useSimulationStore();
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);

  return (
    <aside
      className={`transition-all duration-300 ease-in-out shrink-0 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      aria-label="P0 Core Features Navigation"
    >
      <div className="space-y-4">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 px-1">
          {!isCollapsed && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>P0 Core Features</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">5 Dedicated Sub-Pages</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors mx-auto"
            title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Item List */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeP0SubPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveP0SubPage(item.id)}
                className={`w-full group flex items-center gap-3 p-2.5 rounded-xl text-left transition-all relative ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                }`}
                title={`${item.pageNumber}. ${item.title}`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute -left-1 top-2 bottom-2 w-1.5 bg-emerald-600 rounded-r-full" />
                )}

                {/* Number Badge or Icon */}
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Text Labels (when expanded) */}
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs truncate block leading-snug">
                        <span className="font-mono text-[10px] opacity-75 mr-1">{item.pageNumber}.</span>
                        {item.title}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono uppercase font-semibold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] truncate block leading-tight ${
                        isActive ? 'text-emerald-100' : 'text-slate-600 font-normal'
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      {!isCollapsed && (
        <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-600 px-1 font-mono">
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Live Sync
            </span>
          </div>
          <div className="text-[10px] text-slate-600 mt-1">Hackathon Track: #053</div>
        </div>
      )}
    </aside>
  );
}
