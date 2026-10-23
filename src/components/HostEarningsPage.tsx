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
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';

export function HostEarningsPage() {
  const { setP2PSubView } = useSimulationStore();
  const [timeRange, setTimeRange] = useState<'6M' | '3M' | '1Y'>('6M');

  // Monthly stacked bar chart data (May through Oct)
  const monthlyData = [
    { month: 'May', net: 2600, commission: 340, total: 2940 },
    { month: 'Jun', net: 3100, commission: 410, total: 3510 },
    { month: 'Jul', net: 4200, commission: 550, total: 4750 },
    { month: 'Aug', net: 4800, commission: 630, total: 5430 },
    { month: 'Sep', net: 5100, commission: 670, total: 5770 },
    { month: 'Oct', net: 6400, commission: 840, total: 7240 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Host Earnings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Track your income and charger performance.
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
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shadow-2xs">
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
              ~8% of total revenue
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
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shadow-2xs">
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
                  <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
                  <span>Net Earnings</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#60A5FA]" />
                  <span>Commission</span>
                </span>
              </div>

              {/* Range Select */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
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
          <div className="h-56 w-full pt-4 flex flex-col justify-between">
            <div className="relative h-44 flex items-end justify-between px-4 border-b border-slate-100">
              {/* Horizontal Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono">
                <div className="border-b border-slate-100/70 pb-0.5">₹8K</div>
                <div className="border-b border-slate-100/70 pb-0.5">₹6K</div>
                <div className="border-b border-slate-100/70 pb-0.5">₹4K</div>
                <div className="border-b border-slate-100/70 pb-0.5">₹2K</div>
                <div className="pb-0.5">0</div>
              </div>

              {/* Stacked Bars */}
              {monthlyData.map((d) => {
                const heightNetPct = (d.net / 8000) * 100;
                const heightCommPct = (d.commission / 8000) * 100;

                return (
                  <div key={d.month} className="z-10 flex flex-col items-center gap-1 w-12">
                    <div className="w-6 rounded-lg overflow-hidden flex flex-col-reverse shadow-2xs group cursor-pointer hover:opacity-90 transition-opacity">
                      {/* Bottom Segment: Commission (Blue) */}
                      <div
                        style={{ height: `${heightCommPct}%` }}
                        className="w-full bg-[#60A5FA]"
                        title={`${d.month} Commission: ₹${d.commission}`}
                      />
                      {/* Top Segment: Net Earnings (Green) */}
                      <div
                        style={{ height: `${heightNetPct}%` }}
                        className="w-full bg-[#34D399]"
                        title={`${d.month} Net: ₹${d.net}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between px-4 pt-2 text-xs font-semibold text-slate-500">
              {monthlyData.map((d) => (
                <span key={d.month} className="w-12 text-center">
                  {d.month}
                </span>
              ))}
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
              className="text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors cursor-pointer"
            >
              Manage →
            </button>
          </div>

          <div className="space-y-3">
            {/* Charger 1: Home Charger */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-14 w-18 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src="/assets/images/shivharsh_villa.jpg"
                    alt="Home Charger"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black text-slate-900">Home Charger</h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Saket Block J, New Delhi</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-slate-700">
                    <span>8 <span className="text-slate-400 font-normal">Sessions</span></span>
                    <span>₹1,920 <span className="text-slate-400 font-normal">Earnings</span></span>
                    <span className="text-[#059669]">₹1,766 <span className="text-slate-400 font-normal">Net</span></span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </div>

            {/* Charger 2: Office Charger */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-14 w-18 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src="/assets/images/dr_neha_villa.jpg"
                    alt="Office Charger"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black text-slate-900">Office Charger</h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold">
                      Inactive
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Vasant Kunj, New Delhi</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-slate-700">
                    <span>4 <span className="text-slate-400 font-normal">Sessions</span></span>
                    <span>₹960 <span className="text-slate-400 font-normal">Earnings</span></span>
                    <span className="text-[#059669]">₹884 <span className="text-slate-400 font-normal">Net</span></span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </div>
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
              Your latest completed charging sessions.
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-bold text-[#059669] hover:text-[#047857] transition-colors cursor-pointer"
          >
            View All →
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
              {/* Row 1: Rahul Mehta */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900">
                  18 Oct 2026, <span className="text-slate-500 font-normal">18:00 – 20:00</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/images/nexon_ev.jpg"
                      alt="Tata Nexon EV"
                      className="h-7 w-9 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Rahul Mehta</div>
                      <div className="text-[10px] text-slate-500">Tata Nexon EV</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <div className="font-semibold text-slate-900">Home Charger</div>
                  <div className="text-[10px] text-slate-500">Type 2 AC · 11 kW</div>
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">2h</td>
                <td className="py-3 px-3">
                  <div className="font-black text-slate-900">₹240</div>
                  <div className="text-[10px] text-slate-400">₹20 comm.</div>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Completed</span>
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </td>
              </tr>

              {/* Row 2: Priya Singh */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900">
                  15 Oct 2026, <span className="text-slate-500 font-normal">08:00 – 10:00</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/images/mg_zs_ev.jpg"
                      alt="MG ZS EV"
                      className="h-7 w-9 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Priya Singh</div>
                      <div className="text-[10px] text-slate-500">MG ZS EV</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <div className="font-semibold text-slate-900">Home Charger</div>
                  <div className="text-[10px] text-slate-500">Type 2 AC · 11 kW</div>
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">2h</td>
                <td className="py-3 px-3">
                  <div className="font-black text-slate-900">₹240</div>
                  <div className="text-[10px] text-slate-400">₹20 comm.</div>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Completed</span>
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </td>
              </tr>

              {/* Row 3: Amit Verma */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900">
                  12 Oct 2026, <span className="text-slate-500 font-normal">19:00 – 21:00</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/images/hyundai_kona.jpg"
                      alt="Hyundai Kona"
                      className="h-7 w-9 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Amit Verma</div>
                      <div className="text-[10px] text-slate-500">Hyundai Kona</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <div className="font-semibold text-slate-900">Home Charger</div>
                  <div className="text-[10px] text-slate-500">Type 2 AC · 11 kW</div>
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">2h</td>
                <td className="py-3 px-3">
                  <div className="font-black text-slate-900">₹240</div>
                  <div className="text-[10px] text-slate-400">₹20 comm.</div>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Completed</span>
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
