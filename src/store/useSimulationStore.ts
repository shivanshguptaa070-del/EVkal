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

import type {
  UserProfileData,
  ProfileTabId,
  PersonalDetails,
  AddressDetails,
  EmergencyContact,
} from '../types/profile';

export type ScenarioPreset = 'EVENING_RUSH' | 'VALLEY_SHIFT' | 'INFEASIBLE_REQUEST';
export type ActiveTab = 'LANDING' | 'P0_GRID' | 'P1_P2P' | 'HOST_DASHBOARD' | 'PROFILE' | 'AUTH';
export type AuthMode = 'SIGN_IN' | 'SIGN_UP' | 'OFFICIAL';
export type P0SubPage =
  | 'PAGE_0_OPTIMIZER'
  | 'PAGE_1_DASHBOARD'
  | 'PAGE_2_FLEET'
  | 'PAGE_3_TARIFF'
  | 'PAGE_4_SCHEDULER'
  | 'PAGE_5_RESULTS'
  | 'PAGE_6_PROFILE';

export type P1SubPage =
  | 'P2P_EXPLORE'
  | 'P2P_EMERGENCY'
  | 'P2P_LIST_CHARGER'
  | 'P2P_BOOKINGS'
  | 'P2P_EARNINGS';


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

export type P2PSubView =
  | 'BROWSE'
  | 'FIND_CHARGERS'
  | 'HOST_DASHBOARD'
  | 'LIST_CHARGER'
  | 'MY_BOOKINGS'
  | 'HOST_EARNINGS'
  | 'MEMBERSHIP';

export interface HostIncomingRequest {
  id: string;
  vehicleName: string;
  driverName: string;
  isCompatible: boolean;
  incompatibleReason?: string;
  timeAgo: string;
  energyNeeded: string;
  requestedDate: string;
  neededBy: string;
  image: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  calculatedEarnings: number;
  chargerHostName: string;
  isLiveDriverSession?: boolean;
}

