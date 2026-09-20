import { useState, useEffect } from 'react';
import { 
  PathType, 
  GlobalContext, 
  TargetPembelajaran, 
  AtpItem, 
  ModulAjar, 
  LKPDData, 
  P5Project, 
  SavedDocument, 
  GeminiBYOKSettings,
  PaudModulAjar,
  PaudPlayTheme
} from '../types';
import { getStoredGeminiKey, saveGeminiKey, removeGeminiKey, getStoredModel, saveSelectedModel } from '../lib/gemini/client';

const STORAGE_KEY_APP_DATA = 'pengawas_digital_app_state_v1';

export const INITIAL_GLOBAL_CONTEXT: GlobalContext = {
  identity: {
    teacherName: 'Basuki, S.Kom.',
    teacherNip: '198507122010011008',
    schoolName: 'SMP Negeri 1 Indonesia',
    principalName: 'Dra. Hj. Siti Aminah, M.Pd.',
    principalNip: '197203151998022001',
    level: 'SMP',
    cityDistrict: 'Kabupaten Semarang',
    curriculum: 'merdeka',
    vision: 'Mewujudkan generasi berkarakter Profil Pelajar Pancasila, literat digital, unggul berwawasan lingkungan dan cinta tanah air.',
    mission: '1. Mengembangkan pembelajaran berdiferensiasi berbasis teknologi ramah murid. 2. Membangun kultur gotong royong dan kepedulian lingkungan.'
  },
  studentProfile: {
    targetClass: 'Kelas VII A',
    totalStudents: 32,
    interests: ['Teknologi & Robotik', 'Seni Visual', 'Eksplorasi Alam', 'Olahraga'],
    learningReadiness: 'heterogen',
    learningStyles: { visual: 45, auditory: 30, kinesthetic: 25 },
    socialEmotionalState: 'Antusias, senang berdiskusi kelompok, membutuhkan arahan apresiatif saat mengatasi kebuntuan tugas.',
    specialNeeds: 'Tidak ada kebutuhan fisik berat; terdapat 3 siswa memerlukan scaffolding instruksi visual bertahap.',
    inclusionNeeds: 'Pendampingan tutor sebaya dan variasi tempo pengerjaan tugas.',
    classProfileSummary: 'Kelas dinamis dengan dominasi visual-kinestetik. Sangat responsif terhadap studi kasus kontekstual lingkungan lokal dan penggunaan media visual interaktif.'
  },
  community: {
    localChallenges: ['Pengelolaan sampah plastik di kantin sekolah', 'Peningkatan literasi membaca kritis di era gawai', 'Pelestarian keanekaragaman flora lokal'],
    environmentalPotential: ['Kebun sekolah asri', 'Dekat dengan sentra UMKM kerajinan daur ulang', 'Ruang perpustakaan daerah'],
    localResources: ['Perpustakaan Daerah', 'Puskesmas Kecamatan', 'Laboratorium Komputer Sekolah'],
    partners: ['Asosiasi Bank Sampah Mandiri', 'Komunitas Seni Budaya Lokal', 'Paguyuban Orang Tua Murid'],
    localFigures: ['Pegiat Lingkungan Hidup Daerah', 'Tokoh Adat & Budayawan Lokal']
  },
  isCompleted: true
};

export interface AppStateData {
  activePath: PathType;
  globalContext: GlobalContext;
  savedDocuments: SavedDocument[];
  currentTpDrafts: TargetPembelajaran[];
  currentAtpDrafts: AtpItem[];
  currentModulDraft: Partial<ModulAjar> | null;
  currentLkpdDraft: Partial<LKPDData> | null;
  currentProjectDraft: Partial<P5Project> | null;
}

export function loadStoredAppState(): AppStateData {
  if (typeof window === 'undefined') {
    return {
      activePath: 'dasmen',
      globalContext: INITIAL_GLOBAL_CONTEXT,
      savedDocuments: [],
      currentTpDrafts: [],
      currentAtpDrafts: [],
      currentModulDraft: null,
      currentLkpdDraft: null,
      currentProjectDraft: null
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_APP_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        activePath: parsed.activePath || 'dasmen',
        globalContext: parsed.globalContext || INITIAL_GLOBAL_CONTEXT,
        savedDocuments: parsed.savedDocuments || [],
        currentTpDrafts: parsed.currentTpDrafts || [],
        currentAtpDrafts: parsed.currentAtpDrafts || [],
        currentModulDraft: parsed.currentModulDraft || null,
        currentLkpdDraft: parsed.currentLkpdDraft || null,
        currentProjectDraft: parsed.currentProjectDraft || null
      };
    }
  } catch (e) {
    console.error('Failed to parse stored state:', e);
  }

  return {
    activePath: 'dasmen',
    globalContext: INITIAL_GLOBAL_CONTEXT,
    savedDocuments: [],
    currentTpDrafts: [],
    currentAtpDrafts: [],
    currentModulDraft: null,
    currentLkpdDraft: null,
    currentProjectDraft: null
  };
}

export function saveAppStateToStorage(data: AppStateData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APP_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to persist app state:', e);
  }
}
