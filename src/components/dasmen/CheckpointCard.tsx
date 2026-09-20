import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  ChevronDown, 
  Bookmark, 
  Palette, 
  Copy, 
  Check, 
  Scissors, 
  Sparkles,
  Printer,
  X
} from 'lucide-react';
import { SavedDocument } from '../../types';
import { CheckpointItem } from './KembangkanModulView';

interface CheckpointCardProps {
  cp: CheckpointItem;
  schoolName: string;
  subject: string;
  grade: string;
  phase: string;
  tpText: string;
  onToggleSumberBelajar: (id: number) => void;
  onToggleLkpd: (id: number) => void;
  onSkipSumber: (id: number) => void;
  onUpdateCpType: (id: number, type: string) => void;
  onSaveToCollection?: (doc: SavedDocument) => void;
}

export const CheckpointCard: React.FC<CheckpointCardProps> = ({
  cp,
  schoolName,
  subject,
  grade,
  phase,
  tpText,
  onToggleSumberBelajar,
  onToggleLkpd,
  onSkipSumber,
  onUpdateCpType,
  onSaveToCollection
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [showDesignModal, setShowDesignModal] = useState<boolean>(false);

  const schoolDisplay = schoolName || 'SD IT';
  const subjectDisplay = subject || 'Pendidikan Pancasila';
  const gradeDisplay = grade || 'Kelas 3';
  const phaseDisplay = phase || 'B';
  const tpDisplay = tpText || 'Menerapkan nilai-nilai sila Pancasila secara konsisten dalam aktivitas bermain bersama teman';

  // Specific content mapping based on Checkpoint stepNumber / ID from bahandanlkpd.pdf
  const isCp1 = cp.stepNumber === 1;
  const isCp2 = cp.stepNumber === 2;
  const isCp3 = cp.stepNumber === 3;

  const handleSaveSumberBelajar = () => {
    const doc: SavedDocument = {
      id: `sumber-cp-${cp.stepNumber}-${Date.now()}`,
      title: `Sumber Belajar: ${cp.title}`,
      category: 'modul_dasmen',
      subjectOrTheme: subjectDisplay,
      gradeOrAge: gradeDisplay,
      createdAt: new Date().toISOString(),
      data: {
        type: 'sumber_belajar',
        checkpointId: cp.id,
        stepNumber: cp.stepNumber,
        title: cp.title
      }
    };
    onSaveToCollection?.(doc);
    setSavedNotice(`Sumber Belajar (Checkpoint ${cp.stepNumber}) berhasil disimpan ke Koleksi!`);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleSaveLkpd = () => {
    const doc: SavedDocument = {
      id: `lkpd-cp-${cp.stepNumber}-${Date.now()}`,
      title: `LKPD: ${cp.title}`,
      category: 'modul_dasmen',
      subjectOrTheme: subjectDisplay,
      gradeOrAge: gradeDisplay,
      createdAt: new Date().toISOString(),
      data: {
        type: 'lkpd',
        checkpointId: cp.id,
        stepNumber: cp.stepNumber,
        title: cp.title
      }
    };
    onSaveToCollection?.(doc);
    setSavedNotice(`LKPD (Checkpoint ${cp.stepNumber}) berhasil disimpan ke Koleksi!`);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleCopyPromptAi = () => {
    const promptText = `
Buatkan lembar kerja peserta didik (LKPD) Kurikulum Merdeka yang ramah anak, edukatif, dan kontekstual dengan spesifikasi:
- Mata Pelajaran: ${subjectDisplay} (${gradeDisplay}, Fase ${phaseDisplay})
- Satuan Pendidikan: ${schoolDisplay}
- Tujuan Pembelajaran (TP): ${tpDisplay}
- Jenis Aktivitas: ${cp.stage} - ${cp.instrumentType} (${cp.title})
- Deskripsi: ${cp.description}
- Format: Lengkapi dengan header identitas murid, tujuan, stimulus bacaan/skenario, tabel aktivitas/pertanyaan reflektif, serta kotak Catatan Ayah/Bunda.
    `.trim();

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  return (
    <div className="p-4 sm:p-5 border border-slate-300 bg-white rounded-2xl space-y-4 shadow-xs transition-all">
      
      {/* Toast Notice */}
      {savedNotice && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Checkpoint Header: CHECKPOINT N  Stage */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-bold text-[#0f2942] tracking-wider uppercase">
          CHECKPOINT {cp.stepNumber}
        </span>
        <span className="text-xs font-bold text-[#1d5fb4]">
          {cp.stage}
        </span>
      </div>

      {/* Dropdown Instrument */}
      <div className="relative">
        <select
          value={cp.instrumentType}
          onChange={(e) => onUpdateCpType(cp.id, e.target.value)}
          className="w-full appearance-none px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 pr-9 cursor-pointer shadow-2xs"
        >
          <option value="Kuis">Kuis</option>
          <option value="Observasi">Observasi</option>
          <option value="Penilaian Diri & Sejawat">Penilaian Diri &amp; Sejawat</option>
          <option value="Penugasan">Penugasan</option>
          <option value="Exit Ticket / CATs">Exit Ticket / CATs</option>
          <option value="Observasi Ceklis">Observasi Ceklis</option>
          <option value="Tanya Jawab Lisan">Tanya Jawab Lisan</option>
          <option value="Studi Kasus Sederhana">Studi Kasus Sederhana</option>
          <option value="Unjuk Kerja">Unjuk Kerja</option>
        </select>
        <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3 top-2.5 pointer-events-none" />
      </div>

      {/* Checkpoint Description */}
      <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed">
        <strong className="text-slate-900 font-bold">{cp.title}</strong> — {cp.description}
      </p>

      {/* Dotted separator */}
      <div className="border-t border-dotted border-slate-300 pt-2" />

      {/* Subtext info */}
      <p className="text-[11px] sm:text-xs text-slate-500">
        Opsional — buat hanya bila aktivitas ini membutuhkannya (sesuaikan kebutuhan).
      </p>

      {/* ========================================================================= */}
      {/* 1. SUMBER BELAJAR ACTION ROW */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="font-bold text-slate-800 text-[11px] sm:text-xs w-36 shrink-0">
            1. SUMBER BELAJAR
          </span>
          <button
            type="button"
            onClick={() => onToggleSumberBelajar(cp.id)}
            className={`px-3.5 py-1.5 border rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              cp.sumberBelajarStatus === 'created'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${cp.sumberBelajarStatus === 'created' ? 'text-emerald-700' : 'text-blue-600'}`} />
            <span>{cp.sumberBelajarStatus === 'created' ? '✓ Sumber Belajar Siap' : 'Buat Sumber Belajar'}</span>
          </button>
          <span className="text-[11px] text-slate-500">
            bila murid perlu bahan baca/tonton
          </span>
        </div>

        {/* EXPANDED SUMBER BELAJAR CARD (FORMAT SESUAI bahandanlkpd.pdf) */}
        {cp.sumberBelajarStatus === 'created' && (
          <div className="space-y-2.5 animate-fadeIn">
            {/* Status note */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <span className="text-slate-500">✎</span>
              <span>
                <strong>Sumber Belajar siap</strong> (Teks materi/penjelasan konsep) — bisa diedit. LKPD akan dibuat dari isi ini.
              </span>
            </div>

            {/* Content Sheet Box */}
            <div className="border border-emerald-700/30 rounded-2xl p-5 sm:p-7 bg-white text-slate-800 shadow-2xs space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  SUMBER BELAJAR
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {isCp1 && 'Sumber Belajar — Panduan Bermain Hebat: Menjadi Sahabat Pancasila saat Bermain'}
                  {isCp2 && 'Sumber Belajar — Panduan Bermain Adil: Menjadi Sahabat Pancasila di Lapangan'}
                  {isCp3 && 'Sumber Belajar — Panduan Bermain Jujur: Menjadi Sahabat Pancasila yang Hebat!'}
                  {!isCp1 && !isCp2 && !isCp3 && `Sumber Belajar — Panduan Aktivitas: ${cp.title}`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isCp1 ? 'Teks materi/penjelasan konsep · SD IT' : isCp2 ? 'Teks panduan langkah dan penjelasan konsep · SD IT' : 'Teks panduan langkah · SD IT'}
                </p>
              </div>

              {/* Checkpoint 1 Content */}
              {isCp1 && (
                <div className="text-xs leading-relaxed space-y-3.5 text-slate-800">
                  <p>
                    Saat bel pulang sekolah berbunyi, atau saat sore hari di lingkungan perumahan karyawan kebun sawit tempat tinggal kita, bermain bersama teman adalah hal yang paling ditunggu.
                  </p>
                  <p>
                    Agar bermain menjadi seru, aman, dan tidak ada yang menangis, kita harus menjadi <strong>Sahabat Pancasila</strong>. Pancasila bukan hanya dihafalkan saat upacara hari Senin, tetapi harus kita lakukan saat bermain bersama teman-teman. Berikut adalah panduan sikap Pancasila saat kita bermain:
                  </p>

                  <div className="space-y-2.5 pl-1">
                    <div>
                      <p className="font-bold text-slate-900">1. Sila Pertama: Bintang (Ketuhanan Yang Maha Esa)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Sikap saat bermain:</strong> Menghormati teman yang harus beribadah.</li>
                        <li><strong>Contoh:</strong> Ketika asyik bermain sepak bola di lapangan dekat kantor kebun, terdengar suara azan. Kita berhenti bermain sejenak dan mengizinkan teman yang muslim untuk beribadah terlebih dahulu.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">2. Sila Kedua: Rantai (Kemanusiaan yang Adil dan Beradab)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Sikap saat bermain:</strong> Peduli, sopan, dan tidak membeda-bedakan fisik teman.</li>
                        <li><strong>Contoh:</strong> Kadang ada teman yang datang terlambat karena harus membantu orang tuanya menjemur pakaian atau mengantar bekal ke tempat kerja orang tua di pabrik sawit. Kita tidak boleh memarahi mereka. Kita menyambut mereka dengan ramah untuk langsung ikut bermain. Jika ada teman yang terjatuh, kita segera membantunya berdiri.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">3. Sila Ketiga: Pohon Beringin (Persatuan Indonesia)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Sikap saat bermain:</strong> Kompak, rukun, dan mau bekerja sama dengan siapa saja.</li>
                        <li><strong>Contoh:</strong> Saat bermain permainan kelompok seperti <em>Bentengan</em> atau membuat mainan dari pelepah sawit, kita tidak boleh memilih-milih teman. Kita harus bekerja sama secara kolaboratif agar kelompok kita kompak dan menang dengan jujur.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">4. Sila Keempat: Kepala Banteng (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Sikap saat bermain:</strong> Bermusyawarah (berdiskusi) untuk mengambil keputusan bersama.</li>
                        <li><strong>Contoh:</strong> Sebelum bermain, kita berkumpul untuk menentukan permainan apa yang akan dimainkan hari ini. Jika ada perbedaan pendapat, kita lakukan musyawarah atau pemungutan suara (voting), lalu menerima keputusan itu dengan lapang dada tanpa cemberut.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">5. Sila Kelima: Padi dan Kapas (Keadilan Sosial bagi Seluruh Rakyat Indonesia)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Sikap saat bermain:</strong> Adil dalam membagi peran dan antre saat menggunakan mainan.</li>
                        <li><strong>Contoh:</strong> Jika kita bermain ayunan di taman atau bermain kartu, kita harus bergantian sesuai giliran. Tidak boleh ada yang menguasai mainan sendirian. Semua teman memiliki hak bermain yang sama rata.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2" />

                  <div className="p-3 border border-dashed border-emerald-400 bg-emerald-50/50 rounded-xl text-emerald-950 text-xs">
                    [Gambar: Lima simbol sila Pancasila yang dikelilingi oleh ilustrasi anak-anak yang sedang bermain bersama dengan gembira dan rukun]
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-slate-900">Ingat Poin Kunci Ini Sebelum Kuis:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                      <li><strong>Kerja sama/Kolaborasi</strong> = Sila ke-3 (Persatuan)</li>
                      <li><strong>Diskusi/Musyawarah</strong> = Sila ke-4 (Kerakyatan)</li>
                      <li><strong>Adil/Bergantian</strong> = Sila ke-5 (Keadilan)</li>
                      <li><strong>Membantu teman/Sopan</strong> = Sila ke-2 (Kemanusiaan)</li>
                      <li><strong>Ibadah/Toleransi</strong> = Sila ke-1 (Ketuhanan)</li>
                    </ul>
                  </div>

                  <p className="italic font-medium text-slate-700 pt-1">
                    *Sekarang, siapkan dirimu! Mari kita uji pemahamanmu dalam Kuis Tebak Sikap Pancasila saat Bermain!*
                  </p>
                </div>
              )}

              {/* Checkpoint 2 Content */}
              {isCp2 && (
                <div className="text-xs leading-relaxed space-y-3.5 text-slate-800">
                  <p>Halo, anak-anak hebat Kelas 3!</p>
                  <p>
                    Hari ini kita akan bermain bersama di lapangan sekolah dalam permainan kelompok bernama <strong>"Estafet Brondolan Sawit"</strong>.
                  </p>
                  <p>
                    Sebelum kita mulai, tahukah kamu bahwa bermain bersama teman adalah kesempatan emas untuk mengamalkan nilai-nilai luhur Pancasila? Supaya permainan kita seru, damai, dan semua merasa senang, yuk kita pelajari <strong>Tiga Sikap Pancasila</strong> yang harus kita tunjukkan hari ini:
                  </p>

                  <div className="space-y-2.5 pl-1">
                    <div>
                      <p className="font-bold text-slate-900">1. Tepat Waktu (Disiplin)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Mengapa ini penting?</strong> Menghargai waktu adalah bentuk menghargai teman. Jika kita terlambat datang ke lapangan, teman-teman lain harus menunggu lama dan waktu bermain kita menjadi berkurang.</li>
                        <li><strong>Sikap Pancasila:</strong> Begitu bel berbunyi atau guru memberi aba-aba, segeralah berbaris rapi di lapangan bersama kelompokmu.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">2. Gotong Royong (Kerja Sama)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Mengapa ini penting?</strong> Permainan kelompok tidak bisa dimenangkan sendirian. Kita harus saling membantu, bukan saling menyalahkan.</li>
                        <li><strong>Sikap Pancasila:</strong> Saling memberi semangat (misalnya berteriak, "Ayo, kamu bisa!"), membantu teman kelompok yang kesulitan membawa bola/kotak tanpa mengejeknya, membagi tugas dengan adil di dalam kelompok.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">3. Bermain Adil dan Jujur (Keadilan Sosial)</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                        <li><strong>Mengapa ini penting?</strong> Bermain jujur membuat semua orang merasa dihargai. Kemenangan hasil curang tidak akan terasa indah.</li>
                        <li><strong>Sikap Pancasila:</strong> Mengikuti aturan permainan dengan jujur (tidak mencuri start), menerima keputusan wasit dengan lapang dada, mengakui jika kelompok lain bermain lebih baik dan memberikan selamat.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2" />

                  <div className="p-3 border border-dashed border-emerald-400 bg-emerald-50/50 rounded-xl text-emerald-950 text-xs">
                    [Gambar: Tiga anak bekerja sama memindahkan kotak mainan dengan gembira di lapangan sekolah dekat kebun sawit]
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-slate-900">Aturan Singkat Permainan "Estafet Brondolan Sawit":</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2">
                      <li>Setiap kelompok berbaris lurus ke belakang.</li>
                      <li>Pemain paling depan mengambil satu bola (diibaratkan buah sawit) dari dalam keranjang.</li>
                      <li>Bola harus dipindahkan secara estafet (sambung-menyambung) lewat atas kepala ke teman di belakangnya sampai ke ujung.</li>
                      <li><strong>Ingat:</strong> Jika bola terjatuh, bola harus dikembalikan ke pemain paling depan dan diulang dengan jujur. Tidak boleh ada yang sengaja melempar bola ke belakang!</li>
                    </ul>
                  </div>

                  <p className="italic font-medium text-slate-700 pt-1">
                    *Mari kita tunjukkan bahwa anak-anak Kelas 3 adalah anak yang disiplin, kompak, dan adil! Selamat bermain!*
                  </p>
                </div>
              )}

              {/* Checkpoint 3 Content */}
              {isCp3 && (
                <div className="text-xs leading-relaxed space-y-3.5 text-slate-800">
                  <p>Halo, anak-anak hebat Kelas 3!</p>
                  <p>
                    Saat jam istirahat atau bermain di rumah, apakah kamu sudah menjadi teman yang baik? Di sekitar kita, seperti di lingkungan sekolah maupun di dekat perumahan karyawan kebun kelapa sawit tempat orang tua kita bekerja, bermain bersama adalah saat yang paling menyenangkan.
                  </p>
                  <p>
                    Namun, bermain bukan hanya soal menang atau kalah. Bermain adalah kesempatan emas untuk mengamalkan nilai-nilai Pancasila. Yuk, pelajari <strong>3 Langkah Menjadi Sahabat Pancasila</strong> saat bermain berikut ini sebelum kamu mengisi Lembar Refleksi nanti!
                  </p>

                  <div className="space-y-2.5 pl-1">
                    <div>
                      <p className="font-bold text-slate-900">1. Datang Tepat Waktu (Sila ke-2: Kemanusiaan yang Adil dan Beradab)</p>
                      <p className="text-slate-700 pl-2">Menghargai waktu teman adalah tanda kita menghormati mereka. Jika berjanji bermain jam 4 sore, datanglah tepat waktu. Jangan biarkan temanmu menunggu terlalu lama di lapangan.</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">2. Peduli Teman yang Belum Paham (Sila ke-3: Persatuan Indonesia)</p>
                      <p className="text-slate-700 pl-2">Dalam bermain, kadang ada teman yang belum paham aturan mainnya atau lambat belajar taktik game tersebut.</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-4">
                        <li><strong>Jangan:</strong> Mengejek atau meninggalkan mereka.</li>
                        <li><strong>Lakukan:</strong> Ajari mereka dengan sabar. Jelaskan aturan mainnya pelan-pelan sampai mereka paham. Kita bermain untuk kompak bersama, bukan pintar sendirian!</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">3. Berbagi dan Adil (Sila ke-5: Keadilan Sosial bagi Seluruh Rakyat Indonesia)</p>
                      <p className="text-slate-700 pl-2">Gunakan mainan secara bergantian. Jika ada teman yang tidak punya mainan, ajaklah mereka bergabung. Berikan pujian yang jujur jika temanmu melakukan hal hebat saat bermain.</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2" />

                  <div className="p-3 border border-dashed border-emerald-400 bg-emerald-50/50 rounded-xl text-emerald-950 text-xs">
                    [Gambar: Tiga anak tersenyum saling merangkul di lapangan sekolah, salah satunya memegang bola dan memberikan jempol kepada temannya]
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-slate-900">Pertanyaan untuk Refleksi Dirimu:</p>
                    <p className="text-slate-700">Sebelum mengisi lembar penilaian nanti, tanyakan ini pada hatimu:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-2 italic">
                      <li>*Apakah aku sudah datang bermain tepat waktu hari ini?*</li>
                      <li>*Apakah aku sudah membantu teman yang kesulitan memahami cara bermain?*</li>
                      <li>*Sudahkah aku mengucapkan terima kasih atau memuji kebaikan temanku hari ini?*</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Fallback for other checkpoints */}
              {!isCp1 && !isCp2 && !isCp3 && (
                <div className="text-xs leading-relaxed space-y-2 text-slate-800">
                  <p>Materi pembelajaran terstruktur untuk mendukung aktivitas <strong>{cp.title}</strong>.</p>
                  <p>Murid mempelajari konsep dasar, panduan kerja sama, dan pemahaman bermakna sebelum melaksanakan penugasan di kelas maupun di rumah.</p>
                </div>
              )}
            </div>

            {/* Bottom Button for Sumber Belajar */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSaveSumberBelajar}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>💾 Simpan ke Koleksi</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. LKPD ACTION ROW */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="font-bold text-slate-800 text-[11px] sm:text-xs w-36 shrink-0">
            2. LKPD
          </span>
          <button
            type="button"
            onClick={() => onToggleLkpd(cp.id)}
            className={`px-3.5 py-1.5 border rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              cp.lkpdStatus === 'created'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${cp.lkpdStatus === 'created' ? 'text-emerald-700' : 'text-rose-500'}`} />
            <span>{cp.lkpdStatus === 'created' ? '✓ LKPD Siap' : 'Buat LKPD'}</span>
          </button>
          <button
            type="button"
            onClick={() => onSkipSumber(cp.id)}
            className={`text-[11px] font-medium cursor-pointer transition-colors ${
              cp.lkpdStatus === 'skipped'
                ? 'text-slate-400 italic'
                : 'text-blue-600 hover:underline'
            }`}
          >
            {cp.lkpdStatus === 'skipped' ? 'Dilewati (aktivitas tanpa sumber)' : 'Lewati (aktivitas ini tanpa sumber)'}
          </button>
        </div>

        {/* EXPANDED LKPD CARD (FORMAT SESUAI bahandanlkpd.pdf) */}
        {cp.lkpdStatus === 'created' && (
          <div className="space-y-2.5 animate-fadeIn">
            {/* Status note */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <span className="text-slate-500">✎</span>
              <span>
                <strong>LKPD siap</strong> (Fase {phaseDisplay}) — berbasis Sumber Belajar. Bisa diedit. Ganti [Gambar: ...] dengan gambar asli sebelum cetak.
              </span>
            </div>

            {/* Content Sheet Box */}
            <div className="border border-blue-900/30 rounded-2xl p-5 sm:p-7 bg-white text-slate-800 shadow-2xs space-y-4 font-sans">
              
              {/* Kop LKPD */}
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  LEMBAR KERJA PESERTA DIDIK
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {isCp1 && 'LKPD — Kuis Tebak Sikap Pancasila saat Bermain'}
                  {isCp2 && 'LKPD — Observasi Kolaborasi Bermain Adil'}
                  {isCp3 && 'LKPD — Lembar Refleksi Sahabat Pancasila'}
                  {!isCp1 && !isCp2 && !isCp3 && `LKPD — Aktivitas: ${cp.title}`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  SD IT · {subjectDisplay} · {gradeDisplay}
                </p>
              </div>

              {/* Isian Identitas Murid */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
                  <div className="p-2 bg-slate-50 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Nama:</span>
                    <span className="text-slate-400 font-mono">...................................................</span>
                  </div>
                  <div className="p-2 bg-slate-50 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Kelas:</span>
                    <span className="text-slate-400 font-mono">...................................</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-300">
                  <div className="p-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">No. Absen:</span>
                    <span className="text-slate-400 font-mono">...................................................</span>
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Tanggal:</span>
                    <span className="text-slate-400 font-mono">...................................</span>
                  </div>
                </div>
              </div>

              {/* Tujuan Pembelajaran */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                <strong>Tujuan (TP):</strong> {tpDisplay}
              </div>

              {/* LKPD 1 BODY (KUIS MENJODOHKAN) */}
              {isCp1 && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-700 leading-relaxed">
                    Halo Sahabat Pancasila! Mari kita bermain kuis seru untuk menguji pemahamanmu tentang sikap hebat saat bermain bersama teman di sekitar rumah atau kebun sawit!
                  </p>

                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-slate-800">
                    <strong>Petunjuk:</strong> Bacalah setiap situasi bermain di bawah ini dengan saksama. Hubungkan situasi tersebut dengan simbol sila Pancasila yang tepat!
                  </div>

                  {/* Matching Rows */}
                  <div className="space-y-3 pt-1">
                    {[
                      {
                        situation: 'Bermain bentengan atau membuat mainan dari pelepah sawit dengan kompak dan bekerja sama tanpa pilih-pilih teman.',
                        target: 'Sila ke-3: Pohon Beringin (Persatuan)'
                      },
                      {
                        situation: 'Berkumpul untuk berdiskusi menentukan permainan yang akan dimainkan hari ini dan menerima hasil keputusan bersama.',
                        target: 'Sila ke-4: Kepala Banteng (Kerakyatan)'
                      },
                      {
                        situation: 'Bergantian menggunakan ayunan di taman secara adil dan tidak menguasai mainan sendirian.',
                        target: 'Sila ke-5: Padi dan Kapas (Keadilan)'
                      },
                      {
                        situation: 'Menyambut ramah teman yang terlambat karena membantu orang tua menjemur pakaian, serta membantu teman yang terjatuh.',
                        target: 'Sila ke-2: Rantai (Kemanusiaan)'
                      },
                      {
                        situation: 'Berhenti bermain sepak bola sejenak di lapangan dekat kantor kebun saat terdengar suara azan untuk menghormati teman beribadah.',
                        target: 'Sila ke-1: Bintang (Ketuhanan)'
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex-1 pr-2">
                          <p className="text-slate-800 leading-relaxed">{item.situation}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-slate-400" />
                          <span className="w-8 border-t-2 border-dashed border-slate-300" />
                          <span className="w-3 h-3 rounded-full bg-blue-600" />
                        </div>
                        <div className="w-48 sm:w-56 pl-2">
                          <p className="font-semibold text-blue-950 text-right">{item.target}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pertanyaan Tantangan */}
                  <div className="p-3.5 bg-yellow-50/70 border border-yellow-300 rounded-xl space-y-2">
                    <p className="font-bold text-slate-900">
                      Sekarang, jawablah pertanyaan tantangan sikap kolaboratif berikut berdasarkan panduan bermain hebat!
                    </p>
                    <p className="text-slate-800">
                      Mengapa kita harus bekerja sama secara kolaboratif (tidak memilih-milih teman) saat bermain kelompok seperti Bentengan atau membuat mainan dari pelepah sawit?
                    </p>
                    <div className="space-y-2 pt-1">
                      <div className="border-b border-slate-400 h-6" />
                      <div className="border-b border-slate-400 h-6" />
                      <div className="border-b border-slate-400 h-6" />
                    </div>
                  </div>

                  {/* Refleksi */}
                  <div className="space-y-2 pt-1">
                    <p className="font-bold text-slate-900">Refleksi</p>
                    <p className="text-slate-700">
                      Apakah kamu sudah menerapkan sikap bekerja sama (Sila ke-3) saat bermain bersama temanmu hari ini?
                    </p>
                    <p className="text-slate-700">
                      Sikap Pancasila apa yang ingin kamu perbaiki agar bermain menjadi lebih seru dan tidak ada yang menangis?
                    </p>
                    <div className="border-b border-slate-400 h-6" />
                  </div>

                  {/* Catatan Ayah/Bunda */}
                  <div className="p-3 border border-slate-300 rounded-xl bg-slate-50 space-y-1.5">
                    <p className="font-bold text-slate-900">Catatan Ayah/Bunda</p>
                    <div className="h-14 border border-dashed border-slate-300 rounded-lg bg-white" />
                  </div>
                </div>
              )}

              {/* LKPD 2 BODY (OBSERVASI & DIFERENSIASI LAPORAN) */}
              {isCp2 && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-700 leading-relaxed">
                    Halo anak hebat Kelas 3! Hari ini kita akan melakukan observasi mandiri dan kelompok saat bermain 'Estafet Brondolan Sawit'. Mari tunjukkan sikap Pancasila kita!
                  </p>
                  <p className="text-slate-700">
                    Amati dirimu dan teman kelompokmu selama bermain di lapangan. Isi lembar observasi ini dengan jujur berdasarkan panduan bermain adil yang sudah kita pelajari.
                  </p>

                  <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1 text-slate-800">
                    <p className="font-bold text-blue-950">Ingat Aturan Main!</p>
                    <p>Kita bermain 'Estafet Brondolan Sawit'. Ambil bola dari keranjang, oper lewat atas kepala. Jika bola jatuh, kembalikan ke depan dengan jujur! Jangan lupa tepat waktu, gotong royong, dan bermain adil.</p>
                  </div>

                  <div className="p-2.5 border border-dashed border-slate-300 rounded-lg text-slate-500 text-[11px]">
                    [Gambar: Tiga anak bekerja sama memindahkan kotak mainan dengan gembira di lapangan sekolah dekat kebun sawit]
                  </div>

                  {/* Mode Pilihan Pelaporan (Diferensiasi) */}
                  <div className="space-y-2">
                    <p className="font-bold text-slate-900">
                      Pilih salah satu cara kamu melaporkan hasil observasimu hari ini:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 border border-slate-300 rounded-xl bg-slate-50/70 space-y-1">
                        <p className="font-bold text-slate-900">Menulis &amp; Menggambar</p>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
                          <li>Menuliskan sikap adil yang kamu lakukan pada kolom tabel.</li>
                          <li>Menggambar perasaanmu setelah bermain jujur.</li>
                        </ul>
                      </div>
                      <div className="p-3 border border-slate-300 rounded-xl bg-slate-50/70 space-y-1">
                        <p className="font-bold text-slate-900">Bercerita Langsung</p>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
                          <li>Menceritakan hasil observasi sikap gotong royong kelompokmu langsung kepada guru atau orang tua yang membantu.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Tabel Observasi */}
                  <div className="overflow-x-auto border border-slate-300 rounded-xl">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                          <th className="p-2.5 border-r border-slate-300 text-left">Sikap Pancasila yang Diamati</th>
                          <th className="p-2.5 border-r border-slate-300 text-center w-36">Apakah Aku Melakukannya? (Ya / Belum)</th>
                          <th className="p-2.5 text-left w-48">Apa Bukti yang Aku Lakukan di Lapangan?</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 border-r border-slate-200 font-medium">Tepat Waktu (Segera berbaris rapi saat bel/aba-aba berbunyi)</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">☐ Ya &nbsp; ☐ Belum</td>
                          <td className="p-2.5 text-slate-400 italic text-[11px]">Tulis buktimu...</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                          <td className="p-2.5 border-r border-slate-200 font-medium">Gotong Royong (Memberi semangat atau membantu teman tanpa mengejek)</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">☐ Ya &nbsp; ☐ Belum</td>
                          <td className="p-2.5 text-slate-400 italic text-[11px]">Tulis buktimu...</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 border-r border-slate-200 font-medium">Bermain Adil (Mengikuti aturan oper bola, tidak mencuri start)</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">☐ Ya &nbsp; ☐ Belum</td>
                          <td className="p-2.5 text-slate-400 italic text-[11px]">Tulis buktimu...</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border-r border-slate-200 font-medium">Jujur &amp; Lapang Dada (Mengulang dari depan jika bola jatuh, menerima keputusan wasit)</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">☐ Ya &nbsp; ☐ Belum</td>
                          <td className="p-2.5 text-slate-400 italic text-[11px]">Tulis buktimu...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pertanyaan Kejadian Gotong Royong */}
                  <div className="space-y-1 pt-1">
                    <p className="font-bold text-slate-900">
                      Tuliskan satu kejadian gotong royong paling kompak yang dilakukan kelompokmu saat estafet tadi:
                    </p>
                    <div className="border-b border-slate-400 h-6" />
                    <div className="border-b border-slate-400 h-6" />
                  </div>

                  {/* Refleksi */}
                  <div className="space-y-1 pt-1">
                    <p className="font-bold text-slate-900">Refleksi</p>
                    <p className="text-slate-700">
                      Bagaimana perasaanmu ketika berhasil bermain dengan jujur dan adil tanpa curang?
                    </p>
                    <p className="text-slate-700">
                      Apa yang akan kamu perbaiki pada permainan berikutnya agar lebih tepat waktu?
                    </p>
                    <div className="border-b border-slate-400 h-6" />
                  </div>

                  {/* Catatan Ayah/Bunda */}
                  <div className="p-3 border border-slate-300 rounded-xl bg-slate-50 space-y-1.5">
                    <p className="font-bold text-slate-900">Catatan Ayah/Bunda</p>
                    <div className="h-12 border border-dashed border-slate-300 rounded-lg bg-white" />
                  </div>

                  {/* Bahan Gambar Guru */}
                  <div className="p-3 border border-amber-200 bg-amber-50/40 rounded-xl space-y-1 text-slate-800 text-[11px]">
                    <p className="font-bold text-amber-950 flex items-center gap-1">
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Bahan gambar yang perlu disiapkan guru</span>
                    </p>
                    <p className="pl-4">☐ Tiga anak bekerja sama memindahkan kotak mainan dengan gembira di lapangan sekolah dekat kebun sawit</p>
                  </div>
                </div>
              )}

              {/* LKPD 3 BODY (LEMBAR REFLEKSI SAHABAT PANCASILA & EMOTICON) */}
              {isCp3 && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-700 leading-relaxed">
                    Halo anak-anak hebat Kelas 3! Setelah bermain bersama teman di sekolah atau di lingkungan sekitar perumahan karyawan kebun kelapa sawit, mari kita ingat kembali sikap bermain kita. Apakah kita sudah menjadi Sahabat Pancasila yang hebat?
                  </p>

                  <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-slate-800">
                    <strong>Petunjuk:</strong> Bacalah setiap pernyataan di bawah ini. Berikan tanda centang (✔) pada kolom yang sesuai dengan apa yang benar-benar kamu lakukan saat bermain tadi!
                  </div>

                  {/* Tabel Ceklis Diri */}
                  <div className="overflow-x-auto border border-slate-300 rounded-xl">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                          <th className="p-2.5 border-r border-slate-300 text-left">Sikap Sahabat Pancasila saat Bermain</th>
                          <th className="p-2.5 border-r border-slate-300 text-center w-28">Sudah Kulakukan</th>
                          <th className="p-2.5 text-center w-28">Belum Kulakukan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 border-r border-slate-200 font-medium">
                            Aku datang bermain tepat waktu dan tidak membuat teman menunggu lama di lapangan (Sila ke-2)
                          </td>
                          <td className="p-2.5 border-r border-slate-200 text-center">☐</td>
                          <td className="p-2.5 text-center">☐</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                          <td className="p-2.5 border-r border-slate-200 font-medium">
                            Aku sabar mengajari teman yang belum paham aturan main dan tidak mengejeknya (Sila ke-3)
                          </td>
                          <td className="p-2.5 border-r border-slate-200 text-center">☐</td>
                          <td className="p-2.5 text-center">☐</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 border-r border-slate-200 font-medium">
                            Aku berbagi mainan atau memberikan pujian jujur saat temanku melakukan hal hebat (Sila ke-5)
                          </td>
                          <td className="p-2.5 border-r border-slate-200 text-center">☐</td>
                          <td className="p-2.5 text-center">☐</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Apresiasi Jujur Teman */}
                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-slate-900">
                      Sekarang, mari berikan apresiasi jujur kepada teman bermainmu hari ini!
                    </p>
                    <p className="text-slate-700">
                      Tuliskan nama satu teman bermainmu dan satu hal hebat atau kebaikan yang ia lakukan saat bermain bersama tadi:
                    </p>
                    <div className="border-b border-slate-400 h-6" />
                    <div className="border-b border-slate-400 h-6" />
                  </div>

                  {/* Rating Emoticon 5 Lingkaran */}
                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-slate-900">
                      Bagaimana perasaanmu setelah berhasil menerapkan nilai Pancasila dan saling menghargai bersama teman hari ini? Lingkari salah satu:
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      {[
                        { label: 'Sangat Sedih', symbol: '😢' },
                        { label: 'Kurang Puas', symbol: '🙁' },
                        { label: 'Biasa Saja', symbol: '😐' },
                        { label: 'Senang', symbol: '🙂' },
                        { label: 'Sangat Hebat', symbol: '😃' }
                      ].map((emo, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="w-10 h-10 rounded-full border-2 border-slate-400 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center text-lg transition-all shadow-2xs">
                            {emo.symbol}
                          </div>
                          <span className="text-[10px] text-slate-500 group-hover:text-slate-800">{emo.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Catatan Ayah/Bunda */}
                  <div className="p-3 border border-slate-300 rounded-xl bg-slate-50 space-y-1.5 pt-2">
                    <p className="font-bold text-slate-900">Catatan Ayah/Bunda</p>
                    <div className="h-12 border border-dashed border-slate-300 rounded-lg bg-white" />
                  </div>
                </div>
              )}

              {/* Fallback for other checkpoints */}
              {!isCp1 && !isCp2 && !isCp3 && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-700">
                    Lembar Kerja Peserta Didik untuk penguatan kompetensi {cp.title}. Kerjakan setiap instruksi secara mandiri atau bersama rekan kelompok.
                  </p>
                  <div className="p-3 border border-slate-300 rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-800 mb-1">Aktivitas Murid:</p>
                    <p className="text-slate-700">{cp.description}</p>
                  </div>
                  <div className="p-3 border border-slate-300 rounded-xl bg-slate-50">
                    <p className="font-bold text-slate-900">Catatan Ayah/Bunda</p>
                    <div className="h-12 border border-dashed border-slate-300 rounded-lg bg-white mt-1" />
                  </div>
                </div>
              )}
            </div>

            {/* THREE ACTION BUTTONS AT BOTTOM (SESUAI bahandanlkpd.pdf) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleSaveLkpd}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>💾 Simpan ke Koleksi</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDesignModal(true)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>🎨 Buat Desain LKPD</span>
              </button>

              <button
                type="button"
                onClick={handleCopyPromptAi}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>{copiedPrompt ? '✓ Tersalin!' : '📋 Prompt utk AI lain'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DESIGN LKPD MODAL */}
      {showDesignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-slate-900 text-sm">Studio Desain &amp; Tata Letak LKPD</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowDesignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Format lembar kerja untuk <strong>{cp.title}</strong> siap dicetak atau diunduh ke format media yang diinginkan:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div 
                onClick={() => {
                  window.print();
                  setShowDesignModal(false);
                }}
                className="p-3 border border-slate-200 rounded-xl hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer transition-all space-y-1"
              >
                <Printer className="w-4 h-4 text-purple-600" />
                <p className="font-bold text-slate-900">Cetak PDF / A4</p>
                <p className="text-[11px] text-slate-500">Tata letak siap cetak untuk murid di kelas.</p>
              </div>

              <div 
                onClick={() => {
                  handleCopyPromptAi();
                  setShowDesignModal(false);
                }}
                className="p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all space-y-1"
              >
                <Copy className="w-4 h-4 text-blue-600" />
                <p className="font-bold text-slate-900">Salin Prompt Visual</p>
                <p className="text-[11px] text-slate-500">Gunakan di Canva atau generator AI desain.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDesignModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
