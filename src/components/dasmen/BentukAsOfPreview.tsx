import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Bookmark, 
  Copy, 
  Check, 
  Layers, 
  RotateCcw,
  X,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react';
import { GlobalContext, SavedDocument } from '../../types';

export interface BentukAsOfData {
  asLearningType: string;
  ofLearningType: string;
  subject: string;
  grade: string;
  phase: string;
  tpText: string;
  selectedDimensions: string[];
}

interface BentukAsOfPreviewProps {
  data: BentukAsOfData;
  globalContext: GlobalContext;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate?: () => void;
  onOpenCollection?: () => void;
  onDevelopOtherTp?: () => void;
  onSaveToCollection?: (doc: SavedDocument) => void;
}

export const BentukAsOfPreview: React.FC<BentukAsOfPreviewProps> = ({
  data,
  globalContext,
  isOpen,
  onClose,
  onRegenerate,
  onOpenCollection,
  onDevelopOtherTp,
  onSaveToCollection
}) => {
  const [activePage, setActivePage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const teacherName = globalContext?.identity?.teacherName || 'Guru Pengampu, S.Pd.';
  const teacherNip = globalContext?.identity?.teacherNip || '19850315 201001 1 012';
  const principalName = globalContext?.identity?.principalName || 'Kepala Sekolah, M.Pd.';
  const principalNip = globalContext?.identity?.principalNip || '19760820 200212 1 005';
  const schoolName = globalContext?.identity?.schoolName || 'SD Negeri Percobaan 1';
  const city = globalContext?.identity?.cityDistrict || 'Kota Bandung';
  const currentYear = '2025/2026';

  const handleCopyText = () => {
    const text = `
INSTRUMEN ASESMEN BENTUK AS & OF LEARNING
${schoolName.toUpperCase()}
Mata Pelajaran: ${data.subject} (${data.grade} / Fase ${data.phase})
Tujuan Pembelajaran: ${data.tpText}

1. Bentuk As Learning: ${data.asLearningType}
2. Bentuk Of Learning: ${data.ofLearningType}
Penyusun: ${teacherName}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const doc: SavedDocument = {
      id: `as-of-${Date.now()}`,
      title: `Instrumen As & Of Learning - ${data.subject} (${data.grade})`,
      category: 'modul_dasmen',
      subjectOrTheme: data.subject,
      gradeOrAge: data.grade,
      createdAt: new Date().toISOString(),
      data: {
        ...data,
        type: 'as_of_assessment'
      }
    };
    onSaveToCollection?.(doc);
    setSavedNotice('Instrumen Asesmen As & Of Learning berhasil disimpan ke Koleksi Dokumen!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-100 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 max-h-[95vh] flex flex-col overflow-hidden my-auto">
        
        {/* Top Header Bar */}
        <div className="bg-[#0f2942] text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <FileCheck2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider rounded-md">
                  Dokumen As &amp; Of Learning
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Format Resmi 5 Lembar (as 0f_001.png – as 0f_005.png)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif mt-0.5 text-white">
                Instrumen Penilaian: {data.asLearningType} &amp; {data.ofLearningType}
              </h3>
              <p className="text-xs text-slate-300">
                {schoolName} · {data.subject} · {data.grade} (Fase {data.phase})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simpan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notices */}
        {savedNotice && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2 px-6 shrink-0">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* View mode & Page Selector Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-[#0f2942] text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Per Lembar
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                viewMode === 'all'
                  ? 'bg-[#0f2942] text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Halaman</span>
            </button>
          </div>

          {viewMode === 'single' && (
            <div className="flex items-center gap-1 overflow-x-auto text-xs py-0.5">
              {[
                { num: 1, label: 'Lembar 1 (as 0f_001.png): Identitas & Kisi-kisi' },
                { num: 2, label: 'Lembar 2 (as 0f_002.png): Instrumen As Learning (Diri)' },
                { num: 3, label: 'Lembar 3 (as 0f_003.png): Instrumen As Learning (Teman)' },
                { num: 4, label: 'Lembar 4 (as 0f_004.png): Instrumen Of Learning & Rubrik' },
                { num: 5, label: 'Lembar 5 (as 0f_005.png): Rekapitulasi & Pengesahan' }
              ].map((p) => (
                <button
                  key={p.num}
                  type="button"
                  onClick={() => setActivePage(p.num)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activePage === p.num
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Lembar {p.num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Paper Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ============================================================ */}
          {/* LEMBAR 1: as 0f_001.png - Identitas & Kisi-Kisi Pemetaan Asesmen */}
          {/* ============================================================ */}
          {(viewMode === 'all' || activePage === 1) && (
            <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[800px] min-h-[1000px] p-6 sm:p-10 font-serif text-[12px] leading-relaxed text-slate-900 relative">
              {/* Kop Surat */}
              <div className="text-center pb-3 border-b-2 border-slate-900 mb-4">
                <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
                  PEMETAAN &amp; KISI-KISI ASESMEN PEMBELAJARAN
                </h1>
                <h2 className="text-xs sm:text-sm font-bold uppercase text-slate-800">
                  BENTUK AS LEARNING &amp; OF LEARNING · KURIKULUM MERDEKA
                </h2>
                <h3 className="text-xs font-semibold text-slate-700 uppercase">
                  {schoolName.toUpperCase()} — TAHUN AJARAN {currentYear}
                </h3>
                <div className="w-full border-t border-slate-400 mt-1.5" />
              </div>

              {/* Identitas Dokumen */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1">
                  I. IDENTITAS ASESMEN
                </h4>

                <div className="border border-slate-300 rounded overflow-hidden">
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="w-1/3 p-2 bg-slate-50 font-bold border-r border-slate-200">Mata Pelajaran</td>
                        <td className="p-2 font-semibold">{data.subject}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Fase / Kelas</td>
                        <td className="p-2">Fase {data.phase} / {data.grade}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Tujuan Pembelajaran (TP)</td>
                        <td className="p-2">{data.tpText}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Bentuk As Learning (Reflektif)</td>
                        <td className="p-2 font-medium text-purple-900 bg-purple-50/40">{data.asLearningType}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Bentuk Of Learning (Sumatif)</td>
                        <td className="p-2 font-medium text-blue-900 bg-blue-50/40">{data.ofLearningType}</td>
                      </tr>
                      <tr>
                        <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Guru Penyusun</td>
                        <td className="p-2">{teacherName} (NIP. {teacherNip})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Prinsip Asesmen As & Of */}
                <div>
                  <h4 className="font-bold text-xs tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    II. PRINSIP INTEGRASI ASESMEN
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 border border-purple-200 bg-purple-50/30 rounded-lg space-y-1">
                      <p className="font-bold text-purple-950 uppercase text-[11px]">Assessment AS Learning</p>
                      <p className="text-slate-700">
                        Berfungsi sebagai proses belajar itu sendiri bagi murid. Melalui <strong>{data.asLearningType}</strong>, murid diajak melatih metakognisi, mengevaluasi kekuatan diri, dan menetapkan target perbaikan secara mandiri.
                      </p>
                    </div>
                    <div className="p-3 border border-blue-200 bg-blue-50/30 rounded-lg space-y-1">
                      <p className="font-bold text-blue-950 uppercase text-[11px]">Assessment OF Learning</p>
                      <p className="text-slate-700">
                        Berfungsi sebagai konfirmasi ketercapaian tujuan pembelajaran pada akhir siklus. Melalui <strong>{data.ofLearningType}</strong>, capaian kompetensi murid diukur secara objektif menggunakan kriteria rubrik terstandar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matriks Kisi-Kisi */}
                <div>
                  <h4 className="font-bold text-xs tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    III. MATRIKS KISI-KISI INSTRUMEN
                  </h4>
                  <div className="overflow-x-auto border border-slate-300 rounded">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                          <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                          <th className="p-2 border-r border-slate-300 text-left">Indikator Ketercapaian</th>
                          <th className="p-2 border-r border-slate-300 text-left">Fungsi Asesmen</th>
                          <th className="p-2 border-r border-slate-300 text-left">Bentuk Instrumen</th>
                          <th className="p-2 text-center w-24">Waktu Pelaksanaan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200 text-center">1</td>
                          <td className="p-2 border-r border-slate-200 font-medium">Refleksi Pemahaman &amp; Kesadaran Belajar</td>
                          <td className="p-2 border-r border-slate-200 text-purple-900 font-semibold">Assessment as Learning</td>
                          <td className="p-2 border-r border-slate-200">{data.asLearningType}</td>
                          <td className="p-2 text-center">Selama/Akhir Aktivitas</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200 text-center">2</td>
                          <td className="p-2 border-r border-slate-200 font-medium">Umpan Balik Kemitraan Antarmurid</td>
                          <td className="p-2 border-r border-slate-200 text-purple-900 font-semibold">Assessment as Learning</td>
                          <td className="p-2 border-r border-slate-200">Lembar Penilaian Antarteman</td>
                          <td className="p-2 text-center">Kegiatan Kelompok</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r border-slate-200 text-center">3</td>
                          <td className="p-2 border-r border-slate-200 font-medium">Penguasaan Kompetensi TP Akhir</td>
                          <td className="p-2 border-r border-slate-200 text-blue-900 font-semibold">Assessment of Learning</td>
                          <td className="p-2 border-r border-slate-200">{data.ofLearningType}</td>
                          <td className="p-2 text-center">Akhir Lingkup Materi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer Lembar 1 */}
              <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
                <span>Instrumen As &amp; Of Learning - {data.subject}</span>
                <span>Lembar 1 dari 5 · Dokumen as 0f_001.png</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LEMBAR 2: as 0f_002.png - Instrumen As Learning (Diri / Refleksi) */}
          {/* ============================================================ */}
          {(viewMode === 'all' || activePage === 2) && (
            <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[800px] min-h-[1000px] p-6 sm:p-10 font-serif text-[12px] leading-relaxed text-slate-900 relative">
              <div className="text-center pb-3 border-b-2 border-purple-900 mb-4">
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-bold uppercase tracking-wider rounded">
                  ASSESSMENT AS LEARNING (BAGIAN I)
                </span>
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900 mt-1">
                  LEMBAR REFLEKSI DIRI &amp; METAKOGNISI SISWA
                </h2>
                <p className="text-xs text-slate-600">
                  {schoolName} · Bentuk Instrumen: {data.asLearningType}
                </p>
              </div>

              <div className="space-y-4">
                {/* Kolom Isian Siswa */}
                <div className="border border-slate-300 rounded p-2.5 bg-slate-50/70 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Nama Peserta Didik: ........................................................</div>
                    <div>Kelas / No. Presensi: {data.grade} / ....................</div>
                    <div>Hari, Tanggal: ..............................................................</div>
                    <div>Mata Pelajaran: {data.subject}</div>
                  </div>
                </div>

                {/* Petunjuk Pengisian */}
                <div className="p-2.5 bg-purple-50/50 border border-purple-200 rounded text-xs text-purple-950">
                  <strong>Petunjuk:</strong> Bacalah setiap pernyataan dengan cermat. Berikan tanda centang (✓) pada kolom yang paling sesuai dengan perasaan dan usahamu sendiri selama pembelajaran berlangsung. Tidak ada jawaban yang salah.
                </div>

                {/* Tabel Refleksi Diri */}
                <div className="overflow-x-auto border border-slate-300 rounded">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300">
                        <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                        <th className="p-2 border-r border-slate-300 text-left">Pernyataan Refleksi Diri</th>
                        <th className="p-2 border-r border-slate-300 text-center w-16">Sangat Setuju</th>
                        <th className="p-2 border-r border-slate-300 text-center w-16">Setuju</th>
                        <th className="p-2 border-r border-slate-300 text-center w-16">Kurang Setuju</th>
                        <th className="p-2 text-center w-16">Tidak Setuju</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center">1</td>
                        <td className="p-2 border-r border-slate-200">Saya memahami materi dan tujuan belajar hari ini dengan jelas.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50/40">
                        <td className="p-2 border-r border-slate-200 text-center">2</td>
                        <td className="p-2 border-r border-slate-200">Saya berusaha menyelesaikan tugas dengan mandiri sebelum meminta bantuan guru atau teman.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center">3</td>
                        <td className="p-2 border-r border-slate-200">Saya berani mengajukan pertanyaan saat ada langkah penyelesaian yang belum saya pahami.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50/40">
                        <td className="p-2 border-r border-slate-200 text-center">4</td>
                        <td className="p-2 border-r border-slate-200">Saya mendengarkan dan menghargai pendapat teman saat berdiskusi bersama.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-200 text-center">5</td>
                        <td className="p-2 border-r border-slate-200">Saya mengetahui hal yang perlu saya pelajari lagi di rumah agar pemahaman saya bertambah.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bagian Tiket Keluar / Jurnal Terbuka */}
                <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 space-y-2.5">
                  <p className="font-bold text-xs uppercase text-slate-900">
                    Jurnal Reflektif Singkat (Tiket Solusi Diri):
                  </p>
                  <div>
                    <p className="text-xs text-slate-700">1. Hal baru yang paling bermakna yang saya temukan hari ini:</p>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700">2. Kesulitan yang masih saya alami dan rencana saya mengatasinya:</p>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700">3. Target perilaku baik yang akan saya lakukan di rumah besok:</p>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-1" />
                  </div>
                </div>

                {/* Kotak Tanda Tangan */}
                <div className="flex justify-between pt-4 text-xs">
                  <div className="text-center">
                    <p>Mengetahui Orang Tua / Wali,</p>
                    <div className="h-12" />
                    <p>( ...................................................... )</p>
                  </div>
                  <div className="text-center">
                    <p>Peserta Didik,</p>
                    <div className="h-12" />
                    <p>( ...................................................... )</p>
                  </div>
                </div>
              </div>

              {/* Footer Lembar 2 */}
              <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
                <span>Instrumen As &amp; Of Learning - {data.subject}</span>
                <span>Lembar 2 dari 5 · Dokumen as 0f_002.png</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LEMBAR 3: as 0f_003.png - Instrumen As Learning (Peer-Assessment) */}
          {/* ============================================================ */}
          {(viewMode === 'all' || activePage === 3) && (
            <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[800px] min-h-[1000px] p-6 sm:p-10 font-serif text-[12px] leading-relaxed text-slate-900 relative">
              <div className="text-center pb-3 border-b-2 border-purple-900 mb-4">
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-bold uppercase tracking-wider rounded">
                  ASSESSMENT AS LEARNING (BAGIAN II)
                </span>
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900 mt-1">
                  LEMBAR PENILAIAN ANTARTEMAN (PEER-ASSESSMENT)
                </h2>
                <p className="text-xs text-slate-600">
                  {schoolName} · Kolaborasi &amp; Umpan Balik Konstruktif
                </p>
              </div>

              <div className="space-y-4">
                {/* Identitas Pasangan */}
                <div className="border border-slate-300 rounded p-2.5 bg-slate-50/70 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Nama Penilai: ............................................................</div>
                    <div>Nama Teman yang Dinilai: ............................................</div>
                    <div>Kelas / Kelompok: {data.grade} / .....................</div>
                    <div>Topik Aktivitas: {data.tpText}</div>
                  </div>
                </div>

                <div className="p-2.5 bg-purple-50/50 border border-purple-200 rounded text-xs text-purple-950">
                  <strong>Panduan:</strong> Berikan penilaian yang jujur, santun, dan objektif kepada temanmu. Tujuannya adalah saling menyemangati agar belajar bersama menjadi lebih efektif dan menyenangkan.
                </div>

                {/* Tabel Penilaian Teman */}
                <div className="overflow-x-auto border border-slate-300 rounded">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300">
                        <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                        <th className="p-2 border-r border-slate-300 text-left">Aspek Kolaborasi &amp; Sikap Teman</th>
                        <th className="p-2 border-r border-slate-300 text-center w-20">Selalu (4)</th>
                        <th className="p-2 border-r border-slate-300 text-center w-20">Sering (3)</th>
                        <th className="p-2 border-r border-slate-300 text-center w-20">Kadang (2)</th>
                        <th className="p-2 text-center w-20">Belum (1)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center">1</td>
                        <td className="p-2 border-r border-slate-200">Aktif berpartisipasi dan memberikan ide dalam kerja kelompok.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50/40">
                        <td className="p-2 border-r border-slate-200 text-center">2</td>
                        <td className="p-2 border-r border-slate-200">Mau mendengarkan pendapat teman dan tidak memotong pembicaraan.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center">3</td>
                        <td className="p-2 border-r border-slate-200">Membantu menyelesaikan tugas kelompok sesuai pembagian peran.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50/40">
                        <td className="p-2 border-r border-slate-200 text-center">4</td>
                        <td className="p-2 border-r border-slate-200">Menghargai hasil kerja dan karya sesama teman tanpa mengejek.</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 border-r border-slate-200 text-center">☐</td>
                        <td className="p-2 text-center">☐</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Catatan Umpan Balik Positif */}
                <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 space-y-2">
                  <p className="font-bold text-xs uppercase text-slate-900">
                    Pesan Apresiasi &amp; Masukan Ramah untuk Teman:
                  </p>
                  <div>
                    <p className="text-xs text-slate-700">"Hal paling hebat yang kamu lakukan hari ini adalah:"</p>
                    <div className="h-8 border-b border-dashed border-slate-400 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700">"Saran saya agar kelompok kita semakin kompak selanjutnya:"</p>
                    <div className="h-8 border-b border-dashed border-slate-400 mt-1" />
                  </div>
                </div>

                {/* Tanda Tangan Penilai */}
                <div className="flex justify-end pt-4 text-xs">
                  <div className="text-center w-48">
                    <p>{city}, .............................. {currentYear.split('/')[0]}</p>
                    <p className="mt-1">Teman Penilai,</p>
                    <div className="h-12" />
                    <p>( ...................................................... )</p>
                  </div>
                </div>
              </div>

              {/* Footer Lembar 3 */}
              <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
                <span>Instrumen As &amp; Of Learning - {data.subject}</span>
                <span>Lembar 3 dari 5 · Dokumen as 0f_003.png</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LEMBAR 4: as 0f_004.png - Instrumen Of Learning & Rubrik Penilaian */}
          {/* ============================================================ */}
          {(viewMode === 'all' || activePage === 4) && (
            <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[800px] min-h-[1000px] p-6 sm:p-10 font-serif text-[12px] leading-relaxed text-slate-900 relative">
              <div className="text-center pb-3 border-b-2 border-blue-900 mb-4">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold uppercase tracking-wider rounded">
                  ASSESSMENT OF LEARNING (SUMATIF AKHIR)
                </span>
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900 mt-1">
                  INSTRUMEN &amp; RUBRIK PENILAIAN: {data.ofLearningType.toUpperCase()}
                </h2>
                <p className="text-xs text-slate-600">
                  {schoolName} · TP: {data.tpText}
                </p>
              </div>

              <div className="space-y-4">
                {/* Deskripsi Tugas / Soal Sumatif */}
                <div className="p-3 border border-blue-200 bg-blue-50/40 rounded-lg space-y-1.5 text-xs">
                  <p className="font-bold text-blue-950 uppercase">Deskripsi Penugasan Sumatif:</p>
                  <p className="text-slate-800">
                    Peserta didik mendemonstrasikan pemahaman komprehensif mengenai penerapan nilai-nilai Pancasila dalam keluarga melalui presentasi lisan, portofolio misi detektif, atau penugasan terstruktur yang memuat analisis perilaku dan pemecahan masalah sederhana.
                  </p>
                </div>

                {/* Rubrik Penilaian 4 Kategori Terstandar */}
                <div>
                  <p className="font-bold text-xs uppercase text-slate-900 mb-1.5">
                    Rubrik Penilaian Kinerja Ketercapaian (Skala 4 Tingkat):
                  </p>
                  <div className="overflow-x-auto border border-slate-300 rounded">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                          <th className="p-2 border-r border-slate-300 text-left w-1/4">Kriteria Penilaian</th>
                          <th className="p-2 border-r border-slate-300 text-left w-1/5">Perlu Bimbingan (0–69)</th>
                          <th className="p-2 border-r border-slate-300 text-left w-1/5 bg-blue-50 text-blue-950">Berkembang (70–80) *Ambang</th>
                          <th className="p-2 border-r border-slate-300 text-left w-1/5">Cakap (81–90)</th>
                          <th className="p-2 text-left w-1/5">Sangat Baik (91–100)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200 font-semibold">1. Penguasaan Konsep &amp; Simbol</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">Menyebutkan lambang hanya dengan bimbingan penuh guru.</td>
                          <td className="p-2 border-r border-slate-200 text-slate-800 bg-blue-50/30">Mencocokkan lambang dan sila dengan tepat secara mandiri.</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">Mampu menjelaskan arti simbol dan nilai dasarnya dengan jelas.</td>
                          <td className="p-2 text-slate-700">Mengaitkan filosofi lambang dengan berbagai contoh kehidupan nyata.</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50/40">
                          <td className="p-2 border-r border-slate-200 font-semibold">2. Penerapan Perilaku di Rumah</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">Belum mampu menunjukkan contoh nyata tindakan di rumah.</td>
                          <td className="p-2 border-r border-slate-200 text-slate-800 bg-blue-50/30">Menyajikan minimal 1 contoh nyata perilaku sesuai sila di rumah.</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">Menyajikan &gt;2 contoh perilaku dengan dokumentasi rapi.</td>
                          <td className="p-2 text-slate-700">Mengajak anggota keluarga lain menerapkan nilai saling menghargai.</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r border-slate-200 font-semibold">3. Kualitas Presentasi / Produk</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">Penyajian belum terstruktur dan masih ragu-ragu.</td>
                          <td className="p-2 border-r border-slate-200 text-slate-800 bg-blue-50/30">Penyajian jelas, runut, dan suara terdengar dengan baik.</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">Penyajian komunikatif, percaya diri, dan menarik.</td>
                          <td className="p-2 text-slate-700">Penyajian sangat inspiratif, mampu merespons pertanyaan dengan kritis.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pedoman Konversi Nilai */}
                <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-[11px] text-slate-700 space-y-1">
                  <p><strong>Rumus Skor Akhir:</strong> <em>Nilai Akhir = (Total Skor Perolehan / Total Skor Maksimal) × 100</em></p>
                  <p><strong>Ketuntasan:</strong> Peserta didik dinyatakan tuntas tujuan pembelajaran apabila mencapai nilai akhir ≥ 70 (Tingkat Berkembang ke atas).</p>
                </div>
              </div>

              {/* Footer Lembar 4 */}
              <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
                <span>Instrumen As &amp; Of Learning - {data.subject}</span>
                <span>Lembar 4 dari 5 · Dokumen as 0f_004.png</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LEMBAR 5: as 0f_005.png - Rekapitulasi Nilai & Lembar Pengesahan */}
          {/* ============================================================ */}
          {(viewMode === 'all' || activePage === 5) && (
            <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[800px] min-h-[1000px] p-6 sm:p-10 font-serif text-[12px] leading-relaxed text-slate-900 relative">
              <div className="text-center pb-3 border-b-2 border-slate-900 mb-4">
                <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
                  REKAPITULASI PENILAIAN &amp; LEMBAR PENGESAHAN
                </h1>
                <h2 className="text-xs sm:text-sm font-bold uppercase text-slate-800">
                  HASIL ASESMEN AS &amp; OF LEARNING · {schoolName.toUpperCase()}
                </h2>
                <div className="w-full border-t border-slate-400 mt-1.5" />
              </div>

              <div className="space-y-4">
                {/* Format Rekap Kelas Contoh */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-xs uppercase text-slate-900">
                      Format Rekapitulasi Capaian Peserta Didik (Kelas {data.grade}):
                    </p>
                    <span className="text-[11px] text-slate-600 italic">Format Standar Buku Nilai Kurikulum Merdeka</span>
                  </div>

                  <div className="overflow-x-auto border border-slate-300 rounded">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                          <th className="p-2 border-r border-slate-300 text-center w-8" rowSpan={2}>No</th>
                          <th className="p-2 border-r border-slate-300 text-left" rowSpan={2}>Nama Peserta Didik</th>
                          <th className="p-1 border-r border-slate-300 text-center" colSpan={2}>As Learning</th>
                          <th className="p-1 border-r border-slate-300 text-center" colSpan={2}>Of Learning</th>
                          <th className="p-2 border-r border-slate-300 text-center w-16" rowSpan={2}>Nilai Akhir</th>
                          <th className="p-2 text-center w-24" rowSpan={2}>Kesimpulan</th>
                        </tr>
                        <tr className="bg-slate-50 font-bold border-b border-slate-300 text-slate-800">
                          <th className="p-1 border-r border-slate-300 text-center w-12">Diri</th>
                          <th className="p-1 border-r border-slate-300 text-center w-12">Teman</th>
                          <th className="p-1 border-r border-slate-300 text-center w-12">Skor</th>
                          <th className="p-1 border-r border-slate-300 text-center w-12">Karya</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200 text-center">1</td>
                          <td className="p-2 border-r border-slate-200 font-medium">Ahmad Fauzan Pratama</td>
                          <td className="p-2 border-r border-slate-200 text-center">SB</td>
                          <td className="p-2 border-r border-slate-200 text-center">B</td>
                          <td className="p-2 border-r border-slate-200 text-center">88</td>
                          <td className="p-2 border-r border-slate-200 text-center">90</td>
                          <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-900">89</td>
                          <td className="p-2 text-center text-emerald-800 font-semibold">Tuntas (Cakap)</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50/40">
                          <td className="p-2 border-r border-slate-200 text-center">2</td>
                          <td className="p-2 border-r border-slate-200 font-medium">Annisa Nurul Zahra</td>
                          <td className="p-2 border-r border-slate-200 text-center">SB</td>
                          <td className="p-2 border-r border-slate-200 text-center">SB</td>
                          <td className="p-2 border-r border-slate-200 text-center">95</td>
                          <td className="p-2 border-r border-slate-200 text-center">94</td>
                          <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-900">95</td>
                          <td className="p-2 text-center text-emerald-800 font-semibold">Tuntas (Istimewa)</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200 text-center">3</td>
                          <td className="p-2 border-r border-slate-200 font-medium">Bagas Tri Nugroho</td>
                          <td className="p-2 border-r border-slate-200 text-center">B</td>
                          <td className="p-2 border-r border-slate-200 text-center">B</td>
                          <td className="p-2 border-r border-slate-200 text-center">78</td>
                          <td className="p-2 border-r border-slate-200 text-center">80</td>
                          <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-900">79</td>
                          <td className="p-2 text-center text-emerald-800 font-semibold">Tuntas (Berkembang)</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50/40">
                          <td className="p-2 border-r border-slate-200 text-center">4</td>
                          <td className="p-2 border-r border-slate-200 font-medium">Dinda Permatasari</td>
                          <td className="p-2 border-r border-slate-200 text-center">C</td>
                          <td className="p-2 border-r border-slate-200 text-center">B</td>
                          <td className="p-2 border-r border-slate-200 text-center">65</td>
                          <td className="p-2 border-r border-slate-200 text-center">68</td>
                          <td className="p-2 border-r border-slate-200 text-center font-bold text-rose-700">66</td>
                          <td className="p-2 text-center text-rose-700 font-semibold">Remedial</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r border-slate-200 text-center">...</td>
                          <td className="p-2 border-r border-slate-200 text-slate-500 italic">24 Peserta Didik lainnya</td>
                          <td className="p-2 border-r border-slate-200 text-center">-</td>
                          <td className="p-2 border-r border-slate-200 text-center">-</td>
                          <td className="p-2 border-r border-slate-200 text-center">-</td>
                          <td className="p-2 border-r border-slate-200 text-center">-</td>
                          <td className="p-2 border-r border-slate-200 text-center">-</td>
                          <td className="p-2 text-center">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Catatan Tindak Lanjut Guru */}
                <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 text-xs space-y-1">
                  <p className="font-bold text-slate-900">Catatan Evaluasi Guru:</p>
                  <p className="text-slate-700">
                    Bagi murid yang memperoleh predikat Remedial, akan dilakukan bimbingan personal berulang dengan kartu konkret pada indikator yang belum tuntas sebelum memasuki lingkup materi berikutnya.
                  </p>
                </div>

                {/* Lembar Tanda Tangan Resmi */}
                <div className="pt-6">
                  <div className="flex justify-between text-xs">
                    <div>
                      <p>Mengetahui,</p>
                      <p className="font-bold">Kepala {schoolName}</p>
                      <div className="h-16" />
                      <p className="font-bold underline">{principalName}</p>
                      <p className="text-slate-600">NIP. {principalNip}</p>
                    </div>

                    <div className="text-right">
                      <p>{city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="font-bold">Guru Mata Pelajaran,</p>
                      <div className="h-16" />
                      <p className="font-bold underline">{teacherName}</p>
                      <p className="text-slate-600">NIP. {teacherNip}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Lembar 5 */}
              <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
                <span>Instrumen As &amp; Of Learning - {data.subject}</span>
                <span>Lembar 5 dari 5 · Dokumen as 0f_005.png</span>
              </div>
            </div>
          )}

          {/* BOTTOM COMPLETION CARD (Sesuai gaya tambah tombol selesai generate rpp.png) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 max-w-[800px] mx-auto">
            <div className="bg-[#eaf7ee] text-[#165a2e] border border-[#d0ebd9] px-4 py-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="font-bold text-sm text-[#165a2e]">✓</span>
              <span>Instrumen As &amp; Of Learning Tersimpan di Koleksi (versi terbaru).</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onRegenerate}
                className="px-4 py-2.5 bg-[#0c2b4d] hover:bg-[#163c66] text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Generate ulang</span>
              </button>

              <button
                type="button"
                onClick={onOpenCollection}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#194e86] border border-[#cfdbe8] rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Buka Koleksi →</span>
              </button>

              <button
                type="button"
                onClick={onDevelopOtherTp}
                className="px-4 py-2.5 bg-[#be9035] hover:bg-[#ac7f2a] text-[#2c200a] rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span className="text-base leading-none font-black">+</span>
                <span>Kembangkan TP lain</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
