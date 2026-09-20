import React, { useState } from 'react';
import { Settings, Key, Download, Upload, Trash2, CheckCircle2, Shield, RefreshCw } from 'lucide-react';
import { getStoredGeminiKey, getStoredModel } from '../../lib/gemini/client';
import { AppStateData } from '../../store/appStore';

interface SettingsViewProps {
  currentState: AppStateData;
  onOpenApiKeyModal: () => void;
  onOpenBackupModal: () => void;
  onResetToDefaults: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentState,
  onOpenApiKeyModal,
  onOpenBackupModal,
  onResetToDefaults
}) => {
  const currentKey = getStoredGeminiKey();
  const currentModel = getStoredModel();
  const [resetConfirm, setResetConfirm] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          Pengaturan Aplikasi & Keamanan Data
        </h3>
        <p className="text-xs text-slate-500">
          Kelola konfigurasi model kecerdasan buatan, pencadangan data mandiri, dan preferensi sistem.
        </p>
      </div>

      {/* BYOK Settings Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Google Gemini API Key (BYOK)</h4>
              <p className="text-xs text-slate-500">Kunci disimpan hanya di LocalStorage peramban Anda.</p>
            </div>
          </div>
          <button
            onClick={onOpenApiKeyModal}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            {currentKey ? 'Kelola Kunci' : 'Masukkan Kunci'}
          </button>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Status Kunci:</span>
            <span className={`font-semibold ${currentKey ? 'text-emerald-700' : 'text-slate-600'}`}>
              {currentKey ? 'Terhubung (Tersimpan Lokal)' : 'Belum Ada (Menggunakan Engine Lokal)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Model Aktif:</span>
            <span className="font-mono text-slate-800 font-medium">{currentModel}</span>
          </div>
        </div>
      </div>

      {/* Backup Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Cadangkan & Pulihkan Berkas</h4>
              <p className="text-xs text-slate-500">Ekspor seluruh modul dan pengaturan ke file JSON mandiri.</p>
            </div>
          </div>
          <button
            onClick={onOpenBackupModal}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Buka Panel Cadangan
          </button>
        </div>
      </div>

      {/* Reset State */}
      <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-rose-900">Reset Data ke Pengaturan Awal</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Menghapus seluruh draf dan mengembalikan konteks ke data percontohan awal.
            </p>
          </div>
          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onResetToDefaults();
                  setResetConfirm(false);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
