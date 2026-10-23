import { BarChart3, Moon, AlertTriangle } from 'lucide-react';
import { useSimulationStore, type ScenarioPreset } from '../store/useSimulationStore';

export function ScenarioSelector() {
  const { activeScenario, setScenario } = useSimulationStore();

  const scenarios: { id: ScenarioPreset; label: string; sub: string; icon: typeof BarChart3; color: string }[] = [
    {
      id: 'EVENING_RUSH',
      label: 'Evening Rush',
      sub: '(Baseline)',
      icon: BarChart3,
      color: 'text-emerald-600',
    },
    {
      id: 'VALLEY_SHIFT',
      label: 'Valley Shift',
      sub: '(Optimized)',
      icon: Moon,
      color: 'text-blue-600',
    },
    {
      id: 'INFEASIBLE_REQUEST',
      label: 'Infeasible',
      sub: 'Request',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold tracking-tight text-slate-800">
        2. Scenario Selection
      </h3>

      <div className="grid grid-cols-3 gap-2.5">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setScenario(sc.id)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                  {sc.label}
                </span>
                <span className="text-[11px] font-medium text-slate-600 block leading-tight">
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
