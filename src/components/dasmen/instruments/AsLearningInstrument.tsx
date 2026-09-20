import React, { useState } from 'react';
import { Bookmark, Printer, Sparkles, Copy, Check, Heart, Flame, ShieldAlert, Smile } from 'lucide-react';

interface AsLearningProps {
  onSave: (title: string, data: any) => void;
  handlePrint: () => void;
}

export const AsLearningInstrument: React.FC<AsLearningProps> = ({ onSave, handlePrint }) => {
  const [selectedBentuk, setSelectedBentuk] = useState<string>('Jurnal Reflektif');
  const [showAllForms, setShowAllForms] = useState<boolean>(false);
  const [posisiLentera, setPosisiLentera] = useState<string>('iqra_lanjutan');
  const [suasanaHati, setSuasanaHati] = useState<string>('khusyuk');
  const [kebaikanSahabat, setKebaikanSahabat] = useState<string>(
    'Hari ini saya membantu menyimak teman sebangku yang keliru membedakan harakat kasrah dan sukun dengan senyuman dan kata-kata santun.'
  );
  const [refleksiTerang, setRefleksiTerang] = useState<string>(
    'Hati saya terasa lebih tenang dan gembira karena bisa bermanfaat bagi sahabat tanpa merasa lebih pintar darinya.'
  );
  const [refleksiPerbaikan, setRefleksiPerbaikan] = useState<string>(
    'Besok saya ingin datang lebih awal ke surau agar bisa membaca wirid bersama dan tidak terburu-buru.'
  );
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const copySumberBelajar = () => {
    const text = `Sumber Belajar — Menjadi Lentera di Surau Kampar: Kisah Perjalanan Belajar Al-Quran Kita...`;
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="border border-purple-200 rounded-3xl p-5 sm:p-7 space-y-6 bg-white shadow-2xs">
      {/* Top Filter Bar Sesuai kembangko.pdf */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-purple-50/60 border border-purple-200/90 rounded-2xl text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-purple-950">
            Bentuk as &amp; of di bawah sudah disaring sesuai prinsipnya.
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-purple-900 font-medium">
            <input
              type="checkbox"
              checked={showAllForms}
              onChange={(e) => setShowAllForms(e.target.checked)}
              className="rounded border-purple-300 text-purple-700 focus:ring-purple-500"
            />
            <span>tampilkan semua bentuk</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBentuk}
            onChange={(e) => setSelectedBentuk(e.target.value)}
            className="px-3 py-1.5 bg-white border border-purple-300 rounded-xl text-purple-900 font-bold text-xs"
          >
            <option value="Jurnal Reflektif">Jurnal Reflektif</option>
            {showAllForms && (
              <>
                <option value="Penilaian Diri">Penilaian Diri (Self-Assessment)</option>
                <option value="Penilaian Antar-Teman">Penilaian Antar-Teman (Peer-Assessment)</option>
                <option value="Peta Kemajuan Belajar">Peta Kemajuan Belajar</option>
              </>
            )}
          </select>
          <span className="px-2.5 py-1 bg-purple-600 text-white font-bold text-[10px] rounded-lg uppercase tracking-wider">
            AS LEARNING
          </span>
          <button
            type="button"
            className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-semibold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            Buat
          </button>
        </div>
      </div>

      {/* Status Callout Banner */}
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>✎</span>
          <span>
            <strong>as learning siap</strong> — bisa diedit. Akan jadi <em>Lampiran Asesmen</em> di dokumen modul.
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSave('Spesifikasi As Learning', { selectedBentuk })}
          className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-white border border-purple-200 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-purple-100"
        >
          <Bookmark className="w-3 h-3" />
          <span>Simpan ke Koleksi</span>
        </button>
      </div>

      {/* Main Title Specification Card */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider">
            <span>Instrumen As Learning</span>
            <span>•</span>
            <span>{selectedBentuk}</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-serif mt-1">
            Jurnal Lentera Surau Kampar: Refleksi Diri Pembelajar Al-Quran
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Menumbuhkan kesadaran diri (<em>self-awareness</em>), rasa syukur atas proses belajar, dan komitmen kolaboratif menjaga syiar mengaji di Surau Kampar.
          </p>
        </div>

        {/* 5 Rincian Asesmen Sesuai kembangko.pdf */}
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <strong className="text-slate-900 font-bold block text-xs">1. Tujuan Asesmen</strong>
            <p className="text-slate-600">
              Memandu murid memonitor, mengevaluasi, dan merefleksikan perkembangan pribadinya dalam belajar membaca Al-Quran (Keimanan &amp; Ketakwaan terhadap Tuhan YME) serta perannya membantu teman (Kolaborasi), sehingga terbangun budaya belajar sepanjang hayat yang jujur dan bersahaja.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <strong className="text-slate-900 font-bold block text-xs">2. Langkah Asesmen</strong>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Sosialisasi &amp; Pembiasaan:</strong> Guru mengenalkan makna 'Lentera Hati' dan memfasilitasi waktu khusus 10–15 menit tiap akhir pekan di surau.</li>
              <li><strong>Pilihan Ekspresi Diri:</strong> Murid bebas mengekspresikan refleksinya melalui tulisan sederhana, centang perasaan, atau gambar lentera.</li>
              <li><strong>Umpan Balik Guru/Ustadz:</strong> Guru membaca jurnal tanpa menghakimi, melainkan memberikan catatan apresiasi dan afirmasi positif.</li>
              <li><strong>Pencatatan Perkembangan:</strong> Menjadi bagian penting dari rekam jejak kemandirian belajar anak.</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-2">
            <strong className="text-purple-950 font-bold block text-xs">3. Kriteria Asesmen As Learning (Rubrik 4 Jenjang)</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-purple-900">
              <div className="p-2.5 bg-white border border-purple-200 rounded-xl">
                <strong className="text-rose-700 block">Mulai Berkembang (MB)</strong>
                <p className="mt-0.5">Mampu menyebutkan kehadiran mengaji di surau namun belum menyadari tantangan atau cara membantu teman.</p>
              </div>
              <div className="p-2.5 bg-white border border-purple-200 rounded-xl">
                <strong className="text-amber-700 block">Sedang Berkembang (SB)</strong>
                <p className="mt-0.5">Mulai menyadari kesulitan membaca huruf tertentu dan berusaha meminta bantuan teman secara sopan.</p>
              </div>
              <div className="p-2.5 bg-white border border-purple-200 rounded-xl">
                <strong className="text-sky-700 block">Cakap / Sesuai Harapan (BSH)</strong>
                <p className="mt-0.5">Secara konsisten merefleksikan proses belajar sendiri serta mencatat tindakan nyata saat berkolaborasi dengan teman di surau.</p>
              </div>
              <div className="p-2.5 bg-white border border-purple-200 rounded-xl">
                <strong className="text-emerald-700 block">Sangat Berkembang (SAB)</strong>
                <p className="mt-0.5">Mampu mengevaluasi strategi belajar secara mandiri dan mengusulkan gagasan baru agar seluruh sahabat di surau dapat belajar mengaji dengan gembira.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <strong className="text-slate-900 font-bold block text-xs">4. Penerapan Prinsip APM</strong>
              <p className="text-[11px] text-slate-600">
                <strong>Edukatif &amp; Autentik:</strong> Refleksi bukan untuk mencari nilai angka, melainkan menguatkan kesadaran batin murid sebagai hamba Allah dan sahabat yang peduli.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <strong className="text-slate-900 font-bold block text-xs">5. Penyesuaian Diferensiasi</strong>
              <p className="text-[11px] text-slate-600">
                <strong>Diferensiasi Produk:</strong> Murid yang belum lancar menulis dapat menuangkan perasaannya melalui gambar lentera bercahaya atau rekaman suara santun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUMBER BELAJAR AS LEARNING */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              1. SUMBER BELAJAR (AS LEARNING)
            </span>
            <span className="text-[11px] text-slate-500">• Teks Informasi &amp; Panduan Refleksi</span>
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
              onClick={() => onSave('Sumber Belajar As Learning', {})}
              className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3 h-3" />
              <span>Simpan ke Koleksi</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl text-[11px] text-purple-900 font-medium">
          ✎ Sumber Belajar siap (Teks Informasi dan Panduan Refleksi) — bisa diedit. LKPD akan dibuat dari isi ini.
        </div>

        {/* Box Sumber Belajar As Learning */}
        <div className="border border-purple-300 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="bg-[#581c87] text-white p-4 sm:p-5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
              SUMBER BELAJAR · TEKS INFORMASI DAN PANDUAN REFLEKSI (SD IT)
            </span>
            <h5 className="text-sm sm:text-base font-bold text-white font-serif">
              Menjadi Lentera di Surau Kampar: Kisah Perjalanan Belajar Al-Quran Kita
            </h5>
            <p className="text-xs text-purple-200 font-light">
              Membangkitkan Semangat Muhasabah Diri, Kejujuran Hati, dan Kepedulian Kolaboratif
            </p>
          </div>

          <div className="p-5 sm:p-6 text-xs text-slate-700 space-y-4 leading-relaxed bg-[#fdfcff]">
            <div className="space-y-1.5">
              <strong className="text-slate-900 block text-sm font-serif text-[#581c87]">
                Anak-Anak Hebat di Kampar, Tahukah Kamu Apa Itu Lentera?
              </strong>
              <p>
                Dahulu kala di perkampungan Kampar, sebelum ada aliran listrik yang terang benderang, masyarakat dan anak-anak mengaji menggunakan <em>lentera pelita</em> atau <em>lampu togok</em> berbahan minyak tanah. Lentera itu mungkin kecil, tetapi cahayanya mampu menembus pekatnya malam, menerangi jalan setapak berbatu menuju surau panggung kita.
              </p>
              <p>
                Begitu pula dengan diri kita. Setiap ayat Al-Quran yang kita baca dengan jujur dan tulus adalah lentera kecil yang menyala di dalam hati. Ketika kita bersedia membantu sahabat kita yang masih mengeja huruf Iqra, lentera itu bersinar semakin terang, menghangatkan suasana surau kita.
              </p>
            </div>

            {/* Gambar Ilustrasi As Learning */}
            <div className="p-4 bg-purple-50/60 border border-dashed border-purple-300 rounded-2xl text-center space-y-1">
              <span className="text-lg">🕯️✨🕌</span>
              <p className="text-[11px] font-semibold text-purple-900">
                [GAMBAR ILUSTRASI: Anak-anak SD sedang belajar mengaji bersama di teras Surau kayu khas Kampar, saling menunjuk huruf Iqra dengan senyuman hangat di bawah temaram lentera tradisional]
              </p>
              <p className="text-[10px] text-purple-700">
                Melambangkan kejujuran batin dan keindahan ukhuwah Islamiyah di surau desa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white border border-purple-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold text-xs">1. Perjalanan Belajarku (Melihat Diri Sendiri)</strong>
                <p className="text-[11px] text-slate-600">
                  Refleksi bukan untuk membandingkan siapa yang paling hebat. Refleksi adalah bertanya pada hati sendiri: <em>"Apakah hari ini aku membaca Al-Quran dengan ikhlas? Apa yang masih perlu kuperbaiki?"</em>.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-purple-200 rounded-xl space-y-1">
                <strong className="text-slate-900 block font-bold text-xs">2. Menjadi Lentera Bagi Teman (Kolaborasi)</strong>
                <p className="text-[11px] text-slate-600">
                  Cahaya sejati tampak saat kita tidak membiarkan sahabat kita tertinggal sendirian. Ketika teman kita merasa malu atau kesulitan, kita hadir memberikan semangat dan tutur kata yang menyejukkan hati.
                </p>
              </div>
            </div>

            <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl text-[11px] text-slate-700">
              <strong>Apa itu Jurnal Lentera Surau?</strong> Ini adalah catatan hatimu. Tulislah pengalaman, rasa syukurmu, dan kebaikan apa yang telah kamu bagikan hari ini. Semoga Allah memberkahi langkah kaki kita menuju surau!
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LKPD AS LEARNING (DESAIN LKPD SIAP) */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              2. LKPD — JURNAL LENTERA SURAU KAMPAR
            </span>
            <span className="text-[11px] text-slate-500">• Lembar Refleksi Diri Pembelajar</span>
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
              onClick={() => onSave('LKPD As Learning - Jurnal Lentera', { posisiLentera, suasanaHati, kebaikanSahabat, refleksiTerang })}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#581c87] hover:bg-[#4a1570] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan LKPD</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-xl text-[11px] text-slate-700">
          ✎ <strong>LKPD Siap (Fase B · Halaman 17-18 PDF):</strong> Desain lembar reflektif lentera hati, memadukan pilihan ekspresi emosi, catatan kebaikan sahabat, dan evaluasi diri.
        </div>

        {/* Desain LKPD Siap Box */}
        <div className="border-2 border-purple-300 rounded-3xl overflow-hidden bg-white shadow-xs">
          {/* LKPD Header Bar */}
          <div className="bg-[#581c87] text-white p-5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-purple-200 uppercase tracking-wider font-semibold">
              <span>LEMBAR KERJA PESERTA DIDIK (LKPD) · AS LEARNING</span>
              <span>FASE B · SD IT KAMPAR</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
              <span>🕯️ Jurnal Lentera Surau Kampar</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-700 text-amber-200 font-sans font-normal">
                Refleksi Diri Pembelajar Al-Quran
              </span>
            </h4>
            <p className="text-xs text-purple-200">
              Projek Penguatan Delapan Profil Lulusan: Beriman &amp; Bertakwa kepada Tuhan YME dan Kolaborasi
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 leading-relaxed">
            {/* Greeting Banner */}
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <p className="text-xs text-purple-950 font-medium leading-relaxed">
                <strong>Halo Anak Hebat Kampar!</strong> Mari kita nyalakan lentera di dalam hati kita dengan merenungi apa yang telah kita pelajari di surau hari ini. Isilah jurnal ini dengan jujur dan penuh rasa syukur!
              </p>
            </div>

            {/* Identitas Siswa */}
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
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Surau / MDA</span>
                <input 
                  type="text" 
                  defaultValue="Surau Al-Ittihad"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Tanggal Refleksi</span>
                <input 
                  type="text" 
                  defaultValue="Jumat, 16 Mei 2026"
                  className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Pertanyaan 1: Posisi Lentera Belajar */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Di Mana Posisi Lentera Belajarku Hari Ini?
                </strong>
              </div>
              <p className="text-slate-600 pl-8 text-[11px]">
                Pilihlah tahapan yang paling menggambarkan posisimu saat ini:
              </p>
              <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'huruf_hijaiyah',
                    title: 'Tingkat Hijaiyah / Iqra Dasar',
                    desc: 'Sedang memperkuat pengenalan huruf dan harakat dasar dengan tekun.'
                  },
                  {
                    id: 'iqra_lanjutan',
                    title: 'Tingkat Iqra Lanjutan',
                    desc: 'Sedang belajar menyambung huruf, hukum mad, dan tajwid sederhana.'
                  },
                  {
                    id: 'al_quran',
                    title: 'Tingkat Juz \'Amma / Al-Quran',
                    desc: 'Sudah membaca mushaf dan aktif menjadi sahabat tutor sebaya.'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPosisiLentera(item.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      posisiLentera === item.id ? 'border-[#581c87] bg-purple-50/60 shadow-xs' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 text-xs">{item.title}</strong>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        posisiLentera === item.id ? 'border-[#581c87] bg-[#581c87]' : 'border-slate-300'
                      }`}>
                        {posisiLentera === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pertanyaan 2: Suasana Hati / Emotikon */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Bagaimana Suasana Hatiku Saat Mengaji di Surau Hari Ini?
                </strong>
              </div>
              <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setSuasanaHati('khusyuk')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all text-center space-y-1 ${
                    suasanaHati === 'khusyuk' ? 'border-purple-700 bg-purple-50/80 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">😇</span>
                  <strong className="text-slate-900 block text-xs">Sabar &amp; Khusyuk</strong>
                  <p className="text-[10px] text-slate-500">Merasa tenang, damai, dan menikmati setiap ayat.</p>
                </div>

                <div
                  onClick={() => setSuasanaHati('semangat')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all text-center space-y-1 ${
                    suasanaHati === 'semangat' ? 'border-purple-700 bg-purple-50/80 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">🔥</span>
                  <strong className="text-slate-900 block text-xs">Bersemangat &amp; Ceria</strong>
                  <p className="text-[10px] text-slate-500">Penuh energi dan senang bertemu sahabat mengaji.</p>
                </div>

                <div
                  onClick={() => setSuasanaHati('berjuang')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all text-center space-y-1 ${
                    suasanaHati === 'berjuang' ? 'border-purple-700 bg-purple-50/80 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">💪</span>
                  <strong className="text-slate-900 block text-xs">Sempat Sulit tapi Pantang Menyerah</strong>
                  <p className="text-[10px] text-slate-500">Menemukan bacaan menantang namun tetap gigih mencoba.</p>
                </div>
              </div>
            </div>

            {/* Pertanyaan 3: Catatan Kebaikan Sahabat */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Catatan Kebaikan &amp; Kolaborasi Sahabat
                </strong>
              </div>
              <div className="pl-8 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Tuliskan bagaimana kamu membantu temanmu hari ini, ATAU bagaimana kamu meminta bantuan teman dengan sopan saat menemui kesulitan:
                </label>
                <textarea
                  rows={2}
                  value={kebaikanSahabat}
                  onChange={(e) => setKebaikanSahabat(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Pertanyaan 4: Refleksi Lentera Hati */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900">
                  Refleksi Mendalam Lentera Hati
                </strong>
              </div>
              <div className="pl-8 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    (a) Apa satu hal yang membuat lentera di dalam hatimu terasa semakin terang hari ini?
                  </label>
                  <textarea
                    rows={2}
                    value={refleksiTerang}
                    onChange={(e) => setRefleksiTerang(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    (b) Apa satu hal baik yang ingin kamu perbaiki agar belajarmu lebih berkah esok hari?
                  </label>
                  <textarea
                    rows={2}
                    value={refleksiPerbaikan}
                    onChange={(e) => setRefleksiPerbaikan(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Kotak Guru & Ayah Bunda */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="space-y-0.5">
                <span className="font-bold text-purple-950 block text-[11px]">Pesan Ustadz Surau / Guru Pendamping:</span>
                <p className="text-[11px] text-slate-600 italic">
                  "Masya Allah, hatimu begitu bersih dan tulus. Teruslah menjadi lentera pembawa kedamaian bagi kawan-kawanmu di surau kita."
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-slate-500">Tanda Tangan Ustadz:</span>
                <span className="font-serif font-bold text-purple-950 text-sm">Ust. Fauzi, S.Pd.I</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
