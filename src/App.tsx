import { Lock } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { P0SidebarNav } from './components/P0SidebarNav';
import { Page1GridDashboard } from './components/pages/Page1GridDashboard';
import { Page1GridOptimizationDashboard } from './components/pages/Page1GridOptimizationDashboard';
import { Page2EVFleet } from './components/pages/Page2EVFleet';
import { Page3DynamicTariff } from './components/pages/Page3DynamicTariff';
import { Page4Scheduler } from './components/pages/Page4Scheduler';
import { Page5Results } from './components/pages/Page5Results';
import { LandingHeroPage } from './components/LandingHeroPage';
import { P2PChargerSharingTab } from './components/P2PChargerSharingTab';
import { HostDashboardPage } from './components/HostDashboardPage';
import { EVSessionModal } from './components/EVSessionModal';
import { BookingSimModal } from './components/BookingSimModal';
import { ListChargerModal } from './components/ListChargerModal';
import { ProfileView } from './components/profile/ProfileView';
import { AuthPage } from './components/auth/AuthPage';
import { SupabaseVerificationModal } from './components/auth/SupabaseVerificationModal';
import { useSimulationStore } from './store/useSimulationStore';

export default function App() {
  const {
    activeTab,
    activeP0SubPage,
    isAdmin,
    openAuthView,
    isDatabaseModalOpen,
    closeDatabaseModal,
  } = useSimulationStore();

  if (activeTab === 'AUTH') {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        <AuthPage />
      </div>
    );
  }

  if (activeTab === 'LANDING') {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        <LandingHeroPage />
        <EVSessionModal />
        <BookingSimModal />
        <ListChargerModal />
        <SupabaseVerificationModal
          isOpen={isDatabaseModalOpen}
          onClose={closeDatabaseModal}
        />
      </div>
    );
  }

  // P2P vs P0 Left Panel condition:
  // When activeTab is 'P1_P2P', P0SidebarNav is hidden because P2P has its own independent left panel (P2PSidebar)
  // When activeTab is 'HOST_DASHBOARD', P0SidebarNav is hidden to render full-width Host Dashboard
  // When activeTab is 'P0_GRID' or 'PROFILE', P0SidebarNav is displayed on the left
  const isP2P = activeTab === 'P1_P2P';
  const isHost = activeTab === 'HOST_DASHBOARD';

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* Top Bar with Logo, Navigation Pills (Grid, P2P, Host), Live API status, Clock, Avatar */}
      <TopBar />

      <div className="flex-1 w-full flex flex-col lg:flex-row">
        {/* Left Sidebar Navigation:
            - When on P0 Grid or Profile: Render P0SidebarNav
            - When on P1 P2P or Host Dashboard: P0SidebarNav is removed
        */}
        {!isP2P && !isHost && <P0SidebarNav />}

        {/* Main Application Area */}
        <div className="flex-1 min-w-0 flex flex-col px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
          {/* Sub-Page Content */}
          <main className="w-full flex-1">
            {isHost ? (
              <HostDashboardPage />
            ) : activeTab === 'PROFILE' || activeP0SubPage === 'PAGE_6_PROFILE' ? (
              <ProfileView />
            ) : isP2P ? (
              /* P1: P2P Community Charger Sharing (With its own independent left panel and function pages) */
              <P2PChargerSharingTab />
            ) : (
              /* P0: Grid & Feeder Management Sub-Pages */
              <>
                {activeP0SubPage === 'PAGE_1_DASHBOARD' && <Page1GridDashboard />}
                {activeP0SubPage === 'PAGE_0_OPTIMIZER' && (
                  isAdmin ? (
                    <Page1GridOptimizationDashboard />
                  ) : (
                    <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 max-w-lg mx-auto my-12 space-y-4 shadow-sm animate-fade-in">
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Admin Authentication Required</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        The Grid &amp; Transformer Optimizer is restricted to authorized DISCOM Feeder Administrators.
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => openAuthView('OFFICIAL')}
                          className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          Sign In with Official DISCOM Access
                        </button>
                      </div>
                    </div>
                  )
                )}
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

      {/* Supabase Database & Auth Diagnostics Modal */}
      <SupabaseVerificationModal
        isOpen={isDatabaseModalOpen}
        onClose={closeDatabaseModal}
      />
    </div>
  );
}
