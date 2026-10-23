import { useState, useEffect } from 'react';
import {
  X,
  Check,
  Shield,
  Copy,
  CheckCircle2,
  Zap,
  Clock,
  Info,
  ArrowRight,
  FileText,
  Star,
  MapPin,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function BookingSimModal() {
  const {
    isBookingModalOpen,
    selectedChargerForBooking,
    bookingStage,
    setBookingStage,
    advanceBookingStage,
    closeBookingModal,
    p2pQuery,
  } = useSimulationStore();

  const [copiedPin, setCopiedPin] = useState(false);
  const [rating, setRating] = useState(5);

  // Auto-advance simulation timer for stage 2 (Transmitting -> Accepted)
  useEffect(() => {
    if (bookingStage === 'TRANSMITTING') {
      const timer = setTimeout(() => {
        advanceBookingStage();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingStage, advanceBookingStage]);

  if (!isBookingModalOpen || !selectedChargerForBooking) {
    return null;
  }

  const listing = selectedChargerForBooking;
  const slotId = `EVK-${listing.gatePin || '7429'}`;
  const gatePin = listing.gatePin || '7429';

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(gatePin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // 4 visible UI steps mapping to our internal 5-stage machine
  const getStepStatus = (stepIndex: number) => {
    // 1: Request, 2: Accepted, 3: Charging Active, 4: Summary & Receipt
    if (stepIndex === 1) {
      return bookingStage !== 'REVIEW' ? 'DONE' : 'CURRENT';
    }
    if (stepIndex === 2) {
      if (bookingStage === 'REVIEW' || bookingStage === 'TRANSMITTING') return 'PENDING';
      if (bookingStage === 'ACCEPTED') return 'CURRENT';
      return 'DONE';
    }
    if (stepIndex === 3) {
      if (bookingStage === 'CHARGING') return 'CURRENT';
      if (bookingStage === 'COMPLETED') return 'DONE';
      return 'PENDING';
    }
    if (stepIndex === 4) {
      if (bookingStage === 'COMPLETED') return 'CURRENT';
      return 'PENDING';
    }
    return 'PENDING';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <h2 id="booking-modal-title" className="text-base font-black text-slate-900 tracking-tight">
              Community Charging Session &mdash; Slot #{slotId}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Simulated peer-to-peer neighborhood charging workflow
            </p>
          </div>
          <button
            type="button"
            onClick={closeBookingModal}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 4-Step Progress Stepper (Mockup 4 Top Bar) */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {/* Step 1: Request */}
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  getStepStatus(1) === 'DONE'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                }`}
              >
                {getStepStatus(1) === 'DONE' ? <Check className="h-4 w-4 stroke-[3]" /> : '1'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">1. Request</span>
                <span className="text-[10px] text-slate-500 font-medium">Slot Requested</span>
              </div>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 transition-colors ${
                getStepStatus(2) !== 'PENDING' ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />

            {/* Step 2: Accepted */}
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  getStepStatus(2) === 'DONE'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : getStepStatus(2) === 'CURRENT'
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {getStepStatus(2) === 'DONE' ? <Check className="h-4 w-4 stroke-[3]" /> : '2'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">2. Accepted</span>
                <span className="text-[10px] text-slate-500 font-medium">Host Confirmed</span>
              </div>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 transition-colors ${
                getStepStatus(3) !== 'PENDING' ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />

            {/* Step 3: Charging Active */}
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  getStepStatus(3) === 'DONE'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : getStepStatus(3) === 'CURRENT'
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {getStepStatus(3) === 'DONE' ? <Check className="h-4 w-4 stroke-[3]" /> : '3'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">3. Charging Active</span>
                <span className="text-[10px] text-slate-500 font-medium">Live Session</span>
              </div>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 transition-colors ${
                getStepStatus(4) !== 'PENDING' ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />

            {/* Step 4: Summary & Receipt */}
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  getStepStatus(4) === 'CURRENT'
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">4. Summary &amp; Receipt</span>
                <span className="text-[10px] text-slate-500 font-medium">Complete Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STAGE 1: REVIEW */}
          {bookingStage === 'REVIEW' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                  <img
                    src="/assets/images/garage_rajesh.jpg"
                    alt={listing.hostName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{listing.hostName}</h3>
                    {listing.isHostVerified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Verified Resident
                      </span>
                    )}
                  </div>
                  {/* Security Rule: Privacy Concealment before Accepted */}
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>{listing.location.approximateLocality}</span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                      (Approximate area only)
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">{listing.accessNotes}</p>
                </div>
              </div>

              {/* Booking Specifications Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-500 font-medium">Requested Energy</span>
                  <p className="text-sm font-black text-slate-900">15.0 kWh</p>
                  <span className="text-[10px] text-emerald-600 font-bold">~38% &rarr; 80% SOC</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-500 font-medium">Charger Power</span>
                  <p className="text-sm font-black text-slate-900">{listing.maxPowerKw} kW AC</p>
                  <span className="text-[10px] text-slate-500 font-medium">Level 2 / Type 2</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 font-medium">Estimated Demo Cost</span>
                  <p className="text-sm font-black text-emerald-600">
                    ₹{(15.0 * listing.pricePerKwhInr).toFixed(2)}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">
                    @ ₹{listing.pricePerKwhInr.toFixed(2)}/kWh
                  </span>
                </div>
              </div>

              {/* Privacy Obfuscation Notice Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900">
                <Lock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">Host Privacy Protection Active</span>
                  <p className="text-[11px] text-blue-800/90 leading-relaxed">
                    Exact house number and gate access code are concealed to protect host privacy. They will be decrypted and displayed immediately upon host confirmation.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={advanceBookingStage}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Submit Slot Request</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: TRANSMITTING (Awaiting Confirmation) */}
          {bookingStage === 'TRANSMITTING' && (
            <div className="py-12 px-4 text-center space-y-6 animate-fade-in">
              <div className="relative h-20 w-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping" />
                <div className="relative h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                  <Zap className="h-9 w-9 animate-pulse" />
                </div>
              </div>
              <div className="max-w-sm mx-auto space-y-2">
                <h3 className="text-lg font-black text-slate-900">
                  Transmitting Request to {listing.hostName}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Encrypting session credentials and awaiting host response. (Simulated automated acceptance in 2 seconds...)
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={advanceBookingStage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <span>Fast-Forward: Simulate Instant Accept</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: ACCEPTED (Address & Gate PIN Revealed) */}
          {bookingStage === 'ACCEPTED' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-emerald-950">
                    Booking Confirmed by {listing.hostName}!
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium">
                    Host has accepted your emergency slot. Credentials and directions have been unlocked.
                  </p>
                </div>
              </div>

              {/* Host Card with Unmasked Address & Gate PIN */}
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-28 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src="/assets/images/garage_rajesh.jpg"
                    alt={listing.hostName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-900">{listing.hostName}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified Resident
                    </span>
                  </div>
                  {/* Exact Address Unmasked */}
                  <div className="space-y-0.5 text-xs text-slate-700">
                    <div className="flex items-start gap-1.5 font-bold text-slate-900">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{listing.location.exactAddress || listing.location.approximateLocality}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-5">
                      ~1.8 km from your stranded vehicle location
                    </p>
                  </div>
                </div>

                {/* High Contrast Gate PIN Box */}
                <div className="w-full sm:w-44 p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-1 shrink-0">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                    <Shield className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Gate Access PIN</span>
                  </div>
                  <div className="text-2xl font-black tracking-widest text-emerald-950 font-mono">
                    {gatePin}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPin}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[10px] font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    {copiedPin ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPin ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900">Access Instructions:</span>
                <p className="text-slate-600">{listing.accessNotes}</p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={advanceBookingStage}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Plug In &amp; Start Live Charging Session</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: CHARGING ACTIVE (Screen 4 Exact Mockup Match) */}
          {bookingStage === 'CHARGING' && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Host Card with Exact Address & Gate PIN (Screen 4 exact) */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src="/assets/images/garage_rajesh.jpg"
                      alt={listing.hostName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900">{listing.hostName}</h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Verified Resident</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 space-y-0.5">
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        <span>{listing.location.exactAddress || 'House 42B, Sector 4, Vasant Kunj, New Delhi'}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 pl-5">
                        ~ 1.8 km from your location
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gate Access PIN Box (Screen 4 Top Right) */}
                <div className="w-full sm:w-44 p-3 bg-[#EAF8F1] border border-emerald-200/90 rounded-2xl text-center space-y-1 shrink-0">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900">
                    <Shield className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Gate Access PIN</span>
                  </div>
                  <div className="text-2xl font-black tracking-widest text-emerald-950 font-mono">
                    {gatePin}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPin}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    {copiedPin ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedPin ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Charging in Progress Section Title */}
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Charging in Progress
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Your vehicle is currently charging at the host's residential charger.
                </p>
              </div>

              {/* Central Telemetry Grid: Circular Gauge (Left) + 4 Metrics (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Left: Circular Telemetry Gauge with EV Car Illustration (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* SVG Progress Arc Ring */}
                    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 select-none">
                      {/* Background track circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r="66"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="10"
                      />
                      {/* Animated Emerald Progress Ring (38% of circumference 414.7 = ~157.6) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="66"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="414.7"
                        strokeDashoffset="257.1"
                        className="transition-all duration-1000"
                      />
                    </svg>

                    {/* Centered Vehicle & Battery Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      {/* EV Car Cutout Image */}
                      <div className="w-24 h-16 flex items-center justify-center">
                        <img
                          src="/assets/images/nexon_ev.jpg"
                          alt="Connected Electric Vehicle"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                        38%
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 block">
                        Charging to 80%
                      </span>
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        +31%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: 4 Telemetry Metrics Cards (7 cols) */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Metric 1: Energy Delivered */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 col-span-1 sm:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Zap className="h-3.5 w-3.5" />
                        </div>
                        <span>8.4 kWh Delivered</span>
                      </div>
                      <span className="text-slate-500 font-semibold text-[11px]">of 15.0 kWh Requested</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '56%' }} />
                      </div>
                      <span className="text-[10px] font-black text-emerald-700">56%</span>
                    </div>
                  </div>

                  {/* Metric 2: Power Rate */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Power Rating</span>
                    <p className="text-sm font-black text-slate-900">7.4 kW AC (Level 2)</p>
                    <span className="text-[10px] text-slate-500 font-medium">230V / 32A Single Phase</span>
                  </div>

                  {/* Metric 3: Accumulated Demo Cost */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Accumulated Cost</span>
                    <p className="text-sm font-black text-emerald-600">₹100.80 accumulated</p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Rate: ₹{listing.pricePerKwhInr.toFixed(2)} / kWh
                    </span>
                  </div>

                  {/* Metric 4: Elapsed & Remaining Time */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1 col-span-1 sm:col-span-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="text-xs font-black text-slate-900">1 hr 08 min</span>
                        <span className="text-[10px] text-slate-500 font-medium block">Time Elapsed</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-blue-600">32 mins</span>
                      <span className="text-[10px] text-slate-500 font-medium block">Time to 80% (Est.)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host House Rules & Instructions Box (Mockup 4 Bottom) */}
              <div className="p-4 rounded-2xl bg-[#EAF8F1] border border-emerald-200/80 flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="space-y-1 text-xs text-slate-800">
                  <h5 className="font-bold text-slate-900">Host House Rules &amp; Instructions</h5>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-medium">
                    <li>Park on the left side of the driveway.</li>
                    <li>Socket is on the boundary wall (Type 2).</li>
                    <li>In case of any issue, call host: +91 98XXX XXXXX.</li>
                    <li>Please keep the area clean after charging.</li>
                  </ul>
                </div>
              </div>

              {/* Action Footer Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Info className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>Simulated Hackathon Demonstration &mdash; No actual monetary transaction will occur.</span>
                </div>
                <button
                  type="button"
                  onClick={advanceBookingStage}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>End Session &amp; Generate Final Receipt</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: COMPLETED / RECEIPT */}
          {bookingStage === 'COMPLETED' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <h3 className="text-base font-black text-slate-900">Charging Session Completed!</h3>
                <p className="text-xs text-slate-600 font-medium">
                  Your vehicle was successfully recharged from {p2pQuery.vehicleBatteryPct}% to 80% SOC.
                </p>
              </div>

              {/* Verified Electronic Receipt Card */}
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 overflow-hidden">
                {/* Background Watermark Pill */}
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-black tracking-wider uppercase">
                  Simulated Demo Receipt
                </div>

                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Receipt #EVK-{listing.gatePin || '7429'}-REC
                  </span>
                  <h4 className="text-sm font-black text-slate-900">
                    Host: {listing.hostName} ({listing.location.approximateLocality})
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Energy Delivered</span>
                    <span className="font-bold text-slate-900">15.0 kWh</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Session Duration</span>
                    <span className="font-bold text-slate-900">1 hr 45 min</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Host Tariff</span>
                    <span className="font-bold text-slate-900">₹{listing.pricePerKwhInr.toFixed(2)}/kWh</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Total Amount</span>
                    <span className="font-black text-emerald-600">
                      ₹{(15.0 * listing.pricePerKwhInr).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Prominent Zero Real Payment Claim */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    Zero real money collected. Hackathon demonstration simulation only.
                  </span>
                </div>

                {/* Host Rating */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Rate Host Experience:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setBookingStage('CHARGING')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Back to Active Session</span>
                </button>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
                >
                  Close &amp; Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
