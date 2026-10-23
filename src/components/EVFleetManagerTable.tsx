import { Plus, Edit2, AlertCircle } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

// Sleek model-specific vehicle front silhouettes matching reference mockup
function VehicleAvatar({ model, isInfeasible }: { model: string; isInfeasible: boolean }) {
  if (isInfeasible) {
    return (
      <div className="h-7 w-9 rounded-md bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
        <AlertCircle className="h-4 w-4" />
      </div>
    );
  }

  // Model-specific styled mini front-face SVGs
  const isNexon = model.includes('Nexon');
  const isIoniq = model.includes('Ioniq');
  const isTiago = model.includes('Tiago');
  const isZS = model.includes('MG') || model.includes('ZS');
  const isXUV = model.includes('XUV');
  const isBYD = model.includes('BYD');

  const mainColor = isNexon
    ? '#0284C7' // Teal Blue
    : isIoniq
    ? '#475569' // Cyber Dark Gray
    : isTiago
    ? '#0D9488' // Teal Mist
    : isZS
    ? '#B91C1C' // Dark Red
    : isXUV
    ? '#D97706' // Copper Bronze
    : isBYD
    ? '#2563EB' // Electric Blue
    : '#334155';

  return (
    <div className="h-7 w-9 rounded-md bg-slate-100/90 border border-slate-200/90 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-inner">
      <svg viewBox="0 0 40 26" className="w-full h-full" fill="none">
        {/* Car Cabin / Windshield */}
        <path
          d="M10 13 L14 4 L26 4 L30 13 Z"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="0.8"
        />
        {/* Windshield Reflection */}
        <path d="M15 6 L22 6 L21 11 L14 11 Z" fill="#94A3B8" opacity="0.3" />
        {/* Car Hood & Bumper */}
        <rect x="4" y="12" width="32" height="11" rx="3.5" fill={mainColor} />
        {/* Front Grille */}
        <rect x="12" y="16" width="16" height="4.5" rx="1.5" fill="#0F172A" />
        {/* Headlights */}
        <ellipse cx="8" cy="14.5" rx="2.5" ry="1.2" fill="#E2E8F0" />
        <ellipse cx="32" cy="14.5" rx="2.5" ry="1.2" fill="#E2E8F0" />
        <ellipse cx="8" cy="14.5" rx="1.2" ry="0.6" fill="#38BDF8" />
        <ellipse cx="32" cy="14.5" rx="1.2" ry="0.6" fill="#38BDF8" />
        {/* Wheels preview */}
        <rect x="5" y="21" width="4" height="2" rx="1" fill="#0F172A" />
        <rect x="31" y="21" width="4" height="2" rx="1" fill="#0F172A" />
      </svg>
    </div>
  );
}

export function EVFleetManagerTable() {
  const { evFleet, toggleVehicleFlexibility, openSessionModal } = useSimulationStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-800">
          3. EV Fleet Charging Sessions
        </h3>
        <button
          type="button"
          onClick={() => openSessionModal()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add EV Session</span>
        </button>
      </div>

      <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-2 w-6 text-center">#</th>
                <th className="py-2.5 px-2">Vehicle Model</th>
                <th className="py-2.5 px-2 text-right">Battery (kWh)</th>
                <th className="py-2.5 px-2 text-right">Energy (kWh)</th>
                <th className="py-2.5 px-2 text-center">Arrival</th>
                <th className="py-2.5 px-2 text-center">Departure</th>
                <th className="py-2.5 px-2 text-center">Smart Scheduling</th>
                <th className="py-2.5 px-1 text-center w-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evFleet.map((ev, index) => {
                const isInfeasibleVehicle = ev.id === 'EV-FAIL';
                return (
                  <tr
                    key={ev.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isInfeasibleVehicle ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <td className="py-2 px-2 text-center font-mono text-slate-600 font-semibold">{index + 1}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <VehicleAvatar model={ev.vehicleModel} isInfeasible={isInfeasibleVehicle} />
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight text-xs">
                            {ev.vehicleModel}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {ev.id} &middot; {ev.driverName.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right font-mono-numbers font-medium text-slate-700">
                      {ev.batteryCapacityKwh.toFixed(1)}
                    </td>
                    <td className="py-2 px-2 text-right font-mono-numbers font-bold text-slate-900">
                      {ev.requiredEnergyKwh.toFixed(1)}
                    </td>
                    <td className="py-2 px-2 text-center font-mono-numbers text-slate-600">
                      {String(ev.arrivalHour).padStart(2, '0')}:00
                    </td>
                    <td className="py-2 px-2 text-center font-mono-numbers text-slate-600">
                      {String(ev.departureDeadlineHour).padStart(2, '0')}:00
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => toggleVehicleFlexibility(ev.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          ev.isFlexibilityOptIn ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        role="switch"
                        aria-checked={ev.isFlexibilityOptIn}
                        aria-label={`Toggle Smart Scheduling for ${ev.vehicleModel}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            ev.isFlexibilityOptIn ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => openSessionModal(ev.id)}
                        className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Edit Session Parameters"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
