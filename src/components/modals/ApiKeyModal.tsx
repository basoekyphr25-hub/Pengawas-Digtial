import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Trash2, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { getStoredGeminiKey, saveGeminiKey, removeGeminiKey, getStoredModel, saveSelectedModel, testGeminiConnection } from '../../lib/gemini/client';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChanged?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyChanged }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredGeminiKey());
      setSelectedModel(getStoredModel());
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveGeminiKey(apiKey);
    saveSelectedModel(selectedModel);
    setSavedSuccess(true);
    if (onKeyChanged) onKeyChanged();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRemove = () => {
    removeGeminiKey();
    setApiKey('');
    setTestResult({ success: false, message: 'API Key telah dihapus dari browser Anda.' });
    if (onKeyChanged) onKeyChanged();
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Masukkan API Key terlebih dahulu untuk menguji koneksi.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiConnection(apiKey, selectedModel);
      setTestResult(res);
      if (res.success) {
        saveGeminiKey(apiKey);
        saveSelectedModel(selectedModel);
        if (onKeyChanged) onKeyChanged();
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Key className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">Pengaturan Gemini API Key (BYOK)</h3>
              <p className="text-xs text-emerald-150 text-emerald-100/90 mt-0.5">Bring Your Own Key — Privasi Client-Side Terjamin</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex gap-3 items-start text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-800">Privasi Pendidik Terlindungi</p>
              <p className="mt-0.5 text-emerald-700 leading-relaxed">
                API Key Anda hanya disimpan secara lokal di peramban (LocalStorage). Kami tidak menyimpan atau mengirimkan kunci Anda ke server eksternal apa pun.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Contoh: AIzaSy..."
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showKey ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500">
              <span>Belum memiliki API Key?</span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 underline underline-offset-2"
              >
                Dapatkan di Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilihan Model LLM
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-sm bg-white"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Sangat Cepat & Direkomendasikan)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Penalaran Pedagogis Kompleks)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Model Mutakhir Responsif)</option>
            </select>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              testResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan berhasil disimpan di penyimpanan browser!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {apiKey && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Kunci
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !apiKey}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Menguji...' : 'Tes Koneksi'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Simpan & Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
