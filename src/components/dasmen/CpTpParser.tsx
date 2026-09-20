import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  BookOpen, 
  Search,
  X,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Layers
} from 'lucide-react';
import { TargetPembelajaran, Phase, GlobalContext } from '../../types';
import { SUBJECT_OPTIONS, PHASE_MAPPINGS, DEFAULT_CP_PRESETS } from '../../data/curriculumData';
import { parseCpToTp } from '../../lib/gemini/prompts';

interface CpTpParserProps {
  globalContext: GlobalContext;
  onSaveTpList: (tps: TargetPembelajaran[]) => void;
  onProceedToAtp?: () => void;
  onNavigate?: (item: any) => void;
}

export const CpTpParser: React.FC<CpTpParserProps> = ({
  globalContext,
  onSaveTpList,
  onProceedToAtp,
  onNavigate
}) => {
  // 1. Form state according to screenshot
  const [subjectName, setSubjectName] = useState<string>('');
  const [phase, setPhase] = useState<Phase | ''>('');
  const [grade, setGrade] = useState<string>('');
  const [element, setElement] = useState<string>('');
  const [cpText, setCpText] = useState<string>('');

  // 2. Generation & UI state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [tps, setTps] = useState<TargetPembelajaran[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCpModal, setShowCpModal] = useState<boolean>(false);
  const [cpSearchQuery, setCpSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available grades for the chosen phase
  const availableGrades = phase && PHASE_MAPPINGS[phase as Phase] 
    ? PHASE_MAPPINGS[phase as Phase].grades 
    : [];

  // Update grade when phase changes
  const handlePhaseChange = (newPhase: Phase | '') => {
    setPhase(newPhase);
    if (newPhase && PHASE_MAPPINGS[newPhase as Phase]) {
      const grades = PHASE_MAPPINGS[newPhase as Phase].grades;
      setGrade(grades[0] || '');
    } else {
      setGrade('');
    }
  };

  const handleGenerate = async () => {
    if (!cpText.trim()) return;

    setIsGenerating(true);
    setGenerationStep('Menganalisis Capaian Pembelajaran (CP)...');

    try {
      const result = await parseCpToTp({
        subjectName: subjectName.trim() || 'Mata Pelajaran',
        phase: phase || 'D',
        grade: grade || 'Kelas Awal',
        element: element.trim() || undefined,
        cpText,
        curriculum: globalContext.identity.curriculum,
        globalContext
      });

      setTps(result);
      onSaveTpList(result);
    } catch (e) {
      console.error('Gagal memproses CP ke TP:', e);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleAddCustomTp = () => {
    const newId = `TP-${String(tps.length + 1).padStart(2, '0')}`;
    const newTp: TargetPembelajaran = {
      id: newId,
      sequence: tps.length + 1,
      text: `Tujuan pembelajaran baru untuk ${subjectName || 'materi ini'}...`,
      material: 'Materi Pokok Baru',
      competency: 'Menganalisis (C4)',
      evidence: 'Bukti ketercapaian terukur...',
      pancaCintaTopic: globalContext.identity.curriculum === 'kbc' ? 'Cinta Ilmu Pengetahuan' : undefined,
      pancasilaDimension: globalContext.identity.curriculum === 'merdeka' ? 'Bernalar Kritis' : undefined
    };
    const updated = [...tps, newTp];
    setTps(updated);
    onSaveTpList(updated);
  };

  const handleDeleteTp = (id: string) => {
    const updated = tps.filter(t => t.id !== id).map((t, idx) => ({ ...t, sequence: idx + 1 }));
    setTps(updated);
    onSaveTpList(updated);
  };

  const handleUpdateTpText = (id: string, newText: string) => {
    const updated = tps.map(t => t.id === id ? { ...t, text: newText } : t);
    setTps(updated);
    onSaveTpList(updated);
  };

  const handleCopyTp = (tp: TargetPembelajaran) => {
    navigator.clipboard.writeText(`${tp.id}: ${tp.text} (Materi: ${tp.material} | KKO: ${tp.competency})`);
    setCopiedId(tp.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSelectPresetCp = (subjectKey: string, phaseKey: string, presetText: string, subjName: string) => {
    setCpText(presetText);
    setSubjectName(subjName);
    setPhase(phaseKey as Phase);
    if (PHASE_MAPPINGS[phaseKey as Phase]) {
      setGrade(PHASE_MAPPINGS[phaseKey as Phase].grades[0] || '');
    }
    setShowCpModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      {/* Header & 4-Step Stepper Navigation */}
      <div>
        <span className="block text-[11px] font-bold tracking-wider text-blue-600 uppercase mb-1">
          MODUL AJAR · INTRAKURIKULER
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
          Buat Modul Ajar
        </h2>

        {/* 4 Steps Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
          {/* Step 1: Active */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              CP & Tujuan
            </span>
          </div>

          {/* Step 2: Inactive */}
          <button
            type="button"
            onClick={() => onProceedToAtp ? onProceedToAtp() : onNavigate?.('dasmen-atp')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-xs font-medium truncate">
              Alur (ATP)
            </span>
          </button>

          {/* Step 3: Inactive */}
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-pilih-tp')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-xs font-medium truncate">
              Pilih TP
            </span>
          </button>

          {/* Step 4: Inactive */}
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-modul')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center shrink-0">
              4
            </span>
            <span className="text-xs font-medium truncate">
              Kembangkan
            </span>
          </button>
        </div>
      </div>

      {/* Main Card: Mata pelajaran & Capaian Pembelajaran */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Mata pelajaran & Capaian Pembelajaran
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Identitas sekolah & profil murid sudah tersimpan di beranda — di sini cukup konteks mapelnya.
          </p>
        </div>

        {/* Row 1: Mata Pelajaran & Fase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Mata Pelajaran
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="mis. Bahasa Indonesia"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Fase — <span className="font-normal text-slate-500">pilih dulu</span>
            </label>
            <select
              value={phase}
              onChange={(e) => handlePhaseChange(e.target.value as Phase | '')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">— pilih fase —</option>
              <option value="Fondasi">Fase Fondasi (PAUD / RA)</option>
              <option value="A">Fase A (Kelas 1-2 SD/MI)</option>
              <option value="B">Fase B (Kelas 3-4 SD/MI)</option>
              <option value="C">Fase C (Kelas 5-6 SD/MI)</option>
              <option value="D">Fase D (Kelas 7-9 SMP/MTs)</option>
              <option value="E">Fase E (Kelas 10 SMA/SMK/MA)</option>
              <option value="F">Fase F (Kelas 11-12 SMA/SMK/MA)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Kelas */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Kelas — <span className="font-normal text-slate-500">otomatis mengikuti fase</span>
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            disabled={!phase}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-400"
          >
            {!phase ? (
              <option value="">— pilih fase dulu —</option>
            ) : (
              availableGrades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))
            )}
          </select>
        </div>

        {/* Row 3: Elemen (opsional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Elemen <span className="font-normal text-slate-500">(opsional) — isi bila mau menurunkan CP per elemen</span>
          </label>
          <input
            type="text"
            value={element}
            onChange={(e) => setElement(e.target.value)}
            placeholder="mis. Membaca-Memirsa"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Row 4: Capaian Pembelajaran (CP) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-800">
              Capaian Pembelajaran (CP) ·{' '}
              <button
                type="button"
                onClick={() => setShowCpModal(true)}
                className="text-blue-600 hover:text-blue-700 underline font-normal cursor-pointer"
              >
                cari CP resmi Kemendikdasmen →
              </button>
            </label>
          </div>
          <textarea
            rows={4}
            value={cpText}
            onChange={(e) => setCpText(e.target.value)}
            placeholder="Tempel CP dari dokumen resmi di sini"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Row 5: Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !cpText.trim()}
            className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#1a3a5a] disabled:opacity-50 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? (generationStep || 'Sedang menurunkan TP...') : 'Turunkan jadi TP'}</span>
          </button>
        </div>
      </div>

      {/* Generated TPs Section */}
      {tps.length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Tujuan Pembelajaran Hasil Analisis ({tps.length} TP)
              </h4>
              <p className="text-xs text-slate-500">
                Setiap butir TP memuat kompetensi terukur (Taksonomi Bloom) dan materi pokok yang siap dialurkan ke ATP.
              </p>
            </div>
            <button
              onClick={handleAddCustomTp}
              className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah TP Mandiri</span>
            </button>
          </div>

          <div className="space-y-3">
            {tps.map((tp) => (
              <div 
                key={tp.id} 
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#0f2942] text-white font-mono text-xs font-bold rounded-lg shadow-2xs">
                      {tp.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Urutan ke-{tp.sequence}</span>
                    {tp.pancaCintaTopic && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                        {tp.pancaCintaTopic}
                      </span>
                    )}
                    {tp.pancasilaDimension && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                        {tp.pancasilaDimension}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyTp(tp)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Salin TP"
                    >
                      {copiedId === tp.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingId(editingId === tp.id ? null : tp.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit TP"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTp(tp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus TP"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingId === tp.id ? (
                  <textarea
                    rows={2}
                    value={tp.text}
                    onChange={(e) => handleUpdateTpText(tp.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-blue-500 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                    {tp.text}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-semibold">Materi Pokok:</span>
                    <span className="text-slate-700 font-medium">{tp.material}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Kompetensi (KKO):</span>
                    <span className="text-slate-700 font-medium">{tp.competency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Bukti Ketercapaian:</span>
                    <span className="text-slate-700 font-medium">{tp.evidence}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Next Step Button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => onProceedToAtp ? onProceedToAtp() : onNavigate?.('dasmen-atp')}
                className="px-6 py-2.5 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Lanjut ke Langkah 2: Alur (ATP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cari CP Resmi Kemendikdasmen */}
      {showCpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Pustaka CP Resmi Kemendikdasmen & Kemenag
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih Capaian Pembelajaran resmi sesuai Keputusan BSKAP No. 032/H/KR/2024
                </p>
              </div>
              <button
                onClick={() => setShowCpModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={cpSearchQuery}
                  onChange={(e) => setCpSearchQuery(e.target.value)}
                  placeholder="Cari mata pelajaran (mis. Bahasa Indonesia, Matematika, IPA, Fikih)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <a
                href="https://kurikulum.kemdikbud.go.id/rujukan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold px-2 py-1 shrink-0"
              >
                <span>Portal Resmi</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Modal Presets List */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 divide-y divide-slate-100">
              {SUBJECT_OPTIONS
                .filter(s => s.name.toLowerCase().includes(cpSearchQuery.toLowerCase()))
                .map((subj) => {
                  const subjectPresets = DEFAULT_CP_PRESETS[subj.id];
                  if (!subjectPresets) return null;

                  return (
                    <div key={subj.id} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{subj.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded-full font-semibold">
                          {subj.category}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(subjectPresets).map(([phaseKey, text]) => (
                          <div 
                            key={phaseKey}
                            className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-300 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md inline-block mb-1">
                                Fase {phaseKey}
                              </span>
                              <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                                {text}
                              </p>
                            </div>
                            <div className="pt-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleSelectPresetCp(subj.id, phaseKey, text, subj.name)}
                                className="px-2.5 py-1 bg-[#0f2942] hover:bg-[#1a3a5a] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-colors"
                              >
                                Gunakan CP Ini
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCpModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
