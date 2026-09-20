import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Printer, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Bookmark
} from 'lucide-react';
import { 
  ModulAjar, 
  GlobalContext, 
  TargetPembelajaran, 
  Phase, 
  SavedDocument 
} from '../../types';
import { 
  generateKKTP, 
  generateInitialCognitiveTest, 
  generateLearningActivities, 
  generateAssessmentsAndLKPD 
} from '../../lib/gemini/prompts';
import { exportModulAjarToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printModulAjar } from '../../lib/export/pdfExport';

interface ModulAjarWizardProps {
  globalContext: GlobalContext;
  tps: TargetPembelajaran[];
  currentDraft: Partial<ModulAjar> | null;
  onSaveDraft: (draft: ModulAjar) => void;
  onSaveToCollection: (doc: SavedDocument) => void;
}

const LEARNING_MODELS: Array<ModulAjar['learningModel']> = [
  'Berdiferensiasi',
  'PBL',
  'PjBL',
  'Discovery Learning',
  'CTL'
];

export const ModulAjarWizard: React.FC<ModulAjarWizardProps> = ({
  globalContext,
  tps,
  currentDraft,
  onSaveDraft,
  onSaveToCollection
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);
  const [generatingStatus, setGeneratingStatus] = useState<string>('');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const [modulData, setModulData] = useState<ModulAjar>({
    id: currentDraft?.id || `MODUL-${Date.now()}`,
    title: currentDraft?.title || 'Modul Ajar Pembelajaran Berdiferensiasi',
    subject: currentDraft?.subject || 'Bahasa Indonesia',
    phase: currentDraft?.phase || 'D',
    grade: currentDraft?.grade || 'Kelas 7',
    semester: currentDraft?.semester === 'Genap' ? 'Genap' : 'Ganjil',
    totalJp: currentDraft?.totalJp || 4,
    totalSessions: currentDraft?.totalSessions || 2,
    learningModel: (currentDraft?.learningModel as any) || 'PBL',
    crossSubjectIntegration: currentDraft?.crossSubjectIntegration || 'Integrasi Literasi Lingkungan dan Pendidikan Karakter',
    selectedTpIds: currentDraft?.selectedTpIds || (tps.length > 0 ? [tps[0].id] : ['TP-01']),
    selectedTpTexts: currentDraft?.selectedTpTexts || (tps.length > 0 ? [tps[0].text] : ['Peserta didik mampu menganalisis permasalahan kontekstual dan menyusun solusi nyata']),
    initialCognitiveAssessment: currentDraft?.initialCognitiveAssessment || {
      levelMinus2: {
        question: 'Apakah kamu mengetahui kata kunci pokok materi ini?',
        expectedAnswer: 'Menyebutkan istilah kunci dengan bahasa sederhana.',
        followUp: 'Diberikan glosarium visual dan pendampingan materi prasyarat.'
      },
      levelMinus1: {
        question: 'Dapatkah kamu memberikan satu contoh penerapan konsep ini di lingkungan sekitarmu?',
        expectedAnswer: 'Menyebutkan 1 contoh nyata di lingkungan sekolah/rumah.',
        followUp: 'Diberikan pemantik diskusi kelompok berimbang.'
      },
      levelCurrent: {
        question: 'Bagaimana kamu menganalisis keterkaitan materi ini dengan pemecahan masalah lingkungan sekitar?',
        expectedAnswer: 'Menganalisis sebab-akibat dengan argumen yang sistematis.',
        followUp: 'Diberikan tantangan penyelidikan kontekstual lanjutan.'
      }
    },
    kktp: currentDraft?.kktp || [
      {
        indicator: 'Kemampuan mengidentifikasi konsep esensial materi',
        rubric: {
          perluBimbingan: 'Belum mampu menyebutkan konsep dasar tanpa bimbingan penuh.',
          cukup: 'Mampu menyebutkan konsep dasar namun belum mampu menjelaskan alasannya.',
          baik: 'Mampu menjelaskan konsep dasar dan memberikan contoh yang tepat.',
          sangatBaik: 'Mampu menganalisis keterkaitan antarkonsep secara mendalam dan kritis.'
        },
        passingThreshold: 'Kategori minimal Baik (71-85%)'
      }
    ],
    formativeAssessment: currentDraft?.formativeAssessment || {
      type: 'formatif',
      title: 'Asesmen Formatif: Observasi Diskusi & Kuis Cek Pemahaman',
      instruction: 'Pemantauan perkembangan belajar murid selama proses kegiatan inti (Assessment for Learning).',
      questions: [
        {
          number: 1,
          prompt: 'Jelaskan hubungan antara konsep yang dipelajari dengan masalah nyata di sekitar!',
          criteriaOrRubric: 'Mampu mengidentifikasi minimal 2 bukti konkret dengan penalaran logis.'
        }
      ]
    },
    selfPeerAssessment: currentDraft?.selfPeerAssessment || {
      type: 'diri',
      title: 'Asesmen Diri & Refleksi Metakognisi (Assessment as Learning)',
      instruction: 'Refleksi peserta didik atas pemahaman dan partisipasinya dalam kelompok.',
      questions: [
        {
          number: 1,
          prompt: 'Saya telah berkontribusi aktif dan bekerja sama dengan baik dalam kelompok.',
          criteriaOrRubric: 'Skala 1 (Kurang), 2 (Cukup), 3 (Baik), 4 (Sangat Baik)'
        }
      ]
    },
    summativeAssessment: currentDraft?.summativeAssessment || {
      type: 'sumatif',
      title: 'Asesmen Sumatif Akhir Lingkup Materi (Assessment of Learning)',
      instruction: 'Tugas analisis studi kasus komprehensif atau unjuk kerja karya pemecahan masalah.',
      questions: [
        {
          number: 1,
          prompt: 'Susun laporan analisis dan gagasan solusi atas masalah kontekstual yang diberikan!',
          criteriaOrRubric: 'Rubrik penilaian produk: ketepatan konsep (40%), keterlaksanaan solusi (30%), kerja sama & estetika (30%).'
        }
      ]
    },
    lkpd: currentDraft?.lkpd || {
      title: 'Lembar Kerja Peserta Didik (LKPD)',
      subject: currentDraft?.subject || 'Bahasa Indonesia',
      grade: currentDraft?.grade || 'Kelas 7',
      targetClass: 'Kelas 7-A',
      phase: currentDraft?.phase || 'D',
      duration: '2 x 40 Menit',
      learningObjectives: ['Menemukan informasi esensial dan menyajikan gagasan solusi kontekstual.'],
      instructions: ['Bacalah materi singkat dengan saksama.', 'Diskusikan tugas dalam kelompok.', 'Tuliskan jawaban pada lembar yang disediakan.'],
      briefMaterial: 'Ringkasan materi esensial berbasis lingkungan lokal.',
      activities: [
        { stepNumber: 1, activityName: 'Eksplorasi Kasus Nyata', instruction: 'Amatilah data fenomena lokal yang diberikan guru.' },
        { stepNumber: 2, activityName: 'Perumusan Solusi', instruction: 'Diskusikan alternatif aksi nyata yang dapat dilakukan di sekolah.' }
      ],
      questions: [
        { number: 1, questionText: 'Bagaimana solusi kelompok Anda dapat diterapkan secara berkelanjutan?', type: 'analytic', answerGuide: 'Siswa menguraikan langkah aksi nyata.' }
      ],
      studentTask: 'Presentasikan hasil telaah kelompok di depan kelas.',
      reflectionQuestions: ['Apa hal baru yang saya pahami hari ini?'],
      conclusionPrompt: 'Kesimpulan kelompok kami:'
    },
    learningActivities: currentDraft?.learningActivities || [],
    learningResources: currentDraft?.learningResources || [
      'Buku Panduan Guru & Siswa Kurikulum Merdeka / KBC',
      'Lingkungan alam dan sosial sekitar sekolah',
      'Video dan artikel studi kasus kontekstual'
    ],
    reflectionTeacher: currentDraft?.reflectionTeacher || [
      'Apakah tujuan pembelajaran tercapai oleh seluruh peserta didik?',
      'Diferensiasi proses mana yang paling membantu peserta didik yang kesulitan?'
    ],
    reflectionStudent: currentDraft?.reflectionStudent || [
      'Apa bagian pembelajaran yang paling menarik bagi saya hari ini?',
      'Apa yang masih perlu saya tingkatkan dalam kerja kelompok?'
    ],
    createdAt: currentDraft?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const STEPS = [
    { num: 1, title: 'Identitas & Model' },
    { num: 2, title: 'Pemilihan TP' },
    { num: 3, title: 'KKTP & Rubrik' },
    { num: 4, title: 'Asesmen Diagnostik' },
    { num: 5, title: 'Kegiatan Belajar' },
    { num: 6, title: 'Asesmen Formatif & Sumatif' },
    { num: 7, title: 'Refleksi & Sumber Belajar' }
  ];

  const getTargetPembelajaranList = (): TargetPembelajaran[] => {
    if (tps.length > 0) {
      const selected = tps.filter(t => modulData.selectedTpIds.includes(t.id));
      if (selected.length > 0) return selected;
      return tps.slice(0, 2);
    }
    return [
      {
        id: 'TP-01',
        sequence: 1,
        text: modulData.selectedTpTexts[0] || 'Peserta didik mampu memahami konsep dan menyajikan karya kontekstual.',
        material: modulData.subject,
        competency: 'Menganalisis dan Menyajikan Solusi',
        evidence: 'LKPD dan Rubrik Asesmen'
      }
    ];
  };

  const handleGenerateAllWithAI = async () => {
    setIsGeneratingAll(true);
    const selectedTps = getTargetPembelajaranList();

    try {
      setGeneratingStatus('Merumuskan KKTP dan Rubrik 4 Interval...');
      const kktpRes = await generateKKTP({
        selectedTp: selectedTps,
        subject: modulData.subject,
        globalContext
      });

      setGeneratingStatus('Merancang Asesmen Awal Kognitif 3 Level...');
      const diagRes = await generateInitialCognitiveTest({
        selectedTp: selectedTps,
        subject: modulData.subject,
        grade: modulData.grade,
        globalContext
      });

      setGeneratingStatus('Merancang Langkah Pembelajaran Berdiferensiasi...');
      const actRes = await generateLearningActivities({
        selectedTp: selectedTps,
        subject: modulData.subject,
        totalSessions: modulData.totalSessions,
        totalJp: modulData.totalJp,
        learningModel: modulData.learningModel,
        globalContext
      });

      setGeneratingStatus('Menyusun Instrumen Asesmen Lengkap & LKPD...');
      const assessRes = await generateAssessmentsAndLKPD({
        selectedTp: selectedTps,
        subject: modulData.subject,
        grade: modulData.grade,
        phase: modulData.phase,
        learningModel: modulData.learningModel,
        globalContext
      });

      const updated: ModulAjar = {
        ...modulData,
        kktp: kktpRes,
        initialCognitiveAssessment: diagRes,
        learningActivities: actRes,
        formativeAssessment: assessRes.formative,
        selfPeerAssessment: assessRes.selfPeer,
        summativeAssessment: assessRes.summative,
        lkpd: assessRes.lkpd,
        learningResources: assessRes.resources.length > 0 ? assessRes.resources : modulData.learningResources,
        updatedAt: new Date().toISOString()
      };

      setModulData(updated);
      onSaveDraft(updated);
      setSaveNotification('Seluruh komponen Modul Ajar berhasil disusun oleh AI!');
      setTimeout(() => setSaveNotification(null), 3500);
    } catch (e) {
      console.error('Generation error:', e);
    } finally {
      setIsGeneratingAll(false);
      setGeneratingStatus('');
    }
  };

  const handleExportDocx = async () => {
    try {
      const blob = await exportModulAjarToDocx(modulData, globalContext);
      downloadBlob(blob, `Modul-Ajar-${modulData.subject}-${modulData.grade}.docx`);
    } catch (e) {
      console.error('Docx export failed:', e);
    }
  };

  const handlePrintPdf = () => {
    printModulAjar(modulData, globalContext);
  };

  const handleSaveToArsip = () => {
    const doc: SavedDocument = {
      id: modulData.id,
      title: `Modul Ajar: ${modulData.subject} (${modulData.grade})`,
      category: 'modul_dasmen',
      subjectOrTheme: modulData.subject,
      gradeOrAge: modulData.grade,
      createdAt: modulData.createdAt,
      data: modulData
    };
    onSaveToCollection(doc);
    setSaveNotification('Modul Ajar berhasil disimpan ke Koleksi Dokumen Anda!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Banner & Fast Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Modul Ajar Wizard (Backward Design Kurikulum Merdeka & KBC)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Disusun terstruktur: Identitas, TP, KKTP, Asesmen Diagnostik, Sintaks Berdiferensiasi, Asesmen & LKPD.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAllWithAI}
              disabled={isGeneratingAll}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAll ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAll ? generatingStatus : 'Susun Seluruh Modul Otomatis (AI)'}</span>
            </button>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="overflow-x-auto pb-1 pt-2">
          <div className="flex items-center gap-1.5 min-w-max">
            {STEPS.map((s) => {
              const isActive = activeStep === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(s.num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-white text-emerald-800 font-bold' : 'bg-slate-300 text-slate-700'
                  }`}>
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {saveNotification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveNotification}</span>
          </div>
        )}
      </div>

      {/* STEP CONTENTS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
        {/* LANGKAH 1: Identitas & Model */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Langkah 1: Identitas & Model Pembelajaran</h4>
              <p className="text-xs text-slate-500">Menentukan parameter formal kurikulum dan model sintaks.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={modulData.subject}
                  onChange={(e) => setModulData({ ...modulData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fase / Kelas</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={modulData.phase}
                    onChange={(e) => setModulData({ ...modulData, phase: e.target.value as Phase })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="A">Fase A</option>
                    <option value="B">Fase B</option>
                    <option value="C">Fase C</option>
                    <option value="D">Fase D</option>
                    <option value="E">Fase E</option>
                    <option value="F">Fase F</option>
                  </select>
                  <input
                    type="text"
                    value={modulData.grade}
                    onChange={(e) => setModulData({ ...modulData, grade: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Model Pembelajaran</label>
                <select
                  value={modulData.learningModel}
                  onChange={(e) => setModulData({ ...modulData, learningModel: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {LEARNING_MODELS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alokasi Waktu (JP & Pertemuan)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={modulData.totalJp}
                    onChange={(e) => setModulData({ ...modulData, totalJp: parseInt(e.target.value) || 0 })}
                    placeholder="Total JP"
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <input
                    type="number"
                    value={modulData.totalSessions}
                    onChange={(e) => setModulData({ ...modulData, totalSessions: parseInt(e.target.value) || 0 })}
                    placeholder="Jml Pertemuan"
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Integrasi Lintas Disiplin</label>
                <input
                  type="text"
                  value={modulData.crossSubjectIntegration}
                  onChange={(e) => setModulData({ ...modulData, crossSubjectIntegration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 2: Pemilihan TP */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Langkah 2: Pemilihan & Pengikatan TP</h4>
              <p className="text-xs text-slate-500">Pilih Tujuan Pembelajaran sasaran dari langkah sebelumnya atau ketik manual.</p>
            </div>
            {tps.length > 0 ? (
              <div className="space-y-2">
                {tps.map(tp => {
                  const isSelected = modulData.selectedTpIds.includes(tp.id);
                  return (
                    <div
                      key={tp.id}
                      onClick={() => {
                        const newIds = isSelected 
                          ? modulData.selectedTpIds.filter(id => id !== tp.id)
                          : [...modulData.selectedTpIds, tp.id];
                        const newTexts = tps.filter(t => newIds.includes(t.id)).map(t => t.text);
                        setModulData({ ...modulData, selectedTpIds: newIds, selectedTpTexts: newTexts });
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-2xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="mt-0.5 rounded accent-emerald-600"
                      />
                      <div>
                        <span className="font-bold text-xs mr-2">{tp.id}:</span>
                        <span className="text-xs leading-relaxed">{tp.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Tujuan Pembelajaran Utama</label>
                <textarea
                  rows={3}
                  value={modulData.selectedTpTexts[0] || ''}
                  onChange={(e) => setModulData({ ...modulData, selectedTpTexts: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  placeholder="Ketik Tujuan Pembelajaran sasaran..."
                />
              </div>
            )}
          </div>
        )}

        {/* LANGKAH 3: KKTP & Rubrik */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Langkah 3: KKTP & Rubrik 4 Interval</h4>
                <p className="text-xs text-slate-500">Kriteria Ketercapaian Tujuan Pembelajaran dengan rubrik deskriptif bertingkat.</p>
              </div>
              <button
                onClick={async () => {
                  const res = await generateKKTP({
                    selectedTp: getTargetPembelajaranList(),
                    subject: modulData.subject,
                    globalContext
                  });
                  setModulData({ ...modulData, kktp: res });
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Susun KKTP AI
              </button>
            </div>

            {modulData.kktp && modulData.kktp.length > 0 ? (
              <div className="space-y-3">
                {modulData.kktp.map((k, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">Indikator {idx + 1}: {k.indicator}</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Tuntas: {k.passingThreshold}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                      <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg">
                        <span className="font-bold text-rose-800 block mb-0.5">Perlu Bimbingan (0-60%)</span>
                        <p className="text-rose-900 leading-tight">{k.rubric.perluBimbingan}</p>
                      </div>
                      <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                        <span className="font-bold text-amber-800 block mb-0.5">Cukup (61-75%)</span>
                        <p className="text-amber-900 leading-tight">{k.rubric.cukup}</p>
                      </div>
                      <div className="p-2 bg-sky-50 border border-sky-100 rounded-lg">
                        <span className="font-bold text-sky-800 block mb-0.5">Baik (76-88%)</span>
                        <p className="text-sky-900 leading-tight">{k.rubric.baik}</p>
                      </div>
                      <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <span className="font-bold text-emerald-800 block mb-0.5">Sangat Baik (89-100%)</span>
                        <p className="text-emerald-900 leading-tight">{k.rubric.sangatBaik}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Belum ada data KKTP. Klik "Susun KKTP AI" di kanan atas atau "Susun Seluruh Modul Otomatis".
              </p>
            )}
          </div>
        )}

        {/* LANGKAH 4: Asesmen Diagnostik */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Langkah 4: Asesmen Awal Kognitif (3 Level Diagnostik)</h4>
              <p className="text-xs text-slate-500">Mendeteksi kesiapan materi prasyarat sebelum memulai kegiatan inti.</p>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Level -2 (Prasyarat Rendah)</span>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Pertanyaan Diagnostik:</span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">{modulData.initialCognitiveAssessment.levelMinus2.question}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Rencana Tindak Lanjut Pedagogis:</span>
                  <p className="text-xs text-slate-700 mt-0.5">{modulData.initialCognitiveAssessment.levelMinus2.followUp}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Level -1 (Prasyarat Menengah)</span>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Pertanyaan Diagnostik:</span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">{modulData.initialCognitiveAssessment.levelMinus1.question}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Rencana Tindak Lanjut Pedagogis:</span>
                  <p className="text-xs text-slate-700 mt-0.5">{modulData.initialCognitiveAssessment.levelMinus1.followUp}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Level Saat Ini (Target Kompetensi)</span>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Pertanyaan Diagnostik:</span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">{modulData.initialCognitiveAssessment.levelCurrent.question}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Rencana Tindak Lanjut Pedagogis:</span>
                  <p className="text-xs text-slate-700 mt-0.5">{modulData.initialCognitiveAssessment.levelCurrent.followUp}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 5: Kegiatan Belajar */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Langkah 5: Kegiatan Pembelajaran Berdiferensiasi</h4>
                <p className="text-xs text-slate-500">Sintaks model pembelajaran dengan diferensiasi konten, proses, dan produk.</p>
              </div>
            </div>

            {modulData.learningActivities && modulData.learningActivities.length > 0 ? (
              <div className="space-y-4">
                {modulData.learningActivities.map((act) => (
                  <div key={act.sessionNumber} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-xs text-emerald-900">
                        Pertemuan Ke-{act.sessionNumber}: {act.title} ({act.durationMinutes} Menit)
                      </h5>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase">Kegiatan Awal (Pendahuluan):</span>
                        <ul className="list-disc pl-5 text-slate-600 space-y-0.5 mt-1">
                          {act.preliminary.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>

                      <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1 text-emerald-950">
                        <span className="font-bold text-emerald-900 block text-[11px] uppercase">Diferensiasi Pembelajaran:</span>
                        <p><strong>Konten:</strong> {act.coreActivities.differentiatedContent || '-'}</p>
                        <p><strong>Proses:</strong> {act.coreActivities.differentiatedProcess || '-'}</p>
                        <p><strong>Produk:</strong> {act.coreActivities.differentiatedProduct || '-'}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase">Alur Kerja Utama:</span>
                        <ol className="list-decimal pl-5 text-slate-600 space-y-0.5 mt-1">
                          {act.coreActivities.mainFlow.map((f, i) => <li key={i}>{f}</li>)}
                        </ol>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase">Kegiatan Penutup:</span>
                        <ul className="list-disc pl-5 text-slate-600 space-y-0.5 mt-1">
                          {act.closing.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Belum ada rincian kegiatan pembelajaran. Klik "Susun Seluruh Modul Otomatis (AI)" di atas.
              </p>
            )}
          </div>
        )}

        {/* LANGKAH 6: Asesmen Formatif & Sumatif */}
        {activeStep === 6 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Langkah 6: Asesmen Formatif & Sumatif Lingkup Materi</h4>
              <p className="text-xs text-slate-500">Instrumen asesmen proses (for learning), asesmen diri (as learning), dan sumatif (of learning).</p>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                <span className="font-bold text-emerald-800 block text-[11px] uppercase">1. Asesmen Formatif (For Learning)</span>
                <p className="font-semibold text-slate-900">{modulData.formativeAssessment.title}</p>
                <p className="text-slate-600">{modulData.formativeAssessment.instruction}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                <span className="font-bold text-blue-800 block text-[11px] uppercase">2. Asesmen Diri & Teman Sebaya (As Learning)</span>
                <p className="font-semibold text-slate-900">{modulData.selfPeerAssessment.title}</p>
                <p className="text-slate-600">{modulData.selfPeerAssessment.instruction}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                <span className="font-bold text-purple-800 block text-[11px] uppercase">3. Asesmen Sumatif Akhir (Of Learning)</span>
                <p className="font-semibold text-slate-900">{modulData.summativeAssessment.title}</p>
                <p className="text-slate-600">{modulData.summativeAssessment.instruction}</p>
              </div>
            </div>
          </div>
        )}

        {/* LANGKAH 7: Refleksi & Sumber Belajar */}
        {activeStep === 7 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Langkah 7: Refleksi Guru & Peserta Didik serta Sumber Belajar</h4>
              <p className="text-xs text-slate-500">Panduan refleksi berkala dan daftar referensi materi pembelajaran.</p>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pertanyaan Refleksi Guru</label>
                <ul className="list-disc pl-5 text-slate-600 space-y-1">
                  {modulData.reflectionTeacher.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pertanyaan Refleksi Peserta Didik</label>
                <ul className="list-disc pl-5 text-slate-600 space-y-1">
                  {modulData.reflectionStudent.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sumber Belajar & Referensi</label>
                <div className="space-y-1">
                  {modulData.learningResources.map((res, idx) => (
                    <p key={idx} className="bg-slate-50 p-2 rounded-lg text-slate-700 border border-slate-200">
                      {res}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          {activeStep > 1 && (
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Langkah Sebelumnya
            </button>
          )}
          {activeStep < 7 && (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              Langkah Berikutnya <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToArsip}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" /> Simpan ke Koleksi
          </button>
          <button
            onClick={handleExportDocx}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor DOCX
          </button>
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak PDF
          </button>
        </div>
      </div>
    </div>
  );
};
