import { useState } from 'react';
import { LowBatteryHeroInput } from './LowBatteryHeroInput';
import { P2PFilterBar } from './P2PFilterBar';
import { DelhiInteractiveMap } from './DelhiInteractiveMap';
import { P2PNearbyChargersList } from './P2PNearbyChargersList';
import { BookingSimModal } from './BookingSimModal';
import { ListChargerModal } from './ListChargerModal';
import { ListCommunityChargerPage } from './ListCommunityChargerPage';
import { useSimulationStore } from '../store/useSimulationStore';

export function P2PChargerSharingTab() {
  const { p2pSubView, setP2PSubView, openListChargerModal } = useSimulationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('TYPE_2');
  const [selectedRadius, setSelectedRadius] = useState(5);

  // If in 'LIST_CHARGER' mode, render the full community charger listing page
  if (p2pSubView === 'LIST_CHARGER') {
    return (
      <div className="animate-fade-in pb-10">
        <ListCommunityChargerPage onBack={() => setP2PSubView('BROWSE')} />
        <BookingSimModal />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* 1. Critical Low Battery Alert Function (At the Top) */}
      <LowBatteryHeroInput />

      {/* 2. Top Search & Filter Toolbar */}
      <P2PFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedConnector={selectedConnector}
        onConnectorChange={setSelectedConnector}
        selectedRadius={selectedRadius}
        onRadiusChange={setSelectedRadius}
        onToggleFilterModal={openListChargerModal}
      />

      {/* 3. Main 2-Column Interface: Left Map + Right Nearby Chargers List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (6 cols): Interactive Delhi South Map */}
        <section className="lg:col-span-6 xl:col-span-6 h-full">
          <DelhiInteractiveMap />
        </section>

        {/* Right Column (6 cols): Nearby Chargers List */}
        <section className="lg:col-span-6 xl:col-span-6 h-full">
          <P2PNearbyChargersList
            searchQuery={searchQuery}
            selectedConnector={selectedConnector}
            selectedRadius={selectedRadius}
          />
        </section>
      </div>

      {/* 4. Interactive Modals */}
      <BookingSimModal />
      <ListChargerModal />
    </div>
  );
}
