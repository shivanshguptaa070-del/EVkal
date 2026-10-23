import { PlusCircle, Sparkles } from 'lucide-react';
import { LowBatteryHeroInput } from './LowBatteryHeroInput';
import { ProximityRadarMap } from './ProximityRadarMap';
import { NearbyChargersList } from './NearbyChargersList';
import { ListChargerModal } from './ListChargerModal';
import { useSimulationStore } from '../store/useSimulationStore';

export function P2PChargerSharingTab() {
  const { openListChargerModal } = useSimulationStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Community Host Callout Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-tight text-white">
                Have a Home EV Socket in Delhi NCR?
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                Earn ₹6k–₹9k/mo
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Turn your unused driveway socket into a verified peer-to-peer charging point. Support neighbors in low-battery distress.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openListChargerModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>List Your Charger</span>
        </button>
      </div>

      {/* 1. Low Battery Emergency Hero Card */}
      <LowBatteryHeroInput />

      {/* 2. Main 2-Column Discovery Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (6 cols): Proximity Radar Map */}
        <section className="lg:col-span-6 h-full">
          <ProximityRadarMap />
        </section>

        {/* Right Column (6 cols): Available Chargers List */}
        <section className="lg:col-span-6 h-full">
          <NearbyChargersList />
        </section>
      </div>

      {/* 3. Host Registration Modal */}
      <ListChargerModal />
    </div>
  );
}
