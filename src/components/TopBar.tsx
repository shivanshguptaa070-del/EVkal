import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Bell,
  ChevronDown,
  MapPin,
  User,
  Car,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
  LogOut,
  Database,
  Clock,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { getUserInitials } from '../utils/userInitials';

export function TopBar() {
  const {
    isLive,
    toggleNetworkFallback,
    setActiveTab,
    openProfileView,
    setActiveProfileTab,
    userProfile,
    activeTab,
    p2pSubView,
    setP2PSubView,
    isAdmin,
    adminId,
    setActiveP0SubPage,
    openAuthView,
    logoutUser,
    openDatabaseModal,
  } = useSimulationStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitials = getUserInitials(userProfile?.personal?.fullName);

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

  const isHostDashboard = activeTab === 'HOST_DASHBOARD' || (activeTab === 'P1_P2P' && p2pSubView === 'HOST_DASHBOARD');
  const isP2PSharing = activeTab === 'P1_P2P' && !isHostDashboard;
  const isGridOptimizer = activeTab === 'P0_GRID';

  return (
    <header className="w-full bg-[#070D18] border-b border-slate-800 px-4 sm:px-6 py-2.5 text-white select-none sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Logo (Matching Screenshot) */}
        <div
          onClick={() => setActiveTab('LANDING')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          title="Return to Landing Page"
        >
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/assets/images/evkal_logo.png"
              alt="EVkal"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
            EV<span className="text-emerald-400">kal</span>
          </span>
        </div>

        {/* Center: Three Navigation Pills */}
        <nav className="flex items-center bg-[#101726] p-1 rounded-full border border-slate-700/60 shadow-inner gap-1">
          {/* Tab 1: Grid & Transformer Optimizer */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('P0_GRID');
              setActiveP0SubPage('PAGE_1_DASHBOARD');
            }}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isGridOptimizer
                ? 'bg-[#E6FAF4] text-[#0A3D2E] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${isGridOptimizer ? 'text-emerald-700 fill-emerald-700' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Grid &amp; Transformer Optimizer</span>
            <span className="sm:hidden">Grid</span>
          </button>

          {/* Tab 2: P2P Charger Sharing */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('P1_P2P');
              setP2PSubView('FIND_CHARGERS');
            }}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isP2PSharing
                ? 'bg-[#E6FAF4] text-[#0A3D2E] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MapPin className={`h-3.5 w-3.5 ${isP2PSharing ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">P2P Charger Sharing</span>
            <span className="sm:hidden">P2P</span>
          </button>

          {/* Tab 3: Host Dashboard */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('HOST_DASHBOARD');
              setP2PSubView('HOST_DASHBOARD');
            }}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isHostDashboard
                ? 'bg-[#E6FAF4] text-[#0A3D2E] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className={`h-3.5 w-3.5 ${isHostDashboard ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Host Dashboard</span>
            <span className="sm:hidden">Host</span>
          </button>
        </nav>

        {/* Right: Live API badge, Clock, Notification Bell, User Avatar Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* LIVE API Pill */}
          <button
            type="button"
            onClick={toggleNetworkFallback}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101726] border border-slate-700/60 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
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
            <span className="text-[11px] hidden md:inline">LIVE API: Grid-India (NR)</span>
            <span className="text-[11px] md:hidden">LIVE</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Time badge: 19:00 IST */}
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>19:00 IST</span>
          </div>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="h-8.5 w-8.5 rounded-xl bg-[#101726] border border-slate-700/60 hover:bg-slate-800 flex items-center justify-center text-slate-300 shadow-2xs transition-colors cursor-pointer relative"
              title="3 active grid alerts"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-xs space-y-2 animate-fade-in text-slate-900">
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
              <div className="h-8.5 w-8.5 rounded-full bg-purple-600 group-hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-purple-400/40 shadow-xs transition-colors">
                {userInitials}
              </div>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 group-hover:text-slate-200 transition-transform ${
                  showUserDropdown ? 'rotate-180 text-emerald-400' : ''
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
                      {userInitials}
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

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    openDatabaseModal();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-900 font-medium transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="h-3.5 w-3.5 text-blue-600" />
                    <span>Verify Supabase DB</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded-full border border-blue-200">
                    PostgreSQL
                  </span>
                </button>
              </div>

              {/* If Admin, show Official Clearance Status */}
              {isAdmin && (
                <div className="py-2 px-3 my-2 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 text-[11px] leading-tight">
                        DISCOM Official Clearance
                      </div>
                      <div className="text-[10px] text-purple-700/80 font-mono leading-tight">
                        {adminId} (Full Grid Access)
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black uppercase">
                    Admin
                  </span>
                </div>
              )}

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

              {/* Sign In / Sign Out / Role Switch Action */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                {!isAdmin ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      openAuthView('OFFICIAL');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-purple-700 hover:bg-purple-50 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>DISCOM Official Login</span>
                    </span>
                    <span className="text-[9px] text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-black">Admin</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      openAuthView('SIGN_IN');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" />
                      <span>Switch to Driver/Host Login</span>
                    </span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-black">User</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    logoutUser();
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </span>
                  <span className="text-[10px] text-rose-500 bg-rose-100/70 px-1.5 py-0.5 rounded-sm">Exit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);
}
