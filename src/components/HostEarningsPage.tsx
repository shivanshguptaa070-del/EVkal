import { useState } from 'react';
import {
  Wallet,
  PieChart,
  Calendar,
  Plus,
  Info,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  Download,
  Settings,
  Lock,
  ShieldCheck,
  LogOut,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { getUserInitials } from '../utils/userInitials';

interface HostChargerItem {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Inactive';
  sessions: number;
  earnings: number;
  net: number;
  image: string;
  specs: string;
}

interface RecentSession {
  id: string;
  dateStr: string;
  timeSlot: string;
  driverName: string;
  vehicleModel: string;
  vehicleImage: string;
  chargerName: string;
  specs: string;
  duration: string;
  grossAmount: number;
  commission: number;
  netEarnings: number;
  energyKwh: number;
  status: 'Completed';
}

const INITIAL_CHARGERS: HostChargerItem[] = [
  {
    id: 'CHG-1',
    name: 'Home Charger',
    location: 'Saket Block J, New Delhi',
    status: 'Active',
    sessions: 8,
    earnings: 1920,
    net: 1766,
    image: '/assets/images/shivharsh_villa.jpg',
    specs: 'Type 2 AC · 11 kW',
  },
  {
    id: 'CHG-2',
    name: 'Office Charger',
    location: 'Vasant Kunj, New Delhi',
    status: 'Inactive',
    sessions: 4,
    earnings: 960,
    net: 884,
    image: '/assets/images/dr_neha_villa.jpg',
    specs: 'Type 2 AC · 7.4 kW',
  },
];

const RECENT_SESSIONS: RecentSession[] = [
  {
    id: 'SESS-101',
    dateStr: '18 Oct 2026',
    timeSlot: '18:00 – 20:00',
    driverName: 'Rahul Mehta',
    vehicleModel: 'Tata Nexon EV',
    vehicleImage: '/assets/images/nexon_ev.jpg',
    chargerName: 'Home Charger',
    specs: 'Type 2 AC · 11 kW',
    duration: '2h',
    grossAmount: 240,
    commission: 20,
    netEarnings: 220,
    energyKwh: 20.0,
    status: 'Completed',
  },
  {
    id: 'SESS-102',
    dateStr: '15 Oct 2026',
    timeSlot: '08:00 – 10:00',
    driverName: 'Priya Singh',
    vehicleModel: 'MG ZS EV',
    vehicleImage: '/assets/images/mg_zs_ev.jpg',
    chargerName: 'Home Charger',
    specs: 'Type 2 AC · 11 kW',
    duration: '2h',
    grossAmount: 240,
    commission: 20,
    netEarnings: 220,
    energyKwh: 20.0,
    status: 'Completed',
  },
  {
    id: 'SESS-103',
    dateStr: '12 Oct 2026',
    timeSlot: '19:00 – 21:00',
    driverName: 'Amit Verma',
    vehicleModel: 'Hyundai Kona',
    vehicleImage: '/assets/images/hyundai_kona.jpg',
    chargerName: 'Home Charger',
    specs: 'Type 2 AC · 11 kW',
    duration: '2h',
    grossAmount: 240,
    commission: 20,
    netEarnings: 220,
    energyKwh: 20.0,
    status: 'Completed',
  },
  {
    id: 'SESS-104',
    dateStr: '09 Oct 2026',
    timeSlot: '11:00 – 13:00',
    driverName: 'Deepak Sharma',
    vehicleModel: 'Mahindra XUV400',
    vehicleImage: '/assets/images/nexon_ev.jpg',
    chargerName: 'Office Charger',
    specs: 'Type 2 AC · 7.4 kW',
    duration: '2h',
    grossAmount: 240,
    commission: 20,
    netEarnings: 220,
    energyKwh: 15.0,
    status: 'Completed',
  },
];

export function HostEarningsPage() {
  const {
    setP2PSubView,
    isHostAuthenticated,
    hostEmail,
    hostLoginError,
    loginHost,
    logoutHost,
    clearHostLoginError,
    userProfile,
  } = useSimulationStore();

  const hostDisplayName = userProfile?.personal?.fullName || 'Shivharsh Tiwari';
  const hostInitials = getUserInitials(hostDisplayName);

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const [timeRange, setTimeRange] = useState<'6M' | '3M' | '1Y'>('6M');
  const [chargers, setChargers] = useState<HostChargerItem[]>(INITIAL_CHARGERS);
  const [selectedSession, setSelectedSession] = useState<RecentSession | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monthly data options for 3M, 6M, and 1Y
  const ALL_MONTHLY_DATA = [
    { month: 'Nov', net: 1800, commission: 220, total: 2020 },
    { month: 'Dec', net: 2100, commission: 260, total: 2360 },
    { month: 'Jan', net: 2200, commission: 280, total: 2480 },
    { month: 'Feb', net: 2400, commission: 300, total: 2700 },
    { month: 'Mar', net: 2500, commission: 320, total: 2820 },
    { month: 'Apr', net: 2700, commission: 350, total: 3050 },
    { month: 'May', net: 2600, commission: 340, total: 2940 },
    { month: 'Jun', net: 3100, commission: 410, total: 3510 },
    { month: 'Jul', net: 4200, commission: 550, total: 4750 },
    { month: 'Aug', net: 4800, commission: 630, total: 5430 },
    { month: 'Sep', net: 5100, commission: 670, total: 5770 },
    { month: 'Oct', net: 6400, commission: 840, total: 7240 },
  ];

  const displayedData =
    timeRange === '3M'
      ? ALL_MONTHLY_DATA.slice(-3)
      : timeRange === '6M'
      ? ALL_MONTHLY_DATA.slice(-6)
      : ALL_MONTHLY_DATA;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleHostLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    clearHostLoginError();

    setTimeout(() => {
      const success = loginHost(inputEmail, inputPassword);
      setIsSubmittingLogin(false);
      if (success) {
        showToast('Welcome back, Shivharsh! Host Dashboard unlocked.');
      }
    }, 350);
  };

  const handleToggleCharger = (chargerId: string) => {
    setChargers((prev) =>
      prev.map((c) => {
        if (c.id === chargerId) {
          const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
          showToast(`${c.name} is now ${nextStatus}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  // If NOT authenticated, show the secure Host Login Portal
  if (!isHostAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 animate-fade-in space-y-5">
        <button
          type="button"
          onClick={() => setP2PSubView('FIND_CHARGERS')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Public Chargers</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-100">
              <Lock className="h-8 w-8" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Protected Host Portal</span>
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Host Dashboard Login
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mt-1">
                Access to private charger revenue, bank settlements, and charger hardware controls is restricted strictly to the verified host.
              </p>
            </div>
          </div>

          {hostLoginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{hostLoginError}</span>
            </div>
          )}

          <form onSubmit={handleHostLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Host Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    if (hostLoginError) clearHostLoginError();
                  }}
                  placeholder="shivharshtiwari86017@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Host Security Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    if (hostLoginError) clearHostLoginError();
                  }}
                  placeholder="Enter host password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-black rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmittingLogin ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Authorize &amp; Access Host Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper for Testing Convenience */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Authorized Host Credentials:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setInputEmail('shivharshtiwari86017@gmail.com');
                  setInputPassword('Shiv@123');
                  clearHostLoginError();
                }}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Auto-fill Login
              </button>
            </div>
            <div className="text-[10px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
              <div>Email: <strong className="text-slate-900">shivharshtiwari86017@gmail.com</strong></div>
              <div>Password: <strong className="text-slate-900">Shiv@123</strong></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // When Authenticated: Render Full Host Dashboard with Host Profile Bar
  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 0. Authenticated Host Badge & Logout Header */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-emerald-50/90 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#059669] text-white flex items-center justify-center font-black text-sm shadow-xs">
            {hostInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">{hostDisplayName}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[10px] font-extrabold">
                <ShieldCheck className="h-3 w-3 text-emerald-700" />
                <span>Verified Host</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Authorized Account: <span className="font-bold text-slate-800">{hostEmail || 'shivharshtiwari86017@gmail.com'}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logoutHost();
            showToast('Logged out from Host Dashboard.');
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer w-fit shadow-2xs"
          title="Logout from host session"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout Host</span>
        </button>
      </div>

      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Host Dashboard &amp; Earnings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Private manager for your chargers, platform facilitation fees, and revenue settlements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setP2PSubView('LIST_CHARGER')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>List Another Charger</span>
        </button>
      </div>

      {/* 2. Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Earnings */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shadow-2xs">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <span>Total Earnings</span>
              <Info className="h-3.5 w-3.5 text-slate-300" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹4,662
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#059669] mt-0.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: EVkal Commission */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-[#3B82F6] flex items-center justify-center shadow-2xs">
              <PieChart className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <span>EVkal Commission</span>
              <Info className="h-3.5 w-3.5 text-slate-300" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹532
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              ~8% platform facilitation fee
            </p>
          </div>
        </div>

        {/* KPI 3: Net Earnings */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shadow-2xs">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <span>Net Earnings</span>
              <Info className="h-3.5 w-3.5 text-slate-300" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹4,130
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              To be settled on 31 Oct 2026
            </p>
          </div>
        </div>

        {/* KPI 4: Total Sessions */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <span>Total Sessions</span>
              <Info className="h-3.5 w-3.5 text-slate-300" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              12
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#059669] mt-0.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+3 from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Earnings Overview Stacked Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Earnings Overview
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Your monthly earnings and commission.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                  <span>Net Earnings</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                  <span>Commission</span>
                </span>
              </div>

              {/* Range Select */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer shadow-2xs hover:bg-slate-100 transition-colors"
                >
                  <option value="6M">Last 6 Months</option>
                  <option value="3M">Last 3 Months</option>
                  <option value="1Y">Last Year</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stacked Bar Chart Graphic */}
          <div className="w-full pt-4 space-y-2">
            {/* Chart Graphic: Y-Axis + Bars */}
            <div className="flex gap-2 sm:gap-4 h-52">
              {/* Y-Axis Labels */}
              <div className="w-8 sm:w-10 flex flex-col justify-between items-end pb-1 text-[11px] font-medium text-slate-400 select-none">
                <span>₹8K</span>
                <span>₹6K</span>
                <span>₹4K</span>
                <span>₹2K</span>
                <span>0</span>
              </div>

              {/* Chart Grid and Bars Area */}
              <div className="flex-1 relative border-b border-slate-200">
                {/* 5 Horizontal Gridlines aligned with Y-axis */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-transparent w-full" />
                </div>

                {/* Stacked Bars container */}
                <div className="relative z-10 h-full flex items-end justify-around px-2 sm:px-4">
                  {displayedData.map((d) => {
                    const totalHeightPct = Math.min(100, Math.max(6, (d.total / 8000) * 100));
                    const netPctOfBar = (d.net / d.total) * 100;
                    const commPctOfBar = (d.commission / d.total) * 100;

                    return (
                      <div
                        key={d.month}
                        className="flex-1 flex flex-col items-center justify-end h-full relative group"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-xl pointer-events-none whitespace-nowrap shadow-xl z-30 flex flex-col items-center gap-0.5 border border-slate-700">
                          <span className="text-white font-extrabold">{d.month} Earnings: ₹{d.total.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Net: ₹{d.net.toLocaleString('en-IN')} <span className="text-slate-400 font-normal">({Math.round(netPctOfBar)}%)</span>
                          </span>
                          <span className="text-[10px] text-blue-400 font-semibold">
                            Commission: ₹{d.commission.toLocaleString('en-IN')} <span className="text-slate-400 font-normal">({Math.round(commPctOfBar)}%)</span>
                          </span>
                        </div>

                        {/* Stacked Bar Pillar */}
                        <div
                          style={{ height: `${totalHeightPct}%` }}
                          className="w-5 sm:w-7 md:w-9 rounded-t-lg overflow-hidden flex flex-col shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          {/* Net Earnings (Emerald - top segment with rounded-t) */}
                          <div
                            style={{ height: `${netPctOfBar}%` }}
                            className="w-full bg-[#10B981] group-hover:bg-[#059669] transition-colors"
                            title={`${d.month} Net: ₹${d.net}`}
                          />
                          {/* Commission (Blue - bottom segment) */}
                          <div
                            style={{ height: `${commPctOfBar}%` }}
                            className="w-full bg-[#3B82F6] group-hover:bg-[#2563EB] transition-colors"
                            title={`${d.month} Commission: ₹${d.commission}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* X-Axis Month Labels */}
            <div className="flex gap-2 sm:gap-4">
              {/* Gutter spacer matching Y-axis width */}
              <div className="w-8 sm:w-10 shrink-0" />

              {/* Month labels aligned under bars */}
              <div className="flex-1 flex justify-around px-2 sm:px-4 text-xs font-bold text-slate-600">
                {displayedData.map((d) => (
                  <span key={d.month} className="flex-1 text-center truncate">
                    {d.month}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Your Chargers */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Your Chargers
            </h2>
            <button
              type="button"
              onClick={() => setIsManageModalOpen(true)}
              className="text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors cursor-pointer"
            >
              Manage →
            </button>
          </div>

          <div className="space-y-3">
            {chargers.map((charger) => {
              const isActive = charger.status === 'Active';
              return (
                <div
                  key={charger.id}
                  onClick={() => handleToggleCharger(charger.id)}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition-all cursor-pointer group"
                  title="Click to toggle Active/Inactive"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-18 rounded-xl overflow-hidden shrink-0 shadow-2xs bg-slate-100">
                      <img
                        src={charger.image}
                        alt={charger.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-black text-slate-900">{charger.name}</h3>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {charger.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{charger.location}</p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-slate-700">
                        <span>
                          {charger.sessions} <span className="text-slate-400 font-normal">Sessions</span>
                        </span>
                        <span>
                          ₹{charger.earnings} <span className="text-slate-400 font-normal">Earnings</span>
                        </span>
                        <span className="text-[#059669]">
                          ₹{charger.net} <span className="text-slate-400 font-normal">Net</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Bottom Table: Recent Charging Sessions */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Recent Charging Sessions
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Your latest completed charging sessions. Click any row to view breakdown.
            </p>
          </div>
          <button
            type="button"
            onClick={() => showToast('Displaying all 12 recent sessions')}
            className="text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors cursor-pointer"
          >
            View All ({RECENT_SESSIONS.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px]">
                <th className="py-2.5 px-3">Date &amp; Time</th>
                <th className="py-2.5 px-3">Driver</th>
                <th className="py-2.5 px-3">Charger</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_SESSIONS.map((session) => (
                <tr
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {session.dateStr}, <span className="text-slate-500 font-normal">{session.timeSlot}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={session.vehicleImage}
                        alt={session.vehicleModel}
                        className="h-7 w-9 rounded-md object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{session.driverName}</div>
                        <div className="text-[10px] text-slate-500">{session.vehicleModel}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div className="font-semibold text-slate-900">{session.chargerName}</div>
                    <div className="text-[10px] text-slate-500">{session.specs}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{session.duration}</td>
                  <td className="py-3 px-3">
                    <div className="font-black text-slate-900">₹{session.grossAmount}</div>
                    <div className="text-[10px] text-slate-400">₹{session.commission} comm.</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{session.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-400">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Session Details & Breakdown Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Session Payout Summary</h3>
                  <p className="text-[11px] text-slate-400 font-mono">#{selectedSession.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <img
                  src={selectedSession.vehicleImage}
                  alt={selectedSession.vehicleModel}
                  className="h-12 w-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{selectedSession.driverName}</h4>
                  <p className="text-[11px] text-slate-500">{selectedSession.vehicleModel}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Completed Session</span>
                </div>
              </div>

              <div className="space-y-1.5 py-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Session Date & Time:</span>
                  <span className="font-bold text-slate-900">{selectedSession.dateStr} ({selectedSession.timeSlot})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Charger Bay:</span>
                  <span className="font-bold text-slate-900">{selectedSession.chargerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Energy Dispensed:</span>
                  <span className="font-bold text-slate-900">{selectedSession.energyKwh} kWh</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Gross Driver Tariff:</span>
                  <span className="font-bold text-slate-900">₹{selectedSession.grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-blue-600">
                  <span>EVkal Facilitation Fee (8%):</span>
                  <span className="font-bold">-₹{selectedSession.commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-black text-slate-900">
                  <span>Your Net Payout:</span>
                  <span className="text-emerald-700 font-black">₹{selectedSession.netEarnings.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print?.();
                  showToast('Exporting session payout receipt...');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Manage Chargers Quick Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Manage Your Chargers</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {chargers.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="h-10 w-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                      <p className="text-[10px] text-slate-500">{c.specs}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleCharger(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      c.status === 'Active'
                        ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {c.status}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
