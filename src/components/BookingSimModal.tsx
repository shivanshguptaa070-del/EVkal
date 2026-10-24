import { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  Shield,
  Copy,
  CheckCircle2,
  Zap,
  Clock,
  ArrowRight,
  Star,
  MapPin,
  Lock,
  RotateCcw,
  Play,
  Pause,
  FastForward,
  Phone,
  Navigation,
  Sparkles,
  BatteryCharging,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function BookingSimModal() {
  const {
    isBookingModalOpen,
    selectedChargerForBooking,
    bookingStage,
    setBookingStage,
    submitDriverBookingRequest,
    closeBookingModal,
    p2pQuery,
    userProfile,
  } = useSimulationStore();

  // Local interactive states for the 4-stage lifecycle
  const [currentSoC, setCurrentSoC] = useState<number>(18);
  const [targetSoC, setTargetSoC] = useState<number>(80);
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeProgress, setHandshakeProgress] = useState(0);

  // Live charging simulation telemetry
  const [isChargingPaused, setIsChargingPaused] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);
  const [liveSecondsElapsed, setLiveSecondsElapsed] = useState(72);
  const [liveDeliveredKwh, setLiveDeliveredKwh] = useState(3.4);

  // Copy / interaction feedbacks
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Host rating & review
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Easy Access', 'Fast Charging']);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Synchronize initial battery state from driver search query
  useEffect(() => {
    if (p2pQuery.vehicleBatteryPct && p2pQuery.vehicleBatteryPct > 0) {
      setCurrentSoC(p2pQuery.vehicleBatteryPct);
    } else {
      setCurrentSoC(18);
    }
  }, [p2pQuery.vehicleBatteryPct, isBookingModalOpen]);

  // Reset transient simulation telemetry when opening a new session
  useEffect(() => {
    if (isBookingModalOpen) {
      setIsChargingPaused(false);
      setIsFastForward(false);
      setLiveSecondsElapsed(45);
      setLiveDeliveredKwh(2.1);
      setReviewSubmitted(false);
      setIsHandshaking(false);
    }
  }, [isBookingModalOpen]);

  const pricePerKwh = selectedChargerForBooking?.pricePerKwhInr || 11.50;
  const powerKw = selectedChargerForBooking?.maxPowerKw || 7.4;
  const batteryCapacity = 50.5; // Tata Nexon EV Max battery kWh
  const vehicleName = userProfile?.vehicles?.[0]?.model || 'Tata Nexon EV Max';

  // Computed energy requirements
  const energyNeeded = useMemo(() => {
    const delta = Math.max(0, targetSoC - currentSoC);
    return Number(((batteryCapacity * delta) / 100).toFixed(1));
  }, [batteryCapacity, targetSoC, currentSoC]);

  const estTotalCost = useMemo(() => {
    return Number((energyNeeded * pricePerKwh).toFixed(2));
  }, [energyNeeded, pricePerKwh]);

  const estDurationHours = useMemo(() => {
    if (powerKw <= 0) return { h: 1, m: 30 };
    const rawHours = energyNeeded / powerKw;
    const h = Math.floor(rawHours);
    const m = Math.round((rawHours - h) * 60);
    return { h, m };
  }, [energyNeeded, powerKw]);

  // Live simulation tick effect during Stage 3 (CHARGING)
  useEffect(() => {
    if (bookingStage !== 'CHARGING' || isChargingPaused) return;

    const intervalRateMs = isFastForward ? 250 : 1000;
    const timer = setInterval(() => {
      setLiveSecondsElapsed((prev) => prev + 1);

      // Increment delivered energy based on charger rate
      // At 7.4 kW, 1 hour = 7.4 kWh, 1 sec = 7.4 / 3600 = ~0.002 kWh
      const kwhIncrement = (powerKw / 3600) * (isFastForward ? 12 : 2.5);
      setLiveDeliveredKwh((prev) => {
        const next = prev + kwhIncrement;
        return next > energyNeeded ? energyNeeded : Number(next.toFixed(2));
      });
    }, intervalRateMs);

    return () => clearInterval(timer);
  }, [bookingStage, isChargingPaused, isFastForward, powerKw, energyNeeded]);

  // Dynamically calculate live battery percentage from delivered energy
  const liveBatterySoC = useMemo(() => {
    const socGain = (liveDeliveredKwh / batteryCapacity) * 100;
    const calculated = currentSoC + socGain;
    return Math.min(targetSoC, Math.round(calculated));
  }, [liveDeliveredKwh, batteryCapacity, currentSoC, targetSoC]);

  // Handle stage 1 -> stage 2 submission with an animated handshake
  const handleStartRequest = () => {
    setIsHandshaking(true);
    setHandshakeProgress(10);

    const step1 = setTimeout(() => setHandshakeProgress(45), 400);
    const step2 = setTimeout(() => setHandshakeProgress(85), 900);
    const step3 = setTimeout(() => {
      setHandshakeProgress(100);
      setIsHandshaking(false);
      submitDriverBookingRequest();
      setBookingStage('ACCEPTED');
    }, 1400);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleSkipHandshake = () => {
    setIsHandshaking(false);
    submitDriverBookingRequest();
    setBookingStage('ACCEPTED');
  };

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(gatePin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(exactAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyReceipt = () => {
    const summary = `--- EVkal CHARGING RECEIPT ---
Receipt ID: #EVK-${gatePin}-REC-2026
Host: ${listing?.hostName} (${approximateArea})
Vehicle: ${vehicleName}
Starting SOC: ${currentSoC}% -> Final SOC: ${liveBatterySoC}%
Energy Delivered: ${liveDeliveredKwh} kWh
Duration: ${Math.floor(liveSecondsElapsed / 60)}m ${liveSecondsElapsed % 60}s
Rate: ₹${pricePerKwh.toFixed(2)}/kWh
Total Paid: ₹${(liveDeliveredKwh * pricePerKwh).toFixed(2)}
Status: Completed (Simulated Demo)`;
    navigator.clipboard?.writeText(summary);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (!isBookingModalOpen || !selectedChargerForBooking) {
    return null;
  }

  // Guaranteed non-null active charger listing details
  const listing = selectedChargerForBooking;
  const slotId = `EVK-${listing.gatePin || '7429'}`;
  const gatePin = listing.gatePin || '7429';
  const exactAddress = listing.location.exactAddress || 'House 42B, Sector 4, Vasant Kunj, New Delhi 110070';
  const approximateArea = listing.location.approximateLocality || 'Vasant Kunj Sector 4';

  // 4 Defined, crystal-clear user stages
  const STAGE_STEPS = [
    {
      id: 1,
      key: 'REVIEW',
      label: '1. Review & Request',
      sub: 'Specs & Tariff',
    },
    {
      id: 2,
      key: 'ACCEPTED',
      label: '2. Host Unlocked',
      sub: 'PIN & Directions',
    },
    {
      id: 3,
      key: 'CHARGING',
      label: '3. Live Charging',
      sub: 'Active Telemetry',
    },
    {
      id: 4,
      key: 'COMPLETED',
      label: '4. Session Receipt',
      sub: 'Invoice & Rating',
    },
  ];

  const currentStageIndex =
    bookingStage === 'TRANSMITTING'
      ? 1
      : STAGE_STEPS.findIndex((s) => s.key === bookingStage);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Community P2P Charging
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                Slot #{slotId}
              </span>
            </div>
            <h2 id="booking-modal-title" className="text-base font-black text-slate-900 tracking-tight">
              Charging with {listing.hostName}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeBookingModal}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 4-Step Progress Stepper */}
        <div className="px-6 py-3.5 bg-slate-50/90 border-b border-slate-200/80">
          <div className="grid grid-cols-4 gap-2 max-w-xl mx-auto">
            {STAGE_STEPS.map((step, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => {
                    // Allow navigating back to completed steps
                    if (isPast) {
                      setBookingStage(step.key as any);
                    }
                  }}
                  disabled={!isPast && !isCurrent}
                  className={`flex flex-col items-center text-center p-1.5 rounded-xl transition-all ${
                    isPast
                      ? 'cursor-pointer hover:bg-emerald-50'
                      : isCurrent
                      ? 'bg-white shadow-2xs border border-emerald-200/80'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1 ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 font-black shadow-xs'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="h-4 w-4 stroke-[3]" /> : step.id}
                  </div>
                  <span
                    className={`text-[11px] font-bold block leading-tight truncate w-full ${
                      isCurrent ? 'text-emerald-950 font-black' : isPast ? 'text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium hidden sm:block truncate w-full">
                    {step.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ========================================================================= */}
          {/* STAGE 1: REVIEW & CONFIGURE REQUEST */}
          {/* ========================================================================= */}
          {bookingStage === 'REVIEW' && (
            <div className="space-y-5 animate-fade-in">
              {/* Host & Location Summary Card */}
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <img
                    src="/assets/images/garage_rajesh.jpg"
                    alt={listing.hostName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{listing.hostName}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Verified Resident Host</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/60">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span>4.9 (24 charges)</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{approximateArea}</span>
                    <span className="text-[10px] text-slate-500">(Exact street decrypted upon confirmation)</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                    <span className="font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      ⚡ {powerKw} kW AC
                    </span>
                    <span className="font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      🔌 {listing.connectorTypes?.join(', ') || 'Type 2 AC'}
                    </span>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹{pricePerKwh.toFixed(2)} / kWh
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle & Energy Calculator Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    <span>Your Connected Vehicle:</span>
                    <span className="text-slate-600 font-semibold">{vehicleName} ({batteryCapacity} kWh)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Type 2 Compatible
                  </span>
                </div>

                {/* Two Interactive Sliders: Current Battery & Target Battery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Battery % */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Current Battery Level</span>
                      <span className="font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs">
                        {currentSoC}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={1}
                      value={currentSoC}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentSoC(val);
                        if (val >= targetSoC) setTargetSoC(Math.min(100, val + 20));
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>5% (Critical)</span>
                      <span>60% (Moderate)</span>
                    </div>
                  </div>

                  {/* Target Charge % */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Target Charge Level</span>
                      <span className="font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                        {targetSoC}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={Math.min(90, currentSoC + 10)}
                      max={100}
                      step={5}
                      value={targetSoC}
                      onChange={(e) => setTargetSoC(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>{currentSoC + 10}%</span>
                      <span>80% (Recommended)</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Battery Visual Graphic */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Recharge Scope:</span>
                    <span className="font-bold text-slate-900">
                      +{targetSoC - currentSoC}% gain ({energyNeeded} kWh energy)
                    </span>
                  </div>
                  <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                    <div
                      style={{ width: `${currentSoC}%` }}
                      className="h-full bg-amber-500 transition-all duration-300"
                      title={`Current SOC: ${currentSoC}%`}
                    />
                    <div
                      style={{ width: `${targetSoC - currentSoC}%` }}
                      className="h-full bg-emerald-500 transition-all duration-300 flex items-center justify-center text-[9px] text-white font-bold"
                      title={`Charging: +${targetSoC - currentSoC}%`}
                    >
                      +{(targetSoC - currentSoC) > 15 ? `${targetSoC - currentSoC}%` : ''}
                    </div>
                    <div className="flex-1 bg-slate-100" />
                  </div>
                </div>
              </div>

              {/* 4 Computed Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
                  <span className="text-slate-500 font-semibold block text-[11px]">Energy Needed</span>
                  <p className="text-base font-black text-slate-900">{energyNeeded} kWh</p>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    {currentSoC}% &rarr; {targetSoC}% SOC
                  </span>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
                  <span className="text-slate-500 font-semibold block text-[11px]">Estimated Time</span>
                  <p className="text-base font-black text-slate-900">
                    {estDurationHours.h}h {estDurationHours.m}m
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    @ {powerKw} kW AC speed
                  </span>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
                  <span className="text-slate-500 font-semibold block text-[11px]">Host Tariff</span>
                  <p className="text-base font-black text-slate-900">₹{pricePerKwh.toFixed(2)}</p>
                  <span className="text-[10px] text-slate-500 font-medium block">per kWh delivered</span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 shadow-2xs">
                  <span className="text-emerald-800 font-semibold block text-[11px]">Estimated Total</span>
                  <p className="text-base font-black text-emerald-700">₹{estTotalCost.toFixed(2)}</p>
                  <span className="text-[10px] text-emerald-700/80 font-bold block">Demo pricing</span>
                </div>
              </div>

              {/* Privacy Obfuscation Notice Box */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
                <Lock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">Host Privacy Protection Active</span>
                  <p className="text-[11px] text-blue-800/90 leading-relaxed font-medium">
                    Exact house number, parking bay location, and gate access code remain encrypted until you transmit your reservation request.
                  </p>
                </div>
              </div>

              {/* Handshake Overlay or Regular Action Buttons */}
              {isHandshaking ? (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-bold">
                        {handshakeProgress < 40
                          ? `Transmitting reservation to ${listing.hostName}...`
                          : handshakeProgress < 80
                          ? 'Verifying DISCOM transformer feeder capacity...'
                          : 'Host confirmed! Unlocking access pass...'}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">{handshakeProgress}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${handshakeProgress}%` }}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSkipHandshake}
                      className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      Skip to Unlocked State &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStartRequest}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Transmit Reservation Request</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: HOST UNLOCKED & GATE PASSCODE REVEALED */}
          {/* ========================================================================= */}
          {(bookingStage === 'ACCEPTED' || bookingStage === 'TRANSMITTING') && (
            <div className="space-y-5 animate-fade-in">
              {/* Confirmed Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-emerald-950">
                    Booking Confirmed by {listing.hostName}!
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium">
                    Slot #{slotId} is reserved for you. Host address and gate pass code are now unlocked.
                  </p>
                </div>
              </div>

              {/* Host Profile & Unmasked Location Card */}
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src="/assets/images/garage_rajesh.jpg"
                    alt={listing.hostName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-900">{listing.hostName}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified Resident
                    </span>
                  </div>

                  {/* Unmasked Exact Address */}
                  <div className="space-y-1 text-xs text-slate-700">
                    <div className="flex items-start gap-1.5 font-bold text-slate-900">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{exactAddress}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-5">
                      ~1.8 km from your location &bull; Estimated 5 mins driving time
                    </p>
                  </div>

                  {/* Action buttons for navigation */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {copiedAddress ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedAddress ? 'Address Copied!' : 'Copy Address'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Directions opened: Navigate to ${exactAddress}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>Get Driving Directions</span>
                    </button>
                  </div>
                </div>

                {/* Prominent High-Contrast Gate PIN Box */}
                <div className="w-full sm:w-44 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1 shrink-0 shadow-2xs">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900">
                    <Shield className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Gate Access PIN</span>
                  </div>
                  <div className="text-2xl font-black tracking-widest text-emerald-950 font-mono">
                    #{gatePin}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPin}
                    className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100/50 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedPin ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPin ? 'PIN Copied!' : 'Copy PIN'}</span>
                  </button>
                </div>
              </div>

              {/* Host House Rules & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">🚗 Driveway &amp; Parking Instructions</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {listing.accessNotes || 'Park on the left side of the driveway. Wallbox socket is on the brick boundary pillar.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 block">📞 Host Direct Contact</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Available Now
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Phone: <strong className="text-slate-800">+91 98102 34567</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('Dialing Host Rajesh K. (+91 98102 34567)...')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer pt-0.5"
                  >
                    <Phone className="h-3 w-3" />
                    <span>Call Host for Assistance</span>
                  </button>
                </div>
              </div>

              {/* Feeder & Safety Verification Pill */}
              <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    DISCOM Transformer Feeder Status: <strong>Safe Margin (42% capacity available)</strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Grid Safe
                </span>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setBookingStage('REVIEW')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  &larr; Back to Review
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStage('CHARGING')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="h-4 w-4" />
                  <span>I&apos;ve Arrived &amp; Plugged In &rarr; Start Live Charging</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: LIVE CHARGING SESSION & TELEMETRY */}
          {/* ========================================================================= */}
          {bookingStage === 'CHARGING' && (
            <div className="space-y-6 animate-fade-in">
              {/* Host Summary Bar with Gate PIN */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{listing.hostName}&apos;s Charger</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {powerKw} kW AC Active
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{exactAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Gate PIN:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-950 font-mono font-bold text-xs">
                    #{gatePin}
                  </span>
                </div>
              </div>

              {/* Central Telemetry Command Center: Radial Gauge + 4 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Left: Dynamic Circular SVG Battery Ring (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 select-none">
                      {/* Background track */}
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="10"
                      />
                      {/* Dynamic animated progress ring */}
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        fill="none"
                        stroke={isChargingPaused ? '#F59E0B' : '#10B981'}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="402"
                        strokeDashoffset={402 - (402 * liveBatterySoC) / 100}
                        className="transition-all duration-700"
                      />
                    </svg>

                    {/* Centered Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                      <BatteryCharging
                        className={`h-6 w-6 ${
                          isChargingPaused ? 'text-amber-500' : 'text-emerald-600 animate-pulse'
                        }`}
                      />
                      <span className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
                        {liveBatterySoC}%
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 block mt-0.5">
                        Target: {targetSoC}%
                      </span>
                      <span
                        className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isChargingPaused
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isChargingPaused ? 'PAUSED' : `+${liveBatterySoC - currentSoC}% GAIN`}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 mt-2 block">{vehicleName}</span>
                </div>

                {/* Right: 4 Real-Time Metrics Cards (7 cols) */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Metric 1: Energy Delivered with Progress Bar */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 col-span-1 sm:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        <span>{liveDeliveredKwh} kWh Delivered</span>
                      </div>
                      <span className="text-slate-500 font-semibold text-[11px]">
                        Target: {energyNeeded} kWh
                      </span>
                    </div>
                    {/* Animated Fill Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (liveDeliveredKwh / (energyNeeded || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-emerald-700">
                        {Math.min(100, Math.round((liveDeliveredKwh / (energyNeeded || 1)) * 100))}%
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Power Rate */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Charging Rate</span>
                    <p className="text-base font-black text-slate-900">{powerKw} kW AC</p>
                    <span className="text-[10px] text-slate-500 font-medium">230V / 32A Single Phase</span>
                  </div>

                  {/* Metric 3: Accumulated Demo Cost */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Accumulated Cost</span>
                    <p className="text-base font-black text-emerald-600">
                      ₹{(liveDeliveredKwh * pricePerKwh).toFixed(2)}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Rate: ₹{pricePerKwh.toFixed(2)}/kWh
                    </span>
                  </div>

                  {/* Metric 4: Elapsed & Remaining Time */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 col-span-1 sm:col-span-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="text-xs font-black text-slate-900">
                          {Math.floor(liveSecondsElapsed / 60)}m {liveSecondsElapsed % 60}s
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block">Time Elapsed</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-blue-600">
                        {Math.max(
                          2,
                          Math.round(((energyNeeded - liveDeliveredKwh) / (powerKw || 1)) * 60)
                        )}{' '}
                        mins
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        Estimated to {targetSoC}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Telemetry Controls (Pause/Resume + 10x Speed for Demo) */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Interactive Demo Controls:</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChargingPaused((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isChargingPaused
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isChargingPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                    <span>{isChargingPaused ? 'Resume Session' : 'Pause Session'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFastForward((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isFastForward
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <FastForward className="h-3.5 w-3.5" />
                    <span>{isFastForward ? '10x Speed (ON)' : 'Fast-Forward (10x)'}</span>
                  </button>
                </div>
              </div>

              {/* Action Footer Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  Smart relay active &bull; Earth leakage safety verified
                </span>
                <button
                  type="button"
                  onClick={() => setBookingStage('COMPLETED')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Stop Charging &amp; Generate Final Receipt</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 4: SESSION RECEIPT & HOST RATING */}
          {/* ========================================================================= */}
          {bookingStage === 'COMPLETED' && (
            <div className="space-y-5 animate-fade-in">
              {/* Success Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <h3 className="text-base font-black text-slate-900">Charging Session Completed!</h3>
                <p className="text-xs text-slate-600 font-medium">
                  Your vehicle was recharged from {currentSoC}% &rarr; {liveBatterySoC}% SOC (+
                  {liveBatterySoC - currentSoC}% gain).
                </p>
              </div>

              {/* Itemized Digital Electronic Receipt */}
              <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4 overflow-hidden">
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Verified Electronic Receipt
                </div>

                <div className="border-b border-slate-200 pb-3 space-y-0.5">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Receipt #EVK-{gatePin}-REC-2026
                  </span>
                  <h4 className="text-sm font-black text-slate-900">
                    Host: {listing.hostName} ({approximateArea})
                  </h4>
                  <p className="text-[11px] text-slate-500">Date: Today, 24 Oct 2026 &bull; Slot #{slotId}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Energy Delivered</span>
                    <span className="font-bold text-slate-900">{liveDeliveredKwh} kWh</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Session Duration</span>
                    <span className="font-bold text-slate-900">
                      {Math.floor(liveSecondsElapsed / 60)}m {liveSecondsElapsed % 60}s
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Tariff Rate</span>
                    <span className="font-bold text-slate-900">₹{pricePerKwh.toFixed(2)}/kWh</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium text-[10px] block">Total Amount</span>
                    <span className="font-black text-emerald-600 text-sm">
                      ₹{(liveDeliveredKwh * pricePerKwh).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Line Items Breakdown */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Energy Charges ({liveDeliveredKwh} kWh @ ₹{pricePerKwh.toFixed(2)})</span>
                    <span>₹{(liveDeliveredKwh * pricePerKwh).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>DISCOM Feeder Capacity Margin Fee</span>
                    <span className="text-emerald-700 font-semibold">₹0.00 (Exempt)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Community Platform Service Fee</span>
                    <span className="text-emerald-700 font-semibold">₹0.00 (Free Demo)</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                    <span>Final Amount Settled</span>
                    <span className="text-emerald-700">₹{(liveDeliveredKwh * pricePerKwh).toFixed(2)}</span>
                  </div>
                </div>

                {/* Prominent Zero Real Payment Hackathon Pill */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    Zero real money collected. Hackathon demonstration simulation only.
                  </span>
                </div>

                {/* Host Rating & Review Section */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Rate Host Experience:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Quick Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Clean Driveway', 'Fast Charging', 'Easy Access', 'Courteous Host', 'Safe Location'].map(
                      (tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {tag}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {reviewSubmitted ? (
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
                      ✓ Thank you! Review saved to {listing.hostName}&apos;s profile.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReviewSubmitted(true)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                    >
                      Submit Rating &amp; Feedback
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedReceipt ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedReceipt ? 'Receipt Copied!' : 'Copy Receipt Details'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setBookingStage('CHARGING')}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Back to Active</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Done &amp; Close Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
