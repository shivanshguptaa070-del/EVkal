import { useState, useEffect } from 'react';
import {
  Home,
  BarChart2,
  Users,
  MapPin,
  ChevronDown,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function Header() {
  const {
    activeTab,
    setActiveTab,
    isLive,
    regionalStress,
    toggleNetworkFallback,
    openProfileView,
    setP2PSubView,
    isHostAuthenticated,
  } = useSimulationStore();
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
        {/* Left: Brand Logo & Telemetry Status Badges */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('LANDING')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
            title="Go to Landing Overview"
          >
            <img
              src="/assets/images/evkal_logo.png"
              alt="EVkal"
              className="h-9 w-9 rounded-xl object-cover border border-emerald-500/40 shadow-sm shadow-emerald-500/25 group-hover:scale-105 transition-all"
            />
            <div className="flex items-baseline">
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
          {!isLightMode ? (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <button
                type="button"
                onClick={toggleNetworkFallback}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono transition-colors shadow-sm cursor-pointer ${
                  isLive
                    ? 'bg-[#062419]/90 border-emerald-800/60 text-emerald-300 hover:bg-[#083324]'
                    : 'bg-amber-950/70 border-amber-800/80 text-amber-300 hover:bg-amber-950/90'
                }`}
                title="Click to toggle between LIVE API and SYNTHETIC FALLBACK"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      isLive ? 'bg-emerald-400' : 'bg-amber-400'
                    } opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isLive ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  ></span>
                </span>
                <span>
                  {isLive ? 'LIVE (NR)' : 'DEMO BASELINE'}
                </span>
              </button>

              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e1e38] border border-blue-900/60 text-blue-400 text-xs font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{regionalStress}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{currentTime}</span>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>{currentTime}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Navigation Tabs */}
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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

          {/* 2. Grid Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab('P0_GRID')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
            <span>Grid Dashboard</span>
          </button>

          {/* 3. P2P Charger Sharing */}
          <button
            type="button"
            onClick={() => setActiveTab('P1_P2P')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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

        {/* Right: Location & Profile Shortcut */}
        <div className="flex items-center gap-3">
          {/* Location Selector */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer shadow-sm transition-all ${
              isLightMode
                ? 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span>New Delhi, India</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* User Profile Avatar Pill: [ST] Shivharsh T. or [EV] Guest Driver */}
          <div
            onClick={() => {
              if (isHostAuthenticated) {
                openProfileView();
              } else {
                setActiveTab('P1_P2P');
                setP2PSubView('HOST_EARNINGS');
              }
            }}
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer shadow-sm transition-all ${
              isHostAuthenticated
                ? isLightMode
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100'
                  : 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-950/60'
                : isLightMode
                ? 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
            title={
              isHostAuthenticated
                ? 'Logged in as Host: Shivharsh Tiwari (shivharshtiwari86017@gmail.com). Click to view profile.'
                : 'Public Guest session. Click to access Host Dashboard.'
            }
          >
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                isHostAuthenticated
                  ? 'bg-[#059669] text-white shadow-2xs'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isHostAuthenticated ? 'ST' : 'EV'}
            </div>
            <span>{isHostAuthenticated ? 'Shivharsh T. (Host)' : 'Guest Driver'}</span>
            {!isHostAuthenticated ? (
              <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-200">
                Host Login
              </span>
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-emerald-600" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
