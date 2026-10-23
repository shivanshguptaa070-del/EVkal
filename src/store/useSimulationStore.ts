import { create } from 'zustand';
import type { TransformerConfig, BackgroundLoadSlot } from '../types/transformer';
import type { EVSessionInput } from '../types/evSession';
import type { HourlyRegionalProfile, RegionalGridStress, DataProvenance } from '../types/grid';
import type { ChargerListing, LowBatterySearchQuery } from '../types/p2p';
import { runSmartChargingOptimisation, type SolverOutput } from '../domain/schedulerEngine';
import backgroundLoadData from '../data/residentialBackgroundLoad.json';
import scenariosData from '../data/benchmarkScenarios.json';
import syntheticGridData from '../data/syntheticGridProfile.json';

const INITIAL_P2P_QUERY: LowBatterySearchQuery = {
  driverLat: 28.5355,
  driverLon: 77.1735,
  radiusKm: 5.0,
  vehicleBatteryPct: 7,
  estimatedRangeKm: 12,
  requiredConnector: 'TYPE_2',
};

import type {
  UserProfileData,
  ProfileTabId,
  PersonalDetails,
  AddressDetails,
  EmergencyContact,
} from '../types/profile';

export type ScenarioPreset = 'EVENING_RUSH' | 'VALLEY_SHIFT' | 'INFEASIBLE_REQUEST';
export type ActiveTab = 'LANDING' | 'P0_GRID' | 'P1_P2P' | 'PROFILE';
export type P0SubPage =
  | 'PAGE_1_DASHBOARD'
  | 'PAGE_2_FLEET'
  | 'PAGE_3_TARIFF'
  | 'PAGE_4_SCHEDULER'
  | 'PAGE_5_RESULTS'
  | 'PAGE_6_PROFILE';


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

