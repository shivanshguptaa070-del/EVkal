import { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck, MapPin, ChevronDown } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function Header() {
  const { activeTab, setActiveTab, isLive, regionalStress, toggleNetworkFallback } = useSimulationStore();
  const [currentTime, setCurrentTime] = useState<string>('19:00 IST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentTime(`${timeStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Telemetry Status Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Logo with Green Leaf Sprout matching reference mockup */}
          {/* Official EVkal Brand Logo */}
          <button
            type="button"
            onClick={() => setActiveTab('LANDING')}
            className="flex items-center gap-2.5 mr-3 text-left cursor-pointer group"
            title="Go to Landing Overview"
          >
            <img
              src="/assets/images/evkal_logo.png"
              alt="EVkal"
              className="h-9 w-9 rounded-xl object-cover border border-emerald-500/40 shadow-sm shadow-emerald-500/25 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(0,229,153,0.4)] transition-all"
            />
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tight text-white">EV</span>
              <span className="text-2xl font-black tracking-tight text-emerald-400">kal</span>
            </div>
          </button>

          {/* Provenance Status Pill with Dropdown indicator */}
          <button
            type="button"
            onClick={toggleNetworkFallback}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-colors shadow-sm cursor-pointer ${
              isLive
                ? 'bg-[#062419]/90 border-emerald-800/60 text-emerald-300 hover:bg-[#083324]'
                : 'bg-amber-950/70 border-amber-800/80 text-amber-300 hover:bg-amber-950/90'
            }`}
            title="Click to toggle between LIVE API and SYNTHETIC FALLBACK"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span>
              {isLive ? 'LIVE API: Grid-India (NR)' : 'DEMO BASELINE: Synthetic Indian Diurnal Curve'}
            </span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </button>

          {/* Regional Grid Stress Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0e1e38] border border-blue-900/60 text-blue-400 text-xs font-mono font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{regionalStress}</span>
          </div>

          {/* Live IST Clock */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Mode Navigation Pill Bar matching mockup */}
        <div className="inline-flex p-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('P0_GRID')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'P0_GRID'
                ? 'bg-[#DDF4E8] text-[#064E3B] shadow-md'
                : 'text-slate-400 hover:text-slate-200 font-semibold'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${activeTab === 'P0_GRID' ? 'text-[#064E3B] fill-[#064E3B]' : ''}`} />
            <span>Grid &amp; Transformer Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('P1_P2P')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'P1_P2P'
                ? 'bg-[#DDF4E8] text-[#064E3B] font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className={`h-3.5 w-3.5 ${activeTab === 'P1_P2P' ? 'text-[#064E3B]' : ''}`} />
            <span>P2P Charger Sharing</span>
          </button>
        </div>
      </div>
    </header>
  );
}
