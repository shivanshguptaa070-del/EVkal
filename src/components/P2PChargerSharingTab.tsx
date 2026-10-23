import { useState } from 'react';
import { P2PSidebar } from './P2PSidebar';
import { LowBatteryHeroInput } from './LowBatteryHeroInput';
import { P2PFilterBar } from './P2PFilterBar';
import { DelhiInteractiveMap } from './DelhiInteractiveMap';
import { P2PNearbyChargersList } from './P2PNearbyChargersList';
import { ListCommunityChargerPage } from './ListCommunityChargerPage';
import { MyBookingsPage } from './MyBookingsPage';
import { HostEarningsPage } from './HostEarningsPage';
import { MembershipPricingPage } from './MembershipPricingPage';
import { BookingSimModal } from './BookingSimModal';
import { useSimulationStore } from '../store/useSimulationStore';

export function P2PChargerSharingTab() {
  const { p2pSubView, setP2PSubView, p2pQuery, setP2PQuery } = useSimulationStore();
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
      {/* 1. Left Sidebar Navigation Panel (Consists of all functions except transaction) */}
      <P2PSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        {/* VIEW 1: Find Chargers (Browse & Map) */}
        {(p2pSubView === 'FIND_CHARGERS' || p2pSubView === 'BROWSE') && (
          <div className="space-y-5 animate-fade-in">
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

        {/* VIEW 2: List Your Community Charger Wizard */}
        {p2pSubView === 'LIST_CHARGER' && (
          <ListCommunityChargerPage onBack={() => setP2PSubView('FIND_CHARGERS')} />
        )}

        {/* VIEW 3: My Bookings */}
        {p2pSubView === 'MY_BOOKINGS' && (
          <MyBookingsPage />
        )}

        {/* VIEW 4: Host Earnings */}
        {p2pSubView === 'HOST_EARNINGS' && (
          <HostEarningsPage />
        )}

        {/* VIEW 5: Membership & Pricing */}
        {p2pSubView === 'MEMBERSHIP' && (
          <MembershipPricingPage />
        )}
      </div>

      {/* Interactive Modals */}
      <BookingSimModal />
    </div>
  );
}