export const INITIAL_HOST_REQUESTS: HostIncomingRequest[] = [
  {
    id: 'req-1',
    vehicleName: 'Tata Nexon EV Max',
    driverName: 'Vikram Malhotra',
    isCompatible: true,
    timeAgo: '12 mins ago',
    energyNeeded: '28.35 kWh',
    requestedDate: 'Today, 24 Oct 2026',
    neededBy: '07:00 IST',
    image: '/assets/images/nexon_ev.jpg',
    status: 'PENDING',
    calculatedEarnings: 340.20,
    chargerHostName: 'Rajesh K.',
  },
  {
    id: 'req-2',
    vehicleName: 'BYD Atto 3 Superior',
    driverName: 'Rohan Mehra',
    isCompatible: false,
    incompatibleReason:
      'This vehicle may require a CCS2 DC fast-gun connector, which is not supported by your AC Wallbox (Type 2).',
    timeAgo: '1 hour ago',
    energyNeeded: '40.00 kWh',
    requestedDate: 'Today, 24 Oct 2026',
    neededBy: 'Any time',
    image: '/assets/images/byd_atto3_ev.jpg',
    status: 'PENDING',
    calculatedEarnings: 480.00,
    chargerHostName: 'Rajesh K.',
  },
  {
    id: 'req-3',
    vehicleName: 'MG ZS EV Excite',
    driverName: 'Sunita Rao',
    isCompatible: true,
    timeAgo: '3 hours ago',
    energyNeeded: '32.50 kWh',
    requestedDate: 'Fri, 24 Oct 2026',
    neededBy: '14:30 IST',
    image: '/assets/images/mg_zs_ev.jpg',
    status: 'PENDING',
    calculatedEarnings: 390.00,
    chargerHostName: 'Rajesh K.',
  },
  {
    id: 'req-4',
    vehicleName: 'Hyundai Ioniq 5 AWD',
    driverName: 'Ananya Sharma',
    isCompatible: true,
    timeAgo: '5 hours ago',
    energyNeeded: '45.00 kWh',
    requestedDate: 'Sat, 25 Oct 2026',
    neededBy: '18:00 IST',
    image: '/assets/images/ioniq5_ev.jpg',
    status: 'ACCEPTED',
    calculatedEarnings: 540.00,
    chargerHostName: 'Rajesh K.',
  },
  {
    id: 'req-5',
    vehicleName: 'Mahindra XUV400 EL Pro',
    driverName: 'Pradeep Joshi',
    isCompatible: true,
    timeAgo: 'Yesterday',
    energyNeeded: '24.50 kWh',
    requestedDate: 'Sun, 26 Oct 2026',
    neededBy: '09:00 IST',
    image: '/assets/images/xuv400_ev.jpg',
    status: 'PENDING',
    calculatedEarnings: 294.00,
    chargerHostName: 'Rajesh K.',
  },
  {
    id: 'req-6',
    vehicleName: 'Tata Tiago EV Tech Lux',
    driverName: 'Kavita Das',
    isCompatible: true,
    timeAgo: 'Yesterday',
    energyNeeded: '19.20 kWh',
    requestedDate: 'Mon, 27 Oct 2026',
    neededBy: '11:00 IST',
    image: '/assets/images/tiago_ev.jpg',
    status: 'PENDING',
    calculatedEarnings: 230.40,
    chargerHostName: 'Rajesh K.',
  },
];

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
  p2pFilters: P2PFilterState;
  chargerListings: ChargerListing[];
  isListChargerModalOpen: boolean;
  activeP1SubPage: P1SubPage;
  p2pSubView: P2PSubView;
  newlyAddedListingId: string | null;
  selectedChargerForBooking: ChargerListing | null;
  bookingStage: 'REVIEW' | 'TRANSMITTING' | 'ACCEPTED' | 'CHARGING' | 'COMPLETED';
  isBookingModalOpen: boolean;

  // Admin Role & ID (controls access to Admin Grid Optimizer)
  isAdmin: boolean;
  adminId: string;
  setAdminRole: (isAdmin: boolean) => void;
  toggleAdminRole: () => void;

  // Host Authentication state
  isHostAuthenticated: boolean;
  hostEmail: string | null;
  hostLoginError: string | null;
  loginHost: (email: string, pass: string) => boolean;
  logoutHost: () => void;
  clearHostLoginError: () => void;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setActiveP0SubPage: (page: P0SubPage) => void;
  setActiveP1SubPage: (page: P1SubPage) => void;
  setP2PSubView: (view: P2PSubView) => void;
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

  // Authentication State
  isAuthenticated: boolean;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  openAuthView: (mode?: AuthMode) => void;
  navigateBackFromAuth: () => void;
  loginUser: (email?: string, name?: string, role?: 'DRIVER' | 'HOST' | 'ADMIN') => void;
  loginAsAdmin: (adminId?: string, officialEmail?: string) => void;
  logoutUser: () => void;
  // Database Verification Modal
  isDatabaseModalOpen: boolean;
  openDatabaseModal: () => void;
  closeDatabaseModal: () => void;

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
  submitDriverBookingRequest: () => void;
  toggleNetworkFallback: () => void;
  runSolver: () => void;

  // Host Dashboard State & Actions
  hostIncomingRequests: HostIncomingRequest[];
  hostIllustrativeEarnings: number;
  isHostListingPaused: boolean;
  acceptHostIncomingRequest: (requestId: string) => void;
  declineHostIncomingRequest: (requestId: string) => void;
  setIsHostListingPaused: (paused: boolean) => void;
}

// Initial solver execution
const initialFleet = cloneFleet(SCENARIOS.eveningRush);
const initialSolverOutput = runSmartChargingOptimisation(
  initialFleet,
  INITIAL_BACKGROUND,
  INITIAL_CONFIG,
  INITIAL_REGIONAL
);

