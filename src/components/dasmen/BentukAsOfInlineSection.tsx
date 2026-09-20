import React, { useState } from 'react';
import { 
  ChevronDown, 
  BookOpen, 
  FileText, 
  Check, 
  Copy, 
  Bookmark, 
  Printer, 
  Sparkles,
  Edit3,
  X,
  Smile,
  Meh,
  Frown,
  Scissors
} from 'lucide-react';
import { GlobalContext, SavedDocument } from '../../types';

interface BentukAsOfInlineSectionProps {
  globalContext: GlobalContext;
  subject: string;
  grade: string;
  phase: string;
  tpText: string;
  onSaveToCollection?: (doc: SavedDocument) => void;
}

export const BentukAsOfInlineSection: React.FC<BentukAsOfInlineSectionProps> = ({
  globalContext,
  subject,
  grade,
  phase,
  tpText,
  onSaveToCollection
}) => {
  const [showAllForms, setShowAllForms] = useState<boolean>(true);
  const [selectedAs, setSelectedAs] = useState<string>('Portofolio');
  const [selectedOf, setSelectedOf] = useState<string>('Projek');

  // State for created/active display of instruments
  const [asReady, setAsReady] = useState<boolean>(true);
  const [ofReady, setOfReady] = useState<boolean>(true);

  // States for sub-resources (Sumber Belajar & LKPD) - Active by default as requested from sumberdanlkpd.pdf
  const [asSumberStatus, setAsSumberStatus] = useState<'idle' | 'created' | 'skipped'>('created');
  const [asLkpdStatus, setAsLkpdStatus] = useState<'idle' | 'created' | 'skipped'>('created');
  const [ofSumberStatus, setOfSumberStatus] = useState<'idle' | 'created' | 'skipped'>('created');
  const [ofLkpdStatus, setOfLkpdStatus] = useState<'idle' | 'created' | 'skipped'>('created');

  // Modal dialog state (for "Buat Desain LKPD" & "Prompt utk AI lain")
  const [modalData, setModalData] = useState<{
    type: 'design' | 'prompt';
    title: string;
    description: string;
    promptText?: string;
  } | null>(null);

  // Notification / feedback
  const [copiedAs, setCopiedAs] = useState<boolean>(false);
  const [copiedOf, setCopiedOf] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const schoolName = globalContext?.identity?.schoolName || 'SD IT';
  const city = globalContext?.identity?.cityDistrict || 'Kampar';
  const displaySubject = subject || 'Pendidikan Pancasila';
  const displayGrade = grade || 'Kelas 3';

  const handleBuatAs = () => {
    setAsReady(true);
    setSavedNotice(`Bentuk As Learning (${selectedAs}) diperbarui!`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleBuatOf = () => {
    setOfReady(true);
    setSavedNotice(`Bentuk Of Learning (${selectedOf}) diperbarui!`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleSaveDoc = (title: string, category: string, extraData: any) => {
    const doc: SavedDocument = {
      id: `doc-${Date.now()}`,
      title,
      category: 'modul_dasmen',
      subjectOrTheme: displaySubject,
      gradeOrAge: displayGrade,
      createdAt: new Date().toISOString(),
      data: {
        ...extraData,
        schoolName,
        city,
        tpText
      }
    };
    onSaveToCollection?.(doc);
    setSavedNotice(`"${title}" berhasil disimpan ke Koleksi Dokumen!`);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleCopyPrompt = (type: 'as' | 'of') => {
    let promptContent = '';
    if (type === 'of') {
      promptContent = `Buatkan Lembar Kerja Peserta Didik (LKPD) untuk jenjang SD Kelas 3 mata pelajaran Pendidikan Pancasila.
Topik: Projek Pandu Bermain Adil - Festival Permainan Tradisional di Kampar.
Tujuan Pembelajaran: Menerapkan nilai-nilai sila Pancasila secara konsisten dalam aktivitas bermain bersama teman.
Format LKPD mencakup:
1. Kop LKPD, identitas murid (Nama, Kelas, No. Absen, Tanggal).
2. Pilihan diferensiasi pelaporan:
   - Pilihan A: Menulis rencana aturan bermain dan pembagian giliran.
   - Pilihan B: Menggambar peta lapangan bermain (Pecah Piring / Lari Tempurung).
3. Kotak pengingat nilai sila Pancasila (Sila ke-2, Sila ke-3, Sila ke-4, Sila ke-5).
4. Pertanyaan diskusi musyawarah kelompok dengan garis bergaris untuk menulis.
5. Aktivitas menjodohkan sikap bermain dengan sila Pancasila yang sesuai.
6. Kotak gambar ekspresi wajah kelompok saat bermain kompak.
7. Refleksi metakognisi murid (2 pertanyaan terbuka).
8. Kolom Catatan Ayah/Bunda.
9. Petunjuk guru mengenai bahan gambar yang disiapkan.`;
    } else {
      promptContent = `Buatkan LKPD Portofolio Mandiri (As Learning) jenjang SD Kelas 3 mata pelajaran Pendidikan Pancasila.
Topik: Jurnal Refleksi Sahabat Pancasila - Refleksi Sikap Bermain Adil dan Kolaboratif.
Tujuan Pembelajaran: Menerapkan nilai-nilai sila Pancasila secara konsisten dalam aktivitas bermain bersama teman.
Format LKPD mencakup:
1. Kop LKPD, identitas murid (Nama, Kelas, No. Absen, Tanggal).
2. Pilihan jalur pengisian portofolio (Menulis Jurnal vs Menggambar Momen Kolaborasi).
3. Tabel ceklis refleksi diri 4 butir (Sudah / Belum) terkait ketepatan waktu, antre, gotong royong, dan sportivitas.
4. Ruang karya portofolio mingguan.
5. Pertanyaan metakognitif refleksi diri.
6. Skala ekspresi emotikon perasaan bermain.
7. Kolom catatan konferensi portofolio guru dan Catatan Ayah/Bunda.`;
    }

    navigator.clipboard.writeText(promptContent);
    setModalData({
      type: 'prompt',
      title: type === 'of' ? 'Prompt AI: LKPD Projek Pandu Bermain Adil' : 'Prompt AI: LKPD Jurnal Refleksi Sahabat Pancasila',
      description: 'Prompt terstruktur telah disalin ke clipboard! Anda dapat langsung menempelkannya ke ChatGPT, Claude, Gemini, atau aplikasi perancang seperti Canva.',
      promptText: promptContent
    });
  };

  const handleOpenDesign = (title: string, subtitle: string) => {
    setModalData({
      type: 'design',
      title: `Desain Tata Letak Cetak: ${title}`,
      description: `Format dokumen telah disiapkan dengan standar A4 ramah cetak (Print-Friendly), margin simetris 2 cm, batas garis isian, serta elemen ilustrasi lokal kontekstual ${schoolName} di ${city}.`
    });
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200">
      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Filter / Tampilkan Semua Bentuk Header (Sesuai sumberdanlkpd.pdf Hal 1) */}
      <div className="text-center space-y-1.5">
        <p className="text-xs sm:text-sm text-slate-800 font-normal">
          Bentuk <strong>as</strong> &amp; <strong>of</strong> di bawah sudah disaring sesuai prinsipnya.
        </p>
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <input
            id="tampilkan-semua-bentuk-checkbox"
            type="checkbox"
            checked={showAllForms}
            onChange={(e) => setShowAllForms(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
          <label htmlFor="tampilkan-semua-bentuk-checkbox" className="text-xs text-slate-700 font-medium cursor-pointer">
            tampilkan semua bentuk
          </label>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: AS LEARNING (sesuai sumberdanlkpd.pdf Hal 1 & 2) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* Dropdown & Buat Button Row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <select
              value={selectedAs}
              onChange={(e) => setSelectedAs(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 pr-9 cursor-pointer shadow-2xs font-medium"
            >
              <option value="Portofolio">Portofolio</option>
              <option value="Jurnal Reflektif">Jurnal Reflektif</option>
              <option value="Penilaian Diri (Self-Assessment)">Penilaian Diri (Self-Assessment)</option>
              <option value="Penilaian Antarteman (Peer-Assessment)">Penilaian Antarteman (Peer-Assessment)</option>
              <option value="Tiket Keluar (Exit Ticket)">Tiket Keluar (Exit Ticket)</option>
              <option value="Lembar Refleksi Metakognisi">Lembar Refleksi Metakognisi</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3 top-3 pointer-events-none" />
          </div>

          <span className="text-xs font-bold tracking-wider text-slate-700 uppercase whitespace-nowrap px-1">
            AS LEARNING
          </span>

          <button
            type="button"
            onClick={handleBuatAs}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            Buat
          </button>
        </div>

        {/* Status Notice Sesuai sumberdanlkpd.pdf Hal 1 */}
        {asReady && (
          <div className="flex items-center justify-between text-xs text-emerald-800 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-700">✎</span>
              <strong>as learning</strong> siap — bisa diedit. Akan jadi Lampiran Asesmen di modul.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCopiedAs(true);
                  setTimeout(() => setCopiedAs(false), 2000);
                }}
                className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedAs ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAs ? 'Tersalin' : 'Salin'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveDoc(`As Learning: Jurnal Refleksi Sahabat Pancasila (${selectedAs})`, 'as_learning', { form: selectedAs })}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Bookmark className="w-3 h-3" />
                <span>Simpan Dokumen</span>
              </button>
            </div>
          </div>
        )}

        {/* AS LEARNING CARD (PERSIS sumberdanlkpd.pdf Hal 1 & 2) */}
        {asReady && (
          <div className="border border-slate-200 rounded-2xl p-5 sm:p-7 bg-white text-slate-800 shadow-2xs space-y-5 text-left leading-relaxed">
            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Jurnal Refleksi Sahabat Pancasila — (as learning · {selectedAs})
            </h3>

            {/* 1. Tujuan Asesmen */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">
                1. Tujuan Asesmen
              </h4>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                Asesmen ini bertujuan untuk memfasilitasi murid kelas 3 {schoolName} di {city} agar dapat memonitor, menilai, dan merefleksikan konsistensi mereka dalam menerapkan nilai-nilai Pancasila (terutama gotong royong dan keadilan sosial) saat bermain bersama teman. Fokus utama adalah membangun kesadaran diri (metakognisi) murid dalam berkolaborasi, mengatasi perilaku terlambat dalam kesepakatan bermain, serta menghargai perbedaan pemahaman antar-teman di lingkungan sekolah yang dekat dengan komunitas perkebunan sawit.
              </p>
            </div>

            {/* 2. Langkah Asesmen */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">
                2. Langkah Asesmen
              </h4>
              <ul className="text-xs sm:text-[13px] text-slate-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>Sosialisasi Wadah Portofolio:</strong> Guru mengajak murid menyiapkan satu map/buku khusus bernama &quot;Jurnal Sahabat Pancasila&quot; sebagai portofolio refleksi diri.
                </li>
                <li>
                  <strong>Pengumpulan Bukti Refleksi:</strong> Setiap selesai aktivitas bermain bersama (baik saat istirahat maupun olahraga), murid diminta memasukkan satu bukti refleksi berkala (bisa berupa gambar aktivitas bermain yang diwarnai, rekaman suara cerita bermain, atau tulisan sederhana) ke dalam portofolio mereka.
                </li>
                <li>
                  <strong>Sesi Refleksi Mandiri (As Learning):</strong> Guru memberikan waktu 10 menit di akhir pekan bagi murid untuk memeriksa kembali isi portofolio mereka, memikirkan tindakan kolaborasi yang sudah baik, dan apa yang perlu diperbaiki pada minggu berikutnya.
                </li>
                <li>
                  <strong>Konferensi Portofolio:</strong> Guru duduk bersama murid secara individual atau kelompok kecil untuk mendengarkan murid menceritakan perkembangan sikap kolaborasi mereka berdasarkan isi portofolio yang mereka kumpulkan sendiri.
                </li>
              </ul>
            </div>

            {/* 3. Kriteria Asesmen */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                3. Kriteria Asesmen
              </h4>
              <p className="text-xs sm:text-[13px] text-slate-700">
                Guru menggunakan rubrik analitik di bawah ini untuk menilai kemampuan refleksi mandiri murid terhadap portofolio yang mereka susun:
              </p>

              {/* Rubric Table Sesuai sumberdanlkpd.pdf Hal 1 & 2 */}
              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-300 text-slate-900 font-bold">
                      <th className="p-3 w-1/5 border-r border-slate-200">Kriteria</th>
                      <th className="p-3 w-1/5 border-r border-slate-200">Mulai Berkembang (MB)</th>
                      <th className="p-3 w-1/5 border-r border-slate-200">Layak (L)</th>
                      <th className="p-3 w-1/5 border-r border-slate-200">Cakap (C)</th>
                      <th className="p-3 w-1/5">Mahir (M)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs text-slate-700">
                    <tr className="align-top">
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                        Kemampuan Memonitor Diri (Kolaborasi)
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Belum mampu mengidentifikasi perilakunya sendiri saat bermain bersama teman.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mampu menyebutkan perilaku bermainnya, namun belum bisa mengaitkannya dengan nilai Pancasila (berbagi/antre).
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mampu mengidentifikasi penerapan nilai Pancasila (misal: menghargai teman yang lambat memahami aturan main).
                      </td>
                      <td className="p-3">
                        Secara konsisten menunjukkan dan menjelaskan bagaimana ia menjaga harmoni dan kolaborasi saat bermain.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                        Kualitas Refleksi Portofolio
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Portofolio hanya berisi kumpulan gambar/tulisan tanpa ada penjelasan makna atau perasaan.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mampu menceritakan apa yang terjadi dalam foto/gambar/tulisan di portofolionya secara sederhana.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mampu menjelaskan hal baik yang telah dilakukan dan hambatan yang dihadapi saat bermain (misal: mengatasi teman yang telat ikut bermain).
                      </td>
                      <td className="p-3">
                        Mampu merumuskan rencana perbaikan diri yang konkret untuk aktivitas bermain berikutnya berdasarkan bukti portofolio.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Penerapan 3 Prinsip Asesmen (Sesuai sumberdanlkpd.pdf Hal 2) */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-sm font-bold text-slate-900">
                4. Penerapan 3 Prinsip Asesmen
              </h4>
              <ul className="text-xs sm:text-[13px] text-slate-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>Berkeadilan:</strong> Asesmen ini tidak menghukum murid yang memiliki keterbatasan kemampuan menulis. Murid dibebaskan mengisi portofolio refleksi dengan berbagai media (gambar, coretan, lisan, atau tindakan langsung yang diamati guru) sehingga hambatan akademis tidak menghalangi penilaian karakter mereka.
                </li>
                <li>
                  <strong>Objektif:</strong> Penilaian portofolio didasarkan pada rubrik eksplisit yang menilai proses refleksi dan kejujuran diri murid, bukan dinilai dari bagus atau tidaknya hasil karya fisik portofolio tersebut.
                </li>
                <li>
                  <strong>Edukatif:</strong> Melalui konferensi portofolio, guru memberikan umpan balik deskriptif yang memotivasi. Murid diajak menyadari bahwa kesalahan saat bermain (seperti berebut mainan) adalah kesempatan belajar untuk memperbaiki sikap kolaborasi mereka di hari esok.
                </li>
              </ul>
            </div>

            {/* 5. Penyesuaian Diferensiasi (Sesuai sumberdanlkpd.pdf Hal 2) */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-sm font-bold text-slate-900">
                5. Penyesuaian Diferensiasi
              </h4>
              <ul className="text-xs sm:text-[13px] text-slate-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>Diferensiasi Produk Portofolio (Minat &amp; Kesiapan):</strong> Murid yang menyukai visual dapat mengisi portofolio dengan gambar komik sederhana tentang bermain bersama. Murid yang lebih nyaman berbicara dapat mengumpulkan portofolio berupa rekaman suara (audio) yang dibantu rekam oleh guru atau orang tua di rumah.
                </li>
                <li>
                  <strong>Diferensiasi Pendampingan (Kebutuhan Khusus/Hambatan Belajar):</strong> Bagi murid yang belum lancar membaca/menulis atau lambat memahami instruksi, guru memberikan bantuan berupa kartu panduan bergambar (visual cue) untuk memicu refleksi mereka, atau melibatkan kerja sama dengan orang tua di rumah untuk menuliskan apa yang didektekan oleh anak mengenai pengalaman bermainnya.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Sub-Aksi As Learning: Sumber Belajar & LKPD Sesuai sumberdanlkpd.pdf Hal 3 */}
        <div className="pt-2 border-t border-dotted border-slate-300 space-y-3 text-left">
          <p className="text-[11px] sm:text-xs text-slate-500">
            Opsional — buat hanya bila aktivitas ini membutuhkannya (sesuaikan kebutuhan).
          </p>

          {/* 1. SUMBER BELAJAR Action Line */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs w-36 shrink-0">
              1. SUMBER BELAJAR
            </span>
            <button
              type="button"
              onClick={() => setAsSumberStatus(prev => prev === 'created' ? 'idle' : 'created')}
              className={`px-3.5 py-1.5 border rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                asSumberStatus === 'created'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${asSumberStatus === 'created' ? 'text-emerald-700' : 'text-blue-600'}`} />
              <span>{asSumberStatus === 'created' ? '✓ Sumber Belajar Siap' : 'Buat Sumber Belajar'}</span>
            </button>
            <span className="text-[11px] text-slate-500">
              bila murid perlu bahan baca/tonton
            </span>
          </div>

          {/* AKTIF: HASIL GENERATE SUMBER BELAJAR AS LEARNING */}
          {asSumberStatus === 'created' && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div className="text-xs text-emerald-800 font-medium px-1 flex items-center gap-1.5">
                <span className="text-emerald-700">✎</span>
                <span><strong>Sumber Belajar siap (Teks Prosedur / Panduan Langkah)</strong> — bisa diedit. LKPD akan dibuat dari isi ini.</span>
              </div>

              {/* Box Sumber Belajar As Learning */}
              <div className="border border-emerald-200/80 rounded-2xl p-5 sm:p-6 bg-white shadow-2xs space-y-4 text-left leading-relaxed">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    SUMBER BELAJAR
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                    Sumber Belajar — Panduan Jurnal Refleksi Sahabat Pancasila: Menjadi Sahabat Hebat saat Bermain
                  </h4>
                  <p className="text-xs text-slate-500">
                    Teks Panduan Portofolio / Refleksi Diri · {schoolName}
                  </p>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-700">
                  Hai, Sahabat Hebat Kelas 3!<br />
                  Di sekolah kita, bermain bersama di halaman dekat pepohonan sawit adalah momen paling menyenangkan. Namun tahukah kamu? Menjadi teman bermain yang baik adalah wujud nyata kita menjalankan nilai-nilai Pancasila! Melalui <strong>Jurnal Sahabat Pancasila</strong>, kamu bisa mengabadikan pengalaman seru dan jujur saat bermain bersama teman.
                </p>

                <div className="border-t border-dotted border-slate-200 pt-3 space-y-3 text-xs sm:text-[13px] text-slate-700">
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Langkah 1: Siapkan Wadah Portofolio Kreasimu
                    </h5>
                    <p className="mt-0.5">
                      • <strong>Tindakan Nyata:</strong> Gunakan satu map atau buku gambar khusus bertuliskan nama dan lambang sila kesukaanmu.<br />
                      • <strong>Mengapa Penting?</strong> Wadah ini menjadi rekam jejak pribadi perjalanan kebaikanmu selama belajar di kelas 3.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900">
                      Langkah 2: Kumpulkan Bukti Bermain Rukun (Sila ke-3 &amp; Sila ke-5)
                    </h5>
                    <p className="mt-0.5">
                      • <strong>Tindakan Nyata:</strong> Setiap selesai bermain bersama, masukkan satu bukti (gambar buatanmu, tulisan cerita pendek, atau minta bantuan guru merekam suaramu).<br />
                      • <strong>Mengapa Penting?</strong> Bukti ini membantumu mengingat momen saat kamu sabar menunggu antrean atau berbagi mainan secara adil.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900">
                      Langkah 3: Luangkan 10 Menit Refleksi Mandiri di Akhir Pekan
                    </h5>
                    <p className="mt-0.5">
                      • <strong>Tindakan Nyata:</strong> Buka kembali jurnalmu dan tanyakan pada dirimu sendiri: &quot;Hal baik apa yang sudah kulakukan saat bermain minggu ini?&quot; dan &quot;Apa yang ingin kuperbaiki minggu depan?&quot;<br />
                      • <strong>Mengapa Penting?</strong> Memeriksa diri sendiri (metakognisi) melatihmu menjadi anak yang bertanggung jawab dan berkarakter mulia.
                    </p>
                  </div>
                </div>

                {/* Stimulus Gambar */}
                <div className="border border-dashed border-slate-300 bg-slate-50/70 rounded-xl p-3.5 text-center text-xs text-slate-600 italic">
                  [Gambar: Murid kelas 3 sedang tersenyum riang membuka map &quot;Jurnal Sahabat Pancasila&quot; di dekat lingkungan sekolah yang asri]
                </div>

                <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-3 text-xs text-slate-800">
                  <strong>Ingatlah:</strong> Kejujuran dalam merefleksikan diri jauh lebih berharga daripada hasil karya yang sempurna. Kesalahan saat bermain adalah kesempatan untuk belajar menjadi sahabat yang lebih baik!
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveDoc(`Sumber Belajar — Panduan Jurnal Refleksi Sahabat Pancasila`, 'sumber_belajar', { type: 'as_learning_sumber' })}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                    <span>💾 Simpan ke Koleksi</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. LKPD Action Line */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs pt-2">
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs w-36 shrink-0">
              2. LKPD
            </span>
            <button
              type="button"
              onClick={() => setAsLkpdStatus(prev => prev === 'created' ? 'idle' : 'created')}
              className={`px-3.5 py-1.5 border rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                asLkpdStatus === 'created'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${asLkpdStatus === 'created' ? 'text-emerald-700' : 'text-rose-500'}`} />
              <span>{asLkpdStatus === 'created' ? '✓ LKPD Siap' : 'Buat LKPD'}</span>
            </button>
            <button
              type="button"
              onClick={() => setAsLkpdStatus(prev => prev === 'skipped' ? 'idle' : 'skipped')}
              className={`text-[11px] font-medium cursor-pointer transition-colors ${
                asLkpdStatus === 'skipped'
                  ? 'text-slate-400 italic'
                  : 'text-blue-600 hover:underline'
              }`}
            >
              {asLkpdStatus === 'skipped' ? 'Dilewati (aktivitas tanpa sumber)' : 'Lewati (aktivitas ini tanpa sumber)'}
            </button>
          </div>

          {/* AKTIF: HASIL GENERATE LKPD AS LEARNING */}
          {asLkpdStatus === 'created' && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div className="text-xs text-emerald-800 font-medium px-1 flex items-center gap-1.5">
                <span className="text-emerald-700">✎</span>
                <span><strong>LKPD siap (Fase B)</strong> — berbasis Sumber Belajar. Bisa diedit. Ganti [Gambar: ...] dengan gambar asli sebelum cetak.</span>
              </div>

              {/* Box LKPD As Learning */}
              <div className="border border-slate-300 rounded-2xl p-5 sm:p-7 bg-white shadow-2xs space-y-4 text-left leading-relaxed">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    LEMBAR KERJA PESERTA DIDIK
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    LKPD — Jurnal Refleksi Sahabat Pancasila (Portofolio Mandiri)
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {schoolName} · {displaySubject} · {displayGrade}
                  </p>
                </div>

                {/* Tabel Identitas Murid */}
                <div className="border border-amber-300 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-2 divide-x divide-amber-300 bg-amber-50/30">
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">Nama:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">Kelas:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-amber-300 border-t border-amber-300 bg-amber-50/30">
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">No. Absen:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">Tanggal:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                  </div>
                </div>

                {/* TP Banner */}
                <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-3 text-xs text-slate-800">
                  <strong>Tujuan (TP):</strong> {tpText || 'Menerapkan nilai-nilai sila Pancasila secara konsisten dalam aktivitas bermain bersama teman'}
                </div>

                <p className="text-xs sm:text-[13px] text-slate-700">
                  Halo, Sahabat Pancasila! Luangkan waktu sejenak untuk mengisi lembar portofolio refleksi diri ini. Ceritakan apa yang sudah kamu lakukan saat bermain bersama teman minggu ini!
                </p>

                {/* Pilihan Diferensiasi */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800">
                    Pilih salah satu cara untuk mengisi portofolio refleksi minggu ini:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 text-xs text-slate-700 space-y-1">
                      <strong className="text-slate-900 block font-bold">Pilihan A: Menulis Catatan Pengalaman</strong>
                      <p>Tuliskan 2-3 kalimat mengenai bagaimana kamu mempraktikkan sikap adil atau sabar mengantre saat bermain bersama teman.</p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 text-xs text-slate-700 space-y-1">
                      <strong className="text-slate-900 block font-bold">Pilihan B: Menggambar Momen Kolaborasi</strong>
                      <p>Gambarkan situasi saat kamu dan teman-teman bermain rukun tanpa berebut mainan di halaman sekolah.</p>
                    </div>
                  </div>
                </div>

                {/* Tabel Ceklis Refleksi Diri */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    Ceklis Perilaku Bermain Adilku:
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
                          <th className="p-2.5">Sikap dan Perilaku Nyata saat Bermain</th>
                          <th className="p-2.5 text-center w-24 border-l border-slate-200">Sudah Kulakukan</th>
                          <th className="p-2.5 text-center w-24 border-l border-slate-200">Belum / Belajar Lagi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="p-2.5">1. Datang tepat waktu saat berjanji bermain bersama teman.</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                        </tr>
                        <tr>
                          <td className="p-2.5">2. Menunggu giliran bermain dengan sabar tanpa menyerobot.</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                        </tr>
                        <tr>
                          <td className="p-2.5">3. Mengajak teman yang belum diajak atau masih malu-malu.</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                        </tr>
                        <tr>
                          <td className="p-2.5">4. Menerima kekalahan atau merayakan kemenangan dengan santun.</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                          <td className="p-2.5 text-center border-l border-slate-200">☐</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Kolom Karya / Tulisan Portofolio */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    Ruang Cerita / Gambar Portofolio:
                  </span>
                  <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/30 space-y-2 min-h-[110px]">
                    <div className="border-b border-dotted border-slate-300 h-5"></div>
                    <div className="border-b border-dotted border-slate-300 h-5"></div>
                    <div className="border-b border-dotted border-slate-300 h-5"></div>
                    <div className="border-b border-dotted border-slate-300 h-5"></div>
                  </div>
                </div>

                {/* Pertanyaan Refleksi Metakognisi */}
                <div className="space-y-2 pt-1 text-xs">
                  <span className="font-bold text-slate-900 block">Refleksi</span>
                  <div className="space-y-1">
                    <p className="text-slate-700">1. Apa satu hal baik yang paling kamu banggakan dari caramu bermain minggu ini?</p>
                    <div className="border-b border-slate-300 h-6"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-700">2. Apa yang akan kamu lakukan jika minggu depan ada teman yang terlambat atau belum paham aturan main?</p>
                    <div className="border-b border-slate-300 h-6"></div>
                  </div>
                </div>

                {/* Catatan Ayah/Bunda */}
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    Catatan Ayah/Bunda
                  </span>
                  <div className="border border-slate-300 rounded-xl h-16 bg-slate-50/20 p-2 text-slate-400 text-[11px] italic">
                    (Tuliskan apresiasi atau pesan motivasi Ayah/Bunda untuk ananda...)
                  </div>
                </div>

                {/* Bahan Gambar Guru */}
                <div className="border-t border-dashed border-slate-300 pt-2 text-[11px] text-slate-600 flex items-start gap-2">
                  <Scissors className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Bahan gambar yang perlu disiapkan guru:</strong>
                    <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                      <li>☐ Gambar ilustrasi anak kelas 3 memegang map portofolio dengan bangga.</li>
                      <li>☐ Stiker bintang senyum / apresiasi karakter Pancasila.</li>
                    </ul>
                  </div>
                </div>

                {/* Tiga Tombol Aksi Sesuai Format */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSaveDoc(`LKPD — Jurnal Refleksi Sahabat Pancasila`, 'lkpd', { type: 'as_learning_lkpd' })}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>💾 Simpan ke Koleksi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDesign('LKPD Jurnal Refleksi Sahabat Pancasila', 'Portofolio As Learning')}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>🎨 Buat Desain LKPD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyPrompt('as')}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>📋 Prompt utk AI lain</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: OF LEARNING (sesuai sumberdanlkpd.pdf Hal 3 s.d. Hal 8) */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-6 border-t border-slate-200 text-left">
        {/* Dropdown & Buat Button Row (Hal 3) */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <select
              value={selectedOf}
              onChange={(e) => setSelectedOf(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 pr-9 cursor-pointer shadow-2xs font-medium"
            >
              <option value="Projek">Projek</option>
              <option value="Unjuk Kerja">Unjuk Kerja</option>
              <option value="Tes Tertulis (Pilihan Ganda & Uraian)">Tes Tertulis (Pilihan Ganda &amp; Uraian)</option>
              <option value="Produk Siswa">Produk Siswa</option>
              <option value="Presentasi & Demonstrasi Lisan">Presentasi &amp; Demonstrasi Lisan</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3 top-3 pointer-events-none" />
          </div>

          <span className="text-xs font-bold tracking-wider text-slate-700 uppercase whitespace-nowrap px-1">
            OF LEARNING
          </span>

          <button
            type="button"
            onClick={handleBuatOf}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            Buat
          </button>
        </div>

        {/* Status Notice Sesuai sumberdanlkpd.pdf Hal 3 */}
        {ofReady && (
          <div className="flex items-center justify-between text-xs text-emerald-800 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-700">✎</span>
              <strong>of learning</strong> siap — bisa diedit. Akan jadi Lampiran Asesmen di modul.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCopiedOf(true);
                  setTimeout(() => setCopiedOf(false), 2000);
                }}
                className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedOf ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedOf ? 'Tersalin' : 'Salin'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveDoc(`Of Learning: Projek Pandu Bermain Adil (${selectedOf})`, 'of_learning', { form: selectedOf })}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Bookmark className="w-3 h-3" />
                <span>Simpan Dokumen</span>
              </button>
            </div>
          </div>
        )}

        {/* OF LEARNING CARD (PERSIS sumberdanlkpd.pdf Hal 3 & 4) */}
        {ofReady && (
          <div className="border border-slate-200 rounded-2xl p-5 sm:p-7 bg-white text-slate-800 shadow-2xs space-y-5 text-left leading-relaxed">
            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Projek Pandu Bermain Adil: Festival Permainan Tradisional {city} — (of learning · {selectedOf})
            </h3>

            {/* 1. Tujuan Asesmen */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">
                1. Tujuan Asesmen
              </h4>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                Asesmen ini bertujuan untuk mengukur pencapaian akhir murid dalam menerapkan nilai-nilai Pancasila (seperti gotong royong, keadilan sosial, dan musyawarah) secara konsisten melalui projek kelompok merancang dan memainkan permainan bersama. Asesmen ini berfokus pada dimensi Kolaborasi, sekaligus mendukung visi sekolah dalam membentuk murid yang berkarakter, berdedikasi, dan unggul di tengah tantangan kedisiplinan dan keberagaman pemahaman akademis di {city}.
              </p>
            </div>

            {/* 2. Langkah Asesmen */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">
                2. Langkah Asesmen
              </h4>
              <ul className="text-xs sm:text-[13px] text-slate-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>Tahap Persiapan (Rancangan):</strong> Guru membagi murid ke dalam kelompok inklusif yang heterogen. Setiap kelompok ditantang merancang satu permainan sederhana yang memanfaatkan sumber daya lokal (misalnya memanfaatkan pelepah atau lidi kelapa sawit yang melimpah di {city}). Orang tua dilibatkan untuk membantu mengawasi keamanan bahan yang digunakan.
                </li>
                <li>
                  <strong>Tahap Simulasi &amp; Kesepakatan:</strong> Sebelum bermain, guru mengobservasi bagaimana kelompok berdiskusi membagi peran dan menentukan aturan bermain yang adil (mencegah masalah keterlambatan dengan menyepakati waktu mulai bersama).
                </li>
                <li>
                  <strong>Tahap Pelaksanaan (Festival Bermain):</strong> Kelompok mempraktikkan permainan mereka dan mengundang kelompok lain untuk bermain bersama. Guru melakukan observasi langsung menggunakan lembar kriteria penilaian saat proses bermain berlangsung.
                </li>
                <li>
                  <strong>Tahap Refleksi Akhir:</strong> Guru memfasilitasi diskusi melingkar setelah bermain untuk mengevaluasi bagaimana nilai Pancasila membantu permainan berjalan menyenangkan tanpa pertengkaran.
                </li>
              </ul>
            </div>

            {/* 3. Kriteria Asesmen */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                3. Kriteria Asesmen
              </h4>

              {/* Rubric Table Sesuai sumberdanlkpd.pdf Hal 3 & 4 */}
              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-300 text-slate-900 font-bold">
                      <th className="p-3 w-1/5 border-r border-slate-200">Kriteria</th>
                      <th className="p-3 w-1/5 border-r border-slate-200">Perlu Bimbingan</th>
                      <th className="p-3 w-1/5 border-r border-slate-200">Layak</th>
                      <th className="p-3 w-1/5 border-r border-slate-200">Cakap</th>
                      <th className="p-3 w-1/5">Mahir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs text-slate-700">
                    <tr className="align-top">
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                        Kolaborasi &amp; Pembagian Peran (Sila 3 &amp; 4)
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Hanya mau bermain sendiri atau mendominasi permainan tanpa memedulikan peran teman kelompok.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mau berbagi peran dalam kelompok namun masih membutuhkan intervensi guru untuk menyelesaikan konflik.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Berbagi peran secara adil dalam kelompok dan aktif mendukung teman selama permainan berlangsung.
                      </td>
                      <td className="p-3">
                        Memimpin kolaborasi secara inklusif, memastikan semua anggota kelompok (termasuk yang lambat belajar) mendapatkan peran yang setara.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                        Ketaatan pada Aturan &amp; Keadilan (Sila 2 &amp; 5)
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Sering melanggar aturan permainan yang disepakati atau tidak konsisten dalam giliran bermain.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mengikuti aturan bermain jika diawasi guru, namun kadang masih abai saat luput dari pengawasan.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Konsisten mengikuti aturan bermain, mengantre giliran dengan sabar, dan jujur dalam menghitung skor.
                      </td>
                      <td className="p-3">
                        Secara konsisten menjaga sportivitas, mengingatkan teman dengan santun jika ada yang melanggar aturan, dan menghargai hasil bermain.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                        Sikap Menghargai Perbedaan (Sila 1 &amp; 2)
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mengejek teman yang melakukan kesalahan dalam bermain atau enggan bermain dengan teman tertentu.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Mau bermain dengan semua teman, namun masih menunjukkan sikap enggan saat berpasangan dengan anggota tertentu.
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        Menunjukkan sikap menghargai, tidak membeda-bedakan teman, dan memberikan semangat saat teman kesulitan.
                      </td>
                      <td className="p-3">
                        Menjadi penengah yang damai jika terjadi perbedaan pendapat dan aktif menciptakan suasana bermain yang aman dan nyaman bagi semua.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Penerapan 3 Prinsip Asesmen (Sesuai sumberdanlkpd.pdf Hal 4) */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-sm font-bold text-slate-900">
                4. Penerapan 3 Prinsip Asesmen
              </h4>
              <ul className="text-xs sm:text-[13px] text-slate-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>Berkeadilan:</strong> Asesmen ini tidak menguji kemampuan membaca atau menulis murid yang masih beragam di kelas 3, melainkan menilai tindakan nyata dan sikap mereka saat berinteraksi langsung. Setiap murid mendapatkan kesempatan yang sama untuk berkontribusi sesuai dengan kekuatan dirinya.
                </li>
                <li>
                  <strong>Objektif:</strong> Penilaian didasarkan pada rubrik perilaku yang teramati secara langsung (bukan asumsi guru), seperti frekuensi mengantre, cara berbicara saat berdiskusi, dan kepatuhan pada aturan yang disepakati bersama.
                </li>
                <li>
                  <strong>Edukatif:</strong> Setelah festival selesai, guru memberikan umpan balik deskriptif yang memotivasi (misalnya, &quot;Ibu sangat bangga melihat kamu sabar menunggu giliran hari ini&quot;). Guru juga mengajak murid melakukan refleksi metakognitif sederhana: &quot;Apa yang membuat permainan kita hari ini berjalan rukun?&quot;
                </li>
              </ul>
            </div>

            {/* 5. Penyesuaian Diferensiasi (Sesuai sumberdanlkpd.pdf Hal 4 & 5) */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-sm font-bold text-slate-900">
                5. Penyesuaian Diferensiasi
              </h4>
              <ul className="text-xs sm:text-[13px] text-slate-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>Diferensiasi Proses (Kesiapan Belajar):</strong> Bagi murid yang belum memahami instruksi permainan yang rumit, guru menyederhanakan peran mereka (misalnya menjadi penjaga waktu atau penghitung skor menggunakan lidi sawit) agar mereka tetap dapat berkolaborasi aktif tanpa merasa rendah diri.
                </li>
                <li>
                  <strong>Diferensiasi Produk (Minat &amp; Gaya Belajar):</strong> Kelompok dibebaskan memilih jenis permainan yang akan ditampilkan dalam festival, baik permainan fisik aktif (seperti modifikasi egrang pelepah sawit) maupun permainan papan/strategi sederhana yang ramah bagi murid dengan keterbatasan fisik.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Sub-Aksi Of Learning: Sumber Belajar & LKPD Sesuai sumberdanlkpd.pdf Hal 5 */}
        <div className="pt-2 border-t border-dotted border-slate-300 space-y-3">
          <p className="text-[11px] sm:text-xs text-slate-500">
            Opsional — buat hanya bila aktivitas ini membutuhkannya (sesuaikan kebutuhan).
          </p>

          {/* 1. SUMBER BELAJAR Action Line */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs w-36 shrink-0">
              1. SUMBER BELAJAR
            </span>
            <button
              type="button"
              onClick={() => setOfSumberStatus(prev => prev === 'created' ? 'idle' : 'created')}
              className={`px-3.5 py-1.5 border rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                ofSumberStatus === 'created'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${ofSumberStatus === 'created' ? 'text-emerald-700' : 'text-blue-600'}`} />
              <span>{ofSumberStatus === 'created' ? '✓ Sumber Belajar Siap' : 'Buat Sumber Belajar'}</span>
            </button>
            <span className="text-[11px] text-slate-500">
              bila murid perlu bahan baca/tonton
            </span>
          </div>

          {/* AKTIF: HASIL GENERATE SUMBER BELAJAR OF LEARNING (PERSIS sumberdanlkpd.pdf Hal 5 & 6) */}
          {ofSumberStatus === 'created' && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div className="text-xs text-emerald-800 font-medium px-1 flex items-center gap-1.5">
                <span className="text-emerald-700">✎</span>
                <span><strong>Sumber Belajar siap (Teks Prosedur / Panduan Langkah)</strong> — bisa diedit. LKPD akan dibuat dari isi ini.</span>
              </div>

              {/* Box Sumber Belajar Of Learning */}
              <div className="border border-emerald-200/80 rounded-2xl p-5 sm:p-6 bg-white shadow-2xs space-y-4 text-left leading-relaxed">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    SUMBER BELAJAR
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                    Sumber Belajar — Panduan Pandu Bermain Adil: Menjadi Sahabat Pancasila di Festival Kampar
                  </h4>
                  <p className="text-xs text-slate-500">
                    Teks Prosedur / Panduan Langkah · {schoolName}
                  </p>
                </div>

                <div className="text-xs sm:text-[13px] text-slate-700 space-y-2">
                  <p>
                    Hai, Anak-Anak Hebat Kelas 3!
                  </p>
                  <p>
                    Sebentar lagi, sekolah kita akan mengadakan <strong>Festival Permainan Tradisional Kampar</strong>. Kita akan bermain permainan seru seperti <em>*Pecah Piring*</em> dan <em>*Lari Tempurung*</em> bersama teman-teman, orang tua, dan para pekerja dari lingkungan sekitar kita.
                  </p>
                  <p>
                    Tahukah kamu? Bermain bukan hanya soal menang atau kalah. Bermain adalah cara terbaik untuk mengamalkan nilai-nilai Pancasila. Yuk, kita pelajari langkah-langkah menjadi &quot;Pandu Bermain Adil&quot; di festival nanti!
                  </p>
                </div>

                <div className="border-t border-dotted border-slate-200 pt-3 space-y-3.5 text-xs sm:text-[13px] text-slate-700">
                  {/* Langkah 1 */}
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Langkah 1: Datang Tepat Waktu (Sila ke-2: Kemanusiaan yang Adil dan Beradab)
                    </h5>
                    <p className="text-slate-600 italic mt-0.5">
                      Menghargai waktu adalah bentuk peduli kepada sesama.
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>
                        <strong>Tindakan Nyata:</strong> Datanglah ke lapangan tepat waktu sesuai jadwal festival.
                      </li>
                      <li>
                        <strong>Mengapa Penting?</strong> Jika kamu terlambat, teman kelompokmu harus menunggu lama dan waktu bermain jadi berkurang. Menghargai waktu teman adalah sikap yang beradab!
                      </li>
                    </ul>
                  </div>

                  {/* Langkah 2 */}
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Langkah 2: Bermusyawarah Membuat Aturan (Sila ke-4: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan)
                    </h5>
                    <p className="text-slate-600 italic mt-0.5">
                      Sebelum permainan dimulai, berkumpullah dengan kelompokmu.
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>
                        <strong>Tindakan Nyata:</strong> Duduk melingkar dan sepakati aturan permainan bersama-sama (misalnya: siapa yang mendapat giliran pertama bermain <em>*Pecah Piring*</em>). Dengarkan pendapat semua teman dengan tenang.
                      </li>
                      <li>
                        <strong>Mengapa Penting?</strong> Dengan bermusyawarah, tidak akan ada teman yang merasa diabaikan.
                      </li>
                    </ul>
                  </div>

                  {/* Langkah 3 */}
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Langkah 3: Bermain Kompak Tanpa Membeda-bedakan (Sila ke-3: Persatuan Indonesia)
                    </h5>
                    <p className="text-slate-600 italic mt-0.5">
                      Di festival ini, semua adalah teman kita.
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>
                        <strong>Tindakan Nyata:</strong> Ajak semua teman bermain, baik laki-laki maupun perempuan, tanpa memandang suku atau latar belakang keluarganya. Saling menyemangati saat bermain <em>*Lari Tempurung*</em>.
                      </li>
                      <li>
                        <strong>Mengapa Penting?</strong> Menjaga persatuan membuat permainan menjadi jauh lebih seru dan damai.
                      </li>
                    </ul>
                  </div>

                  {/* Langkah 4 */}
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Langkah 4: Jujur dan Berbagi Giliran (Sila ke-5: Keadilan Sosial bagi Seluruh Rakyat Indonesia)
                    </h5>
                    <p className="text-slate-600 italic mt-0.5">
                      Keadilan harus dirasakan oleh semua pemain.
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>
                        <strong>Tindakan Nyata:</strong> Akui dengan jujur jika kamu terkena lemparan bola dalam permainan <em>*Pecah Piring*</em>. Berikan kesempatan yang sama kepada setiap anggota kelompok untuk mencoba alat permainan.
                      </li>
                      <li>
                        <strong>Mengapa Penting?</strong> Bermain jujur menciptakan rasa keadilan dan mencegah pertengkaran.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Stimulus Gambar Sesuai sumberdanlkpd.pdf Hal 6 */}
                <div className="border border-dashed border-slate-300 bg-slate-50/70 rounded-xl p-3.5 text-center text-xs text-slate-600 italic">
                  [Gambar: Anak-anak kelas 3 sedang tersenyum, bersalaman setelah bermain permainan tradisional di lapangan sekolah yang dikelilingi pohon sawit]
                </div>

                <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-3 text-xs text-slate-800">
                  <strong>Ingatlah:</strong> Seorang Pandu Bermain Adil selalu membawa nilai Pancasila di dalam hatinya, mulai dari sebelum bermain hingga permainan selesai!
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveDoc(`Sumber Belajar — Panduan Pandu Bermain Adil`, 'sumber_belajar', { type: 'of_learning_sumber' })}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                    <span>💾 Simpan ke Koleksi</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. LKPD Action Line Sesuai sumberdanlkpd.pdf Hal 6 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs pt-2">
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs w-36 shrink-0">
              2. LKPD
            </span>
            <button
              type="button"
              onClick={() => setOfLkpdStatus(prev => prev === 'created' ? 'idle' : 'created')}
              className={`px-3.5 py-1.5 border rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                ofLkpdStatus === 'created'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${ofLkpdStatus === 'created' ? 'text-emerald-700' : 'text-rose-500'}`} />
              <span>{ofLkpdStatus === 'created' ? '✓ LKPD Siap' : 'Buat LKPD'}</span>
            </button>
            <button
              type="button"
              onClick={() => setOfLkpdStatus(prev => prev === 'skipped' ? 'idle' : 'skipped')}
              className={`text-[11px] font-medium cursor-pointer transition-colors ${
                ofLkpdStatus === 'skipped'
                  ? 'text-slate-400 italic'
                  : 'text-blue-600 hover:underline'
              }`}
            >
              {ofLkpdStatus === 'skipped' ? 'Dilewati (aktivitas tanpa sumber)' : 'Lewati (aktivitas ini tanpa sumber)'}
            </button>
          </div>

          {/* AKTIF: HASIL GENERATE LKPD OF LEARNING (PERSIS sumberdanlkpd.pdf Hal 6, 7 & 8) */}
          {ofLkpdStatus === 'created' && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div className="text-xs text-emerald-800 font-medium px-1 flex items-center gap-1.5">
                <span className="text-emerald-700">✎</span>
                <span><strong>LKPD siap (Fase B)</strong> — berbasis Sumber Belajar. Bisa diedit. Ganti [Gambar: ...] dengan gambar asli sebelum cetak.</span>
              </div>

              {/* Box LKPD Of Learning Sesuai Hal 6, 7, 8 */}
              <div className="border border-slate-300 rounded-2xl p-5 sm:p-7 bg-white shadow-2xs space-y-4 text-left leading-relaxed">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    LEMBAR KERJA PESERTA DIDIK
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    LKPD — Projek Pandu Bermain Adil: Festival Permainan Tradisional Kampar
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {schoolName} · {displaySubject} · {displayGrade}
                  </p>
                </div>

                {/* Tabel Identitas Murid */}
                <div className="border border-amber-300 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-2 divide-x divide-amber-300 bg-amber-50/30">
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">Nama:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">Kelas:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-amber-300 border-t border-amber-300 bg-amber-50/30">
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">No. Absen:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 w-16">Tanggal:</span>
                      <div className="flex-1 border-b border-dotted border-slate-400 h-4"></div>
                    </div>
                  </div>
                </div>

                {/* TP Banner (Hal 6) */}
                <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-3 text-xs text-slate-800">
                  <strong>Tujuan (TP):</strong> {tpText || 'Menerapkan nilai-nilai sila Pancasila secara konsisten dalam aktivitas bermain bersama teman'}
                </div>

                <div className="text-xs sm:text-[13px] text-slate-700 space-y-1.5">
                  <p>
                    Halo, Pandu Bermain Adil! Yuk, kita siapkan diri untuk ikut serta dalam Festival Permainan Tradisional Kampar dengan menerapkan nilai-nilai Pancasila bersama teman-temanmu!
                  </p>
                  <p>
                    Kerjakan projek persiapan kelompokmu dengan mengikuti langkah-langkah di bawah ini. Kamu bisa memilih cara melaporkan hasil diskusimu!
                  </p>
                </div>

                {/* Pilihan Cara Menunjukkan Rencana (Hal 7) */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800">
                    Pilih salah satu cara untuk menunjukkan rencana bermain adil kelompokmu:
                  </p>
                  <div className="space-y-2">
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 text-xs text-slate-700 space-y-1">
                      <strong className="text-slate-900 block font-bold">Pilihan A: Menulis Rencana</strong>
                      <ul className="list-disc pl-5 space-y-0.5">
                        <li>Tuliskan aturan bermain yang disepakati bersama di lembar ini.</li>
                        <li>Tuliskan siapa saja anggota kelompok yang akan bermain bergantian.</li>
                      </ul>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 text-xs text-slate-700 space-y-1">
                      <strong className="text-slate-900 block font-bold">Pilihan B: Menggambar Peta Bermain</strong>
                      <ul className="list-disc pl-5 space-y-0.5">
                        <li>Gambarkan lapangan permainan Pecah Piring atau Lari Tempurung.</li>
                        <li>Beri tanda di mana posisi teman-temanmu berdiri agar adil.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ingat Langkah Pandu Bermain Adil Box (Hal 7) */}
                <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-3.5 space-y-2 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block">
                    Ingat Langkah Pandu Bermain Adil
                  </span>
                  <div className="border border-dashed border-slate-300 bg-white rounded-lg p-2.5 text-center text-[11px] text-slate-600 italic">
                    [Gambar: Anak-anak kelas 3 sedang tersenyum, bersalaman setelah bermain permainan tradisional di lapangan sekolah yang dikelilingi pohon sawit]
                  </div>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-slate-800">
                    <strong>Kita harus menerapkan:</strong> 1. Datang tepat waktu agar teman tidak menunggu (Sila ke-2) 2. Bermusyawarah membuat aturan bersama (Sila ke-4) 3. Bermain kompak tanpa membeda-bedakan teman (Sila ke-3) 4. Jujur mengakui jika terkena bola dan berbagi giliran (Sila ke-5)
                  </p>
                </div>

                {/* Pertanyaan Musyawarah Bergaris (Hal 7) */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-slate-900">
                    Tuliskan hasil musyawarah kelompokmu! Apa aturan bermain Pecah Piring atau Lari Tempurung yang kalian sepakati agar semua mendapat giliran dengan adil?
                  </p>
                  <div className="space-y-2 pt-1">
                    <div className="border-b border-slate-300 h-5"></div>
                    <div className="border-b border-slate-300 h-5"></div>
                    <div className="border-b border-slate-300 h-5"></div>
                  </div>
                </div>

                {/* Menjodohkan / Matching Section (Hal 7) */}
                <div className="space-y-2 pt-2 text-xs">
                  <span className="font-bold text-slate-900 block">
                    Jodohkan tindakan bermain di bawah ini dengan nilai sila Pancasila yang tepat:
                  </span>
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-800 py-1">
                      <span className="font-medium">Datang tepat waktu ke lapangan</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                        <span className="text-slate-300">············</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      </div>
                      <span className="font-semibold text-slate-900 text-right w-44">Sila ke-2 (Adab &amp; Waktu)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-800 py-1">
                      <span className="font-medium">Duduk melingkar menyepakati aturan</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                        <span className="text-slate-300">············</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      </div>
                      <span className="font-semibold text-slate-900 text-right w-44">Sila ke-4 (Musyawarah)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-800 py-1">
                      <span className="font-medium">Mengajak teman tanpa membedakan suku</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                        <span className="text-slate-300">············</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      </div>
                      <span className="font-semibold text-slate-900 text-right w-44">Sila ke-3 (Persatuan)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-800 py-1">
                      <span className="font-medium">Jujur saat terkena lemparan bola</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                        <span className="text-slate-300">············</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      </div>
                      <span className="font-semibold text-slate-900 text-right w-44">Sila ke-5 (Keadilan)</span>
                    </div>
                  </div>
                </div>

                {/* Kotak Menggambar Ekspresi Wajah (Hal 7 & 8) */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <span className="font-bold text-slate-900 block">
                    Gambarkan ekspresi wajah kelompokmu saat berhasil bermain dengan kompak dan adil di lapangan sekolah!
                  </span>
                  <div className="border border-slate-300 rounded-xl h-36 bg-slate-50/30 flex items-center justify-center text-slate-400 text-xs italic">
                    (Ruang Menggambar Ekspresi Wajah Kelompok Bermain)
                  </div>
                </div>

                {/* Refleksi Diri (Hal 8) */}
                <div className="space-y-2.5 pt-1 text-xs">
                  <span className="font-bold text-slate-900 block">Refleksi</span>
                  <div className="space-y-1">
                    <p className="text-slate-700">Apakah aku sudah mendengarkan pendapat semua teman saat membuat aturan tadi?</p>
                    <div className="border-b border-slate-300 h-6"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-700">Apa yang akan aku lakukan jika ada teman kelompokku yang terlambat datang ke festival?</p>
                    <div className="border-b border-slate-300 h-6"></div>
                  </div>
                </div>

                {/* Catatan Ayah/Bunda (Hal 8) */}
                <div className="space-y-1 pt-1 text-xs">
                  <span className="font-bold text-slate-900 block">Catatan Ayah/Bunda</span>
                  <div className="border border-slate-300 rounded-xl h-16 bg-slate-50/20 p-2 text-slate-400 text-[11px] italic">
                    (Tuliskan komentar atau dukungan Ayah/Bunda di sini...)
                  </div>
                </div>

                {/* Bahan Gambar yang Perlu Disiapkan Guru (Hal 8) */}
                <div className="border-t border-dashed border-slate-300 pt-2 text-[11px] text-slate-600 flex items-start gap-2">
                  <Scissors className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <strong>Bahan gambar yang perlu disiapkan guru:</strong>
                    <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                      <li>☐ Anak-anak kelas 3 sedang tersenyum, bersalaman setelah bermain permainan tradisional di lapangan sekolah yang dikelilingi pohon sawit</li>
                    </ul>
                  </div>
                </div>

                {/* Tiga Tombol Aksi Sesuai Format (Hal 8) */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSaveDoc(`LKPD — Projek Pandu Bermain Adil`, 'lkpd', { type: 'of_learning_lkpd' })}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>💾 Simpan ke Koleksi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDesign('LKPD Projek Pandu Bermain Adil', 'Projek Of Learning')}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>🎨 Buat Desain LKPD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyPrompt('of')}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>📋 Prompt utk AI lain</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DIALOG (Desain Cetak LKPD & Prompt AI Generator) */}
      {/* ========================================================================= */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {modalData.type === 'design' ? <Printer className="w-4 h-4 text-blue-600" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                <span>{modalData.title}</span>
              </h4>
              <button
                type="button"
                onClick={() => setModalData(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {modalData.description}
            </p>

            {modalData.promptText && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">Teks Prompt Tersalin:</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-800 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {modalData.promptText}
                </div>
              </div>
            )}

            {modalData.type === 'design' && (
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <p className="font-semibold">Opsi Cetak Dokumen:</p>
                <p className="text-[11px] text-blue-800">Dokumen sudah diatur sesuai format standar A4 portrait, font sans-serif berdaya baca tinggi, dan hemat tinta printer.</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {modalData.type === 'design' ? (
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    setModalData(null);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF (A4)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
