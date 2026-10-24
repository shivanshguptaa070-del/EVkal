import { useState } from 'react';
import { User, Zap, Car, ArrowRight } from 'lucide-react';
import { P2PSidebar } from './P2PSidebar';
import { LowBatteryHeroInput } from './LowBatteryHeroInput';
import { P2PFilterBar } from './P2PFilterBar';
import { DelhiInteractiveMap } from './DelhiInteractiveMap';
import { P2PNearbyChargersList } from './P2PNearbyChargersList';
import { ListCommunityChargerPage } from './ListCommunityChargerPage';
import { MyBookingsPage } from './MyBookingsPage';
import { HostEarningsPage } from './HostEarningsPage';
import { HostDashboardPage } from './HostDashboardPage';
import { MembershipPricingPage } from './MembershipPricingPage';
import { useSimulationStore } from '../store/useSimulationStore';

export function P2PChargerSharingTab() {
  const {
    p2pSubView,
    setP2PSubView,
    userProfile,
    openProfileView,
    setActiveProfileTab,
    p2pQuery,
    setP2PQuery,
  } = useSimulationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<string>(p2pQuery.requiredConnector || 'TYPE_2');
  const [selectedRadius, setSelectedRadius] = useState<number>(p2pQuery.radiusKm || 5);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  // Triggered when user clicks "Find Compatible Nearby Chargers" in Hero Card
  const handleFindNearbyChargers = () => {
    setSelectedConnector(p2pQuery.requiredConnector);
    setSelectedRadius(p2pQuery.radiusKm);
    setIsSearchTriggered(true);
  };

  const handleResetSearch = () => {
    setSelectedConnector('ALL');
    setSelectedRadius(10);
    setSearchQuery('');
    setIsSearchTriggered(false);
    setP2PQuery({
      requiredConnector: 'TYPE_2',
      radiusKm: 10,
    });
  };

  const handleConnectorChange = (connector: string) => {
    setSelectedConnector(connector);
    if (connector !== 'ALL') {
      setP2PQuery({ requiredConnector: connector as any });
    }
  };

  const handleRadiusChange = (radius: number) => {
    setSelectedRadius(radius);
    setP2PQuery({ radiusKm: radius });
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 animate-fade-in pb-12">
      {/* 1. Left Independent P2P Sidebar Navigation Panel */}
      <P2PSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full min-w-0 space-y-5">
        {/* VIEW 1: Find Chargers (Browse & Map) */}
        {(p2pSubView === 'FIND_CHARGERS' || p2pSubView === 'BROWSE' || !p2pSubView) && (
          <div className="space-y-5 animate-fade-in">
            {/* P1 User Profile & Host Quick Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full ring-2 ring-emerald-500 overflow-hidden bg-slate-100">
                    <img
                      src={userProfile.personal.avatarUrl}
                      alt={userProfile.personal.fullName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="h-full w-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      ST
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {userProfile.personal.fullName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                      Verified Driver &amp; Host
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Sector-Alpha, Noida &bull; 8 Bookings &bull; 1 Active Wallbox (7.4 kW)
                  </p>
                </div>
              </div>

              {/* Quick Profile Shortcuts */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    openProfileView();
                    setActiveProfileTab('VEHICLES');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Car className="h-3.5 w-3.5 text-slate-500" />
                  <span>My Vehicles (2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setP2PSubView('HOST_DASHBOARD')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Host Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openProfileView();
                    setActiveProfileTab('PERSONAL');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>View Full Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Critical Low Battery Alert Function (At the Top) */}
            <LowBatteryHeroInput onFindChargers={handleFindNearbyChargers} />

            {/* Top Search & Filter Toolbar */}
            <P2PFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedConnector={selectedConnector}
              onConnectorChange={handleConnectorChange}
              selectedRadius={selectedRadius}
              onRadiusChange={handleRadiusChange}
              onToggleFilterModal={() => setP2PSubView('LIST_CHARGER')}
            />

            {/* Main 2-Column Interface: Left Map + Right Nearby Chargers List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (6 cols): Interactive Delhi South Map */}
              <section className="lg:col-span-6 xl:col-span-6 h-full">
                <DelhiInteractiveMap
                  selectedConnector={selectedConnector}
                  selectedRadius={selectedRadius}
                  isSearchTriggered={isSearchTriggered}
                />
              </section>

              {/* Right Column (6 cols): Nearby Chargers List */}
              <section className="lg:col-span-6 xl:col-span-6 h-full">
                <P2PNearbyChargersList
                  searchQuery={searchQuery}
                  selectedConnector={selectedConnector}
                  selectedRadius={selectedRadius}
                  isSearchTriggered={isSearchTriggered}
                  onResetSearch={handleResetSearch}
                  onConnectorChange={handleConnectorChange}
                  onRadiusChange={handleRadiusChange}
                />
              </section>
            </div>
          </div>
        )}

        {/* VIEW 2: Host Dashboard */}
        {p2pSubView === 'HOST_DASHBOARD' && (
          <HostDashboardPage />
        )}

        {/* VIEW 3: List Your Community Charger Wizard */}
        {p2pSubView === 'LIST_CHARGER' && (
          <ListCommunityChargerPage onBack={() => setP2PSubView('FIND_CHARGERS')} />
        )}

        {/* VIEW 4: My Bookings */}
        {p2pSubView === 'MY_BOOKINGS' && (
          <MyBookingsPage />
        )}

        {/* VIEW 5: Host Earnings */}
        {p2pSubView === 'HOST_EARNINGS' && (
          <HostEarningsPage />
        )}

        {/* VIEW 6: Membership & Pricing */}
        {p2pSubView === 'MEMBERSHIP' && (
          <MembershipPricingPage />
        )}
      </div>
    </div>
  );
}
