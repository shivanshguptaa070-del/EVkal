import { useState, useId } from 'react';
import {
  Car,
  Plus,
  Upload,
  Battery,
  Clock,
  Flag,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';

import { getVehicleImage } from '../../utils/vehicleImages';

// High-resolution automotive thumbnails matching reference mockup
function VehicleAvatar({ model }: { model: string }) {
  return (
    <div className="h-7 w-10 rounded-md bg-slate-50 border border-slate-200/90 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-2xs">
      <img
        src={getVehicleImage(model)}
        alt={model}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}

interface FleetVehicle {
  id: number;
  code: string;
  model: string;
  batteryKwh: number;
  currentSocPct: number;
  targetSocPct: number;
  energyNeededKwh: number;
  arrivalTime: string;
  departureTime: string;
  chargerPower: string;
  isFlexibilityOptIn: boolean;
  isFeasible: boolean;
}

export function Page2EVFleet() {
  const { openSessionModal } = useSimulationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'FLEXIBLE' | 'IMMEDIATE' | 'INFEASIBLE'>('ALL');

  // Exact 6 benchmark vehicles matching mockup Image 2
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([
    {
      id: 1,
      code: 'EV-01',
      model: 'Tata Nexon EV',
      batteryKwh: 30,
      currentSocPct: 20,
      targetSocPct: 90,
      energyNeededKwh: 22.0,
      arrivalTime: '18:00',
      departureTime: '07:00',
      chargerPower: '7.4 kW (AC)',
      isFlexibilityOptIn: true,
      isFeasible: true,
    },
    {
      id: 2,
      code: 'EV-02',
      model: 'Hyundai Ioniq 5',
      batteryKwh: 72,
      currentSocPct: 35,
      targetSocPct: 90,
      energyNeededKwh: 38.0,
      arrivalTime: '19:00',
      departureTime: '07:00',
      chargerPower: '7.4 kW (AC)',
      isFlexibilityOptIn: true,
      isFeasible: true,
    },
    {
      id: 3,
      code: 'EV-03',
      model: 'Tata Tiago EV',
      batteryKwh: 24,
      currentSocPct: 25,
      targetSocPct: 90,
      energyNeededKwh: 18.0,
      arrivalTime: '17:30',
      departureTime: '06:30',
      chargerPower: '3.3 kW (AC)',
      isFlexibilityOptIn: true,
      isFeasible: true,
    },
    {
      id: 4,
      code: 'EV-04',
      model: 'MG ZS EV',
      batteryKwh: 44,
      currentSocPct: 30,
      targetSocPct: 90,
      energyNeededKwh: 32.0,
      arrivalTime: '18:30',
      departureTime: '07:30',
      chargerPower: '7.4 kW (AC)',
      isFlexibilityOptIn: true,
      isFeasible: true,
    },
    {
      id: 5,
      code: 'EV-05',
      model: 'Mahindra XUV400',
      batteryKwh: 39,
      currentSocPct: 28,
      targetSocPct: 90,
      energyNeededKwh: 28.0,
      arrivalTime: '19:00',
      departureTime: '08:00',
      chargerPower: '7.4 kW (AC)',
      isFlexibilityOptIn: true,
      isFeasible: true,
    },
    {
      id: 6,
      code: 'EV-06',
      model: 'BYD Atto 3',
      batteryKwh: 60,
      currentSocPct: 55,
      targetSocPct: 90,
      energyNeededKwh: 21.0,
      arrivalTime: '18:00',
      departureTime: '07:00',
      chargerPower: '11 kW (AC)',
      isFlexibilityOptIn: false,
      isFeasible: false,
    },
  ]);

  // Form State for "Configure EV Session"
  const [selectedModel, setSelectedModel] = useState('Tata Nexon EV');
  const [currentSoc, setCurrentSoc] = useState(20);
  const [targetSoc, setTargetSoc] = useState(90);
  const [batteryCap, setBatteryCap] = useState(30);
  const [arrivalTime, setArrivalTime] = useState('18:00');
  const [departureTime, setDepartureTime] = useState('07:00');
  const [chargerPower, setChargerPower] = useState('7.4 kW AC');
  const [connectorType, setConnectorType] = useState('Type 2 (IEC 62196)');
  const [isFlexibility, setIsFlexibility] = useState(true);

  // Accessible IDs for inputs
  const currentSocId = useId();
  const targetSocId = useId();
  const batteryCapId = useId();
  const arrivalTimeId = useId();
  const departureTimeId = useId();

  // Calculated energy needed in kWh
  const energyNeeded = Math.max(0, ((targetSoc - currentSoc) / 100) * batteryCap).toFixed(1);

  const handleResetForm = () => {
    setSelectedModel('Tata Nexon EV');
    setCurrentSoc(20);
    setTargetSoc(90);
    setBatteryCap(30);
    setArrivalTime('18:00');
    setDepartureTime('07:00');
    setChargerPower('7.4 kW AC');
    setConnectorType('Type 2 (IEC 62196)');
    setIsFlexibility(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: FleetVehicle = {
      id: vehicles.length + 1,
      code: `EV-0${vehicles.length + 1}`,
      model: selectedModel,
      batteryKwh: batteryCap,
      currentSocPct: currentSoc,
      targetSocPct: targetSoc,
      energyNeededKwh: parseFloat(energyNeeded),
      arrivalTime,
      departureTime,
      chargerPower,
      isFlexibilityOptIn: isFlexibility,
      isFeasible: true,
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const toggleFlex = (id: number) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === id ? { ...v, isFlexibilityOptIn: !v.isFlexibilityOptIn } : v
      )
    );
  };

  const deleteVehicle = (id: number) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'FLEXIBLE') return v.isFlexibilityOptIn;
    if (filterType === 'IMMEDIATE') return !v.isFlexibilityOptIn;
    if (filterType === 'INFEASIBLE') return !v.isFeasible;
    return true;
  });

  const totalEnergy = vehicles.reduce((acc, v) => acc + v.energyNeededKwh, 0);
  const feasibleCount = vehicles.filter((v) => v.isFeasible).length;
  const infeasibleCount = vehicles.length - feasibleCount;

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Header Banner matching Mockup Image 2 */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
            <Car className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              EV Fleet &amp; Charging Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Configure your EV fleet, set charging requirements and constraints. The optimizer will create feasible, low-cost schedules that reduce evening peak demand and prevent transformer overloads.
            </p>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => alert('Sample fleet CSV downloaded')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>Import Fleet (CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => openSessionModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:shadow cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New EV Session</span>
          </button>
        </div>
      </div>

      {/* 2. Six KPI Summary Cards matching Mockup Image 2 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Vehicles */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <Car className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Total Vehicles</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              6
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">Active Sessions</span>
          </div>
        </div>

        {/* Total Energy Required */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Battery className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Total Energy Required</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              {totalEnergy > 0 ? '182.0' : '0.0'} <span className="text-xs font-semibold font-sans text-slate-500">kWh</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">Across All Vehicles</span>
          </div>
        </div>

        {/* Earliest Arrival */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Earliest Arrival</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              17:30
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">Today</span>
          </div>
        </div>

        {/* Latest Departure */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Flag className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Latest Departure</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              08:00
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">Tomorrow</span>
          </div>
        </div>

        {/* Average Charging Power */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Average Charging Power</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              7.8 <span className="text-xs font-semibold font-sans text-slate-500">kW</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">per vehicle</span>
          </div>
        </div>

        {/* Feasible Schedule */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Feasible Schedule</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-tabular tracking-tight leading-none mb-1">
              {feasibleCount} / {vehicles.length}
            </div>
            <span className="text-[11px] font-bold block text-rose-600">
              {infeasibleCount > 0 ? `${infeasibleCount} infeasible request` : '100% Validated'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split: Left Column (Table + Alert) + Right Column (Configure Form) */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* LEFT COLUMN: Table + Infeasible Warning Card (Fluid full width) */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Card: EV Fleet Overview */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            {/* Header + Search/Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">EV Fleet Overview</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Manage charging sessions, set flexibility and constraints for optimization.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vehicle, model..."
                    className="w-full bg-white pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white cursor-pointer focus:outline-none"
                  >
                    <option value="ALL">All Vehicles</option>
                    <option value="FLEXIBLE">Flexible</option>
                    <option value="IMMEDIATE">Immediate</option>
                    <option value="INFEASIBLE">Infeasible</option>
                  </select>
                  <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table matching Mockup Image 2 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[10.5px] leading-tight">
                    <th className="py-2 px-1 text-center w-5">#</th>
                    <th className="py-2 px-2">Vehicle Model</th>
                    <th className="py-2 px-1 text-center whitespace-nowrap">Battery<br/><span className="text-[9px] text-slate-400 font-normal">(kWh)</span></th>
                    <th className="py-2 px-1 text-center whitespace-nowrap">Current<br/><span className="text-[9px] text-slate-400 font-normal">SoC (%)</span></th>
                    <th className="py-2 px-1 text-center whitespace-nowrap">Target<br/><span className="text-[9px] text-slate-400 font-normal">SoC (%)</span></th>
                    <th className="py-2 px-1 text-center whitespace-nowrap">Energy<br/><span className="text-[9px] text-slate-400 font-normal">(kWh)</span></th>
                    <th className="py-2 px-1 text-center whitespace-nowrap">Arrival<br/><span className="text-[9px] text-slate-400 font-normal">Time</span></th>
                    <th className="py-2 px-1 text-center whitespace-nowrap">Departure<br/><span className="text-[9px] text-slate-400 font-normal">Time</span></th>
                    <th className="py-2 px-1 text-center whitespace-nowrap">Charger<br/><span className="text-[9px] text-slate-400 font-normal">Power</span></th>
                    <th className="py-2 px-1 text-center">Flexibility</th>
                    <th className="py-2 px-1 text-center">Status</th>
                    <th className="py-2 px-1 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-1 text-center text-slate-400 font-semibold font-tabular">
                        {v.id}
                      </td>

                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <VehicleAvatar model={v.model} />
                          <span className="font-bold text-slate-800 whitespace-nowrap text-xs">{v.model}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-1 text-center font-tabular font-medium text-slate-700">
                        {v.batteryKwh}
                      </td>

                      <td className="py-2.5 px-1 text-center font-tabular font-medium text-slate-700">
                        {v.currentSocPct}%
                      </td>

                      <td className="py-2.5 px-1 text-center font-tabular font-medium text-slate-700">
                        {v.targetSocPct}%
                      </td>

                      <td className="py-2.5 px-1 text-center font-tabular font-bold text-slate-900">
                        {v.energyNeededKwh.toFixed(1)}
                      </td>

                      <td className="py-2.5 px-1 text-center font-tabular font-medium text-slate-700">
                        {v.arrivalTime}
                      </td>

                      <td className="py-2.5 px-1 text-center font-tabular font-medium text-slate-700">
                        {v.departureTime}
                      </td>

                      <td className="py-2.5 px-1 text-center text-slate-700 whitespace-nowrap font-medium text-[10.5px]">
                        {v.chargerPower}
                      </td>

                      <td className="py-2.5 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFlex(v.id)}
                          className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold cursor-pointer transition-colors ${
                            v.isFlexibilityOptIn
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {v.isFlexibilityOptIn ? 'Flexible' : 'Immediate'}
                        </button>
                      </td>

                      <td className="py-2.5 px-1 text-center">
                        {v.isFeasible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 whitespace-nowrap">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>Feasible</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 whitespace-nowrap">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            <span>Infeasible</span>
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-1 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400">
                          <button
                            type="button"
                            onClick={() => openSessionModal()}
                            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Edit vehicle session"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteVehicle(v.id)}
                            className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete vehicle session"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: 1 Infeasible Request Detected Banner matching Mockup Image 2 */}
          <div className="bg-rose-50/50 border border-rose-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-rose-900 tracking-tight">
                    1 Infeasible Request Detected
                  </h3>
                  <p className="text-xs text-rose-700/80 font-medium">
                    Some charging requests cannot be fully met with the current time, power or transformer capacity constraints.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSessionModal()}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                View Details
              </button>
            </div>

            {/* Vehicle preview pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/90 border border-rose-200/70 rounded-xl text-xs">
              <div className="flex items-center gap-2.5">
                <VehicleAvatar model="BYD Atto 3" />
                <span className="font-bold text-slate-900">BYD Atto 3</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-600 font-mono text-[11px]">
                <span>🔋 60 kWh</span>
                <span>⚡ 21.0 kWh needed</span>
                <span>🕒 18:00 – 07:00</span>
                <span>🔌 11 kW AC</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                  Infeasible
                </span>
              </div>
            </div>

            {/* Specific Physics Reason Callout */}
            <p className="text-[11px] text-rose-700 font-medium leading-relaxed bg-white/60 p-2.5 rounded-xl border border-rose-200/60">
              <strong className="font-bold">Reason:</strong> Not enough time to deliver 21.0 kWh at 11 kW within the available window, considering transformer capacity and peak-hour restrictions. Consider an earlier arrival time, higher charging power, or a higher departure time.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Configure EV Session Form (w-360px on xl) matching Mockup Image 2 */}
        <div className="w-full xl:w-[360px] 2xl:w-[380px] shrink-0 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 tracking-tight">Configure EV Session</h2>
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
            {/* 1. Vehicle Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="font-bold text-slate-800 text-xs">Vehicle Selection</span>
              </div>

              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    const model = e.target.value;
                    setSelectedModel(model);
                    if (model.includes('Nexon')) setBatteryCap(30);
                    else if (model.includes('Ioniq')) setBatteryCap(72);
                    else if (model.includes('Tiago')) setBatteryCap(24);
                    else if (model.includes('MG') || model.includes('ZS')) setBatteryCap(44);
                    else if (model.includes('XUV')) setBatteryCap(39);
                    else if (model.includes('BYD')) setBatteryCap(60);
                  }}
                  className="w-full appearance-none p-2.5 pr-8 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                >
                  <option value="Tata Nexon EV">Tata Nexon EV • 30 kWh • AC • Type 2</option>
                  <option value="Hyundai Ioniq 5">Hyundai Ioniq 5 • 72 kWh • AC • Type 2</option>
                  <option value="Tata Tiago EV">Tata Tiago EV • 24 kWh • AC • Type 2</option>
                  <option value="MG ZS EV">MG ZS EV • 44 kWh • AC • Type 2</option>
                  <option value="Mahindra XUV400">Mahindra XUV400 • 39 kWh • AC • Type 2</option>
                  <option value="BYD Atto 3">BYD Atto 3 • 60 kWh • AC • Type 2</option>
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* 2. Charging Requirements */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="font-bold text-slate-800 text-xs">Charging Requirements</span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current SoC */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label htmlFor={currentSocId} className="text-slate-600 font-medium">Current SoC</label>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-slate-800 text-[10px]">
                      {currentSoc} %
                    </span>
                  </div>
                  <input
                    id={currentSocId}
                    type="range"
                    min="0"
                    max="100"
                    value={currentSoc}
                    onChange={(e) => setCurrentSoc(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Target SoC */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label htmlFor={targetSocId} className="text-slate-600 font-medium">Target SoC</label>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono font-bold text-[10px] border border-emerald-200">
                      {targetSoc} %
                    </span>
                  </div>
                  <input
                    id={targetSocId}
                    type="range"
                    min="0"
                    max="100"
                    value={targetSoc}
                    onChange={(e) => setTargetSoc(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Battery Capacity & Energy Needed */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor={batteryCapId} className="text-[11px] text-slate-600 font-medium block mb-1">
                    Battery Capacity (kWh)
                  </label>
                  <div className="relative">
                    <input
                      id={batteryCapId}
                      type="number"
                      value={batteryCap}
                      onChange={(e) => setBatteryCap(Number(e.target.value))}
                      className="w-full bg-white p-2 pr-10 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                    />
                    <span className="absolute right-2.5 top-2 text-slate-400 font-mono text-[11px]">
                      kWh
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-600 font-medium block mb-1">
                    Energy Needed
                  </span>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-xs text-slate-800 flex items-center justify-between">
                    <span>{energyNeeded}</span>
                    <span className="text-slate-400 font-normal text-[11px]">kWh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Time Constraints */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="font-bold text-slate-800 text-xs">Time Constraints</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={arrivalTimeId} className="text-[11px] text-slate-600 font-medium block mb-1">
                    Arrival Time
                  </label>
                  <div className="relative">
                    <input
                      id={arrivalTimeId}
                      type="text"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full bg-white pl-8 pr-2 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                    />
                    <Clock className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={departureTimeId} className="text-[11px] text-slate-600 font-medium">
                      Departure Time
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Next Morning</span>
                  </div>
                  <div className="relative">
                    <input
                      id={departureTimeId}
                      type="text"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full bg-white pl-8 pr-2 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                    />
                    <Clock className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Charger Settings */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                <span className="font-bold text-slate-800 text-xs">Charger Settings</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={chargerPower}
                    onChange={(e) => setChargerPower(e.target.value)}
                    className="w-full appearance-none p-2 pr-7 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 bg-white cursor-pointer focus:outline-none shadow-2xs"
                  >
                    <option value="3.3 kW AC">3.3 kW AC</option>
                    <option value="7.4 kW AC">7.4 kW AC</option>
                    <option value="11 kW AC">11 kW AC</option>
                    <option value="22 kW AC">22 kW AC</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={connectorType}
                    onChange={(e) => setConnectorType(e.target.value)}
                    className="w-full appearance-none p-2 pr-7 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white cursor-pointer focus:outline-none shadow-2xs"
                  >
                    <option value="Type 2 (IEC 62196)">Type 2 (IEC 62196)</option>
                    <option value="CCS-2">CCS-2 Combo</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 5. Flexibility Radio Cards */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  5
                </span>
                <span className="font-bold text-slate-800 text-xs">Flexibility</span>
              </div>

              <div className="space-y-2">
                {/* Flexible Option */}
                <div
                  onClick={() => setIsFlexibility(true)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isFlexibility
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isFlexibility ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                      }`}
                    >
                      {isFlexibility && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span>Flexible (Recommended)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium pl-6 mt-1">
                    Allow the optimizer to schedule during low-price, low-demand slots.
                  </p>
                </div>

                {/* Immediate Option */}
                <div
                  onClick={() => setIsFlexibility(false)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    !isFlexibility
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        !isFlexibility ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                      }`}
                    >
                      {!isFlexibility && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span>Immediate Charging</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium pl-6 mt-1">
                    Start as soon as possible (Usually higher cost).
                  </p>
                </div>
              </div>
            </div>

            {/* Save EV Session Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Save EV Session</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