// Initial profile data matching the reference screen
const INITIAL_USER_PROFILE: UserProfileData = {
  personal: {
    fullName: 'Shivharsh Rai',
    dateOfBirth: '12 Mar 2004',
    gender: 'Male',
    email: 'shivharshrai24@example.com',
    isEmailVerified: true,
    mobileNumber: '+91 98765 43210',
    isMobileVerified: true,
    alternateNumber: '+91 87654 32109',
    accountType: 'Individual',
    bio: 'Passionate about clean mobility and sustainable cities.',
    avatarUrl: '/assets/images/shivharsh_profile.jpg',
  },
  address: {
    addressLine1: 'A-204, Green View Apartments',
    addressLine2: 'Near Jaypee Hospital',
    city: 'Noida',
    pinCode: '201310',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
  },
  emergency: {
    contactName: 'Rajesh Rai',
    relationship: 'Father',
    contactNumber: '+91 91234 56789',
  },
  stats: {
    vehiclesCount: 2,
    bookingsCount: 8,
    chargersCount: 1,
    co2SavedKg: 320,
  },
  vehicles: [
    {
      id: 'veh-shiv-1',
      model: 'Tata Nexon EV Max',
      regNumber: 'UP 16 EV 2024',
      batteryCapacityKwh: 40.5,
      currentSocPct: 58,
      maxChargeRateKw: 7.2,
      connectorType: 'CCS2',
      smartFlexibility: true,
      targetSocPct: 90,
      dailyDepartureTime: '08:30',
      assignedFeederId: 'TX-100-SECTOR-4',
      image: '/assets/images/nexon_ev.jpg',
    },
    {
      id: 'veh-shiv-2',
      model: 'Tata Tiago EV',
      regNumber: 'UP 16 BE 8899',
      batteryCapacityKwh: 24.0,
      currentSocPct: 75,
      maxChargeRateKw: 3.3,
      connectorType: 'TYPE_2',
      smartFlexibility: true,
      targetSocPct: 80,
      dailyDepartureTime: '09:00',
      assignedFeederId: 'TX-100-SECTOR-4',
      image: '/assets/images/tiago_ev.jpg',
    },
  ],
  hostCharger: {
    id: 'chg-host-1',
    title: 'Shivharsh & Rajesh 7.4 kW Wallbox',
    address: 'A-204, Green View Apartments, Near Jaypee Hospital, Noida',
    powerKw: 7.4,
    connector: 'TYPE_2',
    pricePerKwh: 14.0,
    availability: 'Mon - Fri (09:00 - 18:00)',
    smartGridSync: true,
    activeStatus: true,
    earningsThisMonthInr: 3420,
    totalSessionsHosted: 24,
  },
  bookings: [
    {
      id: 'bk-108',
      hostName: 'Dr. Ramesh Sharma',
      chargerTitle: 'Jaypee Greens 11 kW Wallbox',
      location: 'Sector 128, Noida',
      date: '21 Oct 2026',
      energyKwh: 22.4,
      costInr: 313.6,
      co2SavedKg: 18.2,
      status: 'COMPLETED',
      rating: 5,
    },
    {
      id: 'bk-107',
      hostName: 'Sunita Mehra',
      chargerTitle: 'Sector 18 Cyber Hub Fast Pod',
      location: 'Sector 18, Noida',
      date: '18 Oct 2026',
      energyKwh: 18.0,
      costInr: 252.0,
      co2SavedKg: 14.6,
      status: 'COMPLETED',
      rating: 5,
    },
    {
      id: 'bk-106',
      hostName: 'Vikram Batra',
      chargerTitle: 'Express Trade Towers 7.4 kW Wallbox',
      location: 'Sector 132, Noida',
      date: '15 Oct 2026',
      energyKwh: 25.5,
      costInr: 357.0,
      co2SavedKg: 20.8,
      status: 'COMPLETED',
      rating: 4,
    },
    {
      id: 'bk-105',
      hostName: 'Priya Verma',
      chargerTitle: 'Logix City Centre Solar Charger',
      location: 'Sector 32, Noida',
      date: '12 Oct 2026',
      energyKwh: 16.2,
      costInr: 210.6,
      co2SavedKg: 13.1,
      status: 'COMPLETED',
      rating: 5,
    },
    {
      id: 'bk-104',
      hostName: 'Amit Saxena',
      chargerTitle: 'Advant Navis Community Charger',
      location: 'Sector 142, Noida',
      date: '08 Oct 2026',
      energyKwh: 28.0,
      costInr: 392.0,
      co2SavedKg: 22.7,
      status: 'COMPLETED',
      rating: 5,
    },
    {
      id: 'bk-103',
      hostName: 'Naveen Jindal',
      chargerTitle: 'Great India Place Parking Hub',
      location: 'Sector 38A, Noida',
      date: '04 Oct 2026',
      energyKwh: 30.1,
      costInr: 421.4,
      co2SavedKg: 24.4,
      status: 'COMPLETED',
      rating: 4,
    },
    {
      id: 'bk-102',
      hostName: 'Kavita Das',
      chargerTitle: 'Botanical Garden Metro Park & Charge',
      location: 'Sector 37, Noida',
      date: '28 Sep 2026',
      energyKwh: 14.8,
      costInr: 192.4,
      co2SavedKg: 12.0,
      status: 'COMPLETED',
      rating: 5,
    },
    {
      id: 'bk-101',
      hostName: 'Rajesh Verma',
      chargerTitle: 'Amity University Tech Gate Charger',
      location: 'Sector 125, Noida',
      date: '22 Sep 2026',
      energyKwh: 20.0,
      costInr: 280.0,
      co2SavedKg: 16.2,
      status: 'COMPLETED',
      rating: 5,
    },
  ],
  verifications: {
    drivingLicense: {
      number: 'DL-UP16-2022-009871',
      verified: true,
      validTill: '11 Mar 2044',
    },
    aadhaarKyc: {
      lastFourDigits: '4310',
      verified: true,
    },
    discomMeter: {
      consumerId: 'UP-NOI-DISCOM-883921',
      discomName: 'UPPCL (Paschimanchal Vidyut Vitran Nigam)',
      feederId: 'TX-100-SECTOR-4',
      verified: true,
    },
  },
};

interface SimulationState {
  // Navigation & UI state
  activeTab: ActiveTab;
  activeP0SubPage: P0SubPage;
  previousTab: ActiveTab;
  isModalOpen: boolean;
  selectedVehicleId: string | null;

