import React, { useState } from 'react';
import { Baby, Sparkles, Printer, Bookmark, CheckCircle2, Leaf, Clock, BookOpen } from 'lucide-react';
import { PaudModulAjar, GlobalContext, SavedDocument } from '../../types';
import { generatePaudModulAjar } from '../../lib/gemini/prompts';

interface PaudModulWizardProps {
  globalContext: GlobalContext;
  onSaveToCollection: (doc: SavedDocument) => void;
}

export const PaudModulWizard: React.FC<PaudModulWizardProps> = ({
  globalContext,
  onSaveToCollection
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveBadge, setSaveBadge] = useState(false);

  const [modulData, setModulData] = useState<PaudModulAjar>({
    id: `MODUL-PAUD-${Date.now()}`,
    title: 'Modul Ajar Bermain: Eksplorasi Tanaman Hijau Sahabat Kita',
    ageGroup: 'TK B (5-6 Tahun)',
    theme: 'Petualang Lingkungan Hijau',
    subTheme: 'Rahasia Daun, Biji, dan Tanah Gembur',
    durationDays: 5,
    targetedTpList: [
      'Anak terbiasa mengucapkan rasa syukur atas tanaman ciptaan Tuhan (Nilai Agama & Budi Pekerti)',
      'Anak mampu mengantre dan bekerja sama saat memindahkan tanah ke dalam pot (Jati Diri)',
      'Anak dapat mengelompokkan daun berdasarkan ukuran besar-kecil dan bentuknya (Dasar Literasi & STEAM)'
    ],
    playActivities: [
      {
        dayNumber: 1,
        playInvitingInvitation: 'Pijakan sebelum main: Guru membacakan buku cerita bergambar "Benih Kecil yang Berani Bertumbuh", lalu memantik rasa ingin tahu anak dengan menampilkan aneka daun kering dan basah.',
        playCoreExploration: [
          'Zona 1: Eksplorasi sensori meraba tekstur permukaan daun dan mencium aroma daun herbal.',
          'Zona 2: Mengelompokkan daun berdasarkan ukuran panjang dan warna.',
          'Zona 3: Menghitung jumlah tulang daun menggunakan kaca pembesar anak.'
        ],
        loosePartsMaterials: ['Daun pandan', 'Daun sirih', 'Kaca pembesar anak', 'Air dalam baskom', 'Baki kayu'],
        closingReflection: 'Pijakan setelah main (Recalling): Anak duduk melingkar menceritakan daun favorit yang ditemukannya hari ini.'
      },
      {
        dayNumber: 2,
        playInvitingInvitation: 'Pijakan sebelum main: Menjelajahi kebun sekolah dan mengamati tanah gembur tempat cacing tanah hidup.',
        playCoreExploration: [
          'Zona 1: Mengisi pot tanaman dengan tanah menggunakan sekop kecil dan sarung tangan.',
          'Zona 2: Menanam biji kacang hijau dan menyiramnya dengan semprotan air halus.',
          'Zona 3: Menggambar label nama pot tanaman sendiri menggunakan krayon.'
        ],
        loosePartsMaterials: ['Tanah gembur', 'Pot daur ulang', 'Biji kacang hijau', 'Sekop mini', 'Semprotan air'],
        closingReflection: 'Pijakan setelah main: Anak menunjukkan pot tanaman miliknya dan berjanji merawatnya setiap pagi.'
      }
    ],
    assessments: {
      anecdotalRecordGuide: 'Catat tanggal, nama anak, dan respons spontan saat anak menunjukkan empati, berbagi bahan, atau menyelesaikan perselisihan giliran main.',
      observationChecklist: [
        'Mau berbagi bahan loose parts dengan teman tanpa berebut',
        'Dapat menghitung 1-10 biji konkret secara tepat',
        'Menjawab pertanyaan pemantik dengan kalimat sederhana'
      ],
      childWorkDocumentation: 'Dokumentasi foto karya cetak pola daun disertai kutipan ucapan lisan anak yang dicatat oleh guru.',
      photoSeriesIndicator: 'Rangkaian 3 foto: (1) saat anak memilih bahan, (2) saat menyusun tanaman di pot, (3) saat bangga menunjukkan karyanya.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generatePaudModulAjar({
        theme: modulData.theme,
        subTheme: modulData.subTheme,
        ageGroup: modulData.ageGroup,
        durationDays: modulData.durationDays,
        targetedTpList: modulData.targetedTpList,
        globalContext
      });
      setModulData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToArsip = () => {
    const doc: SavedDocument = {
      id: modulData.id,
      title: `Modul PAUD: ${modulData.title}`,
      category: 'modul_paud',
      subjectOrTheme: modulData.theme,
      gradeOrAge: modulData.ageGroup,
      createdAt: new Date().toISOString(),
      data: modulData
    };
    onSaveToCollection(doc);
    setSaveBadge(true);
    setTimeout(() => setSaveBadge(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Baby className="w-5 h-5 text-rose-500" />
              Modul Ajar Bermain PAUD / RA (Backward Design Ramah Anak)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ragam main invitasi loose parts, pertanyaan provokatif, asesmen autentik non-angka, dan kemitraan orang tua.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun Modul PAUD...' : 'Generate Modul PAUD AI'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tema & Sub-Tema Bermain</label>
            <input
              type="text"
              value={`${modulData.theme} - ${modulData.subTheme}`}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                setModulData({
                  ...modulData,
                  theme: parts[0]?.trim() || modulData.theme,
                  subTheme: parts[1]?.trim() || modulData.subTheme
                });
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kelompok Usia</label>
            <select
              value={modulData.ageGroup}
              onChange={(e) => setModulData({ ...modulData, ageGroup: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            >
              <option value="KB (2-4 Tahun)">KB (2-4 Tahun)</option>
              <option value="TK A (4-5 Tahun)">TK A (4-5 Tahun)</option>
              <option value="TK B (5-6 Tahun)">TK B (5-6 Tahun)</option>
              <option value="RA A">RA A</option>
              <option value="RA B">RA B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modul PAUD View */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[10px] font-bold px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full uppercase">
            {modulData.ageGroup}
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-2">{modulData.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>Tema: {modulData.theme}</span>
            <span>•</span>
            <span>Sub-Tema: {modulData.subTheme}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Durasi: {modulData.durationDays} Hari</span>
          </p>
        </div>

        {/* Tujuan Pembelajaran */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Tujuan Pembelajaran yang Disasar (3 Elemen PAUD):
          </h4>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            {modulData.targetedTpList.map((tp, i) => <li key={i}>{tp}</li>)}
          </ul>
        </div>

        {/* Ragam Main Hari Demi Hari */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Aktivitas Bermain & Pijakan Main Harian:
          </h4>
          <div className="space-y-4">
            {modulData.playActivities.map((act) => (
              <div key={act.dayNumber} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-900 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    Hari ke-{act.dayNumber}
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <strong className="text-blue-900 block">Pijakan Lingkungan & Apersepsi (Sebelum Main):</strong>
                  <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                    {act.playInvitingInvitation}
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <strong className="text-emerald-900 block">Sentra / Zona Eksplorasi (Saat Main):</strong>
                  <ul className="list-disc pl-5 text-slate-700 space-y-1">
                    {act.playCoreExploration.map((core, cIdx) => <li key={cIdx}>{core}</li>)}
                  </ul>
                </div>

                <div className="text-[11px] text-slate-600">
                  <strong className="text-slate-700 block mb-1">Material Lepasan (Loose Parts) yang Digunakan:</strong>
                  <div className="flex flex-wrap gap-1">
                    {act.loosePartsMaterials.map((lp, lpIdx) => (
                      <span key={lpIdx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                        {lp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-[11px]">
                  <strong className="text-purple-900 block">Pijakan Setelah Main (Recalling):</strong>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    {act.closingReflection}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asesmen Autentik Non-Angka */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Rencana Asesmen Autentik Non-Angka:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="block text-slate-900">1. Panduan Catatan Anekdot:</strong>
              <p className="text-slate-600 leading-relaxed">{modulData.assessments.anecdotalRecordGuide}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="block text-slate-900">2. Ceklis Observasi:</strong>
              <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                {modulData.assessments.observationChecklist.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="block text-slate-900">3. Dokumentasi Hasil Karya:</strong>
              <p className="text-slate-600 leading-relaxed">{modulData.assessments.childWorkDocumentation}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="block text-slate-900">4. Indikator Foto Berseri:</strong>
              <p className="text-slate-600 leading-relaxed">{modulData.assessments.photoSeriesIndicator}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-2xs">
        <div>
          {saveBadge && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Modul PAUD tersimpan di Koleksi!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToArsip}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" /> Simpan Dokumen
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Lembar Modul
          </button>
        </div>
      </div>
    </div>
  );
};
