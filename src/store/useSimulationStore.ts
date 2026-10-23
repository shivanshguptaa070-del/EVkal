import { create } from 'zustand';
import type { TransformerConfig, BackgroundLoadSlot } from '../types/transformer';
import type { EVSessionInput } from '../types/evSession';
import type { HourlyRegionalProfile, RegionalGridStress, DataProvenance } from '../types/grid';
import type { ChargerListing, LowBatterySearchQuery } from '../types/p2p';
import { runSmartChargingOptimisation, type SolverOutput } from '../domain/schedulerEngine';
import backgroundLoadData from '../data/residentialBackgroundLoad.json';
import scenariosData from '../data/benchmarkScenarios.json';
import syntheticGridData from '../data/syntheticGridProfile.json';
import sampleChargerListings from '../data/sampleChargerListings.json';

const INITIAL_CHARGERS = sampleChargerListings as ChargerListing[];

export interface P2PFilterState {
  fastOnly: boolean;
  verifiedOnly: boolean;
  coveredOnly: boolean;
  availableNowOnly: boolean;
}

const INITIAL_P2P_FILTERS: P2PFilterState = {
  fastOnly: false,
  verifiedOnly: false,
  coveredOnly: false,
  availableNowOnly: false,
};

const INITIAL_P2P_QUERY: LowBatterySearchQuery = {
  driverLat: 28.5355,
  driverLon: 77.1735,
  radiusKm: 5.0,
  vehicleBatteryPct: 15,
  estimatedRangeKm: 26,
  requiredConnector: 'TYPE_2',
};

export type ScenarioPreset = 'EVENING_RUSH' | 'VALLEY_SHIFT' | 'INFEASIBLE_REQUEST';
export type ActiveTab = 'LANDING' | 'P0_GRID' | 'P1_P2P';

const INITIAL_BACKGROUND = backgroundLoadData as BackgroundLoadSlot[];
const SCENARIOS = scenariosData as {
  eveningRush: EVSessionInput[];
  infeasibleRequest: EVSessionInput;
};
const INITIAL_REGIONAL = syntheticGridData as HourlyRegionalProfile[];

const INITIAL_CONFIG: TransformerConfig = {
  id: 'TX-100-SECTOR-4',
  name: 'Sector 4 Feeder Transformer',
  ratedCapacityKw: 100.0,
  safetyThresholdPct: 90.0,
  connectedHomesCount: 25,
};

// Deep copy helper for scenario fleets
function cloneFleet(fleet: EVSessionInput[]): EVSessionInput[] {
  return JSON.parse(JSON.stringify(fleet));
}

export type P2PSubView =
  | 'BROWSE'
  | 'FIND_CHARGERS'
  | 'LIST_CHARGER'
  | 'MY_BOOKINGS'
  | 'HOST_EARNINGS'
  | 'MEMBERSHIP';

interface SimulationState {
  // Navigation & UI state
  activeTab: ActiveTab;
  isModalOpen: boolean;
  selectedVehicleId: string | null;

  // Domain simulation state
  transformerConfig: TransformerConfig;
  backgroundLoad: BackgroundLoadSlot[];
  evFleet: EVSessionInput[];
  activeScenario: ScenarioPreset;
  regionalProfile: HourlyRegionalProfile[];
  regionalStress: RegionalGridStress;
  provenance: DataProvenance;
  isLive: boolean;

  // Synchronous solver output
  solverOutput: SolverOutput;

  // P2P Marketplace state
  p2pQuery: LowBatterySearchQuery;
  p2pSortBy: 'DISTANCE' | 'PRICE' | 'POWER';
  p2pFilters: P2PFilterState;
  chargerListings: ChargerListing[];
  isListChargerModalOpen: boolean;
  p2pSubView: P2PSubView;
  newlyAddedListingId: string | null;
  selectedChargerForBooking: ChargerListing | null;
  bookingStage: 'REVIEW' | 'TRANSMITTING' | 'ACCEPTED' | 'CHARGING' | 'COMPLETED';
  isBookingModalOpen: boolean;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setP2PSubView: (view: P2PSubView) => void;
  setTransformerCapacity: (capacityKw: number) => void;
  setScenario: (scenario: ScenarioPreset) => void;
  toggleVehicleFlexibility: (vehicleId: string) => void;
  updateVehicleSession: (vehicle: EVSessionInput) => void;
  addVehicleSession: (vehicle: EVSessionInput) => void;
  openSessionModal: (vehicleId?: string) => void;
  closeSessionModal: () => void;
  resetSimulation: () => void;

