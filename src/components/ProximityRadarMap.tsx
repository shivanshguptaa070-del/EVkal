import { useState } from 'react';
import { Shield, Plus, Minus, Crosshair, Home } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { searchNearbyChargers } from '../domain/p2pMarketplaceEngine';
import sampleChargerListings from '../data/sampleChargerListings.json';
import type { ChargerListing } from '../types/p2p';

export function ProximityRadarMap() {
  const { p2pQuery, openBookingModal } = useSimulationStore();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  // Pure domain search & ranking
  const searchResults = searchNearbyChargers(
    sampleChargerListings as ChargerListing[],
    p2pQuery,
    5, // Friday
    19 // 19:00 IST
  );

  // SVG Radar Dimensions
  const width = 500;
  const height = 440;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadiusPx = 180 * zoomLevel;

  // Scale: current radiusKm maps to maxRadiusPx
  const kmToPx = maxRadiusPx / p2pQuery.radiusKm;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col h-full">
      {/* Title & Legend Bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Nearby Community Chargers
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Verified residential chargers within your selected radius.
            </p>
          </div>
        </div>

        {/* Legend Row matching mockup */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>Incompatible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-dashed border-blue-400 bg-blue-50/50" />
            <span>Privacy Zone (&plusmn;350m)</span>
          </div>
        </div>
      </div>

      {/* Interactive Vector Radar Map Container */}
      <div className="relative flex-1 w-full min-h-[380px] bg-[#EEF5FB] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        {/* Subtle Map Grid Lines & Roads Canvas */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          role="img"
          aria-label="Interactive proximity radar map showing nearby community chargers"
        >
          <defs>
            <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#E2EBF4"
                strokeWidth="1.5"
              />
            </pattern>
            {/* Water / Greenery decorative zones */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Map Geometry */}
          <rect width={width} height={height} fill="#EEF5FB" />
          <rect width={width} height={height} fill="url(#roadGrid)" />

          {/* Vector City Arteries & Greenspace */}
          <path
            d="M 0 160 Q 140 180 250 210 T 500 230"
            fill="none"
            stroke="#DFE9F2"
            strokeWidth="16"
          />
          <path
            d="M 160 0 Q 180 140 230 250 T 270 440"
            fill="none"
            stroke="#DFE9F2"
            strokeWidth="12"
          />
          <path
            d="M 320 0 L 460 160 L 500 140"
            fill="none"
            stroke="#E1EBF5"
            strokeWidth="8"
          />
          <polygon
            points="20,40 100,20 120,90 40,110"
            fill="#DFF2E6"
            stroke="#CDE7D6"
            strokeWidth="1"
            opacity="0.8"
          />
          <polygon
            points="380,310 470,290 490,380 410,400"
            fill="#DFF2E6"
            stroke="#CDE7D6"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Concentric Range Distance Rings */}
          {[1, 3, 5].map((ringKm) => {
            const ringR = ringKm * kmToPx;
            if (ringR > maxRadiusPx * 1.25) return null;
            return (
              <g key={`ring-${ringKm}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={ringR}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity={ringKm === 5 ? '0.6' : '0.4'}
                />
                {/* Distance Badge on Ring Top */}
                <rect
                  x={cx - 16}
                  y={cy - ringR - 8}
                  width="32"
                  height="16"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#93C5FD"
                  strokeWidth="1"
                />
                <text
                  x={cx}
                  y={cy - ringR + 4}
                  textAnchor="middle"
                  fill="#1E40AF"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {ringKm} km
                </text>
              </g>
            );
          })}

          {/* Plot Host Charger Pins with ±350m Privacy Zones */}
          {searchResults.map((result) => {
            const { listing, straightLineDistanceKm, isCompatible, isAvailableNow } = result;

            // Approximate polar coordinates from Delhi center
            const dLat = listing.location.latitude - p2pQuery.driverLat;
            const dLon = listing.location.longitude - p2pQuery.driverLon;
            const angle = Math.atan2(dLon, dLat);

            const pinR = straightLineDistanceKm * kmToPx;
            const px = cx + pinR * Math.sin(angle);
            const py = cy - pinR * Math.cos(angle);

            const isHovered = hoveredListingId === listing.id;

            // Pin styling
            let pinColor = '#10B981'; // Emerald (Available & Compatible)
            let haloFill = 'rgba(16, 185, 129, 0.18)';
            let haloStroke = '#34D399';

            if (!isCompatible) {
              pinColor = '#EF4444'; // Red (Incompatible)
              haloFill = 'rgba(239, 68, 68, 0.18)';
              haloStroke = '#F87171';
            } else if (!isAvailableNow) {
              pinColor = '#64748B'; // Slate (Unavailable)
              haloFill = 'rgba(100, 116, 139, 0.18)';
              haloStroke = '#94A3B8';
            }

            // Estimated drive time ~3.2 mins per km in Delhi traffic
            const estMinutes = Math.round(straightLineDistanceKm * 3.2);

            return (
              <g
                key={listing.id}
                className="cursor-pointer transition-transform duration-150"
                onMouseEnter={() => setHoveredListingId(listing.id)}
                onMouseLeave={() => setHoveredListingId(null)}
                onClick={() => openBookingModal(listing)}
              >
                {/* Obfuscated ±350m Privacy Halo */}
                <circle
                  cx={px}
                  cy={py}
                  r={isHovered ? 34 : 28}
                  fill={haloFill}
                  stroke={haloStroke}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="transition-all duration-200"
                />

                {/* Charger Pin Center Button */}
                <circle
                  cx={px}
                  cy={py}
                  r={isHovered ? 15 : 13}
                  fill={pinColor}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="shadow-md"
                />

                {/* Home/Plug Icon inside pin */}
                <path
                  d={`M ${px - 4} ${py + 3} L ${px - 4} ${py - 1} L ${px} ${py - 4} L ${px + 4} ${py - 1} L ${px + 4} ${py + 3} Z`}
                  fill="#FFFFFF"
                />

                {/* Floating Distance & Time Pill Badge */}
                <g transform={`translate(${px + 16}, ${py - 12})`}>
                  <rect
                    width="62"
                    height="28"
                    rx="6"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    className="shadow-sm"
                  />
                  <text
                    x="31"
                    y="11"
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    {straightLineDistanceKm.toFixed(1)} km
                  </text>
                  <text
                    x="31"
                    y="22"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="8.5"
                    fontWeight="medium"
                  >
                    {estMinutes} min
                  </text>
                </g>
              </g>
            );
          })}

          {/* DRIVER (Center Pin) */}
          <g>
            {/* Pulsing Beacon Halo */}
            <circle
              cx={cx}
              cy={cy}
              r="22"
              fill="rgba(59, 130, 246, 0.2)"
              className="animate-ping"
              style={{ animationDuration: '3s' }}
            />
            <circle
              cx={cx}
              cy={cy}
              r="14"
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
            <circle cx={cx} cy={cy} r="5" fill="#FFFFFF" />

            {/* "You (7% Battery)" Pill */}
            <g transform={`translate(${cx - 44}, ${cy + 18})`}>
              <rect
                width="88"
                height="32"
                rx="8"
                fill="#FFFFFF"
                stroke="#93C5FD"
                strokeWidth="1.5"
                className="shadow-md"
              />
              <text
                x="44"
                y="14"
                textAnchor="middle"
                fill="#1E40AF"
                fontSize="10"
                fontWeight="bold"
              >
                You
              </text>
              <text
                x="44"
                y="25"
                textAnchor="middle"
                fill={p2pQuery.vehicleBatteryPct <= 10 ? '#DC2626' : '#2563EB'}
                fontSize="9"
                fontWeight="black"
              >
                ({p2pQuery.vehicleBatteryPct}% Battery)
              </text>
            </g>
          </g>
        </svg>

        {/* Top-Left Zoom Controls */}
        <div className="absolute top-3 left-3 flex flex-col bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden z-10">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
            className="p-2 hover:bg-slate-50 text-slate-700 transition-colors border-b border-slate-100"
            title="Zoom In"
            aria-label="Zoom in on radar map"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
            className="p-2 hover:bg-slate-50 text-slate-700 transition-colors border-b border-slate-100"
            title="Zoom Out"
            aria-label="Zoom out on radar map"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-2 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Reset Center"
            aria-label="Reset radar map center"
          >
            <Crosshair className="h-4 w-4 text-blue-600" />
          </button>
        </div>

        {/* Bottom-Left Obfuscation Notice Banner */}
        <div className="absolute bottom-3 left-3 max-w-[280px] bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl px-3 py-2 shadow-sm flex items-center gap-2 z-10">
          <Shield className="h-4 w-4 text-slate-500 shrink-0" />
          <p className="text-[11px] text-slate-600 font-medium leading-tight">
            Host residential locations are obfuscated for privacy until booking is confirmed.
          </p>
        </div>

        {/* Bottom-Right Location Legend */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl px-3 py-2 shadow-sm space-y-1.5 z-10 text-[11px] font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-600 ring-2 ring-blue-100" />
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Home className="h-2 w-2" />
            </span>
            <span>Community Charger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
