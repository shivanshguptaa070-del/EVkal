import { useState } from 'react';
import {
  User,
  Crown,
  Home,
  Check,
  X,
  Search,
  Percent,
  Plus,
  BarChart2,
  TrendingUp,
  Headphones,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export function MembershipPricingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [selectedPlan, setSelectedPlan] = useState<'FREE' | 'PLUS' | 'HOST_PRO'>('FREE');

  const plusPrice = billingCycle === 'MONTHLY' ? 149 : 119;
  const hostProPrice = billingCycle === 'MONTHLY' ? 299 : 239;

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header & Billing Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Membership &amp; Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-2xl">
            Choose a plan that fits your charging needs. Save more, get more features, and support your EV community.
          </p>
        </div>

        {/* Monthly / Yearly Toggle Pill */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 w-fit">
          <button
            type="button"
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'MONTHLY'
                ? 'bg-[#059669] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'YEARLY'
                ? 'bg-[#059669] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Yearly</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* 2. Top 3 Tier Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Tier 1: Free */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Free</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">For occasional users</p>
            </div>

            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-3xl font-black text-slate-900">₹0</span>
              <span className="text-xs text-slate-500 font-medium">/ month</span>
            </div>

            <ul className="space-y-3 pt-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Find and book community chargers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>View charger details and availability</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Standard service fees</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-slate-500 font-bold text-xs bg-slate-50 cursor-default text-center"
          >
            Current Plan
          </button>
        </div>

        {/* Tier 2: EVkal Plus (Most Popular) */}
        <div className="bg-white rounded-3xl border-2 border-[#059669] p-6 shadow-md shadow-emerald-600/5 relative flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shadow-2xs">
                <Crown className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-bold">
                <Crown className="h-3 w-3" />
                <span>Most Popular</span>
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">EVkal Plus</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">For frequent EV drivers</p>
            </div>

            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-3xl font-black text-slate-900">₹{plusPrice}</span>
              <span className="text-xs text-slate-500 font-medium">/ month</span>
            </div>

            <ul className="space-y-3 pt-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Lower service fees on bookings</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Save favourite chargers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Charging history &amp; insights</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setSelectedPlan('PLUS')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white font-bold text-xs shadow-sm transition-all cursor-pointer text-center"
          >
            {selectedPlan === 'PLUS' ? 'Selected ✓' : 'Upgrade to Plus'}
          </button>
        </div>

        {/* Tier 3: Host Pro */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Host Pro</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">For charger owners</p>
            </div>

            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-3xl font-black text-slate-900">₹{hostProPrice}</span>
              <span className="text-xs text-slate-500 font-medium">/ month</span>
            </div>

            <ul className="space-y-3 pt-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Reduced commission rate</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Detailed earnings analytics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Multiple charger management</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setSelectedPlan('HOST_PRO')}
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#059669] text-[#059669] hover:bg-emerald-50 active:scale-[0.99] font-bold text-xs transition-all cursor-pointer text-center"
          >
            {selectedPlan === 'HOST_PRO' ? 'Selected ✓' : 'Upgrade to Host Pro'}
          </button>
        </div>
      </div>

      {/* 3. Compare Features Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Compare Features
          </h3>
          <div className="hidden sm:grid grid-cols-3 gap-8 w-1/2 text-center text-xs font-bold text-slate-700">
            <span className="flex items-center justify-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" /> Free
            </span>
            <span className="flex items-center justify-center gap-1.5 text-[#059669]">
              <Crown className="h-3.5 w-3.5" /> EVkal Plus
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-slate-400" /> Host Pro
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Row 1: Find and book chargers */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-slate-800">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Find and book chargers</span>
            </div>
            <div className="grid grid-cols-3 gap-8 w-1/2 text-center">
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
            </div>
          </div>

          {/* Row 2: Standard service fee */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-slate-800">
              <Percent className="h-4 w-4 text-slate-400" />
              <span>Standard service fee (on bookings)</span>
            </div>
            <div className="grid grid-cols-3 gap-8 w-1/2 text-center font-bold text-slate-700">
              <div>5%</div>
              <div className="text-[#059669]">3%</div>
              <div>3%</div>
            </div>
          </div>

          {/* Row 3: List your charger */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-slate-800">
              <Plus className="h-4 w-4 text-slate-400" />
              <span>List your charger</span>
            </div>
            <div className="grid grid-cols-3 gap-8 w-1/2 text-center">
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
            </div>
          </div>

          {/* Row 4: Reduced commission rate */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-slate-800">
              <BarChart2 className="h-4 w-4 text-slate-400" />
              <span>Reduced commission rate (for hosts)</span>
            </div>
            <div className="grid grid-cols-3 gap-8 w-1/2 text-center">
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="font-bold text-[#059669]">4% (vs 8%)</div>
            </div>
          </div>

          {/* Row 5: Earnings analytics */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-slate-800">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <span>Earnings analytics (for hosts)</span>
            </div>
            <div className="grid grid-cols-3 gap-8 w-1/2 text-center">
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
            </div>
          </div>

          {/* Row 6: Priority customer support */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-slate-800">
              <Headphones className="h-4 w-4 text-slate-400" />
              <span>Priority customer support</span>
            </div>
            <div className="grid grid-cols-3 gap-8 w-1/2 text-center">
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
            </div>
          </div>

          {/* Row 7: Charging history & insights */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-slate-800">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Charging history &amp; insights</span>
            </div>
            <div className="grid grid-cols-3 gap-8 w-1/2 text-center">
              <div className="flex justify-center"><X className="h-4 w-4 text-red-400" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
              <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-[#059669]" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
