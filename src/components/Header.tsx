import { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck, MapPin, Home } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function Header() {
  const { activeTab, setActiveTab, isLive, regionalStress, toggleNetworkFallback } = useSimulationStore();
  const [currentTime, setCurrentTime] = useState<string>('19:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Telemetry Status Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Logo with Green Leaf Icon */}
          <button
            type="button"
            onClick={() => setActiveTab('LANDING')}
            className="flex items-center gap-2.5 mr-2 text-left cursor-pointer group"
            title="Go to Landing Overview"
          >
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-emerald-400" />
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tight text-white">EV</span>
              <span className="text-2xl font-black tracking-tight text-emerald-400">kal</span>
            </div>
          </button>

          {/* Provenance Status Pill (Clickable for Offline / Live Simulation in Demo) */}
          <button
            type="button"
            onClick={toggleNetworkFallback}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors shadow-sm cursor-pointer ${
              isLive
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/60'
                : 'bg-amber-950/50 border-amber-800/80 text-amber-300 hover:bg-amber-950/70'
            }`}
            title="Click to toggle between LIVE API and SYNTHETIC FALLBACK (Offline Resilience Test)"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span>
              {isLive ? 'LIVE API: Grid-India (NR)' : 'DEMO BASELINE: Synthetic Indian Diurnal Curve'}
            </span>
          </button>

          {/* Regional Grid Stress Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-900/50 text-blue-400 text-xs font-mono font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{regionalStress}</span>
          </div>

          {/* Live IST Clock */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentTime} IST</span>
          </div>
        </div>

        {/* Mode Navigation Pill Bar */}
        <div className="inline-flex p-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('LANDING')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'LANDING'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('P0_GRID')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'P0_GRID'
                ? 'bg-slate-100 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${activeTab === 'P0_GRID' ? 'text-slate-950 fill-slate-950' : ''}`} />
            <span>Grid Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('P1_P2P')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'P1_P2P'
                ? 'bg-[#DDF4E8] text-[#064E3B] font-bold shadow-sm'
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