  // P2P Actions
  setP2PQuery: (query: Partial<LowBatterySearchQuery>) => void;
  setP2PSortBy: (sort: 'DISTANCE' | 'PRICE' | 'POWER') => void;
  setP2PFilter: (key: keyof P2PFilterState, value: boolean) => void;
  resetP2PFilters: () => void;
  openListChargerModal: () => void;
  closeListChargerModal: () => void;
  addChargerListing: (listing: ChargerListing) => void;
  openBookingModal: (listing: ChargerListing) => void;
  closeBookingModal: () => void;
  setBookingStage: (stage: 'REVIEW' | 'TRANSMITTING' | 'ACCEPTED' | 'CHARGING' | 'COMPLETED') => void;
  advanceBookingStage: () => void;
  toggleNetworkFallback: () => void;
}

// Initial solver execution
const initialFleet = cloneFleet(SCENARIOS.eveningRush);
const initialSolverOutput = runSmartChargingOptimisation(
  initialFleet,
  INITIAL_BACKGROUND,
  INITIAL_CONFIG,
  INITIAL_REGIONAL
);

export const useSimulationStore = create<SimulationState>((set, get) => ({
  activeTab: 'LANDING',
  isModalOpen: false,
  selectedVehicleId: null,

  transformerConfig: INITIAL_CONFIG,
  backgroundLoad: INITIAL_BACKGROUND,
  evFleet: initialFleet,
  activeScenario: 'EVENING_RUSH',
  regionalProfile: INITIAL_REGIONAL,
  regionalStress: 'REGIONAL_NORMAL',
  provenance: 'LIVE_API',
  isLive: true,

  solverOutput: initialSolverOutput,

  p2pQuery: INITIAL_P2P_QUERY,
  p2pSortBy: 'DISTANCE',
  p2pFilters: INITIAL_P2P_FILTERS,
  chargerListings: INITIAL_CHARGERS,
  isListChargerModalOpen: false,
  p2pSubView: 'LIST_CHARGER',
  newlyAddedListingId: null,
  selectedChargerForBooking: null,
  bookingStage: 'REVIEW',
  isBookingModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setTransformerCapacity: (capacityKw) => {
    const { evFleet, backgroundLoad, regionalProfile, transformerConfig } = get();
    const updatedConfig: TransformerConfig = {
      ...transformerConfig,
      ratedCapacityKw: capacityKw,
    };
    const solverOutput = runSmartChargingOptimisation(
      evFleet,
      backgroundLoad,
      updatedConfig,
      regionalProfile
    );
    set({
      transformerConfig: updatedConfig,
      solverOutput,
    });
  },

  setScenario: (scenario) => {
    const { backgroundLoad, regionalProfile, transformerConfig } = get();
    let nextFleet: EVSessionInput[];

    if (scenario === 'VALLEY_SHIFT') {
      // Valley Shift: all flexible vehicles actively shifted
      nextFleet = cloneFleet(SCENARIOS.eveningRush).map((ev) => ({
        ...ev,
        isFlexibilityOptIn: ev.id !== 'EV-02' && ev.id !== 'EV-07', // 5 flexible, 2 rigid
      }));
    } else if (scenario === 'INFEASIBLE_REQUEST') {
      // Infeasible Request scenario: includes EV-FAIL
      nextFleet = [...cloneFleet(SCENARIOS.eveningRush), cloneFleet([SCENARIOS.infeasibleRequest])[0]];
    } else {
      // Evening Rush: baseline uncoordinated
      nextFleet = cloneFleet(SCENARIOS.eveningRush);
    }

    const solverOutput = runSmartChargingOptimisation(
      nextFleet,
      backgroundLoad,
      transformerConfig,
      regionalProfile
    );

    set({
      activeScenario: scenario,
      evFleet: nextFleet,
      solverOutput,
    });
  },

  toggleVehicleFlexibility: (vehicleId) => {
    const { evFleet, backgroundLoad, regionalProfile, transformerConfig } = get();
    const updatedFleet = evFleet.map((ev) =>
      ev.id === vehicleId ? { ...ev, isFlexibilityOptIn: !ev.isFlexibilityOptIn } : ev
    );

    const solverOutput = runSmartChargingOptimisation(
      updatedFleet,
      backgroundLoad,
      transformerConfig,
      regionalProfile
    );

    set({
      evFleet: updatedFleet,
      solverOutput,
    });
  },

  updateVehicleSession: (vehicle) => {
    const { evFleet, backgroundLoad, regionalProfile, transformerConfig } = get();
    const updatedFleet = evFleet.map((ev) => (ev.id === vehicle.id ? vehicle : ev));

    const solverOutput = runSmartChargingOptimisation(
      updatedFleet,
      backgroundLoad,
      transformerConfig,
      regionalProfile
    );

    set({
      evFleet: updatedFleet,
      solverOutput,
      isModalOpen: false,
      selectedVehicleId: null,
    });
  },

  addVehicleSession: (vehicle) => {
    const { evFleet, backgroundLoad, regionalProfile, transformerConfig } = get();
    const updatedFleet = [...evFleet, vehicle];

    const solverOutput = runSmartChargingOptimisation(
      updatedFleet,
      backgroundLoad,
      transformerConfig,
      regionalProfile
    );

    set({
      evFleet: updatedFleet,
      solverOutput,
      isModalOpen: false,
      selectedVehicleId: null,
    });
  },

  openSessionModal: (vehicleId) => {
    set({
      isModalOpen: true,
      selectedVehicleId: vehicleId || null,
    });
  },

  closeSessionModal: () => {
    set({
      isModalOpen: false,
      selectedVehicleId: null,
    });
  },

  resetSimulation: () => {
    const defaultFleet = cloneFleet(SCENARIOS.eveningRush);
    const solverOutput = runSmartChargingOptimisation(
      defaultFleet,
      INITIAL_BACKGROUND,
      INITIAL_CONFIG,
      INITIAL_REGIONAL
    );

    set({
      transformerConfig: INITIAL_CONFIG,
      evFleet: defaultFleet,
      activeScenario: 'EVENING_RUSH',
      solverOutput,
      isModalOpen: false,
      selectedVehicleId: null,
      p2pQuery: INITIAL_P2P_QUERY,
      p2pSortBy: 'DISTANCE',
      p2pFilters: INITIAL_P2P_FILTERS,
      chargerListings: INITIAL_CHARGERS,
      isListChargerModalOpen: false,
      newlyAddedListingId: null,
      selectedChargerForBooking: null,
      bookingStage: 'REVIEW',
      isBookingModalOpen: false,
    });
  },

  setP2PQuery: (query) => {
    set((state) => ({
      p2pQuery: { ...state.p2pQuery, ...query },
    }));
  },

  setP2PSortBy: (sort) => set({ p2pSortBy: sort }),

  setP2PFilter: (key, value) => {
    set((state) => ({
      p2pFilters: { ...state.p2pFilters, [key]: value },
    }));
  },

  resetP2PFilters: () => set({ p2pFilters: INITIAL_P2P_FILTERS }),

  openListChargerModal: () => set({ isListChargerModalOpen: false, p2pSubView: 'LIST_CHARGER' }),
  closeListChargerModal: () => set({ isListChargerModalOpen: false, p2pSubView: 'FIND_CHARGERS' }),
  setP2PSubView: (view) => set({ isListChargerModalOpen: false, p2pSubView: view }),

  addChargerListing: (listing) => {
    set((state) => ({
      chargerListings: [listing, ...state.chargerListings],
      newlyAddedListingId: listing.id,
      isListChargerModalOpen: false,
      p2pSubView: 'BROWSE',
    }));
  },

  openBookingModal: (listing) => {
    set({
      selectedChargerForBooking: listing,
      bookingStage: 'REVIEW',
      isBookingModalOpen: true,
    });
  },

  closeBookingModal: () => {
    set({
      isBookingModalOpen: false,
      selectedChargerForBooking: null,
      bookingStage: 'REVIEW',
    });
  },

  setBookingStage: (stage) => set({ bookingStage: stage }),

  advanceBookingStage: () => {
    const { bookingStage } = get();
    const sequence: ('REVIEW' | 'TRANSMITTING' | 'ACCEPTED' | 'CHARGING' | 'COMPLETED')[] = [
      'REVIEW',
      'TRANSMITTING',
      'ACCEPTED',
      'CHARGING',
      'COMPLETED',
    ];
    const currentIndex = sequence.indexOf(bookingStage);
    if (currentIndex < sequence.length - 1) {
      set({ bookingStage: sequence[currentIndex + 1] });
    }
  },

  toggleNetworkFallback: () => {
    const { isLive } = get();
    if (isLive) {
      set({
        isLive: false,
        provenance: 'SYNTHETIC_FALLBACK',
      });
    } else {
      set({
        isLive: true,
        provenance: 'LIVE_API',
      });
    }
  },
}));
