import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Building2,
  Store,
  MapPin,
  Check,
  CheckCircle2,
  Zap,
  Info,
  DollarSign,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ChargerListing, ConnectorType, DayTimeWindow } from '../types/p2p';

interface ListCommunityChargerPageProps {
  onBack?: () => void;
}

type PropertyType = 'HOME' | 'APARTMENT' | 'COMMERCIAL';

export function ListCommunityChargerPage({ onBack }: ListCommunityChargerPageProps) {
  const { addChargerListing, setP2PSubView } = useSimulationStore();

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State (Default values matching user mockup)
  const [displayName, setDisplayName] = useState('Shivharsh T.');
  const [propertyType, setPropertyType] = useState<PropertyType>('HOME');
  const [neighborhood, setNeighborhood] = useState('Saket Block J, South Delhi');
  const [description, setDescription] = useState('Covered parking with easy access. Safe and secure.');

  // Step 2 & 3 state (for preview & subsequent wizard steps)
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType>('TYPE_2');
  const [maxPowerKw, setMaxPowerKw] = useState<number>(11.0);
  const [pricePerKwh, setPricePerKwh] = useState<number>(12.0);
  const [exactAddress, setExactAddress] = useState('House 14, Lane 2, Saket Block J, New Delhi 110017');
  const [gatePin, setGatePin] = useState('6824');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else if (onBack) {
      onBack();
    } else {
      setP2PSubView('BROWSE');
    }
  };

  const handleNextClick = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handlePublish();
    }
  };

  const handlePublish = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const days: (1 | 2 | 3 | 4 | 5 | 6 | 7)[] = [1, 2, 3, 4, 5, 6, 7];
    const newWindows: DayTimeWindow[] = days.map((day) => ({
      dayOfWeek: day,
      startHour: 8,
      endHour: 22,
    }));

    const newListing: ChargerListing = {
      id: `HOST-SHIVHARSH-${randomSuffix}`,
      hostName: displayName.trim() || 'Shivharsh T.',
      isHostVerified: true,
      isDemoListing: true,
      connectorTypes: [selectedConnector],
      maxPowerKw: maxPowerKw,
      pricePerKwhInr: pricePerKwh,
      availabilityWindows: newWindows,
      location: {
        latitude: 28.5280,
        longitude: 77.1680,
        approximateLocality: neighborhood.trim() || 'Saket Block J, South Delhi',
        exactAddress: exactAddress.trim() || 'House 14, Lane 2, Saket Block J, New Delhi 110017',
      },
      accessNotes: description.trim() || 'Covered parking slot #1. Safe and secure.',
      gatePin: gatePin.trim() || '6824',
    };

    addChargerListing(newListing);
    setIsSubmitted(true);
    setTimeout(() => {
      if (onBack) onBack();
      else setP2PSubView('BROWSE');
    }, 1200);
  };

  // Steps definition for wizard
  const steps = [
    { number: 1, label: 'Basic Details' },
    { number: 2, label: 'Charger & Power' },
    { number: 3, label: 'Availability & Pricing' },
    { number: 4, label: 'Location & Access' },
    { number: 5, label: 'Review & Publish' },
  ];

  // Property label helper
  const getPropertyLabel = (type: PropertyType) => {
    switch (type) {
      case 'HOME':
        return 'Home Charger';
      case 'APARTMENT':
        return 'Apartment Charger';
      case 'COMMERCIAL':
        return 'Commercial Charger';
    }
  };

  // Connector label helper
  const getConnectorLabel = (type: ConnectorType) => {
    switch (type) {
      case 'TYPE_2':
        return 'Type 2 AC';
      case 'CCS_2':
        return 'CCS 2 (DC)';
      case 'BHARAT_AC001':
        return 'Bharat AC001';
      case 'CHADEMO':
        return 'CHAdeMO';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header Row: Back Button + Title */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={handleBackClick}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          List Your Community Charger
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Share your home charger with EV neighbors and earn passive income.
        </p>
      </div>

      {/* Success notification if published */}
      {isSubmitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold">Charger Successfully Listed!</p>
            <p className="text-xs text-emerald-600 font-medium">
              Redirecting you to the live community chargers map...
            </p>
          </div>
        </div>
      )}

      {/* 2. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Stepper Navigation + Form Card */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-5 items-start">
          {/* Vertical Stepper Navigation (Left Sidebar) */}
          <div className="w-full md:w-44 shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-1 py-1 select-none">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.number;
              const isPast = currentStep > step.number;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.number} className="flex flex-col items-start">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.number)}
                    className="flex items-center gap-3 text-left py-1.5 cursor-pointer group"
                  >
                    {/* Step Circle Badge */}
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-xs'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'border-2 border-slate-300 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {isPast ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : step.number}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-xs font-bold transition-colors hidden sm:inline ${
                        isActive
                          ? 'text-slate-900'
                          : isPast
                          ? 'text-slate-700'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {/* Vertical Connector Line (between steps) */}
                  {!isLast && (
                    <div className="hidden md:block w-0.5 h-6 bg-slate-200 ml-3.5 my-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card (Step Content) */}
          <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-6">
            {/* STEP 1: Basic Details (Matches mockup screenshot exactly) */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Basic Details
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Tell us a few basic details about your charger.
                  </p>
                </div>

                {/* Field 1: Display Name */}
                <div className="space-y-1.5">
                  <label htmlFor="display-name" className="text-xs font-bold text-slate-800 block">
                    Display Name
                  </label>
                  <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Shivharsh T."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-2xs"
                  />
                </div>

                {/* Field 2: Property Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Property Type
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Home Option */}
                    <button
                      type="button"
                      onClick={() => setPropertyType('HOME')}
                      className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        propertyType === 'HOME'
                          ? 'border-[#059669] bg-[#F0FDF4] text-slate-900 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {propertyType === 'HOME' && (
                        <div className="h-4 w-4 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <Home className="h-4 w-4 text-slate-600" />
                      <span>Home</span>
                    </button>

                    {/* Apartment Option */}
                    <button
                      type="button"
                      onClick={() => setPropertyType('APARTMENT')}
                      className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        propertyType === 'APARTMENT'
                          ? 'border-[#059669] bg-[#F0FDF4] text-slate-900 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {propertyType === 'APARTMENT' && (
                        <div className="h-4 w-4 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <Building2 className="h-4 w-4 text-slate-600" />
                      <span>Apartment</span>
                    </button>

                    {/* Commercial Option */}
                    <button
                      type="button"
                      onClick={() => setPropertyType('COMMERCIAL')}
                      className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        propertyType === 'COMMERCIAL'
                          ? 'border-[#059669] bg-[#F0FDF4] text-slate-900 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {propertyType === 'COMMERCIAL' && (
                        <div className="h-4 w-4 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <Store className="h-4 w-4 text-slate-600" />
                      <span>Commercial</span>
                    </button>
                  </div>
                </div>

                {/* Field 3: Neighborhood / Area */}
                <div className="space-y-1.5">
                  <label htmlFor="neighborhood" className="text-xs font-bold text-slate-800 block">
                    Neighborhood / Area
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="neighborhood"
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="e.g. Saket Block J, South Delhi"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Field 4: Short Description (Optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-xs font-bold text-slate-800 block">
                    Short Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    maxLength={200}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe parking ease, wallbox location, or gate access..."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all resize-none shadow-2xs"
                  />
                  <div className="flex justify-end text-[11px] text-slate-400 font-medium">
                    <span>{description.length}/200</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Charger & Power */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Charger &amp; Power Specifications
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Select the plug type and power rating of your charger.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Connector Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'TYPE_2', label: 'Type 2 AC', desc: 'Standard Indian EV AC' },
                      { id: 'CCS_2', label: 'CCS 2 (DC)', desc: 'Fast DC Combo socket' },
                      { id: 'BHARAT_AC001', label: 'Bharat AC001', desc: '15A/16A industrial plug' },
                      { id: 'CHADEMO', label: 'CHAdeMO', desc: 'Japanese DC connector' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedConnector(item.id as ConnectorType)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedConnector === item.id
                            ? 'border-[#059669] bg-[#F0FDF4] text-slate-900'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{item.label}</span>
                          {selectedConnector === item.id && (
                            <Check className="h-3.5 w-3.5 text-[#059669] stroke-[3]" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Maximum Power Rating</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3.3, 7.4, 11.0, 22.0].map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => setMaxPowerKw(kw)}
                        className={`py-2.5 px-2 rounded-xl border text-center cursor-pointer transition-all ${
                          maxPowerKw === kw
                            ? 'border-[#059669] bg-[#F0FDF4] text-[#059669] font-black'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-semibold'
                        }`}
                      >
                        <span className="text-xs">{kw} kW</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Availability & Pricing */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Availability &amp; Pricing
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Set your charging tariff and when neighbors can use your slot.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Host Rate per kWh</span>
                    <span className="text-[#059669] font-black text-sm">₹{pricePerKwh.toFixed(2)} / kWh</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={20}
                    step={0.5}
                    value={pricePerKwh}
                    onChange={(e) => setPricePerKwh(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>₹8.00 (Off-Peak)</span>
                    <span>₹14.00 (Standard)</span>
                    <span>₹20.00 (Peak)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Weekly Schedule Window</span>
                  <p className="text-xs text-slate-500">
                    Available daily from <strong>08:00 AM to 10:00 PM</strong>. Configured to align with neighborhood daylight hours.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Location & Access */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Location &amp; Access Controls
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Your exact address and PIN stay encrypted until a neighbor's booking is confirmed.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Exact Street Address</label>
                  <input
                    type="text"
                    value={exactAddress}
                    onChange={(e) => setExactAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Gate / Padlock Access PIN</label>
                  <input
                    type="text"
                    value={gatePin}
                    onChange={(e) => setGatePin(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Review & Publish */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Review &amp; Publish Listing
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Everything looks ready! Confirm your details to publish your community charger.
                  </p>
                </div>

                <div className="divide-y divide-slate-100 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Host Name</span>
                    <span className="font-bold text-slate-900">{displayName}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Property &amp; Locality</span>
                    <span className="font-bold text-slate-900">{neighborhood}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Connector &amp; Power</span>
                    <span className="font-bold text-slate-900">{getConnectorLabel(selectedConnector)} ({maxPowerKw} kW)</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Tariff</span>
                    <span className="font-bold text-[#059669]">₹{pricePerKwh.toFixed(2)} / kWh</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Button: Next or Publish */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleNextClick}
                className="w-full py-3.5 px-6 bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentStep === 5 ? 'Publish Charger Listing' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Preview + Earnings + Benefits (Matches Mockup Exactly) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Preview
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              This is how your charger will appear to nearby EV drivers.
            </p>
          </div>

          {/* 1. Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Photo */}
              <div className="w-full sm:w-44 h-36 rounded-2xl overflow-hidden shrink-0 shadow-xs relative bg-slate-100">
                <img
                  src="/assets/images/shivharsh_villa.jpg"
                  alt="Shivharsh Villa Charger"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to dr_neha_villa if not loaded
                    (e.target as HTMLImageElement).src = '/assets/images/dr_neha_villa.jpg';
                  }}
                />
              </div>

              {/* Host & Meta Details */}
              <div className="flex-1 space-y-2">
                {/* Host Name + Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {displayName || 'Shivharsh T.'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-emerald-200/80 text-[#059669] text-[11px] font-bold">
                    <Check className="h-3 w-3 stroke-[3]" />
                    <span>Verified Resident</span>
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{neighborhood || 'Saket Block J, South Delhi'}</span>
                </div>

                {/* Spec Pills Row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Connector & Power */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                      <Zap className="h-3.5 w-3.5 fill-[#059669]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">
                        {getConnectorLabel(selectedConnector)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight">
                        {maxPowerKw} kW
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                      ₹
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">
                        ₹{pricePerKwh.toFixed(2)} / kWh
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight">
                        Host Set Rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Tag Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-semibold text-slate-600">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>Covered Parking</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-semibold text-slate-600">
                <Home className="h-3 w-3 text-slate-400" />
                <span>{getPropertyLabel(propertyType)}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-semibold text-slate-600">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>Verified Resident</span>
              </span>
            </div>
          </div>

          {/* 2. Estimated Monthly Earnings Card */}
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-[#DCFCE7] text-[#059669] flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs">
                ₹
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <span>Estimated Monthly Earnings</span>
                  <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Based on average community usage
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xl sm:text-2xl font-black text-[#059669] tracking-tight">
                ₹4,662
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                / month (est.)
              </div>
            </div>
          </div>

          {/* 3. Why List Your Charger? Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Why List Your Charger?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Feature 1: Earn Income */}
              <div className="space-y-1.5">
                <div className="h-8 w-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shadow-2xs">
                  <DollarSign className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900">Earn Income</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Get paid for your unused charging time.
                </p>
              </div>

              {/* Feature 2: Help EV Neighbors */}
              <div className="space-y-1.5">
                <div className="h-8 w-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shadow-2xs">
                  <Users className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900">Help EV Neighbors</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Support your local community.
                </p>
              </div>

              {/* Feature 3: Safe & Secure */}
              <div className="space-y-1.5">
                <div className="h-8 w-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900">Safe &amp; Secure</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Your exact address is hidden until booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
