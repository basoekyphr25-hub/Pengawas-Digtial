import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  GraduationCap, 
  Lightbulb, 
  Download, 
  Printer, 
  Bookmark, 
  FileText, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Plus, 
  ArrowRight,
  ExternalLink,
  Info,
  Pencil
} from 'lucide-react';
import { 
  ModulAjar, 
  GlobalContext, 
  TargetPembelajaran, 
  AtpItem, 
  SavedDocument, 
  KKTPCriteria, 
  InitialCognitiveAssessment,
  AssessmentInstrument,
  LKPDData
} from '../../types';
import { 
  generateKKTP, 
  generateInitialCognitiveTest, 
  generateLearningActivities, 
  generateAssessmentsAndLKPD 
} from '../../lib/gemini/prompts';
import { exportModulAjarToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printModulAjar } from '../../lib/export/pdfExport';
import { NavItem } from '../layout/Sidebar';
import { RppDocumentPreview } from './RppDocumentPreview';
import { BentukAsOfPreview, BentukAsOfData } from './BentukAsOfPreview';
import { CheckpointCard } from './CheckpointCard';
import { BentukAsOfInlineSection } from './BentukAsOfInlineSection';

interface KembangkanModulViewProps {
  globalContext: GlobalContext;
  selectedTp?: AtpItem | null;
  tps?: TargetPembelajaran[];
  currentDraft?: Partial<ModulAjar> | null;
  onSaveDraft?: (draft: ModulAjar) => void;
  onSaveToCollection?: (doc: SavedDocument) => void;
  onNavigate?: (item: NavItem) => void;
}

interface ProfileDimensionOption {
  id: string;
  title: string;
  subtitle: string;
}

const PROFILE_DIMENSIONS: ProfileDimensionOption[] = [
  { id: 'iman_takwa', title: 'Keimanan & Ketakwaan', subtitle: 'terhadap Tuhan YME' },
  { id: 'kewargaan', title: 'Kewargaan', subtitle: 'warganegara & global' },
  { id: 'penalaran_kritis', title: 'Penalaran Kritis', subtitle: 'analisis & evaluasi' },
  { id: 'kreativitas', title: 'Kreativitas', subtitle: 'gagasan & orisinalitas' },
  { id: 'kolaborasi', title: 'Kolaborasi', subtitle: 'kerja sama' },
  { id: 'kemandirian', title: 'Kemandirian', subtitle: 'regulasi diri' },
  { id: 'kesehatan', title: 'Kesehatan', subtitle: 'fisik & mental' },
  { id: 'komunikasi', title: 'Komunikasi', subtitle: 'menyampaikan gagasan' },
];

const PEDAGOGICAL_PRACTICES = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Inquiry & Discovery Learning',
  'Teaching at The Right Level (TaRL)',
  'Culturally Responsive Teaching (CRT)',
  'Pembelajaran Berdiferensiasi (Konten, Proses, Produk)',
  'Understanding by Design (UbD)',
  'Pembelajaran Mendalam (Deep Learning)'
];

export interface DetailedRubricRow {
  id: string;
  kriteria: string;
  baruMemulai: string;
  berkembang: string;
  cakap: string;
  sangatBerkembang: string;
}

const DEFAULT_RUBRIC_ROWS: DetailedRubricRow[] = [
  {
    id: 'crit-1',
    kriteria: 'Identifikasi Lambang Sila Pancasila',
    baruMemulai: 'Menyebutkan lambang sila Pancasila ketika diberikan stimulus visual atau panduan terstruktur di lingkungan keluarga (Penalaran Kritis: Mengidentifikasi dan mengolah informasi).',
    berkembang: 'Menghubungkan lambang sila Pancasila dengan bunyi silanya secara tepat berdasarkan pengamatan mandiri di lingkungan keluarga (Penalaran Kritis: Menganalisis informasi).',
    cakap: 'Menjelaskan keterkaitan antara bentuk visual lambang Pancasila dengan nilai dasar sila yang diwakilinya dalam konteks kehidupan keluarga (Penalaran Kritis: Menganalisis dan mengevaluasi penalaran).',
    sangatBerkembang: 'Menganalisis secara mendalam hubungan logis antara simbol lambang Pancasila dengan nilai filosofisnya serta bagaimana simbol tersebut tercermin dalam aturan keluarga (Penalaran Kritis: Merefleksikan dan mengevaluasi pemikirannya sendiri).'
  },
  {
    id: 'crit-2',
    kriteria: 'Pemahaman Makna Sila Pancasila dalam Keluarga',
    baruMemulai: 'Mengenali contoh perilaku di rumah yang mencerminkan sila Pancasila melalui contoh konkret yang diberikan oleh pendidik atau orang tua (Penalaran Kritis: Mengidentifikasi gagasan).',
    berkembang: 'Menjelaskan hubungan antara tindakan anggota keluarga sehari-hari dengan makna sila Pancasila secara sederhana (Penalaran Kritis: Menganalisis gagasan).',
    cakap: 'Menguraikan dampak positif dari penerapan makna sila Pancasila terhadap keharmonisan hubungan antaranggota keluarga (Penalaran Kritis: Menganalisis dan mengevaluasi penalaran).',
    sangatBerkembang: 'Merumuskan gagasan atau solusi kreatif untuk memperkuat penerapan makna sila Pancasila dalam mengatasi tantangan interaksi sehari-hari di keluarga (Penalaran Kritis: Menghasilkan solusi alternatif).'
  }
];

export interface CheckpointItem {
  id: number;
  stepNumber: number;
  stage: string;
  instrumentType: string;
  title: string;
  description: string;
  sumberBelajarStatus?: 'idle' | 'created' | 'skipped';
  lkpdStatus?: 'idle' | 'created' | 'skipped';
}

