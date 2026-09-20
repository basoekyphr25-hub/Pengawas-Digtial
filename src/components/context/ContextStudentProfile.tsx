import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Copy, 
  FileText, 
  Bookmark, 
  Trash2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GlobalContext, NonCognitiveInstrument, SavedDocument } from '../../types';
import { generateNonCognitiveAssessment } from '../../lib/gemini/prompts';

interface ContextStudentProfileProps {
  globalContext: GlobalContext;
  onUpdateContext: (updated: GlobalContext) => void;
  onNavigate?: (item: any) => void;
  onSaveToCollection?: (doc: SavedDocument) => void;
}

const FOCUS_OPTIONS = [
  'Minat & hobi',
  'Motivasi belajar',
  'Cara belajar yang cocok',
  'Kebiasaan belajar',
  'Kondisi emosi & kesejahteraan',
  'Hubungan sosial di kelas',
  'Dukungan belajar di rumah'
];

const ASSESSMENT_FORMATS = [
  'Angket / Kuesioner Skala',
  'Observasi Kelas',
  'Wawancara Singkat',
  'Diskusi Lingkaran / Refleksi Terbuka',
  'Pilihan Gambar / Visual Card'
];

export const ContextStudentProfile: React.FC<ContextStudentProfileProps> = ({
  globalContext,
  onUpdateContext,
  onNavigate,
  onSaveToCollection
}) => {
  const currentProfile = globalContext.studentProfile;
  const schoolName = globalContext.identity.schoolName || 'Satuan Pendidikan';
  const level = globalContext.identity.level || 'SD';

  // 1. Asesmen Awal Non-Kognitif State
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>([
    'Minat & hobi',
    'Motivasi belajar',
    'Dukungan belajar di rumah'
  ]);
  const [assessmentFormat, setAssessmentFormat] = useState<string>('Observasi Kelas');
  const [itemCount, setItemCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [savedCollectionBadge, setSavedCollectionBadge] = useState(false);
  const [profileSavedBadge, setProfileSavedBadge] = useState(false);

  // Active or existing generated instrument
  const [instrument, setInstrument] = useState<NonCognitiveInstrument | null>(
    currentProfile.nonCognitiveInstrument || {
      id: `NONKOG-INIT`,
      title: 'Observasi Aktivitas dan Minat Murid Kelas Awal',
      focuses: ['Minat & hobi', 'Motivasi belajar', 'Dukungan belajar di rumah'],
      format: 'Observasi Kelas',
      itemCount: 10,
      schoolName: schoolName,
      level: level,
      targetClass: currentProfile.targetClass || 'Kelas Awal',
      studentSheet: {
        title: 'Asesmen Awal Non-Kognitif — Observasi Aktivitas dan Minat Murid Kelas Awal',
        instructions: `Halo anak-anak pintar di ${schoolName}! Hari ini kita mau bermain dan bercerita santai bersama Ibu/Bapak Guru, ya. Nanti anak-anak boleh menunjuk gambar mana yang paling disukai, memilih kartu wajah yang menggambarkan perasaanmu saat belajar, dan bercerita tentang siapa yang sering menemanimu belajar di rumah. Tidak usah takut ya, semua cerita kalian pasti hebat!`,
        items: [
          'Menunjuk gambar aktivitas yang paling disukai saat berada di rumah (bermain bola, menggambar, membaca buku, menyanyi, berkebun).',
          'Memilih kartu ekspresi emosi (senang, biasa saja, bingung/sedih) saat diajak belajar membaca atau berhitung di kelas.',
          'Bercerita santai mengenai hal atau pengalaman yang paling membuat gembira saat berada di sekolah.',
          'Menceritakan siapa orang dewasa atau anggota keluarga yang biasanya menemani belajar dan bermain di rumah.',
          'Menunjukkan kartu pilihan cara belajar: mendengarkan cerita, melihat video berwarna, atau langsung memegang dan mencoba alat permainan.',
          'Mengekspresikan harapan dan kegiatan impian yang ingin dilakukan bersama teman-teman sekelas.'
        ]
      },
      teacherGuide: {
        paradigm: 'Asesmen for learning — asesmen awal non-kognitif',
        format: 'Observasi Kelas',
        schoolLevel: `${schoolName} | Jenjang: ${level}`,
        focusAreas: ['Minat & hobi', 'Motivasi belajar', 'Dukungan belajar di rumah'],
        purpose: `Memetakan minat, hobi, motivasi belajar, serta dukungan belajar di rumah pada murid kelas awal di ${schoolName} untuk merancang pembelajaran yang sesuai dengan kondisi nyata murid.`,
        materials: 'Lembar panduan observasi guru, kartu gambar aktivitas/bermain (bola, menggambar, membaca buku, menyanyi, berkebun), dan kartu ekspresi emosi (senang, biasa saja, sedih).',
        implementationSteps: [
          '1. Guru mengondisikan kelas dalam posisi melingkar yang nyaman dan santai.',
          '2. Guru menunjukkan kartu gambar aktivitas satu per satu di depan kelas.',
          '3. Guru meminta setiap murid secara bergantian menunjuk gambar aktivitas yang paling mereka sukai saat di rumah (menggali minat/hobi).',
          '4. Guru menunjukkan kartu ekspresi emosi dan menanyakan secara lisan bagaimana perasaan mereka ketika belajar membaca atau berhitung di kelas (menggali motivasi belajar).',
          '5. Guru mengajak murid bercerita santai tentang siapa saja yang biasanya menemani mereka bermain atau belajar ketika di rumah (menggali dukungan belajar di rumah).',
          '6. Guru mencatat seluruh respon verbal, pilihan gambar, dan bahasa tubuh murid pada lembar observasi tanpa memberikan penilaian benar atau salah.'
        ],
        diversityAdjustments: [
          '• Untuk murid yang belum lancar berbicara, guru fokus menggunakan kartu gambar/pilihan visual yang dapat ditunjuk langsung oleh murid.',
          '• Untuk murid yang sangat pemalu, observasi dilakukan secara personal dengan pendekatan bermain bersama saat jam istirahat.',
          '• Untuk murid dengan hambatan penglihatan, guru mendeskripsikan gambar aktivitas secara lisan dengan suara yang jelas dan ekspresif.'
        ]
      },
      differentiationFollowUp: {
        scenarios: [
          {
            scenarioTitle: 'Skenario 1',
            condition: 'Sebagian besar murid memilih gambar aktivitas fisik (seperti bermain bola/menari) dan menunjukkan ekspresi sangat senang saat bergerak.',
            interpretation: 'Murid memiliki minat kinestetik yang kuat dan motivasi belajarnya meningkat melalui aktivitas fisik.',
            actions: {
              konten: 'Menyederhanakan instruksi tugas agar dapat diselesaikan secara bertahap di sekolah tanpa membebani rumah',
              proses: 'Memberikan bimbingan mandiri (scaffolding) lebih intensif atau menerapkan sistem tutor sebaya di kelas',
              produk: 'Mengutamakan penilaian proses langsung di kelas daripada memberikan tugas rumah (PR)',
              lingkunganBelajar: 'Menciptakan suasana kelas yang nyaman di kelas sebagai tempat belajar mandiri yang aman bagi murid'
            }
          },
          {
            scenarioTitle: 'Skenario 2',
            condition: 'Murid menunjukkan ekspresi sedih atau bingung saat ditanya tentang belajar di rumah dan menyatakan tidak ada yang menemani belajar.',
            interpretation: 'Dukungan belajar di rumah membutuhkan penguatan afektif, rasa aman, dan bimbingan langsung di sekolah.',
            actions: {
              konten: 'Memfokuskan penuntasan materi inti selama jam pelajaran efektif dengan media konkret',
              proses: 'Memberikan dorongan moril reguler dan validasi perasaan sebelum memulai instruksi baru',
              produk: 'Menyediakan variasi produk belajar sederhana yang diselesaikan tuntas bersama kelompok di kelas',
              lingkunganBelajar: 'Menyediakan sudut baca ramah anak dengan bantal duduk yang nyaman untuk belajar santai'
            }
          },
          {
            scenarioTitle: 'Skenario 3',
            condition: 'Murid sangat antusias pada gambar menggambar/mewarnai dan bercerita sering didampingi orang tua saat berkreasi di rumah.',
            interpretation: 'Murid memiliki minat visual-artistik yang kuat didukung oleh lingkungan rumah yang kondusif untuk berkreasi.',
            actions: {
              konten: 'Menyajikan materi pembelajaran dengan bantuan visual yang kaya warna dan menarik',
              proses: 'Mengintegrasikan aktivitas menggambar atau mewarnai dalam proses eksplorasi konsep baru',
              produk: 'Memberikan pilihan bagi murid untuk melaporkan hasil belajarnya dalam bentuk gambar atau karya rupa',
              lingkunganBelajar: 'Memajang hasil karya gambar murid di dinding kelas untuk meningkatkan rasa percaya diri mereka'
            }
          }
        ]
      },
      createdAt: new Date().toISOString()
    }
  );

  // 2. Ringkasan Profil Kelas Form State (6 textareas)
  const [readinessSummary, setReadinessSummary] = useState(
    currentProfile.readinessSummary ?? 'Sebagian besar sudah lancar membaca dan memahami instruksi lisan sederhana; ada 4 murid yang masih memerlukan pendampingan visual intensif.'
  );
  const [interestsSummary, setInterestsSummary] = useState(
    currentProfile.interestsSummary ?? 'Suka sepak bola, menggambar, permainan interaktif, video animasi edukatif, dan eksplorasi alam terbuka.'
  );
  const [learningPreferences, setLearningPreferences] = useState(
    currentProfile.learningPreferences ?? 'Lebih menyukai pembelajaran berbasis praktik langsung, demonstrasi visual konkret, dan aktivitas berkelompok daripada ceramah panjang.'
  );
  const [socialEmotionalSummary, setSocialEmotionalSummary] = useState(
    currentProfile.socialEmotionalSummary ?? 'Antusias dan ramah; sebagian murid masih ragu-ragu saat berbicara di depan kelas namun kelas secara umum sangat kompak dan saling peduli.'
  );
  const [culturalBackground, setCulturalBackground] = useState(
    currentProfile.culturalBackground ?? 'Mayoritas berasal dari keluarga pekerja swasta dan pedagang lokal; menggunakan bahasa Indonesia dengan sesekali percampuran bahasa daerah.'
  );
  const [inclusionNotes, setInclusionNotes] = useState(
    currentProfile.inclusionNotes ?? '1 murid memerlukan pengulangan instruksi dengan tempo tenang; 1 murid kidal yang memerlukan posisi tempat duduk adaptif.'
  );

  const toggleFocus = (focus: string) => {
    setSelectedFocuses(prev => 
      prev.includes(focus) 
        ? prev.filter(f => f !== focus)
        : [...prev, focus]
    );
  };

  const handleGenerateInstrument = async () => {
    if (selectedFocuses.length === 0) return;
    setIsGenerating(true);
    try {
      const generated = await generateNonCognitiveAssessment({
        focuses: selectedFocuses,
        format: assessmentFormat,
        itemCount: Number(itemCount) || 6,
        globalContext
      });
      setInstrument(generated);

      // Auto update context with the new instrument
      onUpdateContext({
        ...globalContext,
        studentProfile: {
          ...globalContext.studentProfile,
          nonCognitiveInstrument: generated
        }
      });
    } catch (err) {
      console.error('Gagal membuat instrumen asesmen:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyInstrument = () => {
    if (!instrument) return;
    const text = `
ASESMEN AWAL NON-KOGNITIF: ${instrument.title}
Sekolah: ${instrument.schoolName}
Jenjang: ${instrument.level} | Kelas: ${instrument.targetClass}
Format: ${instrument.format}
Fokus yang Digali: ${instrument.focuses.join(', ')}

==================================================
LEMBAR SISWA / INSTRUMEN PENGAMATAN
==================================================
Nama: _______________   Kelas: _______________   Tanggal: _______________

Petunjuk:
${instrument.studentSheet.instructions}

Daftar Butir / Aktivitas:
${instrument.studentSheet.items.map((it, idx) => `${idx + 1}. ${it}`).join('\n')}

Ruang Catatan:
____________________________________________________________________
____________________________________________________________________
____________________________________________________________________

==================================================
PANDUAN GURU
==================================================
Tujuan Asesmen:
${instrument.teacherGuide.purpose}

Alat & Bahan:
${instrument.teacherGuide.materials}

Langkah Pelaksanaan:
${instrument.teacherGuide.implementationSteps.join('\n')}

Penyesuaian Keberagaman Murid:
${instrument.teacherGuide.diversityAdjustments.join('\n')}

==================================================
RENCANA TINDAK LANJUT DIFERENSIASI
==================================================
${instrument.differentiationFollowUp.scenarios.map((sc, i) => `
${sc.scenarioTitle} — ${sc.condition}
Tafsir: ${sc.interpretation}
- Konten: ${sc.actions.konten}
- Proses: ${sc.actions.proses}
- Produk: ${sc.actions.produk}
- Lingkungan Belajar: ${sc.actions.lingkunganBelajar}
`).join('\n')}
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const handleSaveToCollection = () => {
    if (!instrument || !onSaveToCollection) return;
    const doc: SavedDocument = {
      id: instrument.id,
      title: `Instrumen Non-Kognitif: ${instrument.title}`,
      category: 'asesmen_non_kognitif',
      subjectOrTheme: instrument.focuses.join(', '),
      gradeOrAge: instrument.targetClass,
      createdAt: new Date().toISOString(),
      data: instrument
    };
    onSaveToCollection(doc);
    setSavedCollectionBadge(true);
    setTimeout(() => setSavedCollectionBadge(false), 2500);
  };

  const handleDeleteInstrument = () => {
    setInstrument(null);
    onUpdateContext({
      ...globalContext,
      studentProfile: {
        ...globalContext.studentProfile,
        nonCognitiveInstrument: undefined
      }
    });
  };

  const handleSaveProfileAndReturn = () => {
    // Compile clean summary for AI differentiation injection
    const synthesizedClassSummary = `Kesiapan: ${readinessSummary}. Minat: ${interestsSummary}. Preferensi belajar: ${learningPreferences}. Sosial-emosional: ${socialEmotionalSummary}. Latar budaya: ${culturalBackground}. Catatan inklusi: ${inclusionNotes}.`;

    const updatedProfile = {
      ...globalContext.studentProfile,
      readinessSummary,
      interestsSummary,
      learningPreferences,
      socialEmotionalSummary,
      culturalBackground,
      inclusionNotes,
      classProfileSummary: synthesizedClassSummary,
      nonCognitiveInstrument: instrument || undefined
    };

    onUpdateContext({
      ...globalContext,
      studentProfile: updatedProfile,
      isCompleted: true
    });

    setProfileSavedBadge(true);
    setTimeout(() => {
      setProfileSavedBadge(false);
      if (onNavigate) {
        onNavigate('dashboard');
      }
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate ? onNavigate('dashboard') : window.history.back()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </button>

        <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          KONTEKS 2 DARI 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
          Profil Murid
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          Kenali murid lewat asesmen awal non-kognitif, lalu rangkum jadi profil kelas. Profil ini menyetir diferensiasi di setiap modul.
        </p>
      </div>

      {/* Amber Tip Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 sm:p-4 text-xs text-amber-950 flex items-start gap-2.5">
        <span className="text-base select-none mt-0.5">💡</span>
        <p className="leading-relaxed">
          <strong>Belum punya profil murid?</strong> Disarankan lakukan asesmen awal dulu. Untuk mempermudah rekap & analisis, hasil angket bisa kamu masukkan ke aplikasi pihak ketiga seperti <strong>Wayground</strong> (tombol salin tersedia setelah instrumen jadi).
        </p>
      </div>

      {/* 1. Asesmen Awal Non-Kognitif */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            1. Asesmen Awal Non-Kognitif
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Asesmen awal <em>for learning</em> — memetakan murid, bukan menilai. Tidak ada jawaban benar/salah. Pilih fokus & bentuknya lalu buat instrumen. Bisa buat beberapa sekaligus (mis. asesmen minat sendiri, asesmen kesiapan belajar sendiri).
          </p>
        </div>

        {/* Focus Selector Pills */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold text-slate-700">
            Apa yang mau kamu gali? — <span className="font-normal text-slate-500">pilih satu/beberapa fokus untuk instrumen ini</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((f) => {
              const active = selectedFocuses.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFocus(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? 'bg-[#0f2942] text-white border-[#0f2942] shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Controls: Bentuk & Jumlah Butir */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bentuk asesmen
            </label>
            <select
              value={assessmentFormat}
              onChange={(e) => setAssessmentFormat(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {ASSESSMENT_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah butir — <span className="font-normal text-slate-500">kalau berbentuk pertanyaan</span>
            </label>
            <input
              type="number"
              min={3}
              max={25}
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value) || 6)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Action Button: Buat Instrumen */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerateInstrument}
            disabled={isGenerating || selectedFocuses.length === 0}
            className="px-5 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] disabled:opacity-50 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun instrumen...' : 'Buat instrumen'}</span>
          </button>
        </div>

        {/* Render Generated Instrument Container if available */}
        {instrument && (
          <div className="mt-5 pt-5 border-t border-slate-200 space-y-4 animate-fadeIn">
            {/* Instrument Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {instrument.title}
              </h4>
              <button
                type="button"
                onClick={handleCopyInstrument}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 inline-flex items-center gap-1.5 transition-colors"
              >
                {copiedBadge ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin instrumen</span>
                  </>
                )}
              </button>
            </div>

            {/* Sub-card 1: Lembar Instrumen Siswa / Pengamatan */}
            <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white space-y-3.5 text-xs text-slate-800">
              <h5 className="font-bold text-slate-900 text-center text-xs sm:text-sm">
                {instrument.studentSheet.title}
              </h5>
              <div className="flex flex-wrap justify-between text-[11px] text-slate-600 pt-1 pb-1 border-b border-slate-100">
                <span>Nama: _______________________</span>
                <span>Kelas: _______________________</span>
                <span>Tanggal: ____________________</span>
              </div>

              <div>
                <strong className="block text-slate-900 mb-1">Petunjuk</strong>
                <p className="text-slate-600 leading-relaxed">
                  {instrument.studentSheet.instructions}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <strong className="block text-slate-900 text-[11px] uppercase tracking-wider">
                  Butir / Aktivitas Asesmen:
                </strong>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
                  {instrument.studentSheet.items.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-2">
                <strong className="block text-slate-900 mb-2">Ruang catatan:</strong>
                <div className="space-y-2">
                  <div className="border-b border-slate-300 h-2"></div>
                  <div className="border-b border-slate-300 h-2"></div>
                  <div className="border-b border-slate-300 h-2"></div>
                </div>
              </div>
            </div>

            {/* Sub-card 2: Panduan Guru */}
            <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/70 space-y-3 text-xs text-slate-800">
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                Panduan Guru — {instrument.title}
              </h5>

              <div className="space-y-1 text-slate-700 leading-relaxed">
                <p><strong>Paradigma:</strong> {instrument.teacherGuide.paradigm}</p>
                <p><strong>Bentuk:</strong> {instrument.teacherGuide.format}</p>
                <p><strong>Sekolah:</strong> {instrument.teacherGuide.schoolLevel}</p>
                <p><strong>Yang dipetakan:</strong> {instrument.teacherGuide.focusAreas.join(', ')}</p>
                <p><strong>Tujuan asesmen:</strong> {instrument.teacherGuide.purpose}</p>
                <p><strong>Alat & bahan:</strong> {instrument.teacherGuide.materials}</p>
              </div>

              <div className="pt-2">
                <strong className="block text-slate-900 mb-1.5">Langkah pelaksanaan:</strong>
                <ol className="space-y-1.5 text-slate-700 leading-relaxed pl-1">
                  {instrument.teacherGuide.implementationSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <strong className="block text-slate-900 mb-1.5">Penyesuaian untuk keberagaman murid:</strong>
                <ul className="space-y-1 text-slate-700 leading-relaxed pl-1">
                  {instrument.teacherGuide.diversityAdjustments.map((adj, idx) => (
                    <li key={idx}>{adj}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sub-card 3: Rencana Tindak Lanjut Diferensiasi */}
            <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white space-y-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Rencana Tindak Lanjut Diferensiasi
                </h5>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Setelah data terkumpul, gunakan panduan tindakan diferensiasi ini untuk merancang modul ajar Anda:
                </p>
              </div>

              <div className="space-y-4">
                {instrument.differentiationFollowUp.scenarios.map((scenario, sIdx) => (
                  <div key={sIdx} className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/40 space-y-2">
                    <p className="text-slate-800 leading-relaxed">
                      <strong className="text-slate-900">{scenario.scenarioTitle} — Jika: </strong>
                      {scenario.condition}
                    </p>
                    <p className="text-slate-700 italic">
                      <strong>Tafsir: </strong>{scenario.interpretation}
                    </p>

                    <div className="overflow-x-auto pt-1">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-3 w-36 border-r border-slate-200">Aspek</th>
                            <th className="py-1.5 px-3">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                          <tr>
                            <td className="py-2 px-3 font-semibold border-r border-slate-200 bg-slate-50/60">Konten</td>
                            <td className="py-2 px-3 leading-relaxed">{scenario.actions.konten}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold border-r border-slate-200 bg-slate-50/60">Proses</td>
                            <td className="py-2 px-3 leading-relaxed">{scenario.actions.proses}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold border-r border-slate-200 bg-slate-50/60">Produk</td>
                            <td className="py-2 px-3 leading-relaxed">{scenario.actions.produk}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold border-r border-slate-200 bg-slate-50/60">Lingkungan belajar</td>
                            <td className="py-2 px-3 leading-relaxed">{scenario.actions.lingkunganBelajar}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions below generated instrument */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('dasmen-lkpd')}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Buat LKPD</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToCollection}
                className="px-4 py-2 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                {savedCollectionBadge ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersimpan di Koleksi!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Simpan ke Koleksi</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDeleteInstrument}
                className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-slate-300 text-rose-600 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Ringkasan Profil Kelas */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            2. Ringkasan Profil Kelas
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Sudah punya data (dari asesmen di atas atau sumber lain)? Rangkum di sini. Boleh diisi singkat dulu, dilengkapi nanti.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* 1. Kesiapan belajar */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Kesiapan belajar — <span className="font-normal text-slate-500">apa yang sudah/belum dikuasai, keragaman level</span>
            </label>
            <textarea
              rows={2}
              value={readinessSummary}
              onChange={(e) => setReadinessSummary(e.target.value)}
              placeholder="mis. Sebagian besar sudah lancar membaca; ada 4 murid perlu pendampingan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 2. Minat */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Minat
            </label>
            <textarea
              rows={2}
              value={interestsSummary}
              onChange={(e) => setInterestsSummary(e.target.value)}
              placeholder="mis. Suka sepak bola, game, konten video, isu lingkungan sungai..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 3. Gaya / preferensi belajar */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Gaya / preferensi belajar
            </label>
            <textarea
              rows={2}
              value={learningPreferences}
              onChange={(e) => setLearningPreferences(e.target.value)}
              placeholder="mis. Lebih suka praktik & diskusi kelompok daripada ceramah..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 4. Kondisi sosial-emosional */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Kondisi sosial-emosional
            </label>
            <textarea
              rows={2}
              value={socialEmotionalSummary}
              onChange={(e) => setSocialEmotionalSummary(e.target.value)}
              placeholder="mis. Percaya diri rendah saat presentasi; kelas cukup kompak..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 5. Latar sosial-budaya */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Latar sosial-budaya
            </label>
            <textarea
              rows={2}
              value={culturalBackground}
              onChange={(e) => setCulturalBackground(e.target.value)}
              placeholder="mis. Mayoritas anak nelayan & pedagang; bahasa ibu Jawa..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 6. Catatan lain (opsional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Catatan lain (opsional) — <span className="font-normal text-slate-500">kebutuhan khusus / inklusi</span>
            </label>
            <textarea
              rows={2}
              value={inclusionNotes}
              onChange={(e) => setInclusionNotes(e.target.value)}
              placeholder="mis. 1 murid slow learner, 1 murid dengan hambatan pendengaran ringan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveProfileAndReturn}
            className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all"
          >
            {profileSavedBadge ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Profil Murid Tersimpan!</span>
              </>
            ) : (
              <span>Simpan profil & kembali</span>
            )}
          </button>

          {profileSavedBadge && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 animate-fadeIn">
              <Check className="w-3.5 h-3.5" /> Konteks murid berhasil diperbarui
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
