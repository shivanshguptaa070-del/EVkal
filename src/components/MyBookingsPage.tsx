import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  Navigation,
  FileText,
  Play,
  Pause,
  X,
  CheckCircle2,
  ShieldCheck,
  Search,
  Download,
  Star,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export interface BookingRecord {
  id: string;
  hostId: string;
  hostName: string;
  isHostVerified: boolean;
  locality: string;
  exactAddress: string;
  connectorType: string;
  powerKw: number;
  rateInr: number;
  dateStr: string;
  timeSlot: string;
  durationHours: number;
  distanceKm: number;
  driveTimeMin: number;
  parkingType: string;
  accessInstructions: string;
  gatePin: string;
  status: 'UPCOMING' | 'PAST' | 'CANCELLED';
  image: string;
  totalPaidInr: number;
  kwhDelivered?: number;
  lat: number;
  lon: number;
  refundStatus?: string;
  rating?: number;
}

const INITIAL_BOOKINGS: BookingRecord[] = [
  // 1. Upcoming: Dr. Neha Sharma
  {
    id: 'BOOK-001',
    hostId: 'HOST-DEL-002',
    hostName: 'Dr. Neha Sharma',
    isHostVerified: true,
    locality: 'Saket Block J, New Delhi',
    exactAddress: 'B-14/2 Hauz Khas Enclave, New Delhi 110016',
    connectorType: 'Type 2 AC',
    powerKw: 11.0,
    rateInr: 12.0,
    dateStr: 'Today, 18 Oct 2026',
    timeSlot: '18:00 – 20:00',
    durationHours: 2,
    distanceKm: 0.6,
    driveTimeMin: 2,
    parkingType: 'Covered Driveway Slot #1',
    accessInstructions: 'Covered driveway parking slot #1. 16A wallbox ready. Security guard at gate instructed.',
    gatePin: '1738',
    status: 'UPCOMING',
    image: '/assets/images/dr_neha_villa.jpg',
    totalPaidInr: 264.0,
    lat: 28.5412,
    lon: 77.1735,
  },
  // 2. Upcoming: Rajesh K.
  {
    id: 'BOOK-002',
    hostId: 'HOST-DEL-001',
    hostName: 'Rajesh K.',
    isHostVerified: true,
    locality: 'Vasant Kunj Sector C, New Delhi',
    exactAddress: 'Villa 42, Pocket 2, Sector C, Vasant Kunj, New Delhi 110070',
    connectorType: 'Type 2 AC',
    powerKw: 7.4,
    rateInr: 11.5,
    dateStr: 'Tomorrow, 19 Oct 2026',
    timeSlot: '08:00 – 10:00',
    durationHours: 2,
    distanceKm: 2.1,
    driveTimeMin: 7,
    parkingType: 'Dedicated Covered Garage',
    accessInstructions: 'Driveway parking slot #2. 15A socket & Type 2 gun ready. Enter gate PIN to unlock door.',
    gatePin: '4892',
    status: 'UPCOMING',
    image: '/assets/images/garage_rajesh.jpg',
    totalPaidInr: 241.5,
    lat: 28.5244,
    lon: 77.1558,
  },
  // 3. Past: Arjun Bhasin
  {
    id: 'BOOK-003',
    hostId: 'HOST-DEL-003',
    hostName: 'Arjun Bhasin',
    isHostVerified: true,
    locality: 'Saket Block I, New Delhi',
    exactAddress: 'J-88 Saket, Ground Floor Portico, New Delhi 110017',
    connectorType: 'Type 2 AC',
    powerKw: 3.3,
    rateInr: 9.5,
    dateStr: '12 Oct 2026',
    timeSlot: '18:00 – 20:00',
    durationHours: 2,
    distanceKm: 3.3,
    driveTimeMin: 11,
    parkingType: 'Open Portico Slot',
    accessInstructions: 'Open portico. Ring bell or input gate PIN to access porch.',
    gatePin: '9021',
    status: 'PAST',
    image: '/assets/images/arjun_garage.jpg',
    totalPaidInr: 285.0,
    kwhDelivered: 30.0,
    rating: 5,
    lat: 28.5103,
    lon: 77.1921,
  },
  // 4. Past: Vipin Singhal
  {
    id: 'BOOK-004',
    hostId: 'HOST-DEL-005',
    hostName: 'Vipin Singhal',
    isHostVerified: true,
    locality: 'Malviya Nagar, New Delhi',
    exactAddress: 'Plot 19, Shivalik Colony, Malviya Nagar, New Delhi 110017',
    connectorType: 'Type 2 AC',
    powerKw: 7.4,
    rateInr: 10.8,
    dateStr: '08 Oct 2026',
    timeSlot: '10:00 – 12:00',
    durationHours: 2,
    distanceKm: 3.6,
    driveTimeMin: 12,
    parkingType: 'Basement Car Lift Slot B1',
    accessInstructions: 'Basement car lift slot B1. Host WhatsApp alert sent upon booking.',
    gatePin: '6312',
    status: 'PAST',
    image: '/assets/images/vipin_home.jpg',
    totalPaidInr: 259.2,
    kwhDelivered: 24.0,
    rating: 5,
    lat: 28.5355,
    lon: 77.2104,
  },
  // 5. Past: Dr. Neha Sharma
  {
    id: 'BOOK-005',
    hostId: 'HOST-DEL-002',
    hostName: 'Dr. Neha Sharma',
    isHostVerified: true,
    locality: 'Hauz Khas Enclave, New Delhi',
    exactAddress: 'B-14/2 Hauz Khas Enclave, New Delhi 110016',
    connectorType: 'Type 2 AC',
    powerKw: 11.0,
    rateInr: 12.0,
    dateStr: '02 Oct 2026',
    timeSlot: '14:00 – 16:00',
    durationHours: 2,
    distanceKm: 0.6,
    driveTimeMin: 2,
    parkingType: 'Covered Driveway Slot #1',
    accessInstructions: 'Wallbox Pulsar Plus installed on boundary pillar.',
    gatePin: '1738',
    status: 'PAST',
    image: '/assets/images/dr_neha_villa.jpg',
    totalPaidInr: 312.0,
    kwhDelivered: 26.0,
    rating: 5,
    lat: 28.5412,
    lon: 77.1735,
  },
  // 6. Past: Suresh Goel
  {
    id: 'BOOK-006',
    hostId: 'HOST-DEL-006',
    hostName: 'Suresh Goel',
    isHostVerified: false,
    locality: 'Mehrauli Heritage Zone, New Delhi',
    exactAddress: 'Khasra 404, Near Qutub Minar, Mehrauli, New Delhi 110030',
    connectorType: 'CHAdeMO',
    powerKw: 15.0,
    rateInr: 13.0,
    dateStr: '27 Sep 2026',
    timeSlot: '09:00 – 11:00',
    durationHours: 2,
    distanceKm: 4.1,
    driveTimeMin: 14,
    parkingType: 'Dedicated Commercial Bay',
    accessInstructions: 'Commercial bay next to convenience store.',
    gatePin: '7789',
    status: 'PAST',
    image: '/assets/images/shivharsh_villa.jpg',
    totalPaidInr: 390.0,
    kwhDelivered: 30.0,
    rating: 4,
    lat: 28.4988,
    lon: 77.1722,
  },
  // 7. Past: Rajesh K.
  {
    id: 'BOOK-007',
    hostId: 'HOST-DEL-001',
    hostName: 'Rajesh K.',
    isHostVerified: true,
    locality: 'Vasant Kunj Sector C, New Delhi',
    exactAddress: 'Villa 42, Pocket 2, Sector C, Vasant Kunj, New Delhi 110070',
    connectorType: 'Type 2 AC',
    powerKw: 7.4,
    rateInr: 11.5,
    dateStr: '21 Sep 2026',
    timeSlot: '19:00 – 21:00',
    durationHours: 2,
    distanceKm: 2.1,
    driveTimeMin: 7,
    parkingType: 'Dedicated Covered Garage',
    accessInstructions: 'Covered driveway parking slot #2.',
    gatePin: '4892',
    status: 'PAST',
    image: '/assets/images/garage_rajesh.jpg',
    totalPaidInr: 276.0,
    kwhDelivered: 24.0,
    rating: 5,
    lat: 28.5244,
    lon: 77.1558,
  },
  // 8. Past: Priya Verma
  {
    id: 'BOOK-008',
    hostId: 'HOST-DEL-007',
    hostName: 'Priya Verma',
    isHostVerified: true,
    locality: 'Green Park Extension, New Delhi',
    exactAddress: 'G-12 Green Park Ext, New Delhi 110016',
    connectorType: 'Type 2 AC',
    powerKw: 7.4,
    rateInr: 11.0,
    dateStr: '15 Sep 2026',
    timeSlot: '11:00 – 13:00',
    durationHours: 2,
    distanceKm: 2.8,
    driveTimeMin: 9,
    parkingType: 'Residential Porch Slot',
    accessInstructions: 'Porch charger ready. Call on arrival.',
    gatePin: '3319',
    status: 'PAST',
    image: '/assets/images/shivharsh_villa.jpg',
    totalPaidInr: 264.0,
    kwhDelivered: 24.0,
    rating: 5,
    lat: 28.5582,
    lon: 77.2014,
  },
  // 9. Cancelled: GreenRide Community Hub
  {
    id: 'BOOK-009',
    hostId: 'HOST-DEL-004',
    hostName: 'GreenRide Community Hub',
    isHostVerified: true,
    locality: 'Chanakyapuri Diplomatic Enclave, New Delhi',
    exactAddress: 'Gate 3, Green Complex, Shantipath, New Delhi 110021',
    connectorType: 'CCS 2 (Fast DC)',
    powerKw: 22.0,
    rateInr: 14.5,
    dateStr: '05 Oct 2026',
    timeSlot: '16:00 – 17:00',
    durationHours: 1,
    distanceKm: 3.8,
    driveTimeMin: 13,
    parkingType: 'Commercial Fast DC Bay',
    accessInstructions: 'Gate 3 entrance. Security code provided.',
    gatePin: '5500',
    status: 'CANCELLED',
    image: '/assets/images/shivharsh_villa.jpg',
    totalPaidInr: 319.0,
    refundStatus: '₹319.00 Refunded to UPI (Ref: UTR-772914801)',
    lat: 28.5682,
    lon: 77.1611,
  },
];