const DEFAULT_CHECKPOINTS_PANCASILA: CheckpointItem[] = [
  {
    id: 1,
    stepNumber: 1,
    stage: 'Memahami',
    instrumentType: 'Kuis',
    title: 'Kuis Tebak Sikap Pancasila saat Bermain',
    description: 'Murid menjawab kuis gambar/situasi singkat interaktif untuk mengidentifikasi contoh perilaku kolaboratif yang sesuai dengan sila Pancasila ketika bermain bersama teman.',
    sumberBelajarStatus: 'created',
    lkpdStatus: 'created'
  },
  {
    id: 2,
    stepNumber: 2,
    stage: 'Mengaplikasikan',
    instrumentType: 'Observasi',
    title: 'Observasi Kolaborasi Bermain Adil',
    description: 'Guru mengamati dan mencatat bagaimana murid menerapkan nilai gotong royong, ketepatan waktu, dan sikap adil saat melakukan permainan kelompok di lapangan sekolah.',
    sumberBelajarStatus: 'created',
    lkpdStatus: 'created'
  },
  {
    id: 3,
    stepNumber: 3,
    stage: 'Merefleksikan',
    instrumentType: 'Penilaian Diri & Sejawat',
    title: 'Lembar Refleksi Sahabat Pancasila',
    description: 'Murid mengisi lembar refleksi sederhana bergambar untuk menilai konsistensi sikap kolaborasi diri sendiri dan memberikan apresiasi jujur kepada teman bermainnya.',
    sumberBelajarStatus: 'created',
    lkpdStatus: 'created'
  },
  {
    id: 4,
    stepNumber: 4,
    stage: 'Menganalisis',
    instrumentType: 'Studi Kasus Sederhana',
    title: 'Analisis Dilema Nilai di Lingkungan Sekitar',
    description: 'Murid mengkaji studi kasus bergambar tentang musyawarah dan kerja sama keluarga untuk merumuskan keputusan bersama.',
    sumberBelajarStatus: 'idle',
    lkpdStatus: 'idle'
  },
  {
    id: 5,
    stepNumber: 5,
    stage: 'Mengevaluasi',
    instrumentType: 'Unjuk Kerja',
    title: 'Gelar Karya Penerapan Nilai Pancasila',
    description: 'Murid mempresentasikan dokumentasi karya aksi nyata perilaku positif sesuai sila Pancasila di hadapan guru dan teman-teman.',
    sumberBelajarStatus: 'idle',
    lkpdStatus: 'idle'
  }
];