export const AUTHORIZED_HOST_CREDENTIALS = {
  email: 'shivharshtiwari86017@gmail.com',
  password: 'Shiv@123',
  name: 'Shivharsh Tiwari',
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  activeTab: 'LANDING',
  activeP0SubPage: 'PAGE_1_DASHBOARD',
  previousTab: 'P0_GRID',
  isModalOpen: false,
  selectedVehicleId: null,

  // Profile state
  userProfile: INITIAL_USER_PROFILE,
  activeProfileTab: 'PERSONAL',

  // Authentication state
  isAuthenticated: true,
  authMode: 'SIGN_IN',

  // Host Auth state
  isHostAuthenticated: typeof window !== 'undefined' ? localStorage.getItem('evkal_host_auth') === 'true' : false,
  hostEmail: typeof window !== 'undefined' ? localStorage.getItem('evkal_host_email') : null,
  hostLoginError: null,

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
  activeP1SubPage: 'P2P_EXPLORE',
  p2pSubView: 'FIND_CHARGERS',
  newlyAddedListingId: null,
  selectedChargerForBooking: null,
  bookingStage: 'REVIEW',
  isBookingModalOpen: false,

  // Host Dashboard Initial State
  hostIncomingRequests: INITIAL_HOST_REQUESTS,
  hostIllustrativeEarnings: 3420.00,
  isHostListingPaused: false,

  // Admin Role & ID state
  isAdmin: false, // Default is standard user. Admin access is strictly granted upon Official DISCOM login
  adminId: 'ADM-NOI-DISCOM-01',
  setAdminRole: (isAdmin) => set({ isAdmin }),
  toggleAdminRole: () =>
    set((state) => {
      const nextAdmin = !state.isAdmin;
      const nextSubPage =
        !nextAdmin && state.activeP0SubPage === 'PAGE_0_OPTIMIZER'
          ? 'PAGE_1_DASHBOARD'
          : state.activeP0SubPage;
      return { isAdmin: nextAdmin, activeP0SubPage: nextSubPage };
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveP0SubPage: (page) => set({ activeP0SubPage: page }),
  setActiveP1SubPage: (page) =>
    set({
      activeP1SubPage: page,
      p2pSubView: page === 'P2P_LIST_CHARGER' ? 'LIST_CHARGER' : 'BROWSE',
    }),

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

  setAuthMode: (mode) => set({ authMode: mode }),

  openAuthView: (mode = 'SIGN_IN') => {
    const { activeTab } = get();
    if (activeTab !== 'AUTH') {
      set({
        previousTab: activeTab,
        activeTab: 'AUTH',
        authMode: mode,
      });
    } else {
      set({ authMode: mode });
    }
  },

  navigateBackFromAuth: () => {
    const { previousTab } = get();
    const fallbackTab = previousTab === 'AUTH' ? 'LANDING' : previousTab || 'LANDING';
    set({
      activeTab: fallbackTab,
    });
  },

  loginUser: (email, name, role = 'DRIVER') => {
    const isOfficialAdmin = role === 'ADMIN';
    // Always navigate directly to the Grid & Feeder Dashboard upon login!
    // Never redirect back to LANDING or AUTH.
    set((state) => ({
      isAuthenticated: true,
      isAdmin: isOfficialAdmin,
      activeTab: 'P0_GRID',
      activeP0SubPage: isOfficialAdmin ? 'PAGE_0_OPTIMIZER' : 'PAGE_1_DASHBOARD',
      userProfile: {
        ...state.userProfile,
        personal: {
          ...state.userProfile.personal,
          email: email || state.userProfile.personal.email,
          fullName: name || state.userProfile.personal.fullName,
          accountType: isOfficialAdmin ? 'DISCOM Grid Admin' : 'Individual',
        },
      },
    }));
  },

  loginAsAdmin: (adminId = 'ADM-NOI-DISCOM-01', officialEmail = 'admin@uppcl-grid.gov.in') => {
    set((state) => ({
      isAuthenticated: true,
      isAdmin: true,
      adminId,
      activeTab: 'P0_GRID',
      activeP0SubPage: 'PAGE_0_OPTIMIZER',
      userProfile: {
        ...state.userProfile,
        personal: {
          ...state.userProfile.personal,
          fullName: 'DISCOM Chief Feeder Engineer',
          email: officialEmail,
          accountType: 'DISCOM Grid Admin',
        },
      },
    }));
  },

  logoutUser: () => {
    try {
      import('../lib/supabase').then(({ supabase }) => {
        supabase.auth.signOut().catch(() => {});
      });
    } catch {
      // ignore
    }
    set({
      isAuthenticated: false,
      isAdmin: false,
      activeTab: 'AUTH',
      authMode: 'SIGN_IN',
    });
  },

  // Supabase Database Verification Modal state
  isDatabaseModalOpen: false,
  openDatabaseModal: () => set({ isDatabaseModalOpen: true }),
  closeDatabaseModal: () => set({ isDatabaseModalOpen: false }),


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

  openListChargerModal: () =>
    set({
      isListChargerModalOpen: false,
      p2pSubView: 'LIST_CHARGER',
      activeP1SubPage: 'P2P_LIST_CHARGER',
    }),
  closeListChargerModal: () =>
    set({
      isListChargerModalOpen: false,
      p2pSubView: 'FIND_CHARGERS',
      activeP1SubPage: 'P2P_EXPLORE',
    }),
  setP2PSubView: (view) =>
    set({
      isListChargerModalOpen: false,
      p2pSubView: view,
      activeP1SubPage:
        view === 'LIST_CHARGER'
          ? 'P2P_LIST_CHARGER'
          : view === 'MY_BOOKINGS'
          ? 'P2P_BOOKINGS'
          : view === 'HOST_EARNINGS'
          ? 'P2P_EARNINGS'
          : 'P2P_EXPLORE',
    }),

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
    const sequence: ('REVIEW' | 'ACCEPTED' | 'CHARGING' | 'COMPLETED')[] = [
      'REVIEW',
      'ACCEPTED',
      'CHARGING',
      'COMPLETED',
    ];
    if ((bookingStage as string) === 'TRANSMITTING') {
      set({ bookingStage: 'ACCEPTED' });
      return;
    }
    const currentIndex = sequence.indexOf(bookingStage as any);
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      set({ bookingStage: sequence[currentIndex + 1] });
    }
  },

  submitDriverBookingRequest: () => {
    const { p2pQuery, selectedChargerForBooking, userProfile } = get();
    const neededKwh = p2pQuery.vehicleBatteryPct
      ? Number((60 * (1 - p2pQuery.vehicleBatteryPct / 100)).toFixed(1))
      : 28.35;
    const pricePerKwh = selectedChargerForBooking?.pricePerKwhInr || 11.50;
    const earnings = Number((neededKwh * pricePerKwh).toFixed(2));
    const vehicleModel = userProfile.vehicles[0]?.model || 'Tata Nexon EV Max';

    const liveRequest: HostIncomingRequest = {
      id: `req-live-${Date.now()}`,
      vehicleName: `${vehicleModel} (You / Connected Driver)`,
      driverName: userProfile.personal.fullName || 'Shivharsh Tripathi (You)',
      isCompatible: true,
      timeAgo: 'Just now',
      energyNeeded: `${neededKwh} kWh`,
      requestedDate: 'Today, 24 Oct 2026',
      neededBy: 'Immediate / Urgent Slot',
      image: '/assets/images/nexon_ev.jpg',
      status: 'ACCEPTED',
      calculatedEarnings: earnings,
      chargerHostName: selectedChargerForBooking?.hostName || 'Rajesh K.',
      isLiveDriverSession: true,
    };

    set((state) => ({
      bookingStage: 'ACCEPTED',
      hostIncomingRequests: [
        liveRequest,
        ...state.hostIncomingRequests.filter((r) => !r.isLiveDriverSession),
      ],
    }));
  },

  acceptHostIncomingRequest: (requestId: string) => {
    const { hostIncomingRequests, hostIllustrativeEarnings, bookingStage } = get();
    const target = hostIncomingRequests.find((r) => r.id === requestId);
    if (!target) return;

    const nextEarnings = Number((hostIllustrativeEarnings + target.calculatedEarnings).toFixed(2));
    const nextRequests = hostIncomingRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'ACCEPTED' as const } : r
    );

    // If accepting live driver session or if bookingStage is currently TRANSMITTING, advance driver to ACCEPTED
    const shouldAdvanceDriver = target.isLiveDriverSession || bookingStage === 'TRANSMITTING';

    set({
      hostIncomingRequests: nextRequests,
      hostIllustrativeEarnings: nextEarnings,
      ...(shouldAdvanceDriver ? { bookingStage: 'ACCEPTED' } : {}),
    });
  },

  declineHostIncomingRequest: (requestId: string) => {
    const { hostIncomingRequests } = get();
    const nextRequests = hostIncomingRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'DECLINED' as const } : r
    );
    set({
      hostIncomingRequests: nextRequests,
    });
  },

  setIsHostListingPaused: (paused: boolean) => set({ isHostListingPaused: paused }),

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

  loginHost: (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (
      cleanEmail === AUTHORIZED_HOST_CREDENTIALS.email.toLowerCase() &&
      cleanPass === AUTHORIZED_HOST_CREDENTIALS.password
    ) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('evkal_host_auth', 'true');
        localStorage.setItem('evkal_host_email', AUTHORIZED_HOST_CREDENTIALS.email);
      }
      set({
        isHostAuthenticated: true,
        hostEmail: AUTHORIZED_HOST_CREDENTIALS.email,
        hostLoginError: null,
      });
      return true;
    } else {
      set({
        hostLoginError:
          'Access Denied: Invalid Host Credentials. Only shivharshtiwari86017@gmail.com with the authorized password can access the Host Portal.',
      });
      return false;
    }
  },

  logoutHost: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('evkal_host_auth');
      localStorage.removeItem('evkal_host_email');
    }
    set({
      isHostAuthenticated: false,
      hostEmail: null,
      hostLoginError: null,
    });
  },

  clearHostLoginError: () => set({ hostLoginError: null }),
}));
