import { Plus, Car, Edit2, AlertCircle } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 text-xs font-bold transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add EV Session</span>
        </button>
      </div>

      <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3">Vehicle Model</th>
                <th className="py-2.5 px-3 text-right">Battery (kWh)</th>
                <th className="py-2.5 px-3 text-right">Energy (kWh)</th>
                <th className="py-2.5 px-3 text-center">Arrival</th>
                <th className="py-2.5 px-3 text-center">Departure</th>
                <th className="py-2.5 px-3 text-center">Smart Scheduling</th>
                <th className="py-2.5 px-2 text-center w-8"></th>
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
                    <td className="py-2 px-3 font-mono text-slate-600 font-semibold">{index + 1}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${
                            isInfeasibleVehicle
                              ? 'bg-red-100 text-red-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isInfeasibleVehicle ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <Car className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">
                            {ev.vehicleModel}
                          </span>
                          <span className="text-[10px] text-slate-600 font-mono">
                            {ev.id} &middot; {ev.driverName.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right font-mono-numbers font-medium text-slate-700">
                      {ev.batteryCapacityKwh.toFixed(1)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono-numbers font-bold text-slate-900">
                      {ev.requiredEnergyKwh.toFixed(1)}
                    </td>
                    <td className="py-2 px-3 text-center font-mono-numbers text-slate-600">
                      {String(ev.arrivalHour).padStart(2, '0')}:00
                    </td>
                    <td className="py-2 px-3 text-center font-mono-numbers text-slate-600">
                      {String(ev.departureDeadlineHour).padStart(2, '0')}:00
                    </td>
                    <td className="py-2 px-3 text-center">
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
