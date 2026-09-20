import React, { useState } from 'react';
import { Puzzle, Sparkles, ArrowRight, Clock, Leaf, Lightbulb } from 'lucide-react';
import { PaudPlayTheme, GlobalContext } from '../../types';
import { generatePaudThemesAndTP } from '../../lib/gemini/prompts';

interface PaudTemaBuilderProps {
  globalContext: GlobalContext;
  onSelectThemeForModul?: (theme: PaudPlayTheme) => void;
}

export const PaudTemaBuilder: React.FC<PaudTemaBuilderProps> = ({
  globalContext,
  onSelectThemeForModul
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [childInterest, setChildInterest] = useState('Eksplorasi tanaman hijau, air, tanah, dan berkebun di sekolah');
  const [themes, setThemes] = useState<PaudPlayTheme[]>([
    {
      id: 'TEMA-PAUD-01',
      themeName: 'Petualang Lingkungan Hijau',
      subTheme: 'Rahasia Daun, Biji, dan Tanah Gembur',
      estimatedWeeks: 2,
      childInterestTrigger: 'Anak-anak senang mengumpulkan daun kering aneka bentuk dan menyiram bibit tanaman.',
      localEnvironmentResource: 'Kebun sekolah, daun berbagai ukuran, ranting kering, pot daur ulang, tanah, air.',
      associatedTpIds: ['TP-PAUD-01', 'TP-PAUD-03']
    },
    {
      id: 'TEMA-PAUD-02',
      themeName: 'Pasar Tradisional dan Buah Segar',
      subTheme: 'Mengenal Rasa, Warna, dan Bermain Peran Sahabat',
      estimatedWeeks: 2,
      childInterestTrigger: 'Bermain peran jual beli sayur dan buah lokal dengan uang kertas mainan.',
      localEnvironmentResource: 'Keranjang anyaman bambu, buah lokal, timbangan kayu mini, sendok kayu.',
      associatedTpIds: ['TP-PAUD-02', 'TP-PAUD-03']
    }
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generatePaudThemesAndTP({
        childInterest,
        schoolContext: globalContext.identity.schoolName,
        globalContext
      });
      if (res.playThemes && res.playThemes.length > 0) {
        setThemes(res.playThemes);
      }
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
              <Puzzle className="w-5 h-5 text-amber-600" />
              Tema Bermain & Bundling Tujuan Pembelajaran (PAUD)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tema bermain kontekstual yang membundel 3 elemen Capaian Pembelajaran dan material lepasan (loose parts).
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Tema...' : 'Generate Tema Bermain AI'}</span>
          </button>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Fokus Minat & Observasi Kebutuhan Bermain Anak
          </label>
          <input
            type="text"
            value={childInterest}
            onChange={(e) => setChildInterest(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            placeholder="Contoh: Eksplorasi air, binatang peliharaan, alat transportasi lokal..."
          />
        </div>
      </div>

      <div className="space-y-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-amber-300 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-600 text-white font-bold text-xs rounded-lg shadow-2xs">
                  {theme.id}
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{theme.themeName}</h4>
                  <p className="text-xs text-amber-900 font-medium">Sub-Tema: {theme.subTheme}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Estimasi: {theme.estimatedWeeks} Minggu
              </span>
            </div>

            {/* Trigger Minat Anak */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Pemantik Minat Bermain Anak:
              </span>
              <p className="text-slate-700 leading-relaxed">{theme.childInterestTrigger}</p>
            </div>

            {/* Sumber Lingkungan & Loose Parts */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Sumber Belajar Lingkungan & Material Loose Parts:
              </span>
              <p className="text-emerald-950 leading-relaxed">{theme.localEnvironmentResource}</p>
            </div>

            {onSelectThemeForModul && (
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectThemeForModul(theme)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Gunakan Tema untuk Modul Ajar PAUD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
