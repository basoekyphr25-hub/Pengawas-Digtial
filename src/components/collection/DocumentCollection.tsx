import React, { useState } from 'react';
import { FolderArchive, Search, Download, Printer, Trash2, FileText } from 'lucide-react';
import { SavedDocument, GlobalContext } from '../../types';
import { exportModulAjarToDocx, exportLkpdToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printModulAjar, printLkpd } from '../../lib/export/pdfExport';

interface DocumentCollectionProps {
  documents: SavedDocument[];
  globalContext: GlobalContext;
  onDeleteDocument: (id: string) => void;
  onNavigateToCreate: () => void;
}

export const DocumentCollection: React.FC<DocumentCollectionProps> = ({
  documents,
  globalContext,
  onDeleteDocument,
  onNavigateToCreate
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDocs = documents.filter(doc => {
    if (filterType !== 'all') {
      if (filterType === 'kokurikuler' || filterType === 'projek_p5') {
        if (doc.category !== 'kokurikuler' && doc.category !== 'projek_p5') return false;
      } else if (doc.category !== filterType) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.subjectOrTheme.toLowerCase().includes(q) ||
        doc.gradeOrAge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = async (doc: SavedDocument) => {
    try {
      if (doc.category === 'modul_dasmen') {
        const blob = await exportModulAjarToDocx(doc.data, globalContext);
        downloadBlob(blob, `${doc.title}.docx`);
      } else if (doc.category === 'lkpd') {
        const blob = await exportLkpdToDocx(doc.data, globalContext);
        downloadBlob(blob, `${doc.title}.docx`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = (doc: SavedDocument) => {
    if (doc.category === 'modul_dasmen') {
      printModulAjar(doc.data, globalContext);
    } else if (doc.category === 'lkpd') {
      printLkpd(doc.data, globalContext);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Header & Search Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-slate-700" />
              Koleksi & Arsip Dokumen Administrasi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola dokumen yang telah Anda susun. Tersedia opsi unduh format Microsoft Word (.docx) dan cetak langsung.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            Total: {documents.length} Dokumen
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul, mapel, atau kelas..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('modul_dasmen')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterType === 'modul_dasmen' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Modul DASMEN
            </button>
            <button
              onClick={() => setFilterType('modul_paud')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterType === 'modul_paud' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Modul PAUD
            </button>
            <button
              onClick={() => setFilterType('lkpd')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterType === 'lkpd' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              LKPD
            </button>
            <button
              onClick={() => setFilterType('kokurikuler')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterType === 'kokurikuler' || filterType === 'projek_p5' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Kokurikuler (DPL)
            </button>
            <button
              onClick={() => setFilterType('asesmen_non_kognitif')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterType === 'asesmen_non_kognitif' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Asesmen Non-Kognitif
            </button>
          </div>
        </div>
      </div>

      {/* Grid of documents */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Tidak Ada Dokumen yang Ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Belum ada dokumen yang sesuai dengan kriteria pencarian Anda. Buat modul ajar atau LKPD baru sekarang.
            </p>
            <button
              onClick={onNavigateToCreate}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Mulai Susun Dokumen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      doc.category === 'modul_dasmen' ? 'bg-emerald-100 text-emerald-800' :
                      doc.category === 'modul_paud' ? 'bg-rose-100 text-rose-800' :
                      doc.category === 'lkpd' ? 'bg-blue-100 text-blue-800' :
                      doc.category === 'asesmen_non_kognitif' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.category === 'projek_p5' || doc.category === 'kokurikuler' ? 'KOKURIKULER (DPL)' : 
                       doc.category === 'asesmen_non_kognitif' ? 'ASESMEN AWAL NON-KOGNITIF' :
                       doc.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {doc.subjectOrTheme} • {doc.gradeOrAge}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExport(doc)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Ekspor ke Microsoft Word (.docx)"
                    >
                      <Download className="w-3.5 h-3.5" /> DOCX
                    </button>
                    <button
                      onClick={() => handlePrint(doc)}
                      className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Cetak format cetak PDF"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus dokumen"
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
