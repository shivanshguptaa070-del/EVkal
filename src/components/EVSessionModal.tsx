import { useState } from 'react';
import { X, BatteryCharging, CheckCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { EVSessionInput } from '../types/evSession';
import { validateChargingFeasibility } from '../domain/feasibilityValidator';
import { getVehicleImage } from '../utils/vehicleImages';

const VEHICLE_PRESETS: { model: string; battery: number; defaultPower: number; tagline: string }[] = [
  { model: 'Tata Nexon EV Max', battery: 40.5, defaultPower: 7.2, tagline: 'Comfortable. Electric. Everyday.' },
  { model: 'Hyundai Ioniq 5', battery: 72.6, defaultPower: 11.0, tagline: 'Power your world. Ultra-fast charging.' },
  { model: 'MG ZS EV', battery: 50.3, defaultPower: 7.4, tagline: 'Pure electric luxury SUV.' },
  { model: 'Mahindra XUV400', battery: 39.4, defaultPower: 7.2, tagline: 'All-electric performance.' },
  { model: 'BYD Atto 3', battery: 60.5, defaultPower: 7.0, tagline: 'Born EV. Blade battery technology.' },
  { model: 'Tata Tiago EV', battery: 24.0, defaultPower: 3.3, tagline: 'Effortless urban mobility.' },
];

interface EVSessionFormProps {
  initialVehicle?: EVSessionInput;
  nextId: string;
  onClose: () => void;
  onSave: (vehicle: EVSessionInput) => void;
}

function EVSessionForm({ initialVehicle, nextId, onClose, onSave }: EVSessionFormProps) {
  // Form states initialized directly without useEffect (clean React 19 pattern)
  const [model, setModel] = useState<string>(initialVehicle?.vehicleModel || 'Tata Nexon EV Max');
  const [batteryKwh, setBatteryKwh] = useState<number>(initialVehicle?.batteryCapacityKwh || 40.5);
  const [initialSoc, setInitialSoc] = useState<number>(initialVehicle?.initialSocPct ?? 20);
  const [targetSoc, setTargetSoc] = useState<number>(initialVehicle?.targetSocPct ?? 90);
  const [chargerPower, setChargerPower] = useState<number>(initialVehicle?.chargerMaxPowerKw || 7.4);
  const [arrivalHour, setArrivalHour] = useState<number>(initialVehicle?.arrivalHour ?? 19);
  const [departureHour, setDepartureHour] = useState<number>(initialVehicle?.departureDeadlineHour ?? 7);
  const [isFlexible, setIsFlexible] = useState<boolean>(initialVehicle?.isFlexibilityOptIn ?? true);

  // Real-time calculated energy needed
  const socDiff = Math.max(0, targetSoc - initialSoc);
  const calculatedEnergyNeeded = Number(((batteryKwh * socDiff) / 100).toFixed(2));

  // Current session object for feasibility check
  const candidateSession: EVSessionInput = {
    id: initialVehicle ? initialVehicle.id : nextId,
    driverName: initialVehicle ? initialVehicle.driverName : 'New Driver',
    vehicleModel: model,
    batteryCapacityKwh: batteryKwh,
    initialSocPct: initialSoc,
    targetSocPct: targetSoc,
    requiredEnergyKwh: calculatedEnergyNeeded,
    chargerMaxPowerKw: chargerPower,
    arrivalHour,
    departureDeadlineHour: departureHour,
    chargingEfficiency: 0.92,
    isFlexibilityOptIn: isFlexible,
  };

  const feasibility = validateChargingFeasibility(candidateSession);

  // Handle preset model selection
  const handleModelChange = (selectedModel: string) => {
    setModel(selectedModel);
    const preset = VEHICLE_PRESETS.find((p) => p.model === selectedModel);
    if (preset) {
      setBatteryKwh(preset.battery);
      setChargerPower(preset.defaultPower);
    }
  };

  const currentPreset = VEHICLE_PRESETS.find((p) => p.model === model) || VEHICLE_PRESETS[0];

  return (
    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Configure Charging Session &mdash; Vehicle {candidateSession.id}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Modal Scrollable Content */}
      <div className="p-6 space-y-5 overflow-y-auto flex-1">
        {/* Vehicle Hero Badge */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="h-12 w-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
              <img
                src={getVehicleImage(model)}
                alt={model}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{model}</h3>
              <p className="text-xs text-slate-500 font-medium">{currentPreset.tagline}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {candidateSession.id}
          </span>
        </div>

        {/* Form Columns Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Model</label>
              <select
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {VEHICLE_PRESETS.map((p) => (
                  <option key={p.model} value={p.model}>
                    {p.model} ({p.battery} kWh)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Battery Capacity (kWh)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={batteryKwh}
                  onChange={(e) => setBatteryKwh(Math.max(10, Number(e.target.value)))}
                  className="w-full text-xs font-mono font-semibold p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kWh</span>
              </div>
            </div>

            {/* Current SoC Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Current State of Charge (SoC)</span>
                <span className="font-mono font-bold text-slate-900">{initialSoc}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={initialSoc}
                onChange={(e) => setInitialSoc(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Target SoC Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Target State of Charge</span>
                <span className="font-mono font-bold text-emerald-700">{targetSoc}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={targetSoc}
                onChange={(e) => setTargetSoc(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Calculated Energy Needed Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BatteryCharging className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block">Calculated Energy Needed</span>
                  <span className="text-[10px] text-slate-500">
                    Energy to charge from {initialSoc}% to {targetSoc}%
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-slate-900">
                {calculatedEnergyNeeded.toFixed(2)} kWh
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Arrival Hour */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Arrival Time</label>
              <select
                value={arrivalHour}
                onChange={(e) => setArrivalHour(Number(e.target.value))}
                className="w-full text-xs font-mono font-semibold p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}:00 hrs
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Hour */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Departure Deadline</label>
              <select
                value={departureHour}
                onChange={(e) => setDepartureHour(Number(e.target.value))}
                className="w-full text-xs font-mono font-semibold p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}:00 hrs {i <= arrivalHour ? '(Next Day)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Charger Connection Pills */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Charger Connection</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChargerPower(3.3)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    chargerPower === 3.3
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  3.3 kW AC Slow
                </button>
                <button
                  type="button"
                  onClick={() => setChargerPower(7.4)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    chargerPower >= 7.0
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  7.4 kW AC Fast
                </button>
              </div>
            </div>

            {/* Summary Breakdown Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Available Window:</span>
                <span className="font-mono font-bold text-slate-900">{feasibility.availableWindowHours} hours</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Minimum Charging Time:</span>
                <span className="font-mono font-bold text-slate-900">{feasibility.minimumRequiredHours} hours</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Charger Power:</span>
                <span className="font-mono font-bold text-slate-900">{chargerPower} kW</span>
              </div>
              <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1">
                <span>Estimated Cost (Optimized):</span>
                <span className="font-mono font-bold text-emerald-700">
                  &#8377;{(calculatedEnergyNeeded * 3.85).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Smart Scheduling Toggle */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Allow EVkal Smart Scheduling</span>
              <span className="text-[11px] text-emerald-800 font-medium">
                Shifts charging into 23:00 &ndash; 05:00 off-peak valley slots. Saves up to 67% on tariff.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFlexible(!isFlexible)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isFlexible ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={isFlexible}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isFlexible ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Live Feasibility Banner (D02 / D04 Mathematical Guarantee) */}
        {feasibility.isFeasible ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold text-emerald-900 block mb-0.5">Schedule Feasible</span>
              <span className="text-emerald-800">
                {calculatedEnergyNeeded} kWh can be fully delivered in {feasibility.minimumRequiredHours} hours before the{' '}
                {String(departureHour).padStart(2, '0')}:00 deadline at {chargerPower} kW.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold text-red-900 block mb-0.5">Schedule Infeasible</span>
              <span className="text-red-800">
                {feasibility.rejectionReason} {feasibility.recommendedAdjustment}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(candidateSession)}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm shadow-emerald-500/20"
        >
          <span>Save &amp; Update Simulation</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function EVSessionModal() {
  const { isModalOpen, selectedVehicleId, evFleet, closeSessionModal, updateVehicleSession, addVehicleSession } =
    useSimulationStore();

  if (!isModalOpen) return null;

  const selectedVehicle = evFleet.find((ev) => ev.id === selectedVehicleId);
  const nextId = `EV-0${evFleet.length + 1}`;

  const handleSave = (vehicle: EVSessionInput) => {
    if (selectedVehicle) {
      updateVehicleSession(vehicle);
    } else {
      addVehicleSession(vehicle);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <EVSessionForm
        key={selectedVehicleId || 'new'}
        initialVehicle={selectedVehicle}
        nextId={nextId}
        onClose={closeSessionModal}
        onSave={handleSave}
      />
    </div>
  );
}
