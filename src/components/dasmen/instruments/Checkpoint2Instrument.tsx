import React, { useState } from 'react';
import { Bookmark, Printer, Star, Copy } from 'lucide-react';

interface Checkpoint2Props {
  onSave: (title: string, data: any) => void;
  handlePrint: () => void;
}

export const Checkpoint2Instrument: React.FC<Checkpoint2Props> = ({ onSave, handlePrint }) => {
  const [tingkatMateri, setTingkatMateri] = useState<string>('tingkat_1');
  const [pasanganName, setPasanganName] = useState<string>('Rian Pratama');
  const [kalimatKoreksi, setKalimatKoreksi] = useState<string>('Maaf sahabatku, pada huruf "Ain" suaranya keluar dari tengah tenggorokan, mari kita ulangi pelan-pelan bersama.');
  const [starRating, setStarRating] = useState<number>(5);
  const [refleksiSabar, setRefleksiSabar] = useState<string>('Menyimak teman membutuhkan kesabaran yang tinggi. Ketika saya sabar, teman saya menjadi tidak gugup dan bacaannya jadi lebih lancar.');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const copySumberBelajar = () => {
    const text = `Sumber Belajar — Panduan Setoran Merdu: Menjadi Sahabat Mengaji yang Baik di Surau...`;
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 bg-white shadow-2xs">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-xs uppercase px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
            CHECKPOINT 2
          </span>
          <span className="text-xs font-bold text-amber-800">Mengaplikasikan</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
          Teknik: Unjuk Kerja Berpasangan (Sima'an)
        </span>
      </div>

      <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
        <p className="font-bold text-slate-900 text-sm">
          Setoran Merdu di Surau (Praktik Tilawah Saling Menyimak)
        </p>
        <p className="text-slate-600">
          Murid secara berpasangan mempraktikkan bacaan Al-Quran dasar di surau, di mana satu murid membaca dan rekannya menyimak dengan peduli untuk saling memberikan koreksi santun dan apresiasi hangat.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUMBER BELAJAR DETIL */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">1. SUMBER BELAJAR</span>
            <span className="text-[11px] text-slate-500">• Teks Prosedur &amp; Adab Menyimak</span>
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
              onClick={() => onSave('Sumber Belajar Checkpoint 2', {})}
              className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Simpan ke Koleksi</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
          ✓ Panduan Prosedur Lengkap · Mengasah keterampilan menyimak saksama dan adab bertutur kata mulia di tempat ibadah.
        </div>

        {/* Box Sumber Belajar */}
        <div className="border border-amber-300 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="bg-[#78350f] text-white p-4 sm:p-5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              SUMBER BELAJAR · TEKS PROSEDUR / PANDUAN LANGKAH (SD/SD IT)
            </span>
            <h5 className="text-sm sm:text-base font-bold text-white font-serif">
              Panduan Setoran Merdu: Menjadi Sahabat Mengaji yang Baik di Surau
            </h5>
            <p className="text-xs text-amber-100 font-light">
              Menghidupkan Tradisi Sima'an Berpasangan dengan Kasih Sayang &amp; Saling Mendukung
            </p>
          </div>

          <div className="p-5 sm:p-6 text-xs text-slate-700 space-y-4 leading-relaxed bg-[#fffdfa]">
            <div className="space-y-1.5">
              <strong className="text-slate-900 block text-sm font-serif text-[#78350f]">
                Selamat Datang di Surau! Mari Melantunkan Ayat-Ayat Suci
              </strong>
              <p>
                Ketika kita melangkah ke dalam surau, suasana hening dan damai menyambut kita. Belajar Al-Quran berpasangan (<em>Sima'an</em>) bukan sekadar perlombaan siapa yang selesai paling cepat. Yang paling utama adalah kesungguhan melafalkan ayat dengan tartil dan ketulusan hati sahabat yang menyimak dengan penuh kepedulian.
              </p>
            </div>

            {/* Gambar Ilustrasi */}
            <div className="p-4 bg-amber-50/60 border border-dashed border-amber-300 rounded-2xl text-center space-y-1">
              <span className="text-lg">🤲🕌📖</span>
              <p className="text-[11px] font-semibold text-amber-900">
                [GAMBAR ILUSTRASI: Dua anak Fase B duduk bersila di atas karpet surau berhadapan dengan rehal kayu, saling menunjuk mushaf dengan tatapan teduh dan tersenyum bersahabat]
              </p>
              <p className="text-[10px] text-amber-700">
                Mencerminkan sikap saling menghormati dan kerendahan hati dalam majelis ilmu.
              </p>
            </div>

            {/* 5 Langkah Praktik */}
            <div className="space-y-2.5 pt-1">
              <strong className="text-slate-900 block text-xs sm:text-sm font-bold text-[#78350f]">
                5 Langkah Emas Menjadi Sahabat Mengaji yang Baik:
              </strong>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-xs">Langkah 1: Menyiapkan Tempat &amp; Adab Diri</strong>
                  <p className="text-[11px] text-slate-600">
                    Cari sudut surau yang tenang, letakkan buku Iqra atau mushaf di atas rehal (jangan diletakkan di lantai). Duduklah menghadap kiblat dengan tenang dan khusyuk.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-xs">Langkah 2: Tugas Sang Pembaca</strong>
                  <p className="text-[11px] text-slate-600">
                    Mulai dengan melafalkan Ta'awudz dan Basmalah. Bacalah dengan tenang, jelas, perlahan (tartil), dan jangan terburu-buru.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-xs">Langkah 3: Tugas Sang Penyimak</strong>
                  <p className="text-[11px] text-slate-600">
                    Pusatkan pandangan pada mushaf teman. Dengarkan dengan saksama tanpa melamun atau bercanda. Jangan memotong di tengah-tengah ayat; tunggulah hingga teman berhenti mengambil napas.
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-xs">Langkah 4: Cara Mengoreksi dengan Santun</strong>
                  <p className="text-[11px] text-slate-600">
                    Gunakan suara pelan dan lembut agar tidak mempermalukan teman di depan anak-anak lain. Katakan dengan senyum: <em>"Bagus sekali bacaanmu sahabatku, mari kita ulangi sedikit pada huruf ini agar semakin sempurna ya."</em>
                  </p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-0.5">
                  <strong className="text-slate-900 block font-bold text-xs">Langkah 5: Berganti Peran &amp; Berdoa Bersama</strong>
                  <p className="text-[11px] text-slate-600">
                    Setelah selesai 1 halaman atau target surah, tukarlah peran secara adil. Tutup kegiatan sima'an dengan hamdalah dan saling mendoakan keberkahan ilmu.
                  </p>
                </div>
              </div>
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
            <span className="text-[11px] text-slate-500">• Lembar Praktik Unjuk Kerja</span>
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
              onClick={() => onSave('LKPD Checkpoint 2', { tingkatMateri, pasanganName, starRating })}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0f2942] hover:bg-[#1a3a5a] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan LKPD</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-xl text-[11px] text-slate-700">
          ✎ <strong>LKPD Siap:</strong> Memandu interaksi timbal balik unjuk kerja berpasangan, catatan koreksi santun, dan asesmen adab sebaya.
        </div>

        {/* LKPD Card Container */}
        <div className="border-2 border-slate-300 rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="bg-[#78350f] text-white p-5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-amber-200 uppercase tracking-wider font-semibold">
              <span>LEMBAR KERJA PESERTA DIDIK (LKPD)</span>
              <span>UNJUK KERJA BERPASANGAN · FASE B</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-serif">
              Setoran Merdu di Surau: Praktik Sima'an &amp; Koreksi Santun
            </h4>
            <p className="text-xs text-amber-100">
              Menghargai Teman, Bersabar Menyimak, dan Menjaga Keharmonisan Jamaah Surau
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 leading-relaxed">
            {/* Form Identitas */}
            <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Nama Murid</span>
                <input 
                  type="text" 
                  defaultValue="Muhammad Fatih"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Nama Sahabat Pasangan</span>
                <input 
                  type="text" 
                  value={pasanganName}
                  onChange={(e) => setPasanganName(e.target.value)}
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Lokasi Surau / MDA</span>
                <input 
                  type="text" 
                  defaultValue="Surau Al-Ittihad, Kec. Tambang"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Waktu Sima'an</span>
                <input 
                  type="text" 
                  defaultValue="Ba'da Magrib, 18.30 - 19.15 WIB"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Aktivitas 1: Pilihan Tingkat Materi */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#78350f] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Target Setoran yang Kami Lakukan Hari Ini
                </strong>
              </div>
              <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setTingkatMateri('tingkat_1')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    tingkatMateri === 'tingkat_1' ? 'border-[#78350f] bg-amber-50/50 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-xs">Tingkat 1: Belajar Bersama Iqra</strong>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      tingkatMateri === 'tingkat_1' ? 'border-[#78350f] bg-[#78350f]' : 'border-slate-300'
                    }`}>
                      {tingkatMateri === 'tingkat_1' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Membaca 3–5 baris kalimat pada buku Iqra (menfokuskan pada ketepatan makhraj huruf dan harakat).
                  </p>
                </div>

                <div 
                  onClick={() => setTingkatMateri('tingkat_2')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    tingkatMateri === 'tingkat_2' ? 'border-[#78350f] bg-amber-50/50 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-xs">Tingkat 2: Lancar Bersama Juz 'Amma</strong>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      tingkatMateri === 'tingkat_2' ? 'border-[#78350f] bg-[#78350f]' : 'border-slate-300'
                    }`}>
                      {tingkatMateri === 'tingkat_2' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Membaca 3–5 ayat surah pendek (misal: Surah An-Nas, Al-Falaq, Al-Ikhlas) dengan tajwid tartil.
                  </p>
                </div>
              </div>
            </div>

            {/* Aktivitas 2: Menjodohkan Adab Menyimak */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#78350f] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Menjodohkan Adab Menyimak di Surau
                </strong>
              </div>
              <p className="text-slate-600 pl-8 text-[11px]">
                Hubungkan dengan tepat adab yang harus kita jaga ketika menyimak bacaan sahabat:
              </p>

              <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Perilaku Penyimak
                  </span>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex justify-between">
                    <span>1. Suara saat mengoreksi</span>
                    <span className="text-amber-800 font-mono">───→ Lembut &amp; berbisik santun</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex justify-between">
                    <span>2. Arah pandangan mata</span>
                    <span className="text-amber-800 font-mono">───→ Tertuju pada mushaf teman</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex justify-between">
                    <span>3. Kalimat setelah selesai</span>
                    <span className="text-amber-800 font-mono">───→ Pujian tulus &amp; doa berkah</span>
                  </div>
                </div>

                <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Manfaat bagi Sahabat
                  </span>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700">
                    Teman merasa nyaman dan tidak takut salah.
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700">
                    Dapat segera menyadari kekeliruan dengan tenang.
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700">
                    Membangkitkan semangat mengaji tanpa henti.
                  </div>
                </div>
              </div>
            </div>

            {/* Aktivitas 3: Contoh Ucapan Koreksi Santun */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#78350f] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Praktik Kalimat Koreksi yang Santun
                </strong>
              </div>
              <div className="pl-8 space-y-2">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Tuliskan satu contoh ucapan koreksi santun yang kamu sampaikan kepada sahabatmu hari ini:
                </label>
                <textarea
                  rows={2}
                  value={kalimatKoreksi}
                  onChange={(e) => setKalimatKoreksi(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* Aktivitas 4: Penilaian Diri & Bintang Kepedulian */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#78350f] text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Bintang Kepedulian &amp; Refleksi Kesabaran
                </strong>
              </div>
              <div className="pl-8 space-y-3">
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <span className="font-bold text-xs text-amber-950">
                    Berapa bintang yang kamu berikan untuk kesabaranmu dan sahabatmu hari ini?
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStarRating(s)}
                        className="cursor-pointer p-1 transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-5 h-5 ${
                            s <= starRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="font-bold text-xs text-slate-800 ml-1.5">({starRating} Bintang)</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Mengapa sikap sabar sangat penting saat kita menyimak sahabat kita membaca Al-Quran?
                  </label>
                  <textarea
                    rows={2}
                    value={refleksiSabar}
                    onChange={(e) => setRefleksiSabar(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Catatan Ayah / Bunda & Guru */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block text-[11px]">Catatan Ayah / Bunda di Rumah:</span>
                <p className="text-[11px] text-slate-600 mt-1 italic">
                  "Alhamdulillah anak kami semakin bersemangat ke surau bersama kawan-kawannya dan lebih sabar di rumah."
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block text-[11px]">Umpan Balik Guru / Ustadz Surau:</span>
                <p className="text-[11px] text-slate-600 mt-1 italic">
                  "Capaian BSH: Menunjukkan kepekaan sosial dan adab koreksi santun yang sangat membanggakan."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