export const KembangkanModulView: React.FC<KembangkanModulViewProps> = ({
  globalContext,
  selectedTp,
  tps = [],
  currentDraft,
  onSaveDraft,
  onSaveToCollection,
  onNavigate
}) => {
  // Accordion toggle states
  const [openStep1, setOpenStep1] = useState<boolean>(true);
  const [openStep2, setOpenStep2] = useState<boolean>(false);
  const [openStep3, setOpenStep3] = useState<boolean>(true);
  const [openStep4, setOpenStep4] = useState<boolean>(true);

  // Langkah 1 states
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['penalaran_kritis']);
  const [jumlahPertemuan, setJumlahPertemuan] = useState<number>(1);
  const [jpPerPertemuan, setJpPerPertemuan] = useState<number>(2);
  const [menitPerJp, setMenitPerJp] = useState<number>(45);
  const [ambangKetuntasan, setAmbangKetuntasan] = useState<number>(70);
  const [praktikPedagogis, setPraktikPedagogis] = useState<string>('');

  // Langkah 2 states (Asesmen Awal Kognitif)
  const [initialCognitive, setInitialCognitive] = useState<InitialCognitiveAssessment>({
    levelMinus2: {
      question: 'Sebutkan konsep/lambang dasar sebelum materi ini yang sudah kamu ketahui di kelas sebelumnya!',
      expectedAnswer: 'Menyebutkan lambang atau rumus dasar dengan bahasa sederhana.',
      followUp: 'Diberikan lembar pengingat visual dan pendampingan konsep prasyarat.'
    },
    levelMinus1: {
      question: 'Berikan satu contoh penerapan konsep ini dalam lingkungan sehari-hari atau di rumah!',
      expectedAnswer: 'Menyebutkan 1 contoh nyata penerapan dalam kehidupan sehari-hari.',
      followUp: 'Diberikan stimulus pemantik bertahap dan diskusi kelompok sebaya.'
    },
    levelCurrent: {
      question: 'Bagaimana kamu mengidentifikasi lambang dan formula dalam memecahkan masalah kontekstual?',
      expectedAnswer: 'Menganalisis nilai dan makna formula secara logis dan runtut.',
      followUp: 'Siap melanjutkan ke tantangan eksplorasi inti dan pengayaan analitis.'
    }
  });

  // Langkah 3 states (Konteks & KKTP)
  const [kondisiTambahan, setKondisiTambahan] = useState<string>('');
  const [kktpList, setKktpList] = useState<KKTPCriteria[]>(currentDraft?.kktp || []);
  const [detailedRubricRows, setDetailedRubricRows] = useState<DetailedRubricRow[]>([]);
  const [isGeneratingKktp, setIsGeneratingKktp] = useState<boolean>(false);

  // Langkah 4 states (Instrumen Asesmen Sesuai langkah 4 kembangkan.png & check point.png)
  const [jumlahCheckpoint, setJumlahCheckpoint] = useState<number>(3);
  const [generatedCheckpoints, setGeneratedCheckpoints] = useState<CheckpointItem[]>([]);
  const [isGeneratingCheckpoints, setIsGeneratingCheckpoints] = useState<boolean>(false);
  const [isFilteredByPrinsip, setIsFilteredByPrinsip] = useState<boolean>(false);
  const [selectedAsLearning, setSelectedAsLearning] = useState<string>('Jurnal Reflektif');
  const [selectedOfLearning, setSelectedOfLearning] = useState<string>('Unjuk Kerja');
  const [createdInstruments, setCreatedInstruments] = useState<string[]>([]);
  const [checkpointNotice, setCheckpointNotice] = useState<string | null>(null);
  const [showBentukAsOfModal, setShowBentukAsOfModal] = useState<boolean>(false);
  const [bentukAsOfData, setBentukAsOfData] = useState<BentukAsOfData | null>(null);

  // Generation & Modul Preview states
  const [isGeneratingModul, setIsGeneratingModul] = useState<boolean>(false);
  const [generationStepText, setGenerationStepText] = useState<string>('');
  const [generatedModul, setGeneratedModul] = useState<ModulAjar | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'ringkasan' | 'kegiatan' | 'kktp' | 'asesmen' | 'lkpd'>('ringkasan');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Active TP text & subject
  const currentTpText = selectedTp?.tpText || (tps.length > 0 ? tps[0].text : 'Mengidentifikasi lambang dan makna nilai atau formula dalam kehidupan sehari-hari/di lingkungan keluarga.');
  const currentSubject = selectedTp?.element || selectedTp?.material || globalContext.identity.level === 'SD' ? 'Matematika' : 'Bahasa Indonesia';
  const currentTpStep = selectedTp?.stepNumber || 1;

  // Toggle dimension
  const toggleDimension = (dimId: string) => {
    setSelectedDimensions(prev => {
      if (prev.includes(dimId)) {
        return prev.filter(id => id !== dimId);
      }
      if (prev.length >= 3) {
        // limit 3
        return [...prev.slice(1), dimId];
      }
      return [...prev, dimId];
    });
  };

  // Generate KKTP (Rubrik 4 Interval)
  const handleBuatKKTP = async () => {
    setIsGeneratingKktp(true);
    try {
      // Simulate realistic generation delay
      await new Promise(resolve => setTimeout(resolve, 400));

      let rows: DetailedRubricRow[] = [];
      const tpLower = (currentTpText + ' ' + currentSubject).toLowerCase();

      // If TP is math / calculation, use math rubric, otherwise default to the exact Pancasila rubric from buat kktp.png
      if (tpLower.includes('hitung') || tpLower.includes('penjumlahan') || tpLower.includes('matematika') || tpLower.includes('angka') || tpLower.includes('bilangan')) {
        rows = [
          {
            id: 'crit-1',
            kriteria: 'Pemahaman Konsep dan Simbol Penjumlahan',
            baruMemulai: 'Menyebutkan dan menghitung hasil operasi penjumlahan ketika diberikan stimulus visual konkret atau benda manipulatif (Penalaran Kritis: Mengidentifikasi dan mengolah informasi).',
            berkembang: 'Menghubungkan simbol operasi penjumlahan dengan situasi nyata secara tepat berdasarkan pengamatan mandiri (Penalaran Kritis: Menganalisis informasi).',
            cakap: 'Menjelaskan keterkaitan antara penggabungan kelompok objek dengan prosedur penjumlahan dalam konteks kehidupan sehari-hari (Penalaran Kritis: Menganalisis dan mengevaluasi penalaran).',
            sangatBerkembang: 'Menganalisis secara mendalam strategi mental penjumlahan, membuktikan kebenaran hasilnya, serta mengaitkannya dengan pemecahan masalah kontekstual (Penalaran Kritis: Merefleksikan dan mengevaluasi pemikirannya sendiri).'
          },
          {
            id: 'crit-2',
            kriteria: 'Penyelesaian Masalah Penjumlahan dalam Cerita Sehari-hari',
            baruMemulai: 'Mengenali masalah penjumlahan dalam soal cerita sederhana melalui contoh konkret yang diberikan oleh pendidik (Penalaran Kritis: Mengidentifikasi gagasan).',
            berkembang: 'Menjelaskan hubungan antara kalimat cerita dengan kalimat matematika penjumlahan secara sederhana (Penalaran Kritis: Menganalisis gagasan).',
            cakap: 'Menguraikan strategi penyelesaian masalah kontekstual penjumlahan dengan langkah-langkah yang sistematis dan logis (Penalaran Kritis: Menganalisis dan mengevaluasi penalaran).',
            sangatBerkembang: 'Merumuskan gagasan dan solusi alternatif kreatif dalam memecahkan masalah penjumlahan kompleks di lingkungan sekitar (Penalaran Kritis: Menghasilkan solusi alternatif).'
          }
        ];
      } else {
        // Exact rubric from buat kktp.png
        rows = JSON.parse(JSON.stringify(DEFAULT_RUBRIC_ROWS));
      }

      setDetailedRubricRows(rows);
      setKktpList(
        rows.map(r => ({
          indicator: r.kriteria,
          rubric: {
            perluBimbingan: r.baruMemulai,
            cukup: r.berkembang,
            baik: r.cakap,
            sangatBaik: r.sangatBerkembang
          },
          passingThreshold: `Ambang batas (${ambangKetuntasan}) - Minimal Berkembang`
        }))
      );
    } catch (e) {
      console.error('Error generating KKTP:', e);
      setDetailedRubricRows(JSON.parse(JSON.stringify(DEFAULT_RUBRIC_ROWS)));
    } finally {
      setIsGeneratingKktp(false);
    }
  };

  // Update cell on user inline edit
  const handleUpdateCell = (rowId: string, field: keyof DetailedRubricRow, value: string) => {
    setDetailedRubricRows(prev => {
      const updated = prev.map(r => r.id === rowId ? { ...r, [field]: value } : r);
      setKktpList(
        updated.map(r => ({
          indicator: r.kriteria,
          rubric: {
            perluBimbingan: r.baruMemulai,
            cukup: r.berkembang,
            baik: r.cakap,
            sangatBaik: r.sangatBerkembang
          },
          passingThreshold: `Ambang batas (${ambangKetuntasan}) - Minimal Berkembang`
        }))
      );
      return updated;
    });
  };

  // Generate Checkpoints matching check point.png
  const handleBuatCheckpoint = async () => {
    setIsGeneratingCheckpoints(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const count = jumlahCheckpoint || 3;
    const tpLower = (currentTpText + ' ' + currentSubject).toLowerCase();

    let baseList: CheckpointItem[] = [];
    if (tpLower.includes('hitung') || tpLower.includes('penjumlahan') || tpLower.includes('matematika') || tpLower.includes('angka') || tpLower.includes('bilangan')) {
      baseList = [
        {
          id: 1,
          stepNumber: 1,
          stage: 'Memahami',
          instrumentType: 'Kuis',
          title: 'Kuis Tebak Konsep Penjumlahan',
          description: 'Murid secara interaktif mencocokkan kartu penggabungan benda konkret dengan simbol matematika penjumlahan yang tepat untuk menguji pemahaman konseptual awal.',
          sumberBelajarStatus: 'idle',
          lkpdStatus: 'idle'
        },
        {
          id: 2,
          stepNumber: 2,
          stage: 'Mengaplikasikan',
          instrumentType: 'Penugasan',
          title: 'Misi Belanja & Berhitung di Rumah',
          description: 'Murid bersama orang tua menghitung total benda atau belanjaan sederhana di rumah menggunakan konsep penjumlahan konkret dan mencatat hasilnya.',
          sumberBelajarStatus: 'idle',
          lkpdStatus: 'idle'
        },
        {
          id: 3,
          stepNumber: 3,
          stage: 'Merefleksikan',
          instrumentType: 'Exit Ticket / CATs',
          title: 'Tiket Keluar: Strategi Berhitung Cepat',
          description: 'Murid menuliskan refleksi singkat mengenai strategi penggabungan atau berhitung mana yang paling mereka sukai dan pahami hari ini.',
          sumberBelajarStatus: 'idle',
          lkpdStatus: 'idle'
        },
        {
          id: 4,
          stepNumber: 4,
          stage: 'Menganalisis',
          instrumentType: 'Studi Kasus Sederhana',
          title: 'Analisis Soal Cerita Kontekstual',
          description: 'Murid menganalisis permasalahan sehari-hari yang membutuhkan operasi hitung beruntun.',
          sumberBelajarStatus: 'idle',
          lkpdStatus: 'idle'
        },
        {
          id: 5,
          stepNumber: 5,
          stage: 'Mengevaluasi',
          instrumentType: 'Unjuk Kerja',
          title: 'Presentasi Proyek Matematika Cilik',
          description: 'Murid menunjukkan pemahaman operasi hitung melalui demonstrasi benda konkret di depan kelas.',
          sumberBelajarStatus: 'idle',
          lkpdStatus: 'idle'
        }
      ];
    } else {
      // Exact Pancasila checkpoints from check point.png
      baseList = JSON.parse(JSON.stringify(DEFAULT_CHECKPOINTS_PANCASILA));
    }

    setGeneratedCheckpoints(baseList.slice(0, count));
    setIsGeneratingCheckpoints(false);
  };

  // Checkpoint item actions
  const handleUpdateCpType = (id: number, newType: string) => {
    setGeneratedCheckpoints(prev => prev.map(cp => cp.id === id ? { ...cp, instrumentType: newType } : cp));
  };

  const handleToggleSumberBelajar = (id: number) => {
    setGeneratedCheckpoints(prev => prev.map(cp => {
      if (cp.id === id) {
        const nextStatus = cp.sumberBelajarStatus === 'created' ? 'idle' : 'created';
        return { ...cp, sumberBelajarStatus: nextStatus };
      }
      return cp;
    }));
  };

  const handleToggleLkpd = (id: number) => {
    setGeneratedCheckpoints(prev => prev.map(cp => {
      if (cp.id === id) {
        const nextStatus = cp.lkpdStatus === 'created' ? 'idle' : 'created';
        return { ...cp, lkpdStatus: nextStatus };
      }
      return cp;
    }));
  };

  const handleSkipSumber = (id: number) => {
    setGeneratedCheckpoints(prev => prev.map(cp => {
      if (cp.id === id) {
        const nextStatus = cp.lkpdStatus === 'skipped' ? 'idle' : 'skipped';
        return { ...cp, lkpdStatus: nextStatus, sumberBelajarStatus: nextStatus === 'skipped' ? 'skipped' : 'idle' };
      }
      return cp;
    }));
  };

  // Generate Instrumen
  const handleBuatInstrumen = (name: string, type: 'AS LEARNING' | 'OF LEARNING') => {
    if (!createdInstruments.includes(name)) {
      setCreatedInstruments(prev => [...prev, name]);
    }
    const currentData: BentukAsOfData = {
      asLearningType: selectedAsLearning,
      ofLearningType: selectedOfLearning,
      subject: (selectedTp?.element || selectedTp?.material || currentSubject) || 'Pendidikan Pancasila',
      grade: globalContext?.identity?.level === 'SD' ? 'Kelas 2' : 'Kelas 7',
      phase: globalContext?.identity?.level === 'SD' ? 'A' : 'D',
      tpText: currentTpText,
      selectedDimensions: selectedDimensions
    };
    setBentukAsOfData(currentData);
    setShowBentukAsOfModal(true);
    setCheckpointNotice(`Instrumen ${name} (${type}) berhasil digenerate.`);
    setTimeout(() => setCheckpointNotice(null), 3500);
  };

  // Generate Full Modul Ajar
  const handleGenerateModulAjar = async () => {
    setIsGeneratingModul(true);
    try {
      // If KKTP not created, create it first
      let currentKktp = kktpList;
      const selectedTpObj: TargetPembelajaran = {
        id: selectedTp?.tpId || 'TP-01',
        sequence: currentTpStep,
        text: currentTpText,
        material: currentSubject,
        competency: 'Mengidentifikasi dan Menerapkan',
        evidence: 'LKPD dan Observasi'
      };

      if (currentKktp.length === 0) {
        setGenerationStepText('1/4 Merumuskan KKTP Rubrik 4 Kategori...');
        currentKktp = await generateKKTP({
          selectedTp: [selectedTpObj],
          subject: currentSubject,
          globalContext
        });
        setKktpList(currentKktp);
      }

      setGenerationStepText('2/4 Merancang Aktivitas Pembelajaran Berdiferensiasi...');
      const learningActs = await generateLearningActivities({
        selectedTp: [selectedTpObj],
        subject: currentSubject,
        totalSessions: jumlahPertemuan,
        totalJp: jumlahPertemuan * jpPerPertemuan,
        learningModel: (praktikPedagogis.includes('PjBL') ? 'PjBL' : praktikPedagogis.includes('Discovery') ? 'Discovery Learning' : 'PBL') as any,
        globalContext
      });

      setGenerationStepText('3/4 Menyusun Instrumen Asesmen & LKPD...');
      const assessRes = await generateAssessmentsAndLKPD({
        selectedTp: [selectedTpObj],
        subject: currentSubject,
        grade: globalContext.studentProfile?.targetClass || 'Kelas 1',
        phase: 'A',
        learningModel: 'PBL',
        globalContext
      });

      setGenerationStepText('4/4 Merapikan Modul Ajar...');
      const finalModul: ModulAjar = {
        id: `MODUL-${Date.now()}`,
        title: `Modul Ajar ${currentSubject} - ${currentTpText.slice(0, 50)}...`,
        subject: currentSubject,
        phase: 'A',
        grade: globalContext.studentProfile?.targetClass || 'Kelas 1',
        semester: 'Ganjil',
        totalJp: jumlahPertemuan * jpPerPertemuan,
        totalSessions: jumlahPertemuan,
        learningModel: 'PBL',
        crossSubjectIntegration: kondisiTambahan ? `Integrasi Konteks Khusus: ${kondisiTambahan}` : 'Integrasi Literasi & Profil Lulusan',
        selectedTpIds: [selectedTpObj.id],
        selectedTpTexts: [currentTpText],
        initialCognitiveAssessment: initialCognitive,
        kktp: currentKktp,
        formativeAssessment: assessRes.formative,
        selfPeerAssessment: assessRes.selfPeer,
        summativeAssessment: assessRes.summative,
        lkpd: assessRes.lkpd,
        learningActivities: learningActs,
        learningResources: assessRes.resources.length > 0 ? assessRes.resources : [
          'Buku Panduan Guru & Siswa Kurikulum Merdeka',
          'Alat peraga dan lingkungan sekitar rumah/sekolah',
          'Media pembelajaran visual konkret'
        ],
        reflectionTeacher: [
          'Apakah semua murid dapat mengidentifikasi lambang dan formula dengan baik?',
          'Bagaimana efektivitas intervensi scaffolding pada kelompok yang membutuhkan bimbingan?'
        ],
        reflectionStudent: [
          'Apa bagian kegiatan belajar yang paling saya senangi hari ini?',
          'Tantangan apa yang berhasil saya selesaikan bersama teman?'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setGeneratedModul(finalModul);
      onSaveDraft?.(finalModul);
      // Simpan otomatis ke koleksi sebagai versi terbaru
      const autoSaveDoc: SavedDocument = {
        id: finalModul.id,
        title: finalModul.title,
        category: 'modul_dasmen',
        subjectOrTheme: finalModul.subject,
        gradeOrAge: finalModul.grade,
        createdAt: new Date().toISOString(),
        data: finalModul
      };
      onSaveToCollection?.(autoSaveDoc);
    } catch (err) {
      console.error('Failed to generate full modul ajar:', err);
    } finally {
      setIsGeneratingModul(false);
      setGenerationStepText('');
    }
  };

  // Download DOCX
  const handleDownloadDocx = async () => {
    if (!generatedModul) return;
    try {
      const blob = await exportModulAjarToDocx(generatedModul, globalContext);
      const filename = `Modul_Ajar_${generatedModul.subject.replace(/\s+/g, '_')}_${generatedModul.grade.replace(/\s+/g, '_')}.docx`;
      downloadBlob(blob, filename);
    } catch (e) {
      console.error('Export docx failed:', e);
    }
  };

  // Print PDF
  const handlePrintPdf = () => {
    if (!generatedModul) return;
    printModulAjar(generatedModul, globalContext);
  };

  // Save to Collection
  const handleSaveToArsip = () => {
    if (!generatedModul) return;
    const doc: SavedDocument = {
      id: generatedModul.id,
      title: generatedModul.title,
      category: 'modul_dasmen',
      subjectOrTheme: generatedModul.subject,
      gradeOrAge: generatedModul.grade,
      createdAt: new Date().toISOString(),
      data: generatedModul
    };
    onSaveToCollection?.(doc);
    setSaveSuccessNotice('Modul Ajar berhasil disimpan ke Koleksi Dokumen!');
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn pb-24 font-sans text-slate-800">
      {/* Header & 4-Step Stepper Navigation */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
          Buat Modul Ajar
        </h2>

        {/* 4 Steps Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3.5">
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

          {/* Step 2: Completed with Green Checkmark */}
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-atp')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <span className="text-xs font-medium truncate">
              Alur (ATP)
            </span>
          </button>

          {/* Step 3: Completed with Green Checkmark */}
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-pilih-tp')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <span className="text-xs font-medium truncate">
              Pilih TP
            </span>
          </button>

          {/* Step 4: Active with Dark Border and Badge 4 */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              Kembangkan
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
        
        {/* Highlighted TP Banner */}
        <div className="bg-[#f0f4fa] border border-[#d8e2ef] rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-slate-800">
          <span className="text-rose-500 font-bold text-base leading-none shrink-0 mt-0.5">✦</span>
          <div className="leading-relaxed flex-1">
            <span className="font-bold text-slate-900">TP {currentTpStep}:</span>{' '}
            <span className="text-slate-700">{currentSubject.toLowerCase()} - {currentTpText}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('dasmen-pilih-tp')}
            className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold shrink-0 cursor-pointer ml-1"
          >
            Ubah TP
          </button>
        </div>

        {/* Section Heading */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0f2942] font-serif tracking-tight">
            Kembangkan jadi Modul Ajar
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Saat Langkah 1-4 di bawah, terus jadi rujukan bagian untuk membuka/menutupnya.
          </p>
        </div>

        {/* ACCORDIONS LIST */}
        <div className="space-y-4">
          
          {/* ========================================================= */}
          {/* LANGKAH 1 - Profil & Alokasi Waktu */}
          {/* ========================================================= */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => setOpenStep1(!openStep1)}
              className="w-full flex items-center justify-between p-4 sm:p-4.5 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors cursor-pointer border-b border-slate-200"
            >
              <span className="text-xs sm:text-sm font-bold text-[#0f2942]">
                Langkah 1 - Profil & Alokasi Waktu
              </span>
              <span className="text-slate-400">
                {openStep1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {openStep1 && (
              <div className="p-4 sm:p-5 space-y-4 text-xs">
                {/* Dimensi Profil Lulusan */}
                <div>
                  <label className="block font-medium text-slate-700 mb-2">
                    Dimensi Profil Lulusan yang dikuatkan <span className="text-slate-400 font-normal">(pilih 1 - 3)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PROFILE_DIMENSIONS.map((dim) => {
                      const isChecked = selectedDimensions.includes(dim.id);
                      return (
                        <div
                          key={dim.id}
                          onClick={() => toggleDimension(dim.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isChecked
                              ? 'border-slate-800 bg-slate-50/80 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                            isChecked
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className={`font-semibold text-xs leading-tight ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                              {dim.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                              {dim.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimasi Dipilih */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <p className="font-medium text-slate-700">Estimasi dipilih</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Jumlah pertemuan</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={jumlahPertemuan}
                        onChange={(e) => setJumlahPertemuan(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">JP per pertemuan</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={jpPerPertemuan}
                        onChange={(e) => setJpPerPertemuan(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Menit per JP</label>
                      <input
                        type="number"
                        min="20"
                        max="60"
                        value={menitPerJp}
                        onChange={(e) => setMenitPerJp(Math.max(20, parseInt(e.target.value) || 35))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Ambang ketuntasan (KKTP)</label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={ambangKetuntasan}
                        onChange={(e) => setAmbangKetuntasan(parseInt(e.target.value) || 70)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Total: {jumlahPertemuan} pertemuan x {jpPerPertemuan} JP = {jumlahPertemuan * jpPerPertemuan * menitPerJp} menit, x {menitPerJp} JP/menit
                  </p>
                </div>

                {/* Praktik Pedagogis */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-slate-700 font-medium mb-1.5">
                    Praktik pedagogis pilihan <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={praktikPedagogis}
                      onChange={(e) => setPraktikPedagogis(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 pr-9 cursor-pointer"
                    >
                      <option value="">... pilih (opsional) ...</option>
                      {PEDAGOGICAL_PRACTICES.map((practice) => (
                        <option key={practice} value={practice}>
                          {practice}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* LANGKAH 2 - Asesmen Awal Kognitif [opsional] */}
          {/* ========================================================= */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => setOpenStep2(!openStep2)}
              className="w-full flex items-center justify-between p-4 sm:p-4.5 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors cursor-pointer border-b border-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#0f2942]">
                  Langkah 2 - Asesmen Awal Kognitif
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full font-medium">
                  opsional
                </span>
              </div>
              <span className="text-slate-400">
                {openStep2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {openStep2 && (
              <div className="p-4 sm:p-5 space-y-3.5 text-xs">
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Pertanyaan pemantik diagnostik kognitif 3 level untuk memetakan kesiapan murid sebelum materi inti dimulai:
                </p>

                {/* Level -2 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">Level -2 (Prasyarat Dasar)</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">2 Jenjang Sebelumnya</span>
                  </div>
                  <p className="text-slate-700 font-medium">{initialCognitive.levelMinus2.question}</p>
                  <p className="text-slate-500 text-[11px]"><strong>Respon:</strong> {initialCognitive.levelMinus2.expectedAnswer}</p>
                  <p className="text-slate-500 text-[11px]"><strong>Tindak Lanjut:</strong> {initialCognitive.levelMinus2.followUp}</p>
                </div>

                {/* Level -1 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">Level -1 (Pemahaman Awal)</span>
                    <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-medium">1 Jenjang Sebelumnya</span>
                  </div>
                  <p className="text-slate-700 font-medium">{initialCognitive.levelMinus1.question}</p>
                  <p className="text-slate-500 text-[11px]"><strong>Respon:</strong> {initialCognitive.levelMinus1.expectedAnswer}</p>
                  <p className="text-slate-500 text-[11px]"><strong>Tindak Lanjut:</strong> {initialCognitive.levelMinus1.followUp}</p>
                </div>

                {/* Level Target */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">Level Target (Tujuan Pembelajaran Saat Ini)</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">Fase / Kelas Ini</span>
                  </div>
                  <p className="text-slate-700 font-medium">{initialCognitive.levelCurrent.question}</p>
                  <p className="text-slate-500 text-[11px]"><strong>Respon:</strong> {initialCognitive.levelCurrent.expectedAnswer}</p>
                  <p className="text-slate-500 text-[11px]"><strong>Tindak Lanjut:</strong> {initialCognitive.levelCurrent.followUp}</p>
                </div>

                {/* Sync button to Langkah 3 */}
                <button
                  type="button"
                  onClick={() => {
                    setKondisiTambahan(`Kompetensi awal: Sebagian murid telah memahami prasyarat dasar (${initialCognitive.levelMinus1.expectedAnswer}), namun memerlukan perancah visual untuk keterkaitan formula.`);
                    setOpenStep3(true);
                  }}
                  className="text-blue-700 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer underline pt-1"
                >
                  <span>Salin ringkasan temuan asesmen awal ke Langkah 3 ↓</span>
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* LANGKAH 3 - Konteks & KKTP */}
          {/* ========================================================= */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => setOpenStep3(!openStep3)}
              className="w-full flex items-center justify-between p-4 sm:p-4.5 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors cursor-pointer border-b border-slate-200"
            >
              <span className="text-xs sm:text-sm font-bold text-[#0f2942]">
                Langkah 3 - Konteks & KKTP
              </span>
              <span className="text-slate-400">
                {openStep3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {openStep3 && (
              <div className="p-4 sm:p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Kondisi tambahan / kompetensi awal murid <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    Belum tahu kompetensi awal murid? Buka <strong>Langkah 2</strong> diatas → hasilnya mengisi kolom ini otomatis. Atau isi manual bila sudah tahu, atau kontak kurikulum lain (mis. dikaitkan koperasi sekolah).
                  </p>
                  <textarea
                    rows={2}
                    value={kondisiTambahan}
                    onChange={(e) => setKondisiTambahan(e.target.value)}
                    placeholder="mis. dikaitkan koperasi sekolah ... atau terisi dari asesmen awal di Langkah 2"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-y"
                  />
                </div>

                {/* Tombol Buat KKTP (rubrik) */}
                <div>
                  <button
                    type="button"
                    onClick={handleBuatKKTP}
                    disabled={isGeneratingKktp}
                    className="px-4 py-2 bg-[#1d5fb4] hover:bg-[#184f97] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {isGeneratingKktp ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyusun KKTP...</span>
                      </>
                    ) : (
                      <span>Buat KKTP (rubrik)</span>
                    )}
                  </button>
                </div>

                {/* Display generated KKTP rubrik matching buat kktp.png */}
                {detailedRubricRows.length > 0 && (
                  <div className="space-y-4 animate-fadeIn pt-1">
                    {/* Green notification bar */}
                    <div className="bg-[#eaf5ea] border border-[#cce8d0] rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-emerald-900 font-medium shadow-2xs">
                      <Pencil className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Klik sel mana pun untuk mengedit sebelum jadi lampiran.</span>
                    </div>

                    {/* Table 1: Matrix Rubrik Penilaian */}
                    <div className="border border-[#c2d7ed] rounded-xl overflow-hidden bg-white shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-[#edf4fb] text-[#0f2942] border-b border-[#c2d7ed]">
                              <th className="p-3 border-r border-[#c2d7ed] font-bold w-[16%] align-top text-xs sm:text-[13px]">
                                Kriteria
                              </th>
                              <th className="p-3 border-r border-[#c2d7ed] font-bold w-[21%] align-top text-xs sm:text-[13px]">
                                <div>Baru Memulai</div>
                                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">(0–69)</div>
                              </th>
                              <th className="p-3 border-r border-[#c2d7ed] font-bold w-[21%] align-top text-xs sm:text-[13px]">
                                <div>Berkembang</div>
                                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">(70–80)</div>
                              </th>
                              <th className="p-3 border-r border-[#c2d7ed] font-bold w-[21%] align-top text-xs sm:text-[13px]">
                                <div>Cakap</div>
                                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">(81–90)</div>
                              </th>
                              <th className="p-3 font-bold w-[21%] align-top text-xs sm:text-[13px]">
                                <div>Sangat Berkembang</div>
                                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">(91–100)</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#c2d7ed]">
                            {detailedRubricRows.map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50/50">
                                <td className="p-3 border-r border-[#c2d7ed] font-bold text-slate-900 align-top">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUpdateCell(row.id, 'kriteria', e.currentTarget.innerText)}
                                    className="outline-none focus:bg-amber-50/70 p-1 rounded transition-colors text-[11.5px] leading-snug cursor-text"
                                    title="Klik untuk mengedit kriteria"
                                  >
                                    {row.kriteria}
                                  </div>
                                </td>
                                <td className="p-3 border-r border-[#c2d7ed] text-slate-800 align-top">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUpdateCell(row.id, 'baruMemulai', e.currentTarget.innerText)}
                                    className="outline-none focus:bg-amber-50/70 p-1 rounded transition-colors text-[11.5px] leading-relaxed cursor-text"
                                    title="Klik untuk mengedit deskripsi"
                                  >
                                    {row.baruMemulai}
                                  </div>
                                </td>
                                <td className="p-3 border-r border-[#c2d7ed] text-slate-800 align-top">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUpdateCell(row.id, 'berkembang', e.currentTarget.innerText)}
                                    className="outline-none focus:bg-amber-50/70 p-1 rounded transition-colors text-[11.5px] leading-relaxed cursor-text"
                                    title="Klik untuk mengedit deskripsi"
                                  >
                                    {row.berkembang}
                                  </div>
                                </td>
                                <td className="p-3 border-r border-[#c2d7ed] text-slate-800 align-top">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUpdateCell(row.id, 'cakap', e.currentTarget.innerText)}
                                    className="outline-none focus:bg-amber-50/70 p-1 rounded transition-colors text-[11.5px] leading-relaxed cursor-text"
                                    title="Klik untuk mengedit deskripsi"
                                  >
                                    {row.cakap}
                                  </div>
                                </td>
                                <td className="p-3 text-slate-800 align-top">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleUpdateCell(row.id, 'sangatBerkembang', e.currentTarget.innerText)}
                                    className="outline-none focus:bg-amber-50/70 p-1 rounded transition-colors text-[11.5px] leading-relaxed cursor-text"
                                    title="Klik untuk mengedit deskripsi"
                                  >
                                    {row.sangatBerkembang}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Cara Penilaian (Interval Nilai) */}
                    <div className="pt-2 space-y-1.5">
                      <h4 className="text-sm sm:text-base font-bold text-[#0f2942]">
                        Cara Penilaian (Interval Nilai)
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        Tiap kriteria dinilai pada salah satu tingkat; tiap tingkat punya interval nilai (tertera di kepala tabel), dengan{' '}
                        <strong>batas bawah tingkat &quot;Berkembang&quot; = ambang batas ({ambangKetuntasan}).</strong>
                        <br />
                        Nilai akhir murid = rata-rata nilai seluruh kriteria.
                      </p>
                    </div>

                    {/* Ambang Batas Ketuntasan */}
                    <div className="pt-1 space-y-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0f2942]">
                        Ambang Batas Ketuntasan: {ambangKetuntasan}
                      </h4>

                      <div className="border border-[#c2d7ed] rounded-xl overflow-hidden bg-white shadow-2xs">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-[#edf4fb] text-[#0f2942] border-b border-[#c2d7ed] font-bold">
                              <th className="p-2.5 sm:p-3 border-r border-[#c2d7ed] w-28 sm:w-32">Nilai</th>
                              <th className="p-2.5 sm:p-3 border-r border-[#c2d7ed] w-48 sm:w-56">Ketercapaian</th>
                              <th className="p-2.5 sm:p-3">Tindak Lanjut</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#c2d7ed] text-[11.5px] sm:text-xs">
                            <tr className="hover:bg-slate-50/50">
                              <td className="p-2.5 sm:p-3 border-r border-[#c2d7ed] font-medium text-slate-800">
                                0 – {ambangKetuntasan - 1}
                              </td>
                              <td className="p-2.5 sm:p-3 border-r border-[#c2d7ed] text-slate-700">
                                Belum mencapai TP
                              </td>
                              <td className="p-2.5 sm:p-3 text-slate-700">
                                Pendampingan/remedial pada kriteria yang belum tercapai
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="p-2.5 sm:p-3 border-r border-[#c2d7ed] font-medium text-slate-800">
                                {ambangKetuntasan} – 100
                              </td>
                              <td className="p-2.5 sm:p-3 border-r border-[#c2d7ed] text-slate-700">
                                Sudah mencapai TP
                              </td>
                              <td className="p-2.5 sm:p-3 text-slate-700">
                                Lanjut ke TP berikutnya; nilai jauh di atas ambang diberi pengayaan.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* LANGKAH 4 - Instrumen Asesmen */}
          {/* ========================================================= */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => setOpenStep4(!openStep4)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-[#edf4fb] hover:bg-[#e4eff9] text-left transition-colors cursor-pointer border-b border-slate-200"
            >
              <span className="text-sm font-bold text-[#0f2942]">
                Langkah 4 · Instrumen Asesmen
              </span>
              <span className="text-[#0f2942] text-xs font-bold leading-none">
                {openStep4 ? '▾' : '▸'}
              </span>
            </button>

            {openStep4 && (
              <div className="p-5 sm:p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-700 font-normal">
                  Buat satu per satu — tiap instrumen bisa langsung dilengkapi Sumber Belajar &amp; LKPD.
                </p>

                {/* Promo Box: Cari produk lain dari Jangan Jadi Guru? */}
                <div className="bg-[#fef9ee] border border-[#f3dc9f] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-500">
                      <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        Cari produk lain dari Jangan Jadi Guru?
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                        Ebook, webinar, &amp; bahan ajar lain ada di etalase kami.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate?.('dasmen-lkpd')}
                    className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-black whitespace-nowrap cursor-pointer hover:underline shrink-0"
                  >
                    Lihat semua →
                  </button>
                </div>

                {/* Container Checkpoint: FOR LEARNING · FORMATIF */}
                <div className="border border-[#c2d7ed] rounded-2xl p-4 sm:p-5 space-y-4 bg-white shadow-2xs">
                  {/* Checkpoint row: FOR LEARNING · FORMATIF */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 flex-wrap sm:flex-nowrap">
                      <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase whitespace-nowrap">
                        FOR LEARNING · FORMATIF
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
                        Jumlah checkpoint:
                      </span>
                      <div className="relative inline-block w-28">
                        <select
                          value={jumlahCheckpoint}
                          onChange={(e) => setJumlahCheckpoint(parseInt(e.target.value) || 3)}
                          className="w-full appearance-none px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 pr-8 cursor-pointer shadow-2xs"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-600 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleBuatCheckpoint}
                      disabled={isGeneratingCheckpoints}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 bg-white text-slate-800 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {isGeneratingCheckpoints ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          <span>Membuat...</span>
                        </>
                      ) : (
                        <span>Buat checkpoint</span>
                      )}
                    </button>
                  </div>

                  {/* Generated Checkpoint Cards matching check point.png */}
                  {generatedCheckpoints.length > 0 && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      {/* Green notification bar */}
                      <div className="bg-[#eaf5ea] border border-[#cce8d0] rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-emerald-900 font-medium shadow-2xs">
                        <Pencil className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>
                          <strong>{generatedCheckpoints.length} checkpoint formatif</strong> siap. Buat LKPD tiap checkpoint bila perlu — checkpoint otomatis masuk aktivitas modul.
                        </span>
                      </div>

                      {/* Cards list with full format from bahandanlkpd.pdf */}
                      <div className="space-y-4">
                        {generatedCheckpoints.map((cp) => (
                          <CheckpointCard
                            key={cp.id}
                            cp={cp}
                            schoolName={globalContext.identity.schoolName}
                            subject={(selectedTp?.element || selectedTp?.material || currentSubject) || 'Pendidikan Pancasila'}
                            grade={globalContext.identity.level === 'SD' ? 'Kelas 3' : 'Kelas 7'}
                            phase={globalContext.identity.level === 'SD' ? 'B' : 'D'}
                            tpText={currentTpText}
                            onToggleSumberBelajar={handleToggleSumberBelajar}
                            onToggleLkpd={handleToggleLkpd}
                            onSkipSumber={handleSkipSumber}
                            onUpdateCpType={handleUpdateCpType}
                            onSaveToCollection={onSaveToCollection}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bentuk As & Of Learning Sesuai as 0f_001.png - as 0f_005.png */}
                <BentukAsOfInlineSection
                  globalContext={globalContext}
                  subject={(selectedTp?.element || selectedTp?.material || currentSubject) || 'Pendidikan Pancasila'}
                  grade={globalContext.identity.level === 'SD' ? 'Kelas 3' : 'Kelas 7'}
                  phase={globalContext.identity.level === 'SD' ? 'B' : 'D'}
                  tpText={currentTpText}
                  onSaveToCollection={onSaveToCollection}
                />

                {/* Direct Action: Generate Bentuk As & Of (5 Lembar Modal View) */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 italic">
                    Format Lengkap 5 Lembar Dokumen As &amp; Of Learning (as 0f_001.png – as 0f_005.png)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBuatInstrumen('Portofolio & Projek', 'AS LEARNING')}
                    className="px-4 py-2 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-sky-300" />
                    <span>Buka Dokumen Cetak 5 Lembar (A4/PDF)</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerateModulAjar}
            disabled={isGeneratingModul}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer ${
              kktpList.length > 0 
                ? 'bg-[#0f2942] hover:bg-[#1a3a5a] text-white' 
                : 'bg-[#8ea4ba] hover:bg-[#7b92a9] text-white'
            }`}
          >
            {isGeneratingModul ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{generationStepText || 'Menyusun Modul Ajar Lengkap...'}</span>
              </>
            ) : (
              <span>
                {kktpList.length > 0 ? 'Generate Modul Ajar Lengkap ✨' : 'Generate Modul Ajar (buat KKTP dulu)'}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* SUCCESS NOTIFICATION */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* GENERATED MODUL AJAR PREVIEW (RPP 6 HALAMAN SESUAI rpp.png - rpp_005.png) */}
      {generatedModul && (
        <RppDocumentPreview
          modul={generatedModul}
          globalContext={globalContext}
          selectedDimensions={selectedDimensions}
          detailedRubricRows={detailedRubricRows}
          checkpoints={generatedCheckpoints}
          ambangKetuntasan={ambangKetuntasan}
          onSaveToCollection={onSaveToCollection}
          onRegenerate={handleGenerateModulAjar}
          onOpenCollection={() => onNavigate?.('koleksi')}
          onDevelopOtherTp={() => onNavigate?.('dasmen-pilih-tp')}
        />
      )}

      {/* GENERATED BENTUK AS & OF MODAL (5 LEMBAR SESUAI as 0f_001.png - as 0f_005.png) */}
      {bentukAsOfData && (
        <BentukAsOfPreview
          isOpen={showBentukAsOfModal}
          onClose={() => setShowBentukAsOfModal(false)}
          data={bentukAsOfData}
          globalContext={globalContext}
          onSaveToCollection={onSaveToCollection}
          onRegenerate={() => {
            handleBuatInstrumen(selectedAsLearning, 'AS LEARNING');
          }}
          onOpenCollection={() => {
            setShowBentukAsOfModal(false);
            onNavigate?.('koleksi');
          }}
          onDevelopOtherTp={() => {
            setShowBentukAsOfModal(false);
            onNavigate?.('dasmen-pilih-tp');
          }}
        />
      )}
    </div>
  );
};
