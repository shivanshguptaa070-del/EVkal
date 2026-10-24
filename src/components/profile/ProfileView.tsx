import { useState } from 'react';
import {
  User,
  Car,
  ShieldCheck,
  Shield,
  CheckCircle2,
  Mail,
  Phone,
  Camera,
  Edit2,
  Calendar,
  ChevronDown,
  MapPin,
  Check,
  X,
  Zap,
  Leaf,
  ArrowRight,
  Lock,
  Smartphone,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { getUserInitials } from '../../utils/userInitials';

export function ProfileView() {
  const {
    userProfile,
    activeProfileTab,
    setActiveProfileTab,
    updatePersonalDetails,
    updateAddressDetails,
    updateEmergencyContact,
    toggleUserVehicleFlexibility,
    navigateBackFromProfile,
    setActiveP0SubPage,
    setActiveTab,
  } = useSimulationStore();

  // Edit states for the 3 personal details cards
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState(userProfile.personal);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(userProfile.address);

  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState(userProfile.emergency);

  // Success toast indicator
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSavePersonal = () => {
    updatePersonalDetails(personalForm);
    setIsEditingPersonal(false);
    showToast('Personal information updated successfully!');
  };

  const handleCancelPersonal = () => {
    setPersonalForm(userProfile.personal);
    setIsEditingPersonal(false);
  };

  const handleSaveAddress = () => {
    updateAddressDetails(addressForm);
    setIsEditingAddress(false);
    showToast('Address details updated successfully!');
  };

  const handleCancelAddress = () => {
    setAddressForm(userProfile.address);
    setIsEditingAddress(false);
  };

  const handleSaveEmergency = () => {
    updateEmergencyContact(emergencyForm);
    setIsEditingEmergency(false);
    showToast('Emergency contact updated successfully!');
  };

  const handleCancelEmergency = () => {
    setEmergencyForm(userProfile.emergency);
    setIsEditingEmergency(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-12 font-sans">
      {/* Toast Alert Notification */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-xl animate-bounce">
          <CheckCircle2 className="h-4 w-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={navigateBackFromProfile}
          className="hover:text-emerald-600 transition-colors cursor-pointer"
        >
          Dashboard
        </button>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-900 font-bold">Profile</span>
      </div>

      {/* Profile Top Tab Navigation (Matching Reference Screenshot) */}
      <div className="border-b border-slate-200/90 flex items-center gap-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveProfileTab('PERSONAL')}
          className={`flex items-center gap-2.5 pb-3.5 px-1 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
            activeProfileTab === 'PERSONAL'
              ? 'text-emerald-600 border-b-2 border-emerald-500'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Personal Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveProfileTab('VEHICLES')}
          className={`flex items-center gap-2.5 pb-3.5 px-1 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
            activeProfileTab === 'VEHICLES'
              ? 'text-emerald-600 border-b-2 border-emerald-500'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="h-4 w-4" />
          <span>My Vehicles</span>
          <span className="h-5 px-1.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
            2
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveProfileTab('VERIFICATION')}
          className={`flex items-center gap-2.5 pb-3.5 px-1 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
            activeProfileTab === 'VERIFICATION'
              ? 'text-emerald-600 border-b-2 border-emerald-500'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Identity Verification</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        <button
          type="button"
          onClick={() => setActiveProfileTab('SECURITY')}
          className={`flex items-center gap-2.5 pb-3.5 px-1 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
            activeProfileTab === 'SECURITY'
              ? 'text-emerald-600 border-b-2 border-emerald-500'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Account &amp; Security</span>
        </button>
      </div>

      {/* Profile Header Hero Card (Matching Reference Screenshot) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar with emerald ring & camera button */}
          <div className="relative shrink-0">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-3 ring-emerald-500 ring-offset-2 overflow-hidden bg-slate-100 shadow-md">
              <img
                src={userProfile.personal.avatarUrl}
                alt={userProfile.personal.fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image path fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="h-full w-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-2xl font-black">
                {getUserInitials(userProfile.personal.fullName)}
              </div>
            </div>

            {/* Camera Overlay Icon */}
            <button
              type="button"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#00A86B] text-white flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors border-2 border-white cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* User Name & Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {userProfile.personal.fullName}
              </h1>
              <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              EVkal Member &bull; EV Driver &amp; P2P Host
            </p>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {userProfile.personal.bio}
            </p>

            {/* Email & Phone Contact Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{userProfile.personal.email}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{userProfile.personal.mobileNumber}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stats Box (Matching Reference Light Mint Pill) */}
        <div className="shrink-0 bg-[#E8F8F0] border border-emerald-200/80 rounded-2xl px-5 py-4 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 shadow-xs">
          {/* Vehicles Stat */}
          <div className="flex items-center gap-2.5">
            <div className="text-emerald-700">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {userProfile.stats.vehiclesCount}
              </div>
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Vehicles
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-emerald-200" />

          {/* Bookings Stat */}
          <div className="flex items-center gap-2.5">
            <div className="text-emerald-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {userProfile.stats.bookingsCount}
              </div>
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Bookings
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-emerald-200" />

          {/* My Charger Stat */}
          <div className="flex items-center gap-2.5">
            <div className="text-emerald-700">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {userProfile.stats.chargersCount}
              </div>
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                My Charger
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-emerald-200" />

          {/* CO2 Saved Stat */}
          <div className="flex items-center gap-2.5">
            <div className="text-emerald-700">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-emerald-800 leading-tight">
                {userProfile.stats.co2SavedKg} kg
              </div>
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                CO₂ Saved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PERSONAL DETAILS (MATCHING REFERENCE EXACTLY) */}
      {/* ======================================================== */}
      {activeProfileTab === 'PERSONAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Personal Information (7 Cols) */}
          <section className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              </div>

              {!isEditingPersonal ? (
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(true)}
                  className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Edit Personal Information"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelPersonal}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePersonal}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields Table/Grid */}
            <div className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center py-1">
                <span className="font-semibold text-slate-500">Full Name</span>
                <div className="sm:col-span-2">
                  {isEditingPersonal ? (
                    <input
                      type="text"
                      value={personalForm.fullName}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-semibold text-slate-800">
                      {userProfile.personal.fullName}
                    </div>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center py-1">
                <span className="font-semibold text-slate-500">Date of Birth</span>
                <div className="sm:col-span-2 relative">
                  {isEditingPersonal ? (
                    <input
                      type="text"
                      value={personalForm.dateOfBirth}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                    />
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                      <span>{userProfile.personal.dateOfBirth}</span>
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center py-1">
                <span className="font-semibold text-slate-500">Gender</span>
                <div className="sm:col-span-2 relative">
                  {isEditingPersonal ? (
                    <select
                      value={personalForm.gender}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          gender: e.target.value as 'Male' | 'Female' | 'Other' | 'Prefer not to say',
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                      <span>{userProfile.personal.gender}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center py-1">
                <span className="font-semibold text-slate-500">Email Address</span>
                <div className="sm:col-span-2 relative">
                  {isEditingPersonal ? (
                    <input
                      type="email"
                      value={personalForm.email}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                    />
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                      <span>{userProfile.personal.email}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center py-1">
                <span className="font-semibold text-slate-500">Mobile Number</span>
                <div className="sm:col-span-2 relative">
                  {isEditingPersonal ? (
                    <input
                      type="tel"
                      value={personalForm.mobileNumber}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, mobileNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                    />
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                      <span>{userProfile.personal.mobileNumber}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alternate Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center py-1">
                <span className="font-semibold text-slate-500">Alternate Number</span>
                <div className="sm:col-span-2">
                  {isEditingPersonal ? (
                    <input
                      type="tel"
                      value={personalForm.alternateNumber}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, alternateNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                    />
                  ) : (
                    <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                      {userProfile.personal.alternateNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Account Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center py-1">
                <span className="font-semibold text-slate-500">Account Type</span>
                <div className="sm:col-span-2 relative">
                  {isEditingPersonal ? (
                    <select
                      value={personalForm.accountType}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          accountType: e.target.value as 'Individual' | 'Commercial Fleet' | 'Host & Driver',
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 bg-white"
                    >
                      <option value="Individual">Individual</option>
                      <option value="Commercial Fleet">Commercial Fleet</option>
                      <option value="Host & Driver">Host &amp; Driver</option>
                    </select>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                      <span>{userProfile.personal.accountType}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1">
                <span className="font-semibold text-slate-500 pt-2">Bio</span>
                <div className="sm:col-span-2">
                  {isEditingPersonal ? (
                    <div>
                      <textarea
                        rows={3}
                        maxLength={200}
                        value={personalForm.bio}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, bio: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 text-xs resize-none"
                      />
                      <div className="text-right text-[10px] text-slate-400 font-medium">
                        {personalForm.bio.length}/200
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-700 min-h-[56px]">
                        {userProfile.personal.bio}
                      </div>
                      <div className="text-right text-[10px] text-slate-400 font-medium mt-1">
                        {userProfile.personal.bio.length}/200
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Address Information + Emergency Contact (5.5 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Address Information Card */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Address Information</h2>
                </div>

                {!isEditingAddress ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelAddress}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Address Form Fields */}
              <div className="space-y-3 text-xs">
                {/* Line 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">Address Line 1</span>
                  <div className="sm:col-span-2">
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={addressForm.addressLine1}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, addressLine1: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        {userProfile.address.addressLine1}
                      </div>
                    )}
                  </div>
                </div>

                {/* Line 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">Address Line 2</span>
                  <div className="sm:col-span-2">
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, addressLine2: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        {userProfile.address.addressLine2}
                      </div>
                    )}
                  </div>
                </div>

                {/* City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">City</span>
                  <div className="sm:col-span-2">
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        {userProfile.address.city}
                      </div>
                    )}
                  </div>
                </div>

                {/* PIN Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">PIN Code</span>
                  <div className="sm:col-span-2">
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={addressForm.pinCode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, pinCode: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        {userProfile.address.pinCode}
                      </div>
                    )}
                  </div>
                </div>

                {/* District */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">District</span>
                  <div className="sm:col-span-2">
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={addressForm.district}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, district: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        {userProfile.address.district}
                      </div>
                    )}
                  </div>
                </div>

                {/* State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">State</span>
                  <div className="sm:col-span-2 relative">
                    {isEditingAddress ? (
                      <select
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 bg-white"
                      >
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                    ) : (
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        <span>{userProfile.address.state}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Emergency Contact Card */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Emergency Contact</h2>
                </div>

                {!isEditingEmergency ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingEmergency(true)}
                    className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Edit Emergency Contact"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEmergency}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEmergency}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Emergency Contact Fields */}
              <div className="space-y-3 text-xs">
                {/* Contact Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">Contact Name</span>
                  <div className="sm:col-span-2">
                    {isEditingEmergency ? (
                      <input
                        type="text"
                        value={emergencyForm.contactName}
                        onChange={(e) =>
                          setEmergencyForm({ ...emergencyForm, contactName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        {userProfile.emergency.contactName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Relationship */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">Relationship</span>
                  <div className="sm:col-span-2 relative">
                    {isEditingEmergency ? (
                      <select
                        value={emergencyForm.relationship}
                        onChange={(e) =>
                          setEmergencyForm({
                            ...emergencyForm,
                            relationship: e.target.value as 'Father' | 'Mother' | 'Spouse' | 'Sibling' | 'Guardian' | 'Other',
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        <span>{userProfile.emergency.relationship}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:items-center">
                  <span className="font-semibold text-slate-500">Contact Number</span>
                  <div className="sm:col-span-2">
                    {isEditingEmergency ? (
                      <input
                        type="tel"
                        value={emergencyForm.contactNumber}
                        onChange={(e) =>
                          setEmergencyForm({ ...emergencyForm, contactNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-200/70 font-medium text-slate-800">
                        {userProfile.emergency.contactNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MY VEHICLES (P0 SMART GRID INTEGRATION) */}
      {/* ======================================================== */}
      {activeProfileTab === 'VEHICLES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-950 text-white p-5 rounded-3xl border border-emerald-900/60 shadow-lg">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                P0 Grid Optimization Fleet
              </div>
              <h2 className="text-lg font-bold">Registered EV Fleet ({userProfile.vehicles.length})</h2>
              <p className="text-xs text-emerald-300/80 max-w-xl">
                These vehicles participate in automated smart charging on Feeder Transformer <code>TX-100-SECTOR-4</code> to prevent local peak overloads.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('P0_GRID');
                setActiveP0SubPage('PAGE_4_SCHEDULER');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <span>Open P0 Smart Scheduler</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProfile.vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">{v.model}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                        {v.regNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>Connector: <strong className="text-slate-800 font-semibold">{v.connectorType}</strong></span>
                      &bull;
                      <span>Battery: <strong className="text-slate-800 font-semibold">{v.batteryCapacityKwh} kWh</strong></span>
                    </div>
                  </div>

                  <span className="h-7 px-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center">
                    {v.currentSocPct}% SOC
                  </span>
                </div>

                {/* Progress SOC Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Live Battery Charge</span>
                    <span>Target: {v.targetSocPct}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${v.currentSocPct}%` }}
                    />
                  </div>
                </div>

                {/* Grid Flexibility Card Controls */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800">Smart Charging Flexibility</div>
                      <div className="text-[11px] text-slate-500">
                        Allow P0 solver to shift charging to off-peak tariff (₹4.80 vs ₹11.20)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleUserVehicleFlexibility(v.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        v.smartFlexibility ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          v.smartFlexibility ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Departure Time: <strong>{v.dailyDepartureTime} AM</strong></span>
                    <span>Max Charging: <strong>{v.maxChargeRateKw} kW</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: IDENTITY VERIFICATION (P0 & P1 TRUST) */}
      {/* ======================================================== */}
      {activeProfileTab === 'VERIFICATION' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Verified Credentials &amp; KYC</h2>
                <p className="text-xs text-slate-500">
                  Government-issued identification verified for trusted P2P Community Sharing and grid-tied feeder safety.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Tier 2 Fully Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Driving License */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    DL
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Driving License (UP)</div>
                  <div className="font-mono text-xs font-bold text-slate-700 mt-0.5">
                    {userProfile.verifications.drivingLicense.number}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Valid till: {userProfile.verifications.drivingLicense.validTill}
                  </div>
                </div>
              </div>

              {/* Aadhaar KYC */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                    ID
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">National ID (Aadhaar)</div>
                  <div className="font-mono text-xs font-bold text-slate-700 mt-0.5">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {userProfile.verifications.aadhaarKyc.lastFourDigits}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    UIDAI eKYC Instant Hash Match
                  </div>
                </div>
              </div>

              {/* DISCOM Feeder Electricity Meter */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                    TX
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Grid Tied
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">DISCOM Consumer Meter</div>
                  <div className="font-mono text-xs font-bold text-slate-700 mt-0.5">
                    {userProfile.verifications.discomMeter.consumerId}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Node: {userProfile.verifications.discomMeter.feederId} &bull; UPPCL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ACCOUNT & SECURITY (P1 HOST & RECENT BOOKINGS) */}
      {/* ======================================================== */}
      {activeProfileTab === 'SECURITY' && (
        <div className="space-y-6">
          {/* P1 Shared Wallbox Host Details */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">P1 Community Charger Listing</h2>
                  <p className="text-xs text-slate-500">
                    Your residential wallbox available for nearby EV drivers when idle
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('P1_P2P')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <span>Switch to P2P Sharing View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Charger Model &amp; Power</span>
                <div className="text-slate-900 font-bold mt-1 text-sm">
                  {userProfile.hostCharger.powerKw} kW ({userProfile.hostCharger.connector})
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Current Tariff Rate</span>
                <div className="text-emerald-700 font-bold mt-1 text-sm">
                  ₹{userProfile.hostCharger.pricePerKwh.toFixed(2)} / kWh
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Availability Window</span>
                <div className="text-slate-900 font-bold mt-1">
                  {userProfile.hostCharger.availability}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Host Earnings This Month</span>
                <div className="text-slate-900 font-bold mt-1 text-sm">
                  ₹{userProfile.hostCharger.earningsThisMonthInr} ({userProfile.hostCharger.totalSessionsHosted} sessions)
                </div>
              </div>
            </div>
          </div>

          {/* Past Bookings Log (8 Completed Sessions) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Recent P2P Charging Sessions ({userProfile.bookings.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Noida &bull; Delhi NCR</span>
            </div>

            <div className="divide-y divide-slate-100">
              {userProfile.bookings.map((b) => (
                <div
                  key={b.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">{b.chargerTitle}</div>
                    <div className="text-slate-500 flex items-center gap-2">
                      <span>Host: {b.hostName}</span>
                      &bull;
                      <span>{b.location}</span>
                      &bull;
                      <span>{b.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <div className="font-bold text-slate-800">{b.energyKwh} kWh</div>
                      <div className="text-emerald-700 font-bold">₹{b.costInr.toFixed(1)}</div>
                    </div>

                    <div className="h-6 px-2.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] flex items-center justify-center border border-emerald-200/60">
                      -{b.co2SavedKg} kg CO₂
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Credentials & 2FA */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="h-4 w-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Account Security</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-slate-500" />
                  <div>
                    <div className="font-bold text-slate-900">Two-Factor Authentication (2FA)</div>
                    <div className="text-slate-500 text-[11px]">Active on mobile (+91 98765 43210)</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
