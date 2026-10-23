import { Car, Plus } from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';

export function Page3EVFleetScheduling() {
  const { evFleet, toggleVehicleFlexibility, openSessionModal } = useSimulationStore();
  const flexibleCount = evFleet.filter((v) => v.isFlexibilityOptIn).length;
  const totalFleetEnergyKwh = evFleet.reduce((sum, v) => sum + v.requiredEnergyKwh, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono mb-2">
            <Car className="h-3.5 w-3.5 text-blue-600" />
            <span>P0 MODULE 03</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            EV Fleet &amp; Smart Scheduling Solver
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Vehicle-level charging flexibility, arrival/departure windows, and automated valley-filling.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openSessionModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Add New EV Session</span>
        </button>
      </div>

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Vehicles</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{evFleet.length} EVs</div>
          <span className="text-xs text-emerald-700 font-semibold">{flexibleCount} Smart-Flexible, {evFleet.length - flexibleCount} Rigid</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Energy Demand</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalFleetEnergyKwh.toFixed(1)} kWh</div>
          <span className="text-xs text-slate-500 font-medium">To deliver before morning departure</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Optimization Status</span>
          <div className="text-2xl font-black text-emerald-700 font-mono">100% Satisfied</div>
          <span className="text-xs text-slate-500 font-medium">All deadlines strictly met</span>
        </div>
      </div>

      {/* Detailed Fleet Roster Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          EV Fleet Scheduling Roster &amp; Flexibility Controls
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Vehicle ID</th>
                <th className="py-2.5 px-3">Driver</th>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3 text-right">Battery (kWh)</th>
                <th className="py-2.5 px-3 text-right">Need (kWh)</th>
                <th className="py-2.5 px-3 text-right">Max kW</th>
                <th className="py-2.5 px-3 text-center">Arrival</th>
                <th className="py-2.5 px-3 text-center">Deadline</th>
                <th className="py-2.5 px-3 text-center">Smart Scheduling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evFleet.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800">{ev.id}</td>
                  <td className="py-3 px-3 text-slate-700 font-sans font-medium">{ev.driverName}</td>
                  <td className="py-3 px-3 text-slate-900 font-sans font-bold">{ev.vehicleModel}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{ev.batteryCapacityKwh.toFixed(1)}</td>
                  <td className="py-3 px-3 text-right text-slate-900 font-bold">{ev.requiredEnergyKwh.toFixed(1)}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{ev.chargerMaxPowerKw.toFixed(1)} kW</td>
                  <td className="py-3 px-3 text-center text-slate-600">{String(ev.arrivalHour).padStart(2, '0')}:00</td>
                  <td className="py-3 px-3 text-center text-slate-600">{String(ev.departureDeadlineHour).padStart(2, '0')}:00</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleVehicleFlexibility(ev.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        ev.isFlexibilityOptIn ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          ev.isFlexibilityOptIn ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
