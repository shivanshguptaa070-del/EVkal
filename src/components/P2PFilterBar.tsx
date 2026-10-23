import { Search, Zap, Compass, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { ConnectorType } from '../types/p2p';

interface P2PFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedConnector: string;
  onConnectorChange: (connector: string) => void;
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  onToggleFilterModal?: () => void;
}

export function P2PFilterBar({
  searchQuery,
  onSearchChange,
  selectedConnector,
  onConnectorChange,
  selectedRadius,
  onRadiusChange,
  onToggleFilterModal,
}: P2PFilterBarProps) {
  const { setP2PQuery } = useSimulationStore();

  const handleConnectorSelect = (value: string) => {
    onConnectorChange(value);
    if (value !== 'ALL') {
      setP2PQuery({ requiredConnector: value as ConnectorType });
    }
  };

  const handleRadiusSelect = (radiusNum: number) => {
    onRadiusChange(radiusNum);
    setP2PQuery({ radiusKm: radiusNum });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* 1. Search Nearby Chargers Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search nearby chargers..."
          className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>

      {/* 2. Controls Group (Connector, Radius, Filter Icon) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Connector Dropdown: ⚡ Type 2 (AC) ⌄ */}
        <div className="relative">
          <select
            value={selectedConnector}
            onChange={(e) => handleConnectorSelect(e.target.value)}
            className="appearance-none pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
          >
            <option value="TYPE_2">Type 2 (AC)</option>
            <option value="CCS_2">CCS 2 (Fast DC)</option>
            <option value="BHARAT_AC001">Bharat AC-001</option>
            <option value="ALL">All Connectors</option>
          </select>
          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-600 fill-emerald-600 pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Radius Dropdown: ⌖ Within 5 km ⌄ */}
        <div className="relative">
          <select
            value={selectedRadius}
            onChange={(e) => handleRadiusSelect(Number(e.target.value))}
            className="appearance-none pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
          >
            <option value={3}>Within 3 km</option>
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
          </select>
          <Compass className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-700 pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Filter Sliders Button */}
        <button
          type="button"
          onClick={onToggleFilterModal}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-colors flex items-center justify-center"
          title="Filter preferences"
          aria-label="Filter preferences"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
