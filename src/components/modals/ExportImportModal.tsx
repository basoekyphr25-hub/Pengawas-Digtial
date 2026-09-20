import React, { useState, useRef } from 'react';
import { Download, Upload, RefreshCw, FileText, CheckCircle2, AlertCircle, X, Shield } from 'lucide-react';
import { AppStateData } from '../../store/appStore';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: AppStateData;
  onRestoreState: (state: AppStateData) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onRestoreState
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [stagedData, setStagedData] = useState<AppStateData | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentState, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `pengawas-digital-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSummary(null);
    setStagedData(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('File bukan format JSON yang valid.');
        }

        const docCount = parsed.savedDocuments?.length || 0;
        const schoolName = parsed.globalContext?.identity?.schoolName || 'Tidak Diketahui';
        const teacherName = parsed.globalContext?.identity?.teacherName || 'Guru';

        setStagedData(parsed);
        setImportSummary(
          `Ditemukan data cadangan valid:\n• Sekolah: ${schoolName}\n• Pendidik: ${teacherName}\n• Jumlah Dokumen Tersimpan: ${docCount}`
        );
      } catch (err: any) {
        setImportError(err?.message || 'Gagal membaca berkas cadangan JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!stagedData) return;
    onRestoreState(stagedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Download className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">Cadangkan & Pulihkan Data</h3>
              <p className="text-xs text-slate-300 mt-0.5">Simpan atau pindahkan data administrasi pembelajaran</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-slate-700">
          {/* Export section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" /> Ekspor Seluruh Data (JSON)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Unduh seluruh Konteks Global (Identitas, Profil Murid, Komunitas), draf Modul Ajar, ATP, dan arsip dokumen Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm transition-colors"
              >
                Unduh Cadangan
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-sky-600" /> Impor & Pulihkan Berkas Cadangan
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Pilih file `.json` yang sebelumnya telah diekspor dari aplikasi Pengawas Digital ini.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl text-xs font-medium text-slate-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              Pilih Berkas JSON Cadangan
            </button>

            {importSummary && (
              <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 whitespace-pre-line leading-relaxed">
                {importSummary}
              </div>
            )}

            {importError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
          >
            Tutup
          </button>
          {stagedData && (
            <button
              type="button"
              onClick={handleApplyRestore}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              Pulihkan Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
