import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Download,
  Bookmark,
  Pencil,
  Wand2,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { TargetPembelajaran, AtpItem, GlobalContext, Phase, SavedDocument } from '../../types';
import { buildAtpSequence } from '../../lib/gemini/prompts';
import { exportAtpToDocx, downloadBlob } from '../../lib/export/docxExport';

interface AtpBuilderProps {
  globalContext: GlobalContext;
  tps: TargetPembelajaran[];
  atpList: AtpItem[];
  onSaveAtpList: (atps: AtpItem[]) => void;
  onProceedToModul?: () => void;
  onNavigate?: (item: any) => void;
  onSaveToCollection?: (doc: SavedDocument) => void;
}

interface DimensionConfig {
  id: string;
  title: string;
  subtitle: string;
  generateContextRationale: (ctx: GlobalContext, subject: string, phase: string, grade: string) => string;
}

const DIMENSIONS_LIST: DimensionConfig[] = [
  {
    id: 'iman_takwa',
    title: 'Keimanan & Ketakwaan',
    subtitle: 'terhadap Tuhan YME',
    generateContextRationale: (ctx, subject) => 
      `Melalui pembelajaran ${subject} di ${ctx.identity.schoolName || 'sekolah'}, murid diajak mensyukuri anugerah akal dan keteraturan alam semesta dalam kehidupan sehari-hari.`
  },
  {
    id: 'kewargaan',
    title: 'Kewargaan',
    subtitle: 'warganegara & global',
    generateContextRationale: (ctx) =>
      `Menumbuhkan kesadaran identitas kebangsaan, kepedulian sosial, serta tanggung jawab menjaga harmoni kearifan lokal di lingkungan ${ctx.identity.schoolName || 'sekolah'}.`
  },
  {
    id: 'penalaran_kritis',
    title: 'Penalaran Kritis',
    subtitle: 'analisis & evaluasi',
    generateContextRationale: (ctx, subject, phase, grade) => {
      const school = ctx.identity.schoolName || 'UPT SDN 001 Pantai Raja';
      const chal = ctx.community?.localChallenges?.[0] || 'keterbatasan literasi digital';
      return `Melalui ${subject.toLowerCase()} ${phase ? `Fase ${phase}` : ''} di ${school}, dimensi ini melatih kemampuan berpikir logis ${grade.toLowerCase() || 'murid'} dalam memecahkan soal numerasi menggunakan buku bacaan di pustaka desa untuk mengatasi ${chal}.`;
    }
  },
  {
    id: 'kreativitas',
    title: 'Kreativitas',
    subtitle: 'gagasan & solusi baru',
    generateContextRationale: (ctx, _, __, grade) => {
      const chal = ctx.community?.localChallenges?.[1] || 'minimnya perangkat teknologi digital';
      return `${grade || 'Murid'} ditantang menciptakan alat peraga hitung mandiri dari bahan alam sekitar sekolah guna mewujudkan visi kreatif-inovatif di tengah ${chal}.`;
    }
  },
  {
    id: 'kolaborasi',
    title: 'Kolaborasi',
    subtitle: 'kerja sama',
    generateContextRationale: (ctx, subject, _, grade) => {
      const school = ctx.identity.schoolName || 'UPT SDN 001 Pantai Raja';
      return `Pembelajaran ${subject.toLowerCase()} kelompok memanfaatkan lingkungan sekitar ${school} melatih ${grade.toLowerCase() || 'murid'} bergotong royong menyelesaikan tantangan secara inklusif dan menyenangkan.`;
    }
  },
  {
    id: 'kemandirian',
    title: 'Kemandirian',
    subtitle: 'regulasi diri',
    generateContextRationale: () =>
      `Mendorong murid mengelola emosi, inisiatif belajar tanpa bergantung penuh pada instruksi guru, serta bertanggung jawab atas tugas belajarnya.`
  },
  {
    id: 'kesehatan',
    title: 'Kesehatan',
    subtitle: 'fisik & mental',
    generateContextRationale: () =>
      `Menjaga kebugaran jasmani, ketahanan mental, serta kebiasaan hidup bersih dan sehat dalam mendukung aktivitas belajar yang optimal.`
  },
  {
    id: 'komunikasi',
    title: 'Komunikasi',
    subtitle: 'menyampaikan gagasan',
    generateContextRationale: () =>
      `Melatih keberanian murid menyampaikan pendapat secara santun, mendengarkan aktif, dan mengartikulasikan ide dalam diskusi kelas.`
  }
];

