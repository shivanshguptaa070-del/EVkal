import { useState, useEffect } from 'react';
import {
  Zap,
  ArrowRight,
  ArrowDown,
  Check,
  BarChart3,
  Calendar,
  MapPin,
  Leaf,
  ShieldCheck,
  IndianRupee,
  Sun,
  Moon,
  Radio,
  Play,
  Pause,
  Car,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ChargerListing } from '../types/p2p';

// 24-Hour Load Data for the interactive Dual-Curve chart
const DUAL_CURVE_DATA = [
  { hour: 0, baseline: 32.5, optimised: 32.5 },
  { hour: 2, baseline: 28.0, optimised: 28.0 },
  { hour: 4, baseline: 25.4, optimised: 27.0 },
  { hour: 6, baseline: 38.2, optimised: 38.2 },
  { hour: 8, baseline: 48.0, optimised: 48.0 },
  { hour: 10, baseline: 52.1, optimised: 52.1 },
  { hour: 12, baseline: 58.4, optimised: 58.4 },
  { hour: 14, baseline: 64.0, optimised: 64.0 },
  { hour: 16, baseline: 74.2, optimised: 74.2 },
  { hour: 18, baseline: 98.6, optimised: 78.5 },
  { hour: 19, baseline: 122.8, optimised: 79.2 }, // PEAK HOUR
  { hour: 20, baseline: 114.5, optimised: 78.8 },
  { hour: 21, baseline: 88.0, optimised: 72.0 },
  { hour: 22, baseline: 65.2, optimised: 65.2 },
  { hour: 23, baseline: 45.0, optimised: 48.0 },
];

interface CommunityPin {
  id: string;
  name: string;
  hostName: string;
  distanceKm: number;
  rateInr: number;
  powerKw: number;
  connectorType: string;
  xPct: number; // percentage coordinate on radar
  yPct: number;
}

const COMMUNITY_PINS: CommunityPin[] = [
  {
    id: 'CHG-101',
    name: 'Rajesh Garage Charger',
    hostName: 'Rajesh Kumar',
    distanceKm: 0.4,
    powerKw: 7.4,
    rateInr: 12,
    connectorType: 'Type-2 AC',
    xPct: 24,
    yPct: 22,
  },
  {
    id: 'CHG-102',
    name: 'Priya Driveway EV Box',
    hostName: 'Priya Sharma',
    distanceKm: 1.1,
    powerKw: 11.0,
    rateInr: 14,
    connectorType: 'Fast AC Type-2',
    xPct: 74,
    yPct: 28,
  },
  {
    id: 'CHG-103',
    name: 'Amit Basement Point',
    hostName: 'Amit Verma',
    distanceKm: 1.6,
    powerKw: 3.3,
    rateInr: 9,
    connectorType: '16A 3-Pin / IEC',
    xPct: 28,
    yPct: 76,
  },
  {
    id: 'CHG-104',
    name: 'Green Villa Smart Socket',
    hostName: 'Vikram Mehta',
    distanceKm: 1.8,
    powerKw: 7.4,
    rateInr: 11,
    connectorType: 'Type-2 AC',
    xPct: 72,
    yPct: 74,
  },
];

