export type ProfileTabId = 'PERSONAL' | 'VEHICLES' | 'VERIFICATION' | 'SECURITY';

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string; // e.g. "12 Mar 2004"
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  email: string;
  isEmailVerified: boolean;
  mobileNumber: string;
  isMobileVerified: boolean;
  alternateNumber: string;
  accountType: 'Individual' | 'Commercial Fleet' | 'Host & Driver' | 'DISCOM Grid Admin';
  bio: string;
  avatarUrl: string;
}

export interface AddressDetails {
  addressLine1: string;
  addressLine2: string;
  city: string;
  pinCode: string;
  district: string;
  state: string;
}

export interface EmergencyContact {
  contactName: string;
  relationship: 'Father' | 'Mother' | 'Spouse' | 'Sibling' | 'Guardian' | 'Other';
  contactNumber: string;
}

export interface UserRegisteredVehicle {
  id: string;
  model: string;
  regNumber: string;
  batteryCapacityKwh: number;
  currentSocPct: number;
  maxChargeRateKw: number;
  connectorType: 'CCS2' | 'TYPE_2' | 'GB/T' | 'CHADEMO';
  smartFlexibility: boolean;
  targetSocPct: number;
  dailyDepartureTime: string;
  assignedFeederId: string;
  image?: string;
}

export interface UserBookingRecord {
  id: string;
  hostName: string;
  chargerTitle: string;
  location: string;
  date: string;
  energyKwh: number;
  costInr: number;
  co2SavedKg: number;
  status: 'COMPLETED' | 'CONFIRMED' | 'IN_PROGRESS';
  rating: number;
}

export interface UserHostChargerDetails {
  id: string;
  title: string;
  address: string;
  powerKw: number;
  connector: 'TYPE_2' | 'CCS2';
  pricePerKwh: number;
  availability: string;
  smartGridSync: boolean;
  activeStatus: boolean;
  earningsThisMonthInr: number;
  totalSessionsHosted: number;
}

export interface UserVerifications {
  drivingLicense: {
    number: string;
    verified: boolean;
    validTill: string;
  };
  aadhaarKyc: {
    lastFourDigits: string;
    verified: boolean;
  };
  discomMeter: {
    consumerId: string;
    discomName: string;
    feederId: string;
    verified: boolean;
  };
}

export interface UserProfileData {
  personal: PersonalDetails;
  address: AddressDetails;
  emergency: EmergencyContact;
  vehicles: UserRegisteredVehicle[];
  bookings: UserBookingRecord[];
  hostCharger: UserHostChargerDetails;
  verifications: UserVerifications;
  stats: {
    vehiclesCount: number;
    bookingsCount: number;
    chargersCount: number;
    co2SavedKg: number;
  };
}
