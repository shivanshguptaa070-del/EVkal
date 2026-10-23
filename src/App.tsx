import { Header } from './components/Header';
import { LandingHeroPage } from './components/LandingHeroPage';
import { P0SidebarNav } from './components/P0SidebarNav';
import { Page1GridOptimizationDashboard } from './components/pages/Page1GridOptimizationDashboard';
import { Page2TransformerAnalytics } from './components/pages/Page2TransformerAnalytics';
import { Page3EVFleetScheduling } from './components/pages/Page3EVFleetScheduling';
import { Page4TariffEconomics } from './components/pages/Page4TariffEconomics';
import { Page5FeasibilityDiagnostics } from './components/pages/Page5FeasibilityDiagnostics';
import { EVSessionModal } from './components/EVSessionModal';
import { P2PChargerSharingTab } from './components/P2PChargerSharingTab';
import { BookingSimModal } from './components/BookingSimModal';
import { useSimulationStore } from './store/useSimulationStore';

export default function App() {
  const { activeTab, activeP0SubPage } = useSimulationStore();

  if (activeTab === 'LANDING') {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        <LandingHeroPage />
        {/* Interactive EV Session Modal (P0) */}
        <EVSessionModal />
        {/* Interactive 5-Stage P2P Booking Modal (P1) */}
        <BookingSimModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* Persistent Global Header */}
      <Header />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'P0_GRID' ? (
          /* P0: Smart Grid & Transformer Optimizer with Left Sidebar Navigation */
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left-Side Navigation Panel for the 5 P0 Pages */}
            <P0SidebarNav />

            {/* Active Sub-Page Content Area */}
            <div className="flex-1 min-w-0 w-full">
              {activeP0SubPage === 'PAGE_1_OPTIMIZER' && <Page1GridOptimizationDashboard />}
              {activeP0SubPage === 'PAGE_2_TRANSFORMER' && <Page2TransformerAnalytics />}
              {activeP0SubPage === 'PAGE_3_FLEET' && <Page3EVFleetScheduling />}
              {activeP0SubPage === 'PAGE_4_TARIFF' && <Page4TariffEconomics />}
              {activeP0SubPage === 'PAGE_5_DIAGNOSTICS' && <Page5FeasibilityDiagnostics />}
            </div>
          </div>
        ) : (
          /* P1: P2P Community Charger Sharing (Screen 3 & 4 Mockup) */
          <P2PChargerSharingTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
        EVkal &middot; Smart EV Charging &amp; P2P Sharing Decision-Support System &middot; Hackathon Problem #053
      </footer>

      {/* Interactive EV Session Modal (P0) */}
      <EVSessionModal />

      {/* Interactive 5-Stage P2P Booking Modal (P1) */}
      <BookingSimModal />
    </div>
  );
}
