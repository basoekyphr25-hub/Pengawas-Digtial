import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Route, 
  FileSpreadsheet, 
  Sparkles, 
  Baby, 
  CheckCircle2, 
  Download, 
  Printer, 
  Key, 
  Compass, 
  ArrowRight,
  Clock,
  Trash2
} from 'lucide-react';
import { GlobalContext, PathType, SavedDocument } from '../../types';
import { NavItem } from '../layout/Sidebar';
import { exportModulAjarToDocx, exportLkpdToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printModulAjar, printLkpd } from '../../lib/export/pdfExport';

interface DashboardProps {
  globalContext: GlobalContext;
  activePath: PathType;
  savedDocuments: SavedDocument[];
  hasApiKey: boolean;
  onNavigate: (item: NavItem) => void;
  onOpenApiKeyModal: () => void;
  onOpenBackupModal: () => void;
  onDeleteDocument: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  globalContext,
  activePath,
  savedDocuments,
  hasApiKey,
  onNavigate,
  onOpenApiKeyModal,
  onOpenBackupModal,
  onDeleteDocument
}) => {
  const modulCount = savedDocuments.filter(d => d.category === 'modul_dasmen' || d.category === 'modul_paud').length;
  const lkpdCount = savedDocuments.filter(d => d.category === 'lkpd').length;
  const projectCount = savedDocuments.filter(d => d.category === 'projek_p5' || d.category === 'kokurikuler').length;

  const handleExportDoc = async (doc: SavedDocument) => {
    try {
      if (doc.category === 'modul_dasmen') {
        const blob = await exportModulAjarToDocx(doc.data, globalContext);
        downloadBlob(blob, `${doc.title}.docx`);
      } else if (doc.category === 'lkpd') {
        const blob = await exportLkpdToDocx(doc.data, globalContext);
        downloadBlob(blob, `${doc.title}.docx`);
      }
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  const handlePrintDoc = (doc: SavedDocument) => {
    if (doc.category === 'modul_dasmen') {
      printModulAjar(doc.data, globalContext);
    } else if (doc.category === 'lkpd') {
      printLkpd(doc.data, globalContext);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Administrasi Pembelajaran AI • Powered by Basuki, S.Kom.</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang, {globalContext.identity.teacherName || 'Bapak/Ibu Guru'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Perangkat administrasi mengajar terpadu untuk <strong>{globalContext.identity.schoolName}</strong> ({globalContext.identity.cityDistrict}). Dirancang khusus untuk Kurikulum Merdeka & Kurikulum Berbasis Cinta (KBC) dengan prinsip Backward Design (UbD).
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => onNavigate('dasmen-modul')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Susun Modul Ajar Lengkap</span>
            </button>
            <button
              onClick={() => onNavigate('konteks-identitas')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>Perbarui Konteks Global</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 block">{modulCount}</span>
            <span className="text-xs text-slate-500 font-medium">Modul Ajar Tersimpan</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 block">{lkpdCount}</span>
            <span className="text-xs text-slate-500 font-medium">LKPD Siap Cetak</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 block">{projectCount}</span>
            <span className="text-xs text-slate-500 font-medium">Dokumen Kokurikuler</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 block">3 / 3</span>
            <span className="text-xs text-slate-500 font-medium">Konteks Global Aktif</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Akses Cepat Modul Pembelajaran</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div 
            onClick={() => onNavigate('dasmen-cp-tp')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer shadow-2xs hover:border-emerald-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Langkah 1: CP ke TP Parser</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pecah Capaian Pembelajaran nasional menjadi butir-butir Tujuan Pembelajaran dengan Taksonomi Bloom.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('dasmen-atp')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer shadow-2xs hover:border-indigo-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Route className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Langkah 2: ATP Kronologis</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Susun alur belajar tahunan, distribusi alokasi JP per semester, dan integrasi pilar karakter.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('dasmen-modul')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer shadow-2xs hover:border-emerald-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Modul Ajar (11 Langkah)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wizard Backward Design lengkap: asesmen kognitif, pemantik, diferensiasi konten, proses, produk.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('dasmen-lkpd')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer shadow-2xs hover:border-blue-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">LKPD Berdiferensiasi</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lembar Kerja Peserta Didik siap cetak dengan ruang jawaban siswa dan studi kasus lingkungan nyata.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('dasmen-projek')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer shadow-2xs hover:border-amber-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Kokurikuler (DPL)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              4 alur tahapan kokurikuler (Pengenalan, Kontekstualisasi, Aksi, Refleksi) berbasis Delapan Profil Lulusan.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('paud-fondasi')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer shadow-2xs hover:border-rose-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Baby className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Suite PAUD & RA (Fondasi)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              3 Elemen fondasi, tema bermain kontekstual, invitasi loose parts, dan asesmen autentik non-angka.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Arsip Dokumen Terbaru</h3>
            <p className="text-xs text-slate-500">Dokumen administrasi yang siap diekspor ke format Microsoft Word atau dicetak PDF.</p>
          </div>
          <button
            onClick={() => onNavigate('koleksi')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Lihat Semua Arsip
          </button>
        </div>

        {savedDocuments.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">Belum Ada Dokumen Tersimpan</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Gunakan wizard Modul Ajar, LKPD, atau Kokurikuler di atas untuk membuat dokumen pertama Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {savedDocuments.slice(0, 5).map((doc) => (
              <div key={doc.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.category.includes('modul') ? 'bg-emerald-100 text-emerald-800' :
                      doc.category === 'lkpd' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.category === 'projek_p5' || doc.category === 'kokurikuler' ? 'KOKURIKULER (DPL)' : doc.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900">{doc.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {doc.subjectOrTheme} • {doc.gradeOrAge} • Tanggal: {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExportDoc(doc)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Ekspor DOCX (Word)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePrintDoc(doc)}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Cetak PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
