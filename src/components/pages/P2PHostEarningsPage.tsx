import { useState } from 'react';
import {
  Zap,
  Coins,
  CheckCircle2,
  Star,
  Plus,
  Power,
  Sliders,
  Users,
  Award,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';

export function P2PHostEarningsPage() {
  const { setActiveP1SubPage } = useSimulationStore();

  const [isWallboxOnline, setIsWallboxOnline] = useState(true);
  const [hostRate, setHostRate] = useState(12.5);

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'REQ-101',
      driverName: 'Rohit Malhotra',
      vehicle: 'Tata Nexon EV Max',
      requestedTime: 'Today, 20:00 &ndash; 22:00',
      energyEstimate: '18.0 kWh',
      payoutInr: '₹225.00',
      batteryStatus: '11% SoC (Urgent)',
    },
  ]);

  const handleAcceptRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    alert('Booking accepted! Unlocked passcode #7429 transmitted to driver.');
  };

  const handleDeclineRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* 1. Host Revenue Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
            <Award className="h-3.5 w-3.5 text-emerald-600" />
            <span>Community Host Dashboard &bull; Saket Block J</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Host Hub &amp; Earnings Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your registered driveway socket, customize public rates, and monitor monthly passive income.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveP1SubPage('P2P_LIST_CHARGER')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ List Another Charger</span>
        </button>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income Card */}
        <div className="bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] border border-emerald-200/80 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Monthly Earnings</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-200/60 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
            ₹4,662
          </div>
          <p className="text-[11px] text-emerald-600/90 font-medium">
            +18.4% vs last calendar month
          </p>
        </div>

        {/* Total Lifetime Payout */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">All-Time Payout</span>
            <Coins className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ₹32,450
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Direct transfer to HDFC A/C ending 9012
          </p>
        </div>

        {/* Energy Shared */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Energy Shared</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            2,704 kWh
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Over 148 successful neighborhood sessions
          </p>
        </div>

        {/* Host Rating */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Host Rating</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>4.9</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Verified by 24 local EV drivers
          </p>
        </div>
      </div>

      {/* 3. Wallbox Controller & Pricing Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: My Listed Wallbox */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Driveway Wallbox #1</h3>
                <p className="text-xs text-slate-500">Saket Block J &bull; 7.4 kW Level 2 AC &bull; Type 2 Mennekes</p>
              </div>
            </div>

            {/* Online / Offline Toggle */}
            <button
              type="button"
              onClick={() => setIsWallboxOnline(!isWallboxOnline)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isWallboxOnline
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-300'
              }`}
            >
              <Power className={`h-3.5 w-3.5 ${isWallboxOnline ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isWallboxOnline ? 'Accepting Guests (Online)' : 'Paused (Offline)'}</span>
            </button>
          </div>

          {/* Pricing Adjuster */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Sliders className="h-3.5 w-3.5 text-emerald-600" />
                <span>Host Tariff Rate (per kWh)</span>
              </div>
              <span className="text-sm font-black text-emerald-700">₹{hostRate.toFixed(2)} / kWh</span>
            </div>
            <input
              type="range"
              min="9.0"
              max="18.0"
              step="0.5"
              value={hostRate}
              onChange={(e) => setHostRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>₹9.00 (Economy)</span>
              <span>₹12.50 (Recommended)</span>
              <span>₹18.00 (Peak Express)</span>
            </div>
          </div>

          {/* Wallbox Specs Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Connector</span>
              <span className="font-bold text-slate-800">Type 2 (IEC 62196)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Draw</span>
              <span className="font-bold text-slate-800">32A Single Phase</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Hours</span>
              <span className="font-bold text-slate-800">10:00 &ndash; 18:00 Today</span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Incoming Requests Queue */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              <span>Incoming Requests ({pendingRequests.length})</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              Real-Time
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">No Pending Requests</p>
              <p>You're all caught up! New requests will ring here live.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{req.driverName}</div>
                      <div className="text-xs text-slate-500">{req.vehicle}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                      {req.batteryStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 space-y-1">
                    <div className="flex justify-between">
                      <span>Schedule:</span>
                      <strong className="text-slate-800" dangerouslySetInnerHTML={{ __html: req.requestedTime }} />
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Payout:</span>
                      <strong className="text-emerald-700 font-bold">{req.payoutInr} ({req.energyEstimate})</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Accept &amp; Send Passcode
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineRequest(req.id)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
