import { TopBar } from './components/TopBar';
import { P0SidebarNav } from './components/P0SidebarNav';
import { Page1GridDashboard } from './components/pages/Page1GridDashboard';
import { Page2EVFleet } from './components/pages/Page2EVFleet';
import { Page3DynamicTariff } from './components/pages/Page3DynamicTariff';
import { Page4Scheduler } from './components/pages/Page4Scheduler';
import { Page5Results } from './components/pages/Page5Results';
import { LandingHeroPage } from './components/LandingHeroPage';
import { P2PChargerSharingTab } from './components/P2PChargerSharingTab';
import { EVSessionModal } from './components/EVSessionModal';
import { BookingSimModal } from './components/BookingSimModal';
import { ListChargerModal } from './components/ListChargerModal';
import { ProfileView } from './components/profile/ProfileView';
import { useSimulationStore } from './store/useSimulationStore';

export default function App() {
  const {
    activeTab,
    activeP0SubPage,
  } = useSimulationStore();

  if (activeTab === 'LANDING') {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        <LandingHeroPage />
        <EVSessionModal />
        <BookingSimModal />
        <ListChargerModal />
      </div>
    );
  }

  // P2P vs P0 Left Panel condition:
  // When activeTab is 'P1_P2P', P0SidebarNav is hidden because P2P has its own independent left panel (P2PSidebar)
  // When activeTab is 'P0_GRID' or 'PROFILE', P0SidebarNav is displayed on the left
  const isP2P = activeTab === 'P1_P2P';

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      <div className="flex-1 w-full flex flex-col lg:flex-row">
        {/* Left Sidebar Navigation:
            - When on P0 Grid or Profile: Render P0SidebarNav
            - When on P1 P2P: P0SidebarNav is removed so P2P uses its own separate left panel!
        */}
        {!isP2P && <P0SidebarNav />}

        {/* Main Application Area */}
        <div className="flex-1 min-w-0 flex flex-col px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
          {/* Top Bar with Grid status, P2P pill, Date, Notifications, Avatar */}
          <TopBar />

          {/* Sub-Page Content */}
          <main className="w-full flex-1">
            {activeTab === 'PROFILE' || activeP0SubPage === 'PAGE_6_PROFILE' ? (
              <ProfileView />
            ) : isP2P ? (
              /* P1: P2P Community Charger Sharing (With its own independent left panel and function pages) */
              <P2PChargerSharingTab />
            ) : (
              /* P0: Grid & Feeder Management Sub-Pages */
              <>
                {activeP0SubPage === 'PAGE_1_DASHBOARD' && <Page1GridDashboard />}
                {activeP0SubPage === 'PAGE_2_FLEET' && <Page2EVFleet />}
                {activeP0SubPage === 'PAGE_3_TARIFF' && <Page3DynamicTariff />}
                {activeP0SubPage === 'PAGE_4_SCHEDULER' && <Page4Scheduler />}
                {activeP0SubPage === 'PAGE_5_RESULTS' && <Page5Results />}
              </>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-200/80 pt-5 pb-3 text-center text-xs text-slate-500 font-medium">
            EVkal &middot; Smarter Charging &middot; Stronger Grids &middot; Hackathon Problem #053
          </footer>
        </div>
      </div>

      {/* Interactive EV Session Modal (P0) */}
      <EVSessionModal />

      {/* Interactive 5-Stage P2P Booking Modal (P1) */}
      <BookingSimModal />

      {/* Interactive List Charger Modal (P1) */}
      <ListChargerModal />
    </div>
  );
}