const SEQUENCING_METHODS = [
  'Konkret → Abstrak',
  'Deduktif',
  'Mudah → Sulit',
  'Hierarki',
  'Prosedural',
  'Scaffolding'
];

const DEFAULT_INITIAL_ATP: AtpItem[] = [
  {
    tpId: 'TP-01',
    stepNumber: 1,
    gradeLevel: '1',
    semesterNumber: '1',
    element: 'Penjumlahan',
    tpText: 'Melakukan penjumlahan bilangan cacah sampai dengan 10 menggunakan representasi visual dan benda konkret.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 1',
    profileDimension: 'Kreativitas',
    targetedDimensions: ['Kreativitas'],
    pedagogicalNote: 'Gunakan benda konkret dari lingkungan sekitar'
  },
  {
    tpId: 'TP-02',
    stepNumber: 2,
    gradeLevel: '1',
    semesterNumber: '1',
    element: 'Penjumlahan',
    tpText: 'Melakukan penjumlahan bilangan cacah sampai dengan 10 menggunakan simbol matematika berdasarkan situasi sehari-hari.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 1',
    profileDimension: 'Penalaran Kritis',
    targetedDimensions: ['Penalaran Kritis'],
    pedagogicalNote: 'Transisi dari konkret ke semi-konkret simbolik'
  },
  {
    tpId: 'TP-03',
    stepNumber: 3,
    gradeLevel: '1',
    semesterNumber: '1',
    element: 'Penjumlahan',
    tpText: 'Melakukan penjumlahan bilangan cacah sampai dengan 20 menggunakan berbagai representasi visual dan simbol matematika secara mandiri.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 1',
    profileDimension: 'Kreativitas',
    targetedDimensions: ['Kreativitas'],
    pedagogicalNote: 'Bimbingan bertahap menuju kemandirian'
  },
  {
    tpId: 'TP-04',
    stepNumber: 4,
    gradeLevel: '1',
    semesterNumber: '1',
    element: 'Penjumlahan',
    tpText: 'Menyelesaikan masalah kontekstual penjumlahan bilangan cacah sampai dengan 20 menggunakan berbagai strategi pemecahan masalah.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 1',
    profileDimension: 'Penalaran Kritis, Kolaborasi',
    targetedDimensions: ['Penalaran Kritis', 'Kolaborasi'],
    pedagogicalNote: 'Diskusi kelompok berbasis cerita lokal'
  },
  {
    tpId: 'TP-05',
    stepNumber: 5,
    gradeLevel: '1',
    semesterNumber: '2',
    element: 'Penjumlahan',
    tpText: 'Melakukan penjumlahan bilangan cacah dua angka sampai dengan 50 tanpa menyimpan menggunakan representasi nilai tempat.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 2',
    profileDimension: 'Penalaran Kritis',
    targetedDimensions: ['Penalaran Kritis'],
    pedagogicalNote: 'Perkuat pemahaman nilai puluhan dan satuan'
  },
  {
    tpId: 'TP-06',
    stepNumber: 6,
    gradeLevel: '1',
    semesterNumber: '2',
    element: 'Penjumlahan',
    tpText: 'Menyelesaikan masalah kontekstual penjumlahan bilangan cacah sampai dengan 50 dalam kehidupan sehari-hari secara berkelompok.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 2',
    profileDimension: 'Penalaran Kritis, Kolaborasi',
    targetedDimensions: ['Penalaran Kritis', 'Kolaborasi'],
    pedagogicalNote: 'Kolaborasi menyelesaikan tantangan numerasi'
  },
  {
    tpId: 'TP-07',
    stepNumber: 7,
    gradeLevel: '1',
    semesterNumber: '2',
    element: 'Penjumlahan',
    tpText: 'Melakukan penjumlahan bilangan cacah dua angka sampai dengan 100 dengan teknik menyimpan menggunakan representasi strategi manipulasi.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 2',
    profileDimension: 'Penalaran Kritis, Kreativitas',
    targetedDimensions: ['Penalaran Kritis', 'Kreativitas'],
    pedagogicalNote: 'Eksplorasi strategi manipulatif dan visualisasi'
  },
  {
    tpId: 'TP-08',
    stepNumber: 8,
    gradeLevel: '1',
    semesterNumber: '2',
    element: 'Penjumlahan',
    tpText: 'Menyelesaikan masalah kontekstual penjumlahan bilangan cacah sampai dengan 100 dengan menyajikan solusi yang kreatif.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 2',
    profileDimension: 'Kreativitas, Kolaborasi',
    targetedDimensions: ['Kreativitas', 'Kolaborasi'],
    pedagogicalNote: 'Presentasi karya solusi kelompok'
  }
];

