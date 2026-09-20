export type PathType = 'dasmen' | 'paud';

export type CurriculumType = 'merdeka' | 'kbc'; // Kurikulum Merdeka or Kurikulum Berbasis Cinta (Madrasah)

export type EducationLevel = 
  | 'PAUD' 
  | 'RA' 
  | 'SD' 
  | 'MI' 
  | 'SMP' 
  | 'MTs' 
  | 'SMA' 
  | 'MA' 
  | 'SMK' 
  | 'MAK';

export type Phase = 'Fondasi' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SchoolIdentity {
  teacherName: string;
  teacherNip: string;
  schoolName: string;
  principalName: string;
  principalNip: string;
  level: EducationLevel;
  cityDistrict: string;
  curriculum: CurriculumType;
  vision: string;
  mission: string;
}

export interface NonCognitiveInstrument {
  id: string;
  title: string;
  focuses: string[];
  format: string;
  itemCount: number;
  schoolName: string;
  level: string;
  targetClass: string;
  studentSheet: {
    title: string;
    instructions: string;
    items: string[];
  };
  teacherGuide: {
    paradigm: string;
    format: string;
    schoolLevel: string;
    focusAreas: string[];
    purpose: string;
    materials: string;
    implementationSteps: string[];
    diversityAdjustments: string[];
  };
  differentiationFollowUp: {
    scenarios: Array<{
      scenarioTitle: string;
      condition: string;
      interpretation: string;
      actions: {
        konten: string;
        proses: string;
        produk: string;
        lingkunganBelajar: string;
      };
    }>;
  };
  createdAt: string;
}

export interface StudentProfile {
  targetClass: string;
  totalStudents: number;
  interests: string[];
  learningReadiness: 'heterogen' | 'sebagian_mahir' | 'sebagian_butuh_bimbingan' | 'homogen';
  learningStyles: {
    visual: number; // percentage or weight
    auditory: number;
    kinesthetic: number;
  };
  socialEmotionalState: string;
  specialNeeds: string;
  inclusionNeeds: string;
  classProfileSummary?: string;
  // 6 specific fields from Konteks 2 Profil Murid UI:
  readinessSummary?: string;       // Kesiapan belajar
  interestsSummary?: string;       // Minat
  learningPreferences?: string;    // Gaya / preferensi belajar
  socialEmotionalSummary?: string; // Kondisi sosial-emosional
  culturalBackground?: string;     // Latar sosial-budaya
  inclusionNotes?: string;         // Catatan lain (opsional) — kebutuhan khusus / inklusi
  nonCognitiveInstrument?: NonCognitiveInstrument; // Generated instrument
}

export interface CommunityContext {
  localChallenges: string[]; // e.g. Sampah lingkungan, literasi, numerasi, kearifan lokal, kesehatan
  environmentalPotential: string[]; // e.g. Pesisir, pertanian, pasar tradisional, cagar budaya
  localResources: string[]; // e.g. Perpustakaan daerah, puskesmas, museum
  partners: string[]; // e.g. UMKM, Dunia Usaha/Industri (DUDI), Komunitas Seni, Orang Tua
  localFigures: string[]; // e.g. Tokoh adat, pegiat literasi, rohaniawan
}

export interface GlobalContext {
  identity: SchoolIdentity;
  studentProfile: StudentProfile;
  community: CommunityContext;
  isCompleted: boolean;
}

// DASMEN CP, TP, ATP
export interface TargetPembelajaran {
  id: string;
  sequence: number;
  text: string;
  material: string;
  competency: string;
  evidence: string;
  pancaCintaTopic?: string; // for KBC
  pancasilaDimension?: string; // for Kurikulum Merdeka
}

export interface AtpItem {
  tpId: string;
  stepNumber: number;
  tpText: string;
  material: string;
  allocationJp: number;
  targetTerm: string; // e.g. 'Semester 1'
  profileDimension: string;
  pedagogicalNote: string;
  element?: string;
  gradeLevel?: string;
  semesterNumber?: string;
  targetedDimensions?: string[];
}

export interface InitialCognitiveAssessment {
  levelMinus2: {
    question: string;
    expectedAnswer: string;
    followUp: string;
  };
  levelMinus1: {
    question: string;
    expectedAnswer: string;
    followUp: string;
  };
  levelCurrent: {
    question: string;
    expectedAnswer: string;
    followUp: string;
  };
}

export interface KKTPCriteria {
  indicator: string;
  rubric: {
    perluBimbingan: string; // 0 - 60%
    cukup: string;          // 61 - 70%
    baik: string;           // 71 - 85%
    sangatBaik: string;     // 86 - 100%
  };
  passingThreshold: string;
}

export interface AssessmentInstrument {
  type: 'formatif' | 'sumatif' | 'diri' | 'teman_sebaya';
  title: string;
  instruction: string;
  questions: Array<{
    number: number;
    prompt: string;
    criteriaOrRubric: string;
  }>;
}

