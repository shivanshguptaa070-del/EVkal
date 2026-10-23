import { useState } from 'react';
import {
  CalendarCheck,
  Zap,
  MapPin,
  CheckCircle2,
  Key,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';

export function P2PBookingsPage() {
  const {
    selectedChargerForBooking,
    bookingStage,
    openBookingModal,
    setActiveP1SubPage,
    chargerListings,
  } = useSimulationStore();

  const [activeTabFilter, setActiveTabFilter] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

  // Active or most recent booking charger fallback
  const currentCharger = selectedChargerForBooking || chargerListings[0];

  // Mock historical bookings
  const pastBookings = [
    {
      id: 'BK-9021',
      hostName: 'Dr. Neha Verma',
      location: 'Saket J-Block, South Delhi',
      date: 'Yesterday, 18:30',
      energyKwh: 14.8,
      powerKw: 7.4,
      amountInr: 185.0,
      status: 'COMPLETED',
      connector: 'Type 2 AC',
      passcode: '4821',
    },
    {
      id: 'BK-8742',
      hostName: 'Arjun K. Sharma',
      location: 'Hauz Khas Enclave, Delhi',
      date: '21 Oct 2026, 14:15',
      energyKwh: 22.4,
      powerKw: 11.0,
      amountInr: 291.2,
      status: 'COMPLETED',
      connector: 'Type 2 AC',
      passcode: '9012',
    },
    {
      id: 'BK-8109',
      hostName: 'Vipin Oberoi',
      location: 'Greater Kailash II, Delhi',
      date: '18 Oct 2026, 19:00',
      energyKwh: 9.5,
      powerKw: 3.3,
      amountInr: 104.5,
      status: 'COMPLETED',
      connector: 'Type 2 AC',
      passcode: '3318',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 mb-1.5">
            <CalendarCheck className="h-3.5 w-3.5" />
            <span>Driver Booking Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Charging Sessions &amp; Passcodes
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track active host reservations, unlocked gate passcodes, and verified payment receipts.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTabFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'ACTIVE'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Session
          </button>
          <button
            type="button"
            onClick={() => setActiveTabFilter('HISTORY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'HISTORY'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Booking History (3)
          </button>
        </div>
      </div>

      {activeTabFilter === 'ACTIVE' ? (
        /* Active Booking Session Card */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  <Zap className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">
                      {currentCharger.hostName}'s Driveway Wallbox
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200">
                      Stage: {bookingStage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{currentCharger.location.approximateLocality} &bull; Slot #02</span>
                  </p>
                </div>
              </div>

              {/* Action to trigger simulated modal */}
              <button
                type="button"
                onClick={() => openBookingModal(currentCharger)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Launch Interactive Modal</span>
              </button>
            </div>

            {/* Stage Progress Timeline Bar */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                5-Stage Reservation State Machine:
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { stage: 'REVIEW', label: '1. Review' },
                  { stage: 'TRANSMITTING', label: '2. Transmit' },
                  { stage: 'ACCEPTED', label: '3. Accepted' },
                  { stage: 'CHARGING', label: '4. Charging' },
                  { stage: 'COMPLETED', label: '5. Receipt' },
                ].map((s, idx) => {
                  const stageList = ['REVIEW', 'TRANSMITTING', 'ACCEPTED', 'CHARGING', 'COMPLETED'];
                  const currentIndex = stageList.indexOf(bookingStage);
                  const isDone = currentIndex >= idx;
                  const isCurrent = bookingStage === s.stage;

                  return (
                    <div
                      key={s.stage}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-bold'
                          : isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="text-[11px] truncate">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Unlocked Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Gate Pass Code Card */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                  <Key className="h-4 w-4 text-amber-600" />
                  <span>Gate Entry Passcode</span>
                </div>
                <div className="text-2xl font-black text-amber-900 tracking-wider">
                  #7429
                </div>
                <p className="text-[11px] text-amber-700 font-medium">
                  Provide at security gate or key into electric driveway bollard.
                </p>
              </div>

              {/* Exact Unmasked Address */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-800 text-xs font-bold">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>Unmasked Address</span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  House 42B, Sector 4, Vasant Kunj
                </div>
                <p className="text-[11px] text-blue-700 font-medium">
                  Park on left side of driveway; wall socket on brick pillar.
                </p>
              </div>

              {/* Pricing & Power Spec */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-bold">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span>Charging Specs</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {currentCharger.maxPowerKw} kW &bull; {currentCharger.connectorTypes.join(', ')}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Host Rate: ₹{currentCharger.pricePerKwhInr.toFixed(2)}/kWh &bull; 15 kWh est.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Guidance Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-900 font-semibold">
                Looking for other chargers in South Delhi? Browse all 42 registered community sockets on the live radar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveP1SubPage('P2P_EXPLORE')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>Explore Map</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        /* Historical Bookings Table */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">Completed Charging Sessions</h3>
            <span className="text-xs text-slate-500 font-medium">Verified on-chain receipt log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/70">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Host &amp; Location</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Energy Delivered</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {pastBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.hostName}</div>
                      <div className="text-[11px] text-slate-400">{b.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{b.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {b.energyKwh} kWh
                      <span className="text-[10px] text-slate-400 block">{b.powerKw} kW &bull; {b.connector}</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      ₹{b.amountInr.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Simulated PDF receipt downloaded for ${b.id} (₹${b.amountInr})`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
