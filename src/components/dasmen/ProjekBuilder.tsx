import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  Download, 
  Printer, 
  Award, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Layers, 
  BookOpen, 
  Lightbulb, 
  RefreshCw,
  FolderCheck,
  FileText,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { P5Project, GlobalContext, SavedDocument, AnnualPlanRow } from '../../types';
import { KOKURIKULER_THEMES, DELAPAN_PROFIL_LULUSAN } from '../../data/curriculumData';
import { generateP5Project } from '../../lib/gemini/prompts';
import { exportKokurikulerToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printKokurikuler } from '../../lib/export/pdfExport';
import { Step5Kembangkan } from './Step5Kembangkan';

interface ProjekBuilderProps {
  globalContext: GlobalContext;
  onSaveToCollection: (doc: SavedDocument) => void;
}

export const ProjekBuilder: React.FC<ProjekBuilderProps> = ({ globalContext, onSaveToCollection }) => {
  // Step state (1: Fokus, 2: Dimensi & Tema, 3: Rencana setahun, 4: Pilih projek, 5: Kembangkan)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Identity extraction
  const schoolName = globalContext?.identity?.schoolName || 'SD IT';
  const city = globalContext?.identity?.cityDistrict || 'Kampar';
  const level = globalContext?.identity?.level || 'SD';
  const studentProfile = globalContext?.studentProfile?.readinessSummary || globalContext?.studentProfile?.socialEmotionalState || 'Murid aktif, sebagian memiliki keberagaman latar belakang dan kedisiplinan';
  const communityIssue = globalContext?.community?.localChallenges?.join(', ') || 'Pengelolaan sampah lingkungan, kedisiplinan gotong royong, dan pelestarian budaya lokal';

  // STEP 1: Fokus State
  // Default JP recommendation: SD 252 JP, SMP 360 JP, SMA 396 JP, SMK 180 JP
  const defaultJp = level === 'SD' ? 252 : level === 'SMP' ? 360 : level === 'SMA' ? 396 : 252;
  const [totalJp, setTotalJp] = useState<number>(defaultJp);

  // STEP 2: Dimensi & Tema State
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'Kolaborasi',
    'Kewargaan',
    'Penalaran Kritis',
    'Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa'
  ]);
  const standardThemes = KOKURIKULER_THEMES.dasmen;
  const [customThemes, setCustomThemes] = useState<{ title: string; desc: string }[]>([]);
  const [showAddCustomTheme, setShowAddCustomTheme] = useState<boolean>(false);
  const [customThemeTitleInput, setCustomThemeTitleInput] = useState<string>('');
  const [customThemeDescInput, setCustomThemeDescInput] = useState<string>('');
  // Multi-theme selection: allows selecting more than one theme
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['Gaya Hidup Berkelanjutan']);
  const [focusTopic, setFocusTopic] = useState<string>('Pemanfaatan Sampah Organik & Plastik di Lingkungan Sekolah');

  const allAvailableThemes = [
    ...standardThemes.map(t => ({ ...t, isCustom: false })),
    ...customThemes.map(t => ({ ...t, isCustom: true }))
  ];

  const handleToggleTheme = (themeTitle: string) => {
    setSelectedThemes(prev => {
      let updated: string[];
      if (prev.includes(themeTitle)) {
        if (prev.length <= 1) {
          return prev; // Maintain at least 1 theme selected
        }
        updated = prev.filter(t => t !== themeTitle);
      } else {
        updated = [...prev, themeTitle];
      }
      setProjectData(p => ({ ...p, theme: updated.join(', ') }));
      return updated;
    });
  };

  const handleAddCustomTheme = () => {
    const trimmedTitle = customThemeTitleInput.trim();
    if (!trimmedTitle) return;

    const exists = allAvailableThemes.some(
      t => t.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (!exists) {
      const newTheme = {
        title: trimmedTitle,
        desc: customThemeDescInput.trim() || 'Tema kustom mandiri dirancang sesuai karakteristik satuan pendidikan.'
      };
      setCustomThemes(prev => [...prev, newTheme]);
    }

    // Auto-select the newly created theme
    setSelectedThemes(prev => {
      const updated = prev.includes(trimmedTitle) ? prev : [...prev, trimmedTitle];
      setProjectData(p => ({ ...p, theme: updated.join(', ') }));
      return updated;
    });

    setFocusTopic(`Eksplorasi dan aksi kontekstual tema ${trimmedTitle}`);
    setCustomThemeTitleInput('');
    setCustomThemeDescInput('');
    setShowAddCustomTheme(false);
  };

  const handleRemoveCustomTheme = (titleToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomThemes(prev => prev.filter(t => t.title !== titleToRemove));
    setSelectedThemes(prev => {
      const filtered = prev.filter(t => t !== titleToRemove);
      const updated = filtered.length > 0 ? filtered : ['Gaya Hidup Berkelanjutan'];
      setProjectData(p => ({ ...p, theme: updated.join(', ') }));
      return updated;
    });
  };

  // STEP 3: Rencana Setahun State (Sesuai format image.png)
  const [annualPlanRows, setAnnualPlanRows] = useState<AnnualPlanRow[]>([
    {
      id: 1,
      smt: 1,
      temaProjek: 'Langkah Disiplin: G7KAIH untuk Karakter Mandiri',
      dimensi: ['Keimanan & Ketakwaan', 'Kemandirian'],
      bentuk: 'Gerakan 7 Kebiasaan Anak Indonesia Hebat (G7KAIH)',
      jp: 72,
      jam: 'Harian'
    },
    {
      id: 2,
      smt: 1,
      temaProjek: `Generasi Berdedikasi: Detektif Belajar Bersama Sawit ${city || 'Kampar'}`,
      dimensi: ['Penalaran Kritis', 'Kolaborasi'],
      bentuk: 'Kolaboratif Lintas Disiplin / P5',
      jp: 54,
      jam: 'Blok'
    },
    {
      id: 3,
      smt: 2,
      temaProjek: `Langkah Disiplin: Ibadah Tertib dan Karakter Unggul ${schoolName || 'SD IT'}`,
      dimensi: ['Keimanan & Ketakwaan', 'Kemandirian'],
      bentuk: 'Cara Lainnya (ciri khas satuan/madrasah)',
      jp: 72,
      jam: 'Harian'
    },
    {
      id: 4,
      smt: 2,
      temaProjek: 'Generasi Berdedikasi: Inovasi Pemanfaatan Limbah Sawit Bersama Mitra',
      dimensi: ['Penalaran Kritis', 'Kolaborasi'],
      bentuk: 'Kolaboratif Lintas Disiplin / P5',
      jp: 54,
      jam: 'Blok'
    }
  ]);

  const calculatedTotalJp = annualPlanRows.reduce((acc, row) => acc + (Number(row.jp) || 0), 0);
  const projectCount = annualPlanRows.length || 4;
  const scheduleSystem = 'blok';

  const handleUpdateRow = (id: number, field: keyof AnnualPlanRow, val: any) => {
    setAnnualPlanRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  // STEP 4: Pilih Projek State
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);

  // AI Generated project options - adapts to selected multi-themes
  const primaryThemeTitle = selectedThemes.join(' & ');
  const projectOptions = [
    {
      title: selectedThemes.length === 1 && selectedThemes[0] === 'Gaya Hidup Berkelanjutan'
        ? 'Garda Hijau: Solusi Inovatif Daur Ulang Sampah Organik & Plastik di Lingkungan Sekolah'
        : `Aksi Nyata Terpadu: Integrasi Tema ${primaryThemeTitle} di ${schoolName}`,
      theme: selectedThemes.join(', '),
      focusTopic: focusTopic || `Eksplorasi dan penerapan aksi tema ${primaryThemeTitle}`,
      targetEndPhase: `Peserta didik mampu memahami keterpaduan tema ${primaryThemeTitle}, berkolaborasi secara inklusif dengan warga sekolah, dan menghasilkan aksi nyata berlandaskan Delapan Profil Lulusan.`,
      badge: selectedThemes.length > 1 ? '🌟 Integrasi Multi-Tema' : '✨ Rekomendasi Utama AI',
      desc: `Rangkaian tahapan penyelidikan kontekstual, kolaborasi tim, dan aksi berdampak langsung pada tema ${primaryThemeTitle} yang diintegrasikan dengan karakteristik ${schoolName} di ${city}.`
    },
    {
      title: 'Pandu Bermain Adil: Festival Permainan Tradisional Kampar & Nilai Luhur Pancasila',
      theme: 'Kearifan Lokal',
      focusTopic: 'Pelestarian Permainan Tradisional Ramah Lingkungan & Gotong Royong',
      targetEndPhase: 'Peserta didik mampu menggali kearifan lokal permainan tradisional, mengelola emosi dan aturan main secara musyawarah, serta mempraktikkan keadilan sosial dan kebersamaan.',
      badge: '🌿 Kearifan Lokal',
      desc: 'Eksplorasi permainan tradisional Kampar (Pecah Piring, Lari Tempurung) memanfaatkan pelepah & lidi sawit, simulasi kesepakatan aturan adil bersama orang tua, dan festival bermain.'
    },
    {
      title: 'Kriya Lestari: Kreasi Daur Ulang Bernilai Guna dari Limbah Alam Sekitar',
      theme: 'Kewirausahaan',
      focusTopic: 'Pengembangan Produk Kerajinan Tangan Berbasis Sumber Daya Lokal',
      targetEndPhase: 'Peserta didik mampu mengidentifikasi potensi limbah di sekitarnya, merancang produk kerajinan bernilai guna tinggi, dan menumbuhkan jiwa wirausaha berakhlak mulia.',
      badge: '💡 Inovasi Kreatif',
      desc: 'Riset material bekas bernilai guna di lingkungan sekolah, perancangan prototipe produk kriya, simulasi bazar mini sekolah, dan refleksi wirausaha cilik.'
    }
  ];

  // STEP 5: Final Generated Project Document
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedBadge, setSavedBadge] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<P5Project>({
    id: `KOKUR-${Date.now()}`,
    title: projectOptions[0].title,
    targetLevel: 'dasmen',
    gradeOrAge: level === 'SD' ? 'Kelas 3 (Fase B)' : 'Kelas 7 (Fase D)',
    totalJp: defaultJp,
    theme: projectOptions[0].theme,
    focusTopic: projectOptions[0].focusTopic,
    dimensions: selectedDimensions,
    subDimensions: [
      'Akhlak kepada alam & pemeliharaan ekosistem',
      'Tanggung jawab sosial menjaga kebersihan lingkungan',
      'Kerja sama tim dalam aksi nyata lingkungan',
      'Analisis logis dan pemecahan masalah sampah sekolah'
    ],
    targetEndPhase: projectOptions[0].targetEndPhase,
    annualTimeline: 'Sistem blok mingguan pada pertengahan semester (total 126 JP per semester). Pameran Gelar Karya diadakan pada pekan jeda semester.',
    flowPhases: {
      pengenalan: [
        'Aktivitas 1: Menonton video dokumenter dampak sampah terhadap keanekaragaman hayati dan ekosistem lokal.',
        'Aktivitas 2: Diskusi terarah mengenai urgensi nilai Kewargaan dan Akhlak kepada Alam dalam penanganan sampah.'
      ],
      kontekstualisasi: [
        'Aktivitas 3: Audit sampah mandiri di area kantin dan taman sekolah selama 3 hari berturut-turut.',
        'Aktivitas 4: Wawancara mendalam dengan petugas kebersihan sekolah dan perwakilan Bank Sampah lokal.'
      ],
      aksi: [
        'Aktivitas 5: Pembuatan ecobrick dan komposter skala mini per kelompok kelas.',
        'Aktivitas 6: Kampanye edukasi pengurangan plastik sekali pakai kepada seluruh warga sekolah.'
      ],
      refleksi: [
        'Aktivitas 7: Gelar Karya (Exhibition) pameran produk inovasi daur ulang di hadapan orang tua dan komunitas.',
        'Aktivitas 8: Refleksi diri atas perubahan perilaku hidup bersih dan ikrar komitmen keberlanjutan aksi.'
      ]
    },
    assessmentRubric: [
      {
        dimension: 'Keimanan dan Ketakwaan kepada Tuhan YME',
        subElement: 'Akhlak kepada Alam & Lingkungan',
        stages: {
          mulaiBerkembang: 'Mampu membuang sampah pada tempatnya dengan arahan fasilitator.',
          sedangBerkembang: 'Terbiasa memilah sampah organik dan anorganik di lingkungan sekolah.',
          berkembangSesuaiHarapan: 'Memahami dampak sampah terhadap ciptaan Tuhan dan konsisten menjaga kebersihan lingkungan.',
          sangatBerkembang: 'Menginisiasi aksi pemulihan ekosistem sekolah dan mengedukasi rekan sejawat secara proaktif.'
        }
      },
      {
        dimension: 'Kolaborasi & Kewargaan',
        subElement: 'Kepedulian Sosial dan Kerja Sama Tim',
        stages: {
          mulaiBerkembang: 'Terlibat dalam kelompok namun belum aktif mengambil peran dalam aksi bersama.',
          sedangBerkembang: 'Menjalankan peran kelompok yang telah dibagikan dengan penuh tanggung jawab.',
          berkembangSesuaiHarapan: 'Bekerja sama secara aktif dan saling menghargai pendapat anggota tim demi kemaslahatan bersama.',
          sangatBerkembang: 'Memimpin koordinasi aksi sosial lingkungan dan memberi teladan positif kepada komunitas.'
        }
      },
      {
        dimension: 'Penalaran Kritis',
        subElement: 'Mengidentifikasi dan Mengolah Informasi Masalah',
        stages: {
          mulaiBerkembang: 'Mengetahui fakta bahwa sampah menumpuk namun belum tahu cara menanganinya.',
          sedangBerkembang: 'Mampu menjelaskan jenis-jenis sampah yang ada di sekolah berdasarkan data audit.',
          berkembangSesuaiHarapan: 'Menganalisis penyebab utama timbulan sampah dan merancang solusi daur ulang yang realistis.',
          sangatBerkembang: 'Mengevaluasi efektivitas solusi yang dijalankan dan memberikan rekomendasi kebijakan baru bagi sekolah.'
        }
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Sync state when project option changes
  const applyProjectOption = (idx: number) => {
    setSelectedProjectIndex(idx);
    const chosen = projectOptions[idx];
    const themesArray = chosen.theme.split(', ').map(s => s.trim());
    setSelectedThemes(themesArray);
    setFocusTopic(chosen.focusTopic);
    setProjectData(prev => ({
      ...prev,
      title: chosen.title,
      theme: chosen.theme,
      focusTopic: chosen.focusTopic,
      targetEndPhase: chosen.targetEndPhase,
      totalJp
    }));
  };

  const handleToggleDimension = (dimName: string) => {
    setSelectedDimensions(prev => {
      const exists = prev.includes(dimName);
      const updated = exists ? prev.filter(d => d !== dimName) : [...prev, dimName];
      setProjectData(p => ({ ...p, dimensions: updated }));
      return updated;
    });
  };

  const handleGenerateFinalModule = async () => {
    setIsGenerating(true);
    try {
      const res = await generateP5Project({
        theme: selectedThemes.join(', '),
        focusTopic,
        totalJp,
        gradeOrAge: level === 'SD' ? 'Kelas 3 (Fase B)' : 'Kelas 7 (Fase D)',
        path: 'dasmen',
        globalContext
      });
      setProjectData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
      setCurrentStep(5);
    }
  };

  const [developingRowId, setDevelopingRowId] = useState<number | null>(null);

  const getShortBentuk = (bentuk: string) => {
    if (bentuk.includes('G7KAIH')) return 'G7KAIH';
    if (bentuk.includes('Kolaboratif')) return 'Kolaboratif Lintas Disiplin';
    if (bentuk.includes('Cara Lainnya')) return 'Cara Lainnya';
    return bentuk;
  };

  const handleSelectAndDevelop = async (row: AnnualPlanRow) => {
    setDevelopingRowId(row.id);
    setIsGenerating(true);
    try {
      const initialUpdated: P5Project = {
        ...projectData,
        title: row.temaProjek,
        theme: selectedThemes.join(', ') || 'Gaya Hidup Berkelanjutan',
        focusTopic: row.temaProjek,
        dimensions: row.dimensi,
        totalJp: row.jp,
        annualPlanRows,
        annualTimeline: `Semester ${row.smt} (${row.jam}, ${row.jp} JP) - ${row.bentuk}`
      };
      setProjectData(initialUpdated);

      try {
        const res = await generateP5Project({
          theme: selectedThemes.join(', ') || row.temaProjek,
          focusTopic: row.temaProjek,
          totalJp: row.jp,
          gradeOrAge: level === 'SD' ? 'Kelas 3 (Fase B)' : 'Kelas 7 (Fase D)',
          path: 'dasmen',
          globalContext
        });
        setProjectData({
          ...res,
          title: row.temaProjek,
          dimensions: row.dimensi,
          totalJp: row.jp,
          annualPlanRows,
          annualTimeline: `Semester ${row.smt} (${row.jam}, ${row.jp} JP) - ${row.bentuk}`
        });
      } catch (err) {
        console.warn('AI generator fallback:', err);
      }
    } finally {
      setIsGenerating(false);
      setDevelopingRowId(null);
      setCurrentStep(5);
    }
  };

  const handleSaveDoc = () => {
    const updatedData: P5Project = {
      ...projectData,
      annualPlanRows,
      totalJp: calculatedTotalJp
    };
    const doc: SavedDocument = {
      id: updatedData.id,
      title: `Kokurikuler (DPL): ${updatedData.title}`,
      category: 'kokurikuler',
      subjectOrTheme: updatedData.theme,
      gradeOrAge: updatedData.gradeOrAge,
      createdAt: new Date().toISOString(),
      data: updatedData
    };
    onSaveToCollection(doc);
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 3000);
  };

  const handleExportDocx = async () => {
    try {
      const updatedData: P5Project = {
        ...projectData,
        annualPlanRows,
        totalJp: calculatedTotalJp
      };
      const blob = await exportKokurikulerToDocx(updatedData, globalContext);
      downloadBlob(blob, `Kokurikuler_DPL_${updatedData.title.slice(0, 30)}.docx`);
    } catch (err) {
      console.error('Error exporting Kokurikuler to docx:', err);
    }
  };

  const handlePrint = () => {
    printKokurikuler(projectData, globalContext);
  };

  const stepLabels = [
    { num: 1, label: 'Fokus' },
    { num: 2, label: 'Dimensi & Tema' },
    { num: 3, label: 'Rencana setahun' },
    { num: 4, label: 'Pilih projek' },
    { num: 5, label: 'Kembangkan' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn text-left pb-12">
      {/* Breadcrumb & Title Sesuai koku.png */}
      <div>
        <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          Kokurikuler / Projek
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2942] tracking-tight mt-1 font-serif">
          Buat Modul Kokurikuler
        </h2>
      </div>

      {/* 5 Step Pills / Navigation Bar Sesuai koku.png */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {stepLabels.map((step) => {
          const isActive = currentStep === step.num;
          const isPassed = currentStep > step.num;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => setCurrentStep(step.num)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-white border-2 border-[#0f2942] font-bold text-[#0f2942]'
                  : 'bg-white border border-slate-200 font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isPassed
                    ? 'bg-emerald-700 text-white'
                    : isActive
                    ? 'bg-[#0f2942] text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: FOKUS (PERSIS SEPERTI GAMBAR koku.png) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-[#0f2942]">
              Fokus kokurikuler
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Konteks sekolah, profil murid &amp; isu komunitas sudah tersimpan. Lengkapi alokasi jam, lalu biar AI merekomendasikan dimensi &amp; tema.
            </p>
          </div>

          {/* Form: Total alokasi JP kokurikuler / tahun */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-900">
              Total alokasi JP kokurikuler / tahun
            </label>
            <input
              type="number"
              value={totalJp}
              onChange={(e) => setTotalJp(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0f2942] transition-colors"
              placeholder="252"
            />
          </div>

          {/* Rekomendasi Box Kemendikdasmen (Sesuai koku.png) */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 flex items-start sm:items-center gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <p className="leading-relaxed">
              Rekomendasi Kemendikdasmen: <strong>SD 252 JP</strong> · <strong>SMP 360 JP</strong> · <strong>SMA 396 JP</strong> · <strong>SMK 180 JP</strong>. Sesuaikan dengan sekolahmu.
            </p>
          </div>

          {/* Ringkasan Konteks Sekolah Tersimpan */}
          <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs text-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Data Konteks Sekolah Siap
              </span>
              <span className="text-[11px] text-slate-500">{schoolName} · {city}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
              <p>• <strong>Profil Murid:</strong> {studentProfile.slice(0, 75)}...</p>
              <p>• <strong>Isu Komunitas:</strong> {communityIssue.slice(0, 75)}...</p>
            </div>
          </div>

          {/* Tombol Aksi: Rekomendasikan dimensi & tema → (Sesuai koku.png) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Rekomendasikan dimensi &amp; tema →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: DIMENSI & TEMA */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-[#0f2942]">
              Dimensi &amp; Tema Kokurikuler
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AI telah memetakan rekomendasi Delapan Profil Lulusan (DPL) serta tema kokurikuler Kemendikdasmen berdasarkan konteks {schoolName} di {city} dengan alokasi {totalJp} JP/tahun.
            </p>
          </div>

          {/* Sasaran Delapan Profil Lulusan (DPL) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Pilih Dimensi Sasaran Delapan Profil Lulusan (DPL):
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {selectedDimensions.length} dimensi dipilih
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DELAPAN_PROFIL_LULUSAN.map((dpl) => {
                const isSelected = selectedDimensions.includes(dpl.name);
                const isAiRecommended = ['Kolaborasi', 'Kewargaan', 'Penalaran Kritis', 'Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa'].includes(dpl.name);

                return (
                  <div
                    key={dpl.id}
                    onClick={() => handleToggleDimension(dpl.name)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-1 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/70 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {dpl.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isAiRecommended && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-amber-700" /> AI
                          </span>
                        )}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {dpl.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pilihan Tema Utama Kemendikdasmen & Kustom */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Pilih Tema Utama Kokurikuler:
                </label>
                <p className="text-[11px] text-slate-500">
                  Pilih satu atau <strong>beberapa tema sekaligus</strong> dari referensi Kemendikdasmen atau tema kustom sekolah.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomTheme(!showAddCustomTheme)}
                className="text-xs font-semibold text-[#0f2942] hover:text-[#1a3a5a] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#0f2942]" />
                <span>+ Tambah Tema Sendiri (Kustom)</span>
              </button>
            </div>

            {/* Inputan untuk menambahkan tema sendiri */}
            {showAddCustomTheme && (
              <div className="p-4 bg-sky-50/60 border-2 border-dashed border-sky-300 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Tambah Tema Kokurikuler Kustom Sendiri
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomTheme(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  Tuliskan tema baru yang dirancang khusus sesuai dengan visi, keunikan lingkungan, atau program unggulan satuan pendidikan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Nama Tema Sendiri <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customThemeTitleInput}
                      onChange={(e) => setCustomThemeTitleInput(e.target.value)}
                      placeholder="Contoh: Literasi Digital & AI, Kebudayaan Sungai Kampar"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTheme();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Deskripsi Singkat Tema (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customThemeDescInput}
                      onChange={(e) => setCustomThemeDescInput(e.target.value)}
                      placeholder="Contoh: Eksplorasi teknologi digital beretika dan kearifan ekosistem sungai"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTheme();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomTheme(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomTheme}
                    disabled={!customThemeTitleInput.trim()}
                    className="px-4 py-1.5 bg-[#0f2942] hover:bg-[#1a3a5a] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tambahkan Tema Ini</span>
                  </button>
                </div>
              </div>
            )}

            {/* Grid Tema Kemendikdasmen + Tema Kustom (Mendukung Multi-Pilihan) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {allAvailableThemes.map((t, idx) => {
                const isSelected = selectedThemes.includes(t.title);
                const isTopPick = t.title === 'Gaya Hidup Berkelanjutan';

                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleTheme(t.title)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs space-y-1 relative select-none ${
                      isSelected
                        ? 'border-[#0f2942] bg-sky-50/70 shadow-2xs ring-2 ring-[#0f2942]/25'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-start gap-1.5 font-bold text-slate-900 leading-snug">
                        <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-[#0f2942] text-white' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{t.title}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isTopPick && !t.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                            Rekomendasi
                          </span>
                        )}
                        {t.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold">
                            Kustom
                          </span>
                        )}
                        {t.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleRemoveCustomTheme(t.title, e)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                            title="Hapus tema kustom ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 pl-5.5">
                      {t.desc}
                    </p>
                  </div>
                );
              })}

              {/* Card Tambah Tema Sendiri langsung di dalam grid */}
              <div
                onClick={() => setShowAddCustomTheme(true)}
                className="p-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0f2942] bg-slate-50/60 hover:bg-sky-50/30 transition-all cursor-pointer text-xs flex flex-col items-center justify-center text-center space-y-1 min-h-[90px]"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-700 text-[11px]">+ Tema Sendiri</span>
                <span className="text-[10px] text-slate-500">Tulis tema kustom sekolah</span>
              </div>
            </div>

            {/* Status Tema Terpilih (Multi-Tema) */}
            <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#0f2942]" />
                  Tema Terpilih ({selectedThemes.length} tema):
                </span>
                <span className="text-[11px] text-slate-500">
                  Centang lebih dari satu tema untuk perancangan terpadu
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {selectedThemes.map((th, i) => {
                  const isCustom = customThemes.some(c => c.title === th);
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                        isCustom
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-sky-100 text-[#0f2942] border border-sky-300'
                      }`}
                    >
                      <Check className="w-3 h-3 text-[#0f2942]" />
                      <span>{th}</span>
                      {selectedThemes.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTheme(th);
                          }}
                          className="text-slate-500 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                          title="Batalkan pilihan tema ini"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fokus Isu Masalah */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs sm:text-sm font-semibold text-slate-900">
              Fokus Topik Masalah di Lingkungan Sekolah:
            </label>
            <input
              type="text"
              value={focusTopic}
              onChange={(e) => setFocusTopic(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
              placeholder="Contoh: Pemanfaatan Sampah Organik & Plastik di Lingkungan Sekolah"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Susun rencana setahun →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: RENCANA SETAHUN (Format Persis Sesuai image.png) */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
          {/* Judul Bagian */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#0f2942] font-serif">
            Rencana Kokurikuler Setahun
          </h3>

          {/* Banner Informasi AI */}
          <div className="bg-[#eef5fc] text-[#0f2942] px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 border border-sky-100/60">
            <span className="text-base leading-none">✎</span>
            <span>
              AI sudah menyusun rencana. <strong>Edit langsung di tabel</strong> bila perlu.
            </span>
          </div>

          {/* Kartu Rencana Kokurikuler Sekolah */}
          <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-white space-y-3.5 shadow-2xs">
            {/* Header Sekolah & Total JP */}
            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#0f2942]">
                Rencana Kokurikuler {schoolName || 'SD IT'}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Jenjang: {level || 'SD'} | Total: {calculatedTotalJp} JP
              </p>
            </div>

            {/* Sub-banner Petunjuk Edit */}
            <div className="bg-[#eef5fc] text-[#0f2942] px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 border border-sky-100/60">
              <span className="text-sm leading-none">✎</span>
              <span>
                Klik sel <strong>Tema/Projek</strong> atau dropdown untuk mengedit langsung.
              </span>
            </div>

            {/* Tabel Rencana Kokurikuler Persis image.png */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-[#0f2942] text-white">
                  <tr>
                    <th className="py-2.5 px-3 text-center font-bold text-xs uppercase tracking-wider w-12 border-r border-slate-700/60">
                      NO
                    </th>
                    <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider w-20 border-r border-slate-700/60 text-center">
                      SMT
                    </th>
                    <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-slate-700/60 text-left">
                      TEMA / PROJEK
                    </th>
                    <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider w-48 border-r border-slate-700/60 text-left">
                      DIMENSI
                    </th>
                    <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider w-44 border-r border-slate-700/60 text-left">
                      BENTUK
                    </th>
                    <th className="py-2.5 px-3 text-center font-bold text-xs uppercase tracking-wider w-16 border-r border-slate-700/60">
                      JP
                    </th>
                    <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider w-28 text-center">
                      JAM
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {annualPlanRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* NO */}
                      <td className="py-3.5 px-3 text-center font-medium text-slate-700 border-r border-slate-200 align-middle">
                        {row.id}
                      </td>

                      {/* SMT Dropdown */}
                      <td className="py-3.5 px-2 border-r border-slate-200 text-center align-middle">
                        <select
                          value={row.smt}
                          onChange={(e) => handleUpdateRow(row.id, 'smt', Number(e.target.value))}
                          aria-label={`Pilih Semester baris ${row.id}`}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] cursor-pointer shadow-2xs"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                        </select>
                      </td>

                      {/* TEMA / PROJEK */}
                      <td className="py-3 px-3 border-r border-slate-200 align-middle">
                        <textarea
                          rows={2}
                          value={row.temaProjek}
                          onChange={(e) => handleUpdateRow(row.id, 'temaProjek', e.target.value)}
                          placeholder="Tuliskan nama tema / projek..."
                          className="w-full px-2 py-1.5 text-xs text-slate-900 border border-transparent hover:border-slate-200 focus:border-slate-300 focus:bg-white rounded-lg resize-none outline-none leading-relaxed transition-colors font-medium"
                        />
                      </td>

                      {/* DIMENSI (Pill Badges Biru Muda) */}
                      <td className="py-3.5 px-3 border-r border-slate-200 align-middle">
                        <div className="flex flex-col gap-1.5 items-start">
                          {row.dimensi.map((dim, dIdx) => (
                            <span
                              key={dIdx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#e8f2fc] text-[#0f2942] border border-sky-200/80 whitespace-nowrap"
                            >
                              {dim}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* BENTUK Dropdown */}
                      <td className="py-3.5 px-2 border-r border-slate-200 align-middle">
                        <select
                          value={row.bentuk}
                          onChange={(e) => handleUpdateRow(row.id, 'bentuk', e.target.value)}
                          aria-label={`Pilih Bentuk baris ${row.id}`}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] cursor-pointer shadow-2xs truncate"
                        >
                          <option value="Gerakan 7 Kebiasaan Anak Indonesia Hebat (G7KAIH)">
                            Gerakan 7 Kebias...
                          </option>
                          <option value="Kolaboratif Lintas Disiplin / P5">
                            Kolaboratif Lintas...
                          </option>
                          <option value="Cara Lainnya (ciri khas satuan/madrasah)">
                            Cara Lainnya (ciri...
                          </option>
                        </select>
                      </td>

                      {/* JP Input */}
                      <td className="py-3.5 px-2 border-r border-slate-200 text-center align-middle">
                        <input
                          type="number"
                          value={row.jp}
                          onChange={(e) => handleUpdateRow(row.id, 'jp', Number(e.target.value))}
                          aria-label={`Alokasi JP baris ${row.id}`}
                          className="w-14 px-1.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 text-center bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] shadow-2xs"
                        />
                      </td>

                      {/* JAM Dropdown */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        <select
                          value={row.jam}
                          onChange={(e) => handleUpdateRow(row.id, 'jam', e.target.value)}
                          aria-label={`Pilih Sistem Jam baris ${row.id}`}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] cursor-pointer shadow-2xs"
                        >
                          <option value="Harian">Harian</option>
                          <option value="Blok">Blok</option>
                          <option value="Mingguan">Mingguan</option>
                          <option value="Parsial">Parsial</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifikasi Toast Tersimpan jika ada */}
          {savedBadge && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Rencana Kokurikuler berhasil disimpan ke Koleksi Dokumen!</span>
            </div>
          )}

          {/* Tombol Aksi Bawah Persis Seperti image.png */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportDocx}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <Download className="w-4 h-4 text-slate-700" />
                <span>Unduh (Word)</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDoc}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <Bookmark className="w-4 h-4 text-purple-700" />
                <span>Simpan ke Koleksi</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <span>Lanjut: Pilih Projek →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: PILIH PROJEK (Format Persis Sesuai pilih proyek.png) */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0f2942] font-serif">
              Pilih Projek untuk Dikembangkan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Kembangkan tiap projek jadi modul kokurikuler lengkap dengan rubrik &amp; asesmen.
            </p>
          </div>

          {/* 4 Cards Sesuai Rencana Setahun */}
          <div className="space-y-4">
            {annualPlanRows.map((row) => (
              <div
                key={row.id}
                className="border border-slate-200/90 rounded-2xl p-5 sm:p-6 bg-white space-y-3 shadow-2xs hover:border-slate-300 transition-all"
              >
                {/* 3 Badges: Smt, Bentuk, JP */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#eef5fc] text-[#0f2942] border border-sky-100/80 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    Smt {row.smt}
                  </span>
                  <span className="bg-[#eef5fc] text-[#0f2942] border border-sky-100/80 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    {getShortBentuk(row.bentuk)}
                  </span>
                  <span className="bg-[#eef5fc] text-[#0f2942] border border-sky-100/80 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    {row.jp} JP
                  </span>
                </div>

                {/* Judul & Dimensi */}
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {row.id}. {row.temaProjek}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Dimensi: {row.dimensi.join(', ')}
                  </p>
                </div>

                {/* Tombol Kembangkan */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectAndDevelop(row)}
                    disabled={isGenerating}
                    className="px-5 py-2 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors disabled:opacity-60"
                  >
                    {isGenerating && developingRowId === row.id ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                        <span>Menyusun...</span>
                      </>
                    ) : (
                      <span>Kembangkan →</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: KEMBANGKAN (MODUL KOKURIKULER SESUAI FORMAT kembangko.pdf) */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <Step5Kembangkan
          projectData={projectData}
          annualPlanRows={annualPlanRows}
          schoolName={schoolName}
          level={level}
          onSaveToCollection={onSaveToCollection}
          handlePrint={handlePrint}
          handleExportDocx={handleExportDocx}
          onBackToStep4={() => setCurrentStep(4)}
        />
      )}
    </div>
  );
};
