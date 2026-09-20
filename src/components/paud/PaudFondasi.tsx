import React, { useState } from 'react';
import { Baby, Sparkles, Sun } from 'lucide-react';
import { GlobalContext } from '../../types';
import { PAUD_FOUNDATION_ELEMENTS } from '../../data/curriculumData';
import { generatePaudThemesAndTP } from '../../lib/gemini/prompts';

interface PaudFondasiProps {
  globalContext: GlobalContext;
  onProceedToThemes?: () => void;
}

const FOUNDATION_CAPABILITIES = [
  { id: 1, title: 'Mengenal nilai agama dan budi pekerti' },
  { id: 2, title: 'Keterampilan sosial dan bahasa untuk berinteraksi' },
  { id: 3, title: 'Kematangan emosi untuk berkegiatan di lingkungan belajar' },
  { id: 4, title: 'Pengembangan keterampilan motorik dan perawatan diri' },
  { id: 5, title: 'Kematangan kognitif untuk membaca, menulis, berhitung sederhana' },
  { id: 6, title: 'Pemaknaan belajar adalah proses yang positif dan menyenangkan' }
];

export const PaudFondasi: React.FC<PaudFondasiProps> = ({ globalContext, onProceedToThemes }) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'TK A (4-5 Tahun)' | 'TK B (5-6 Tahun)'>('TK B (5-6 Tahun)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeElementTab, setActiveElementTab] = useState<string>(PAUD_FOUNDATION_ELEMENTS[0].element);

  const [tpList, setTpList] = useState([
    {
      id: 'TP-PAUD-01',
      element: 'Nilai Agama dan Budi Pekerti',
      text: 'Mengenal dan mempraktikkan doa harian serta nilai kasih sayang terhadap ciptaan Tuhan di sekitarnya.',
      manifestation: 'Menyiram tanaman dengan gembira dan mengucapkan terima kasih serta tolong.'
    },
    {
      id: 'TP-PAUD-02',
      element: 'Nilai Agama dan Budi Pekerti',
      text: 'Menunjukkan perilaku sopan, santun, dan peduli kepada teman sebaya serta guru.',
      manifestation: 'Menghargai giliran bermain dan menyapa teman dengan senyuman hangat.'
    },
    {
      id: 'TP-PAUD-03',
      element: 'Jati Diri',
      text: 'Mengenali dan mampu mengekspresikan emosi diri (senang, sedih, marah) secara wajar dan mandiri merawat diri.',
      manifestation: 'Mau mencuci tangan mandiri dan bercerita tentang perasaannya.'
    },
    {
      id: 'TP-PAUD-04',
      element: 'Jati Diri',
      text: 'Terampil menggunakan motorik kasar dan motorik halus melalui aktivitas bermain fisik dan koordinasi tubuh.',
      manifestation: 'Melompat dengan seimbang dan meremas playdough untuk membentuk aneka karya.'
    },
    {
      id: 'TP-PAUD-05',
      element: 'Dasar-Dasar Literasi dan STEAM',
      text: 'Mengenali bunyi huruf awal dan tertarik mendengarkan cerita bergambar bermakna.',
      manifestation: 'Menunjuk gambar pada buku cerita dan meniru bunyi kata sederhana.'
    },
    {
      id: 'TP-PAUD-06',
      element: 'Dasar-Dasar Literasi dan STEAM',
      text: 'Mampu mengelompokkan benda berdasarkan warna, bentuk, dan ukuran menggunakan material lepasan (loose parts).',
      manifestation: 'Mengelompokkan batu kerikil dan daun kering berdasarkan ukuran besar-kecil.'
    }
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generatePaudThemesAndTP({
        childInterest: `Eksplorasi alam, warna, tanaman, dan lingkungan sekolah di ${globalContext.identity.cityDistrict}`,
        schoolContext: globalContext.identity.schoolName,
        globalContext
      });
      if (res.tpList && res.tpList.length > 0) {
        setTpList(res.tpList);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTp = tpList.filter(t => t.element === activeElementTab);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Baby className="w-5 h-5 text-rose-500" />
              Capaian Pembelajaran (CP) & TP Fondasi PAUD / RA
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              3 Elemen Kurikulum PAUD & 6 Kemampuan Fondasi penting untuk transisi menyenangkan ke Sekolah Dasar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold text-slate-700"
            >
              <option value="TK A (4-5 Tahun)">Kelompok A (Usia 4-5 Tahun)</option>
              <option value="TK B (5-6 Tahun)">Kelompok B (Usia 5-6 Tahun)</option>
            </select>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Menyusun TP Fondasi...' : 'Susun TP Fondasi AI'}</span>
            </button>
          </div>
        </div>

        {/* 6 Kemampuan Fondasi Transisi PAUD-SD Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
          <span className="text-xs font-bold text-amber-900 block mb-2 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-600" /> 6 Kemampuan Fondasi Transisi PAUD-SD (Kemendikbudristek):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
            {FOUNDATION_CAPABILITIES.map(cap => (
              <div key={cap.id} className="bg-white/80 p-2 rounded-lg border border-amber-200/80 text-amber-950 font-medium flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {cap.id}
                </span>
                <span className="truncate">{cap.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Elemen Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        {PAUD_FOUNDATION_ELEMENTS.map(elem => {
          const isActive = activeElementTab === elem.element;
          return (
            <button
              key={elem.element}
              onClick={() => setActiveElementTab(elem.element)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-rose-50 border-rose-300 shadow-2xs text-rose-950 font-bold'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-800 block">Elemen Capaian</span>
              <span className="text-xs sm:text-sm font-semibold line-clamp-1">{elem.element}</span>
              <p className="text-[11px] text-slate-500 font-normal line-clamp-2 mt-1">{elem.desc}</p>
            </button>
          );
        })}
      </div>

      {/* TP Cards List for Selected Element */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900">
          Tujuan Pembelajaran Elemen: <span className="text-rose-700">{activeElementTab}</span>
        </h4>

        <div className="space-y-3">
          {filteredTp.map((tp, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                  {tp.id}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">{tp.text}</p>
              </div>
              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <strong className="text-emerald-700 block text-[11px]">Bukti Perilaku Bermain (Manifestasi Anak):</strong>
                <span>{tp.manifestation}</span>
              </div>
            </div>
          ))}
        </div>

        {onProceedToThemes && (
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={onProceedToThemes}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Lanjut ke Tema Bermain & Modul PAUD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
