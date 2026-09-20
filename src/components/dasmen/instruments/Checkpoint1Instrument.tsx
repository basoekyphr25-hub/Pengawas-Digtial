import React, { useState } from 'react';
import { Bookmark, Printer, Sparkles, Check, CheckCircle2, Copy } from 'lucide-react';

interface Checkpoint1Props {
  onSave: (title: string, data: any) => void;
  handlePrint: () => void;
}

export const Checkpoint1Instrument: React.FC<Checkpoint1Props> = ({ onSave, handlePrint }) => {
  const [selectedKelompok, setSelectedKelompok] = useState<string>('iqra_dasar');
  const [matchedPairs, setMatchedPairs] = useState<{ [key: string]: string }>({
    'menghargai': 'tidak_mengejek',
    'menawarkan': 'bertanya_sopan',
    'menerima': 'senyum_terima_kasih'
  });
  const [temanBelajar, setTemanBelajar] = useState<string>('Ahmad & Siti (Teman di Surau)');
  const [kalimatAjak, setKalimatAjak] = useState<string>('Assalamu\'alaikum sahabatku, bolehkah kita membaca Iqra bersama sore ini agar semakin lancar?');
  const [refleksi1, setRefleksi1] = useState<string>('Saya merasa tenang dan senang karena tidak perlu malu saat belajar dari huruf dasar bersama teman.');
  const [showDesainLkpd, setShowDesainLkpd] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const copySumberBelajar = () => {
    const text = `SUMBER BELAJAR: Menjadi Sahabat Al-Quran: Jujur Memetakan Diri, Saling Membantu di Surau Kampar...`;
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 bg-white shadow-2xs">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-xs uppercase px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md">
            CHECKPOINT 1
          </span>
          <span className="text-xs font-bold text-blue-700">Memahami</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
          Teknik: Observasi Partisipatif
        </span>
      </div>

      <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
        <p className="font-bold text-slate-900 text-sm">
          Deteksi Awal &amp; Teman Belajar (Tutor Sebaya di Surau)
        </p>
        <p className="text-slate-600">
          Guru mengobservasi kepekaan sosial murid saat memetakan kemampuan membaca Al-Quran diri sendiri secara jujur dan kesediaan mereka berkolaborasi membentuk kelompok tutor sebaya bersama ustadz/ustadzah mitra MDA.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUMBER BELAJAR DETIL */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">1. SUMBER BELAJAR</span>
            <span className="text-[11px] text-slate-500">• Teks Panduan &amp; Informasi Budaya Surau</span>
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
              onClick={() => onSave('Sumber Belajar Checkpoint 1', {})}
              className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3 h-3" />
              <span>Simpan ke Koleksi</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-medium">
          ✓ Narasi Sumber Belajar Lengkap · Berakar pada kearifan lokal Surau Kampar &amp; penguatan karakter DPL.
        </div>

        {/* Rich Sumber Belajar Box */}
        <div className="border border-emerald-300 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="bg-[#14532d] text-white p-4 sm:p-5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              SUMBER BELAJAR · TEKS PANDUAN DAN INFORMASI (SD/SD IT)
            </span>
            <h5 className="text-sm sm:text-base font-bold text-white font-serif">
              Menjadi Sahabat Al-Quran: Jujur Memetakan Diri, Saling Membantu di Surau Kampar
            </h5>
            <p className="text-xs text-emerald-100 font-light">
              Fokus Dimensi: Keimanan &amp; Ketakwaan terhadap Tuhan YME dan Kolaborasi (Peduli &amp; Kerja Sama)
            </p>
          </div>

          <div className="p-5 sm:p-6 text-xs text-slate-700 space-y-4 leading-relaxed bg-[#fcfdfd]">
            {/* Bagian 1 */}
            <div className="space-y-1.5">
              <strong className="text-slate-900 block text-sm font-serif text-[#0f2942]">
                Mari Bergema di Surau Kita!
              </strong>
              <p>
                Di negeri Kampar yang berjuluk <em>Bumi Serambi Mekkah</em>, surau dan masjid panggung adalah jantung kehidupan desa kita sejak zaman datuk dan nenek moyang. Setiap kali matahari terbenam dan beduk Magrib bertalu-talu, anak-anak berduyun-duyun datang membawa suluh pelita atau senter kecil, melangkahkan kaki dengan gembira menuju teras surau.
              </p>
              <p>
                Namun saat ini, guru dan orang tua mendapati bahwa tidak semua sahabat kita memiliki kemudahan yang sama. Ada teman yang sudah lancar membaca mushaf dengan irama merdu, tetapi ada pula sahabat karib kita yang masih terbata-bata mengeja huruf hijaiyah tunggal, merasa malu, bahkan takut ditertawakan.
              </p>
            </div>

            {/* Placeholder Gambar Visual Sesuai Dokumen */}
            <div className="p-4 bg-emerald-50/50 border border-dashed border-emerald-300 rounded-2xl text-center space-y-1">
              <span className="text-lg">🕌📖✨</span>
              <p className="text-[11px] font-semibold text-emerald-900">
                [GAMBAR ILUSTRASI: Murid-murid Fase B duduk melingkar bersila di atas karpet hijau surau kayu, membuka buku Iqra dan mushaf Al-Quran dengan senyum hangat bersama Ustadz MDA]
              </p>
              <p className="text-[10px] text-emerald-700">
                Gambar visual memancarkan suasana inklusif tanpa sekat perbedaan kemampuan membaca.
              </p>
            </div>

            {/* Langkah 1 */}
            <div className="space-y-2 pt-1">
              <strong className="text-slate-900 block text-xs sm:text-sm font-bold text-[#0f2942]">
                Langkah 1: Deteksi Awal (Melihat Kemampuan Diri dengan Jujur)
              </strong>
              <p>
                Rasulullah SAW bersabda bahwa orang yang membaca Al-Quran dengan terbata-bata dan bersusah payah mempelajarinya, ia justru mendapatkan <strong>dua pahala</strong>: pahala membacanya dan pahala atas kesungguhannya. Oleh karena itu, kita tidak boleh merasa rendah diri ataupun menyombongkan diri. Mari kita kenali kemampuan kita:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-950 block text-xs">1. Kelompok Iqra Dasar</span>
                  <p className="text-[11px] text-slate-600">
                    Bagi sahabat yang sedang tekun mengenali bentuk huruf hijaiyah tunggal (Alif sampai Ya) serta tanda baca dasar Fathah, Kasrah, dan Dhammah (Iqra 1–3).
                  </p>
                </div>
                <div className="p-3 bg-sky-50/60 border border-sky-200 rounded-xl space-y-1">
                  <span className="font-bold text-sky-950 block text-xs">2. Kelompok Iqra Lanjutan</span>
                  <p className="text-[11px] text-slate-600">
                    Bagi sahabat yang mulai belajar merangkai kata pendek, mengenal bacaan panjang (Mad), tanwin, sukun, dan tasydid sederhana (Iqra 4–6).
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-950 block text-xs">3. Kelompok Al-Quran</span>
                  <p className="text-[11px] text-slate-600">
                    Bagi sahabat yang telah lancar membaca ayat-ayat Al-Quran/Juz 'Amma dengan makhraj yang baik, dan berjiwa mulia siap menjadi <em>Tutor Sebaya</em>.
                  </p>
                </div>
              </div>
            </div>

            {/* Langkah 2 */}
            <div className="space-y-2 pt-1">
              <strong className="text-slate-900 block text-xs sm:text-sm font-bold text-[#0f2942]">
                Langkah 2: Menjadi "Teman Belajar" (Kolaborasi Berkah di Surau &amp; MDA)
              </strong>
              <p>
                Belajar Al-Quran adalah ibadah yang paling indah ketika dikerjakan bersama. Di surau, kita mempraktikkan 3 Sikap Mulia Pelajar Pancasila:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>
                  <strong>Saling Menghargai:</strong> Mendengarkan sahabat membaca tanpa mencela, tidak memotong di tengah kalimat, dan menghargai setiap usaha sekecil apa pun.
                </li>
                <li>
                  <strong>Menawarkan Bantuan dengan Santun:</strong> Mengajak teman dengan tutur kata lemah lembut: <em>"Sahabatku, bolehkah kita menyimak huruf ini bersama?"</em>.
                </li>
                <li>
                  <strong>Menerima Bantuan dengan Gembira:</strong> Bersyukur saat dikoreksi, tersenyum, dan mengucapkan <em>Jazakallahu khairan</em> (terima kasih banyak).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LKPD DETIL & LENGKAP */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">2. LEMBAR KERJA PESERTA DIDIK (LKPD)</span>
            <span className="text-[11px] text-slate-500">• Lembar Interaktif Siap Cetak</span>
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
              onClick={() => onSave('LKPD Checkpoint 1', { selectedKelompok, temanBelajar, refleksi1 })}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0f2942] hover:bg-[#1a3a5a] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan LKPD</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-xl text-[11px] text-slate-700">
          ✎ <strong>LKPD Siap (Fase B · Kelas 3-4):</strong> Mengukur pemetaan jujur, sikap kolaboratif, dan refleksi awal. Dilengkapi kotak isian interaktif.
        </div>

        {/* Lembar Kerja Peserta Didik Card Container */}
        <div className="border-2 border-slate-300 rounded-3xl overflow-hidden bg-white shadow-xs">
          {/* LKPD Header Bar */}
          <div className="bg-[#0f2942] text-white p-5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-sky-200 uppercase tracking-wider font-semibold">
              <span>LEMBAR KERJA PESERTA DIDIK (LKPD)</span>
              <span>FASE B · KOKURIKULER DPL</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-serif">
              Deteksi Awal &amp; Teman Belajar di Surau Kampar
            </h4>
            <p className="text-xs text-slate-300">
              Tema Projek: Gema Al-Quran di Surau Kampar · Penguatan Keimanan &amp; Kolaborasi
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 leading-relaxed">
            {/* Student Identity Grid */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Nama Murid</span>
                <input 
                  type="text" 
                  defaultValue="Muhammad Fatih"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Kelas / Fase</span>
                <input 
                  type="text" 
                  defaultValue="Kelas 4 (Fase B)"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">No. Absen</span>
                <input 
                  type="text" 
                  defaultValue="18"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Hari / Tanggal</span>
                <input 
                  type="text" 
                  defaultValue="Senin, 12 Mei 2026"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Aktivitas 1: Deteksi Awal */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f2942] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Langkah 1: Deteksi Awal Kemampuan Membaca (Pilih dengan Jujur)
                </strong>
              </div>
              <p className="text-slate-600 pl-8 text-[11px]">
                Centanglah satu kartu kelompok di bawah ini yang paling mencerminkan tahap membacamu saat ini. Ingat, kejujuran adalah akhlak mulia yang dicintai Allah SWT:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-8">
                {[
                  {
                    id: 'iqra_dasar',
                    title: 'Kelompok Iqra Dasar',
                    sub: 'Iqra 1–3',
                    desc: 'Sedang tekun mengenal huruf hijaiyah tunggal & harakat dasar (Fathah, Kasrah, Dhammah).'
                  },
                  {
                    id: 'iqra_lanjutan',
                    title: 'Kelompok Iqra Lanjutan',
                    sub: 'Iqra 4–6',
                    desc: 'Mulai merangkai kata, mengenal mad (panjang), tanwin, sukun, dan waqaf sederhana.'
                  },
                  {
                    id: 'al_quran',
                    title: 'Kelompok Al-Quran',
                    sub: 'Juz 1–30 / Juz \'Amma',
                    desc: 'Sudah lancar membaca mushaf Al-Quran dengan tajwid baik dan siap menjadi Sahabat Tutor Sebaya.'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedKelompok(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                      selectedKelompok === item.id
                        ? 'border-[#0f2942] bg-[#f0f6fc] shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedKelompok === item.id ? 'border-[#0f2942] bg-[#0f2942]' : 'border-slate-300'
                      }`}>
                        {selectedKelompok === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200/70 rounded text-slate-800 inline-block">
                      {item.sub}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aktivitas 2: Menjodohkan Sikap Mulia */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f2942] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Langkah 2: Hubungkan Sikap Mulia dengan Contoh Tindakan yang Sesuai
                </strong>
              </div>
              <p className="text-slate-600 pl-8 text-[11px]">
                Tarik garis lurus antara sikap di sebelah kiri dengan cerminan perbuatan terpuji di surau di sebelah kanan:
              </p>

              <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Sikap Mulia Peserta Didik
                  </span>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>A. Saling Menghargai</span>
                    <span className="text-blue-600 text-xs font-mono">● ───→ (3)</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>B. Menawarkan Bantuan</span>
                    <span className="text-blue-600 text-xs font-mono">● ───→ (1)</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>C. Menerima dengan Senang Hati</span>
                    <span className="text-blue-600 text-xs font-mono">● ───→ (2)</span>
                  </div>
                </div>

                <div className="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Contoh Tindakan Nyata di Surau
                  </span>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs">
                    <strong>(1)</strong> Bertanya santun: <em>"Bolehkah aku duduk di sampingmu dan kita belajar bersama?"</em>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs">
                    <strong>(2)</strong> Menyambut teman dengan senyuman tulus dan mengucapkan <em>Jazakallahu khairan</em>.
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs">
                    <strong>(3)</strong> Tetap tenang menyimak dan tidak mengejek saat teman tersendat membaca huruf.
                  </div>
                </div>
              </div>
            </div>

            {/* Aktivitas 3: Rencana Teman Belajar & Kalimat Santun */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f2942] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Langkah 3: Menentukan Teman Belajar &amp; Kalimat Ajakan yang Santun
                </strong>
              </div>
              <div className="pl-8 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Tuliskan nama sahabat yang ingin kamu ajak bekerja sama belajar di surau/MDA:
                  </label>
                  <input
                    type="text"
                    value={temanBelajar}
                    onChange={(e) => setTemanBelajar(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                    placeholder="Contoh: Rahmat dan Zaki"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Tuliskan kalimat santun yang akan kamu ucapkan saat mengajak temanmu belajar bersama:
                  </label>
                  <textarea
                    rows={2}
                    value={kalimatAjak}
                    onChange={(e) => setKalimatAjak(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Aktivitas 4: Refleksi Diri */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f2942] text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Refleksi Hati Anak Sholeh
                </strong>
              </div>
              <div className="pl-8 space-y-2">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Bagaimana perasaanmu setelah jujur mengenali kemampuan membacamu hari ini? Mengapa kita tidak boleh merasa malu belajar dari awal?
                </label>
                <textarea
                  rows={2}
                  value={refleksi1}
                  onChange={(e) => setRefleksi1(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Kotak Pengesahan Guru / Ustadz */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-slate-600 text-xs">
              <div>
                <span className="block font-semibold">Catatan Guru Pembimbing / Ustadz Surau:</span>
                <span className="text-[11px] text-slate-500 italic">"Alhamdulillah, menunjukkan kejujuran yang sangat baik dan inisiatif berkolaborasi yang santun."</span>
              </div>
              <div className="text-right">
                <span className="block text-[11px]">Paraf Guru / Tutor:</span>
                <span className="font-serif font-bold text-slate-900 text-sm">Ust. Fauzi, S.Pd.I</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