export function MyBookingsPage() {
  const { setP2PSubView, chargerListings, openBookingModal } = useSimulationStore();
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED'>('UPCOMING');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('BOOK-001');

  // Interactive Live Charging Session State
  const [isChargingActive, setIsChargingActive] = useState<boolean>(false);
  const [isChargingPaused, setIsChargingPaused] = useState<boolean>(false);
  const [deliveredKwh, setDeliveredKwh] = useState<number>(0);
  const [chargingSocPct, setChargingSocPct] = useState<number>(15);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  // Modals & User Feedback
  const [copiedPin, setCopiedPin] = useState(false);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<BookingRecord | null>(null);
  const [detailsModalBooking, setDetailsModalBooking] = useState<BookingRecord | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter lists based on tab
  const upcomingList = bookings.filter((b) => b.status === 'UPCOMING');
  const pastList = bookings.filter((b) => b.status === 'PAST');
  const cancelledList = bookings.filter((b) => b.status === 'CANCELLED');

  const currentTabList =
    activeTab === 'UPCOMING'
      ? upcomingList
      : activeTab === 'PAST'
      ? pastList
      : cancelledList;

  // Currently selected booking
  const selectedBooking =
    bookings.find((b) => b.id === selectedBookingId) ||
    currentTabList[0] ||
    bookings[0];

  // Tab switch handler: changes tab and auto-selects first booking of that tab
  const handleTabChange = (tab: 'UPCOMING' | 'PAST' | 'CANCELLED') => {
    setActiveTab(tab);
    const tabList = bookings.filter((b) => b.status === tab);
    if (tabList.length > 0) {
      setSelectedBookingId(tabList[0].id);
    }
  };

  // Live Charging Simulation Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isChargingActive && !isChargingPaused) {
      interval = setInterval(() => {
        setSessionSeconds((s) => s + 1);
        setDeliveredKwh((kwh) => Number((kwh + 0.05).toFixed(2)));
        setChargingSocPct((soc) => Math.min(100, Number((soc + 0.3).toFixed(1))));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isChargingActive, isChargingPaused]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Start Charging Session Handler
  const handleStartCharging = () => {
    setIsChargingActive(true);
    setIsChargingPaused(false);
    showToast(`⚡ Charging session started at ${selectedBooking.hostName}'s station!`);
  };

  // 2. Pause / Resume Charging Handler
  const handleTogglePauseCharging = () => {
    setIsChargingPaused(!isChargingPaused);
    showToast(isChargingPaused ? '⚡ Charging session resumed' : '⏸️ Charging session paused');
  };

  // 3. Stop & Settle Charging Session Handler
  const handleStopCharging = () => {
    setIsChargingActive(false);
    setIsChargingPaused(false);

    const finalKwh = deliveredKwh > 0 ? deliveredKwh : 18.4;
    const finalCost = Number((finalKwh * selectedBooking.rateInr).toFixed(2));

    // Update booking in list to PAST
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: 'PAST',
              kwhDelivered: finalKwh,
              totalPaidInr: finalCost,
              rating: 5,
            }
          : b
      )
    );

    showToast(`✓ Charging complete! Delivered ${finalKwh} kWh (₹${finalCost}). Session archived in Past Bookings.`);
    handleTabChange('PAST');
    setDeliveredKwh(0);
    setSessionSeconds(0);
  };

  // 4. Cancel Booking Handler
  const handleConfirmCancelBooking = () => {
    if (!cancelModalBooking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === cancelModalBooking.id
          ? {
              ...b,
              status: 'CANCELLED',
              refundStatus: `₹${b.totalPaidInr.toFixed(2)} 100% Refunded to UPI (Ref: UTR-${Math.floor(100000000 + Math.random() * 900000000)})`,
            }
          : b
      )
    );

    showToast(`✓ Booking ${cancelModalBooking.id} cancelled. Full refund of ₹${cancelModalBooking.totalPaidInr} initiated to your account.`);
    setCancelModalBooking(null);
    handleTabChange('CANCELLED');
    setSelectedBookingId(cancelModalBooking.id);
  };

  // 5. Copy Gate PIN Handler
  const handleCopyGatePin = (pin: string) => {
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    showToast(`Copied Gate PIN ${pin} to clipboard!`);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // 6. Launch Navigation in Google Maps
  const handleLaunchNavigation = (booking: BookingRecord) => {
    const destination = encodeURIComponent(`${booking.exactAddress || booking.locality}`);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
    showToast(`📍 Opening Google Maps navigation to ${booking.hostName} (${booking.distanceKm} km)...`);

    // Smooth scroll to route illustration
    setSelectedBookingId(booking.id);
    const el = document.getElementById('route-map-preview');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // 7. Re-book Charger
  const handleRebookCharger = (booking: BookingRecord) => {
    const listing = chargerListings.find((l) => l.id === booking.hostId) || chargerListings[0];
    if (listing) {
      openBookingModal(listing);
    } else {
      setP2PSubView('FIND_CHARGERS');
    }
  };

  // 8. Rate Past Session
  const handleRateSession = (bookingId: string, stars: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, rating: stars } : b))
    );
    showToast(`⭐ Rated ${stars} stars! Thank you for supporting community charging.`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
        {/* Left Column (7 cols): Tabs + Filtered Cards */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tabs Filter Bar */}
          <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => handleTabChange('UPCOMING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'UPCOMING'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Upcoming</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'UPCOMING' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {upcomingList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('PAST')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PAST'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Past</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'PAST' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {pastList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('CANCELLED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'CANCELLED'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Cancelled</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'CANCELLED' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {cancelledList.length}
              </span>
            </button>
          </div>

          {/* List of Bookings for Active Tab */}
          <div className="space-y-4">
            {currentTabList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No {activeTab.toLowerCase()} bookings found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse available community chargers in South Delhi and reserve a plug point today.
                </p>
                <button
                  type="button"
                  onClick={() => setP2PSubView('FIND_CHARGERS')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  Find Chargers Now
                </button>
              </div>
            ) : (
              currentTabList.map((booking) => {
                const isSelected = selectedBooking.id === booking.id;
                const isUpcoming = booking.status === 'UPCOMING';
                const isPast = booking.status === 'PAST';
                const isCancelled = booking.status === 'CANCELLED';

                return (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBookingId(booking.id)}
                    className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md space-y-4 ${
                      isSelected
                        ? 'border-[#059669] ring-2 ring-emerald-500/20'
                        : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Photo with Tag */}
                        <div className="relative h-20 w-24 sm:h-22 sm:w-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-2xs">
                          <img
                            src={booking.image}
                            alt={`${booking.hostName} Charger`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white">
                            {booking.connectorType}
                          </div>
                        </div>

                        {/* Host Info */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                              {booking.hostName}
                            </h3>
                            {booking.isHostVerified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-emerald-200 text-[#059669] text-[10px] font-bold">
                                <ShieldCheck className="h-3 w-3" />
                                <span>Verified Resident</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{booking.locality}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-semibold">
                            <span className="inline-flex items-center gap-1 text-[#059669]">
                              <Zap className="h-3 w-3 fill-[#059669]" />
                              <span>{booking.connectorType} ({booking.powerKw} kW)</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Clock className="h-3 w-3" />
                              <span>{booking.timeSlot}</span>
                            </span>
                            <span className="text-slate-800 font-bold">
                              ₹{booking.rateInr.toFixed(2)} / kWh
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Status & Date */}
                      <div className="sm:text-right shrink-0">
                        {isUpcoming && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Upcoming</span>
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Completed</span>
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[11px] font-bold">
                            <X className="h-3 w-3 text-red-500" />
                            <span>Cancelled</span>
                          </span>
                        )}
                        <p className="text-xs font-black text-slate-900 mt-1">{booking.dateStr}</p>
                        <p className="text-[11px] text-slate-500 font-medium">Total: ₹{booking.totalPaidInr.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookingId(booking.id);
                          setDetailsModalBooking(booking);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        View Details
                      </button>

                      {isUpcoming && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchNavigation(booking);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          <Navigation className="h-3 w-3" />
                          <span>Launch Navigation</span>
                        </button>
                      )}

                      {isPast && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInvoiceModalBooking(booking);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Tax Invoice</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRebookCharger(booking);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Book Again</span>
                          </button>
                        </>
                      )}

                      {isCancelled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRebookCharger(booking);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Re-Book Charger</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick past bookings shortcut if in Upcoming */}
          {activeTab === 'UPCOMING' && pastList.length > 0 && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <span className="text-xs font-bold text-slate-600">
                You have {pastList.length} completed charging sessions
              </span>
              <button
                type="button"
                onClick={() => handleTabChange('PAST')}
                className="text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors cursor-pointer"
              >
                View All Past Sessions →
              </button>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Dynamic Booking Details Sidebar */}
        <div id="route-map-preview" className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4 sticky top-20">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Booking Details
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                selectedBooking.status === 'UPCOMING'
                  ? 'bg-emerald-50 text-emerald-700'
                  : selectedBooking.status === 'PAST'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  selectedBooking.status === 'UPCOMING'
                    ? 'bg-emerald-500 animate-pulse'
                    : selectedBooking.status === 'PAST'
                    ? 'bg-slate-400'
                    : 'bg-red-500'
                }`}
              />
              <span className="capitalize">{selectedBooking.status.toLowerCase()}</span>
            </span>
          </div>

          {/* Host Card Mini */}
          <div className="flex items-center gap-3">
            <div className="h-14 w-18 rounded-2xl overflow-hidden shrink-0 shadow-2xs bg-slate-100">
              <img
                src={selectedBooking.image}
                alt={selectedBooking.hostName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-900 truncate">
                  {selectedBooking.hostName}
                </h3>
                {selectedBooking.isHostVerified && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold shrink-0">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium truncate">
                {selectedBooking.locality}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-[11px] font-bold text-slate-700">
                <span className="text-[#059669]">{selectedBooking.connectorType} ({selectedBooking.powerKw} kW)</span>
                <span>•</span>
                <span>₹{selectedBooking.rateInr.toFixed(2)} / kWh</span>
              </div>
            </div>
          </div>

          {/* Booking Time Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Booking Schedule</span>
              <p className="text-xs font-black text-slate-900">{selectedBooking.dateStr}</p>
              <p className="text-[11px] text-slate-500 font-medium">
                {selectedBooking.timeSlot} ({selectedBooking.durationHours} hours)
              </p>
            </div>
          </div>

          {/* Distance & Parking 2-Col Box */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <Navigation className="h-4 w-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Distance</span>
                <span className="text-xs font-black text-slate-900">
                  {selectedBooking.distanceKm} km ({selectedBooking.driveTimeMin} min)
                </span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Parking</span>
                <span className="text-xs font-black text-slate-900 truncate block">
                  {selectedBooking.parkingType}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Route Navigation Map Illustration with Open Google Maps Link */}
          <div className="relative h-44 w-full bg-[#EBF3ED] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs group">
            <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
              {/* Street grid */}
              <path d="M 0 50 L 400 70 M 0 130 L 400 110 M 120 0 L 140 180 M 280 0 L 260 180" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              <text x="340" y="140" fill="#94A3B8" fontSize="14" fontWeight="800" opacity="0.5">
                {selectedBooking.locality.split(',')[0].toUpperCase()}
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
                <rect x="-48" y="-14" width="96" height="26" rx="8" fill="#FFFFFF" stroke="#E2E8F0" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))" />
                <text x="0" y="3" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="800">
                  {selectedBooking.driveTimeMin} min · {selectedBooking.distanceKm} km
                </text>
              </g>

              {/* End Point (Charger Pin) */}
              <g transform="translate(340, 50)">
                <circle cx="0" cy="0" r="16" fill="rgba(5, 150, 105, 0.2)" />
                <circle cx="0" cy="0" r="10" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M 0 -5 L -3 1 L 0 1 L -1 5 L 3 -1 L 0 -1 Z" fill="#FFFFFF" />
              </g>
            </svg>

            {/* Quick Open in Google Maps button overlay */}
            <button
              type="button"
              onClick={() => handleLaunchNavigation(selectedBooking)}
              className="absolute bottom-2 right-2 px-3 py-1 bg-white/95 hover:bg-white text-slate-800 rounded-xl text-[10px] font-bold shadow-xs border border-slate-200/80 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="h-3 w-3 text-blue-600" />
              <span>Open in Google Maps</span>
            </button>
          </div>

          {/* Access Instructions & Gate PIN Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                <span>Access Instructions</span>
              </div>
              {selectedBooking.gatePin && (
                <button
                  type="button"
                  onClick={() => handleCopyGatePin(selectedBooking.gatePin)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                  title="Copy PIN"
                >
                  {copiedPin ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>PIN: {selectedBooking.gatePin}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {selectedBooking.accessInstructions}
            </p>
          </div>

          {/* Live Interactive Charging Session Gauge */}
          {isChargingActive && (
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-emerald-300 text-emerald-950 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-xs text-emerald-900">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Charging Session Active</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  {Math.floor(sessionSeconds / 60)}:{(sessionSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>Battery SOC: {chargingSocPct}%</span>
                  <span>{selectedBooking.powerKw} kW Power</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${chargingSocPct}%` }}
                  />
                </div>
              </div>

              {/* Energy & Cost Metric */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200 font-semibold">
                <span>Energy: {deliveredKwh} kWh</span>
                <span className="font-black text-emerald-900">
                  Current Total: ₹{(deliveredKwh * selectedBooking.rateInr).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Refund Status if Cancelled */}
          {selectedBooking.status === 'CANCELLED' && selectedBooking.refundStatus && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Refund Processed</span>
              </div>
              <p className="text-[11px] text-amber-800">{selectedBooking.refundStatus}</p>
            </div>
          )}

          {/* Rating Widget if Past Booking */}
          {selectedBooking.status === 'PAST' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-[11px] text-slate-500 font-semibold block">Rate this session</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRateSession(selectedBooking.id, star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= (selectedBooking.rating || 5)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-1">
                  {selectedBooking.rating || 5}.0 Stars
                </span>
              </div>
            </div>
          )}

          {/* Bottom Action CTAs */}
          <div className="space-y-2 pt-1">
            {selectedBooking.status === 'UPCOMING' && (
              <>
                {!isChargingActive ? (
                  <button
                    type="button"
                    onClick={handleStartCharging}
                    className="w-full py-3 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Start Charging Session</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePauseCharging}
                      className="py-2.5 px-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isChargingPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                      <span>{isChargingPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStopCharging}
                      className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Complete Session</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setCancelModalBooking(selectedBooking)}
                  className="w-full py-2.5 px-4 rounded-2xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel Booking</span>
                </button>
              </>
            )}

            {selectedBooking.status === 'PAST' && (
              <>
                <button
                  type="button"
                  onClick={() => setInvoiceModalBooking(selectedBooking)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download GST Tax Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRebookCharger(selectedBooking)}
                  className="w-full py-2.5 px-4 rounded-2xl border border-[#059669] text-[#059669] hover:bg-emerald-50 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Book This Charger Again</span>
                </button>
              </>
            )}

            {selectedBooking.status === 'CANCELLED' && (
              <button
                type="button"
                onClick={() => handleRebookCharger(selectedBooking)}
                className="w-full py-3 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Re-Book Station</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: GST Tax Invoice Receipt Modal */}
      {invoiceModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">EVkal Tax Invoice</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Invoice #{invoiceModalBooking.id}-2026</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceModalBooking(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Bill Details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Host Provider:</span>
                <span className="font-bold text-slate-900">{invoiceModalBooking.hostName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Charging Station:</span>
                <span className="font-bold text-slate-900">{invoiceModalBooking.locality}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Session Date:</span>
                <span className="font-bold text-slate-900">{invoiceModalBooking.dateStr}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Energy Delivered:</span>
                <span className="font-bold text-slate-900">{invoiceModalBooking.kwhDelivered || 24.0} kWh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Base Energy Cost:</span>
                <span className="font-bold text-slate-900">
                  ₹{((invoiceModalBooking.kwhDelivered || 24.0) * invoiceModalBooking.rateInr * 0.82).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">GST (CGST 9% + SGST 9%):</span>
                <span className="font-bold text-slate-900">
                  ₹{((invoiceModalBooking.kwhDelivered || 24.0) * invoiceModalBooking.rateInr * 0.18).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-black text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700">₹{invoiceModalBooking.totalPaidInr.toFixed(2)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print?.();
                  showToast('Preparing invoice print & download...');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setInvoiceModalBooking(null)}
                className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Booking Details View Modal */}
      {detailsModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Booking Summary</h3>
              <button
                type="button"
                onClick={() => setDetailsModalBooking(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                <img
                  src={detailsModalBooking.image}
                  alt={detailsModalBooking.hostName}
                  className="h-12 w-14 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{detailsModalBooking.hostName}</h4>
                  <p className="text-[11px] text-slate-500">{detailsModalBooking.locality}</p>
                </div>
              </div>

              <div className="space-y-1.5 py-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking ID:</span>
                  <span className="font-mono font-bold text-slate-900">{detailsModalBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">{detailsModalBooking.exactAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-slate-900">{detailsModalBooking.dateStr} ({detailsModalBooking.timeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Charger Specs:</span>
                  <span className="font-bold text-slate-900">{detailsModalBooking.connectorType} • {detailsModalBooking.powerKw} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gate PIN Code:</span>
                  <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {detailsModalBooking.gatePin}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                <strong>Instructions:</strong> {detailsModalBooking.accessInstructions}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleLaunchNavigation(detailsModalBooking);
                  setDetailsModalBooking(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Navigate</span>
              </button>
              <button
                type="button"
                onClick={() => setDetailsModalBooking(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Cancel Booking Confirmation Dialog */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Cancel Charging Booking?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel your session with <strong>{cancelModalBooking.hostName}</strong>?
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 text-left">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Refund Guarantee</span>
              </div>
              <p className="text-[11px] mt-0.5 text-emerald-700">
                ₹{cancelModalBooking.totalPaidInr.toFixed(2)} will be credited back instantly to your original payment method.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmCancelBooking}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Yes, Cancel Booking
              </button>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
