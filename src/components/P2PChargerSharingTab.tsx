import { LowBatteryHeroInput } from './LowBatteryHeroInput';
import { ProximityRadarMap } from './ProximityRadarMap';
import { NearbyChargersList } from './NearbyChargersList';

export function P2PChargerSharingTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Low Battery Emergency Hero Card */}
      <LowBatteryHeroInput />

      {/* 2. Main 2-Column Discovery Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5.5 cols): Proximity Radar Map */}
        <section className="lg:col-span-6 h-full">
          <ProximityRadarMap />
        </section>

        {/* Right Column (6.5 cols): Available Chargers List */}
        <section className="lg:col-span-6 h-full">
          <NearbyChargersList />
        </section>
      </div>
    </div>
  );
}
