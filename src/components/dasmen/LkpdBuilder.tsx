import React, { useState } from 'react';
import { FileSpreadsheet, Sparkles, Download, Printer, Save, CheckCircle2 } from 'lucide-react';
import { LKPDData, GlobalContext, SavedDocument } from '../../types';
import { generateAssessmentsAndLKPD } from '../../lib/gemini/prompts';
import { exportLkpdToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printLkpd } from '../../lib/export/pdfExport';

interface LkpdBuilderProps {
  globalContext: GlobalContext;
  currentDraft: Partial<LKPDData> | null;
  onSaveDraft: (data: LKPDData) => void;
  onSaveToCollection: (doc: SavedDocument) => void;
}

export const LkpdBuilder: React.FC<LkpdBuilderProps> = ({
  globalContext,
  currentDraft,
  onSaveDraft,
  onSaveToCollection
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveBadge, setSaveBadge] = useState(false);

  const [lkpdData, setLkpdData] = useState<LKPDData>({
    title: currentDraft?.title || 'Lembar Kerja Peserta Didik (LKPD) Berdiferensiasi',
    subject: currentDraft?.subject || 'Bahasa Indonesia',
    grade: currentDraft?.grade || 'Kelas 7',
    targetClass: currentDraft?.targetClass || 'Kelas 7-A',
    phase: currentDraft?.phase || 'D',
    duration: currentDraft?.duration || '2 x 40 Menit',
    learningObjectives: currentDraft?.learningObjectives || [
      'Menemukan informasi tersirat dari teks deskripsi lingkungan lokal.',
      'Menyusun peta pikiran hasil analisis permasalahan lingkungan sekolah bersama kelompok.'
    ],
    instructions: currentDraft?.instructions || [
      'Bacalah ringkasan materi dengan cermat bersama anggota kelompokmu.',
      'Diskusikan setiap pertanyaan dan bagi tugas secara adil.',
      'Tuliskan hasil kerja kelompok pada lembar jawaban yang tersedia secara rapi.'
    ],
    briefMaterial: currentDraft?.briefMaterial || `Teks deskripsi adalah teks yang melukiskan sesuatu sesuai dengan keadaan sebenarnya sehingga pembaca dapat melihat, mendengar, mencium, dan merasakan apa yang dilukiskan. Di lingkungan ${globalContext.identity.cityDistrict}, kita dapat mengamati secara langsung keanekaragaman dan tantangan lokal seperti pengelolaan sampah kantin dan pelestarian kebun sekolah sebagai objek deskripsi faktual.`,
    activities: currentDraft?.activities || [
      {
        stepNumber: 1,
        activityName: 'Aktivitas 1: Observasi Lingkungan Terbimbing',
        instruction: 'Amatilah salah satu sudut sekolah selama 10 menit, catat 3 objek indrawi (apa yang terlihat, terdengar, dan tercium).'
      },
      {
        stepNumber: 2,
        activityName: 'Aktivitas 2: Kolaborasi Penyusunan Deskripsi',
        instruction: 'Susun kalimat deskriptif menggunakan kata konkret dan panca indra bersama rekan kelompokmu.'
      }
    ],
    questions: currentDraft?.questions || [
      {
        number: 1,
        questionText: 'Berdasarkan pengamatanmu, mengapa deskripsi yang rinci memudahkan orang lain memahami kondisi lingkungan tersebut?',
        type: 'analytic',
        answerGuide: 'Siswa menjelaskan pentingnya rincian indrawi dalam menggambarkan keadaan nyata.'
      },
      {
        number: 2,
        questionText: 'Bagaimana solusi konkret yang dapat kalian usulkan untuk menjaga keindahan dan kebersihan sudut sekolah yang kalian amati?',
        type: 'essay',
        answerGuide: 'Siswa menguraikan ide solutif yang realistis dan dapat diterapkan kelompok.'
      }
    ],
    studentTask: currentDraft?.studentTask || 'Susun teks deskripsi 3 paragraf mengenai sudut sekolah yang diobservasi beserta gambar pendukungnya.',
    reflectionQuestions: currentDraft?.reflectionQuestions || [
      'Apa hal paling berharga yang saya pelajari hari ini?',
      'Bagian mana dari kerja kelompok yang paling menyenangkan dan menantang?'
    ],
    conclusionPrompt: currentDraft?.conclusionPrompt || 'Tuliskan satu kalimat kesimpulan utama yang disepakati oleh seluruh anggota kelompok:'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAssessmentsAndLKPD({
        selectedTp: [
          {
            id: 'TP-LKPD',
            sequence: 1,
            text: lkpdData.learningObjectives[0] || 'Tujuan Pembelajaran',
            material: lkpdData.subject,
            competency: 'Menganalisis dan Mengomunikasikan',
            evidence: 'LKPD dan tugas kelompok'
          }
        ],
        subject: lkpdData.subject,
        grade: lkpdData.grade,
        phase: lkpdData.phase,
        learningModel: 'Berdiferensiasi',
        globalContext
      });
      setLkpdData(res.lkpd);
      onSaveDraft(res.lkpd);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportDocx = async () => {
    try {
      const blob = await exportLkpdToDocx(lkpdData, globalContext);
      downloadBlob(blob, `LKPD-${lkpdData.subject}-${lkpdData.grade}.docx`);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrintPdf = () => {
    printLkpd(lkpdData, globalContext);
  };

  const handleSaveToCollection = () => {
    const doc: SavedDocument = {
      id: `LKPD-${Date.now()}`,
      title: `LKPD: ${lkpdData.title} (${lkpdData.subject})`,
      category: 'lkpd',
      subjectOrTheme: lkpdData.subject,
      gradeOrAge: lkpdData.grade,
      createdAt: new Date().toISOString(),
      data: lkpdData
    };
    onSaveToCollection(doc);
    setSaveBadge(true);
    setTimeout(() => setSaveBadge(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              Lembar Kerja Peserta Didik (LKPD) Siap Cetak
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              LKPD kontekstual dengan ruang isian jawaban siswa, aktivitas kolaboratif, dan format formal sekolah.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Menyusun LKPD...' : 'Generate LKPD AI'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul LKPD</label>
            <input
              type="text"
              value={lkpdData.title}
              onChange={(e) => setLkpdData({ ...lkpdData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran & Kelas</label>
            <input
              type="text"
              value={`${lkpdData.subject} - ${lkpdData.grade}`}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                setLkpdData({
                  ...lkpdData,
                  subject: parts[0]?.trim() || lkpdData.subject,
                  grade: parts[1]?.trim() || lkpdData.grade
                });
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Preview Sheet Styled like Paper */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b-2 border-slate-900 pb-3 text-center">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide uppercase">
            {lkpdData.title}
          </h2>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            {lkpdData.subject} • {lkpdData.grade} ({lkpdData.phase}) • {globalContext.identity.schoolName}
          </p>
        </div>

        {/* Student Group Meta Block */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <span className="text-slate-500 block">Nama Kelompok / Siswa:</span>
            <span className="font-semibold text-slate-800">........................................................................</span>
          </div>
          <div>
            <span className="text-slate-500 block">Hari / Tanggal:</span>
            <span className="font-semibold text-slate-800">........................................................................</span>
          </div>
        </div>

        {/* Tujuan & Petunjuk */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">A. Tujuan Pembelajaran</h4>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            {lkpdData.learningObjectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">B. Petunjuk Pengerjaan</h4>
          <ol className="list-decimal pl-5 text-slate-700 space-y-1">
            {lkpdData.instructions.map((ins, i) => <li key={i}>{ins}</li>)}
          </ol>
        </div>

        {/* Ringkasan Materi */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">C. Ringkasan Materi</h4>
          <div className="p-3.5 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-xl text-slate-800 leading-relaxed">
            {lkpdData.briefMaterial}
          </div>
        </div>

        {/* Aktivitas Siswa */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">D. Aktivitas Siswa</h4>
          {lkpdData.activities.map((a, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">{a.activityName}</span>
              <p className="text-slate-600">{a.instruction}</p>
            </div>
          ))}
        </div>

        {/* Pertanyaan Diskusi dengan Ruang Jawaban */}
        <div className="space-y-4 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">E. Pertanyaan & Ruang Jawaban Siswa</h4>
          {lkpdData.questions.map((q, idx) => (
            <div key={idx} className="space-y-2">
              <span className="font-bold text-slate-900">{idx + 1}. {q.questionText}</span>
              <div className="h-24 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-2 text-slate-400 italic text-[11px]">
                Ruang jawaban siswa...
              </div>
            </div>
          ))}
        </div>

        {/* Refleksi */}
        <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">F. Refleksi Bersama</h4>
          <ul className="list-disc pl-5 text-slate-600 space-y-1">
            {lkpdData.reflectionQuestions.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          {saveBadge && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> LKPD berhasil diarsipkan!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToCollection}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Simpan Dokumen
          </button>
          <button
            onClick={handleExportDocx}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor DOCX (Word)
          </button>
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Lembar LKPD
          </button>
        </div>
      </div>
    </div>
  );
};
