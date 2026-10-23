import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Plus, Minus, Navigation, Shield } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ChargerListing } from '../types/p2p';
import { haversineDistanceKm } from '../domain/p2pMarketplaceEngine';

interface DelhiInteractiveMapProps {
  onSelectCharger?: (listing: ChargerListing) => void;
}

const LISTING_IMAGES: Record<string, string> = {
  'HOST-DEL-002': '/assets/images/dr_neha_villa.jpg', // Dr. Neha Sharma
  'HOST-DEL-001': '/assets/images/garage_rajesh.jpg',  // Rajesh K.
  'HOST-DEL-003': '/assets/images/arjun_garage.jpg',  // Arjun Bhasin
  'HOST-DEL-005': '/assets/images/vipin_home.jpg',    // Vipin Singhal
};

const LANDMARKS = [
  { name: 'Qutub Minar', lat: 28.5245, lon: 77.1855, icon: '🏛️' },
  { name: 'Mehrauli', lat: 28.5170, lon: 77.1780, icon: '📍' },
  { name: 'Saket Metro', lat: 28.5210, lon: 77.2010, icon: '🚇' },
  { name: 'Malviya Nagar', lat: 28.5390, lon: 77.2070, icon: '📍' },
  { name: 'Pushp Vihar', lat: 28.5280, lon: 77.2200, icon: '📍' },
];

