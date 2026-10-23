import { useState } from 'react';
import {
  X,
  Zap,
  ShieldCheck,
  Check,
  Lock,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Leaf,
  PlusCircle,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ChargerListing, ConnectorType, DayTimeWindow } from '../types/p2p';

const LOCALITY_PRESETS = [
  {
    name: 'Saket Block J, South Delhi (0.9 km)',
    locality: 'Saket Block J, South Delhi',
    address: 'House 14, Lane 2, Saket Block J, New Delhi 110017',
    lat: 28.5280,
    lon: 77.1680,
  },
  {
    name: 'Vasant Kunj Sector B (1.4 km)',
    locality: 'Vasant Kunj Sector B, New Delhi',
    address: 'Pocket 3, Flat 104, Sector B, Vasant Kunj, New Delhi 110070',
    lat: 28.5390,
    lon: 77.1610,
  },
  {
    name: 'Malviya Nagar (1.8 km)',
    locality: 'Malviya Nagar, New Delhi',
    address: 'B-4/29, Ground Floor, Malviya Nagar, New Delhi 110017',
    lat: 28.5310,
    lon: 77.1890,
  },
  {
    name: 'Hauz Khas Enclave (2.2 km)',
    locality: 'Hauz Khas Enclave, New Delhi',
    address: 'Villa 18, Hauz Khas Enclave, New Delhi 110016',
    lat: 28.5480,
    lon: 77.1850,
  },
  {
    name: 'Green Park Main (3.1 km)',
    locality: 'Green Park Main, New Delhi',
    address: 'S-22, Green Park Main, New Delhi 110016',
    lat: 28.5580,
    lon: 77.2020,
  },
];

const AVAILABLE_CONNECTORS: { id: ConnectorType; label: string; desc: string }[] = [
  { id: 'TYPE_2', label: 'Type 2 AC', desc: 'Standard Indian EV AC socket (Nexon, Tiago, ZS EV)' },
  { id: 'CCS_2', label: 'CCS 2', desc: 'Fast DC Combo charging connector' },
  { id: 'BHARAT_AC001', label: 'Bharat AC-001', desc: '15A/16A industrial standard 3-pin outlet' },
  { id: 'CHADEMO', label: 'CHAdeMO', desc: 'DC connector (imported models / Nissan Leaf)' },
];

const POWER_RATINGS = [
  { kw: 3.3, label: '3.3 kW (15A Slow)', tag: 'Safe 16A standard socket' },
  { kw: 7.4, label: '7.4 kW (Wallbox)', tag: 'Most Popular for Home' },
  { kw: 11.0, label: '11.0 kW (3-Phase)', tag: 'Faster AC delivery' },
  { kw: 22.0, label: '22.0 kW (High Power)', tag: 'Commercial / Villa 32A' },
];

type SchedulePreset = 'ALL_DAY' | 'DAYTIME' | 'NIGHT_VALLEY';

