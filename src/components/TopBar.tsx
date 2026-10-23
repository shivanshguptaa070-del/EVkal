import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Calendar,
  Bell,
  ChevronDown,
  MapPin,
  User,
  Car,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function TopBar() {
  const {
    isLive,
    toggleNetworkFallback,
    setActiveTab,
    openProfileView,
    setActiveProfileTab,
    userProfile,
    activeTab,
  } = useSimulationStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
      {/* Left: Location Indicators (Matching Reference Mockup media_1792788491187.jpg) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Grid: India (NR) Pill (From Screenshot) */}
        <button
          type="button"
          onClick={toggleNetworkFallback}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          title="Toggle Grid API Mode"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isLive ? 'bg-emerald-400' : 'bg-amber-400'
              } opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLive ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </span>
          <span>Grid: India (NR)</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>


        {/* Landing Page Link */}
        <button
          type="button"
          onClick={() => setActiveTab('LANDING')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/40 shadow-2xs transition-all cursor-pointer"
          title="Return to Landing Page"
        >
          <Home className="h-3.5 w-3.5 text-emerald-600" />
          <span>Home</span>
        </button>

        {/* P2P Charger Sharing Pill (From Screenshot) */}
        <button
          type="button"
          onClick={() => setActiveTab('P1_P2P')}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
            activeTab === 'P1_P2P'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40'
          }`}
        >
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          <span>P2P Charger Sharing</span>
        </button>
      </div>

      {/* Right: Date Picker, Notification Bell, User Avatar Dropdown */}
      <div className="flex items-center gap-3">
        {/* Date Button (Matching Screenshot) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Mon, 23 Oct 2026</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="h-9 w-9 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs transition-colors cursor-pointer relative"
            title="3 active grid alerts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-xs space-y-2 animate-fade-in">
              <span className="font-bold text-slate-900 block pb-1 border-b border-slate-100">
                Grid Alerts (3)
              </span>
              <div className="p-2 rounded-lg bg-red-50 text-red-800 text-[11px] font-medium">
                ⚠️ Transformer overload risk at 19:00 IST (122.8 kW).
              </div>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-medium">
                ⚡ High tariff period approaching: ₹11.20/kWh.
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                ✅ Solar generation surplus available until 16:00.
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill with Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="user-avatar-btn"
            type="button"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 pl-1 cursor-pointer group focus:outline-hidden"
            title="Open User Profile Menu"
          >
            {/* Purple Avatar Circle matching screenshot */}
            <div className="h-9 w-9 rounded-full bg-purple-600 group-hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center shadow-xs transition-colors">
              ST
            </div>
            <ChevronDown
              className={`h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-transform ${
                showUserDropdown ? 'rotate-180 text-emerald-600' : ''
              }`}
            />
          </button>

          {/* Interactive User Profile Dropdown Menu */}
          {showUserDropdown && (
            <div
              id="profile-dropdown-menu"
              className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-fade-in divide-y divide-slate-100"
            >
              {/* User Identity Header */}
              <div
                onClick={() => {
                  openProfileView();
                  setActiveProfileTab('PERSONAL');
                  setShowUserDropdown(false);
                }}
                className="pb-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50/80 p-1.5 rounded-xl transition-colors"
                title="Click to view full profile"
              >
                <div className="relative">
                  <div className="h-11 w-11 rounded-full ring-2 ring-emerald-500 overflow-hidden bg-slate-100">
                    <img
                      src={userProfile.personal.avatarUrl}
                      alt={userProfile.personal.fullName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="h-full w-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center">
                      ST
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[8px]">
                    <Check className="h-2 w-2 stroke-[3]" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-slate-900 text-sm truncate">
                      {userProfile.personal.fullName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {userProfile.personal.email}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                    EV Driver &bull; P2P Host (Noida)
                  </div>
                </div>
              </div>

              {/* Primary Profile Action Button */}
              <div className="py-2.5">
                <button
                  id="view-profile-btn"
                  type="button"
                  onClick={() => {
                    openProfileView();
                    setActiveProfileTab('PERSONAL');
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>View Profile</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-600" />
                </button>
              </div>

              {/* Sub-Pages Shortcuts */}
              <div className="py-2 space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    openProfileView();
                    setActiveProfileTab('VEHICLES');
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Car className="h-3.5 w-3.5 text-slate-400" />
                    <span>My Registered Vehicles</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {userProfile.stats.vehiclesCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openProfileView();
                    setActiveProfileTab('VERIFICATION');
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    <span>Identity Verification</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                    KYC OK
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openProfileView();
                    setActiveProfileTab('SECURITY');
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-3.5 w-3.5 text-slate-400" />
                    <span>My Host Charger &amp; Bookings</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {userProfile.stats.bookingsCount}
                  </span>
                </button>
              </div>

              {/* Mode Switchers */}
              <div className="pt-2 text-[11px] space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('P0_GRID');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Go to <strong>P0 Feeder Dashboard</strong>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('P1_P2P');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Go to <strong>P1 Community Sharing</strong>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
