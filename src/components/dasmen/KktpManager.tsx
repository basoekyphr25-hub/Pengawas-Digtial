import React, { useState } from 'react';
import { CheckSquare, Sparkles } from 'lucide-react';
import { KKTPCriteria, GlobalContext } from '../../types';
import { generateKKTP } from '../../lib/gemini/prompts';

interface KktpManagerProps {
  globalContext: GlobalContext;
}

export const KktpManager: React.FC<KktpManagerProps> = ({ globalContext }) => {
  const [tpInput, setTpInput] = useState(
    'Peserta didik mampu menganalisis permasalahan lingkungan di sekitar sekolah dan merumuskan solusi berbasis aksi nyata.'
  );
  const [subject, setSubject] = useState('Ilmu Pengetahuan Alam dan Sosial');
  const [isGenerating, setIsGenerating] = useState(false);
  const [kktpList, setKktpList] = useState<KKTPCriteria[]>([
    {
      indicator: 'Mampu mengidentifikasi minimal 3 jenis masalah lingkungan sekolah',
      rubric: {
        perluBimbingan: 'Hanya mampu menyebutkan 1 masalah lingkungan dengan bantuan guru.',
        cukup: 'Menyebutkan 2 masalah lingkungan namun belum mampu menjelaskan penyebabnya.',
        baik: 'Menyebutkan 3 masalah lingkungan secara tepat disertai penjelasan singkat.',
        sangatBaik: 'Menyebutkan lebih dari 3 masalah lingkungan disertai analisis penyebab dan dampaknya.'
      },
      passingThreshold: 'Kategori minimal Baik (76-88%)'
    },
    {
      indicator: 'Merumuskan alternatif solusi solutif dan realistis',
      rubric: {
        perluBimbingan: 'Belum mampu memberikan solusi yang dapat dijalankan secara nyata.',
        cukup: 'Memberikan 1 solusi umum yang membutuhkan banyak bimbingan teknis.',
        baik: 'Memberikan 2 solusi logis dan dapat diimplementasikan di lingkungan sekolah.',
        sangatBaik: 'Merumuskan rencana aksi komprehensif, terukur, dan melibatkan kolaborasi komunitas.'
      },
      passingThreshold: 'Kategori minimal Baik (76-88%)'
    }
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateKKTP({
        selectedTp: [
          {
            id: 'TP-TEMP',
            sequence: 1,
            text: tpInput,
            material: subject,
            competency: 'Menganalisis dan Merumuskan Solusi',
            evidence: 'Rubrik penilaian kualitatif'
          }
        ],
        subject,
        globalContext
      });
      setKktpList(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-violet-600" />
              KKTP & Rubrik Penilaian Ketercapaian
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menentukan interval deskriptif dan kriteria ketuntasan berdasarkan Tujuan Pembelajaran terukur.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !tpInput.trim()}
            className="px-4 py-2 bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Rubrik...' : 'Rumuskan KKTP AI'}</span>
          </button>
        </div>

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-semibold text-slate-700">Tujuan Pembelajaran Sasaran</label>
          <textarea
            rows={2}
            value={tpInput}
            onChange={(e) => setTpInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          />
        </div>
      </div>

      {/* KKTP List Display */}
      <div className="space-y-4">
        {kktpList.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-900">
                Indikator {idx + 1}: {item.indicator}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-violet-50 text-violet-800 rounded-lg border border-violet-200">
                Ambang Tuntas: {item.passingThreshold}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                <span className="font-bold text-rose-800 text-[11px] uppercase tracking-wider block">
                  Perlu Bimbingan (0-60%)
                </span>
                <p className="text-rose-950 text-xs leading-relaxed">{item.rubric.perluBimbingan}</p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-800 text-[11px] uppercase tracking-wider block">
                  Cukup (61-75%)
                </span>
                <p className="text-amber-950 text-xs leading-relaxed">{item.rubric.cukup}</p>
              </div>

              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
                <span className="font-bold text-sky-800 text-[11px] uppercase tracking-wider block">
                  Baik (76-88%)
                </span>
                <p className="text-sky-950 text-xs leading-relaxed">{item.rubric.baik}</p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider block">
                  Sangat Baik (89-100%)
                </span>
                <p className="text-emerald-950 text-xs leading-relaxed">{item.rubric.sangatBaik}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