export interface LKPDData {
  title: string;
  subject: string;
  grade: string;
  targetClass: string;
  phase: string;
  duration: string;
  learningObjectives: string[];
  instructions: string[];
  briefMaterial: string;
  activities: Array<{
    stepNumber: number;
    activityName: string;
    instruction: string;
  }>;
  questions: Array<{
    number: number;
    questionText: string;
    type: 'essay' | 'analytic' | 'practical';
    answerGuide?: string;
  }>;
  studentTask: string;
  reflectionQuestions: string[];
  conclusionPrompt: string;
}

export interface LearningActivityStep {
  sessionNumber: number;
  title: string;
  durationMinutes: number;
  preliminary: string[]; // Kegiatan Awal (apersepsi, motivasi, panca cinta/profil pelajar)
  coreActivities: {
    differentiatedContent?: string;
    differentiatedProcess?: string;
    differentiatedProduct?: string;
    mainFlow: string[];
  };
  closing: string[]; // Refleksi, rangkuman, doa
}

export interface ModulAjar {
  id: string;
  title: string;
  subject: string;
  phase: Phase;
  grade: string;
  semester: 'Ganjil' | 'Genap';
  totalJp: number;
  totalSessions: number;
  learningModel: 'PjBL' | 'PBL' | 'Discovery Learning' | 'CTL' | 'Berdiferensiasi';
  crossSubjectIntegration: string;
  selectedTpIds: string[];
  selectedTpTexts: string[];
  initialCognitiveAssessment: InitialCognitiveAssessment;
  kktp: KKTPCriteria[];
  formativeAssessment: AssessmentInstrument;
  selfPeerAssessment: AssessmentInstrument;
  summativeAssessment: AssessmentInstrument;
  lkpd: LKPDData;
  learningActivities: LearningActivityStep[];
  learningResources: string[];
  reflectionTeacher: string[];
  reflectionStudent: string[];
  createdAt: string;
  updatedAt: string;
}

// PAUD / RA
export interface PaudFoundationTP {
  element: 'Nilai Agama dan Budi Pekerti' | 'Jati Diri' | 'Dasar-Dasar Literasi dan STEAM';
  targets: Array<{
    id: string;
    text: string;
    competencyChild: string;
    playManifestation: string;
  }>;
}

export interface PaudPlayTheme {
  id: string;
  themeName: string;
  subTheme: string;
  estimatedWeeks: number;
  childInterestTrigger: string;
  localEnvironmentResource: string;
  associatedTpIds: string[];
}

export interface PaudModulAjar {
  id: string;
  title: string;
  ageGroup: 'KB (2-4 Tahun)' | 'TK A (4-5 Tahun)' | 'TK B (5-6 Tahun)' | 'RA A' | 'RA B';
  theme: string;
  subTheme: string;
  durationDays: number;
  targetedTpList: string[];
  playActivities: Array<{
    dayNumber: number;
    playInvitingInvitation: string; // Pijakan sebelum main
    playCoreExploration: string[];   // Pijakan saat main
    loosePartsMaterials: string[];
    closingReflection: string;      // Pijakan setelah main
  }>;
  assessments: {
    anecdotalRecordGuide: string;
    observationChecklist: string[];
    childWorkDocumentation: string;
    photoSeriesIndicator: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Kokurikuler / Delapan Profil Lulusan (DPL)
export interface AnnualPlanRow {
  id: number;
  smt: number;
  temaProjek: string;
  dimensi: string[];
  bentuk: string;
  jp: number;
  jam: string;
}

export interface P5Project {
  id: string;
  title: string;
  targetLevel: PathType;
  gradeOrAge: string;
  totalJp: number;
  theme: string;
  focusTopic: string;
  dimensions: string[];
  subDimensions: string[];
  targetEndPhase: string;
  annualTimeline: string;
  annualPlanRows?: AnnualPlanRow[];
  flowPhases: {
    pengenalan: string[];
    kontekstualisasi: string[];
    aksi: string[];
    refleksi: string[];
  };
  assessmentRubric: Array<{
    dimension: string;
    subElement: string;
    stages: {
      mulaiBerkembang: string;
      sedangBerkembang: string;
      berkembangSesuaiHarapan: string;
      sangatBerkembang: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export type KokurikulerProject = P5Project;

export type DocumentCategory = 'modul_dasmen' | 'modul_paud' | 'lkpd' | 'projek_p5' | 'kokurikuler' | 'atp' | 'asesmen_non_kognitif';

export interface SavedDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  subjectOrTheme: string;
  gradeOrAge: string;
  createdAt: string;
  data: any;
}

export interface GeminiBYOKSettings {
  apiKey: string;
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-3.8-flash' | 'gemini-3.1-pro-preview';
  isTested: boolean;
  lastTestedAt?: string;
  error?: string;
}
