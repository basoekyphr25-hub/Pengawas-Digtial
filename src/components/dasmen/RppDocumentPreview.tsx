import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Bookmark, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  FileText,
  Sparkles,
  RotateCcw,
  Plus
} from 'lucide-react';
import { ModulAjar, GlobalContext, SavedDocument } from '../../types';
import { exportModulAjarToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printModulAjar } from '../../lib/export/pdfExport';
import { DetailedRubricRow, CheckpointItem } from './KembangkanModulView';

interface RppDocumentPreviewProps {
  modul: ModulAjar;
  globalContext: GlobalContext;
  selectedDimensions: string[];
  detailedRubricRows?: DetailedRubricRow[];
  checkpoints?: CheckpointItem[];
  ambangKetuntasan?: number;
  onSaveToCollection?: (doc: SavedDocument) => void;
  onRegenerate?: () => void;
  onOpenCollection?: () => void;
  onDevelopOtherTp?: () => void;
}

export const RppDocumentPreview: React.FC<RppDocumentPreviewProps> = ({
  modul,
  globalContext,
  selectedDimensions,
  detailedRubricRows = [],
  checkpoints = [],
  ambangKetuntasan = 70,
  onSaveToCollection,
  onRegenerate,
  onOpenCollection,
  onDevelopOtherTp
}) => {
  const [activePage, setActivePage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const teacherName = globalContext?.identity?.teacherName || 'Guru Pengampu, S.Pd.';
  const teacherNip = globalContext?.identity?.teacherNip || '19850315 201001 1 012';
  const principalName = globalContext?.identity?.principalName || 'Kepala Sekolah, M.Pd.';
  const principalNip = globalContext?.identity?.principalNip || '19760820 200212 1 005';
  const schoolName = globalContext?.identity?.schoolName || 'SD Negeri Percobaan 1';
  const city = globalContext?.identity?.cityDistrict || 'Kota Bandung';
  const currentYear = '2025/2026';

  const dimensionLabels = [
    { id: 'bernalar-kritis', label: 'Penalaran Kritis' },
    { id: 'mandiri', label: 'Mandiri' },
    { id: 'kreatif', label: 'Kreatif' },
    { id: 'gotong-royong', label: 'Gotong Royong' },
    { id: 'kebinekaan-global', label: 'Kebinekaan Global' },
    { id: 'beriman-bertakwa', label: 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia' }
  ];

  const activeDimTexts = selectedDimensions.length > 0 
    ? selectedDimensions.map(d => dimensionLabels.find(l => l.id === d)?.label || d).join(', ')
    : 'Penalaran Kritis, Mandiri, Gotong Royong';

  const handleCopyText = () => {
    const textContent = `
MODUL AJAR KURIKULUM MERDEKA
${modul.subject.toUpperCase()} - FASE ${modul.phase} (${modul.grade})
${schoolName.toUpperCase()}

I. INFORMASI UMUM
Nama Penyusun: ${teacherName}
Satuan Pendidikan: ${schoolName}
Tahun Ajaran: ${currentYear}
Mata Pelajaran: ${modul.subject}
Fase / Kelas: ${modul.phase} / ${modul.grade}
Alokasi Waktu: ${modul.totalJp} JP (${modul.totalSessions} Pertemuan)
Model Pembelajaran: ${modul.learningModel} Berdiferensiasi

II. TUJUAN PEMBELAJARAN & KKTP
Tujuan Pembelajaran:
${(modul.selectedTpTexts || []).join('\n')}

KKTP (Ambang Batas ${ambangKetuntasan}):
${detailedRubricRows.map(r => `- ${r.kriteria} (Berkembang 70-80: ${r.berkembang})`).join('\n')}

III. KEGIATAN PEMBELAJARAN
Pertemuan 1 (2 JP): Pembukaan, Sintaks PBL, Checkpoint 1, Penutup.
Pertemuan 2 (2 JP): Pembukaan, Presentasi & Solusi, Checkpoint 2 & 3, Penutup.

IV. ASESMEN
- Formatif: Checkpoints, Observasi Kuis, LKPD
- Sumatif: Unjuk Kerja & Produk Portofolio
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadWord = async () => {
    try {
      const blob = await exportModulAjarToDocx(modul, globalContext);
      const filename = `Modul_Ajar_${modul.subject.replace(/\s+/g, '_')}_${modul.grade.replace(/\s+/g, '_')}.docx`;
      downloadBlob(blob, filename);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    printModulAjar(modul, globalContext);
  };

  const handleSave = () => {
    const doc: SavedDocument = {
      id: modul.id,
      title: modul.title,
      category: 'modul_dasmen',
      subjectOrTheme: modul.subject,
      gradeOrAge: modul.grade,
      createdAt: new Date().toISOString(),
      data: modul
    };
    onSaveToCollection?.(doc);
    setSavedNotice('Modul Ajar (RPP) Lengkap berhasil disimpan ke Koleksi Dokumen!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Document Bar */}
      <div className="bg-[#0f2942] text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider rounded-md">
              RPP / Modul Ajar Lengkap
            </span>
            <span className="text-xs text-slate-300">
              Format 6 Halaman Resmi
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif mt-1 text-white tracking-tight">
            {modul.title}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {schoolName} · {modul.subject} · {modul.grade} (Fase {modul.phase}) · {modul.totalSessions} Pertemuan ({modul.totalJp} JP)
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownloadWord}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Word (.docx)</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
          <button
            type="button"
            onClick={handleCopyText}
            className="flex-1 sm:flex-none px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Salin RPP Teks"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-none px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Simpan Dokumen"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Mode & Page Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Toggle */}
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
            Per Lembar Dokumen
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
            <span>Semua Halaman (Continuous)</span>
          </button>
        </div>

        {/* Page Selector Tabs */}
        {viewMode === 'single' && (
          <div className="flex items-center gap-1 overflow-x-auto text-xs py-0.5">
            {[
              { num: 1, label: 'Hal 1 (rpp.png): Info Umum & Profil' },
              { num: 2, label: 'Hal 2 (rpp_001.png): TP & KKTP Rubrik' },
              { num: 3, label: 'Hal 3 (rpp_002.png): Pertemuan 1' },
              { num: 4, label: 'Hal 4 (rpp_003.png): Pertemuan 2' },
              { num: 5, label: 'Hal 5 (rpp_004.png): Asesmen & Nilai' },
              { num: 6, label: 'Hal 6 (rpp_005.png): Lampiran & TTD' }
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
                Halaman {p.num}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DOCUMENT PAPER DISPLAY */}
      <div className="bg-slate-100/70 p-3 sm:p-6 rounded-2xl border border-slate-200 space-y-6">
        {/* PAGE 1: rpp.png - Info Umum, Identitas, Profil Lulusan */}
        {(viewMode === 'all' || activePage === 1) && (
          <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[820px] min-h-[1050px] p-6 sm:p-12 font-serif text-[12.5px] leading-relaxed text-slate-900 relative">
            {/* Header / Kop Resmi */}
            <div className="text-center pb-3 border-b-2 border-slate-900 mb-4">
              <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
                MODUL AJAR KURIKULUM MERDEKA
              </h1>
              <h2 className="text-sm sm:text-base font-bold uppercase text-slate-800">
                {modul.subject.toUpperCase()} · FASE {modul.phase} ({modul.grade.toUpperCase()})
              </h2>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 uppercase">
                {schoolName.toUpperCase()} — TAHUN AJARAN {currentYear}
              </h3>
              <div className="w-full border-t border-slate-400 mt-1.5" />
            </div>

            {/* Bagian I: Informasi Umum */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1">
                I. INFORMASI UMUM
              </h4>

              {/* Tabel Identitas */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="w-1/3 p-2 bg-slate-50 font-bold border-r border-slate-200">Nama Penyusun</td>
                      <td className="p-2">{teacherName}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Satuan Pendidikan</td>
                      <td className="p-2">{schoolName}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Tahun Penyusunan / Ajaran</td>
                      <td className="p-2">{currentYear}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Jenjang / Fase / Kelas</td>
                      <td className="p-2">Sekolah Dasar (SD) / Fase {modul.phase} / {modul.grade}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Mata Pelajaran</td>
                      <td className="p-2 font-semibold">{modul.subject}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Elemen / Materi Pokok</td>
                      <td className="p-2">
                        {modul.crossSubjectIntegration || 'Pancasila dalam Kehidupan Sehari-hari / Hubungan Lambang dan Nilai Karakter'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Alokasi Waktu</td>
                      <td className="p-2">{modul.totalSessions} Pertemuan ({modul.totalJp} JP × 35 Menit)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* B. Kompetensi Awal */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  A. Kompetensi Awal (Prasyarat):
                </p>
                <ul className="list-disc list-inside text-xs text-slate-700 pl-2 space-y-1">
                  <li>Peserta didik telah mengenal lima lambang sila Pancasila pada Garuda Pancasila secara visual.</li>
                  <li>Peserta didik mampu menyebutkan aturan dan kebiasaan baik di lingkungan keluarga masing-masing.</li>
                </ul>
              </div>

              {/* C. Profil Pelajar Pancasila */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  B. Dimensi Profil Pelajar Pancasila yang Dikembangkan:
                </p>
                <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 space-y-1">
                  <p><strong>Dimensi Utama:</strong> {activeDimTexts}</p>
                  <p className="text-[11.5px] text-slate-600">
                    Murid dilatih bernalar kritis dalam menganalisis perilaku sehari-hari, bergotong royong dalam diskusi kelompok pemecahan masalah, serta mandiri dalam menyelesaikan misi refleksi di rumah.
                  </p>
                </div>
              </div>

              {/* D. Sarana dan Prasarana */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  C. Sarana dan Prasarana:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-700 pl-2 space-y-0.5">
                  <li><strong>Media:</strong> Kartu tebak lambang Pancasila, poster Garuda Pancasila, proyektor/gambar visual kontekstual.</li>
                  <li><strong>Sumber Belajar:</strong> Buku Siswa Kurikulum Merdeka, Lembar Kerja Peserta Didik (LKPD), lingkungan rumah dan sekolah.</li>
                  <li><strong>Alat & Bahan:</strong> Spidol warna, gunting, lem kertas, lembar checkpoint misi reflektif.</li>
                </ul>
              </div>

              {/* E. Target Peserta Didik & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 border border-slate-300 rounded bg-slate-50">
                  <p className="font-bold text-slate-900 mb-1">D. Target Peserta Didik:</p>
                  <p className="text-slate-700">
                    Peserta didik reguler/tipikal (28 murid) dengan diferensiasi scaffolding bagi murid yang memerlukan bimbingan konkret dan tantangan berpikir bagi murid berpencapaian tinggi.
                  </p>
                </div>
                <div className="p-2.5 border border-slate-300 rounded bg-slate-50">
                  <p className="font-bold text-slate-900 mb-1">E. Model Pembelajaran:</p>
                  <p className="text-slate-700">
                    <strong>Problem Based Learning (PBL) Berdiferensiasi</strong> secara tatap muka (luring) terintegrasi asesmen formatif berkelanjutan (Checkpoints 1, 2, dan 3).
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Halaman 1 */}
            <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
              <span>Modul Ajar {modul.subject} - {schoolName}</span>
              <span>Dokumen RPP · Halaman 1 dari 6</span>
            </div>
          </div>
        )}

        {/* PAGE 2: rpp_001.png - Komponen Inti, TP, KKTP Rubrik 4 Kategori, Pemantik */}
        {(viewMode === 'all' || activePage === 2) && (
          <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[820px] min-h-[1050px] p-6 sm:p-12 font-serif text-[12.5px] leading-relaxed text-slate-900 relative">
            <h4 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1 mb-4">
              II. KOMPONEN INTI & KRITERIA KETERCAPAIAN (KKTP)
            </h4>

            <div className="space-y-4">
              {/* A. Tujuan Pembelajaran */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  A. Tujuan Pembelajaran (TP):
                </p>
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs text-slate-800">
                  {(modul.selectedTpTexts || []).map((tp, idx) => (
                    <p key={idx} className="font-semibold text-blue-950">
                      {idx + 1}. {tp}
                    </p>
                  ))}
                </div>
              </div>

              {/* B. Rubrik KKTP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-xs uppercase text-slate-800">
                    B. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP Rubrik 4 Tingkat):
                  </p>
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Ambang Batas: {ambangKetuntasan}
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-300 rounded">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#edf4fb] text-slate-900 text-left border-b border-[#c2d7ed]">
                        <th className="p-2 border-r border-[#c2d7ed] font-bold w-1/4">Kriteria</th>
                        <th className="p-2 border-r border-[#c2d7ed] font-bold w-1/5">Baru Memulai (0–69)</th>
                        <th className="p-2 border-r border-[#c2d7ed] font-bold w-1/5 bg-blue-50/80 text-blue-950">
                          Berkembang (70–80) *Ambang
                        </th>
                        <th className="p-2 border-r border-[#c2d7ed] font-bold w-1/5">Cakap (81–90)</th>
                        <th className="p-2 font-bold w-1/5">Sangat Berkembang (91–100)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedRubricRows.length > 0 ? (
                        detailedRubricRows.map((row, idx) => (
                          <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="p-2 border-t border-r border-slate-300 font-bold text-slate-900 align-top">
                              {row.kriteria}
                            </td>
                            <td className="p-2 border-t border-r border-slate-300 text-slate-700 align-top">
                              {row.baruMemulai}
                            </td>
                            <td className="p-2 border-t border-r border-slate-300 text-slate-800 bg-blue-50/40 font-medium align-top">
                              {row.berkembang}
                            </td>
                            <td className="p-2 border-t border-r border-slate-300 text-slate-700 align-top">
                              {row.cakap}
                            </td>
                            <td className="p-2 border-t border-slate-300 text-slate-700 align-top">
                              {row.sangatBerkembang}
                            </td>
                          </tr>
                        ))
                      ) : (
                        (modul.kktp || []).map((k, idx) => (
                          <tr key={idx} className="border-t border-slate-300">
                            <td className="p-2 border-r border-slate-300 font-bold text-slate-800">{k.indicator}</td>
                            <td className="p-2 border-r border-slate-300 text-slate-600">{k.rubric.perluBimbingan}</td>
                            <td className="p-2 border-r border-slate-300 text-slate-800 bg-blue-50/40 font-medium">{k.rubric.cukup}</td>
                            <td className="p-2 border-r border-slate-300 text-slate-600">{k.rubric.baik}</td>
                            <td className="p-2 text-slate-600">{k.rubric.sangatBaik}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Penjelasan Interval Nilai */}
                <div className="p-2.5 mt-2 bg-slate-50 border border-slate-300 rounded text-[11px] text-slate-700 space-y-1">
                  <p><strong>Cara Penilaian:</strong> Setiap kriteria dinilai pada salah satu tingkat (interval nilai di kepala tabel), dengan batas bawah tingkat "Berkembang" = ambang batas ({ambangKetuntasan}). Nilai akhir murid = rata-rata nilai seluruh kriteria.</p>
                  <p><strong>Tindak Lanjut:</strong> Nilai 0–69 belum mencapai TP (diberikan pendampingan/remedial pada kriteria yang belum tuntas); Nilai 70–100 telah mencapai TP (lanjut ke TP berikutnya, capaian tinggi diberikan pengayaan).</p>
                </div>
              </div>

              {/* C. Pemahaman Bermakna & Pertanyaan Pemantik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-300 rounded bg-slate-50">
                  <p className="font-bold text-slate-900 mb-1">C. Pemahaman Bermakna:</p>
                  <p className="text-slate-700">
                    Nilai-nilai Pancasila bukan sekadar hafalan lambang, melainkan pedoman nyata dalam bersikap tertib, menghargai sesama anggota keluarga, dan menumbuhkan rasa tanggung jawab sehari-hari.
                  </p>
                </div>
                <div className="p-3 border border-slate-300 rounded bg-slate-50">
                  <p className="font-bold text-slate-900 mb-1">D. Pertanyaan Pemantik:</p>
                  <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                    <li>"Mengapa burung Garuda memiliki lambang-lambang di perisai dadanya?"</li>
                    <li>"Apa yang terjadi jika di rumah kita tidak ada aturan saling membantu?"</li>
                  </ul>
                </div>
              </div>

              {/* D. Asesmen Awal Kognitif */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  E. Asesmen Awal Kognitif (Diagnostik 3 Tingkat Kesiapan):
                </p>
                <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-[11.5px] space-y-1.5">
                  <p><strong>Level -2 (Perlu Bimbingan Awal):</strong> Menunjukkan kartu lambang bintang, rantai, dan pohon beringin secara acak untuk mengidentifikasi daya ingat visual simbol dasar.</p>
                  <p><strong>Level -1 (Cukup Siap):</strong> Menyebutkan 1 contoh kegiatan saling menyayangi atau membantu ibu/ayah di rumah.</p>
                  <p><strong>Level Saat Ini (Siap Penuh):</strong> Menghubungkan arti simbol lambang sila dengan perbuatan adil atau musyawarah dalam keluarga.</p>
                </div>
              </div>
            </div>

            {/* Footer Halaman 2 */}
            <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
              <span>Modul Ajar {modul.subject} - {schoolName}</span>
              <span>Dokumen RPP · Halaman 2 dari 6</span>
            </div>
          </div>
        )}

        {/* PAGE 3: rpp_002.png - Kegiatan Pembelajaran Pertemuan 1 & Checkpoint 1 */}
        {(viewMode === 'all' || activePage === 3) && (
          <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[820px] min-h-[1050px] p-6 sm:p-12 font-serif text-[12.5px] leading-relaxed text-slate-900 relative">
            <h4 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1 mb-4">
              III. LANGKAH-LANGKAH PEMBELAJARAN (PERTEMUAN 1)
            </h4>

            <div className="space-y-4">
              {/* Info Pertemuan */}
              <div className="p-2.5 bg-slate-100 border border-slate-300 rounded flex justify-between items-center text-xs font-bold">
                <span>PERTEMUAN KE-1: Eksplorasi Lambang & Makna Konseptual</span>
                <span>Alokasi Waktu: 2 JP (70 Menit)</span>
              </div>

              {/* 1. Kegiatan Pendahuluan */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  1. Kegiatan Pendahuluan (15 Menit):
                </p>
                <ul className="list-disc list-inside text-xs text-slate-700 pl-2 space-y-1">
                  <li><strong>Orientasi:</strong> Guru membuka pembelajaran dengan salam hangat, berdoa bersama murid dipimpin salah satu peserta didik, dan memeriksa kehadiran secara ramah.</li>
                  <li><strong>Apersepsi:</strong> Guru menampilkan gambar perisai Garuda Pancasila dan menanyakan benda apa saja yang ada di dalam perisai tersebut.</li>
                  <li><strong>Motivasi:</strong> Murid diajak menyanyikan lagu "Garuda Pancasila" dengan gerakan tepuk berirama untuk membangkitkan semangat.</li>
                  <li><strong>Pemberian Acuan:</strong> Guru menyampaikan tujuan pembelajaran hari ini dan menjelaskan alur aktivitas seru mencocokkan kartu lambang bersama kelompok.</li>
                </ul>
              </div>

              {/* 2. Kegiatan Inti - Sintaks PBL */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  2. Kegiatan Inti (45 Menit) — Model Problem Based Learning (PBL):
                </p>
                
                <div className="space-y-2 text-xs text-slate-700 pl-2">
                  <div className="border-l-2 border-blue-600 pl-2.5 py-0.5">
                    <p className="font-bold text-slate-900">Fase 1: Orientasi Peserta Didik pada Masalah</p>
                    <p>Guru membacakan cerita bergambar singkat tentang anak yang lupa lambang dan makna saling menolong di rumah saat kakaknya sakit. Murid mendiskusikan apa lambang sila yang sesuai dengan sikap peduli tersebut.</p>
                  </div>

                  <div className="border-l-2 border-blue-600 pl-2.5 py-0.5">
                    <p className="font-bold text-slate-900">Fase 2: Mengorganisasikan Peserta Didik untuk Belajar (Diferensiasi)</p>
                    <p>Murid dibagi menjadi kelompok kecil beranggotakan 4 orang secara heterogen. 
                      <em> Diferensiasi Proses:</em> Murid yang masih memerlukan bantuan konkret diberikan kartu bergambar warna-warni berukuran besar, sedangkan murid yang sudah lancar membaca diberikan kartu teks deskriptif.</p>
                  </div>

                  <div className="border-l-2 border-blue-600 pl-2.5 py-0.5">
                    <p className="font-bold text-slate-900">Fase 3: Membimbing Penyelidikan Mandiri dan Kelompok</p>
                    <p>Setiap kelompok mengeksplorasi kartu lambang dan mencocokkan sila ke-1 sampai ke-5 dengan perilaku sederhana di sekolah dan rumah. Guru berkeliling memberikan scaffolding.</p>
                  </div>
                </div>
              </div>

              {/* BOX CHECKPOINT 1 (Sesuai check point.png) */}
              <div className="border-2 border-blue-200 bg-blue-50/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0f2942] uppercase tracking-wider">
                      CHECKPOINT 1
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      Memahami (Kuis Formatif)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Assessment for Learning
                  </span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed">
                  <strong>Kuis Tebak Lambang & Makna</strong> — Murid secara interaktif mencocokkan kartu lambang Pancasila dengan pernyataan makna sila yang tepat untuk menguji pemahaman konseptual awal mereka sebelum diterapkan di rumah.
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 text-slate-600">
                  <span className="font-bold text-slate-800">Bahan Ajar & LKPD:</span>
                  <span className="bg-white border border-slate-300 px-2 py-0.5 rounded font-medium text-slate-800">
                    📖 Sumber Belajar 1 (Kartu Lambang & Cerita Bergambar)
                  </span>
                  <span className="bg-white border border-slate-300 px-2 py-0.5 rounded font-medium text-slate-800">
                    📝 LKPD 1 (Pasangkan Lambang dan Bunyi Sila)
                  </span>
                </div>
              </div>

              {/* 3. Kegiatan Penutup */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  3. Kegiatan Penutup (10 Menit):
                </p>
                <ul className="list-disc list-inside text-xs text-slate-700 pl-2 space-y-1">
                  <li>Guru bersama murid menyimpulkan 5 lambang sila Pancasila yang telah dipelajari.</li>
                  <li>Murid mengungkapkan perasaan belajar hari ini (senang, seru, atau ada hal yang masih ingin ditanyakan).</li>
                  <li>Guru memberikan penjelasan pengantar misi detektif di rumah untuk Pertemuan 2.</li>
                  <li>Doa penutup dan salam perpisahan.</li>
                </ul>
              </div>
            </div>

            {/* Footer Halaman 3 */}
            <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
              <span>Modul Ajar {modul.subject} - {schoolName}</span>
              <span>Dokumen RPP · Halaman 3 dari 6</span>
            </div>
          </div>
        )}

        {/* PAGE 4: rpp_003.png - Kegiatan Pembelajaran Pertemuan 2 & Checkpoint 2 & 3 */}
        {(viewMode === 'all' || activePage === 4) && (
          <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[820px] min-h-[1050px] p-6 sm:p-12 font-serif text-[12.5px] leading-relaxed text-slate-900 relative">
            <h4 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1 mb-4">
              III. LANGKAH-LANGKAH PEMBELAJARAN (PERTEMUAN 2)
            </h4>

            <div className="space-y-4">
              {/* Info Pertemuan */}
              <div className="p-2.5 bg-slate-100 border border-slate-300 rounded flex justify-between items-center text-xs font-bold">
                <span>PERTEMUAN KE-2: Aksi Nyata di Rumah & Refleksi Karakter</span>
                <span>Alokasi Waktu: 2 JP (70 Menit)</span>
              </div>

              {/* 1. Kegiatan Pendahuluan */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  1. Kegiatan Pendahuluan (15 Menit):
                </p>
                <ul className="list-disc list-inside text-xs text-slate-700 pl-2 space-y-1">
                  <li><strong>Sapaan & Doa:</strong> Guru membuka kelas, menanyakan kabar, dan memimpin doa pembuka.</li>
                  <li><strong>Review Misi:</strong> Guru menanyakan antusiasme murid tentang catatan misi detektif yang dilakukan bersama orang tua di rumah.</li>
                  <li><strong>Fokus Belajar:</strong> Menyampaikan bahwa hari ini setiap murid akan menceritakan temuan perilaku baiknya dan menuliskan tiket solusi disiplin.</li>
                </ul>
              </div>

              {/* 2. Kegiatan Inti - Sintaks PBL Lanjutan */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  2. Kegiatan Inti (45 Menit) — Lanjutan Sintaks PBL:
                </p>
                
                <div className="space-y-2 text-xs text-slate-700 pl-2">
                  <div className="border-l-2 border-emerald-600 pl-2.5 py-0.5">
                    <p className="font-bold text-slate-900">Fase 4: Mengembangkan dan Menyajikan Hasil Karya (Diferensiasi Produk)</p>
                    <p>Murid menunjukkan catatan atau gambar misi detektif perilaku Pancasila di rumah. Murid dapat menyajikan dalam bentuk gambar bercerita, foto tempel bersama keluarga, atau cerita lisan sederhana.</p>
                  </div>

                  <div className="border-l-2 border-emerald-600 pl-2.5 py-0.5">
                    <p className="font-bold text-slate-900">Fase 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah</p>
                    <p>Guru memandu sesi diskusi kelas: "Bagaimana nilai musyawarah sila ke-4 membantu keluarga kita menyelesaikan jadwal tugas menyiram tanaman?". Teman sekelas memberikan tepuk apresiasi atas kejujuran dan usaha setiap murid.</p>
                  </div>
                </div>
              </div>

              {/* BOX CHECKPOINT 2 & 3 (Sesuai check point.png) */}
              <div className="space-y-3">
                {/* Checkpoint 2 */}
                <div className="border-2 border-emerald-200 bg-emerald-50/40 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f2942] uppercase tracking-wider">
                        CHECKPOINT 2
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        Mengaplikasikan (Penugasan Terbimbing)
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Unjuk Nyata Murid
                    </span>
                  </div>
                  <p className="text-xs text-slate-800">
                    <strong>Misi Detektif Pancasila di Rumah</strong> — Murid bersama orang tua mengidentifikasi dan menuliskan satu contoh perilaku sehari-hari di rumah yang sesuai dengan salah satu sila Pancasila beserta foto atau gambar pendukung.
                  </p>
                </div>

                {/* Checkpoint 3 */}
                <div className="border-2 border-purple-200 bg-purple-50/40 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f2942] uppercase tracking-wider">
                        CHECKPOINT 3
                      </span>
                      <span className="text-xs font-bold text-purple-800">
                        Merefleksikan (Exit Ticket / CATs)
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      Assessment as Learning
                    </span>
                  </div>
                  <p className="text-xs text-slate-800">
                    <strong>Tiket Keluar: Solusi Disiplin Pancasila</strong> — Murid menuliskan refleksi singkat di akhir kelas mengenai bagaimana nilai Pancasila di rumah dapat membantu mereka mengatasi masalah terlambat sekolah dan menjadi pribadi yang lebih berkarakter.
                  </p>
                </div>
              </div>

              {/* 3. Kegiatan Penutup */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  3. Kegiatan Penutup (10 Menit):
                </p>
                <ul className="list-disc list-inside text-xs text-slate-700 pl-2 space-y-1">
                  <li>Guru dan murid membuat komitmen kelas: "Satu Hari Satu Perilaku Pancasila".</li>
                  <li>Pemberian penghargaan bintang karakter bagi seluruh peserta didik atas partisipasi aktif.</li>
                  <li>Doa penutup dipimpin oleh murid yang datang paling awal dan salam penutup.</li>
                </ul>
              </div>
            </div>

            {/* Footer Halaman 4 */}
            <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
              <span>Modul Ajar {modul.subject} - {schoolName}</span>
              <span>Dokumen RPP · Halaman 4 dari 6</span>
            </div>
          </div>
        )}

        {/* PAGE 5: rpp_004.png - Instrumen Asesmen, Rubrik, Program Remedial & Pengayaan */}
        {(viewMode === 'all' || activePage === 5) && (
          <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[820px] min-h-[1050px] p-6 sm:p-12 font-serif text-[12.5px] leading-relaxed text-slate-900 relative">
            <h4 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1 mb-4">
              IV. RENCANA ASESMEN, REMEDIAL, DAN PENGAYAAN
            </h4>

            <div className="space-y-4">
              {/* 1. Tabel Rencana Asesmen 3 Dimensi */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1.5">
                  A. Matriks Asesmen Pembelajaran (For, As, and Of Learning):
                </p>
                <div className="overflow-x-auto border border-slate-300 rounded">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                        <th className="p-2 border-r border-slate-300 text-left">Jenis Asesmen</th>
                        <th className="p-2 border-r border-slate-300 text-left">Fungsi Asesmen</th>
                        <th className="p-2 border-r border-slate-300 text-left">Teknik & Bentuk</th>
                        <th className="p-2 text-left">Waktu Pelaksanaan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 font-semibold">1. Asesmen Diagnostik</td>
                        <td className="p-2 border-r border-slate-200">Asesmen Awal Kesiapan</td>
                        <td className="p-2 border-r border-slate-200">Tanya jawab lisan & kuis visual</td>
                        <td className="p-2">Awal Pertemuan 1</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <td className="p-2 border-r border-slate-200 font-semibold">2. Asesmen Formatif</td>
                        <td className="p-2 border-r border-slate-200">Assessment for Learning</td>
                        <td className="p-2 border-r border-slate-200">Checkpoint 1 (Kuis) & Checkpoint 2 (Misi)</td>
                        <td className="p-2">Saat Kegiatan Inti</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 font-semibold">3. Asesmen Diri / Refleksi</td>
                        <td className="p-2 border-r border-slate-200">Assessment as Learning</td>
                        <td className="p-2 border-r border-slate-200">Checkpoint 3 (Exit Ticket) & Jurnal Reflektif</td>
                        <td className="p-2">Akhir Pertemuan 2</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-200 font-semibold">4. Asesmen Sumatif</td>
                        <td className="p-2 border-r border-slate-200">Assessment of Learning</td>
                        <td className="p-2 border-r border-slate-200">Unjuk Kerja Portofolio Karakter</td>
                        <td className="p-2">Akhir Lingkup Materi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Instrumen Observasi Sikap Profil Lulusan */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1.5">
                  B. Lembar Observasi Sikap Profil Pelajar:
                </p>
                <div className="overflow-x-auto border border-slate-300 rounded">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300">
                        <th className="p-2 border-r border-slate-300 text-left">No</th>
                        <th className="p-2 border-r border-slate-300 text-left">Dimensi Profil</th>
                        <th className="p-2 border-r border-slate-300 text-left">Indikator Teramati</th>
                        <th className="p-2 text-center w-24">Skala (1–4)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center">1</td>
                        <td className="p-2 border-r border-slate-200 font-semibold">Penalaran Kritis</td>
                        <td className="p-2 border-r border-slate-200">Mampu menjelaskan alasan mengapa suatu perbuatan sesuai dengan sila Pancasila.</td>
                        <td className="p-2 text-center">SB / B / C / PB</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center">2</td>
                        <td className="p-2 border-r border-slate-200 font-semibold">Gotong Royong</td>
                        <td className="p-2 border-r border-slate-200">Bekerja sama dan berbagi peran dengan anggota kelompok tanpa membeda-bedakan teman.</td>
                        <td className="p-2 text-center">SB / B / C / PB</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-200 text-center">3</td>
                        <td className="p-2 border-r border-slate-200 font-semibold">Mandiri</td>
                        <td className="p-2 border-r border-slate-200">Menyelesaikan misi detektif dan lembar refleksi dengan rasa tanggung jawab sendiri.</td>
                        <td className="p-2 text-center">SB / B / C / PB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Program Remedial dan Pengayaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-amber-300 bg-amber-50/40 rounded space-y-1">
                  <p className="font-bold text-amber-900">Program Remedial (Murid Nilai &lt; 70):</p>
                  <p className="text-slate-700">
                    Diberikan bimbingan langsung secara individual atau kelompok kecil melalui simulasi kartu lambang Pancasila dengan pendampingan guru atau tutor sebaya yang telah cakap.
                  </p>
                </div>

                <div className="p-3 border border-blue-300 bg-blue-50/40 rounded space-y-1">
                  <p className="font-bold text-blue-900">Program Pengayaan (Murid Nilai &gt; 80):</p>
                  <p className="text-slate-700">
                    Diberikan tantangan membuat kartu cerita bergambar baru mengenai penerapan sila Pancasila saat bermain di taman lingkungan atau membantu teman yang sedang tertimpa musibah.
                  </p>
                </div>
              </div>

              {/* 4. Refleksi Guru */}
              <div className="p-3 border border-slate-300 bg-slate-50 rounded text-xs space-y-1">
                <p className="font-bold text-slate-900">Panduan Refleksi Guru:</p>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  <li>Apakah seluruh sintaks Problem Based Learning berjalan sesuai alokasi waktu yang direncanakan?</li>
                  <li>Bagian aktivitas manakah yang paling diminati oleh peserta didik dan mendorong keterlibatan aktif?</li>
                  <li>Langkah apa yang perlu diperbaiki untuk pertemuan berikutnya agar diferensiasi belajar semakin optimal?</li>
                </ul>
              </div>
            </div>

            {/* Footer Halaman 5 */}
            <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
              <span>Modul Ajar {modul.subject} - {schoolName}</span>
              <span>Dokumen RPP · Halaman 5 dari 6</span>
            </div>
          </div>
        )}

        {/* PAGE 6: rpp_005.png - Lampiran LKPD, Bahan Bacaan, Glosarium, & Lembar Pengesahan */}
        {(viewMode === 'all' || activePage === 6) && (
          <div className="bg-white shadow-md border border-slate-300 rounded-lg mx-auto max-w-[820px] min-h-[1050px] p-6 sm:p-12 font-serif text-[12.5px] leading-relaxed text-slate-900 relative">
            <h4 className="font-bold text-sm tracking-wide uppercase text-slate-900 border-b border-slate-300 pb-1 mb-4">
              V. LAMPIRAN-LAMPIRAN & PENGESAHAN DOKUMEN
            </h4>

            <div className="space-y-4">
              {/* Lampiran 1: Bahan Ajar Singkat */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  Lampiran 1: Ringkasan Bahan Bacaan Guru & Peserta Didik
                </p>
                <div className="p-2.5 border border-slate-300 rounded bg-slate-50 text-[11.5px] text-slate-700 space-y-1">
                  <p><strong>Pancasila Dasar Negara:</strong> Lambang negara kita adalah Garuda Pancasila. Di bagian dada terdapat perisai dengan 5 lambang: Bintang (Sila 1), Rantai Emas (Sila 2), Pohon Beringin (Sila 3), Kepala Banteng (Sila 4), serta Padi dan Kapas (Sila 5).</p>
                  <p><strong>Nilai Utama di Rumah:</strong> Berdoa bersama sebelum makan (Sila 1), saling menyayangi adik dan kakak (Sila 2), menjaga kerukunan keluarga (Sila 3), bermusyawarah menentukan tujuan liburan (Sila 4), dan adil dalam pembagian tugas merapikan mainan (Sila 5).</p>
                </div>
              </div>

              {/* Lampiran 2: Format LKPD */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-800 mb-1">
                  Lampiran 2: Lembar Kerja Peserta Didik (LKPD Misi Detektif)
                </p>
                <div className="p-3 border-2 border-dashed border-slate-300 rounded bg-white text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-200 pb-1 text-[11px]">
                    <span>Nama Murid: ...................................................</span>
                    <span>Kelas: {modul.grade}</span>
                  </div>
                  <p className="font-bold text-slate-800">Tugas: Catatlah 1 perbuatan baik yang kamu lakukan di rumah bersama keluarga!</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="border border-slate-200 p-2 rounded h-20">
                      <span className="font-semibold text-slate-500">Perilaku Baik yang Dilakukan:</span>
                    </div>
                    <div className="border border-slate-200 p-2 rounded h-20">
                      <span className="font-semibold text-slate-500">Sila Pancasila yang Sesuai (dan Lambangnya):</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glosarium & Daftar Pustaka */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 border border-slate-300 rounded bg-slate-50">
                  <p className="font-bold text-slate-900 mb-1">Glosarium:</p>
                  <ul className="text-[11px] text-slate-700 space-y-0.5">
                    <li><strong>Perisai:</strong> Pelindung dada pada burung Garuda yang memuat simbol-simbol lima sila Pancasila.</li>
                    <li><strong>Musyawarah:</strong> Pembahasan bersama dengan maksud mencapai keputusan atas penyelesaian masalah.</li>
                  </ul>
                </div>
                <div className="p-2.5 border border-slate-300 rounded bg-slate-50">
                  <p className="font-bold text-slate-900 mb-1">Daftar Pustaka:</p>
                  <p className="text-[11px] text-slate-700">
                    Kemendikbudristek. (2022). <em>Buku Panduan Guru & Siswa Pendidikan Pancasila Kelas I SD</em>. Pusat Kurikulum dan Perbukuan. Badan Standar, Kurikulum, dan Asesmen Pendidikan.
                  </p>
                </div>
              </div>

              {/* Lembar Pengesahan & Tanda Tangan */}
              <div className="pt-6">
                <div className="text-right text-xs mb-3 text-slate-800">
                  {city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <div className="grid grid-cols-2 text-center text-xs text-slate-900">
                  <div className="space-y-16">
                    <div>
                      <p>Mengetahui,</p>
                      <p className="font-bold">Kepala {schoolName}</p>
                    </div>
                    <div>
                      <p className="font-bold underline">{principalName}</p>
                      <p className="text-[11px] text-slate-600">NIP. {principalNip}</p>
                    </div>
                  </div>

                  <div className="space-y-16">
                    <div>
                      <p>Guru Mata Pelajaran / Kelas,</p>
                    </div>
                    <div>
                      <p className="font-bold underline">{teacherName}</p>
                      <p className="text-[11px] text-slate-600">NIP. {teacherNip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Halaman 6 */}
            <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 italic">
              <span>Modul Ajar {modul.subject} - {schoolName}</span>
              <span>Dokumen RPP · Halaman 6 dari 6 (Selesai)</span>
            </div>
          </div>
        )}
      </div>

      {/* COMPLETION ACTIONS AT THE END OF DOCUMENT (Sesuai tambah tombol selesai generate rpp.png) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 animate-fadeIn">
        {/* Banner: Tersimpan di Koleksi (versi terbaru) */}
        <div className="bg-[#eaf7ee] text-[#165a2e] border border-[#d0ebd9] px-4 py-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
          <span className="font-bold text-sm text-[#165a2e]">✓</span>
          <span>Tersimpan di Koleksi (versi terbaru).</span>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* 1. Generate Ulang */}
          <button
            type="button"
            onClick={onRegenerate}
            className="px-4 py-2.5 bg-[#0c2b4d] hover:bg-[#163c66] text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generate ulang</span>
          </button>

          {/* 2. Buka Koleksi */}
          <button
            type="button"
            onClick={onOpenCollection}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#194e86] border border-[#cfdbe8] rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span>Buka Koleksi →</span>
          </button>

          {/* 3. Kembangkan TP Lain */}
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
  );
};
