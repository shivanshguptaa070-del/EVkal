import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, AlertOctagon } from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { validateChargingFeasibility } from '../../domain/feasibilityValidator';

export function Page5FeasibilityDiagnostics() {
  const { evFleet, solverOutput, transformerConfig } = useSimulationStore();
  const { summary } = solverOutput;
  const capacity = transformerConfig.ratedCapacityKw;

  // Run feasibility check on each vehicle
  const validationResults = evFleet.map((ev) => ({
    ev,
    result: validateChargingFeasibility(ev),
  }));

  const infeasibleVehicles = validationResults.filter((v) => !v.result.isFeasible);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold font-mono mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
            <span>P0 MODULE 05</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Feasibility Validator &amp; Diagnostic Alert Center
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Pre-flight physics validation, deadline deficit analysis, and transformer overload alarms.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-right">
          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Transformer Status</span>
          <span className={`text-xl font-black font-mono ${summary.optimisedOverloadHours > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
            {summary.optimisedOverloadHours > 0 ? 'OVERLOAD DETECTED' : 'SECURE & OPTIMAL'}
          </span>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`border rounded-2xl p-5 shadow-sm space-y-2 ${
          infeasibleVehicles.length > 0 ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Feasibility Checks</span>
            {infeasibleVehicles.length > 0 ? (
              <AlertOctagon className="h-5 w-5 text-red-600" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div className="text-2xl font-black font-mono">
            {infeasibleVehicles.length === 0 ? 'All Requests Feasible' : `${infeasibleVehicles.length} Infeasible Request(s)`}
          </div>
          <p className="text-xs opacity-80">
            {infeasibleVehicles.length === 0
              ? 'Every vehicle can receive 100% of required energy before deadline.'
              : 'Physical charger power or time window deficit detected.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Critical Overload Hours</span>
            <ShieldAlert className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {summary.optimisedOverloadHours} Hours
          </div>
          <p className="text-xs text-slate-500">
            {summary.optimisedOverloadHours === 0
              ? 'Transformer operates safely inside 100 kW ceiling at all times.'
              : 'Emergency curtailment needed to prevent breaker trip.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Reserve Headroom</span>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {(capacity - summary.optimisedPeakKw).toFixed(1)} kW
          </div>
          <p className="text-xs text-slate-500">
            Unused transformer capacity during optimized peak load.
          </p>
        </div>
      </div>

      {/* Infeasible Requests Breakdown (if any) */}
      {infeasibleVehicles.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Action Required: Physics Feasibility Violation</span>
          </div>
          {infeasibleVehicles.map(({ ev, result }) => (
            <div key={ev.id} className="bg-white rounded-xl p-4 border border-red-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{ev.vehicleModel} ({ev.id} &middot; {ev.driverName})</span>
                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold font-mono">
                  Deficit: {result.deficitKwh?.toFixed(1)} kWh
                </span>
              </div>
              <p className="text-slate-600">
                Vehicle requested <span className="font-bold text-slate-900">{ev.requiredEnergyKwh} kWh</span> within a{' '}
                <span className="font-bold text-slate-900">
                  {((ev.departureDeadlineHour + 24 - ev.arrivalHour) % 24)}h
                </span>{' '}
                window via a {ev.chargerMaxPowerKw} kW charger. Maximum deliverable is only{' '}
                <span className="font-bold text-slate-900">{result.maxDeliverableEnergyKwh?.toFixed(1)} kWh</span>.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Recommended Solution: Extend departure by +{result.recommendedExtensionHours} hours (New departure:{' '}
                  {String((ev.departureDeadlineHour + (result.recommendedExtensionHours ?? 0)) % 24).padStart(2, '0')}:00 IST)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle Pre-Flight Roster */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          Individual Vehicle Pre-Flight Validation Status
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Arrival</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3 text-right">Requested</th>
                <th className="py-2.5 px-3 text-right">Max Deliverable</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {validationResults.map(({ ev, result }) => (
                <tr key={ev.id} className={!result.isFeasible ? 'bg-red-50/50' : 'hover:bg-slate-50/60'}>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{ev.vehicleModel} ({ev.id})</td>
                  <td className="py-2.5 px-3 text-slate-600">{String(ev.arrivalHour).padStart(2, '0')}:00</td>
                  <td className="py-2.5 px-3 text-slate-600">{String(ev.departureDeadlineHour).padStart(2, '0')}:00</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">{ev.requiredEnergyKwh.toFixed(1)} kWh</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{result.maxDeliverableEnergyKwh.toFixed(1)} kWh</td>
                  <td className="py-2.5 px-3 text-center">
                    {result.isFeasible ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        PASSED
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                        DEFICIT (-{result.deficitKwh?.toFixed(1)} kWh)
                      </span>
                    )}
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
