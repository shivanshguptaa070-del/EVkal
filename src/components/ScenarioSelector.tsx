import { BarChart3, Moon, AlertTriangle } from 'lucide-react';
import { useSimulationStore, type ScenarioPreset } from '../store/useSimulationStore';

export function ScenarioSelector() {
  const { activeScenario, setScenario } = useSimulationStore();

  const scenarios: {
    id: ScenarioPreset;
    label: string;
    sub: string;
    icon: typeof BarChart3;
    activeRing: string;
    activeBg: string;
    activeBorder: string;
    activeIconBg: string;
    activeIconColor: string;
    activeTextColor: string;
  }[] = [
    {
      id: 'EVENING_RUSH',
      label: 'Evening Rush',
      sub: '(Baseline)',
      icon: BarChart3,
      activeRing: 'ring-emerald-500/30',
      activeBg: 'bg-emerald-50/70',
      activeBorder: 'border-emerald-500',
      activeIconBg: 'bg-emerald-100',
      activeIconColor: 'text-emerald-700',
      activeTextColor: 'text-emerald-800',
    },
    {
      id: 'VALLEY_SHIFT',
      label: 'Valley Shift',
      sub: '(Optimized)',
      icon: Moon,
      activeRing: 'ring-blue-500/30',
      activeBg: 'bg-blue-50/70',
      activeBorder: 'border-blue-500',
      activeIconBg: 'bg-blue-100',
      activeIconColor: 'text-blue-700',
      activeTextColor: 'text-blue-800',
    },
    {
      id: 'INFEASIBLE_REQUEST',
      label: 'Infeasible',
      sub: 'Request',
      icon: AlertTriangle,
      activeRing: 'ring-red-500/30',
      activeBg: 'bg-red-50/70',
      activeBorder: 'border-red-400',
      activeIconBg: 'bg-red-100',
      activeIconColor: 'text-red-600',
      activeTextColor: 'text-red-800',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold tracking-tight text-slate-800">
        2. Scenario Selection
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setScenario(sc.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? `${sc.activeBg} ${sc.activeBorder} shadow-sm ring-1 ${sc.activeRing}`
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? sc.activeIconBg : 'bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? sc.activeIconColor : 'text-slate-500'}`} />
              </div>
              <div className="min-w-0">
                <span className={`text-xs font-bold block truncate leading-tight ${isActive ? sc.activeTextColor : 'text-slate-800'}`}>
                  {sc.label}
                </span>
                <span className="text-[10px] font-medium text-slate-500 block leading-tight">
                  {sc.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
