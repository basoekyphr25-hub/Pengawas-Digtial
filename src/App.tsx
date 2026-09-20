import React, { useState, useEffect } from 'react';
import { 
  loadStoredAppState, 
  saveAppStateToStorage, 
  INITIAL_GLOBAL_CONTEXT, 
  AppStateData 
} from './store/appStore';
import { 
  PathType, 
  GlobalContext, 
  TargetPembelajaran, 
  AtpItem, 
  ModulAjar, 
  LKPDData, 
  SavedDocument 
} from './types';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { GlobalContextWizard } from './components/context/GlobalContextWizard';
import { CpTpParser } from './components/dasmen/CpTpParser';
import { AtpBuilder } from './components/dasmen/AtpBuilder';
import { PilihTpView } from './components/dasmen/PilihTpView';
import { KembangkanModulView } from './components/dasmen/KembangkanModulView';
import { ModulAjarWizard } from './components/dasmen/ModulAjarWizard';
import { KktpManager } from './components/dasmen/KktpManager';
import { LkpdBuilder } from './components/dasmen/LkpdBuilder';
import { ProjekBuilder } from './components/dasmen/ProjekBuilder';
import { PaudFondasi } from './components/paud/PaudFondasi';
import { PaudTemaBuilder } from './components/paud/PaudTemaBuilder';
import { PaudModulWizard } from './components/paud/PaudModulWizard';
import { DocumentCollection } from './components/collection/DocumentCollection';
import { SettingsView } from './components/settings/SettingsView';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { ExportImportModal } from './components/modals/ExportImportModal';
import { getStoredGeminiKey } from './lib/gemini/client';

