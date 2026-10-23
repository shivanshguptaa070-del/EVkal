import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  Navigation,
  FileText,
  Play,
  X,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function MyBookingsPage() {
  const { setP2PSubView } = useSimulationStore();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED'>('UPCOMING');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('BOOK-001');
  const [isChargingStarted, setIsChargingStarted] = useState<boolean>(false);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage your charging sessions, view history and track your bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setP2PSubView('FIND_CHARGERS')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer w-fit"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Find a Charger →</span>
        </button>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column (7 cols): Tabs + Upcoming Cards + Past Bookings */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tabs Filter Bar */}
          <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('UPCOMING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'UPCOMING'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Upcoming</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'UPCOMING' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                2
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PAST')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PAST'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Past</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'PAST' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                6
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CANCELLED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'CANCELLED'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Cancelled</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'CANCELLED' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                1
              </span>
            </button>
          </div>

          {/* Upcoming Card 1: Dr. Neha Sharma */}
          <div
            onClick={() => setSelectedBookingId('BOOK-001')}
            className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md space-y-4 ${
              selectedBookingId === 'BOOK-001'
                ? 'border-[#059669] ring-2 ring-emerald-500/20'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Photo with Tag */}
                <div className="relative h-20 w-24 sm:h-22 sm:w-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                  <img
                    src="/assets/images/dr_neha_villa.jpg"
                    alt="Dr. Neha Sharma Charger"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white">
                    Type 2 AC
                  </div>
                </div>

                {/* Host Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Dr. Neha Sharma
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-emerald-200 text-[#059669] text-[10px] font-bold">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified Resident</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Saket Block J, New Delhi</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-semibold">
                    <span className="inline-flex items-center gap-1 text-[#059669]">
                      <Zap className="h-3 w-3 fill-[#059669]" />
                      <span>Type 2 AC (11 kW)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>Today 06:00 - 23:00</span>
                    </span>
                    <span className="text-slate-800 font-bold">
                      ₹12.00 / kWh <span className="text-slate-400 font-normal">Host Set Rate</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Status & Date */}
              <div className="sm:text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Upcoming</span>
                </span>
                <p className="text-xs font-black text-slate-900 mt-1">Today, 18 Oct</p>
                <p className="text-[11px] text-slate-500 font-medium">18:00 – 20:00</p>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                View Details
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('route-map-preview');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Navigation className="h-3 w-3" />
                <span>Launch Navigation</span>
              </button>
            </div>
          </div>

          {/* Upcoming Card 2: Rajesh K. */}
          <div
            onClick={() => setSelectedBookingId('BOOK-002')}
            className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md space-y-4 ${
              selectedBookingId === 'BOOK-002'
                ? 'border-[#059669] ring-2 ring-emerald-500/20'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Photo with Tag */}
                <div className="relative h-20 w-24 sm:h-22 sm:w-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                  <img
                    src="/assets/images/garage_rajesh.jpg"
                    alt="Rajesh K. Charger"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white">
                    Type 2 AC
                  </div>
                </div>

                {/* Host Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Rajesh K.
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-emerald-200 text-[#059669] text-[10px] font-bold">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified Resident</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Vasant Kunj Sector C, New Delhi</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-semibold">
                    <span className="inline-flex items-center gap-1 text-[#059669]">
                      <Zap className="h-3 w-3 fill-[#059669]" />
                      <span>Type 2 AC (7.4 kW)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>Tomorrow 08:00 - 22:00</span>
                    </span>
                    <span className="text-slate-800 font-bold">
                      ₹11.50 / kWh <span className="text-slate-400 font-normal">Host Set Rate</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Status & Date */}
              <div className="sm:text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Upcoming</span>
                </span>
                <p className="text-xs font-black text-slate-900 mt-1">19 Oct 2026</p>
                <p className="text-[11px] text-slate-500 font-medium">08:00 – 10:00</p>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                View Details
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Navigation className="h-3 w-3" />
                <span>Launch Navigation</span>
              </button>
            </div>
          </div>

          {/* Past Bookings Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Past Bookings
              </h2>
              <button
                type="button"
                className="text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Past Item 1: Arjun Bhasin */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src="/assets/images/arjun_garage.jpg"
                      alt="Arjun Bhasin"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white">
                      Type 2 AC
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">Arjun Bhasin</h4>
                      <CheckCircle2 className="h-3 w-3 text-[#059669]" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Saket Block I, New Delhi</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>12 Oct 2026 (18:00 - 20:00)</span>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">₹9.50 / kWh</div>
                  <div className="text-[10px] text-slate-500 font-medium">Total: ₹285.00</div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Completed</span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>

              {/* Past Item 2: Vipin Singhal */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src="/assets/images/vipin_home.jpg"
                      alt="Vipin Singhal"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white">
                      Type 2 AC
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">Vipin Singhal</h4>
                      <CheckCircle2 className="h-3 w-3 text-[#059669]" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Malviya Nagar, New Delhi</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>08 Oct 2026 (10:00 - 12:00)</span>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">₹10.80 / kWh</div>
                  <div className="text-[10px] text-slate-500 font-medium">Total: ₹259.20</div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Completed</span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Booking Details Sidebar */}
        <div id="route-map-preview" className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4 sticky top-20">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Booking Details
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Upcoming</span>
            </span>
          </div>

          {/* Host Card Mini */}
          <div className="flex items-center gap-3">
            <div className="h-14 w-18 rounded-2xl overflow-hidden shrink-0 shadow-2xs">
              <img
                src={selectedBookingId === 'BOOK-002' ? '/assets/images/garage_rajesh.jpg' : '/assets/images/dr_neha_villa.jpg'}
                alt="Host"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-900">
                  {selectedBookingId === 'BOOK-002' ? 'Rajesh K.' : 'Dr. Neha Sharma'}
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {selectedBookingId === 'BOOK-002' ? 'Vasant Kunj Sector C, New Delhi' : 'Saket Block J, New Delhi'}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-[11px] font-bold text-slate-700">
                <span className="text-[#059669]">Type 2 AC (11 kW)</span>
                <span>•</span>
                <span>₹12.00 / kWh</span>
              </div>
            </div>
          </div>

          {/* Booking Time Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Booking Time</span>
              <p className="text-xs font-black text-slate-900">
                {selectedBookingId === 'BOOK-002' ? 'Tomorrow, 19 Oct 2026' : 'Today, 18 Oct 2026'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {selectedBookingId === 'BOOK-002' ? '08:00 – 10:00 (2 hours)' : '18:00 – 20:00 (2 hours)'}
              </p>
            </div>
          </div>

          {/* Distance & Parking 2-Col Box */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <Navigation className="h-4 w-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Distance</span>
                <span className="text-xs font-black text-slate-900">0.6 km (2 min)</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Parking</span>
                <span className="text-xs font-black text-slate-900">Covered Parking</span>
              </div>
            </div>
          </div>

          {/* Mini Route Navigation Map Illustration */}
          <div className="relative h-44 w-full bg-[#EBF3ED] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs">
            <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
              {/* Street grid */}
              <path d="M 0 50 L 400 70 M 0 130 L 400 110 M 120 0 L 140 180 M 280 0 L 260 180" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              <text x="340" y="140" fill="#94A3B8" fontSize="14" fontWeight="800" opacity="0.5">
                SAKET
              </text>

              {/* Dashed Route line */}
              <path
                d="M 60 130 Q 180 80 340 50"
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeDasharray="6 4"
              />

              {/* Start Point (User) */}
              <circle cx="60" cy="130" r="14" fill="rgba(37, 99, 235, 0.2)" />
              <circle cx="60" cy="130" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />

              {/* Distance Pill */}
              <g transform="translate(180, 75)">
                <rect x="-42" y="-14" width="84" height="26" rx="8" fill="#FFFFFF" stroke="#E2E8F0" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))" />
                <text x="0" y="3" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="800">
                  2 min · 0.6 km
                </text>
              </g>

              {/* End Point (Charger Pin) */}
              <g transform="translate(340, 50)">
                <circle cx="0" cy="0" r="16" fill="rgba(5, 150, 105, 0.2)" />
                <circle cx="0" cy="0" r="10" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M 0 -5 L -3 1 L 0 1 L -1 5 L 3 -1 L 0 -1 Z" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Access Instructions Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>Access Instructions</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Covered driveway parking slot #1. 16A wallbox ready. Security guard at gate instructed.
            </p>
          </div>

          {/* Live feedback when charging session started */}
          {isChargingStarted && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <Zap className="h-4 w-4 fill-emerald-600 text-emerald-600 animate-bounce" />
              <span>Charging session active! Delivering 11 kW AC power.</span>
            </div>
          )}

          {/* Bottom Action CTAs */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => setIsChargingStarted(true)}
              className="w-full py-3 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Start Charging Session</span>
            </button>
            <button
              type="button"
              onClick={() => setIsChargingStarted(false)}
              className="w-full py-2.5 px-4 rounded-2xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Cancel Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