  // Profile State
  userProfile: UserProfileData;
  activeProfileTab: ProfileTabId;

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
  selectedChargerForBooking: ChargerListing | null;
  bookingStage: 'REVIEW' | 'TRANSMITTING' | 'ACCEPTED' | 'CHARGING' | 'COMPLETED';
  isBookingModalOpen: boolean;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setActiveP0SubPage: (page: P0SubPage) => void;
  setTransformerCapacity: (capacityKw: number) => void;
  setScenario: (scenario: ScenarioPreset) => void;
  toggleVehicleFlexibility: (vehicleId: string) => void;
  updateVehicleSession: (vehicle: EVSessionInput) => void;
  addVehicleSession: (vehicle: EVSessionInput) => void;
  openSessionModal: (vehicleId?: string) => void;
  closeSessionModal: () => void;
  resetSimulation: () => void;

  // Profile Actions
  setActiveProfileTab: (tab: ProfileTabId) => void;
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  updateAddressDetails: (address: Partial<AddressDetails>) => void;
  updateEmergencyContact: (contact: Partial<EmergencyContact>) => void;
  toggleUserVehicleFlexibility: (vehicleId: string) => void;
  openProfileView: () => void;
  navigateBackFromProfile: () => void;

  // P2P Actions
  setP2PQuery: (query: Partial<LowBatterySearchQuery>) => void;
  setP2PSortBy: (sort: 'DISTANCE' | 'PRICE' | 'POWER') => void;
  openBookingModal: (listing: ChargerListing) => void;
  closeBookingModal: () => void;
  setBookingStage: (stage: 'REVIEW' | 'TRANSMITTING' | 'ACCEPTED' | 'CHARGING' | 'COMPLETED') => void;
  advanceBookingStage: () => void;
  toggleNetworkFallback: () => void;
  runSolver: () => void;
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
  activeTab: 'P0_GRID',
  activeP0SubPage: 'PAGE_1_DASHBOARD',
  previousTab: 'P0_GRID',
  isModalOpen: false,
  selectedVehicleId: null,

  // Profile state
  userProfile: INITIAL_USER_PROFILE,
  activeProfileTab: 'PERSONAL',

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
  selectedChargerForBooking: null,
  bookingStage: 'REVIEW',
  isBookingModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveP0SubPage: (page) => set({ activeP0SubPage: page }),

  setActiveProfileTab: (tab) => set({ activeProfileTab: tab }),

  updatePersonalDetails: (details) => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        personal: {
          ...state.userProfile.personal,
          ...details,
        },
      },
    }));
  },

  updateAddressDetails: (address) => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        address: {
          ...state.userProfile.address,
          ...address,
        },
      },
    }));
  },

  updateEmergencyContact: (contact) => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        emergency: {
          ...state.userProfile.emergency,
          ...contact,
        },
      },
    }));
  },

  toggleUserVehicleFlexibility: (vehicleId) => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        vehicles: state.userProfile.vehicles.map((v) =>
          v.id === vehicleId ? { ...v, smartFlexibility: !v.smartFlexibility } : v
        ),
      },
    }));
  },

  openProfileView: () => {
    const { activeTab } = get();
    if (activeTab !== 'PROFILE') {
      set({
        previousTab: activeTab,
        activeTab: 'PROFILE',
        activeP0SubPage: 'PAGE_6_PROFILE',
      });
    }
  },

  navigateBackFromProfile: () => {
    const { previousTab } = get();
    const fallbackTab = previousTab === 'PROFILE' ? 'P0_GRID' : previousTab || 'P0_GRID';
    set({
      activeTab: fallbackTab,
      activeP0SubPage: fallbackTab === 'P0_GRID' ? 'PAGE_1_DASHBOARD' : 'PAGE_1_DASHBOARD',
    });
  },


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
      nextFleet = cloneFleet(SCENARIOS.eveningRush).map((ev: EVSessionInput) => ({
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

  runSolver: () => {
    const { evFleet, backgroundLoad, regionalProfile, transformerConfig } = get();
    const solverOutput = runSmartChargingOptimisation(
      evFleet,
      backgroundLoad,
      transformerConfig,
      regionalProfile
    );
    set({ solverOutput });
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
