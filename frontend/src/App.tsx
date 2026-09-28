import React, { useState } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Header } from './components/layout/Header';
import { Navigation, TabId } from './components/layout/Navigation';
import { KillerDemoStepper } from './components/layout/KillerDemoStepper';
import { CommandCenter } from './components/pages/CommandCenter';
import { DigitalTwin } from './components/pages/DigitalTwin';
import { EnergyAnalytics } from './components/pages/EnergyAnalytics';
import { WaterAnalytics } from './components/pages/WaterAnalytics';
import { WasteAnalytics } from './components/pages/WasteAnalytics';
import { MobilityCarbon } from './components/pages/MobilityCarbon';
import { AIInsights } from './components/pages/AIInsights';
import { ActionSimulator } from './components/pages/ActionSimulator';
import { GreenLeague } from './components/pages/GreenLeague';
import { AuditCenter } from './components/pages/AuditCenter';
import { ManualEntryModal } from './components/modals/ManualEntryModal';
import { NodeDetailModal } from './components/modals/NodeDetailModal';
import { ScoreMethodologyModal } from './components/modals/ScoreMethodologyModal';
import { LiveTelemetryTerminal } from './components/features/LiveTelemetryTerminal';
import { JudgePitchMode } from './components/features/JudgePitchMode';
import { AntiGamingSandbox } from './components/features/AntiGamingSandbox';
import { SustainabilityCertificateModal } from './components/features/SustainabilityCertificateModal';
import { CampusNode } from './types';

const MainApp: React.FC = () => {
  const { nodes } = useCampus();
  const [activeTab, setActiveTab] = useState<TabId>('command');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState<boolean>(false);
  const [isKillerDemoBannerOpen, setIsKillerDemoBannerOpen] = useState<boolean>(true);
  const [inspectedNode, setInspectedNode] = useState<CampusNode | null>(null);

  // Winner feature modal states
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  const handleSelectNode = (nodeId: string) => {
    const found = nodes.find(n => n.id === nodeId);
    if (found) {
      setInspectedNode(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        onOpenManualEntry={() => setIsManualEntryOpen(true)}
        onOpenKillerDemo={() => setIsKillerDemoBannerOpen(!isKillerDemoBannerOpen)}
        onOpenPitchMode={() => setIsPitchOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Interactive 8-Step Killer Demo Banner */}
      {isKillerDemoBannerOpen && (
        <KillerDemoStepper
          onNavigateTab={tab => setActiveTab(tab)}
          isOpen={isKillerDemoBannerOpen}
          onToggle={() => setIsKillerDemoBannerOpen(!isKillerDemoBannerOpen)}
        />
      )}

      {/* 10-Tab Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />

      {/* Main Dynamic Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        {activeTab === 'command' && (
          <CommandCenter
            onNavigateTab={tab => setActiveTab(tab)}
            onSelectNode={handleSelectNode}
          />
        )}
        {activeTab === 'twin' && (
          <DigitalTwin onSelectNode={handleSelectNode} />
        )}
        {activeTab === 'energy' && <EnergyAnalytics />}
        {activeTab === 'water' && (
          <WaterAnalytics onNavigateTab={tab => setActiveTab(tab)} />
        )}
        {activeTab === 'waste' && <WasteAnalytics />}
        {activeTab === 'mobility' && <MobilityCarbon />}
        {activeTab === 'ai' && (
          <AIInsights onNavigateTab={tab => setActiveTab(tab)} />
        )}
        {activeTab === 'simulator' && <ActionSimulator />}
        {activeTab === 'league' && <GreenLeague />}
        {activeTab === 'audit' && <AuditCenter />}
      </main>

      {/* Modals */}
      <ManualEntryModal
        isOpen={isManualEntryOpen}
        onClose={() => setIsManualEntryOpen(false)}
      />
      <NodeDetailModal
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
      />
      <LiveTelemetryTerminal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />
      <JudgePitchMode
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onNavigateTab={tab => setActiveTab(tab)}
      />
      <ScoreMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
      <SustainabilityCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">GREENCORE AI TWIN</span>
            <span>•</span>
            <span>CB-SW-05 GreenTech & Sustainability</span>
            <span>•</span>
            <span className="text-cyan-400">ECO CLUB, GCE Kalahandi</span>
          </div>
          <div className="text-[11px] text-slate-400">
            HACKVERSE ’26 24-Hour National Hackathon • Built with Closed-Loop Sustainability Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <MainApp />
    </CampusProvider>
  );
}