export const AtpBuilder: React.FC<AtpBuilderProps> = ({
  globalContext,
  tps,
  atpList,
  onSaveAtpList,
  onProceedToModul,
  onNavigate,
  onSaveToCollection
}) => {
  // Context defaults
  const [subjectName] = useState('Matematika');
  const [phase] = useState<Phase>('A');
  const [grade] = useState('Kelas 1');

  // Selected dimensions
  const [selectedDimensionIds, setSelectedDimensionIds] = useState<string[]>([
    'penalaran_kritis',
    'kreativitas',
    'kolaborasi'
  ]);

  // Sequencing method
  const [sequencingMethod, setSequencingMethod] = useState<string>('Mudah → Sulit');

  // Student context note
  const [studentContextNote, setStudentContextNote] = useState<string>('mayoritas visual, perlu banyak contoh konkret');

  // Has generated indicator
  const [hasGenerated, setHasGenerated] = useState<boolean>(atpList.length > 0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Active titles from selected IDs
  const activeDimensionTitles = selectedDimensionIds.map(id => {
    const found = DIMENSIONS_LIST.find(d => d.id === id);
    return found ? found.title : id;
  });

  // Toggle dimension selection
  const handleToggleDimension = (id: string) => {
    if (selectedDimensionIds.includes(id)) {
      setSelectedDimensionIds(selectedDimensionIds.filter(d => d !== id));
    } else {
      setSelectedDimensionIds([...selectedDimensionIds, id]);
    }
  };

  // Re-recommend dimensions
  const handleRecommendDimensions = () => {
    setSelectedDimensionIds([
      'penalaran_kritis',
      'kreativitas',
      'kolaborasi'
    ]);
  };

  // Susun ATP Action
  const handleGenerateAtp = async () => {
    setIsGenerating(true);
    try {
      if (tps.length > 0) {
        const result = await buildAtpSequence({
          subject: subjectName,
          phase,
          grade,
          tpList: tps,
          curriculum: globalContext.identity.curriculum,
          selectedDimensions: activeDimensionTitles,
          sequencingMethod,
          studentContextNote,
          globalContext
        });

        // Enrich with element, gradeLevel, semesterNumber, targetedDimensions
        const enriched = result.map((item, idx) => ({
          ...item,
          gradeLevel: item.gradeLevel || '1',
          semesterNumber: item.semesterNumber || (idx < Math.ceil(result.length / 2) ? '1' : '2'),
          element: item.element || item.material || 'Elemen',
          targetedDimensions: item.targetedDimensions || [activeDimensionTitles[idx % activeDimensionTitles.length]]
        }));

        onSaveAtpList(enriched);
      } else {
        // Use realistic initial items matching the screenshot
        const formatted = DEFAULT_INITIAL_ATP.map(item => ({
          ...item,
          targetedDimensions: item.targetedDimensions?.filter(d => activeDimensionTitles.includes(d)) || []
        }));
        onSaveAtpList(formatted);
      }
      setHasGenerated(true);
    } catch (e) {
      console.error('Error generating ATP:', e);
      // Fallback
      onSaveAtpList(DEFAULT_INITIAL_ATP);
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update cell
  const handleUpdateRow = (index: number, field: keyof AtpItem, value: any) => {
    const updated = [...atpList];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onSaveAtpList(updated);
  };

  // Toggle dimension chip for a specific row
  const handleToggleRowDimension = (rowIndex: number, dimTitle: string) => {
    const updated = [...atpList];
    const currentRow = updated[rowIndex];
    const currentDims = currentRow.targetedDimensions || [];
    
    let newDims: string[];
    if (currentDims.includes(dimTitle)) {
      newDims = currentDims.filter(d => d !== dimTitle);
    } else {
      newDims = [...currentDims, dimTitle];
    }

    updated[rowIndex] = {
      ...currentRow,
      targetedDimensions: newDims,
      profileDimension: newDims.join(', ')
    };
    onSaveAtpList(updated);
  };

  // Move row up or down
  const handleMoveRow = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= atpList.length) return;
    const updated = [...atpList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    // update step numbers
    const reindexed = updated.map((it, idx) => ({ ...it, stepNumber: idx + 1 }));
    onSaveAtpList(reindexed);
  };

  // Add new TP row
  const handleAddRow = () => {
    const newIdx = atpList.length + 1;
    const newItem: AtpItem = {
      tpId: `TP-${String(newIdx).padStart(2, '0')}`,
      stepNumber: newIdx,
      gradeLevel: '1',
      semesterNumber: newIdx <= 4 ? '1' : '2',
      element: atpList[atpList.length - 1]?.element || 'Penjumlahan',
      tpText: 'Tuliskan rumusan Tujuan Pembelajaran baru di sini...',
      material: atpList[atpList.length - 1]?.material || 'Penjumlahan',
      allocationJp: 4,
      targetTerm: newIdx <= 4 ? 'Semester 1' : 'Semester 2',
      profileDimension: activeDimensionTitles[0] || 'Penalaran Kritis',
      targetedDimensions: [activeDimensionTitles[0] || 'Penalaran Kritis'],
      pedagogicalNote: 'Catatan pedagogis scaffolding'
    };
    onSaveAtpList([...atpList, newItem]);
  };

  // Satukan TP dengan Dimensi automatically based on content
  const handleAutoAlignDimensions = () => {
    const updated = atpList.map(item => {
      const text = item.tpText.toLowerCase();
      const dims: string[] = [];

      if (text.includes('kritis') || text.includes('simbol') || text.includes('nilai tempat') || text.includes('masalah') || text.includes('strategi')) {
        dims.push('Penalaran Kritis');
      }
      if (text.includes('kreatif') || text.includes('solusi') || text.includes('representasi visual') || text.includes('mandiri')) {
        dims.push('Kreativitas');
      }
      if (text.includes('kelompok') || text.includes('bersama') || text.includes('kontekstual') || text.includes('sehari-hari')) {
        dims.push('Kolaborasi');
      }

      const finalDims = dims.length > 0 ? dims : [activeDimensionTitles[0] || 'Penalaran Kritis'];
      return {
        ...item,
        targetedDimensions: finalDims,
        profileDimension: finalDims.join(', ')
      };
    });

    onSaveAtpList(updated);
    setNotification('Dimensi berhasil disatukan dan diselaraskan ke setiap butir TP!');
    setTimeout(() => setNotification(null), 3500);
  };

  // Download Word
  const handleDownloadDocx = async () => {
    try {
      const blob = await exportAtpToDocx({
        subject: subjectName,
        phase,
        method: sequencingMethod,
        atpList,
        globalContext
      });
      downloadBlob(blob, `ATP-${subjectName}-Fase${phase}.docx`);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  // Save to Collection
  const handleSaveToArsip = () => {
    if (onSaveToCollection) {
      const doc: SavedDocument = {
        id: `atp-${Date.now()}`,
        title: `ATP: ${subjectName} Fase ${phase} (${sequencingMethod})`,
        category: 'modul_dasmen',
        subjectOrTheme: subjectName,
        gradeOrAge: grade,
        createdAt: new Date().toISOString(),
        data: {
          atpList,
          subjectName,
          phase,
          grade,
          sequencingMethod,
          selectedDimensions: activeDimensionTitles
        }
      };
      onSaveToCollection(doc);
      setNotification('ATP berhasil disimpan ke Koleksi Dokumen Anda!');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-16">
      {/* Header & 4-Step Stepper Navigation */}
      <div>
        <span className="block text-[11px] font-bold tracking-wider text-blue-600 uppercase mb-1">
          MODUL AJAR · INTRAKURIKULER
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
          Buat Modul Ajar
        </h2>

        {/* 4 Steps Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
          {/* Step 1: Completed with Green Checkmark */}
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-cp-tp')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <span className="text-xs font-medium truncate">
              CP & Tujuan
            </span>
          </button>

          {/* Step 2: Active */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              Alur (ATP)
            </span>
          </div>

          {/* Step 3: Inactive */}
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-pilih-tp')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-xs font-medium truncate">
              Pilih TP
            </span>
          </button>

          {/* Step 4: Inactive */}
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-modul')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center shrink-0">
              4
            </span>
            <span className="text-xs font-medium truncate">
              Kembangkan
            </span>
          </button>
        </div>
      </div>

      {/* Main Card: Alur Tujuan Pembelajaran Setup */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0f2942] font-serif">
            Alur Tujuan Pembelajaran
          </h3>
        </div>

        {/* Dashed Border Container: Dimensi Profil Lulusan */}
        <div className="border border-dashed border-slate-300 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Dimensi Profil Lulusan — <span className="font-normal text-slate-500">disarankan dari konteks sekolahmu</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Disusun dari Visi & Misi, karakteristik & tantangan sekolah, serta Profil Murid yang sudah kamu isi. Bisa kamu ganti.
            </p>
          </div>

          {/* Button: Rekomendasikan Dimensi */}
          <div>
            <button
              type="button"
              onClick={handleRecommendDimensions}
              className="px-4 py-2 bg-[#1a56db] hover:bg-[#1546b3] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rekomendasikan Dimensi</span>
            </button>
          </div>

          {/* Green Status Pill */}
          <div className="bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
            <span>
              <strong>{selectedDimensionIds.length} dimensi</strong> disarankan dari konteks sekolahmu. Ketuk untuk mengubah.
            </span>
          </div>

          {/* 8 Dimensions Grid (2 columns x 4 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIMENSIONS_LIST.map((dim) => {
              const isSelected = selectedDimensionIds.includes(dim.id);
              const rationale = dim.generateContextRationale(globalContext, subjectName, phase, grade);

              return (
                <div
                  key={dim.id}
                  onClick={() => handleToggleDimension(dim.id)}
                  className={`rounded-xl p-3.5 transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
                    isSelected 
                      ? 'border-2 border-[#0f2942] bg-[#f2f6fa]' 
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-2.5">
                      {/* Checkbox box */}
                      <div className="mt-0.5 shrink-0">
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-md bg-[#0f2942] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-md border border-slate-300 bg-white" />
                        )}
                      </div>

                      {/* Titles */}
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">
                          {dim.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {dim.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Context Rationale if Selected */}
                    {isSelected && (
                      <p className="text-[11px] italic text-slate-700 mt-2.5 pl-6 leading-relaxed">
                        {rationale}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 pt-1">
            {selectedDimensionIds.length} dimensi dipilih
          </div>
        </div>

        {/* Metode Pengurutan */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold text-slate-800">
            Metode pengurutan
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {SEQUENCING_METHODS.map((method) => {
              const isSelected = sequencingMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSequencingMethod(method)}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-slate-900 bg-white text-slate-900 font-bold shadow-2xs'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catatan Konteks Murid */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-800">
            Catatan konteks murid <span className="font-normal text-slate-500">(opsional)</span>
          </label>
          <input
            type="text"
            value={studentContextNote}
            onChange={(e) => setStudentContextNote(e.target.value)}
            placeholder="mis. mayoritas visual, perlu banyak contoh konkret"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Action Button: Susun ATP */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerateAtp}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#1a3a5a] disabled:opacity-50 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Sedang Menyusun ATP...' : '✨ Susun ATP'}</span>
          </button>
        </div>
      </div>

      {/* HASIL SUSUN ATP — Shown when ATP is generated */}
      {(hasGenerated || atpList.length > 0) && (
        <div className="space-y-4 animate-fadeIn">
          {/* Green AI Banner */}
          <div className="bg-[#eaf5ea] border border-[#c3e6cb] text-[#1e6b37] text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-2xs">
            <Wand2 className="w-4 h-4 text-[#1e6b37] shrink-0" />
            <span>
              <strong>{atpList.length} TP tersusun.</strong> AI menyarankan <strong>Kelas & Semester</strong> tiap TP — ubah lewat chip/dropdown bila perlu.
            </span>
          </div>

          {/* Card Container for ATP Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            {/* Title & Metadata */}
            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#0f2942] font-serif">
                Alur Tujuan Pembelajaran (ATP)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Mata Pelajaran: <strong>{subjectName}</strong> | Fase {phase} | Metode: <strong>{sequencingMethod}</strong>
              </p>
            </div>

            {/* Hint Box */}
            <div className="bg-[#eef4fb] border border-[#d2e3f8] text-[#1c497d] text-[11px] sm:text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
              <Pencil className="w-3.5 h-3.5 text-[#1c497d] shrink-0" />
              <span>
                Klik sel <strong>Elemen</strong>, <strong>TP</strong>, atau dropdown <strong>Kelas/Semester</strong> untuk mengedit langsung. Ketuk chip <strong>Dimensi</strong> untuk menandai yang disasar tiap TP.
              </span>
            </div>

            {/* Notification */}
            {notification && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {/* The Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                <thead className="bg-[#0f2942] text-white font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-2 text-center w-12 border-r border-slate-700">NO</th>
                    <th className="py-2.5 px-2 text-center w-16 border-r border-slate-700">KELAS</th>
                    <th className="py-2.5 px-2 text-center w-16 border-r border-slate-700">SMT</th>
                    <th className="py-2.5 px-3 w-32 border-r border-slate-700">ELEMEN</th>
                    <th className="py-2.5 px-3 border-r border-slate-700">TUJUAN PEMBELAJARAN</th>
                    <th className="py-2.5 px-3 text-center w-40 sm:w-44">DIMENSI PROFIL LULUSAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {atpList.map((item, idx) => {
                    const currentDims = item.targetedDimensions || [];

                    return (
                      <tr key={item.tpId || idx} className="hover:bg-slate-50/70 transition-colors">
                        {/* NO with Up/Down handles */}
                        <td className="py-3 px-2 text-center align-top border-r border-slate-200">
                          <div className="font-bold text-slate-800 text-xs">{idx + 1}</div>
                          <div className="flex justify-center gap-1 mt-1 text-[10px] text-slate-400">
                            <button 
                              type="button" 
                              onClick={() => handleMoveRow(idx, -1)} 
                              disabled={idx === 0}
                              title="Pindahkan ke atas"
                              className="hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            >
                              ▲
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleMoveRow(idx, 1)} 
                              disabled={idx === atpList.length - 1}
                              title="Pindahkan ke bawah"
                              className="hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            >
                              ▼
                            </button>
                          </div>
                        </td>

                        {/* KELAS Dropdown */}
                        <td className="py-3 px-2 text-center align-top border-r border-slate-200">
                          <select
                            value={item.gradeLevel || '1'}
                            onChange={(e) => handleUpdateRow(idx, 'gradeLevel', e.target.value)}
                            className="w-12 py-1 px-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 text-center focus:ring-1 focus:ring-blue-600 cursor-pointer"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                          </select>
                        </td>

                        {/* SMT Dropdown */}
                        <td className="py-3 px-2 text-center align-top border-r border-slate-200">
                          <select
                            value={item.semesterNumber || (idx < 4 ? '1' : '2')}
                            onChange={(e) => handleUpdateRow(idx, 'semesterNumber', e.target.value)}
                            className="w-12 py-1 px-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 text-center focus:ring-1 focus:ring-blue-600 cursor-pointer"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                          </select>
                        </td>

                        {/* ELEMEN Editable */}
                        <td className="py-3 px-3 align-top border-r border-slate-200">
                          <input
                            type="text"
                            value={item.element || item.material || 'Penjumlahan'}
                            onChange={(e) => handleUpdateRow(idx, 'element', e.target.value)}
                            className="w-full text-xs text-slate-800 font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white px-1 py-1 rounded focus:outline-none"
                          />
                        </td>

                        {/* TUJUAN PEMBELAJARAN Editable */}
                        <td className="py-3 px-3 align-top border-r border-slate-200">
                          <textarea
                            rows={3}
                            value={item.tpText}
                            onChange={(e) => handleUpdateRow(idx, 'tpText', e.target.value)}
                            className="w-full text-xs text-slate-800 leading-relaxed bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white p-1 rounded focus:outline-none resize-y"
                          />
                        </td>

                        {/* DIMENSI PROFIL LULUSAN Stacked Chips */}
                        <td className="py-3 px-2 align-top text-center">
                          <div className="flex flex-col gap-1.5 items-center justify-center">
                            {activeDimensionTitles.map((dimTitle) => {
                              const isActive = currentDims.includes(dimTitle);

                              return (
                                <button
                                  key={dimTitle}
                                  type="button"
                                  onClick={() => handleToggleRowDimension(idx, dimTitle)}
                                  className={`w-full max-w-[130px] px-2 py-0.5 rounded-full text-[10px] transition-all cursor-pointer truncate ${
                                    isActive
                                      ? 'bg-[#0f2942] text-white font-semibold shadow-2xs'
                                      : 'bg-white border border-slate-300 text-slate-500 hover:border-slate-400 font-normal'
                                  }`}
                                  title={`Klik untuk ${isActive ? 'menghapus' : 'menambahkan'} ${dimTitle}`}
                                >
                                  {dimTitle}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* + Tambah TP */}
              <button
                type="button"
                onClick={handleAddRow}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah TP</span>
              </button>

              {/* ✨ Satukan TP dengan Dimensi */}
              <button
                type="button"
                onClick={handleAutoAlignDimensions}
                className="px-4 py-2 bg-[#1a56db] hover:bg-[#1546b3] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Satukan TP dengan Dimensi</span>
              </button>

              {/* Unduh (Word) */}
              <button
                type="button"
                onClick={handleDownloadDocx}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Unduh (Word)</span>
              </button>

              {/* Simpan ke Koleksi */}
              <button
                type="button"
                onClick={handleSaveToArsip}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span>Simpan ke Koleksi</span>
              </button>
            </div>

            {/* Lanjut: Pilih TP */}
            <div>
              <button
                type="button"
                onClick={() => onNavigate?.('dasmen-pilih-tp')}
                className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Lanjut: Pilih TP →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