export function DelhiInteractiveMap({ onSelectCharger }: DelhiInteractiveMapProps) {
  const { chargerListings, openBookingModal, p2pQuery } = useSimulationStore();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const innerCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const driverLat = p2pQuery.driverLat || 28.5355;
  const driverLon = p2pQuery.driverLon || 77.1735;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [driverLat, driverLon],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Beautiful CartoDB Voyager tiles matching clean light aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Attribution
    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>')
      .addTo(map);

    // Concentric Search Radar Circles
    const radiusMeters = p2pQuery.radiusKm * 1000;
    const outerCircle = L.circle([driverLat, driverLon], {
      radius: radiusMeters,
      color: '#3B82F6',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#3B82F6',
      fillOpacity: 0.08,
    }).addTo(map);
    circleRef.current = outerCircle;

    const innerCircle = L.circle([driverLat, driverLon], {
      radius: radiusMeters * 0.45,
      color: '#60A5FA',
      weight: 1.5,
      dashArray: '4, 4',
      fillColor: '#93C5FD',
      fillOpacity: 0.12,
    }).addTo(map);
    innerCircleRef.current = innerCircle;

    // Landmark markers (South Delhi reference points)
    LANDMARKS.forEach((lm) => {
      const landmarkIcon = L.divIcon({
        className: 'custom-leaflet-div-icon',
        html: `
          <div class="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700 whitespace-nowrap pointer-events-none flex items-center gap-1">
            <span>${lm.icon}</span>
            <span>${lm.name}</span>
          </div>
        `,
        iconAnchor: [30, 10],
      });
      L.marker([lm.lat, lm.lon], { icon: landmarkIcon, interactive: false }).addTo(map);
    });

    // Markers layer for charger pins
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Update User Center Marker whenever position or battery % changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userHtml = `
      <div class="relative flex flex-col items-center select-none" style="transform: translate(-50%, -50%);">
        <!-- Pulsing Aura -->
        <div class="absolute -top-3 -left-3 h-14 w-14 rounded-full bg-blue-500/25 animate-ping"></div>
        <div class="h-8 w-8 rounded-full bg-blue-500/30 flex items-center justify-center">
          <div class="h-4 w-4 rounded-full bg-[#2563EB] border-2 border-white shadow-md"></div>
        </div>
        <!-- Floating Popup Card -->
        <div class="mt-1 px-3 py-1 bg-white rounded-xl border border-slate-200/90 shadow-md text-center whitespace-nowrap">
          <div class="text-[11px] font-black text-slate-900 leading-none">You</div>
          <div class="text-[10px] font-bold text-red-500 leading-none mt-0.5">${p2pQuery.vehicleBatteryPct}% Battery</div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-leaflet-div-icon',
      html: userHtml,
      iconAnchor: [0, 0],
    });

    const marker = L.marker([driverLat, driverLon], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(mapRef.current);

    userMarkerRef.current = marker;
  }, [driverLat, driverLon, p2pQuery.vehicleBatteryPct]);

  // Update Radar Circles when Search Radius changes
  useEffect(() => {
    const radiusMeters = p2pQuery.radiusKm * 1000;
    if (circleRef.current) {
      circleRef.current.setRadius(radiusMeters);
      circleRef.current.setLatLng([driverLat, driverLon]);
    }
    if (innerCircleRef.current) {
      innerCircleRef.current.setRadius(radiusMeters * 0.45);
      innerCircleRef.current.setLatLng([driverLat, driverLon]);
    }
  }, [p2pQuery.radiusKm, driverLat, driverLon]);

  // Render Charger Markers on Map
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    chargerListings.forEach((listing) => {
      const lat = listing.location.latitude;
      const lon = listing.location.longitude;
      const distance = haversineDistanceKm(driverLat, driverLon, lat, lon);
      const isRecommended = listing.id === 'HOST-DEL-002'; // Dr. Neha Sharma
      const imgSrc = LISTING_IMAGES[listing.id] || '/assets/images/shivharsh_villa.jpg';

      // Pin DivIcon with Pin + Info Pill
      const pinHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
          <!-- Teardrop Pin -->
          <div class="flex items-center">
            <div class="h-9 w-9 rounded-full ${
              isRecommended ? 'bg-[#059669]' : 'bg-[#059669]'
            } text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
              <svg class="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            
            <!-- Floating Info Pill -->
            <div class="ml-1.5 px-2.5 py-1 bg-white rounded-xl border border-slate-200/90 shadow-sm whitespace-nowrap text-left group-hover:shadow-md transition-shadow">
              <div class="text-[11px] font-black text-slate-900 leading-tight">
                ${distance.toFixed(1)} km
              </div>
              <div class="text-[10px] font-bold text-slate-500 leading-tight">
                ₹${listing.pricePerKwhInr}/kWh
              </div>
            </div>
          </div>
        </div>
      `;

      const chargerIcon = L.divIcon({
        className: 'custom-leaflet-div-icon',
        html: pinHtml,
        iconAnchor: [0, 0],
      });

      const marker = L.marker([lat, lon], {
        icon: chargerIcon,
        zIndexOffset: isRecommended ? 800 : 500,
      });

      // Rich Interactive Popup
      const popupHtml = `
        <div class="w-64 p-3 bg-white space-y-2.5 select-none font-sans">
          <div class="h-28 w-full rounded-xl overflow-hidden bg-slate-100 relative">
            <img src="${imgSrc}" alt="${listing.hostName}" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-emerald-200">
              ✓ Verified Resident
            </div>
          </div>

          <div>
            <h4 class="text-xs font-black text-slate-900">${listing.hostName}</h4>
            <p class="text-[11px] text-slate-500 font-medium">${listing.location.approximateLocality}</p>
          </div>

          <div class="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl">
            <span class="font-bold text-slate-700">Type 2 AC (${listing.maxPowerKw} kW)</span>
            <span class="font-black text-[#059669]">₹${listing.pricePerKwhInr.toFixed(2)}/kWh</span>
          </div>

          <button
            id="book-btn-${listing.id}"
            class="w-full py-2 px-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer text-center block"
          >
            Book Charger →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 280,
        className: 'custom-leaflet-popup',
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`book-btn-${listing.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectCharger) {
              onSelectCharger(listing);
            } else {
              openBookingModal(listing);
            }
          };
        }
      });

      if (markersLayerRef.current) {
        marker.addTo(markersLayerRef.current);
      }
    });
  }, [chargerListings, driverLat, driverLon, onSelectCharger, openBookingModal]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapRef.current?.flyTo([driverLat, driverLon], 14, {
      duration: 1.2,
    });
  };

  return (
    <div className="relative w-full h-[580px] bg-[#EDF3EE] rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm select-none">
      {/* Leaflet Map Div Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Zoom & Recenter Controls (Top Left) */}
      <div className="absolute top-4 left-4 flex flex-col bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden divide-y divide-slate-100 z-[1000]">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2.5 text-[#059669] hover:text-[#047857] hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer"
          title="Recenter on You"
          aria-label="Recenter on You"
        >
          <Navigation className="h-4 w-4" />
        </button>
      </div>

      {/* Floating Map Info Pill (Top Right) */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-200/80 flex items-center gap-2 z-[1000] text-xs font-bold text-slate-800">
        <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
        <span>South Delhi Live P2P Grid</span>
      </div>

      {/* Floating Legend Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-200/80 flex flex-wrap items-center gap-3.5 z-[1000] text-[11px] font-semibold text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
          <span>Available ({chargerListings.length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6] border border-blue-400" />
          <span>Search Radius ({p2pQuery.radiusKm.toFixed(1)} km)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified Residents</span>
        </div>
      </div>
    </div>
  );
}
