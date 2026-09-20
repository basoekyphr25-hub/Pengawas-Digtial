import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Users, 
  Building2, 
  Layers, 
  Route, 
  BookOpen, 
  CheckSquare, 
  FileSpreadsheet, 
  Sparkles, 
  Baby, 
  Puzzle, 
  FolderArchive, 
  Settings, 
  ShieldAlert, 
  GraduationCap, 
  ChevronRight,
  Heart,
  Key
} from 'lucide-react';
import { PathType, CurriculumType } from '../../types';

export type NavItem = 
  | 'dashboard'
  | 'konteks-identitas'
  | 'konteks-murid'
  | 'konteks-komunitas'
  | 'dasmen-cp-tp'
  | 'dasmen-atp'
  | 'dasmen-pilih-tp'
  | 'dasmen-modul'
  | 'dasmen-kktp'
  | 'dasmen-lkpd'
  | 'dasmen-projek'
  | 'paud-fondasi'
  | 'paud-tema'
  | 'paud-modul'
  | 'paud-projek'
  | 'koleksi'
  | 'pengaturan';

interface SidebarProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
  activePath: PathType;
  onPathChange: (path: PathType) => void;
  curriculum: CurriculumType;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onNavigate,
  activePath,
  onPathChange,
  curriculum,
  hasApiKey,
  onOpenApiKeyModal,
  isOpenMobile,
  onCloseMobile
}) => {
  const handleItemClick = (item: NavItem) => {
    onNavigate(item);
    onCloseMobile();
  };

  const navButtonClass = (target: NavItem) => {
    const isActive = activeItem === target;
    return `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
      isActive 
        ? 'bg-emerald-700 text-white font-semibold shadow-sm' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden" 
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-900/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight leading-none text-white">APK MODUL AJAR</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  By Basuki, S.Kom.
                </span>
              </div>
            </div>
          </div>

          {/* Path Selector Tabs */}
          <div className="mt-3.5 grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => onPathChange('dasmen')}
              className={`py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activePath === 'dasmen'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>DASMEN</span>
            </button>
            <button
              onClick={() => onPathChange('paud')}
              className={`py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activePath === 'paud'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Baby className="w-3.5 h-3.5" />
              <span>PAUD / RA</span>
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Main Dashboard */}
          <div>
            <button
              onClick={() => handleItemClick('dashboard')}
              className={navButtonClass('dashboard')}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Utama</span>
              </div>
            </button>
          </div>

          {/* Global Context Engine */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <span>Konteks Global (1-3)</span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleItemClick('konteks-identitas')}
                className={navButtonClass('konteks-identitas')}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>1. Identitas & Arah</span>
                </div>
                {curriculum === 'kbc' ? (
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">KBC</span>
                ) : (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Merdeka</span>
                )}
              </button>

              <button
                onClick={() => handleItemClick('konteks-murid')}
                className={navButtonClass('konteks-murid')}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>2. Profil Murid & Dif.</span>
                </div>
              </button>

              <button
                onClick={() => handleItemClick('konteks-komunitas')}
                className={navButtonClass('konteks-komunitas')}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>3. Sekolah & Mitra</span>
                </div>
              </button>
            </div>
          </div>

          {/* PATH DASMEN MENU */}
          {activePath === 'dasmen' && (
            <div>
              <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-emerald-800 uppercase flex items-center justify-between">
                <span>Alur DASMEN (SD - SMA)</span>
                <span className="text-[10px] font-normal text-slate-400">Backward</span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleItemClick('dasmen-cp-tp')}
                  className={navButtonClass('dasmen-cp-tp')}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Langkah 1: CP → TP</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('dasmen-atp')}
                  className={navButtonClass('dasmen-atp')}
                >
                  <div className="flex items-center gap-2.5">
                    <Route className="w-4 h-4 text-indigo-600" />
                    <span>Langkah 2: ATP Kronologis</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('dasmen-pilih-tp')}
                  className={navButtonClass('dasmen-pilih-tp')}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>Langkah 3: Pilih TP</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('dasmen-modul')}
                  className={navButtonClass('dasmen-modul')}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Langkah 4: Kembangkan</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('dasmen-kktp')}
                  className={navButtonClass('dasmen-kktp')}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-violet-600" />
                    <span>KKTP & Rubrik Penilaian</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('dasmen-lkpd')}
                  className={navButtonClass('dasmen-lkpd')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    <span>LKPD Siap Cetak</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('dasmen-projek')}
                  className={navButtonClass('dasmen-projek')}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Kokurikuler (DPL)</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* PATH PAUD / RA MENU */}
          {activePath === 'paud' && (
            <div>
              <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-amber-800 uppercase flex items-center justify-between">
                <span>Alur PAUD / RA</span>
                <span className="text-[10px] font-normal text-slate-400">Fondasi</span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleItemClick('paud-fondasi')}
                  className={navButtonClass('paud-fondasi')}
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>3 Elemen TP Fondasi</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('paud-tema')}
                  className={navButtonClass('paud-tema')}
                >
                  <div className="flex items-center gap-2.5">
                    <Puzzle className="w-4 h-4 text-amber-600" />
                    <span>Tema Bermain & Bundling</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('paud-modul')}
                  className={navButtonClass('paud-modul')}
                >
                  <div className="flex items-center gap-2.5">
                    <Baby className="w-4 h-4 text-emerald-600" />
                    <span>Modul Ajar Bermain PAUD</span>
                  </div>
                </button>

                <button
                  onClick={() => handleItemClick('paud-projek')}
                  className={navButtonClass('paud-projek')}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <span>Kokurikuler 6 Fondasi</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Utilities & Settings */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Pengelolaan & Berkas</span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleItemClick('koleksi')}
                className={navButtonClass('koleksi')}
              >
                <div className="flex items-center gap-2.5">
                  <FolderArchive className="w-4 h-4 text-slate-600" />
                  <span>Koleksi Dokumen</span>
                </div>
              </button>

              <button
                onClick={() => handleItemClick('pengaturan')}
                className={navButtonClass('pengaturan')}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span>Cadangkan / Pengaturan</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer BYOK status card */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[11px] font-semibold text-slate-700">
                  {hasApiKey ? 'Gemini AI Aktif' : 'Engine Lokal'}
                </span>
              </div>
              <button
                onClick={onOpenApiKeyModal}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                {hasApiKey ? 'Ubah Kunci' : 'Set Kunci'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
              {hasApiKey 
                ? 'Model Google Gemini siap menghasilkan dokumen kontekstual.'
                : 'Kunci BYOK opsional. Generator pedagogis cerdas siap dipakai!'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
