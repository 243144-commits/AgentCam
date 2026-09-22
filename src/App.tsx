import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/views/OverviewView';
import { LiveSurveillanceView } from './components/views/LiveSurveillanceView';
import { CameraDetailView } from './components/views/CameraDetailView';
import { CamerasCatalogView } from './components/views/CamerasCatalogView';
import { TacticalMapCanvas } from './components/common/TacticalMapCanvas';
import { IncidentsView } from './components/views/IncidentsView';
import { IncidentDetailView } from './components/views/IncidentDetailView';
import { IntelligenceView } from './components/views/IntelligenceView';
import { EvidenceVaultView } from './components/views/EvidenceVaultView';
import { ReportsView } from './components/views/ReportsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SystemHealthView } from './components/views/SystemHealthView';
import { AlertsView } from './components/views/AlertsView';
import { SettingsView } from './components/views/SettingsView';
import { SimulationLabView } from './components/views/SimulationLabView';
import { PhoneCameraLabView } from './components/views/PhoneCameraLabView';
import { FalsePositiveFeedbackModal } from './components/modals/FalsePositiveFeedbackModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { NotificationDrawer } from './components/drawers/NotificationDrawer';
import { LandingLoginView } from './components/views/LandingLoginView';
import { ProductDifferentiatorsModal } from './components/modals/ProductDifferentiatorsModal';
import { AddCameraModal } from './components/modals/AddCameraModal';
import { CreateZoneModal } from './components/modals/CreateZoneModal';

const AppContent: React.FC = () => {
  const { activeView, isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return <LandingLoginView />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060a12] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Command Bar */}
        <TopBar />

        {/* Dynamic Main View Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 relative">
          {activeView === 'overview' && <OverviewView />}
          {(activeView === 'live-surveillance' || (activeView as string) === 'surveillance') && <LiveSurveillanceView />}
          {activeView === 'camera-detail' && <CameraDetailView />}
          {activeView === 'cameras' && <CamerasCatalogView />}
          {(activeView === 'tactical-map' || activeView === 'risk-heatmap') && (
            <div className="h-[calc(100vh-105px)] w-full">
              <TacticalMapCanvas height="h-full" />
            </div>
          )}
          {activeView === 'incidents' && <IncidentsView />}
          {activeView === 'incident-detail' && <IncidentDetailView />}
          {(activeView === 'intelligence' || activeView === 'vehicles' || activeView === 'persons-tracks') && <IntelligenceView />}
          {activeView === 'evidence' && <EvidenceVaultView />}
          {activeView === 'reports' && <ReportsView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'system-health' && <SystemHealthView />}
          {((activeView as string) === 'alerts') && <AlertsView />}
          {activeView === 'settings' && <SettingsView />}
          {activeView === 'simulation-lab' && <SimulationLabView />}
          {activeView === 'phone-camera-lab' && <PhoneCameraLabView />}
        </main>
      </div>

      {/* Global Interactive Modals & Drawers */}
      <FalsePositiveFeedbackModal />
      <GlobalSearchModal />
      <NotificationDrawer />
      <ProductDifferentiatorsModal />
      <AddCameraModal />
      <CreateZoneModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
