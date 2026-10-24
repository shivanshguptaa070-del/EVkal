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
  Info,
  ShieldCheck,
  Pause,
  Play,
  Plus,
  Edit3,
  ChevronDown,
} from 'lucide-react';

interface DaySchedule {
  day: string;
  date: string;
  isAvailable: boolean;
  timeWindow: string;
}

interface IncomingRequest {
  id: string;
  vehicleName: string;
  isCompatible: boolean;
  incompatibleReason?: string;
  timeAgo: string;
  energyNeeded: string;
  requestedDate: string;
  neededBy: string;
  image: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  calculatedEarnings: number;
}

export function HostDashboardPage() {
  // Stats state
  const [isListingPaused, setIsListingPaused] = useState(false);
  const [illustrativeEarnings, setIllustrativeEarnings] = useState<number>(0.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Charger state
  const [chargerDetails, setChargerDetails] = useState({
    type: 'Type 2 (IEC 62196)',
    power: '7.4 kW AC (Level 2)',
    price: '12.00',
    location: 'Vasant Kunj area, New Delhi',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...chargerDetails });

  // Privacy toggles
  const [hideExactAddress, setHideExactAddress] = useState(true);
  const [allowNewRequests, setAllowNewRequests] = useState(true);

  // Calendar Schedule
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

  // Incoming Requests
  const [requests, setRequests] = useState<IncomingRequest[]>([
    {
      id: 'req-1',
      vehicleName: 'Tata Nexon EV Max',
      isCompatible: true,
      timeAgo: '2 hours ago',
      energyNeeded: '28.35 kWh',
      requestedDate: 'Mon, 23 Oct 2026',
      neededBy: '07:00',
      image: '/assets/images/nexon_ev.jpg',
      status: 'PENDING',
      calculatedEarnings: 340.2,
    },
    {
      id: 'req-2',
      vehicleName: 'BYD Atto 3',
      isCompatible: false,
      incompatibleReason:
        'This vehicle may require a CCS2 connector, which is not supported by your charger (Type 2).',
      timeAgo: '5 hours ago',
      energyNeeded: '40.00 kWh',
      requestedDate: 'Tue, 24 Oct 2026',
      neededBy: 'Any time',
      image: '/assets/images/byd_atto3_ev.jpg',
      status: 'PENDING',
      calculatedEarnings: 480.0,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
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
    const nextPaused = !isListingPaused;
    setIsListingPaused(nextPaused);
    showToast(
      nextPaused
        ? 'Listing paused. Your charger will not receive new booking requests.'
        : 'Listing resumed! Charger is now live and accepting requests.'
    );
  };

  const handleAcceptRequest = (req: IncomingRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'ACCEPTED' } : r))
    );
    setIllustrativeEarnings((prev) => Number((prev + req.calculatedEarnings).toFixed(2)));
    showToast(`✓ Booking accepted for ${req.vehicleName}! Driver notified.`);
  };

  const handleDeclineRequest = (req: IncomingRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'DECLINED' } : r))
    );
    showToast(`✕ Booking request for ${req.vehicleName} declined.`);
  };

  const handleSaveEditCharger = (e: React.FormEvent) => {
    e.preventDefault();
    setChargerDetails({ ...editForm });
    setIsEditModalOpen(false);
    showToast('✓ Charger details successfully updated.');
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

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const compatibleCount = pendingRequests.filter((r) => r.isCompatible).length;
  const incompatibleCount = pendingRequests.filter((r) => !r.isCompatible).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Host Dashboard
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage your charger, availability, and requests.
        </p>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Charger Status */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4 transition-all hover:border-emerald-200">
          <div className="h-13 w-13 rounded-2xl bg-[#E8FAF0] text-[#059669] flex items-center justify-center shrink-0">
            <Zap className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Charger Status</span>
            <div className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  !isListingPaused ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{!isListingPaused ? 'Available' : 'Paused'}</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              {!isListingPaused
                ? 'Ready to accept charging requests'
                : 'Listing temporarily paused'}
            </span>
          </div>
        </div>

        {/* Card 2: Upcoming Requests */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4 transition-all hover:border-blue-200">
          <div className="h-13 w-13 rounded-2xl bg-[#EBF3FE] text-[#2563EB] flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Upcoming Requests</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {pendingRequests.length}
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              {pendingRequests.length > 0
                ? `${compatibleCount} compatible • ${incompatibleCount} incompatible`
                : 'All requests processed'}
            </span>
          </div>
        </div>

        {/* Card 3: Illustrative Earnings */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4 transition-all hover:border-emerald-200">
          <div className="h-13 w-13 rounded-2xl bg-[#E8FAF0] text-[#059669] flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold">₹</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">Illustrative Earnings</span>
              <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                DEMO DATA
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{illustrativeEarnings.toFixed(2)}
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              No real payments in this demo.
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Your Charger */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Your Charger</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  !isListingPaused
                    ? 'bg-[#D1F7E8] text-[#065F46]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    !isListingPaused ? 'bg-[#059669]' : 'bg-amber-600'
                  }`}
                />
                <span>{!isListingPaused ? 'Available' : 'Paused'}</span>
              </span>
            </div>

            {/* Sub-layout: Image on Left + Specs on Right */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch">
              {/* Charger Wallbox Image */}
              <div className="sm:col-span-5 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[170px] sm:min-h-[200px]">
                <img
                  src="/assets/images/host_charger_wallbox.jpg"
                  alt="Host Wallbox Charger"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image path differs
                    (e.target as HTMLImageElement).src = '/assets/images/shivharsh_villa.jpg';
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold">
                  Wallbox AC
                </div>
              </div>

              {/* Specs List */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                <div className="space-y-2.5 text-xs">
                  {/* Row 1: Charger Type */}
                  <div className="flex items-start gap-2.5">
                    <Car className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-slate-500 font-medium">Charger Type</span>
                      <span className="text-slate-900 font-bold text-right">{chargerDetails.type}</span>
                    </div>
                  </div>

                  {/* Row 2: Charging Power */}
                  <div className="flex items-start gap-2.5">
                    <Zap className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-slate-500 font-medium">Charging Power</span>
                      <span className="text-slate-900 font-bold text-right">{chargerDetails.power}</span>
                    </div>
                  </div>

                  {/* Row 3: Price */}
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm font-bold text-slate-400 shrink-0 leading-none">₹</span>
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-slate-500 font-medium">Price (Illustrative)</span>
                      <span className="text-slate-900 font-bold text-right">
                        ₹{Number(chargerDetails.price).toFixed(2)} / kWh
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Location */}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 font-medium">Location (Approximate)</span>
                        <div className="flex items-center gap-1 text-slate-900 font-bold text-right">
                          <span>{chargerDetails.location}</span>
                          <Info className="h-3 w-3 text-slate-400 shrink-0" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Exact address will be shared only after booking.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Charger Button */}
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
                    <span>Edit Charger</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Availability Calendar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Availability Calendar</h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTimeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Time Window</span>
                </button>

                <button
                  type="button"
                  onClick={handlePauseListing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isListingPaused ? (
                    <>
                      <Play className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Resume Listing</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5 text-slate-500" />
                      <span>Pause Listing</span>
                    </>
                  )}
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
                  {/* Day & Date Header */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      {item.day}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {item.date}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="my-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                        item.isAvailable
                          ? 'bg-[#D1F7E8] text-[#065F46]'
                          : 'bg-[#FEE2E2] text-[#B91C1C]'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Hours */}
                  <span className="text-[9px] text-slate-500 font-semibold block leading-tight">
                    {item.timeWindow}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Incoming Requests */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Incoming Requests ({pendingRequests.length})
                </h2>
              </div>

              {/* Sort By Dropdown */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white">
                <span>Sort: Newest First</span>
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
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={req.image}
                          alt={req.vehicleName}
                          className="h-10 w-14 object-cover rounded-lg"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {req.vehicleName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {req.energyNeeded} • {req.requestedDate}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          req.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status === 'ACCEPTED' ? '✓ Accepted' : '✕ Declined'}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={req.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all bg-white space-y-3.5 shadow-2xs"
                  >
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
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                <span>Compatible</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C]">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                <span>Incompatible Connector</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {req.timeAgo}
                      </span>
                    </div>

                    {/* Metrics 3-Item Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                      {/* Energy Needed */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <BatteryCharging className="h-3.5 w-3.5 text-slate-600" />
                          <span>{req.energyNeeded}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Energy Needed
                        </span>
                      </div>

                      {/* Requested Date */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold truncate">
                          <Calendar className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                          <span className="truncate">{req.requestedDate}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Requested Date
                        </span>
                      </div>

                      {/* Needed By */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <Clock className="h-3.5 w-3.5 text-slate-600" />
                          <span>{req.neededBy}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Needed By
                        </span>
                      </div>
                    </div>

                    {/* Incompatible Warning Banner */}
                    {!req.isCompatible && req.incompatibleReason && (
                      <div className="p-3 rounded-xl bg-[#FEF2F2] border border-red-100 text-xs flex items-start gap-2.5 text-slate-700">
                        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-red-700 block">
                            Incompatible connector type
                          </span>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            {req.incompatibleReason}
                          </p>
                        </div>
                      </div>
                    )}

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
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed"
                            title="Cannot accept request: vehicle requires CCS2 connector"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Decline</span>
                          </button>
                        </>
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
                  <h4 className="text-sm font-bold text-slate-800">You're All Caught Up!</h4>
                  <p className="text-xs text-slate-500">
                    No pending booking requests. We will notify you when a driver requests your charger.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Privacy & Safety */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">Privacy &amp; Safety</h2>
            </div>

            <div className="space-y-4 pt-1">
              {/* Item 1: Hide exact address */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Hide exact address until booking accepted
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      Only your neighbourhood (e.g., Vasant Kunj area) is shown to drivers.
                    </span>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !hideExactAddress;
                    setHideExactAddress(next);
                    showToast(
                      next
                        ? 'Exact address will be hidden until booking confirmation.'
                        : 'Exact address will be visible to nearby drivers.'
                    );
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    hideExactAddress ? 'bg-[#059669]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle hide exact address"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      hideExactAddress ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Item 2: Allow new requests */}
              <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Allow new requests
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      Turn off to temporarily stop receiving charging requests.
                    </span>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !allowNewRequests;
                    setAllowNewRequests(next);
                    showToast(
                      next
                        ? 'New requests are now enabled.'
                        : 'New requests disabled. You will not receive notifications.'
                    );
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    allowNewRequests ? 'bg-[#059669]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle allow new requests"
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
      </div>

      {/* Edit Charger Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-emerald-600" />
                <span>Edit Host Charger</span>
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
                <label className="font-bold text-slate-700 block mb-1">Charger Type</label>
                <input
                  type="text"
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Charging Power</label>
                <input
                  type="text"
                  value={editForm.power}
                  onChange={(e) => setEditForm({ ...editForm, power: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Price per kWh (₹, Illustrative)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Approximate Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Add Time Window</span>
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-semibold bg-white"
                >
                  <option value="Mon">Monday (20 Oct)</option>
                  <option value="Tue">Tuesday (21 Oct)</option>
                  <option value="Wed">Wednesday (22 Oct)</option>
                  <option value="Thu">Thursday (23 Oct)</option>
                  <option value="Fri">Friday (24 Oct)</option>
                  <option value="Sat">Saturday (25 Oct)</option>
                  <option value="Sun">Sunday (26 Oct)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTimeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Add Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
