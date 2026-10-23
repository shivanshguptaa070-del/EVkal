import { useState } from 'react';
import { P2PFilterBar } from './P2PFilterBar';
import { DelhiInteractiveMap } from './DelhiInteractiveMap';
import { P2PNearbyChargersList } from './P2PNearbyChargersList';
import { BookingSimModal } from './BookingSimModal';
import { ListChargerModal } from './ListChargerModal';
import { useSimulationStore } from '../store/useSimulationStore';

export function P2PChargerSharingTab() {
  const { openListChargerModal } = useSimulationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('TYPE_2');
  const [selectedRadius, setSelectedRadius] = useState(5);

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* 1. Top Search & Filter Toolbar (Matches Mockup Exactly) */}
      <P2PFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedConnector={selectedConnector}
        onConnectorChange={setSelectedConnector}
        selectedRadius={selectedRadius}
        onRadiusChange={setSelectedRadius}
        onToggleFilterModal={openListChargerModal}
      />

      {/* 2. Main 2-Column Interface: Left Map + Right Nearby Chargers List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5.8 cols): Interactive Delhi South Map */}
        <section className="lg:col-span-6 xl:col-span-6 h-full">
          <DelhiInteractiveMap />
        </section>

        {/* Right Column (6.2 cols): Nearby Chargers List */}
        <section className="lg:col-span-6 xl:col-span-6 h-full">
          <P2PNearbyChargersList
            searchQuery={searchQuery}
            selectedConnector={selectedConnector}
            selectedRadius={selectedRadius}
          />
        </section>
      </div>

      {/* 3. Interactive Modals */}
      <BookingSimModal />
      <ListChargerModal />
    </div>
  );
}