export function LandingHeroPage() {
  const { setActiveTab, setActiveP0SubPage, solverOutput, transformerConfig, openBookingModal, openAuthView } = useSimulationStore();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Micro-telemetry live fluctuation simulation
  const [telemetryJitter, setTelemetryJitter] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      // gentle organic fluctuation between -0.6 and +0.6 kW
      const jitter = (Math.random() - 0.5) * 1.2;
      setTelemetryJitter(jitter);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Dual-Curve interactive scrubbing & animation state
  const [selectedHour, setSelectedHour] = useState<number>(19); // Default to peak hour 19:00
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlayingReplay) {
      interval = setInterval(() => {
        setSelectedHour((prev) => (prev >= 23 ? 0 : prev + 1));
      }, 700);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingReplay]);

  // Radar range & selected pin state
  const [radarRangeKm, setRadarRangeKm] = useState<number>(2);
  const [activePin, setActivePin] = useState<CommunityPin | null>(null);

  // How EVkal Works active step cycling
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isStepAutoCycle, setIsStepAutoCycle] = useState<boolean>(true);

  useEffect(() => {
    if (!isStepAutoCycle) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isStepAutoCycle]);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Live demand & capacity calculation
  const baseDemand = solverOutput?.summary?.optimisedPeakKw ?? 68.4;
  const currentDemand = Math.round((baseDemand + telemetryJitter) * 10) / 10;
  const capacityKw = transformerConfig?.ratedCapacityKw ?? 100.0;
  const loadPercentage = Math.min(100, Math.round((currentDemand / capacityKw) * 100));

  // Current scrubbed point data
  const currentPoint =
    DUAL_CURVE_DATA.find((d) => d.hour === selectedHour) ||
    DUAL_CURVE_DATA[DUAL_CURVE_DATA.length - 1];

  return (
    <div
      className={`w-full flex flex-col ${
        isDarkMode ? 'bg-[#0B0F17] text-slate-100' : 'bg-slate-900 text-slate-100'
      } overflow-x-hidden font-sans transition-colors duration-500`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (Fixed Glassmorphic Header)
         ───────────────────────────────────────────────────────────── */}
      <nav className="w-full border-b border-white/10 bg-[#0B0F17]/85 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Official EVkal Logo */}
          <div
            onClick={() => scrollToSection('hero-section')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <img
              src="/assets/images/evkal_logo.png"
              alt="EVkal Brand Logo"
              className="h-10 w-10 rounded-xl object-cover border border-emerald-400/40 shadow-[0_0_15px_rgba(0,229,153,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(0,229,153,0.6)] transition-all"
            />
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tight text-white">EV</span>
              <span className="text-2xl font-black tracking-tight text-[#00E599]">kal</span>
              <span className="ml-1.5 h-2 w-2 rounded-full bg-[#00E599] animate-ping"></span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection('hero-section')}
              className="text-[#00E599] font-bold border-b-2 border-[#00E599] pb-0.5 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features-section')}
              className="hover:text-white hover:text-emerald-300 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works-section')}
              className="hover:text-white hover:text-emerald-300 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact-section')}
              className="hover:text-white hover:text-emerald-300 transition-colors"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="hover:text-white hover:text-emerald-300 transition-colors"
            >
              About
            </button>
          </div>

          {/* Right Action Elements */}
          <div className="flex items-center gap-3">
            {/* Quick Switcher for Simulation Dashboards */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold shadow-inner">
              <button
                onClick={() => setActiveTab('P0_GRID')}
                className="px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 group"
                title="Open Smart Grid & Transformer Optimizer"
              >
                <Zap className="h-3 w-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>P0 Grid</span>
              </button>
              <button
                onClick={() => setActiveTab('P1_P2P')}
                className="px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 group"
                title="Open P2P Community Charger Sharing"
              >
                <MapPin className="h-3 w-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>P1 P2P</span>
              </button>
            </div>

            {/* Dark / Mood Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="h-9 w-9 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:border-emerald-500/40 shadow-sm"
              title="Toggle theme appearance"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-cyan-300" />}
            </button>

            {/* "Sign In" Button */}
            <button
              onClick={() => openAuthView('SIGN_IN')}
              className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-full border border-slate-700/70 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              Sign In
            </button>

            {/* "Get Started →" CTA Pill Button */}
            <button
              onClick={() => openAuthView('SIGN_UP')}
              className="bg-[#00E599] hover:bg-[#00c984] text-slate-950 font-black px-5 py-2 rounded-full shadow-[0_0_20px_rgba(0,229,153,0.35)] hover:shadow-[0_0_30px_rgba(0,229,153,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs sm:text-sm flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO MAIN SECTION (Dusk Background + Live Status Widget)
         ───────────────────────────────────────────────────────────── */}
      <section
        id="hero-section"
        className="relative min-h-[600px] sm:min-h-[660px] lg:min-h-[720px] w-full flex items-center justify-center overflow-hidden"
      >
        {/* Background Image: White EV crossover plugged in at dusk with city skyline */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 hover:scale-[1.01]"
          style={{
            backgroundImage: `url('/assets/images/hero_ev_dusk_background.jpg')`,
          }}
        />

        {/* Dynamic Neon LED Glowing Strip on the wallbox charger (Right Carport Side) */}
        <div
          className="hidden lg:block absolute right-[10%] top-[40%] w-2 h-28 rounded-full bg-[#00E599] animate-pulse-beacon pointer-events-none"
          style={{
            boxShadow: '0 0 25px #00E599, 0 0 50px rgba(0, 229, 153, 0.8), 0 0 80px rgba(0, 229, 153, 0.4)',
          }}
        />

        {/* Ambient Dark Gradient Overlays for High-Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/95 via-[#070B14]/80 to-[#070B14]/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#070B14]/80 to-transparent pointer-events-none" />

        {/* Ambient Electric Particle Shimmer effect */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Top Badge Capsule */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-200 text-xs sm:text-sm font-semibold shadow-xl">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E599] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E599]"></span>
              </span>
              <span className="text-[#00E599] font-bold">⚡ Smart Charging</span>
              <span className="text-slate-500">•</span>
              <span>Greener Grids</span>
              <span className="text-slate-500">•</span>
              <span>Stronger Communities</span>
            </div>

            {/* Hero Main Headline (Exact typography from mockup) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Charge Smarter. <br />
              Drive Farther. <br />
              Power a{' '}
              <span className="text-[#00E599] animate-electric-breathe inline-block">
                Greener Tomorrow.
              </span>
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              EVkal is a smart EV charging and community sharing platform that optimizes charging schedules to
              prevent transformer overloads and helps drivers find nearby private chargers when they need them.
            </p>

            {/* Action Buttons with rich hover and glow */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('P0_GRID')}
                className="bg-[#00E599] hover:bg-[#00c984] text-slate-950 font-black px-7 py-3.5 rounded-full shadow-[0_0_25px_rgba(0,229,153,0.35)] hover:shadow-[0_0_40px_rgba(0,229,153,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2.5 text-sm sm:text-base group cursor-pointer"
              >
                <Zap className="h-4 w-4 fill-slate-950 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Optimize Charging Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
              </button>

              <button
                onClick={() => setActiveTab('P1_P2P')}
                className="bg-slate-900/85 hover:bg-slate-800/90 text-white border border-slate-700/80 hover:border-emerald-400/60 font-semibold px-6 py-3.5 rounded-full shadow-lg backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-[#00E599]" />
                <span>Find Nearby Chargers</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Live Grid Status Widget (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-[#0B132B]/85 hover:bg-[#0B132B]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-[#00E599]/40 animate-float-gentle">
              {/* Card Header with pulsing Stable beacon */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-2">
                  <Radio className="h-4 w-4 text-[#00E599] animate-pulse" />
                  Live Grid Status
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 text-xs font-semibold shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Stable</span>
                </div>
              </div>

              {/* Card Body: Live Demand Numbers + Glowing Donut Gauge */}
              <div className="flex items-center justify-between gap-4 pt-5">
                {/* Demand & Capacity Text */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Current Demand</span>
                    <span className="text-2xl font-black font-mono text-white tracking-tight flex items-baseline gap-1.5">
                      {currentDemand.toFixed(1)} <span className="text-sm font-bold text-[#00E599]">kW</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium block">
                      ↓ -35.5% vs uncoordinated peak
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Transformer Capacity</span>
                    <span className="text-base font-bold font-mono text-slate-300">
                      {capacityKw.toFixed(1)} kW
                    </span>
                  </div>
                </div>

                {/* Donut Gauge Visual with Glowing Mint Arc */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90">
                    {/* Background Track */}
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="#1E293B"
                      strokeWidth="9"
                      fill="transparent"
                    />
                    {/* Dynamic Mint-Cyan Arc (68%-79% load) with glow */}
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="url(#mintCyanGrad)"
                      strokeWidth="9"
                      strokeDasharray={2 * Math.PI * 46}
                      strokeDashoffset={2 * Math.PI * 46 * (1 - loadPercentage / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="mintCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00E599" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center percentage label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black font-mono text-white leading-tight">
                      {loadPercentage}%
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Load
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Note Footer */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Sector 4 Feeder Transformer
                </span>
                <span className="font-mono text-slate-300 font-semibold">90 kW Safe Cap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURE CARDS SECTION (Interactive P0 Dual-Curve & P1 Radar)
         ───────────────────────────────────────────────────────────── */}
      <section id="features-section" className="w-full bg-[#F8FAFC] text-slate-900 py-12 lg:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* ── CARD 1: SMART GRID & TRANSFORMER OPTIMIZER (P0) ── */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                {/* Tag Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
                  <span>P0 – Core Feature</span>
                </div>

                {/* Header with Icon */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      Smart Grid &amp; Transformer Optimizer
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 leading-relaxed">
                      AI-powered scheduling to prevent transformer overloads and reduce charging costs.
                    </p>
                  </div>
                </div>

                {/* Content: Checklist (Left) + Interactive Dual-Curve Mini Graph (Right) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-6 items-center">
                  {/* Checklist (5 cols) */}
                  <ul className="sm:col-span-5 space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Optimize charging schedules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Real-time load visualization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Demand-based pricing insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Support for residential EV fleets</span>
                    </li>
                  </ul>

                  {/* Dual-Curve Interactive Chart SVG (7 cols) */}
                  <div className="sm:col-span-7 bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between relative shadow-inner">
                    {/* Inline Legend + Peak Badge + Play/Pause Scrub Controls */}
                    <div className="flex items-center justify-between text-[10px] font-semibold mb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-red-600 font-bold">
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                          <span>Baseline (Uncoordinated)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                          <span>EVkal Optimized</span>
                        </div>
                      </div>

                      {/* Play / Replay Animation Button */}
                      <button
                        onClick={() => setIsPlayingReplay(!isPlayingReplay)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs text-[10px]"
                        title={isPlayingReplay ? 'Pause simulation scrub' : 'Play 24-hour simulation replay'}
                      >
                        {isPlayingReplay ? (
                          <>
                            <Pause className="h-2.5 w-2.5 text-amber-600" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-2.5 w-2.5 text-emerald-600 fill-emerald-600" />
                            <span>Play 24h</span>
                          </>
                        )}
                      </button>

                      {/* Red Peak Badge with Pulsing Glow */}
                      <div className="px-2 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold shadow-sm animate-pulse">
                        122.8 kW (Peak)
                      </div>
                    </div>

                    {/* SVG Graphic with Dual Curves & Interactive Crosshair Scrubber */}
                    <div className="relative">
                      <svg viewBox="0 0 240 120" className="w-full h-28 overflow-visible select-none">
                        <defs>
                          {/* Green Area Fill Gradient */}
                          <linearGradient id="optArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.30" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                          </linearGradient>
                          {/* Red Area Fill Gradient */}
                          <linearGradient id="baseArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        <line x1="28" y1="20" x2="235" y2="20" stroke="#E2E8F0" strokeDasharray="2 2" />
                        <line x1="28" y1="60" x2="235" y2="60" stroke="#E2E8F0" strokeDasharray="2 2" />
                        <line x1="28" y1="95" x2="235" y2="95" stroke="#E2E8F0" />

                        {/* Y-axis labels */}
                        <text x="4" y="23" className="text-[8px] fill-slate-400 font-mono">140 kW</text>
                        <text x="4" y="63" className="text-[8px] fill-slate-400 font-mono">60 kW</text>
                        <text x="4" y="98" className="text-[8px] fill-slate-400 font-mono">20 kW</text>

                        {/* Red Danger Threshold Line (100 kW Rated Capacity) */}
                        <line x1="28" y1="42" x2="235" y2="42" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="180" y="39" className="text-[7px] fill-red-500 font-mono font-bold">100 kW Safety Limit</text>

                        {/* Red Baseline Area Fill */}
                        <polygon
                          points="35,95 35,88 100,80 155,45 175,15 190,22 210,50 230,85 230,95"
                          fill="url(#baseArea)"
                        />

                        {/* Green Optimized Fill Area */}
                        <polygon
                          points="35,95 35,88 70,82 110,75 145,55 175,54 200,68 230,80 230,95"
                          fill="url(#optArea)"
                        />

                        {/* Red Baseline Curve (Uncoordinated Spike) */}
                        <path
                          d="M 35 88 Q 70 85 100 80 Q 130 70 155 45 Q 175 15 190 22 Q 210 50 230 85"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Green Optimized Curve (Flattens below 100 kW limit) */}
                        <path
                          d="M 35 88 Q 70 82 110 75 Q 145 55 175 54 Q 200 68 230 80"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Peak indicator dot on baseline curve at 19:00 */}
                        <circle cx="178" cy="16" r="4.5" fill="#EF4444" className="animate-ping" opacity="0.6" />
                        <circle cx="178" cy="16" r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />

                        {/* Optimized curve point at 19:00 */}
                        <circle cx="178" cy="54" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />

                        {/* Interactive Vertical Scrubber Line based on selectedHour */}
                        {(() => {
                          const scrubberX = 35 + (selectedHour / 24) * 195;
                          return (
                            <g>
                              <line
                                x1={scrubberX}
                                y1="10"
                                x2={scrubberX}
                                y2="100"
                                stroke="#0F172A"
                                strokeWidth="1.5"
                                strokeDasharray="2 2"
                              />
                              <circle cx={scrubberX} cy="10" r="3" fill="#0F172A" />
                            </g>
                          );
                        })()}

                        {/* X-axis ticks (clickable to scrub) */}
                        <text onClick={() => setSelectedHour(0)} x="35" y="112" className="text-[8px] fill-slate-500 font-mono cursor-pointer hover:fill-emerald-600" textAnchor="middle">00</text>
                        <text onClick={() => setSelectedHour(4)} x="67" y="112" className="text-[8px] fill-slate-500 font-mono cursor-pointer hover:fill-emerald-600" textAnchor="middle">04</text>
                        <text onClick={() => setSelectedHour(8)} x="100" y="112" className="text-[8px] fill-slate-500 font-mono cursor-pointer hover:fill-emerald-600" textAnchor="middle">08</text>
                        <text onClick={() => setSelectedHour(12)} x="132" y="112" className="text-[8px] fill-slate-500 font-mono cursor-pointer hover:fill-emerald-600" textAnchor="middle">12</text>
                        <text onClick={() => setSelectedHour(16)} x="165" y="112" className="text-[8px] fill-slate-500 font-mono cursor-pointer hover:fill-emerald-600" textAnchor="middle">16</text>
                        <text onClick={() => setSelectedHour(19)} x="189" y="112" className="text-[8px] fill-red-600 font-mono font-bold cursor-pointer hover:fill-red-700" textAnchor="middle">19*</text>
                        <text onClick={() => setSelectedHour(20)} x="198" y="112" className="text-[8px] fill-slate-500 font-mono cursor-pointer hover:fill-emerald-600" textAnchor="middle">20</text>
                        <text onClick={() => setSelectedHour(24)} x="230" y="112" className="text-[8px] fill-slate-500 font-mono cursor-pointer hover:fill-emerald-600" textAnchor="middle">24</text>
                      </svg>

                      {/* Interactive Telemetry Overlay for Scrubbed Hour */}
                      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-slate-700">
                          Hour {selectedHour.toString().padStart(2, '0')}:00:
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-red-600 font-semibold">
                            Base: {currentPoint.baseline.toFixed(1)} kW
                          </span>
                          <span className="text-emerald-600 font-bold">
                            Opt: {currentPoint.optimised.toFixed(1)} kW
                          </span>
                          <span className="text-slate-500">
                            (Saved: {(currentPoint.baseline - currentPoint.optimised).toFixed(1)} kW)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setActiveP0SubPage('PAGE_1_DASHBOARD');
                    setActiveTab('P0_GRID');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer"
                >
                  <span>Explore Grid Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* ── CARD 2: P2P COMMUNITY CHARGER SHARING (P1) ── */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                {/* Tag Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-4">
                  <span>P1 – Community Feature</span>
                </div>

                {/* Header with Icon */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      P2P Community Charger Sharing
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 leading-relaxed">
                      Find and share nearby private chargers when you're low on battery.
                    </p>
                  </div>
                </div>

                {/* Content: Checklist (Left) + Interactive Radar Map (Right) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-6 items-center">
                  {/* Checklist (5 cols) */}
                  <ul className="sm:col-span-5 space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Discover verified nearby chargers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Check compatibility &amp; availability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Privacy-protected locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>Safe and secure access</span>
                    </li>
                  </ul>

                  {/* Interactive Proximity Radar Map (7 cols) */}
                  <div className="sm:col-span-7 bg-gradient-to-br from-blue-50/70 via-slate-50 to-emerald-50/50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden h-44 shadow-inner">
                    {/* Range Selector & Active Badge */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-1">
                        {[1, 2, 5].map((km) => (
                          <button
                            key={km}
                            onClick={() => setRadarRangeKm(km)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                              radarRangeKm === km
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white/80 text-slate-600 hover:bg-white'
                            }`}
                          >
                            {km} km
                          </button>
                        ))}
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-200 text-slate-700 font-mono text-[10px] font-bold shadow-xs">
                        {radarRangeKm} km radius
                      </div>
                    </div>

                    {/* Radar graphic with rotating sweep line */}
                    <div className="relative w-full h-full flex items-center justify-center my-1">
                      {/* Concentric Distance Rings */}
                      <div className="absolute w-36 h-36 rounded-full border border-blue-200/70"></div>
                      <div className="absolute w-28 h-28 rounded-full border border-blue-200/80"></div>
                      <div className="absolute w-16 h-16 rounded-full border border-blue-300"></div>

                      {/* Continuous 360-degree Rotating Radar Scanner Sweep */}
                      <div className="absolute w-36 h-36 rounded-full overflow-hidden pointer-events-none">
                        <div
                          className="w-full h-full animate-radar-sweep"
                          style={{
                            background:
                              'conic-gradient(from 0deg, rgba(59, 130, 246, 0.35) 0deg, rgba(59, 130, 246, 0) 65deg)',
                          }}
                        />
                      </div>

                      {/* Center Driver Location Pin */}
                      <div className="relative z-10 h-8 w-8 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white group cursor-pointer">
                        <Car className="h-4 w-4" />
                        <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold font-mono bg-blue-900 text-white px-1.5 py-0.2 rounded shadow-xs">
                          You (7%)
                        </span>
                      </div>

                      {/* Nearby Verified Host Pins */}
                      {COMMUNITY_PINS.map((pin) => {
                        const isSelected = activePin?.id === pin.id;
                        return (
                          <div
                            key={pin.id}
                            style={{ top: `${pin.yPct}%`, left: `${pin.xPct}%` }}
                            onClick={() => setActivePin(isSelected ? null : pin)}
                            onMouseEnter={() => setActivePin(pin)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                          >
                            <div
                              className={`h-6 w-6 rounded-full ${
                                isSelected ? 'bg-blue-600 scale-125' : 'bg-emerald-500 hover:scale-125'
                              } border-2 border-white shadow-md flex items-center justify-center text-white transition-all`}
                            >
                              <Zap className="h-3 w-3 fill-white" />
                            </div>

                            {/* Small distance tag */}
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold bg-white/90 text-slate-700 px-1 rounded shadow-xs border border-slate-200">
                              {pin.distanceKm}km
                            </span>
                          </div>
                        );
                      })}

                      {/* Interactive Floating Card for Active Pin */}
                      {activePin && (
                        <div className="absolute bottom-0 inset-x-2 bg-slate-900/95 backdrop-blur-md text-white rounded-xl p-2.5 shadow-2xl border border-slate-700 z-30 flex items-center justify-between text-xs animate-fadeIn">
                          <div>
                            <div className="font-bold flex items-center gap-1.5 text-white">
                              <span>{activePin.name}</span>
                              <span className="text-[10px] text-emerald-400 font-mono">({activePin.distanceKm} km)</span>
                            </div>
                            <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                              {activePin.powerKw} kW · ₹{activePin.rateInr}/kWh · {activePin.connectorType}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const chargerMock: ChargerListing = {
                                id: activePin.id,
                                hostName: activePin.hostName,
                                isHostVerified: true,
                                isDemoListing: true,
                                connectorTypes: ['TYPE_2'],
                                maxPowerKw: activePin.powerKw,
                                pricePerKwhInr: activePin.rateInr,
                                availabilityWindows: [{ dayOfWeek: 1, startHour: 8, endHour: 23 }],
                                location: {
                                  latitude: 28.5355,
                                  longitude: 77.1735,
                                  approximateLocality: 'Sector 4, Green Park (Obfuscated)',
                                  exactAddress: 'House 14, Sector 4, Green Park, New Delhi',
                                },
                                accessNotes: 'Gate passcode released upon instant reservation',
                                gatePin: '4892',
                              };
                              openBookingModal(chargerMock);
                            }}
                            className="bg-[#00E599] hover:bg-[#00c984] text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Book</span>
                            <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <button
                onClick={() => setActiveTab('P1_P2P')}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors pt-2 group cursor-pointer"
              >
                <span>Explore Community Charger Sharing Radar</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "HOW EVKAL WORKS" 4-STEP WORKFLOW SECTION (Interactive)
         ───────────────────────────────────────────────────────────── */}
      <section
        id="how-it-works-section"
        className="w-full bg-[#F1F5F9] border-t border-slate-200 py-12 lg:py-16 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Section Heading with Auto-Cycle Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                How EVkal Works
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                From smart scheduling to seamless charging access. Click any step to inspect technical details.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Step {activeStep} of 4 Active</span>
            </div>
          </div>

          {/* 4-Step Stepper Flow with Dynamic Hover & Glow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            {/* STEP 1: ANALYZE */}
            <div
              onClick={() => {
                setActiveStep(1);
                setIsStepAutoCycle(false);
              }}
              className={`bg-white border ${
                activeStep === 1
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300'
              } rounded-2xl p-5 relative group transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-7 w-7 rounded-full ${
                    activeStep === 1 ? 'bg-[#00E599] text-slate-950 font-black' : 'bg-emerald-500 text-white font-bold'
                  } text-xs flex items-center justify-center shadow-sm`}
                >
                  1
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-slate-900">Analyze</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Understand grid load and EV charging demand in real-time across feeders.
              </p>
              {activeStep === 1 && (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-mono font-medium">
                  ✓ Sub-second smart meter &amp; background load aggregation
                </div>
              )}
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* STEP 2: OPTIMIZE */}
            <div
              onClick={() => {
                setActiveStep(2);
                setIsStepAutoCycle(false);
              }}
              className={`bg-white border ${
                activeStep === 2
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300'
              } rounded-2xl p-5 relative group transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-7 w-7 rounded-full ${
                    activeStep === 2 ? 'bg-[#00E599] text-slate-950 font-black' : 'bg-emerald-500 text-white font-bold'
                  } text-xs flex items-center justify-center shadow-sm`}
                >
                  2
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-slate-900">Optimize</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Get smart charging schedules and dynamic pricing to flatten peak curves.
              </p>
              {activeStep === 2 && (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-mono font-medium">
                  ✓ Priority scheduling S(t) prioritizing off-peak valley hours
                </div>
              )}
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* STEP 3: CONNECT */}
            <div
              onClick={() => {
                setActiveStep(3);
                setIsStepAutoCycle(false);
              }}
              className={`bg-white border ${
                activeStep === 3
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300'
              } rounded-2xl p-5 relative group transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-7 w-7 rounded-full ${
                    activeStep === 3 ? 'bg-[#00E599] text-slate-950 font-black' : 'bg-emerald-500 text-white font-bold'
                  } text-xs flex items-center justify-center shadow-sm`}
                >
                  3
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-slate-900">Connect</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Find or share nearby community chargers when drivers need top-ups.
              </p>
              {activeStep === 3 && (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-mono font-medium">
                  ✓ Zero-knowledge location obfuscation (±350m privacy halo)
                </div>
              )}
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* STEP 4: DRIVE GREENER */}
            <div
              onClick={() => {
                setActiveStep(4);
                setIsStepAutoCycle(false);
              }}
              className={`bg-white border ${
                activeStep === 4
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300'
              } rounded-2xl p-5 relative group transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-7 w-7 rounded-full ${
                    activeStep === 4 ? 'bg-[#00E599] text-slate-950 font-black' : 'bg-emerald-500 text-white font-bold'
                  } text-xs flex items-center justify-center shadow-sm`}
                >
                  4
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Leaf className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-slate-900">Drive Greener</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Reduce grid stress and support cleaner, resilient electric mobility.
              </p>
              {activeStep === 4 && (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-mono font-medium">
                  ✓ Zero transformer burnouts and 67% lower charging costs
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. IMPACT & VALUE METRICS ROW (Exact 4 Cards from Mockup)
         ───────────────────────────────────────────────────────────── */}
      <section id="impact-section" className="w-full bg-white border-t border-slate-200 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Metric 1: Peak Load Reduction */}
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                <ArrowDown className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                  35.5%
                </div>
                <div className="text-xs font-bold text-slate-700">
                  Peak Load Reduction
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  122.8 kW → 79.2 kW (Illustrative)
                </div>
              </div>
            </div>

            {/* Metric 2: Overload Avoided */}
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                  100%
                </div>
                <div className="text-xs font-bold text-slate-700">
                  Overload Avoided
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  41.9 kWh stress removed (Illustrative)
                </div>
              </div>
            </div>

            {/* Metric 3: Fleet Cost Savings */}
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <IndianRupee className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                  ₹1,752
                </div>
                <div className="text-xs font-bold text-slate-700">
                  Fleet Cost Savings
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  -67% lower cost (Illustrative)
                </div>
              </div>
            </div>

            {/* Metric 4: Cleaner Communities */}
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Leaf className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 tracking-tight">
                  Cleaner Communities
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Support sustainable EV adoption
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. ABOUT & FOOTER (Hackathon Problem Statement #053)
         ───────────────────────────────────────────────────────────── */}
      <footer id="about-section" className="w-full bg-[#070B14] border-t border-white/10 text-slate-400 py-12 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/evkal_logo.png"
              alt="EVkal Brand Logo"
              className="h-10 w-10 rounded-xl object-cover border border-emerald-400/40 shadow-sm"
            />
            <div>
              <span className="text-base font-black text-white">EVkal</span>
              <p className="text-[11px] text-slate-400">
                Smart EV Charging &amp; P2P Sharing Decision-Support System · Hackathon Problem #053
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button onClick={() => setActiveTab('P0_GRID')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              P0 Grid Dashboard
            </button>
            <button onClick={() => setActiveTab('P1_P2P')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              P1 Community Sharing
            </button>
            <button onClick={() => scrollToSection('features-section')} className="hover:text-white transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection('hero-section')} className="hover:text-white transition-colors cursor-pointer">
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
