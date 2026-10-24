import { useState } from 'react';
import {
  Zap,
  Users,
  Car,
  Calendar,
  Clock,
  BatteryCharging,
  MapPin,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  Pause,
  Play,
  Plus,
  Edit3,
  ChevronDown,
  Key,
  Copy,
  Radio,
} from 'lucide-react';
import { useSimulationStore, type HostIncomingRequest } from '../store/useSimulationStore';

interface DaySchedule {
  day: string;
  date: string;
  isAvailable: boolean;
  timeWindow: string;
}

export function HostDashboardPage() {
  const {
    hostIncomingRequests,
    acceptHostIncomingRequest,
    declineHostIncomingRequest,
    hostIllustrativeEarnings,
    isHostListingPaused,
    setIsHostListingPaused,
    bookingStage,
    setBookingStage,
  } = useSimulationStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Charger configuration state
  const [chargerDetails, setChargerDetails] = useState({
    type: 'Type 2 AC (IEC 62196)',
    powerKw: 7.4,
    powerLabel: '7.4 kW AC (Level 2)',
    price: '11.50',
    location: 'Vasant Kunj Sector 4, New Delhi',
    exactAddress: 'House 42B, Sector 4, Vasant Kunj, New Delhi 110070',
    gatePin: '7429',
    accessNotes: 'Park on left side of driveway; socket mounted on brick boundary pillar.',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...chargerDetails });

  // Privacy & Safety toggles
  const [hideExactAddress, setHideExactAddress] = useState(true);
  const [allowNewRequests, setAllowNewRequests] = useState(true);
  const [autoExpirePin, setAutoExpirePin] = useState(true);
  const [copiedPin, setCopiedPin] = useState(false);

  // 7-Day Calendar Schedule
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Mon', date: '20 Oct', isAvailable: true, timeWindow: '06:00 - 22:00' },
    { day: 'Tue', date: '21 Oct', isAvailable: true, timeWindow: '06:00 - 22:00' },
    { day: 'Wed', date: '22 Oct', isAvailable: true, timeWindow: '06:00 - 22:00' },
    { day: 'Thu', date: '23 Oct', isAvailable: false, timeWindow: '-' },
    { day: 'Fri', date: '24 Oct', isAvailable: true, timeWindow: '06:00 - 22:00' },
    { day: 'Sat', date: '25 Oct', isAvailable: true, timeWindow: '06:00 - 22:00' },
    { day: 'Sun', date: '26 Oct', isAvailable: false, timeWindow: '-' },
  ]);

  const [isAddTimeModalOpen, setIsAddTimeModalOpen] = useState(false);
  const [newWindowDay, setNewWindowDay] = useState('Thu');
  const [newStartTime, setNewStartTime] = useState('08:00');
  const [newEndTime, setNewEndTime] = useState('20:00');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleToggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const nextAvailable = !item.isAvailable;
          return {
            ...item,
            isAvailable: nextAvailable,
            timeWindow: nextAvailable ? '06:00 - 22:00' : '-',
          };
        }
        return item;
      })
    );
  };

  const handlePauseListing = () => {
    const nextPaused = !isHostListingPaused;
    setIsHostListingPaused(nextPaused);
    showToast(
      nextPaused
        ? 'Listing paused. Your charger will not receive new booking requests.'
        : 'Listing resumed! Charger is now live and accepting requests.'
    );
  };

  const handleAcceptRequest = (req: HostIncomingRequest) => {
    acceptHostIncomingRequest(req.id);
    showToast(
      `✓ Booking accepted for ${req.vehicleName}! Gate PIN #${chargerDetails.gatePin} and directions unlocked for driver.`
    );
  };

  const handleDeclineRequest = (req: HostIncomingRequest) => {
    declineHostIncomingRequest(req.id);
    showToast(`✕ Booking request for ${req.vehicleName} declined.`);
  };

  const handleSaveEditCharger = (e: React.FormEvent) => {
    e.preventDefault();
    setChargerDetails({ ...editForm });
    setIsEditModalOpen(false);
    showToast('✓ Charger specs & Gate PIN successfully updated.');
  };

  const handleAddTimeWindow = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.day === newWindowDay) {
          return {
            ...item,
            isAvailable: true,
            timeWindow: `${newStartTime} - ${newEndTime}`,
          };
        }
        return item;
      })
    );
    setIsAddTimeModalOpen(false);
    showToast(`✓ Added time window for ${newWindowDay}: ${newStartTime} - ${newEndTime}`);
  };

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(chargerDetails.gatePin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const requests = hostIncomingRequests;
  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const acceptedRequests = requests.filter((r) => r.status === 'ACCEPTED');
  const isChargingActive = bookingStage === 'CHARGING';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-20 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              Host Operations Command
            </span>
            <span className="text-xs font-mono text-slate-500 font-bold">
              Bay ID: #EVK-{chargerDetails.gatePin}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              <ShieldCheck className="h-3 w-3" />
              <span>DISCOM Verified Resident</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Host Operations &amp; Charger Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor incoming reservation requests, manage live charging sessions, and track automated earnings settlements.
          </p>
        </div>

        {/* Quick Mode & Pause Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditForm({ ...chargerDetails });
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
            <span>Edit Specs &amp; PIN</span>
          </button>

          <button
            type="button"
            onClick={handlePauseListing}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              !isHostListingPaused
                ? 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
            }`}
          >
            {!isHostListingPaused ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-700" />
                <span>Pause Listing</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-white" />
                <span>Resume Listing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4-Stage Lifecycle Synchronization Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-black tracking-wide uppercase text-slate-300">
              4-Stage Lifecycle State Synchronization
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            Current Driver State: {bookingStage}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
          {[
            {
              num: 1,
              name: '1. Review & Request',
              desc: `${pendingRequests.length} Pending Driver Request(s)`,
              active: bookingStage === 'REVIEW' || pendingRequests.length > 0,
            },
            {
              num: 2,
              name: '2. Host Unlocked',
              desc: `Gate PIN #${chargerDetails.gatePin} Shared`,
              active: bookingStage === 'ACCEPTED' || acceptedRequests.length > 0,
            },
            {
              num: 3,
              name: '3. Active Charging',
              desc: isChargingActive ? 'Live Telemetry Telecasting' : 'Standby / Ready',
              active: isChargingActive,
            },
            {
              num: 4,
              name: '4. Session Receipt',
              desc: `₹${hostIllustrativeEarnings.toFixed(2)} Disbursed`,
              active: bookingStage === 'COMPLETED' || hostIllustrativeEarnings > 0,
            },
          ].map((st) => (
            <div
              key={st.num}
              className={`p-3 rounded-2xl border transition-all ${
                st.active
                  ? 'bg-slate-800/90 border-emerald-500/70 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-200">{st.name}</span>
                {st.active && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-1 truncate">
                {st.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Charger State */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-1.5 transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Charger Bay</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                !isHostListingPaused ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{!isHostListingPaused ? 'Available & Live' : 'Paused by Host'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block font-medium">
            {chargerDetails.powerLabel} &bull; Type 2
          </span>
        </div>

        {/* Metric 2: Pending Requests */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-1.5 transition-all hover:border-blue-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requests Queue</span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingRequests.length} Pending
          </div>
          <span className="text-[11px] text-slate-500 block font-medium">
            {pendingRequests.filter((r) => r.isCompatible).length} compatible with your AC Wallbox
          </span>
        </div>

        {/* Metric 3: Illustrative Earnings */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-1.5 transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Host Earnings</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Demo Sandbox
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ₹{hostIllustrativeEarnings.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 block font-medium">
            Tariff: ₹{Number(chargerDetails.price).toFixed(2)}/kWh &bull; 18 sessions
          </span>
        </div>

        {/* Metric 4: Transformer Feeder Margin */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-1.5 transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feeder Health</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>42% Safe Margin</span>
          </div>
          <span className="text-[11px] text-slate-500 block font-medium">
            100 kW local transformer &bull; Safe load tier
          </span>
        </div>
      </div>

      {/* Active Live Session Command Card (Highlighted if active or accepted) */}
      {(isChargingActive || bookingStage === 'ACCEPTED') && (
        <div className="bg-emerald-950/90 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/80 shadow-xl space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <BatteryCharging className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    Live Charging Session Active in Driveway Bay
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                    Stage 3 Live
                  </span>
                </div>
                <p className="text-xs text-emerald-300 font-medium">
                  Connected Vehicle: Tata Nexon EV Max &bull; Driver: Vikram Malhotra
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBookingStage('COMPLETED')}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Mark Complete &amp; Settle Payout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/80 p-3.5 rounded-2xl border border-emerald-500/30">
            <div>
              <span className="text-slate-400 text-[10px] block">Live Power Output</span>
              <span className="font-mono font-bold text-white text-sm">7.4 kW AC</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Delivered So Far</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">8.4 kWh</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Accumulated Payout</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                +₹{(8.4 * Number(chargerDetails.price)).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Active Gate PIN</span>
              <span className="font-mono font-bold text-amber-300 text-sm">#{chargerDetails.gatePin}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Hardware & Availability) - 6 cols */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Your Charger Bay & Gate Pass */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Your Charger Bay</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  !isHostListingPaused
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    !isHostListingPaused ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                />
                <span>{!isHostListingPaused ? 'Live & Accepting' : 'Paused'}</span>
              </span>
            </div>

            {/* Sub-layout: Image on Left + Specs on Right */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch">
              <div className="sm:col-span-5 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[170px] sm:min-h-[200px]">
                <img
                  src="/assets/images/host_charger_wallbox.jpg"
                  alt="Host Wallbox Charger"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/garage_rajesh.jpg';
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold">
                  Level 2 Wallbox
                </div>
              </div>

              {/* Specs List */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Car className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-slate-500 font-medium">Connector</span>
                      <span className="text-slate-900 font-bold text-right">{chargerDetails.type}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Zap className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-slate-500 font-medium">Power Rating</span>
                      <span className="text-slate-900 font-bold text-right">{chargerDetails.powerLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-sm font-bold text-slate-400 shrink-0 leading-none">₹</span>
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-slate-500 font-medium">Host Tariff</span>
                      <span className="text-emerald-700 font-black text-right">
                        ₹{Number(chargerDetails.price).toFixed(2)} / kWh
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 font-medium">Driveway Area</span>
                        <span className="text-slate-900 font-bold text-right">{chargerDetails.location}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Exact street address revealed only after you accept a driver booking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditForm({ ...chargerDetails });
                      setIsEditModalOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Specs &amp; Gate PIN</span>
                  </button>
                </div>
              </div>
            </div>

            {/* High-Contrast Gate Access PIN Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-emerald-950">
                  <Key className="h-4 w-4 text-emerald-600" />
                  <span>Gate Security PIN (Auto-Dispatched on Acceptance)</span>
                </div>
                <p className="text-[11px] text-emerald-800/90 font-medium">
                  Provided to verified drivers upon host acceptance for seamless gate entry.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black tracking-widest text-emerald-950 bg-white px-3 py-1 rounded-xl border border-emerald-300">
                  #{chargerDetails.gatePin}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="p-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="Copy Gate PIN"
                >
                  {copiedPin ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Card: 7-Day Availability Calendar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">7-Day Availability Calendar</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTimeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Time Window</span>
                </button>
              </div>
            </div>

            {/* 7 Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-center select-none">
              {schedule.map((item, idx) => (
                <div
                  key={item.day}
                  onClick={() => handleToggleDay(idx)}
                  className="flex flex-col items-center justify-between p-2 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-300 transition-all cursor-pointer group"
                  title="Click to toggle Available / Unavailable"
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      {item.day}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {item.date}
                    </span>
                  </div>

                  <div className="my-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Closed'}
                    </span>
                  </div>

                  <span className="text-[9px] text-slate-500 font-semibold block leading-tight">
                    {item.timeWindow}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Available (Open for requests)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Closed (No bookings)</span>
              </div>
            </div>
          </div>

          {/* Card: Host Privacy & Security Settings */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">Privacy &amp; Security Controls</h2>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Conceal exact house number until booking is confirmed
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      Only approximate locality is visible on community radar to prevent unauthorized visitors.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHideExactAddress(!hideExactAddress)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    hideExactAddress ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle address concealment"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      hideExactAddress ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Single-use Gate PIN expiration
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      Gate access passcodes expire 30 minutes after session completion for security.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoExpirePin(!autoExpirePin)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    autoExpirePin ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle auto-expire PIN"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      autoExpirePin ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Accept incoming driver bookings
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      Toggle to accept new requests or temporarily pause incoming notifications.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !allowNewRequests;
                    setAllowNewRequests(next);
                    showToast(
                      next
                        ? 'Incoming requests enabled.'
                        : 'Incoming requests paused. You will not receive new notifications.'
                    );
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    allowNewRequests ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle allow incoming requests"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      allowNewRequests ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Incoming Requests & Payouts) - 6 cols */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Incoming Driver Requests (Stage 1 &rarr; Stage 2) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Incoming Booking Requests ({pendingRequests.length})
                </h2>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white">
                <span>Newest First</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </div>
            </div>

            {/* List of Requests */}
            <div className="space-y-4">
              {requests.map((req) => {
                if (req.status !== 'PENDING') {
                  return (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={req.image}
                          alt={req.vehicleName}
                          className="h-10 w-14 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/nexon_ev.jpg';
                          }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {req.vehicleName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {req.energyNeeded} &bull; Driver: {req.driverName}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          req.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status === 'ACCEPTED' ? '✓ Confirmed & PIN Sent' : '✕ Declined'}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={req.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all bg-white space-y-3.5 ${
                      req.isLiveDriverSession
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Live Driver Session Callout Banner */}
                    {req.isLiveDriverSession && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-950 font-bold">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>🔴 Live Request from Active Driver Session</span>
                        </div>
                        <span className="text-[11px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-md font-extrabold shadow-2xs">
                          Action Required
                        </span>
                      </div>
                    )}

                    {/* Top Row: Car Image, Name, Badge, Timestamp */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={req.image}
                          alt={req.vehicleName}
                          className="h-12 w-16 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/nexon_ev.jpg';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm truncate">
                              {req.vehicleName}
                            </h3>
                            {req.isCompatible ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                <span>Type 2 Compatible</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                <span>Incompatible Connector</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Driver: <strong className="text-slate-800">{req.driverName || 'Community EV Driver'}</strong> &bull; Verified KYC
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {req.timeAgo}
                      </span>
                    </div>

                    {/* Metrics 4-Item Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <BatteryCharging className="h-3.5 w-3.5 text-slate-600" />
                          <span>{req.energyNeeded}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Energy Scope
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold truncate">
                          <Calendar className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                          <span className="truncate">{req.requestedDate}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Requested Date
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <Clock className="h-3.5 w-3.5 text-slate-600" />
                          <span>{req.neededBy}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Needed By
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-emerald-700 font-black">
                          <span>+₹{req.calculatedEarnings.toFixed(2)}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Your Payout
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2.5 pt-1">
                      {req.isCompatible ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Decline</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAcceptRequest(req)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-emerald-600/20 cursor-pointer"
                          >
                            <Check className="h-4 w-4 stroke-[3]" />
                            <span>✓ Accept &amp; Grant Gate Pass</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-rose-600 font-semibold">
                            Incompatible connector
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {pendingRequests.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">All Caught Up!</h4>
                  <p className="text-xs text-slate-500">
                    No pending booking requests. You will be notified instantly when a nearby driver transmits a reservation request.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Completed Sessions & Verified Payouts */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Settled Sessions &amp; Host Ratings
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    4.9★ Average Host Rating &bull; 18 Completed Sessions &bull; Automated UPI settlement
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ DISCOM Settled
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'sess-101',
                  vehicle: 'Tata Tiago EV Tech Lux',
                  driver: 'Kavita Das',
                  date: '18 Oct 2026',
                  time: '19:15 - 22:30 IST',
                  energyKwh: 20.4,
                  payoutInr: 244.80,
                  rating: 5,
                  comment: 'Super convenient driveway access and very polite host!',
                },
                {
                  id: 'sess-102',
                  vehicle: 'MG ZS EV Excite',
                  driver: 'Sunita Rao',
                  date: '15 Oct 2026',
                  time: '14:00 - 18:40 IST',
                  energyKwh: 34.0,
                  payoutInr: 408.00,
                  rating: 5,
                  comment: 'Fast 7.4 kW charging rate. Dedicated Level 2 wallbox worked flawlessly.',
                },
                {
                  id: 'sess-103',
                  vehicle: 'Tata Nexon EV Max',
                  driver: 'Rahul Sharma',
                  date: '12 Oct 2026',
                  time: '08:30 - 12:45 IST',
                  energyKwh: 29.5,
                  payoutInr: 354.00,
                  rating: 5,
                  comment: 'Gate code worked immediately, safe covered parking.',
                },
              ].map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        {sess.vehicle}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Driver: {sess.driver} &bull; {sess.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 text-xs block">
                        +₹{sess.payoutInr.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        ✓ Disbursed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 bg-white p-2 rounded-xl border border-slate-200/60 text-[11px]">
                    <span className="font-semibold">{sess.energyKwh} kWh delivered</span>
                    <span className="text-slate-400">{sess.time}</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      ★ {sess.rating}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    &ldquo;{sess.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Charger & PIN Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-emerald-600" />
                <span>Edit Charger Specs &amp; Gate PIN</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCharger} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Connector Specification</label>
                <input
                  type="text"
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Power Output (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.powerKw}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        powerKw: Number(e.target.value),
                        powerLabel: `${e.target.value} kW AC (Level 2)`,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tariff (₹ / kWh)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Gate Access Security PIN</label>
                <input
                  type="text"
                  maxLength={6}
                  value={editForm.gatePin}
                  onChange={(e) => setEditForm({ ...editForm, gatePin: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono font-black text-slate-900 tracking-wider"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Dispatched to drivers once you accept their booking.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Driveway Parking Notes</label>
                <textarea
                  rows={2}
                  value={editForm.accessNotes}
                  onChange={(e) => setEditForm({ ...editForm, accessNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Time Window Modal */}
      {isAddTimeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Add Availability Window</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddTimeModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTimeWindow} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Day of Week</label>
                <select
                  value={newWindowDay}
                  onChange={(e) => setNewWindowDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-bold text-slate-800"
                >
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTimeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
                >
                  Apply Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