export function ListChargerModal() {
  const {
    isListChargerModalOpen,
    closeListChargerModal,
    addChargerListing,
  } = useSimulationStore();

  const [hostName, setHostName] = useState('Shivharsh T.');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customAddress, setCustomAddress] = useState('');
  const [gatePin, setGatePin] = useState('6824');
  const [accessNotes, setAccessNotes] = useState(
    'Covered driveway parking slot #1. 16A wallbox ready. Security guard at gate instructed.'
  );

  const [selectedConnectors, setSelectedConnectors] = useState<ConnectorType[]>(['TYPE_2', 'CCS_2']);
  const [maxPowerKw, setMaxPowerKw] = useState(7.4);
  const [pricePerKwhInr, setPricePerKwhInr] = useState(12.5);
  const [schedulePreset, setSchedulePreset] = useState<SchedulePreset>('NIGHT_VALLEY');

  if (!isListChargerModalOpen) {
    return null;
  }

  const activePreset = LOCALITY_PRESETS[selectedPresetIndex];
  const finalLocality = activePreset.locality;
  const finalAddress = customAddress.trim() || activePreset.address;

  // Toggle connector selection (must have at least one)
  const toggleConnector = (connector: ConnectorType) => {
    if (selectedConnectors.includes(connector)) {
      if (selectedConnectors.length > 1) {
        setSelectedConnectors(selectedConnectors.filter((c) => c !== connector));
      }
    } else {
      setSelectedConnectors([...selectedConnectors, connector]);
    }
  };

  // Generate availability windows
  const generateWindows = (preset: SchedulePreset): DayTimeWindow[] => {
    const days: (1 | 2 | 3 | 4 | 5 | 6 | 7)[] = [1, 2, 3, 4, 5, 6, 7];
    if (preset === 'ALL_DAY') {
      return days.map((day) => ({ dayOfWeek: day, startHour: 0, endHour: 24 }));
    }
    if (preset === 'DAYTIME') {
      return days.map((day) => ({ dayOfWeek: day, startHour: 8, endHour: 20 }));
    }
    // NIGHT_VALLEY (22:00 to 07:00 next morning)
    return days.map((day) => ({ dayOfWeek: day, startHour: 22, endHour: 7 }));
  };

  // Monthly passive income estimation
  // Assuming average 3.5 charging hours per day
  const dailyKwhShared = maxPowerKw * 3.5;
  const monthlyKwh = dailyKwhShared * 30;
  const monthlyGrossRevenue = monthlyKwh * pricePerKwhInr;
  const residentialTariffPerKwh = 6.5; // Average Indian residential tier
  const monthlyNetProfit = monthlyKwh * Math.max(0, pricePerKwhInr - residentialTariffPerKwh);
  const monthlyCo2SavedKg = Math.round(monthlyKwh * 0.72);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newListing: ChargerListing = {
      id: `HOST-COMMUNITY-${randomSuffix}`,
      hostName: hostName.trim() || 'Community Host',
      isHostVerified: true,
      isDemoListing: true,
      connectorTypes: selectedConnectors,
      maxPowerKw,
      pricePerKwhInr: Number(pricePerKwhInr.toFixed(2)),
      availabilityWindows: generateWindows(schedulePreset),
      location: {
        latitude: activePreset.lat,
        longitude: activePreset.lon,
        approximateLocality: finalLocality,
        exactAddress: finalAddress,
      },
      accessNotes: accessNotes.trim() || 'Driveway socket, host available.',
      gatePin: gatePin.trim() || '5432',
    };

    addChargerListing(newListing);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="list-charger-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="list-charger-modal-title"
                className="text-base font-black text-slate-900 tracking-tight"
              >
                List Your Community Charger
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Share your home socket with EV neighbors and earn passive income
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeListChargerModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Host & Location Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>Host Details & Neighborhood</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Host Name / Resident Display
                </label>
                <input
                  type="text"
                  required
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Rajesh K. or Dr. Neha"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Locality / Neighborhood Area
                </label>
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {LOCALITY_PRESETS.map((p, idx) => (
                    <option key={p.name} value={idx}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address & Privacy Guard */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Host Privacy Protection
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Exact door address & gate PIN are hidden from public search with a ±350m privacy circle, and only revealed to a driver once you accept their booking.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Exact Address (Concealed Pre-Booking)
                  </label>
                  <input
                    type="text"
                    value={finalAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Villa 12, Sector C..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Gate / Entry PIN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={gatePin}
                      onChange={(e) => setGatePin(e.target.value)}
                      placeholder="e.g. 4892"
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Parking & Access Instructions
                </label>
                <input
                  type="text"
                  value={accessNotes}
                  onChange={(e) => setAccessNotes(e.target.value)}
                  placeholder="e.g. Driveway slot #2, 16A wall socket, security guard notified."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Charger Hardware Specs */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Connector & Power Output</span>
            </div>

            {/* Connectors Multi-select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Available Plug Types (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_CONNECTORS.map((c) => {
                  const isChecked = selectedConnectors.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleConnector(c.id)}
                      className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-md border flex items-center justify-center mt-0.5 shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="block text-xs font-black text-slate-900">
                          {c.label}
                        </span>
                        <span className="block text-[11px] text-slate-500 leading-tight">
                          {c.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Power kW */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Maximum Charging Power
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POWER_RATINGS.map((p) => (
                  <button
                    key={p.kw}
                    type="button"
                    onClick={() => setMaxPowerKw(p.kw)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      maxPowerKw === p.kw
                        ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 text-slate-900 font-black'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-semibold'
                    }`}
                  >
                    <span className="block text-sm font-black">{p.kw} kW</span>
                    <span className="block text-[10px] text-slate-500 leading-tight mt-0.5">
                      {p.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Availability & Pricing */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span>Availability & Fair Community Pricing</span>
            </div>

            {/* Schedule Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Sharing Schedule Window
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSchedulePreset('NIGHT_VALLEY')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    schedulePreset === 'NIGHT_VALLEY'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Night Off-Peak</span>
                  </div>
                  <span className="block text-[11px] text-slate-500 mt-1">
                    22:00 - 07:00 (Grid Valley Shift)
                  </span>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    Recommended for Grid
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSchedulePreset('ALL_DAY')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    schedulePreset === 'ALL_DAY'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    <span>24/7 Available</span>
                  </div>
                  <span className="block text-[11px] text-slate-500 mt-1">
                    Always open for neighborhood bookings
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSchedulePreset('DAYTIME')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    schedulePreset === 'DAYTIME'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span>Daytime Only</span>
                  </div>
                  <span className="block text-[11px] text-slate-500 mt-1">
                    08:00 - 20:00 (While you work)
                  </span>
                </button>
              </div>
            </div>

            {/* Price Slider */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-900">
                    Your Price per kWh
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Average public fast chargers charge ₹18 - ₹24 / kWh.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">
                    ₹{pricePerKwhInr.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500"> / kWh</span>
                </div>
              </div>

              <input
                type="range"
                min={8}
                max={22}
                step={0.5}
                value={pricePerKwhInr}
                onChange={(e) => setPricePerKwhInr(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span>₹8.00 (Super Cheap)</span>
                <span>₹12.50 (Fair Community Standard)</span>
                <span>₹22.00 (Premium Fast)</span>
              </div>
            </div>

            {/* Live Monthly Passive Income Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-4.5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    Estimated Monthly Earnings
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Net Profit
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{Math.round(monthlyNetProfit).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  / month (Gross: ₹{Math.round(monthlyGrossRevenue).toLocaleString('en-IN')})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Leaf className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">
                    <strong className="text-white">{monthlyCo2SavedKg} kg</strong> CO₂ avoided/mo
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="text-[11px]">
                    ~{Math.round(monthlyKwh)} kWh shared/mo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeListChargerModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Publish Charger to Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
