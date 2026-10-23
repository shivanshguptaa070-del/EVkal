import { useState } from 'react';
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
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function LandingHeroPage() {
  const { setActiveTab, solverOutput, transformerConfig } = useSimulationStore();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Smooth scroll helper for landing sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Peak demand & capacity computation for the hero widget
  const peakKw = solverOutput?.summary?.optimisedPeakKw ? Math.round(solverOutput.summary.optimisedPeakKw * 10) / 10 : 68.4;
  const capacityKw = transformerConfig?.ratedCapacityKw ?? 100.0;
  const loadPercentage = Math.min(100, Math.round((peakKw / capacityKw) * 100));

  return (
    <div className="w-full flex flex-col bg-[#0B0F17] text-slate-100 overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (Exact match to Mockup Header)
         ───────────────────────────────────────────────────────────── */}
      <nav className="w-full border-b border-white/10 bg-[#0B0F17]/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo with Green Lightning Bolt & Leaf Motif */}
          <div
            onClick={() => scrollToSection('hero-section')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-emerald-400" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tight text-white">EV</span>
              <span className="text-2xl font-black tracking-tight text-[#00E599]">kal</span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#00E599] animate-pulse"></span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('hero-section')}
              className="text-[#00E599] font-bold border-b-2 border-[#00E599] pb-0.5 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features-section')}
              className="hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works-section')}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact-section')}
              className="hover:text-white transition-colors"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="hover:text-white transition-colors"
            >
              About
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Direct Switch to Simulation Modules */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('P0_GRID')}
                className="px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                title="Open Smart Grid & Transformer Optimizer"
              >
                <Zap className="h-3 w-3 text-emerald-400" />
                <span>P0 Grid</span>
              </button>
              <button
                onClick={() => setActiveTab('P1_P2P')}
                className="px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                title="Open P2P Community Charger Sharing"
              >
                <MapPin className="h-3 w-3 text-blue-400" />
                <span>P1 P2P</span>
              </button>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="h-9 w-9 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Toggle Appearance"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* "Get Started →" CTA Pill Button */}
            <button
              onClick={() => setActiveTab('P0_GRID')}
              className="bg-[#00E599] hover:bg-[#00c984] text-slate-950 font-bold px-5 py-2 rounded-full shadow-lg shadow-[#00E599]/20 hover:shadow-[#00E599]/35 hover:-translate-y-0.5 transition-all text-xs sm:text-sm flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO MAIN SECTION (Dusk Background + Live Status Widget)
         ───────────────────────────────────────────────────────────── */}
      <section
        id="hero-section"
        className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] w-full flex items-center justify-center overflow-hidden"
      >
        {/* Background Image: White EV crossover plugged in at dusk with city skyline & transmission towers */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 hover:scale-[1.01]"
          style={{
            backgroundImage: `url('/assets/images/hero_ev_dusk_background.jpg')`,
          }}
        />

        {/* Ambient Dark Gradient Overlays for High-Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/95 via-[#070B14]/80 to-[#070B14]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#070B14]/70 to-transparent pointer-events-none" />

        {/* Hero Content Grid Container */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Top Badge Capsule */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-slate-200 text-xs sm:text-sm font-medium shadow-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
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
              Power a <span className="text-[#00E599] drop-shadow-[0_0_25px_rgba(0,229,153,0.4)]">Greener Tomorrow.</span>
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              EVkal is a smart EV charging and community sharing platform that optimizes charging schedules to
              prevent transformer overloads and helps drivers find nearby private chargers when they need them.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('P0_GRID')}
                className="bg-[#00E599] hover:bg-[#00c984] text-slate-950 font-black px-7 py-3.5 rounded-full shadow-lg shadow-[#00E599]/25 hover:shadow-[#00E599]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-sm sm:text-base group"
              >
                <Zap className="h-4 w-4 fill-slate-950 text-slate-950" />
                <span>Optimize Charging Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </button>

              <button
                onClick={() => setActiveTab('P1_P2P')}
                className="bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-700/80 hover:border-emerald-400/60 font-semibold px-6 py-3.5 rounded-full shadow-md backdrop-blur-md transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <MapPin className="h-4 w-4 text-[#00E599]" />
                <span>Find Nearby Chargers</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Grid Status Floating Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-[#0B132B]/80 hover:bg-[#0B132B]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl shadow-black/60 transition-all duration-300 hover:border-[#00E599]/40">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-bold text-slate-200 tracking-wide">
                  Live Grid Status
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Stable</span>
                </div>
              </div>

              {/* Card Body: Metrics + Donut Gauge */}
              <div className="flex items-center justify-between gap-4 pt-5">
                {/* Demand & Capacity Text */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Current Demand</span>
                    <span className="text-2xl font-black font-mono text-white tracking-tight">
                      {peakKw.toFixed(1)} kW
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
                    {/* Dynamic Mint-Cyan Arc (68% load) */}
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
                      className="transition-all duration-1000 ease-out"
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
              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                  Telemetry: Sector 4 Feeder
                </span>
                <span className="font-mono text-slate-400">90 kW Safe Cap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURE CARDS SECTION (P0 Core + P1 Community)
         ───────────────────────────────────────────────────────────── */}
      <section id="features-section" className="w-full bg-[#F8FAFC] text-slate-900 py-12 lg:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* ── CARD 1: SMART GRID & TRANSFORMER OPTIMIZER (P0) ── */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                {/* Tag Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
                  <span>P0 – Core Feature</span>
                </div>

                {/* Header with Icon */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
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
                  {/* Checklist (6 cols) */}
                  <ul className="sm:col-span-6 space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
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

                  {/* Dual-Curve Mini Chart SVG (6 cols) */}
                  <div className="sm:col-span-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden">
                    {/* Inline Legend + Peak Badge */}
                    <div className="flex items-center justify-between text-[10px] font-semibold mb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-red-600">
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                          <span>Baseline (Uncoordinated)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                          <span>EVkal Optimized</span>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold shadow-sm">
                        122.8 kW (Peak)
                      </div>
                    </div>

                    {/* SVG Graphic with Dual Curves */}
                    <svg viewBox="0 0 240 120" className="w-full h-24 overflow-visible">
                      <defs>
                        {/* Green Area Fill Gradient */}
                        <linearGradient id="optArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="28" y1="20" x2="235" y2="20" stroke="#E2E8F0" strokeDasharray="2 2" />
                      <line x1="28" y1="60" x2="235" y2="60" stroke="#E2E8F0" strokeDasharray="2 2" />
                      <line x1="28" y1="95" x2="235" y2="95" stroke="#E2E8F0" />

                      {/* Y-axis labels */}
                      <text x="5" y="23" className="text-[8px] fill-slate-400 font-mono">140 kW</text>
                      <text x="5" y="63" className="text-[8px] fill-slate-400 font-mono">60 kW</text>
                      <text x="5" y="98" className="text-[8px] fill-slate-400 font-mono">20 kW</text>

                      {/* Red Danger Threshold Line (100 kW) */}
                      <line x1="28" y1="42" x2="235" y2="42" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" />

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

                      {/* X-axis ticks */}
                      <text x="35" y="112" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">00</text>
                      <text x="70" y="112" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">04</text>
                      <text x="105" y="112" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">08</text>
                      <text x="140" y="112" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">12</text>
                      <text x="175" y="112" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">16</text>
                      <text x="205" y="112" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">20</text>
                      <text x="230" y="112" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">24</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <button
                onClick={() => setActiveTab('P0_GRID')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors pt-2 group"
              >
                <span>Explore Grid Optimizer</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </button>
            </div>

            {/* ── CARD 2: P2P COMMUNITY CHARGER SHARING (P1) ── */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                {/* Tag Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-4">
                  <span>P1 – Community Feature</span>
                </div>

                {/* Header with Icon */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
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

                {/* Content: Checklist (Left) + Interactive Proximity Radar Map (Right) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-6 items-center">
                  {/* Checklist (6 cols) */}
                  <ul className="sm:col-span-6 space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
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

                  {/* Proximity Radar Map Graphic (6 cols) */}
                  <div className="sm:col-span-6 bg-gradient-to-br from-blue-50/60 via-slate-50 to-emerald-50/40 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden h-36">
                    {/* Range Badge */}
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 font-mono text-[10px] font-bold shadow-sm z-10">
                      2 km range
                    </div>

                    {/* Concentric Radar Rings Graphic */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Radar Rings */}
                      <div className="absolute w-28 h-28 rounded-full border border-blue-200/60 animate-ping opacity-25"></div>
                      <div className="absolute w-28 h-28 rounded-full border border-blue-200/70"></div>
                      <div className="absolute w-20 h-20 rounded-full border border-blue-200/80"></div>
                      <div className="absolute w-12 h-12 rounded-full border border-blue-300"></div>

                      {/* Center Driver Location Pin */}
                      <div className="relative z-10 h-7 w-7 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>

                      {/* Surrounding Nearby Community Chargers with Tooltip Trigger */}
                      {/* Top Left Charger: Rajesh Garage */}
                      <div
                        onMouseEnter={() => setHoveredPin('Rajesh Garage · 7.4 kW · ₹12/kWh')}
                        onMouseLeave={() => setHoveredPin(null)}
                        className="absolute top-2 left-6 h-6 w-6 rounded-full bg-emerald-500 hover:scale-125 border-2 border-white shadow-sm flex items-center justify-center text-white cursor-pointer transition-transform"
                      >
                        <Zap className="h-3 w-3 fill-white" />
                      </div>

                      {/* Top Right Charger: Priya Driveway */}
                      <div
                        onMouseEnter={() => setHoveredPin('Priya Driveway · 11 kW · ₹14/kWh')}
                        onMouseLeave={() => setHoveredPin(null)}
                        className="absolute top-4 right-10 h-6 w-6 rounded-full bg-emerald-500 hover:scale-125 border-2 border-white shadow-sm flex items-center justify-center text-white cursor-pointer transition-transform"
                      >
                        <Zap className="h-3 w-3 fill-white" />
                      </div>

                      {/* Bottom Left Charger: Amit Basement */}
                      <div
                        onMouseEnter={() => setHoveredPin('Amit Basement · 3.3 kW · ₹9/kWh')}
                        onMouseLeave={() => setHoveredPin(null)}
                        className="absolute bottom-3 left-10 h-6 w-6 rounded-full bg-emerald-500 hover:scale-125 border-2 border-white shadow-sm flex items-center justify-center text-white cursor-pointer transition-transform"
                      >
                        <Zap className="h-3 w-3 fill-white" />
                      </div>

                      {/* Bottom Right Charger: Green Villa */}
                      <div
                        onMouseEnter={() => setHoveredPin('Green Villa · 7.4 kW · ₹11/kWh')}
                        onMouseLeave={() => setHoveredPin(null)}
                        className="absolute bottom-2 right-8 h-6 w-6 rounded-full bg-emerald-500 hover:scale-125 border-2 border-white shadow-sm flex items-center justify-center text-white cursor-pointer transition-transform"
                      >
                        <Zap className="h-3 w-3 fill-white" />
                      </div>

                      {/* Hover Tooltip Overlay */}
                      {hoveredPin && (
                        <div className="absolute bottom-1 inset-x-2 bg-slate-900/95 text-white text-[10px] font-mono px-2 py-1 rounded-md text-center shadow-lg border border-slate-700 z-20">
                          {hoveredPin}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <button
                onClick={() => setActiveTab('P1_P2P')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors pt-2 group"
              >
                <span>Explore Charger Sharing</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "HOW EVKAL WORKS" 4-STEP WORKFLOW SECTION
         ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works-section" className="w-full bg-[#F1F5F9] border-t border-slate-200 py-12 lg:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Section Heading */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How EVkal Works
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              From smart scheduling to seamless charging access.
            </p>
          </div>

          {/* 4-Step Stepper Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            {/* STEP 1: ANALYZE */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  1
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-slate-900">Analyze</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Understand grid load and EV charging demand in real-time.
              </p>
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* STEP 2: OPTIMIZE */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  2
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-slate-900">Optimize</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Get smart charging schedules and dynamic pricing to flatten peaks.
              </p>
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* STEP 3: CONNECT */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
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
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* STEP 4: DRIVE GREENER */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
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
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. IMPACT & VALUE METRICS ROW (Exact 4 Cards from Mockup)
         ───────────────────────────────────────────────────────────── */}
      <section id="impact-section" className="w-full bg-white border-t border-slate-200 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Metric 1: Peak Load Reduction */}
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
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
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
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
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
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
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
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
          6. ABOUT & HACKATHON MISSION FOOTER
         ───────────────────────────────────────────────────────────── */}
      <footer id="about-section" className="w-full bg-[#070B14] border-t border-white/10 text-slate-400 py-10 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Zap className="h-4 w-4 fill-emerald-400" />
            </div>
            <div>
              <span className="text-base font-black text-white">EVkal</span>
              <p className="text-[11px] text-slate-400">
                Smart EV Charging &amp; P2P Sharing Decision-Support System · Hackathon Problem #053
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button onClick={() => setActiveTab('P0_GRID')} className="hover:text-emerald-400 transition-colors">
              P0 Grid Optimizer
            </button>
            <button onClick={() => setActiveTab('P1_P2P')} className="hover:text-emerald-400 transition-colors">
              P1 Community Sharing
            </button>
            <button onClick={() => scrollToSection('features-section')} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('hero-section')} className="hover:text-white transition-colors">
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
