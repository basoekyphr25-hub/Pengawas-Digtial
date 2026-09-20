import React, { useState } from 'react';
import { Bookmark, Printer, Sparkles, Copy, Check, Calendar, Users, Award, FileSpreadsheet } from 'lucide-react';

interface OfLearningProps {
  onSave: (title: string, data: any) => void;
  handlePrint: () => void;
}

export const OfLearningInstrument: React.FC<OfLearningProps> = ({ onSave, handlePrint }) => {
  const [selectedBentuk, setSelectedBentuk] = useState<string>('Projek');
  const [showAllForms, setShowAllForms] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<'peran_a' | 'peran_b'>('peran_a');
  
  // Interactive Logbook Table Rows
  const [logRows, setLogRows] = useState([
    {
      id: 1,
      hariTanggal: 'Senin, 12 Mei 2026',
      namaTeman: 'Budi Santoso',
      materi: 'Iqra Jilid 3, Hal. 15',
      catatanSikap: 'Saling menyimak dengan sabar, Budi berhasil membedakan huruf Jim dan Kha.',
      paraf: 'Ust. Ahmad ✓'
    },
    {
      id: 2,
      hariTanggal: 'Rabu, 14 Mei 2026',
      namaTeman: 'Budi Santoso & Farhan',
      materi: 'Iqra Jilid 3, Hal. 17',
      catatanSikap: 'Farhan memberikan koreksi yang sangat santun ketika harakat kasrah terlewat.',
      paraf: 'Ust. Ahmad ✓'
    },
    {
      id: 3,
      hariTanggal: 'Jumat, 16 Mei 2026',
      namaTeman: 'Kelompok Surau Al-Ittihad',
      materi: 'Surah Al-Kafirun bersama-sama',
      catatanSikap: 'Semua anggota kompak melantunkan ayat secara tartil dan merapikan rehal surau.',
      paraf: 'Ust. Fauzi ✓'
    }
  ]);

  const [pengalamanKesan, setPengalamanKesan] = useState<string>(
    'Pengalaman paling berkesan adalah ketika melihat teman saya tersenyum bangga karena akhirnya lancar membaca satu halaman penuh tanpa tersendat, dan kami saling bertepuk tangan pelan di teras surau.'
  );
  const [solusiTantangan, setSolusiTantangan] = useState<string>(
    'Ketika ada teman yang sempat putus asa, kami berhenti sejenak, mengambil wudhu bersama, dan membaca ta\'awudz hingga hatinya tenang kembali.'
  );
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const copySumberBelajar = () => {
    const text = `Sumber Belajar — Menjadi Sahabat Al-Quran: Panduan Bakti Mengaji di Surau Kampar...`;
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleUpdateLogRow = (id: number, field: string, value: string) => {
    setLogRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="border border-amber-300 rounded-3xl p-5 sm:p-7 space-y-6 bg-white shadow-2xs">
      {/* Top Filter Bar Sesuai kembangko.pdf */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-950">
            Bentuk as &amp; of di bawah sudah disaring sesuai prinsipnya.
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-amber-900 font-medium">
            <input
              type="checkbox"
              checked={showAllForms}
              onChange={(e) => setShowAllForms(e.target.checked)}
              className="rounded border-amber-300 text-amber-700 focus:ring-amber-500"
            />
            <span>tampilkan semua bentuk</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBentuk}
            onChange={(e) => setSelectedBentuk(e.target.value)}
            className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-amber-900 font-bold text-xs"
          >
            <option value="Projek">Projek (Portofolio Bakti)</option>
            {showAllForms && (
              <>
                <option value="Unjuk Kerja">Unjuk Kerja / Praktik Nyata</option>
                <option value="Tes Lisan">Tes Lisan / Wawancara</option>
                <option value="Gelar Karya">Gelar Karya &amp; Pameran</option>
              </>
            )}
          </select>
          <span className="px-2.5 py-1 bg-amber-600 text-white font-bold text-[10px] rounded-lg uppercase tracking-wider">
            OF LEARNING
          </span>
          <button
            type="button"
            className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-semibold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            Buat
          </button>
        </div>
      </div>

      {/* Status Callout Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>✎</span>
          <span>
            <strong>of learning siap</strong> — bisa diedit. Akan jadi <em>Lampiran Asesmen</em> di dokumen modul.
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSave('Spesifikasi Of Learning', { selectedBentuk })}
          className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-white border border-amber-300 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-amber-100"
        >
          <Bookmark className="w-3 h-3" />
          <span>Simpan ke Koleksi</span>
        </button>
      </div>

      {/* Main Title Specification Card */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
            <span>Instrumen Of Learning (Sumatif)</span>
            <span>•</span>
            <span>{selectedBentuk}</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-serif mt-1">
            Portofolio Bakti Mengaji: Kolaborasi Syiar Al-Quran di Surau Kampar
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Mengukur ketercapaian akhir murid dalam mendemonstrasikan keimanan nyata dan kecakapan berkolaborasi membangun ekosistem mengaji di Surau Kampar.
          </p>
        </div>

        {/* 5 Rincian Asesmen Sesuai kembangko.pdf */}
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <strong className="text-slate-900 font-bold block text-xs">1. Tujuan Asesmen</strong>
            <p className="text-slate-600">
              Mengukur pencapaian akhir peserta didik pada fase pembelajaran projek dalam menunjukkan karakter beriman, bertakwa kepada Tuhan Yang Maha Esa (ibadah &amp; cinta Al-Quran) serta kemampuan berkolaborasi secara nyata (peduli &amp; kerja sama) di surau atau MDA terdekat selama periode projek berlangsung.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <strong className="text-slate-900 font-bold block text-xs">2. Langkah Asesmen</strong>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Tahap Persiapan:</strong> Membentuk tim Sahabat Mengaji dan mengonfirmasi jadwal ke ustadz/ustadzah surau.</li>
              <li><strong>Tahap Pelaksanaan:</strong> Menjalankan sesi mengaji kolaboratif minimal 4–6 kali pertemuan secara rutin.</li>
              <li><strong>Tahap Pengumpulan Bukti:</strong> Mengisi logbook jurnal bakti, dokumentasi paraf ustadz, dan refleksi akhir.</li>
              <li><strong>Tahap Penilaian Akhir:</strong> Konferensi tiga arah (murid, guru, dan ustadz mitra) untuk menentukan ketercapaian DPL.</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-2">
            <strong className="text-amber-950 font-bold block text-xs">3. Kriteria Asesmen Of Learning (Rubrik 4 Jenjang)</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-900">
              <div className="p-2.5 bg-white border border-amber-200 rounded-xl">
                <strong className="text-rose-700 block">Mulai Berkembang (MB)</strong>
                <p className="mt-0.5">Hadir di surau namun peran kolaborasinya masih pasif dan logbook belum terisi lengkap tanpa bimbingan intensif.</p>
              </div>
              <div className="p-2.5 bg-white border border-amber-200 rounded-xl">
                <strong className="text-amber-700 block">Sedang Berkembang (SB)</strong>
                <p className="mt-0.5">Menjalankan peran sahabat mengaji secara berkala, mampu menyimak teman dengan baik dengan arahan berkala dari ustadz.</p>
              </div>
              <div className="p-2.5 bg-white border border-amber-200 rounded-xl">
                <strong className="text-sky-700 block">Cakap / Sesuai Harapan (BSH)</strong>
                <p className="mt-0.5">Menunjukkan komitmen tinggi, aktif menyimak atau menyetor bacaan, menjaga adab santun, dan portofolio logbook terverifikasi penuh.</p>
              </div>
              <div className="p-2.5 bg-white border border-amber-200 rounded-xl">
                <strong className="text-emerald-700 block">Sangat Berkembang (SAB)</strong>
                <p className="mt-0.5">Menggerakkan teman sebaya di kampung untuk ikut meramaikan surau, menunjukkan keteladanan akhlak, dan menjadi inspirator ukhuwah.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <strong className="text-slate-900 font-bold block text-xs">4. Penerapan Prinsip APM</strong>
              <p className="text-[11px] text-slate-600">
                <strong>Berkeadilan &amp; Objektif:</strong> Penilaian melihat proses perjuangan dan kemajuan nyata tiap murid berdasarkan titik awal kemampuannya, bukan membanding-bandingkan hasil akhir.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <strong className="text-slate-900 font-bold block text-xs">5. Penyesuaian Diferensiasi</strong>
              <p className="text-[11px] text-slate-600">
                <strong>Kesiapan Belajar &amp; Minat:</strong> Murid bebas memilih peran sebagai <em>Sahabat Penyimak</em> atau <em>Sahabat Belajar</em>, maupun kontribusi merapikan fasilitas surau.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUMBER BELAJAR OF LEARNING */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              1. SUMBER BELAJAR (OF LEARNING)
            </span>
            <span className="text-[11px] text-slate-500">• Teks Prosedur &amp; Panduan Bakti Mengaji</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copySumberBelajar}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedText ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSave('Sumber Belajar Of Learning', {})}
              className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3 h-3" />
              <span>Simpan ke Koleksi</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
          ✎ Sumber Belajar siap (Teks Prosedur/Panduan Langkah) — bisa diedit. LKPD akan dibuat dari isi ini.
        </div>

        {/* Box Sumber Belajar Of Learning */}
        <div className="border border-amber-400 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="bg-[#92400e] text-white p-4 sm:p-5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              SUMBER BELAJAR · TEKS PROSEDUR / PANDUAN LANGKAH (SD IT)
            </span>
            <h5 className="text-sm sm:text-base font-bold text-white font-serif">
              Menjadi Sahabat Al-Quran: Panduan Bakti Mengaji di Surau Kampar
            </h5>
            <p className="text-xs text-amber-100 font-light">
              Menghidupkan Falsafah Luhur Kampar: "Tali Bapilin Tigo, Basandi Syarak, Syarak Basandi Kitabullah"
            </p>
          </div>

          <div className="p-5 sm:p-6 text-xs text-slate-700 space-y-4 leading-relaxed bg-[#fffdfa]">
            <div className="space-y-1.5">
              <strong className="text-slate-900 block text-sm font-serif text-[#92400e]">
                Surau dan MDA adalah Jantung Hati Masyarakat Kampar
              </strong>
              <p>
                Bagi masyarakat adat Kampar, surau bukan hanya tempat sujud menunaikan salat lima waktu. Sejak dahulu, pemuda dan anak-anak Kampar berkumpul di surau untuk belajar akhlak, mengaji Al-Quran, dan memperkuat tali persaudaraan. Melalui projek <strong>Bakti Mengaji</strong> ini, kita mengembalikan tradisi mulia tersebut ke tengah kampung kita.
              </p>
            </div>

            {/* Ilustrasi Of Learning */}
            <div className="p-4 bg-amber-50/60 border border-dashed border-amber-300 rounded-2xl text-center space-y-1">
              <span className="text-lg">🕌🤝📜</span>
              <p className="text-[11px] font-semibold text-amber-900">
                [GAMBAR ILUSTRASI: Dua orang anak duduk berdampingan di atas sajadah surau, membuka mushaf Al-Quran bersama dengan wajah tersenyum bahagia disaksikan oleh ustadz sepuh yang bijaksana]
              </p>
              <p className="text-[10px] text-amber-700">
                Menggambarkan keberlanjutan tradisi mengaji lintas generasi di tanah Kampar.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <strong className="text-slate-900 block text-xs sm:text-sm font-bold text-[#92400e]">
                4 Langkah Aksi Nyata Bakti Mengaji:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Langkah 1: Sowan ke Guru Ngaji (Ustadz Surau)</span>
                  <p className="text-[11px] text-slate-600">
                    Datanglah bersama teman dengan adab sopan. Cium tangan ustadz/ustadzah dan sampaikan niat tulus untuk mengaji bersama secara berpasangan.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Langkah 2: Bentuk 'Kelompok Sahabat Mengaji'</span>
                  <p className="text-[11px] text-slate-600">
                    Bentuk tim kecil 2–3 orang. Pastikan tidak ada teman yang merasa sendirian atau tersisih karena belum lancar membaca.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Langkah 3: Atur Jadwal Mengaji Rutin</span>
                  <p className="text-[11px] text-slate-600">
                    Tentukan hari pertemuan minimal 2 kali sepekan (misal: Senin dan Kamis ba'da Magrib) dan tepati waktu dengan disiplin.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Langkah 4: Catat Jurnal Bakti Mengaji</span>
                  <p className="text-[11px] text-slate-600">
                    Catat kemajuan membaca, nama surah/halaman, sikap baik yang dipraktikkan, dan mintalah paraf ustadz sebagai bukti autentik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LKPD OF LEARNING (DESAIN LKPD SIAP) */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              2. LKPD — PORTOFOLIO BAKTI MENGAJI
            </span>
            <span className="text-[11px] text-slate-500">• Lembar Jurnal &amp; Logbook Projek</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF LKPD</span>
            </button>
            <button
              type="button"
              onClick={() => onSave('LKPD Of Learning - Portofolio Bakti Mengaji', { selectedRole, logRows, pengalamanKesan })}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#92400e] hover:bg-[#78350f] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan LKPD</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-xl text-[11px] text-slate-700">
          ✎ <strong>LKPD Siap (Fase B · Halaman 21-23 PDF):</strong> Logbook autentik kolaborasi syiar mengaji, memuat pemilihan peran, tabel jejak pertemuan, dan lembar pengesahan tiga pihak.
        </div>

        {/* Desain LKPD Siap Box */}
        <div className="border-2 border-amber-300 rounded-3xl overflow-hidden bg-white shadow-xs">
          {/* LKPD Header Bar */}
          <div className="bg-[#92400e] text-white p-5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-amber-200 uppercase tracking-wider font-semibold">
              <span>LEMBAR KERJA PESERTA DIDIK (LKPD) · OF LEARNING</span>
              <span>PORTOFOLIO AKSI NYATA · FASE B</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
              <span>📜 Portofolio Bakti Mengaji</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-800 text-amber-200 font-sans font-normal">
                Kolaborasi Syiar Al-Quran di Surau Kampar
              </span>
            </h4>
            <p className="text-xs text-amber-100">
              Penguatan Delapan Profil Lulusan: Keimanan &amp; Ketakwaan terhadap Tuhan YME dan Kolaborasi Nyata
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 leading-relaxed">
            {/* Form Identitas */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Nama Murid</span>
                <input 
                  type="text" 
                  defaultValue="Muhammad Fatih"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Kelas / Fase</span>
                <input 
                  type="text" 
                  defaultValue="Kelas 4 (Fase B)"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Surau / MDA Mitra</span>
                <input 
                  type="text" 
                  defaultValue="Surau Al-Ittihad, Kec. Tambang"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Ustadz Pendamping</span>
                <input 
                  type="text" 
                  defaultValue="Ust. Ahmad Yani"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Aktivitas 1: Pilihan Peran Murid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#92400e] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Pilihan Peran Utama dalam Bakti Mengaji
                </strong>
              </div>
              <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedRole('peran_a')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedRole === 'peran_a' ? 'border-[#92400e] bg-amber-50/60 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-xs">Peran A: Sahabat Penyimak (Tutor Sebaya)</strong>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedRole === 'peran_a' ? 'border-[#92400e] bg-[#92400e]' : 'border-slate-300'
                    }`}>
                      {selectedRole === 'peran_a' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Bertugas menyimak bacaan sahabat, menjaga adab santun, memberikan koreksi lembut, dan menyemangati teman agar semakin lancar.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedRole('peran_b')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedRole === 'peran_b' ? 'border-[#92400e] bg-amber-50/60 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-xs">Peran B: Sahabat Belajar (Murid Bertekun)</strong>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedRole === 'peran_b' ? 'border-[#92400e] bg-[#92400e]' : 'border-slate-300'
                    }`}>
                      {selectedRole === 'peran_b' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Bertugas menyiapkan diri dengan wudhu yang baik, berani membaca di hadapan sahabat, serta menerima masukan dengan hati gembira.
                  </p>
                </div>
              </div>
            </div>

            {/* Aktivitas 2: Tabel Jurnal Logbook Bakti Mengaji */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#92400e] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900">
                    Tabel Jurnal Bakti Mengaji di Surau (Logbook Autentik)
                  </strong>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Klik sel teks untuk memperbarui log</span>
              </div>

              <div className="pl-8 overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden border-collapse">
                  <thead>
                    <tr className="bg-amber-100/80 text-amber-950 font-bold border-b border-amber-200">
                      <th className="p-2.5 w-1/5 min-w-[120px]">Hari &amp; Tanggal</th>
                      <th className="p-2.5 w-1/5 min-w-[120px]">Nama Teman Belajar</th>
                      <th className="p-2.5 w-1/5 min-w-[130px]">Materi (Surah / Halaman)</th>
                      <th className="p-2.5 w-2/5 min-w-[200px]">Catatan Sikap &amp; Kemajuan</th>
                      <th className="p-2.5 w-1/5 min-w-[100px] text-center">Paraf Ustadz</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {logRows.map((row) => (
                      <tr key={row.id} className="hover:bg-amber-50/30">
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.hariTanggal}
                            onChange={(e) => handleUpdateLogRow(row.id, 'hariTanggal', e.target.value)}
                            className="w-full p-1.5 bg-transparent border border-transparent hover:border-slate-300 rounded font-medium text-slate-800"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.namaTeman}
                            onChange={(e) => handleUpdateLogRow(row.id, 'namaTeman', e.target.value)}
                            className="w-full p-1.5 bg-transparent border border-transparent hover:border-slate-300 rounded font-semibold text-slate-900"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.materi}
                            onChange={(e) => handleUpdateLogRow(row.id, 'materi', e.target.value)}
                            className="w-full p-1.5 bg-transparent border border-transparent hover:border-slate-300 rounded text-slate-700"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.catatanSikap}
                            onChange={(e) => handleUpdateLogRow(row.id, 'catatanSikap', e.target.value)}
                            className="w-full p-1.5 bg-transparent border border-transparent hover:border-slate-300 rounded text-slate-700"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-serif font-bold text-xs rounded border border-emerald-200">
                            {row.paraf}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aktivitas 3: Refleksi & Evaluasi Projek */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#92400e] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Refleksi Akhir &amp; Pengalaman Kolaborasi
                </strong>
              </div>
              <div className="pl-8 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    (a) Ceritakan satu pengalaman yang paling berkesan saat kamu mengaji bersama sahabatmu di surau:
                  </label>
                  <textarea
                    rows={2}
                    value={pengalamanKesan}
                    onChange={(e) => setPengalamanKesan(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    (b) Apa kesulitan yang sempat kalian hadapi bersama dan bagaimana cara kalian menyelesaikannya secara rukun?
                  </label>
                  <textarea
                    rows={2}
                    value={solusiTantangan}
                    onChange={(e) => setSolusiTantangan(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Kolom Pengesahan Tiga Pihak (Authentic Assessment Verification) */}
            <div className="pt-4 border-t border-slate-200">
              <span className="font-bold text-slate-900 text-xs block mb-3">
                Lembar Pengesahan Capaian Portofolio Bakti Mengaji:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <span className="text-[11px] font-semibold text-slate-500 block">Peserta Didik (Pembuat)</span>
                  <div className="pt-6 border-b border-slate-300 w-3/4 mx-auto" />
                  <strong className="text-slate-900 block text-xs">Muhammad Fatih</strong>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <span className="text-[11px] font-semibold text-slate-500 block">Orang Tua / Wali Murid</span>
                  <div className="pt-6 border-b border-slate-300 w-3/4 mx-auto" />
                  <strong className="text-slate-900 block text-xs">H. Hendra Saputra</strong>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <span className="text-[11px] font-semibold text-slate-500 block">Guru / Ustadz Surau Mitra</span>
                  <div className="pt-6 border-b border-slate-300 w-3/4 mx-auto" />
                  <strong className="text-slate-900 block text-xs">Ust. Ahmad Yani, S.Pd.I</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
