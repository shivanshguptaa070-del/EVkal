import { useState } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  Zap,
  MapPin,
  Clock,
  Navigation,
  ShieldCheck,
  Sliders,
  PhoneCall,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { ConnectorType } from '../../types/p2p';
import { haversineDistanceKm } from '../../domain/p2pMarketplaceEngine';

export function P2PEmergencyAssistPage() {
  const {
    p2pQuery,
    setP2PQuery,
    chargerListings,
    openBookingModal,
  } = useSimulationStore();

  const [emergencyRadius, setEmergencyRadius] = useState(p2pQuery.radiusKm || 5);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType | 'ALL'>('ALL');

  const currentBattery = p2pQuery.vehicleBatteryPct ?? 7;
  const estimatedRangeKm = p2pQuery.estimatedRangeKm ?? 10.5;

  // Driver reference coordinates (South Delhi / Vasant Kunj)
  const driverLat = p2pQuery.driverLat ?? 28.5355;
  const driverLon = p2pQuery.driverLon ?? 77.1557;

  // Filter listings by emergency radius and connector, sorted by distance
  const reachableChargers = chargerListings
    .map((charger) => {
      const dist = haversineDistanceKm(driverLat, driverLon, charger.location.latitude, charger.location.longitude);
      return { ...charger, distanceKm: dist };
    })
    .filter((charger) => {
      if (charger.distanceKm > emergencyRadius) return false;
      if (selectedConnector !== 'ALL' && !charger.connectorTypes.includes(selectedConnector)) return false;
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* 1. SOS Emergency Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 text-white shadow-xl shadow-rose-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-rose-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span>Low-Battery Priority Rescue Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Emergency Charging Assist
            </h1>
            <p className="text-sm text-rose-100/90 font-medium max-w-xl">
              Stranded or critically low on power? Connect with pre-verified local hosts offering immediate emergency driveway charging access within your reachable radius.
            </p>
          </div>

          {/* Quick Battery Stat Pill */}
          <div className="shrink-0 flex items-center gap-4 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center px-2">
              <div className="text-3xl font-black text-amber-300 flex items-center justify-center gap-1">
                <span>{currentBattery}%</span>
                <BatteryCharging className="h-6 w-6 animate-pulse text-amber-300" />
              </div>
              <div className="text-[11px] font-bold text-rose-200">Current Battery</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-white">~{estimatedRangeKm} km</div>
              <div className="text-[11px] font-bold text-rose-200">Reachable Range</div>
            </div>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Interactive Range & Emergency Radius Adjuster */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-rose-600" />
              <span>Adjust Stranded Vehicle Parameters</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Update battery percentage or search radius to pinpoint compatible community chargers.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Battery percentage is an estimate &mdash; road traffic reduces range</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Slider 1: Battery % */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Vehicle SoC</span>
              <span className="font-extrabold text-rose-600">{currentBattery}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={currentBattery}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setP2PQuery({
                  vehicleBatteryPct: val,
                  estimatedRangeKm: Number((val * 1.5).toFixed(1)),
                });
              }}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1% (Critical)</span>
              <span>15%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Slider 2: Search Radius */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Rescue Radius</span>
              <span className="font-extrabold text-slate-900">{emergencyRadius} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={emergencyRadius}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setEmergencyRadius(val);
                setP2PQuery({ radiusKm: val });
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1 km</span>
              <span>5 km</span>
              <span>15 km</span>
            </div>
          </div>

          {/* Connector Selector */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-slate-700">Connector Filter</div>
            <select
              value={selectedConnector}
              onChange={(e) => setSelectedConnector(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Compatible Connectors</option>
              <option value="TYPE_2">Type 2 AC (Mennekes)</option>
              <option value="CCS_2">CCS-2 DC Fast</option>
              <option value="BHARAT_AC001">Bharat AC-001</option>
            </select>
            <div className="text-[10px] text-slate-400 font-medium">
              Showing {reachableChargers.length} hosts within reachable zone
            </div>
          </div>
        </div>
      </div>

      {/* 3. Priority Charger Listings (Sorted by Shortest Distance) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-emerald-600" />
            <span>Nearest Verified Emergency Hosts ({reachableChargers.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Sorted by closest straight-line distance
          </span>
        </div>

        {reachableChargers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Hosts Within {emergencyRadius} km</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try extending your search radius slider above or switching connector filters to discover nearby community hosts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reachableChargers.map((charger) => {
              const isExtremelyClose = charger.distanceKm <= 2.5;

              return (
                <div
                  key={charger.id}
                  className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                    isExtremelyClose
                      ? 'border-emerald-300 ring-1 ring-emerald-500/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Photo + Distance Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-11 w-11 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src="/assets/images/vipin_home.jpg"
                            alt={charger.hostName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/vipin_home.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{charger.hostName}</span>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{charger.location.approximateLocality}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          isExtremelyClose
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Navigation className="h-3 w-3 text-emerald-600" />
                        <span>{charger.distanceKm.toFixed(1)} km</span>
                      </span>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Power</div>
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" />
                          <span>{charger.maxPowerKw} kW</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Pricing</div>
                        <div className="font-bold text-emerald-700">₹{charger.pricePerKwhInr.toFixed(2)} / kWh</div>
                      </div>
                    </div>

                    {/* Host Availability Window */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50/80 p-2 rounded-lg">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        Available: <strong className="text-slate-800">10:00 &ndash; 18:00</strong>
                      </span>
                    </div>
                  </div>

                  {/* 1-Tap SOS Booking Action */}
                  <button
                    type="button"
                    onClick={() => openBookingModal(charger)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BatteryCharging className="h-4 w-4" />
                    <span>Request Immediate SOS Slot</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Emergency Support & Helpline Card */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Need Live Dispatch or Roadside Towing?</h4>
            <p className="text-xs text-slate-400">
              EVkal Community Patrol &amp; Partner RSA Helpline: <strong>1800-200-EVKAL (Toll Free)</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Simulated Emergency SOS Broadcast dispatched to nearby registered community hosts.')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
        >
          Broadcast SOS to Area
        </button>
      </div>
    </div>
  );
}
