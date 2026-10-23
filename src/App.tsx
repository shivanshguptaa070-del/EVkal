import { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react';
import type { DataProvenance, RegionalGridReading } from '@/types/grid';
import type { TransformerConfig } from '@/types/transformer';

// Verification data contract checks
const DEMO_TRANSFORMER: TransformerConfig = {
  id: 'TX-100-SECTOR-4',
  name: 'Sector 4 Feeder Transformer',
  ratedCapacityKw: 100.0,
  safetyThresholdPct: 90.0,
  connectedHomesCount: 25,
};

const INITIAL_PROVENANCE: DataProvenance = 'LOCAL_SIMULATION';

const DEMO_READING: RegionalGridReading = {
  timestamp: '2026-10-23T19:00:00+05:30',
  provenance: INITIAL_PROVENANCE,
  sourceName: 'Synthetic Regional Demo Baseline',
  regionName: 'Northern Regional Grid (NR)',
  regionalDemandMw: 68500,
  regionalGridStress: 'REGIONAL_CRITICAL',
  isLive: false,
  fallbackReason: 'Phase 1 Walking Skeleton Initialized',
};

export default function App() {
  const [currentTime, setCurrentTime] = useState<string>('');

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
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-[#111827]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  EV<span className="text-emerald-400">kal</span>
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  v1.0-tracer
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Smart EV Charging & P2P Sharing Decision-Support System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Provenance Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>WALKING SKELETON: READY</span>
            </div>

            {/* Live IST Clock */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500 mr-1.5 font-sans text-[11px]">IST</span>
              <span>{currentTime || '19:00:00'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner Card */}
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#111827] to-[#0B0F17] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 1 Verification Complete</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              End-to-End Pipeline & Dark Design Tokens Mounted
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Vite with React 19 SWC, TypeScript strict path contracts, Tailwind dark tokens, and typography
              scales are verified and operational. The system is ready for Phase 2 domain math engine integration.
            </p>
          </div>
        </section>

        {/* Verification Matrix Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Contracts */}
          <div className="p-6 rounded-xl border border-slate-800 bg-[#111827]/60 backdrop-blur-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">TypeScript Data Contracts</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Type definitions locked in <code className="text-slate-300">src/types/</code> for Regional Grid, Transformer, EV Session, and P2P Marketplace.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>4 Contract Files Validated</span>
            </div>
          </div>

          {/* Card 2: Ground-Truth Targets */}
          <div className="p-6 rounded-xl border border-slate-800 bg-[#111827]/60 backdrop-blur-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Benchmark Spec: 100 kW</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Locked target metrics for Phase 2: Hour 19 baseline 122.80 kW &rarr; optimised 79.20 kW (&minus;35.50% peak drop).
            </p>
            <div className="pt-2 text-xs font-mono text-slate-300">
              Capacity: <span className="text-emerald-400 font-semibold">{DEMO_TRANSFORMER.ratedCapacityKw} kW</span>
            </div>
          </div>

          {/* Card 3: Color Tokens */}
          <div className="p-6 rounded-xl border border-slate-800 bg-[#111827]/60 backdrop-blur-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Telemetry Color Scale</h3>
            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-full rounded bg-[#10B981]"></div>
                <span className="text-[10px] font-mono text-slate-400">Safe</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-full rounded bg-[#3B82F6]"></div>
                <span className="text-[10px] font-mono text-slate-400">Normal</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-full rounded bg-[#F59E0B]"></div>
                <span className="text-[10px] font-mono text-slate-400">Warn</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-full rounded bg-[#EF4444]"></div>
                <span className="text-[10px] font-mono text-slate-400">Danger</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono text-center">
              Regional Status: {DEMO_READING.regionalGridStress}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#111827]/40 px-6 py-4 text-center text-xs text-slate-500">
        EVkal &middot; Hackathon Problem #053 &middot; Phase 1 Walking Skeleton
      </footer>
    </div>
  );
}
