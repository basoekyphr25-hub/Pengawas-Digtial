import React from 'react';
import { Menu, Key, Sparkles, Download, CheckCircle2, ShieldCheck, Heart, Building2, Baby } from 'lucide-react';
import { GlobalContext, PathType } from '../../types';
import { NavItem } from './Sidebar';

interface HeaderProps {
  activeItem: NavItem;
  globalContext: GlobalContext;
  activePath: PathType;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenExportImportModal: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (item: NavItem) => void;
}

const TITLES: Record<NavItem, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Administrasi', subtitle: 'Pusat kendali administrasi pembelajaran terpadu berbasis AI' },
  'konteks-identitas': { title: 'Konteks 1: Identitas & Arah Sekolah', subtitle: 'Visi, misi, dan landasan kurikulum sebagai kompas moral pedagogis' },
  'konteks-murid': { title: 'Konteks 2: Profil Murid & Diferensiasi', subtitle: 'Pemetaan non-kognitif, minat, gaya belajar, dan sintesis profil kelas' },
  'konteks-komunitas': { title: 'Konteks 3: Sekolah & Komunitas', subtitle: 'Tantangan lokal, potensi lingkungan, dan integrasi mitra belajar nyata' },
  'dasmen-cp-tp': { title: 'Langkah 1: CP ke TP Parser', subtitle: 'Memecah Capaian Pembelajaran menjadi rangkaian Tujuan Pembelajaran terukur' },
  'dasmen-atp': { title: 'Langkah 2: ATP Kronologis', subtitle: 'Menyusun Learning Journey dan integrasi Dimensi Profil Lulusan / Panca Cinta' },
  'dasmen-pilih-tp': { title: 'Langkah 3: Pilih TP', subtitle: 'Pilih TP untuk dikembangkan jadi modul ajar lengkap dengan KKTP & instrumen asesmen' },
  'dasmen-modul': { title: 'Langkah 4: Kembangkan Modul Ajar', subtitle: 'Kembangkan TP menjadi modul ajar lengkap dengan profil lulusan, asesmen, & KKTP' },
  'dasmen-kktp': { title: 'KKTP & Rubrik Ketercapaian', subtitle: 'Indikator dan interval kriteria ketuntasan tujuan pembelajaran' },
  'dasmen-lkpd': { title: 'Lembar Kerja Peserta Didik (LKPD)', subtitle: 'LKPD siap cetak yang berdiferensiasi dan relevan dengan lingkungan murid' },
  'dasmen-projek': { title: 'Kokurikuler - Delapan Profil Lulusan (DPL)', subtitle: 'Modul kokurikuler 4 alur: Pengenalan, Kontekstualisasi, Aksi, Refleksi' },
  'paud-fondasi': { title: 'TP Fondasi PAUD / RA (3 Elemen)', subtitle: 'Nilai Agama & Budi Pekerti, Jati Diri, dan Dasar Literasi & STEAM' },
  'paud-tema': { title: 'Tema Bermain & Bundling TP', subtitle: 'Eksplorasi tema bermain bermakna berbasis minat anak dan sumber daya lokal' },
  'paud-modul': { title: 'Modul Ajar Bermain PAUD', subtitle: 'Backward Design ramah anak dengan invitasia loose parts dan asesmen non-angka' },
  'paud-projek': { title: 'Kokurikuler PAUD', subtitle: 'Penguatan 6 kemampuan fondasi melalui eksplorasi bermain terpadu' },
  koleksi: { title: 'Koleksi Dokumen Administrasi', subtitle: 'Arsip seluruh Modul Ajar, ATP, LKPD, dan Dokumen Kokurikuler yang tersimpan' },
  pengaturan: { title: 'Pengaturan & Cadangan Data', subtitle: 'Manajemen Gemini API Key (BYOK) dan pencadangan data client-side' }
};

export const Header: React.FC<HeaderProps> = ({
  activeItem,
  globalContext,
  activePath,
  hasApiKey,
  onOpenApiKeyModal,
  onOpenExportImportModal,
  onToggleMobileMenu,
  onNavigate
}) => {
  const current = TITLES[activeItem] || { title: 'Pengawas Digital', subtitle: 'Administrasi Pembelajaran AI' };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base lg:text-lg font-bold text-slate-900 leading-tight">
              {current.title}
            </h2>
            <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              activePath === 'dasmen'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {activePath === 'dasmen' ? <Building2 className="w-3 h-3" /> : <Baby className="w-3 h-3" />}
              {activePath.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Context Status Pill */}
        <button
          onClick={() => onNavigate('konteks-identitas')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
          title="Status Kelengkapan Tiga Konteks Global"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>3/3 Konteks Terinjeksi</span>
        </button>

        {/* Gemini BYOK Pill */}
        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            hasApiKey
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-600' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">
            {hasApiKey ? 'Gemini API Aktif' : 'BYOK Kunci'}
          </span>
        </button>

        {/* Quick Backup button */}
        <button
          onClick={onOpenExportImportModal}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          title="Cadangkan dan Pulihkan Data"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Cadangan</span>
        </button>
      </div>
    </header>
  );
};
