import { TopBar } from './components/TopBar';
import { P0SidebarNav } from './components/P0SidebarNav';
import { P1SidebarNav } from './components/P1SidebarNav';
import { Page1GridDashboard } from './components/pages/Page1GridDashboard';
import { Page2EVFleet } from './components/pages/Page2EVFleet';
import { Page3DynamicTariff } from './components/pages/Page3DynamicTariff';
import { Page4Scheduler } from './components/pages/Page4Scheduler';
import { Page5Results } from './components/pages/Page5Results';
import { LandingHeroPage } from './components/LandingHeroPage';
import { P2PChargerSharingTab } from './components/P2PChargerSharingTab';
import { P2PEmergencyAssistPage } from './components/pages/P2PEmergencyAssistPage';
import { ListCommunityChargerPage } from './components/ListCommunityChargerPage';
import { P2PBookingsPage } from './components/pages/P2PBookingsPage';
import { P2PHostEarningsPage } from './components/pages/P2PHostEarningsPage';
import { EVSessionModal } from './components/EVSessionModal';
import { BookingSimModal } from './components/BookingSimModal';
import { ListChargerModal } from './components/ListChargerModal';
import { ProfileView } from './components/profile/ProfileView';
import { useSimulationStore } from './store/useSimulationStore';

export default function App() {
  const {
    activeTab,
    activeP0SubPage,
    activeP1SubPage,
    setActiveP1SubPage,
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
  // When activeTab is 'P1_P2P', use P2P's independent separate left panel (P1SidebarNav)
  // When activeTab is 'P0_GRID' or 'PROFILE', use P0SidebarNav
  const isP2P = activeTab === 'P1_P2P';

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      <div className="flex-1 w-full flex flex-col lg:flex-row">
        {/* Left Dark Sidebar Navigation:
            - When in P1_P2P: Render P1SidebarNav (P2P's independent sidebar with its function pages)
            - When in P0_GRID / PROFILE: Render P0SidebarNav (P0's Grid management sub-pages)
        */}
        {isP2P ? <P1SidebarNav /> : <P0SidebarNav />}

        {/* Main Application Area */}
        <div className="flex-1 min-w-0 flex flex-col px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
          {/* Top Bar with Grid status, P2P pill, Date, Notifications, Avatar */}
          <TopBar />

          {/* Sub-Page Content */}
          <main className="w-full flex-1">
            {activeTab === 'PROFILE' || activeP0SubPage === 'PAGE_6_PROFILE' ? (
              <ProfileView />
            ) : isP2P ? (
              /* P1: P2P Community Charger Sharing (Independent Sub-Pages) */
              <>
                {activeP1SubPage === 'P2P_EXPLORE' && <P2PChargerSharingTab />}
                {activeP1SubPage === 'P2P_EMERGENCY' && <P2PEmergencyAssistPage />}
                {activeP1SubPage === 'P2P_LIST_CHARGER' && (
                  <ListCommunityChargerPage onBack={() => setActiveP1SubPage('P2P_EXPLORE')} />
                )}
                {activeP1SubPage === 'P2P_BOOKINGS' && <P2PBookingsPage />}
                {activeP1SubPage === 'P2P_EARNINGS' && <P2PHostEarningsPage />}
              </>
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
