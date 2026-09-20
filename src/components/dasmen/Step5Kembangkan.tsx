import React, { useState } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Bookmark, 
  Download, 
  Printer, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  Palette, 
  RefreshCw,
  Copy,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { P5Project, AnnualPlanRow, SavedDocument } from '../../types';
import { Checkpoint1Instrument } from './instruments/Checkpoint1Instrument';
import { Checkpoint2Instrument } from './instruments/Checkpoint2Instrument';
import { AsLearningInstrument } from './instruments/AsLearningInstrument';
import { OfLearningInstrument } from './instruments/OfLearningInstrument';

interface Step5KembangkanProps {
  projectData: P5Project;
  annualPlanRows: AnnualPlanRow[];
  schoolName: string;
  level: string;
  onSaveToCollection: (doc: SavedDocument) => void;
  handlePrint: () => void;
  handleExportDocx: () => void;
  onBackToStep4: () => void;
}

export const Step5Kembangkan: React.FC<Step5KembangkanProps> = ({
  projectData,
  annualPlanRows,
  schoolName,
  level,
  onSaveToCollection,
  handlePrint,
  handleExportDocx,
  onBackToStep4,
}) => {
  // Collapsible sections
  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(true);

  // Selected sub-dimensions
  const [selectedSubDims, setSelectedSubDims] = useState<string[]>([
    'Hubungan dengan Tuhan YME',
    'Peduli',
    'Kerja Sama'
  ]);

  // Checkpoint count
  const [checkpointCount, setCheckpointCount] = useState<number>(2);

  // Active view states
  const [showCompiledModule, setShowCompiledModule] = useState(false);
  const [savedBadge, setSavedBadge] = useState<string | null>(null);

  // Sub-dimension definitions
  const subDimOptions = [
    {
      id: 'Hubungan dengan Tuhan YME',
      name: 'Hubungan dengan Tuhan YME',
      dimension: 'Keimanan & Ketakwaan',
      cakapSD: 'Membiasakan diri melaksanakan ajaran Tuhan Yang Maha Esa dalam kehidupan nyata secara konsisten dengan bimbingan orang tua dan guru serta mampu mensyukurinya.'
    },
    {
      id: 'Hubungan dengan Sesama Manusia',
      name: 'Hubungan dengan Sesama Manusia',
      dimension: 'Keimanan & Ketakwaan',
      cakapSD: 'Memahami perbedaan pendapat dan menghormati sesama manusia dengan sikap santun dan penuh kasih sayang.'
    },
    {
      id: 'Hubungan dengan Lingkungan Alam',
      name: 'Hubungan dengan Lingkungan Alam',
      dimension: 'Keimanan & Ketakwaan',
      cakapSD: 'Menjaga kebersihan dan kelestarian lingkungan sekitar madrasah/sekolah dan tempat ibadah secara berkelanjutan.'
    },
    {
      id: 'Peduli',
      name: 'Peduli',
      dimension: 'Kolaborasi',
      cakapSD: 'Menunjukkan kepedulian secara konsisten pada teman sebaya dan anggota keluarga dengan bimbingan guru dan orang tua di lingkungan satuan pendidikan dan keluarga.'
    },
    {
      id: 'Berbagi',
      name: 'Berbagi',
      dimension: 'Kolaborasi',
      cakapSD: 'Mengikhlaskan sebagian waktu dan sumber daya untuk membantu sesama teman yang membutuhkan pertolongan.'
    },
    {
      id: 'Kerja Sama',
      name: 'Kerja Sama',
      dimension: 'Kolaborasi',
      cakapSD: 'Bekerjasama dengan teman sebaya dan anggota keluarga dengan bimbingan guru dan orang tua di lingkungan satuan pendidikan dan keluarga.'
    }
  ];

  // Editable Rubric Rows
  const [rubricRows, setRubricRows] = useState([
    {
      id: 'Hubungan dengan Tuhan YME',
      subDim: 'Keimanan & Ketakwaan — Hubungan dengan Tuhan YME',
      baruMemulai: 'Mulai menunjukkan ketertarikan untuk hadir dan mengikuti kegiatan ibadah serta membaca Al-Quran di Surau Kampar dengan bimbingan penuh dari guru dan orang tua.',
      berkembang: 'Mengikuti kegiatan ibadah dan melantunkan Al-Quran di Surau Kampar secara berkala dengan bimbingan guru dan orang tua, serta mulai menunjukkan rasa senang selama beraktivitas.',
      cakap: 'Membiasakan diri melaksanakan ajaran Tuhan Yang Maha Esa melalui ibadah dan membaca Al-Quran di Surau Kampar secara konsisten dengan bimbingan guru dan orang tua, serta mampu mensyukurinya dalam kehidupan nyata.',
      sangatBerkembang: 'Membiasakan diri melaksanakan ibadah dan membaca Al-Quran di Surau Kampar secara mandiri dan konsisten, serta secara aktif mengajak dan menginspirasi teman sebaya untuk mensyukuri kegiatan keagamaan tersebut.'
    },
    {
      id: 'Peduli',
      subDim: 'Kolaborasi — Peduli',
      baruMemulai: 'Mulai menunjukkan kepedulian kepada teman sebaya saat beraktivitas di Surau Kampar (seperti berbagi tempat duduk atau menyimak bacaan) dengan bimbingan dan arahan langsung dari guru.',
      berkembang: 'Menunjukkan kepedulian pada situasi tertentu kepada teman sebaya di lingkungan Surau Kampar dengan bimbingan guru dan orang tua.',
      cakap: 'Menunjukkan kepedulian secara konsisten pada teman sebaya (seperti membantu teman yang kesulitan membaca Al-Quran atau merapikan perlengkapan salat) dengan bimbingan guru dan orang tua di lingkungan Surau Kampar.',
      sangatBerkembang: 'Menunjukkan kepedulian secara konsisten dengan inisiatif mandiri untuk membantu teman sebaya serta menjaga kenyamanan jamaah lain di Surau Kampar tanpa perlu diarahkan oleh guru atau orang tua.'
    },
    {
      id: 'Kerja Sama',
      subDim: 'Kolaborasi — Kerja Sama',
      baruMemulai: 'Mulai terlibat dalam tugas kelompok kecil di Surau Kampar (seperti menyusun Al-Quran atau membersihkan area surau) ketika didampingi dan diarahkan secara intensif oleh guru.',
      berkembang: 'Berpartisipasi aktif dalam kerja sama kelompok untuk menyelesaikan aktivitas di Surau Kampar dengan bimbingan berkala dari guru dan orang tua.',
      cakap: 'Bekerjasama dengan teman sebaya dalam menyukseskan kegiatan bersama (seperti latihan tilawah bersama atau menjaga kebersihan Surau Kampar) dengan bimbingan guru dan orang tua.',
      sangatBerkembang: 'Menginisiasi dan menyelaraskan tindakan dalam kerja sama kelompok secara harmonis untuk menyukseskan kegiatan di Surau Kampar secara mandiri dan saling mendukung dengan teman sebaya.'
    }
  ]);

  const toggleSubDim = (id: string) => {
    setSelectedSubDims(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleUpdateRubricCell = (id: string, field: 'baruMemulai' | 'berkembang' | 'cakap' | 'sangatBerkembang', value: string) => {
    setRubricRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const triggerSaveNotification = (title: string) => {
    setSavedBadge(title);
    const doc: SavedDocument = {
      id: Date.now().toString(),
      category: 'kokurikuler',
      title: `${title} - ${projectData.title}`,
      subjectOrTheme: projectData.theme,
      gradeOrAge: projectData.gradeOrAge,
      createdAt: new Date().toISOString(),
      data: projectData
    };
    onSaveToCollection(doc);
    setTimeout(() => setSavedBadge(null), 3500);
  };

  // Find active project row from annual plan if available
  const activePlanRow = annualPlanRows.find(r => r.temaProjek === projectData.title) || annualPlanRows[0];
  const projectTitleDisplay = projectData.title || (activePlanRow ? activePlanRow.temaProjek : 'Gema Al-Quran di Surau Kampar');
  const projectBentukDisplay = activePlanRow ? activePlanRow.bentuk : 'Cara Lainnya';
  const projectJpDisplay = projectData.totalJp || (activePlanRow ? activePlanRow.jp : 60);
  const projectSmtDisplay = activePlanRow ? activePlanRow.smt : 1;

  return (
    <div className="space-y-6">
      {/* Selected Project Ribbon */}
      <div className="bg-[#eef5fc] border border-sky-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-base">📌</span>
          <span>
            Projek {activePlanRow ? activePlanRow.id : 1}: {projectTitleDisplay} · {projectBentukDisplay} · {projectJpDisplay} JP · Smt {projectSmtDisplay}
          </span>
        </div>
        {showCompiledModule && (
          <button
            type="button"
            onClick={() => setShowCompiledModule(false)}
            className="text-xs text-blue-700 hover:underline font-bold cursor-pointer"
          >
            ← Kembali ke Editor Instrumen
          </button>
        )}
      </div>

      {savedBadge && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>"{savedBadge}" berhasil disimpan ke Koleksi Dokumen Anda!</span>
        </div>
      )}

      {!showCompiledModule ? (
        <div className="space-y-6">
          {/* Header Title & Subtitle */}
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0f2942] font-serif">
              Kembangkan jadi Modul Kokurikuler
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Ikuti Langkah 1–3 di bawah. Ketuk judul tiap bagian untuk membuka/menutupnya.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* LANGKAH 1: SUB-DIMENSI & RUBRIK */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
            {/* Header Accordion Bar */}
            <div 
              onClick={() => setStep1Open(!step1Open)}
              className="flex items-center justify-between p-5 sm:p-6 bg-white cursor-pointer hover:bg-slate-50/70 border-b border-slate-100 transition-colors select-none"
            >
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 1 · Sub-Dimensi &amp; Rubrik
              </h4>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${step1Open ? 'rotate-180' : ''}`} />
            </div>

            {step1Open && (
              <div className="p-5 sm:p-7 space-y-6">
                {/* Sub-header text & KepKa link */}
                <div className="text-xs sm:text-sm text-slate-600">
                  <span>Sub-Dimensi yang dinilai — minimal 1 tiap dimensi projek · sumber: </span>
                  <span className="text-blue-600 underline font-medium cursor-pointer">
                    Alur Perkembangan Kompetensi (KepKa BSKAP 058/2025) →
                  </span>
                </div>

                {/* Grid of Sub-Dimension Checkbox Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {subDimOptions.map(opt => {
                    const isChecked = selectedSubDims.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleSubDim(opt.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isChecked
                            ? 'border-[#0f2942] bg-[#f8fbfe] ring-1 ring-[#0f2942]/15 shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                            isChecked ? 'bg-[#0f2942] border-[#0f2942] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                              {opt.name}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 block">
                              {opt.dimension}
                            </span>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700 leading-relaxed pl-6">
                            <strong className="text-slate-900">Standar Cakap (SD): </strong>
                            <span>{opt.cakapSD}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Validation status pill line */}
                <div className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-1.5 pt-1">
                  <span>Wajib min. 1 sub-dimensi tiap dimensi disasar</span>
                  <span className="font-bold text-slate-900 ml-1">Keimanan &amp; Ketakwaan ✓</span>
                  <span>·</span>
                  <span className="font-bold text-slate-900">Kolaborasi ✓</span>
                  <span className="text-slate-500">({selectedSubDims.length} dipilih)</span>
                </div>

                {/* Buat Rubrik Button & Info Callout */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-2xs transition-colors"
                  >
                    Buat Rubrik (per sub-dimensi)
                  </button>

                  <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                    <span>✎</span>
                    <span>Klik sel mana pun untuk mengedit sebelum jadi lampiran.</span>
                  </div>
                </div>

                {/* Interactive Rubric Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                        <th className="p-3 w-1/5 min-w-[140px]">Sub-Dimensi</th>
                        <th className="p-3 w-1/5 min-w-[140px]">Baru Memulai</th>
                        <th className="p-3 w-1/5 min-w-[140px]">Berkembang</th>
                        <th className="p-3 w-1/5 min-w-[140px]">Cakap</th>
                        <th className="p-3 w-1/5 min-w-[140px]">Sangat Berkembang</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {rubricRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 align-top">
                          <td className="p-3 font-semibold text-slate-900 bg-slate-50/40">
                            {row.subDim}
                          </td>
                          <td className="p-2">
                            <textarea
                              rows={5}
                              value={row.baruMemulai}
                              onChange={(e) => handleUpdateRubricCell(row.id, 'baruMemulai', e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <textarea
                              rows={5}
                              value={row.berkembang}
                              onChange={(e) => handleUpdateRubricCell(row.id, 'berkembang', e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <textarea
                              rows={5}
                              value={row.cakap}
                              onChange={(e) => handleUpdateRubricCell(row.id, 'cakap', e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
                            />
                          </td>
                          <td className="p-2">
                            <textarea
                              rows={5}
                              value={row.sangatBerkembang}
                              onChange={(e) => handleUpdateRubricCell(row.id, 'sangatBerkembang', e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:ring-1 focus:ring-[#0f2942] focus:outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Acuan sub-dimensi &amp; tahap perkembangan: KepKa BSKAP No. 058/H/KR/2025 — Alur Perkembangan Kompetensi.
                </p>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* LANGKAH 2: INSTRUMEN ASESMEN */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
            {/* Header Accordion Bar */}
            <div 
              onClick={() => setStep2Open(!step2Open)}
              className="flex items-center justify-between p-5 sm:p-6 bg-white cursor-pointer hover:bg-slate-50/70 border-b border-slate-100 transition-colors select-none"
            >
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 2 · Instrumen Asesmen
              </h4>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${step2Open ? 'rotate-180' : ''}`} />
            </div>

            {step2Open && (
              <div className="p-5 sm:p-7 space-y-6">
                <p className="text-xs sm:text-sm text-slate-600">
                  Buat satu per satu — tiap instrumen bisa langsung dilengkapi Sumber Belajar &amp; LKPD.
                </p>

                {/* Etalase Callout Banner */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <strong className="text-amber-950 font-bold flex items-center gap-1.5">
                      🌟 Cari produk lain dari TemanAjar by Jangan Jadi Guru?
                    </strong>
                    <p className="text-amber-800/90 mt-0.5">
                      Ebook, webinar, &amp; bahan ajar lain ada di etalase kami.
                    </p>
                  </div>
                  <span className="text-amber-950 font-bold hover:underline cursor-pointer whitespace-nowrap text-xs">
                    Lihat semua →
                  </span>
                </div>

                {/* Formatif Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    FOR LEARNING · FORMATIF
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Jumlah checkpoint:</span>
                    <select 
                      value={checkpointCount} 
                      onChange={(e) => setCheckpointCount(Number(e.target.value))}
                      className="border border-slate-300 rounded-lg px-2.5 py-1 bg-white text-slate-800 font-medium"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                    <button 
                      type="button" 
                      className="px-3.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg font-semibold text-slate-800 cursor-pointer transition-colors"
                    >
                      Buat checkpoint
                    </button>
                  </div>
                </div>

                {/* Info Callout */}
                <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                  <span>✎</span>
                  <span>2 checkpoint formatif siap. Buat LKPD tiap checkpoint bila perlu — checkpoint otomatis masuk aktivitas modul.</span>
                </div>

                {/* CHECKPOINT 1 (FORMATIF 1: OBSERVASI PARTISIPATIF) */}
                <Checkpoint1Instrument 
                  onSave={(title) => triggerSaveNotification(title)} 
                  handlePrint={handlePrint} 
                />

                {/* CHECKPOINT 2 (FORMATIF 2: UNJUK KERJA SIMA'AN) */}
                <Checkpoint2Instrument 
                  onSave={(title) => triggerSaveNotification(title)} 
                  handlePrint={handlePrint} 
                />

                {/* AS LEARNING (JURNAL REFLEKTIF LENTERA SURAU KAMPAR) */}
                <AsLearningInstrument 
                  onSave={(title) => triggerSaveNotification(title)} 
                  handlePrint={handlePrint} 
                />

                {/* OF LEARNING (PORTOFOLIO BAKTI MENGAJI SUMATIF) */}
                <OfLearningInstrument 
                  onSave={(title) => triggerSaveNotification(title)} 
                  handlePrint={handlePrint} 
                />
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* LANGKAH 3: GENERATE MODUL KOKURIKULER LENGKAP */}
          {/* ========================================================================= */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowCompiledModule(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Modul Kokurikuler</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* COMPILED MODUL KOKURIKULER VIEW (DOKUMEN LENGKAP SIAP CETAK/WORD) */
        /* ========================================================================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Top action bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                ✓ Modul Kokurikuler Lengkap Siap
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {projectTitleDisplay}
              </h3>
              <p className="text-xs text-slate-500">
                Tema: {projectData.theme} • Alokasi: {projectJpDisplay} JP • {schoolName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCompiledModule(false)}
                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Kembali ke Editor
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF</span>
              </button>
              <button
                type="button"
                onClick={handleExportDocx}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Word</span>
              </button>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Modul Lengkap')}
                className="px-4 py-2 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                <span>Simpan Modul</span>
              </button>
            </div>
          </div>

          {/* Full Compiled Module Document */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
            {/* Header / Kop */}
            <div className="text-center border-b border-slate-200 pb-5 space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                MODUL KEGIATAN KOKURIKULER
              </h3>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                PENGUATAN DELAPAN PROFIL LULUSAN (DPL)
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {schoolName.toUpperCase()} · TAHUN AJARAN 2026/2027
              </p>
            </div>

            {/* A. Informasi Umum */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
                A. Informasi Umum &amp; Identitas Projek
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-700 pt-1">
                <p>• <strong>Satuan Pendidikan:</strong> {schoolName}</p>
                <p>• <strong>Sasaran Kelas/Fase:</strong> {projectData.gradeOrAge}</p>
                <p>• <strong>Tema Kokurikuler:</strong> {projectData.theme}</p>
                <p>• <strong>Total Alokasi Waktu:</strong> {projectJpDisplay} JP</p>
                <p>• <strong>Fokus Projek:</strong> {projectTitleDisplay}</p>
                <p>• <strong>Bentuk Pelaksanaan:</strong> {projectBentukDisplay}</p>
              </div>
            </div>

            {/* B. Sasaran Profil Lulusan & Sub-Dimensi */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
                B. Pemetaan Sasaran Delapan Profil Lulusan (DPL) &amp; Sub-Dimensi
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedSubDims.map((dim, i) => (
                  <span key={i} className="px-3 py-1 bg-sky-50 border border-sky-200 rounded-xl text-sky-950 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                    {dim}
                  </span>
                ))}
              </div>
            </div>

            {/* C. Alur 4 Tahapan Pelaksanaan */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
                C. Alur 4 Tahapan Pelaksanaan Kokurikuler
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-emerald-900 block">1. Tahap Pengenalan</span>
                  <ul className="list-disc pl-4 text-slate-700 space-y-1">
                    {projectData.flowPhases.pengenalan.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="p-3.5 bg-sky-50/40 border border-sky-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-sky-900 block">2. Tahap Kontekstualisasi</span>
                  <ul className="list-disc pl-4 text-slate-700 space-y-1">
                    {projectData.flowPhases.kontekstualisasi.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="p-3.5 bg-amber-50/40 border border-amber-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-amber-900 block">3. Tahap Aksi Nyata</span>
                  <ul className="list-disc pl-4 text-slate-700 space-y-1">
                    {projectData.flowPhases.aksi.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="p-3.5 bg-purple-50/40 border border-purple-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-purple-900 block">4. Tahap Refleksi &amp; Gelar Karya</span>
                  <ul className="list-disc pl-4 text-slate-700 space-y-1">
                    {projectData.flowPhases.refleksi.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* D. Rubrik Capaian Kokurikuler */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
                D. Rubrik Asesmen Capaian Kokurikuler (DPL)
              </h4>
              <div className="space-y-3">
                {rubricRows.map((rubric, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 text-xs space-y-2">
                    <span className="font-bold text-slate-900 block">
                      {rubric.subDim}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <strong className="text-rose-700 block">Mulai Berkembang (MB)</strong>
                        <p className="text-slate-600 mt-1">{rubric.baruMemulai}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <strong className="text-amber-700 block">Sedang Berkembang (SB)</strong>
                        <p className="text-slate-600 mt-1">{rubric.berkembang}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <strong className="text-sky-700 block">Cakap / Sesuai Harapan (BSH)</strong>
                        <p className="text-slate-600 mt-1">{rubric.cakap}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <strong className="text-emerald-700 block">Sangat Berkembang (SAB)</strong>
                        <p className="text-slate-600 mt-1">{rubric.sangatBerkembang}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* E. Lampiran Instrumen Asesmen */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded-lg">
                E. Lampiran Instrumen Asesmen &amp; LKPD
              </h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <p>• <strong>Lampiran 1 (Formatif Checkpoint 1):</strong> Deteksi Awal &amp; Teman Belajar (Observasi &amp; LKPD Pemetaan Diri)</p>
                <p>• <strong>Lampiran 2 (Formatif Checkpoint 2):</strong> Setoran Merdu di Surau (Unjuk Kerja &amp; Panduan Menyimak Santun)</p>
                <p>• <strong>Lampiran 3 (As Learning):</strong> Jurnal Lentera Surau (Jurnal Refleksi Mandiri &amp; Penerapan APM)</p>
                <p>• <strong>Lampiran 4 (Of Learning):</strong> Portofolio Bakti Mengaji (Log Kolaborasi &amp; Konfirmasi Capaian Akhir)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
