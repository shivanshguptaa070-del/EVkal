import { useState } from 'react';
import { Plus, Minus, Navigation } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ChargerListing } from '../types/p2p';

interface DelhiInteractiveMapProps {
  onSelectCharger?: (listing: ChargerListing) => void;
}

export function DelhiInteractiveMap({ onSelectCharger }: DelhiInteractiveMapProps) {
  const { chargerListings, openBookingModal } = useSimulationStore();
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Center on You (Hauz Khas / Saket area in South Delhi)
  const cx = 350;
  const cy = 290;
  const radiusPx = 170 * zoomLevel;

  const handlePinClick = (listing: ChargerListing) => {
    if (onSelectCharger) {
      onSelectCharger(listing);
    } else {
      openBookingModal(listing);
    }
  };

  const drNehaListing = chargerListings.find((c) => c.id === 'HOST-DEL-002') || chargerListings[1] || chargerListings[0];
  const rajeshListing = chargerListings.find((c) => c.id === 'HOST-DEL-001') || chargerListings[0];
  const arjunListing = chargerListings.find((c) => c.id === 'HOST-DEL-003') || chargerListings[2] || chargerListings[0];
  const vipinListing = chargerListings.find((c) => c.id === 'HOST-DEL-005') || chargerListings[3] || chargerListings[0];

  return (
    <div className="relative w-full h-[580px] bg-[#EDF3EE] rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm select-none">
      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 700 580"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Map Grid Pattern */}
          <pattern id="city-blocks" width="36" height="36" patternUnits="userSpaceOnUse">
            <rect width="34" height="34" fill="#E6EDE7" rx="3" />
            <path d="M 0 36 L 36 36 M 36 0 L 36 36" stroke="#DFE7E0" strokeWidth="2" />
          </pattern>

          {/* User Glow Gradient */}
          <radialGradient id="user-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
          </radialGradient>

          {/* Concentric Radar Gradient */}
          <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#DBEAFE" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0.05" />
          </radialGradient>

          {/* Green Pin Shadow */}
          <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#064E3B" floodOpacity="0.25" />
          </filter>

          {/* Card Shadow */}
          <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Base Map Background */}
        <rect width="700" height="580" fill="#EDF3EE" />

        {/* City Blocks Base */}
        <rect width="700" height="580" fill="url(#city-blocks)" opacity="0.65" />

        {/* Major Parks / Green Zones (Sanjay Van, Qutub Complex, Jahanpanah, Hauz Khas) */}
        <g id="parks" fill="#D8EBDD" opacity="0.85">
          {/* Mehrauli / Qutub Minar Archaeological Park */}
          <path d="M 120 220 Q 90 280 110 380 Q 160 410 190 340 Q 180 260 120 220 Z" />
          {/* Jahanpanah Forest */}
          <path d="M 460 210 Q 520 240 560 300 Q 530 360 480 340 Q 440 280 460 210 Z" fill="#D4E8DA" />
          {/* Pushp Vihar Greens */}
          <path d="M 420 380 Q 480 400 510 440 Q 460 480 400 450 Z" />
          {/* Sanjay Van North */}
          <path d="M 180 80 Q 240 100 250 160 Q 200 180 170 130 Z" />
          {/* Malviya Nagar Community Park */}
          <path d="M 330 140 Q 380 150 390 190 Q 340 200 320 170 Z" />
        </g>

        {/* Primary Highway & Arterial Roads Network */}
        <g id="major-roads" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
          {/* Aurobindo Marg / Mehrauli Badarpur Road */}
          <path d="M 220 0 L 260 180 L 290 320 L 320 460 L 360 580" strokeWidth="12" />
          <path d="M 220 0 L 260 180 L 290 320 L 320 460 L 360 580" stroke="#F1F5F9" strokeWidth="8" />

          {/* Outer Ring Road / Press Enclave Road */}
          <path d="M 0 190 Q 220 230 430 250 T 700 290" strokeWidth="11" />
          <path d="M 0 190 Q 220 230 430 250 T 700 290" stroke="#F1F5F9" strokeWidth="7" />

          {/* Saket Mandir Marg */}
          <path d="M 250 360 Q 380 380 540 370 L 700 390" strokeWidth="9" />
          <path d="M 250 360 Q 380 380 540 370 L 700 390" stroke="#F8FAFC" strokeWidth="6" />

          {/* Lal Bahadur Shastri Marg */}
          <path d="M 450 0 L 460 180 L 480 370 L 520 580" strokeWidth="9" />
          <path d="M 450 0 L 460 180 L 480 370 L 520 580" stroke="#F8FAFC" strokeWidth="6" />

          {/* Mehrauli Gurugram Road Connector */}
          <path d="M 0 380 L 160 410 L 290 480 L 380 580" strokeWidth="8" />
          <path d="M 0 380 L 160 410 L 290 480 L 380 580" stroke="#F8FAFC" strokeWidth="5" />
        </g>

        {/* Secondary Neighborhood Streets */}
        <g id="secondary-streets" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.9">
          <path d="M 120 100 L 250 140 M 150 260 L 270 280 M 340 180 L 460 160" />
          <path d="M 290 270 L 380 310 M 360 330 L 440 350 M 400 270 L 450 340" />
          <path d="M 330 380 L 350 470 M 270 420 L 330 440 M 470 300 L 580 310" />
          <path d="M 480 430 L 570 420 M 490 470 L 620 460 M 200 340 L 240 400" />
        </g>

        {/* Delhi Metro Yellow Line (Dotted Line) */}
        <path
          d="M 260 0 L 290 180 L 320 330 L 350 490 L 370 580"
          stroke="#E11D48"
          strokeWidth="3.5"
          strokeDasharray="6 4"
          fill="none"
          opacity="0.75"
        />

        {/* Geographic Landmark Text Labels Matching Mockup */}
        <g id="landmark-labels" className="font-sans font-medium select-none pointer-events-none">
          {/* Qutub Minar Landmark with Icon */}
          <g transform="translate(100, 310)">
            {/* Monument / Tower Icon */}
            <path
              d="M 18 10 L 15 28 L 21 28 Z M 16 28 L 14 36 L 22 36 L 20 28 Z"
              fill="#64748B"
            />
            <circle cx="18" cy="8" r="2" fill="#64748B" />
            <text x="18" y="50" textAnchor="middle" fill="#64748B" fontSize="12" fontWeight="600">
              Qutub Minar
            </text>
          </g>

          {/* Mehrauli */}
          <text x="80" y="440" fill="#64748B" fontSize="12" fontWeight="600">
            Mehrauli
          </text>

          {/* Pushp Vihar */}
          <text x="490" y="240" fill="#64748B" fontSize="12" fontWeight="600">
            PUSHP VIHAR
          </text>

          {/* Malviya Nagar */}
          <text x="500" y="325" fill="#64748B" fontSize="12" fontWeight="600">
            MALVIYA NAGAR
          </text>

          {/* Saket Metro Station with Red M Badge */}
          <g transform="translate(300, 520)">
            <circle cx="12" cy="12" r="8" fill="#E11D48" />
            <text x="12" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900">
              M
            </text>
            <text x="26" y="16" fill="#334155" fontSize="12" fontWeight="700">
              Saket
            </text>
          </g>
        </g>

        {/* Concentric Radar Circles From User */}
        <g id="radar-rings" className="pointer-events-none">
          {/* Inner Light Blue Fill */}
          <circle cx={cx} cy={cy} r={radiusPx * 0.4} fill="url(#radar-gradient)" />

          {/* Mid Circle */}
          <circle
            cx={cx}
            cy={cy}
            r={radiusPx * 0.65}
            fill="none"
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Outer Dashed 5km Perimeter Ring (Exact Match to Screenshot) */}
          <circle
            cx={cx}
            cy={cy}
            r={radiusPx}
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeDasharray="6 6"
            opacity="0.85"
          />
        </g>

        {/* Charger Map Pins */}
        <g id="charger-pins">
          {/* 1. Pin: Dr. Neha Sharma (0.6 km NE) - Green with Lightning + Floating Info Pill */}
          <g
            transform={`translate(${cx + 45}, ${cy - 85})`}
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handlePinClick(drNehaListing)}
          >
            {/* Teardrop Pin */}
            <path
              d="M 0 -34 C -13 -34 -20 -22 -20 -10 C -20 10 0 28 0 28 C 0 28 20 10 20 -10 C 20 -22 13 -34 0 -34 Z"
              fill="#059669"
              filter="url(#pin-shadow)"
            />
            {/* White Lightning Bolt Inside Pin */}
            <path
              d="M 1 -20 L -6 -8 L 0 -8 L -1 2 L 6 -10 L 0 -10 Z"
              fill="#FFFFFF"
            />

            {/* Floating Info Pill Badge: "0.6 km  ₹12/kWh" */}
            <g transform="translate(14, -40)" filter="url(#card-shadow)">
              <rect
                x="0"
                y="0"
                width="84"
                height="34"
                rx="10"
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="12" y="15" fill="#0F172A" fontSize="11" fontWeight="800">
                0.6 km
              </text>
              <text x="12" y="27" fill="#64748B" fontSize="10" fontWeight="600">
                ₹12/kWh
              </text>
            </g>
          </g>

          {/* 2. Pin: Rajesh K. (2.1 km NW) - Green Teardrop */}
          <g
            transform={`translate(${cx - 130}, ${cy - 12})`}
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handlePinClick(rajeshListing)}
          >
            <path
              d="M 0 -28 C -11 -28 -17 -18 -17 -8 C -17 8 0 22 0 22 C 0 22 17 8 17 -8 C 17 -18 11 -28 0 -28 Z"
              fill="#059669"
              filter="url(#pin-shadow)"
            />
            <path
              d="M 1 -17 L -5 -7 L 0 -7 L -1 1 L 5 -9 L 0 -9 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* 3. Pin: Arjun Bhasin (3.3 km S) - Green Teardrop */}
          <g
            transform={`translate(${cx + 80}, ${cy + 130})`}
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handlePinClick(arjunListing)}
          >
            <path
              d="M 0 -28 C -11 -28 -17 -18 -17 -8 C -17 8 0 22 0 22 C 0 22 17 8 17 -8 C 17 -18 11 -28 0 -28 Z"
              fill="#059669"
              filter="url(#pin-shadow)"
            />
            <path
              d="M 1 -17 L -5 -7 L 0 -7 L -1 1 L 5 -9 L 0 -9 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* 4. Pin: Vipin Singhal (3.6 km E) - Green Teardrop */}
          <g
            transform={`translate(${cx + 200}, ${cy + 50})`}
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handlePinClick(vipinListing)}
          >
            <path
              d="M 0 -28 C -11 -28 -17 -18 -17 -8 C -17 8 0 22 0 22 C 0 22 17 8 17 -8 C 17 -18 11 -28 0 -28 Z"
              fill="#059669"
              filter="url(#pin-shadow)"
            />
            <path
              d="M 1 -17 L -5 -7 L 0 -7 L -1 1 L 5 -9 L 0 -9 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* 5. Pin: Green Teardrop (SW) */}
          <g transform={`translate(${cx - 100}, ${cy + 90})`} className="cursor-pointer transition-transform hover:scale-110">
            <path
              d="M 0 -28 C -11 -28 -17 -18 -17 -8 C -17 8 0 22 0 22 C 0 22 17 8 17 -8 C 17 -18 11 -28 0 -28 Z"
              fill="#059669"
              filter="url(#pin-shadow)"
            />
            <path d="M 1 -17 L -5 -7 L 0 -7 L -1 1 L 5 -9 L 0 -9 Z" fill="#FFFFFF" />
          </g>

          {/* 6. Pin: Red Teardrop (Unavailable / Busy Charger - East) */}
          <g transform={`translate(${cx + 110}, ${cy - 18})`} className="cursor-pointer transition-transform hover:scale-110">
            <path
              d="M 0 -28 C -11 -28 -17 -18 -17 -8 C -17 8 0 22 0 22 C 0 22 17 8 17 -8 C 17 -18 11 -28 0 -28 Z"
              fill="#EF4444"
              filter="url(#pin-shadow)"
            />
            <path d="M 1 -17 L -5 -7 L 0 -7 L -1 1 L 5 -9 L 0 -9 Z" fill="#FFFFFF" />
          </g>

          {/* 7. Pin: Dark Slate Teardrop (Incompatible Connector - West) */}
          <g transform={`translate(${cx - 170}, ${cy - 65})`} className="cursor-pointer transition-transform hover:scale-110">
            <path
              d="M 0 -28 C -11 -28 -17 -18 -17 -8 C -17 8 0 22 0 22 C 0 22 17 8 17 -8 C 17 -18 11 -28 0 -28 Z"
              fill="#64748B"
              filter="url(#pin-shadow)"
            />
            <path d="M 1 -17 L -5 -7 L 0 -7 L -1 1 L 5 -9 L 0 -9 Z" fill="#FFFFFF" />
          </g>
        </g>

        {/* Center: YOU Marker with Glowing Aura & Info Card */}
        <g id="you-center-marker">
          {/* Subtle Ambient Pulse */}
          <circle cx={cx} cy={cy} r="48" fill="url(#user-glow)" />

          {/* User Blue Pin Dot with White Halo */}
          <circle cx={cx} cy={cy} r="16" fill="rgba(37, 99, 235, 0.25)" />
          <circle cx={cx} cy={cy} r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />

          {/* Floating White Popup Card: "You" / "15% Battery" */}
          <g transform={`translate(${cx - 52}, ${cy + 18})`} filter="url(#card-shadow)">
            <rect
              x="0"
              y="0"
              width="104"
              height="44"
              rx="12"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <text x="52" y="18" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="800">
              You
            </text>
            <text x="52" y="33" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="700">
              15% Battery
            </text>
          </g>
        </g>
      </svg>

      {/* Floating Map Controls (Top Left) */}
      <div className="absolute top-4 left-4 flex flex-col bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden divide-y divide-slate-100 z-10">
        <button
          type="button"
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.4))}
          className="p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-center"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.8))}
          className="p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-center"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(1)}
          className="p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-center"
          title="Recenter"
          aria-label="Recenter"
        >
          <Navigation className="h-4 w-4 rotate-45 text-blue-600" />
        </button>
      </div>

      {/* "My Location" Floating Pill Button (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          type="button"
          onClick={() => setZoomLevel(1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-md text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all hover:scale-[1.02]"
        >
          <Navigation className="h-4 w-4 text-blue-600 rotate-45" />
          <span>My Location</span>
        </button>
      </div>

      {/* Map Scale Bar (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end">
        <span className="text-[11px] font-bold text-slate-700 mb-1">2 km</span>
        <div className="w-16 h-1 bg-slate-800 rounded-full relative">
          <div className="absolute -top-1 left-0 w-0.5 h-3 bg-slate-800" />
          <div className="absolute -top-1 right-0 w-0.5 h-3 bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