export default function App() {
  const [appState, setAppState] = useState<AppStateData>(() => loadStoredAppState());
  const [activeItem, setActiveItem] = useState<NavItem>('dashboard');
  const [selectedTpForModul, setSelectedTpForModul] = useState<AtpItem | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Check key on mount & sync
  useEffect(() => {
    setHasApiKey(Boolean(getStoredGeminiKey()));
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    saveAppStateToStorage(appState);
  }, [appState]);

  const handleUpdateGlobalContext = (updated: GlobalContext) => {
    setAppState(prev => ({
      ...prev,
      globalContext: updated
    }));
  };

  const handlePathChange = (newPath: PathType) => {
    setAppState(prev => ({ ...prev, activePath: newPath }));
    if (newPath === 'dasmen') {
      setActiveItem('dashboard');
    } else {
      setActiveItem('paud-fondasi');
    }
  };

  const handleSaveTpList = (tps: TargetPembelajaran[]) => {
    setAppState(prev => ({
      ...prev,
      currentTpDrafts: tps
    }));
  };

  const handleSaveAtpList = (atps: AtpItem[]) => {
    setAppState(prev => ({
      ...prev,
      currentAtpDrafts: atps
    }));
  };

  const handleSaveModulDraft = (modul: ModulAjar) => {
    setAppState(prev => ({
      ...prev,
      currentModulDraft: modul
    }));
  };

  const handleSaveLkpdDraft = (lkpd: LKPDData) => {
    setAppState(prev => ({
      ...prev,
      currentLkpdDraft: lkpd
    }));
  };

  const handleSaveToCollection = (doc: SavedDocument) => {
    setAppState(prev => {
      const existingIdx = prev.savedDocuments.findIndex(d => d.id === doc.id);
      let updatedList = [...prev.savedDocuments];
      if (existingIdx >= 0) {
        updatedList[existingIdx] = doc;
      } else {
        updatedList = [doc, ...updatedList];
      }
      return {
        ...prev,
        savedDocuments: updatedList
      };
    });
  };

  const handleDeleteDocument = (id: string) => {
    setAppState(prev => ({
      ...prev,
      savedDocuments: prev.savedDocuments.filter(d => d.id !== id)
    }));
  };

  const handleRestoreState = (restored: AppStateData) => {
    setAppState(restored);
  };

  const handleResetToDefaults = () => {
    const fresh: AppStateData = {
      activePath: 'dasmen',
      globalContext: INITIAL_GLOBAL_CONTEXT,
      savedDocuments: [],
      currentTpDrafts: [],
      currentAtpDrafts: [],
      currentModulDraft: null,
      currentLkpdDraft: null,
      currentProjectDraft: null
    };
    setAppState(fresh);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 antialiased flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        activeItem={activeItem}
        onNavigate={(item) => setActiveItem(item)}
        activePath={appState.activePath}
        onPathChange={handlePathChange}
        curriculum={appState.globalContext.identity.curriculum}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header
          activeItem={activeItem}
          globalContext={appState.globalContext}
          activePath={appState.activePath}
          hasApiKey={hasApiKey}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onOpenExportImportModal={() => setIsBackupModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onNavigate={(item) => setActiveItem(item)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* DASHBOARD */}
          {activeItem === 'dashboard' && (
            <Dashboard
              globalContext={appState.globalContext}
              activePath={appState.activePath}
              savedDocuments={appState.savedDocuments}
              hasApiKey={hasApiKey}
              onNavigate={(item) => setActiveItem(item)}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {/* KONTEKS GLOBAL */}
          {activeItem === 'konteks-identitas' && (
            <GlobalContextWizard
              initialStage={1}
              context={appState.globalContext}
              onUpdateContext={handleUpdateGlobalContext}
              onProceedToNext={() => setActiveItem('konteks-murid')}
              onNavigate={(item) => setActiveItem(item)}
              onSaveToCollection={handleSaveToCollection}
            />
          )}
          {activeItem === 'konteks-murid' && (
            <GlobalContextWizard
              initialStage={2}
              context={appState.globalContext}
              onUpdateContext={handleUpdateGlobalContext}
              onProceedToNext={() => setActiveItem('konteks-komunitas')}
              onNavigate={(item) => setActiveItem(item)}
              onSaveToCollection={handleSaveToCollection}
            />
          )}
          {activeItem === 'konteks-komunitas' && (
            <GlobalContextWizard
              initialStage={3}
              context={appState.globalContext}
              onUpdateContext={handleUpdateGlobalContext}
              onProceedToNext={() => setActiveItem('dasmen-cp-tp')}
              onNavigate={(item) => setActiveItem(item)}
              onSaveToCollection={handleSaveToCollection}
            />
          )}

          {/* DASMEN PATH */}
          {activeItem === 'dasmen-cp-tp' && (
            <CpTpParser
              globalContext={appState.globalContext}
              onSaveTpList={handleSaveTpList}
              onProceedToAtp={() => setActiveItem('dasmen-atp')}
              onNavigate={(item) => setActiveItem(item)}
            />
          )}

          {activeItem === 'dasmen-atp' && (
            <AtpBuilder
              globalContext={appState.globalContext}
              tps={appState.currentTpDrafts}
              atpList={appState.currentAtpDrafts}
              onSaveAtpList={handleSaveAtpList}
              onProceedToModul={() => setActiveItem('dasmen-pilih-tp')}
              onNavigate={(item) => setActiveItem(item)}
              onSaveToCollection={handleSaveToCollection}
            />
          )}

          {activeItem === 'dasmen-pilih-tp' && (
            <PilihTpView
              globalContext={appState.globalContext}
              atpList={appState.currentAtpDrafts}
              tps={appState.currentTpDrafts}
              onSelectTpForModul={(selected: AtpItem) => {
                setSelectedTpForModul(selected);
                setActiveItem('dasmen-modul');
              }}
              onNavigate={(item) => setActiveItem(item)}
            />
          )}

          {activeItem === 'dasmen-modul' && (
            <KembangkanModulView
              globalContext={appState.globalContext}
              selectedTp={selectedTpForModul}
              tps={appState.currentTpDrafts}
              currentDraft={appState.currentModulDraft}
              onSaveDraft={handleSaveModulDraft}
              onSaveToCollection={handleSaveToCollection}
              onNavigate={(item) => setActiveItem(item)}
            />
          )}

          {activeItem === 'dasmen-kktp' && (
            <KktpManager globalContext={appState.globalContext} />
          )}

          {activeItem === 'dasmen-lkpd' && (
            <LkpdBuilder
              globalContext={appState.globalContext}
              currentDraft={appState.currentLkpdDraft}
              onSaveDraft={handleSaveLkpdDraft}
              onSaveToCollection={handleSaveToCollection}
            />
          )}

          {activeItem === 'dasmen-projek' && (
            <ProjekBuilder
              globalContext={appState.globalContext}
              onSaveToCollection={handleSaveToCollection}
            />
          )}

          {/* PAUD PATH */}
          {activeItem === 'paud-fondasi' && (
            <PaudFondasi
              globalContext={appState.globalContext}
              onProceedToThemes={() => setActiveItem('paud-tema')}
            />
          )}

          {activeItem === 'paud-tema' && (
            <PaudTemaBuilder
              globalContext={appState.globalContext}
              onSelectThemeForModul={() => setActiveItem('paud-modul')}
            />
          )}

          {activeItem === 'paud-modul' && (
            <PaudModulWizard
              globalContext={appState.globalContext}
              onSaveToCollection={handleSaveToCollection}
            />
          )}

          {activeItem === 'paud-projek' && (
            <ProjekBuilder
              globalContext={appState.globalContext}
              onSaveToCollection={handleSaveToCollection}
            />
          )}

          {/* KOLEKSI & PENGATURAN */}
          {activeItem === 'koleksi' && (
            <DocumentCollection
              documents={appState.savedDocuments}
              globalContext={appState.globalContext}
              onDeleteDocument={handleDeleteDocument}
              onNavigateToCreate={() => setActiveItem('dasmen-modul')}
            />
          )}

          {activeItem === 'pengaturan' && (
            <SettingsView
              currentState={appState}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
              onResetToDefaults={handleResetToDefaults}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyChanged={() => setHasApiKey(Boolean(getStoredGeminiKey()))}
      />

      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        currentState={appState}
        onRestoreState={handleRestoreState}
      />
    </div>
  );
}
