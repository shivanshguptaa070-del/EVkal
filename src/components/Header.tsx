import { useState, useEffect } from 'react';
import {
  Zap,
  Home,
  BarChart2,
  Users,
  MapPin,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function Header() {
  const { activeTab, setActiveTab, isLive, toggleNetworkFallback } = useSimulationStore();
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

  const isLightMode = activeTab === 'P1_P2P';

  return (
    <header
      className={`border-b sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors ${
        isLightMode
          ? 'bg-white border-slate-100 shadow-sm'
          : 'bg-[#0B0F17]/95 border-slate-800 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('LANDING')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
            title="Go to Landing Overview"
          >
            <div className="h-9 w-9 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-sm shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-white text-white" />
            </div>
            <div className="flex items-center">
              <span
                className={`text-2xl font-black tracking-tight ${
                  isLightMode ? 'text-slate-900' : 'text-white'
                }`}
              >
                EV
              </span>
              <span className="text-2xl font-black tracking-tight text-[#059669]">
                kal
              </span>
            </div>
          </button>

          {/* Telemetry pill (visible on dark mode / P0) */}
          {!isLightMode && (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <button
                type="button"
                onClick={toggleNetworkFallback}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors shadow-sm cursor-pointer ${
                  isLive
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/60'
                    : 'bg-amber-950/50 border-amber-800/80 text-amber-300 hover:bg-amber-950/70'
                }`}
                title="Click to toggle between LIVE API and SYNTHETIC FALLBACK"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{isLive ? 'LIVE (NR)' : 'SYNTHETIC'}</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{currentTime} IST</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Navigation Tabs (Matches Mockup Exactly) */}
        <div
          className={`inline-flex p-1 rounded-2xl border transition-all ${
            isLightMode
              ? 'bg-transparent border-transparent gap-1'
              : 'bg-slate-900/90 border-slate-800 shadow-inner'
          }`}
        >
          {/* 1. Overview */}
          <button
            type="button"
            onClick={() => setActiveTab('LANDING')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'LANDING'
                ? 'bg-[#D1FAE5] text-[#065F46] font-bold shadow-sm'
                : isLightMode
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Overview</span>
          </button>

          {/* 2. Grid Optimizer */}
          <button
            type="button"
            onClick={() => setActiveTab('P0_GRID')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'P0_GRID'
                ? isLightMode
                  ? 'bg-[#D1FAE5] text-[#065F46] font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-950 shadow-md font-bold'
                : isLightMode
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Grid Optimizer</span>
          </button>

          {/* 3. P2P Charger Sharing (Active Green State Matching Screenshot) */}
          <button
            type="button"
            onClick={() => setActiveTab('P1_P2P')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'P1_P2P'
                ? 'bg-[#D1FAE5] text-[#065F46] font-bold shadow-sm'
                : isLightMode
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>P2P Charger Sharing</span>
          </button>
        </div>

        {/* Right: Location & Profile Matching Mockup */}
        <div className="flex items-center gap-3">
          {/* Location Selector */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer shadow-sm transition-all ${
              isLightMode
                ? 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-slate-600" />
            <span>New Delhi, India</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* User Profile Avatar Pill: [ST] Shivharsh T. ⌄ */}
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer shadow-sm transition-all ${
              isLightMode
                ? 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="h-6 w-6 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center text-[10px] font-black">
              ST
            </div>
            <span>Shivharsh T.</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
