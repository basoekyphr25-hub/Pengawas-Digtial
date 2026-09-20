import { 
  TargetPembelajaran, 
  AtpItem, 
  InitialCognitiveAssessment, 
  KKTPCriteria, 
  AssessmentInstrument, 
  LKPDData, 
  LearningActivityStep, 
  ModulAjar, 
  P5Project, 
  PaudPlayTheme, 
  PaudModulAjar, 
  GlobalContext,
  NonCognitiveInstrument
} from '../../types';
import { generatePedagogicalJSON } from './client';

/**
 * 1. CP ke TP Generator
 */
export async function parseCpToTp(params: {
  subjectName: string;
  phase: string;
  grade: string;
  cpText: string;
  element?: string;
  curriculum: 'merdeka' | 'kbc';
  globalContext?: GlobalContext;
}): Promise<TargetPembelajaran[]> {
  const elementClause = params.element ? `\nElemen Capaian Pembelajaran: ${params.element}` : '';
  const prompt = `Analisis Capaian Pembelajaran (CP) berikut dan pecah menjadi 3 hingga 5 Tujuan Pembelajaran (TP) yang logis, berurutan, dan memuat KKO (Kata Kerja Operasional) Taksonomi Bloom yang terukur:

Mata Pelajaran: ${params.subjectName}
Fase: ${params.phase}
Kelas: ${params.grade}${elementClause}
Kurikulum: ${params.curriculum === 'kbc' ? 'Kurikulum Berbasis Cinta (KBC Madrasah)' : 'Kurikulum Merdeka'}
Teks Capaian Pembelajaran (CP):
"${params.cpText}"

Kembalikan dalam format JSON array objek:
[
  {
    "id": "TP-01",
    "sequence": 1,
    "text": "Teks lengkap tujuan pembelajaran...",
    "material": "Materi pokok / topik esensial",
    "competency": "Kompetensi yang dicapai (KKO Bloom)",
    "evidence": "Bukti terukur ketercapaian tujuan",
    "pancaCintaTopic": "${params.curriculum === 'kbc' ? 'Cinta Allah dan Rasul / Cinta Ilmu / dll' : ''}",
    "pancasilaDimension": "${params.curriculum === 'merdeka' ? 'Bernalar Kritis / Kreatif / Mandiri' : ''}"
  }
]`;

  return generatePedagogicalJSON<TargetPembelajaran[]>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => [
      {
        id: 'TP-01',
        sequence: 1,
        text: `Memahami dan mengidentifikasi konsep esensial ${params.subjectName} pada konteks kehidupan sehari-hari dengan tepat.`,
        material: `Konsep Dasar dan Prinsip ${params.subjectName}`,
        competency: 'Mengidentifikasi dan Menjelaskan (C2)',
        evidence: 'Peserta didik mampu menyebutkan 3 elemen kunci dan menjelaskan keterkaitannya dengan benar.',
        pancaCintaTopic: params.curriculum === 'kbc' ? 'Cinta Ilmu Pengetahuan' : undefined,
        pancasilaDimension: params.curriculum === 'merdeka' ? 'Bernalar Kritis' : undefined
      },
      {
        id: 'TP-02',
        sequence: 2,
        text: `Menganalisis keterkaitan antara prinsip ${params.subjectName} dengan permasalahan nyata di lingkungan sekitar sekolah.`,
        material: `Aplikasi Kontekstual ${params.subjectName}`,
        competency: 'Menganalisis (C4)',
        evidence: 'Peserta didik mampu menyusun diagram analisis sebab-akibat fenomena lokal berdasarkan konsep materi.',
        pancaCintaTopic: params.curriculum === 'kbc' ? 'Cinta Lingkungan Alam' : undefined,
        pancasilaDimension: params.curriculum === 'merdeka' ? 'Bergotong Royong & Bernalar Kritis' : undefined
      },
      {
        id: 'TP-03',
        sequence: 3,
        text: `Menerapkan konsep ${params.subjectName} untuk merancang solusi kreatif atas studi kasus yang diberikan secara kolaboratif.`,
        material: `Pemecahan Masalah dan Proyek Sederhana`,
        competency: 'Menerapkan dan Mencipta (C3-C6)',
        evidence: 'Peserta didik mampu mempresentasikan gagasan solusi dan menghasilkan karya produk/laporan sederhana.',
        pancaCintaTopic: params.curriculum === 'kbc' ? 'Cinta Diri dan Sesama' : undefined,
        pancasilaDimension: params.curriculum === 'merdeka' ? 'Kreatif & Mandiri' : undefined
      },
      {
        id: 'TP-04',
        sequence: 4,
        text: `Mengevaluasi hasil temuan dan merefleksikan nilai kebermanfaatan pembelajaran bagi penguatan karakter dan akhlak mulia.`,
        material: `Refleksi dan Evaluasi Karakter`,
        competency: 'Mengevaluasi (C5)',
        evidence: 'Peserta didik menuliskan jurnal refleksi pribadi yang memuat komitmen perbaikan diri.',
        pancaCintaTopic: params.curriculum === 'kbc' ? 'Cinta Allah SWT dan Rasulullah SAW' : undefined,
        pancasilaDimension: params.curriculum === 'merdeka' ? 'Beriman, Bertakwa kepada Tuhan YME' : undefined
      }
    ]
  });
}

/**
 * 2. ATP Builder
 */
export async function buildAtpSequence(params: {
  tpList: TargetPembelajaran[];
  subject: string;
  phase: string;
  grade: string;
  curriculum: 'merdeka' | 'kbc';
  selectedDimensions?: string[];
  sequencingMethod?: string;
  studentContextNote?: string;
  globalContext?: GlobalContext;
}): Promise<AtpItem[]> {
  const methodClause = params.sequencingMethod ? `\nMetode Pengurutan Alur: ${params.sequencingMethod}` : '';
  const dimensionsClause = params.selectedDimensions?.length ? `\nDimensi Profil Lulusan / Karakter: ${params.selectedDimensions.join(', ')}` : '';
  const studentNoteClause = params.studentContextNote ? `\nCatatan Konteks Murid: ${params.studentContextNote}` : '';

  const prompt = `Susunlah Tujuan Pembelajaran (TP) berikut ke dalam Alur Tujuan Pembelajaran (ATP) / Learning Journey yang kronologis, koheren, dan memperhitungkan alokasi JP per semester:

Mata Pelajaran: ${params.subject} (${params.phase} / ${params.grade})${methodClause}${dimensionsClause}${studentNoteClause}
Daftar TP: ${JSON.stringify(params.tpList.map(t => ({ id: t.id, text: t.text, material: t.material })))}

Format output JSON array:
[
  {
    "tpId": "TP-01",
    "stepNumber": 1,
    "tpText": "...",
    "material": "...",
    "allocationJp": 4,
    "targetTerm": "Semester 1",
    "profileDimension": "${params.selectedDimensions?.[0] || 'Penalaran Kritis'}",
    "pedagogicalNote": "Catatan scaffolding atau strategi penyampaian materi"
  }
]`;

  return generatePedagogicalJSON<AtpItem[]>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => params.tpList.map((tp, idx) => ({
      tpId: tp.id,
      stepNumber: idx + 1,
      tpText: tp.text,
      material: tp.material,
      allocationJp: 4,
      targetTerm: idx < 2 ? 'Semester 1' : 'Semester 2',
      profileDimension: params.selectedDimensions && params.selectedDimensions.length > 0
        ? params.selectedDimensions[idx % params.selectedDimensions.length]
        : (params.curriculum === 'kbc' 
          ? (tp.pancaCintaTopic || 'Panca Cinta: Cinta Ilmu & Lingkungan')
          : (tp.pancasilaDimension || 'Bernalar Kritis & Kreatif')),
      pedagogicalNote: `Mulai dari pendekatan ${params.sequencingMethod || 'Konkret ke Abstrak'}, sesuaikan dengan karakteristik murid (${params.studentContextNote || 'visual dan kontekstual'}).`
    }))
  });
}

/**
 * 3. Asesmen Awal Kognitif (3 Tingkat)
 */
export async function generateInitialCognitiveTest(params: {
  selectedTp: TargetPembelajaran[];
  subject: string;
  grade: string;
  globalContext?: GlobalContext;
}): Promise<InitialCognitiveAssessment> {
  const prompt = `Buatkan Asesmen Awal Kognitif 3 Tingkat untuk mendiagnosis kesiapan belajar murid pada materi ${params.subject} (${params.grade}):
TP Terpilih: ${params.selectedTp.map(t => t.text).join('; ')}

Tingkat:
1. Level -2 (Prasyarat materi sekitar 2 tingkat kelas di bawah)
2. Level -1 (Prasyarat materi sekitar 1 tingkat kelas di bawah)
3. Level Saat Ini (Materi pengantar kelas saat ini)

Format output JSON:
{
  "levelMinus2": {
    "question": "Pertanyaan diagnostik konkret...",
    "expectedAnswer": "Kunci/jawaban yang diharapkan...",
    "followUp": "Tindak lanjut pedagogis jika belum tuntas..."
  },
  "levelMinus1": { ... },
  "levelCurrent": { ... }
}`;

  return generatePedagogicalJSON<InitialCognitiveAssessment>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => ({
      levelMinus2: {
        question: `Sebutkan dan jelaskan kembali fakta/konsep paling mendasar yang mendasari ${params.subject} yang telah dipelajari dua tingkat sebelumnya.`,
        expectedAnswer: 'Murid mampu mengingat istilah kunci dasar dan memberikan satu contoh konkret.',
        followUp: 'Berikan penguatan materi prasyarat berupa bahan bacaan visual singkat atau lembar pengingat mandiri sebelum sesi inti.'
      },
      levelMinus1: {
        question: `Bagaimana hubungan antara konsep dasar tersebut dengan materi yang telah dipelajari pada kelas satu tingkat di bawah saat ini?`,
        expectedAnswer: 'Murid dapat menjelaskan keterkaitan sebab-akibat sederhana dengan bahasa sendiri.',
        followUp: 'Kelompokkan murid ke dalam tim belajar sebaya dengan pendampingan fasilitatif.'
      },
      levelCurrent: {
        question: `Jika Anda menghadapi situasi nyata di lingkungan Anda terkait topik ini, apa langkah pertama yang Anda lakukan untuk menganalisisnya?`,
        expectedAnswer: 'Murid mampu merumuskan hipotesis awal atau langkah identifikasi awal sesuai indikator materi.',
        followUp: 'Murid siap menerima tantangan materi inti dan kegiatan pengayaan analitis lanjutan.'
      }
    })
  });
}

/**
 * 4. KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
 */
export async function generateKKTP(params: {
  selectedTp: TargetPembelajaran[];
  subject: string;
  globalContext?: GlobalContext;
}): Promise<KKTPCriteria[]> {
  const prompt = `Buatkan instrumen KKTP (Kriteria Ketercapaian Tujuan Pembelajaran) lengkap dengan indikator terukur dan rubrik interval ketercapaian untuk:
TP: ${params.selectedTp.map(t => t.text).join('; ')}
Mata Pelajaran: ${params.subject}

Format output JSON array:
[
  {
    "indicator": "Nama indikator ketercapaian...",
    "rubric": {
      "perluBimbingan": "Deskripsi perilaku murid pada rentang 0-60%",
      "cukup": "Deskripsi perilaku murid pada rentang 61-70%",
      "baik": "Deskripsi perilaku murid pada rentang 71-85%",
      "sangatBaik": "Deskripsi perilaku murid pada rentang 86-100%"
    },
    "passingThreshold": "Kriteria minimal mencapai ketuntasan (misal: Minimal mencapai kriteria 'Baik' pada aspek utama)"
  }
]`;

  return generatePedagogicalJSON<KKTPCriteria[]>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => [
      {
        indicator: 'Kemampuan menjelaskan konsep esensial dan argumentasi fakta',
        rubric: {
          perluBimbingan: 'Belum mampu mendefinisikan konsep dasar dan memerlukan bimbingan intensif guru.',
          cukup: 'Mampu mendefinisikan konsep dasar namun belum mampu menjelaskan keterkaitannya dengan konteks nyata.',
          baik: 'Mampu menjelaskan konsep dasar dengan tepat serta memberikan contoh aplikatif di lingkungan sekitar.',
          sangatBaik: 'Mampu menganalisis konsep secara komprehensif, mengaitkan dengan isu lokal, dan menyajikan argumentasi kritis.'
        },
        passingThreshold: 'Mencapai kategori minimal Baik (71-85%)'
      },
      {
        indicator: 'Keterampilan menyelesaikan tugas LKPD dan kolaborasi kelompok',
        rubric: {
          perluBimbingan: 'Tugas LKPD belum selesai dan pasif dalam dinamika diskusi kelompok.',
          cukup: 'Menyelesaikan sebagian tugas LKPD dengan bimbingan teman sebaya.',
          baik: 'Menyelesaikan seluruh aktivitas LKPD secara aktif dan memberikan kontribusi nyata dalam diskusi.',
          sangatBaik: 'Menyelesaikan LKPD dengan analisis mendalam, memimpin diskusi secara solutif dan inklusif.'
        },
        passingThreshold: 'Mencapai kategori minimal Baik (71-85%)'
      }
    ]
  });
}

/**
 * 5. Asesmen Lengkap & LKPD Generator
 */
export async function generateAssessmentsAndLKPD(params: {
  selectedTp: TargetPembelajaran[];
  subject: string;
  grade: string;
  phase: string;
  learningModel: string;
  globalContext?: GlobalContext;
}): Promise<{
  formative: AssessmentInstrument;
  selfPeer: AssessmentInstrument;
  summative: AssessmentInstrument;
  lkpd: LKPDData;
  resources: string[];
}> {
  const prompt = `Berdasarkan prinsip Backward Design, hasilkan instrumen asesmen lengkap (Formatif, Diri/Teman Sebaya, Sumatif) dan LKPD (Lembar Kerja Peserta Didik) siap cetak yang mengintegrasikan konteks lingkungan nyata:

Mata Pelajaran: ${params.subject}
Kelas/Fase: ${params.grade} (${params.phase})
Model Pembelajaran: ${params.learningModel}
Tujuan Pembelajaran: ${params.selectedTp.map(t => t.text).join('; ')}

Format output JSON:
{
  "formative": {
    "type": "formatif",
    "title": "Asesmen Formatif: Observasi Diskusi & Kuis Cepat",
    "instruction": "Petunjuk guru untuk assessment for learning...",
    "questions": [
      { "number": 1, "prompt": "Pertanyaan pemandu cek pemahaman...", "criteriaOrRubric": "Rubrik penilaian cepat" }
    ]
  },
  "selfPeer": {
    "type": "diri",
    "title": "Asesmen Diri dan Teman Sebaya (Assessment as Learning)",
    "instruction": "Panduan murid merefleksikan proses belajar...",
    "questions": [
      { "number": 1, "prompt": "Pernyataan reflektif diri...", "criteriaOrRubric": "Skala 1-4 (Ya/Tidak/Kadang-kadang)" }
    ]
  },
  "summative": {
    "type": "sumatif",
    "title": "Asesmen Sumatif Akhir Lingkup Materi",
    "instruction": "Petunjuk pengerjaan asesmen sumatif...",
    "questions": [
      { "number": 1, "prompt": "Soal studi kasus kontekstual bernalar tingkat tinggi (HOTS)...", "criteriaOrRubric": "Kunci dan kriteria skor" }
    ]
  },
  "lkpd": {
    "title": "LEMBAR KERJA PESERTA DIDIK (LKPD)",
    "subject": "${params.subject}",
    "grade": "${params.grade}",
    "targetClass": "Kelas",
    "phase": "${params.phase}",
    "duration": "2 x 45 Menit",
    "learningObjectives": ["Tujuan 1", "Tujuan 2"],
    "instructions": ["Petunjuk 1", "Petunjuk 2"],
    "briefMaterial": "Ringkasan materi singkat yang padat dan mudah dipahami...",
    "activities": [
      { "stepNumber": 1, "activityName": "Aktivitas Eksplorasi Kontekstual", "instruction": "Instruksi langkah kerja..." },
      { "stepNumber": 2, "activityName": "Diskusi Analisis Pemecahan Masalah", "instruction": "Instruksi langkah kerja..." }
    ],
    "questions": [
      { "number": 1, "questionText": "Pertanyaan analisis berbasis data/kasus...", "type": "analytic", "answerGuide": "Petunjuk jawaban murid" },
      { "number": 2, "questionText": "Pertanyaan penalaran kritis...", "type": "essay", "answerGuide": "Petunjuk jawaban murid" }
    ],
    "studentTask": "Tugas kelompok/individu untuk menghasilkan karya atau simpulan...",
    "reflectionQuestions": [
      "Apa hal paling berharga yang saya pelajari hari ini?",
      "Bagaimana saya akan menerapkan pengetahuan ini untuk membantu lingkungan saya?"
    ],
    "conclusionPrompt": "Tuliskan kesimpulan akhir kelompok Anda di sini..."
  },
  "resources": [
    "Buku Teks Utama Kemendikbudristek / Kemenag",
    "Artikel dan studi kasus lingkungan lokal",
    "Video edukatif dan lembar infografis kontekstual"
  ]
}`;

  return generatePedagogicalJSON<{
    formative: AssessmentInstrument;
    selfPeer: AssessmentInstrument;
    summative: AssessmentInstrument;
    lkpd: LKPDData;
    resources: string[];
  }>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => ({
      formative: {
        type: 'formatif',
        title: `Asesmen Formatif: Pemantauan Berkelanjutan ${params.subject}`,
        instruction: 'Digunakan oleh guru selama proses pembelajaran untuk mendeteksi kesulitan belajar dan memberikan umpan balik langsung (Assessment for Learning).',
        questions: [
          {
            number: 1,
            prompt: 'Mengapa pemahaman mengenai materi ini penting dalam mengatasi tantangan nyata di lingkungan sekitar?',
            criteriaOrRubric: 'Mampu mengemukakan argumen logis dengan mengaitkan 2 contoh nyata.'
          },
          {
            number: 2,
            prompt: 'Cek pemahaman 1 menit: Tuliskan satu pertanyaan kritis yang paling ingin kamu ketahui lebih lanjut terkait materi hari ini!',
            criteriaOrRubric: 'Pertanyaan menunjukkan rasa ingin tahu tinggi dan kedalaman berpikir.'
          }
        ]
      },
      selfPeer: {
        type: 'diri',
        title: 'Asesmen Diri dan Antarteman (Assessment as Learning)',
        instruction: 'Murid diajak mengevaluasi kontribusi pribadi dan rekan dalam kerja kolaboratif serta penguatan karakter.',
        questions: [
          {
            number: 1,
            prompt: 'Saya aktif menyampaikan pendapat dan mendengarkan ide rekan kelompok dengan santun.',
            criteriaOrRubric: 'Skala: 4 (Selalu), 3 (Sering), 2 (Kadang-kadang), 1 (Belum)'
          },
          {
            number: 2,
            prompt: 'Rekan saya bersedia berbagi tugas dan saling membantu saat menemukan kendala pengerjaan.',
            criteriaOrRubric: 'Skala: 4 (Sangat Setuju), 3 (Setuju), 2 (Kurang Setuju), 1 (Tidak Setuju)'
          }
        ]
      },
      summative: {
        type: 'sumatif',
        title: `Asesmen Sumatif Lingkup Materi: Evaluasi Kinerja & Tes Tertulis`,
        instruction: 'Dilaksanakan di akhir lingkup materi untuk mengukur ketercapaian tujuan pembelajaran secara komprehensif (Assessment of Learning).',
        questions: [
          {
            number: 1,
            prompt: `Disajikan data/kasus nyata mengenai fenomena di masyarakat terkait ${params.subject}. Analisislah faktor penyebab dan dampaknya berdasarkan konsep materi yang telah dipelajari!`,
            criteriaOrRubric: 'Skor 1-4: Kedalaman analisis, akurasi konsep, ketepatan solusi yang diusulkan.'
          },
          {
            number: 2,
            prompt: 'Rancanglah satu solusi aplikatif yang dapat diterapkan di lingkungan sekolah atau rumah untuk mengoptimalkan potensi yang ada!',
            criteriaOrRubric: 'Skor 1-4: Orisinalitas ide, kelayakan implementasi, serta nilai kemanfaatan sosial.'
          }
        ]
      },
      lkpd: {
        title: `LEMBAR KERJA PESERTA DIDIK (LKPD) - ${params.subject.toUpperCase()}`,
        subject: params.subject,
        grade: params.grade,
        targetClass: `${params.grade}`,
        phase: params.phase,
        duration: '2 Pertemuan (4 JP)',
        learningObjectives: params.selectedTp.map(t => t.text),
        instructions: [
          'Berdoalah sebelum memulai kegiatan belajar bersama kelompokmu.',
          'Baca ringkasan materi dan petunjuk setiap aktivitas dengan teliti.',
          'Diskusikan setiap pertanyaan bersama tim dan saling menghargai pendapat.',
          'Tuliskan hasil refleksi dan kesimpulan kelompok pada kolom yang tersedia.'
        ],
        briefMaterial: `Pembelajaran pada materi ${params.subject} mengajak kita memahami hubungan erat antara konsep teoritis dengan fakta di sekitar kita. Melalui pengamatan cermat, kita dapat menemukan pola, memecahkan masalah dengan bijak, dan menumbuhkan rasa tanggung jawab atas apa yang kita pelajari.`,
        activities: [
          {
            stepNumber: 1,
            activityName: 'Aktivitas 1: Mengamati Fenomena & Menemukan Masalah',
            instruction: 'Cermati studi kasus atau lingkungan sekitarmu, lalu catat 3 fakta menarik dan 1 permasalahan utama yang ditemukan.'
          },
          {
            stepNumber: 2,
            activityName: 'Aktivitas 2: Kolaborasi Solusi & Eksperimen/Diskusi',
            instruction: 'Berdasarkan konsep materi, diskusikan langkah-langkah solutif atau analisis mendalam untuk menjawab permasalahan tersebut.'
          },
          {
            stepNumber: 3,
            activityName: 'Aktivitas 3: Presentasi & Berbagi Karya',
            instruction: 'Susun hasil diskusi ke dalam format infografis ringkas atau rangkuman tertulis untuk dipresentasikan di depan kelas.'
          }
        ],
        questions: [
          {
            number: 1,
            questionText: `Jelaskan bagaimana konsep ${params.subject} dapat menjelaskan fenomena yang Anda amati pada Aktivitas 1!`,
            type: 'analytic',
            answerGuide: 'Jawaban harus memuat minimal 2 korelasi konsep materi dengan fakta lapangan.'
          },
          {
            number: 2,
            questionText: 'Apa saja tantangan yang mungkin dihadapi saat menerapkan solusi kelompok Anda, dan bagaimana cara mengatasinya?',
            type: 'essay',
            answerGuide: 'Siswa memaparkan identifikasi hambatan dan langkah mitigasi secara rasional.'
          }
        ],
        studentTask: 'Buatlah resume satu halaman atau infografis kelompok yang memuat rangkuman konsep, temuan lapangan, dan rencana aksi nyata.',
        reflectionQuestions: [
          'Hal baru apa yang paling mengubah cara pandang saya setelah mempelajari materi ini?',
          'Sikap positif apa yang telah saya kembangkan saat bekerja sama dengan teman hari ini?',
          'Bagaimana saya dapat membagikan wawasan ini kepada keluarga atau teman di luar sekolah?'
        ],
        conclusionPrompt: 'Berdasarkan seluruh aktivitas dan diskusi hari ini, kesimpulan utama kelompok kami adalah:'
      },
      resources: [
        'Buku Panduan Guru dan Buku Siswa Kemendikbudristek / Kemenag RI',
        'Lembar observasi lingkungan sekolah dan artikel kasus kontekstual',
        'Media digital interaktif dan video pembelajaran terverifikasi'
      ]
    })
  });
}

/**
 * 6. Full Modul Ajar Generator (Step 11 Integration)
 */
export async function generateLearningActivities(params: {
  selectedTp: TargetPembelajaran[];
  subject: string;
  totalSessions: number;
  totalJp: number;
  learningModel: string;
  globalContext?: GlobalContext;
}): Promise<LearningActivityStep[]> {
  const prompt = `Susunlah skenario Aktivitas Pembelajaran Berdiferensiasi (Konten, Proses, Produk) berbasis Backward Design sebanyak ${params.totalSessions} pertemuan untuk mata pelajaran ${params.subject} dengan model ${params.learningModel}:

TP: ${params.selectedTp.map(t => t.text).join('; ')}
Alokasi Waktu: ${params.totalJp} JP (${params.totalSessions} Pertemuan)

Format output JSON array:
[
  {
    "sessionNumber": 1,
    "title": "Pertemuan 1: Eksplorasi Awal dan Pemetaan Masalah",
    "durationMinutes": 80,
    "preliminary": [
      "Guru menyapa dengan hangat, presensi, dan berdoa bersama.",
      "Apersepsi: Mengaitkan materi dengan isu lokal dan kesiapan belajar murid.",
      "Menyampaikan tujuan pembelajaran dan alur aktivitas."
    ],
    "coreActivities": {
      "differentiatedContent": "Diferensiasi Konten: Menyediakan bahan ajar berupa artikel bergambar untuk visual, rekaman penjelasan untuk auditori, dan benda konkret/kartu masalah untuk kinestetik.",
      "differentiatedProcess": "Diferensiasi Proses: Siswa dengan kesiapan butuh bimbingan didampingi guru secara berkala; siswa mahir melakukan analisis mandiri dan menjadi tutor sebaya.",
      "differentiatedProduct": "Diferensiasi Produk: Laporan pengerjaan dapat berupa infografis, rekaman audio, atau rangkuman peta konsep sesuai minat siswa.",
      "mainFlow": [
        "Langkah 1 model pembelajaran...",
        "Langkah 2 model pembelajaran...",
        "Langkah 3 model pembelajaran..."
      ]
    },
    "closing": [
      "Siswa bersama guru menyimpulkan inti pembelajaran.",
      "Refleksi singkat: Apa yang menyenangkan dan apa yang masih membingungkan.",
      "Tindak lanjut, doa penutup, dan salam."
    ]
  }
]`;

  return generatePedagogicalJSON<LearningActivityStep[]>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => Array.from({ length: params.totalSessions || 2 }, (_, i) => ({
      sessionNumber: i + 1,
      title: `Pertemuan ${i + 1}: ${i === 0 ? 'Orientasi, Eksplorasi Konsep, dan Investigasi Masalah' : 'Kolaborasi Solusi, Presentasi Karya, dan Evaluasi Menyeluruh'}`,
      durationMinutes: Math.round(((params.totalJp || 4) / (params.totalSessions || 2)) * 40),
      preliminary: [
        'Pembiasaan: Salam hangat, doa bersama, dan pembacaan pesan inspiratif/nilai Panca Cinta.',
        'Apersepsi bermakna: Mengajukan pertanyaan pemantik yang relevan dengan fenomena di lingkungan murid.',
        'Penyampaian tujuan pembelajaran, skenario aktivitas, dan kriteria penilaian.'
      ],
      coreActivities: {
        differentiatedContent: 'Diferensiasi Konten: Menyajikan variasi bahan bacaan teks, infografis visual, serta video pendek kontekstual.',
        differentiatedProcess: 'Diferensiasi Proses: Scaffolding bertahap bagi kelompok yang membutuhkan pendampingan khusus, serta tugas tantangan analitis bagi kelompok mahir.',
        differentiatedProduct: 'Diferensiasi Produk: Murid memilih format penyajian hasil (peta pikiran digital, resume teks, atau presentasi lisan).',
        mainFlow: [
          `Fase 1 (${params.learningModel}): Pengorganisasian murid ke dalam kelompok belajar heterogen yang saling melengkapi.`,
          `Fase 2 (${params.learningModel}): Penyelidikan terbimbing menggunakan LKPD terstruktur untuk menggali data dan fakta.`,
          `Fase 3 (${params.learningModel}): Mengembangkan gagasan solusi, saling memberi masukan konstruktif dalam diskusi kelompok.`
        ]
      },
      closing: [
        'Apresiasi menyeluruh atas dedikasi dan kerja sama setiap murid.',
        'Refleksi metakognisi: Mengisi lembar refleksi 2 bintang 1 harapan.',
        'Pemberian tindak lanjut penugasan mandiri, doa bersama, dan salam penutup.'
      ]
    }))
  });
}

/**
 * 7. Kokurikuler / Delapan Profil Lulusan (DPL) Generator
 */
export async function generateP5Project(params: {
  theme: string;
  focusTopic: string;
  totalJp: number;
  gradeOrAge: string;
  path: 'dasmen' | 'paud';
  globalContext?: GlobalContext;
}): Promise<P5Project> {
  const prompt = `Rancang modul kokurikuler ${params.path === 'paud' ? 'PAUD (6 Kemampuan Fondasi)' : 'dengan sasaran Delapan Profil Lulusan (DPL)'} yang kontekstual dan berdaya guna:

Tema: ${params.theme}
Fokus Topik: ${params.focusTopic}
Alokasi Waktu: ${params.totalJp} JP
Sasaran: ${params.gradeOrAge}

Delapan Profil Lulusan (DPL) acuan:
1. Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa
2. Kewargaan
3. Penalaran Kritis
4. Kreativitas
5. Kolaborasi
6. Kemandirian
7. Kesehatan
8. Komunikasi

Alur kegiatan kokurikuler wajib memuat 4 tahapan:
1. Tahap Pengenalan
2. Tahap Kontekstualisasi
3. Tahap Aksi
4. Tahap Refleksi & Tindak Lanjut

Sertakan rubrik asesmen 4 skala: Mulai Berkembang (MB), Sedang Berkembang (SB), Berkembang Sesuai Harapan (BSH), Sangat Berkembang (SAB).

Format output JSON:
{
  "id": "KOKURIKULER-01",
  "title": "Judul Kegiatan Kokurikuler yang Menarik dan Menginspirasi",
  "targetLevel": "${params.path}",
  "gradeOrAge": "${params.gradeOrAge}",
  "totalJp": ${params.totalJp},
  "theme": "${params.theme}",
  "focusTopic": "${params.focusTopic}",
  "dimensions": ["Dimensi DPL 1", "Dimensi DPL 2"],
  "subDimensions": ["Elemen / Sub Elemen 1", "Elemen / Sub Elemen 2"],
  "targetEndPhase": "Fase capaian di akhir fase...",
  "annualTimeline": "Jadwal blok / reguler sepanjang semester...",
  "flowPhases": {
    "pengenalan": ["Aktivitas 1...", "Aktivitas 2..."],
    "kontekstualisasi": ["Aktivitas 1...", "Aktivitas 2..."],
    "aksi": ["Aktivitas 1...", "Aktivitas 2..."],
    "refleksi": ["Aktivitas 1...", "Aktivitas 2..."]
  },
  "assessmentRubric": [
    {
      "dimension": "Nama Dimensi DPL",
      "subElement": "Nama Sub-elemen",
      "stages": {
        "mulaiBerkembang": "Deskripsi perilaku MB",
        "sedangBerkembang": "Deskripsi perilaku SB",
        "berkembangSesuaiHarapan": "Deskripsi perilaku BSH",
        "sangatBerkembang": "Deskripsi perilaku SAB"
      }
    }
  ]
}`;

  return generatePedagogicalJSON<P5Project>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => ({
      id: `KOKUR-${Date.now().toString().slice(-4)}`,
      title: `Aksi Kokurikuler: ${params.focusTopic || params.theme}`,
      targetLevel: params.path,
      gradeOrAge: params.gradeOrAge,
      totalJp: params.totalJp || 48,
      theme: params.theme,
      focusTopic: params.focusTopic || 'Pemberdayaan Potensi Lingkungan Sekolah',
      dimensions: ['Kolaborasi', 'Penalaran Kritis', 'Kreativitas', 'Kewargaan'],
      subDimensions: ['Kerja sama tim inklusif', 'Mengidentifikasi masalah nyata', 'Menghasilkan gagasan orisinal solutif', 'Kepedulian dan tanggung jawab lingkungan'],
      targetEndPhase: 'Peserta didik mampu berkolaborasi secara mandiri memecahkan masalah lokal dan memamerkan karya solutif berkarakter Delapan Profil Lulusan.',
      annualTimeline: 'Pelaksanaan sistem blok mingguan pada tengah semester (total 48 JP).',
      flowPhases: {
        pengenalan: [
          'Sosialisasi tema kokurikuler dan penayangan video inspiratif dampak isu lokal.',
          'Brainstorming terpimpin mengenai tantangan dan peluang di sekitar sekolah.'
        ],
        kontekstualisasi: [
          'Kunjungan lapangan dan wawancara sederhana dengan warga sekolah / mitra lokal.',
          'Pemetaan data temuan dan perumusan masalah utama secara berkelompok.'
        ],
        aksi: [
          'Merancang purwarupa/produk solusi berkelanjutan menggunakan bahan ramah lingkungan.',
          'Uji coba dan penyempurnaan produk bersama bimbingan fasilitator.',
          'Pameran / Gelar Karya (Exhibition) dan presentasi publik di hadapan orang tua dan komunitas.'
        ],
        refleksi: [
          'Evaluasi bersama seluruh fasilitator dan murid mengenai dampak karya.',
          'Menyusun ikrar komitmen keberlanjutan aksi dalam kehidupan sehari-hari.'
        ]
      },
      assessmentRubric: [
        {
          dimension: 'Kolaborasi',
          subElement: 'Kerja Sama dan Koordinasi Tim',
          stages: {
            mulaiBerkembang: 'Mampu bekerja bersama teman namun masih perlu diarahkan dalam pembagian peran.',
            sedangBerkembang: 'Terlibat aktif dalam tim dan mampu menjalankan perannya secara memadai.',
            berkembangSesuaiHarapan: 'Menyelaraskan tindakan sendiri dengan rekan tim untuk mencapai tujuan bersama secara efektif.',
            sangatBerkembang: 'Memimpin koordinasi dengan empati, proaktif membantu rekan yang kesulitan, dan menjaga keharmonisan tim.'
          }
        },
        {
          dimension: 'Penalaran Kritis',
          subElement: 'Mengidentifikasi, Mengklarifikasi, dan Mengolah Informasi',
          stages: {
            mulaiBerkembang: 'Mengumpulkan informasi sederhana dengan bantuan guru.',
            sedangBerkembang: 'Mampu memilah informasi relevan dari observasi lapangan.',
            berkembangSesuaiHarapan: 'Menganalisis data temuan secara logis dan mengidentifikasi akar permasalahan.',
            sangatBerkembang: 'Mampu menyintesis beragam perspektif, memvalidasi bukti, dan memberikan rekomendasi orisinal.'
          }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  });
}

export const generateKokurikulerProject = generateP5Project;

/**
 * 8. PAUD TP Fondasi & Tema Bermain
 */
export async function generatePaudThemesAndTP(params: {
  childInterest: string;
  schoolContext: string;
  globalContext?: GlobalContext;
}): Promise<{
  tpList: Array<{ id: string; element: string; text: string; manifestation: string }>;
  playThemes: PaudPlayTheme[];
}> {
  const prompt = `Rancang TP Fondasi dan Tema Bermain PAUD/RA yang kaya stimulasi loose parts, bermain eksploratif, dan sesuai 6 Kemampuan Fondasi:

Minat Anak: ${params.childInterest || 'Eksplorasi alam, air, warna, binatang, kendaraan'}
Konteks Lembaga: ${params.schoolContext || 'Halaman sekolah yang asri, kebun mini, dekat pasar lokal'}

Format output JSON:
{
  "tpList": [
    {
      "id": "TP-PAUD-01",
      "element": "Nilai Agama dan Budi Pekerti",
      "text": "Anak mengenal dan menyayangi ciptaan Tuhan melalui pembiasaan merawat tanaman dan berbagi.",
      "manifestation": "Menyiram tanaman dengan riang dan mengucapkan terima kasih kepada teman."
    },
    {
      "id": "TP-PAUD-02",
      "element": "Jati Diri",
      "text": "Anak mampu mengekspresikan emosi secara wajar dan mandiri mengurus diri sendiri.",
      "manifestation": "Mau merapikan mainan dan memakai sepatu sendiri."
    },
    {
      "id": "TP-PAUD-03",
      "element": "Dasar-Dasar Literasi dan STEAM",
      "text": "Anak menunjukkan rasa ingin tahu tinggi dengan mengeksplorasi benda di sekitarnya.",
      "manifestation": "Menghitung batu kerikil dan menyusun pola balok."
    }
  ],
  "playThemes": [
    {
      "id": "TEMA-01",
      "themeName": "Tanaman Sahabatku",
      "subTheme": "Biji Ajaib & Daun Warna-Warni",
      "estimatedWeeks": 2,
      "childInterestTrigger": "Melihat kecambah tumbuh dan memungut daun kering di halaman.",
      "localEnvironmentResource": "Kebun sekolah, tanah gembur, daun beraneka bentuk, botol bekas.",
      "associatedTpIds": ["TP-PAUD-01", "TP-PAUD-03"]
    }
  ]
}`;

  return generatePedagogicalJSON<{
    tpList: Array<{ id: string; element: string; text: string; manifestation: string }>;
    playThemes: PaudPlayTheme[];
  }>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => ({
      tpList: [
        {
          id: 'TP-PAUD-01',
          element: 'Nilai Agama dan Budi Pekerti',
          text: 'Anak mengenal rasa syukur kepada Sang Pencipta dan menyayangi sesama makhluk hidup.',
          manifestation: 'Mengucapkan doa sebelum bermain dan lembut memperlakukan tanaman/hewan peliharaan.'
        },
        {
          id: 'TP-PAUD-02',
          element: 'Jati Diri',
          text: 'Anak mengenali perasaan dirinya, percaya diri saat berinteraksi, dan terampil motorik kasar/halus.',
          manifestation: 'Berani mencoba rintangan fisik baru dan sabar bergantian menggunakan mainan.'
        },
        {
          id: 'TP-PAUD-03',
          element: 'Dasar-Dasar Literasi dan STEAM',
          text: 'Anak antusias mengamati, bereksperimen dengan material lepasan (loose parts), dan mengenal konsep simbol/kuantitas.',
          manifestation: 'Membuat kreasi bentuk bebas dengan ranting/batu dan menceritakan kisahnya kepada guru.'
        }
      ],
      playThemes: [
        {
          id: 'TEMA-PAUD-01',
          themeName: 'Petualang Lingkungan Hijau',
          subTheme: 'Rahasia Daun, Tanah, dan Air Bersih',
          estimatedWeeks: 2,
          childInterestTrigger: 'Anak-anak senang bermain menyiram tanah dan mengamati jejak serangga.',
          localEnvironmentResource: 'Kebun sekolah, daun aneka tekstur, wadah air, kuas alami, batu kali.',
          associatedTpIds: ['TP-PAUD-01', 'TP-PAUD-03']
        },
        {
          id: 'TEMA-PAUD-02',
          themeName: 'Pasar Ceria di Sekolahku',
          subTheme: 'Mengenal Buah Lokal & Transaksi Sahabat',
          estimatedWeeks: 2,
          childInterestTrigger: 'Bermain peran jual-beli dan menghitung buah tiruan bersama teman.',
          localEnvironmentResource: 'Buah lokal dari pasar terdekat, keranjang anyaman, timbangan sederhana.',
          associatedTpIds: ['TP-PAUD-02', 'TP-PAUD-03']
        }
      ]
    })
  });
}

/**
 * 9. PAUD Modul Ajar Generator (Backward Design + Non-Angka Assessments)
 */
export async function generatePaudModulAjar(params: {
  theme: string;
  subTheme: string;
  ageGroup: any;
  durationDays: number;
  targetedTpList: string[];
  globalContext?: GlobalContext;
}): Promise<PaudModulAjar> {
  const prompt = `Susun Modul Ajar PAUD/RA berbasis Backward Design dengan pendekatan bermain bermakna, material loose parts, dan asesmen non-angka (catatan anekdot, checklist observasi, hasil karya, foto berseri):

Kelompok Usia: ${params.ageGroup}
Tema: ${params.theme}
Sub Tema: ${params.subTheme}
Durasi: ${params.durationDays} Hari
TP yang Disasar: ${params.targetedTpList.join('; ')}

Format output JSON:
{
  "id": "MODUL-PAUD-01",
  "title": "Modul Ajar PAUD: ${params.theme} - ${params.subTheme}",
  "ageGroup": "${params.ageGroup}",
  "theme": "${params.theme}",
  "subTheme": "${params.subTheme}",
  "durationDays": ${params.durationDays},
  "targetedTpList": ${JSON.stringify(params.targetedTpList)},
  "playActivities": [
    {
      "dayNumber": 1,
      "playInvitingInvitation": "Pijakan sebelum main: Membacakan buku cerita bergambar...",
      "playCoreExploration": [
        "Sentra Main 1: Mengelompokkan daun kering dan basah...",
        "Sentra Main 2: Mencetak tekstur daun menggunakan playdough...",
        "Sentra Main 3: Menghitung jumlah biji dengan mangkuk bambu..."
      ],
      "loosePartsMaterials": ["Daun aneka jenis", "Ranting kering", "Batu kali", "Jepitan kayu"],
      "closingReflection": "Pijakan setelah main: Recalling bersama anak sambil menanyakan mainan favoritnya..."
    }
  ],
  "assessments": {
    "anecdotalRecordGuide": "Panduan mencatat peristiwa unik spontan anak...",
    "observationChecklist": [
      "Anak mampu menuang air ke wadah tanpa tumpah",
      "Anak mau berbagi alat cetak dengan rekan bermain"
    ],
    "childWorkDocumentation": "Panduan analisis hasil karya lukisan atau susunan balok...",
    "photoSeriesIndicator": "Panduan mendokumentasikan foto proses anak dari awal hingga tuntas..."
  }
}`;

  return generatePedagogicalJSON<PaudModulAjar>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => ({
      id: `MOD-PAUD-${Date.now().toString().slice(-4)}`,
      title: `Modul Ajar Bermain: ${params.theme} (${params.subTheme})`,
      ageGroup: params.ageGroup,
      theme: params.theme,
      subTheme: params.subTheme,
      durationDays: params.durationDays || 5,
      targetedTpList: params.targetedTpList,
      playActivities: Array.from({ length: params.durationDays || 3 }, (_, d) => ({
        dayNumber: d + 1,
        playInvitingInvitation: `Pijakan Lingkungan & Apersepsi Hari ${d + 1}: Guru menyapa anak dengan boneka tangan atau lagu riang tentang ${params.subTheme}, kemudian mengajak anak mengamati penataan invitasia ragam main.`,
        playCoreExploration: [
          `Zona 1 (Eksplorasi): Mengamati bentuk dan raba tekstur menggunakan lup sederhana.`,
          `Zona 2 (Kreasi Seni & Loose Parts): Merangkai ranting, daun, dan kancing menjadi bentuk kesukaan anak.`,
          `Zona 3 (Literasi & Numerasi Bermain): Menjodohkan kartu gambar dengan benda nyata dan membilang jumlahnya.`
        ],
        loosePartsMaterials: ['Daun berbagai ukuran', 'Potongan kayu halus', 'Batu warna-warni', 'Wadah bambu', 'Kain perca'],
        closingReflection: `Recalling Hari ${d + 1}: Duduk melingkar, anak menunjukkan hasil mainannya dan menceritakan perasaannya dengan bangga.`
      })),
      assessments: {
        anecdotalRecordGuide: 'Catat tanggal, nama anak, tempat, dan kutipan ucapan serta tindakan nyata anak yang menunjukkan kemunculan capaian TP secara spontan.',
        observationChecklist: [
          'Menunjukkan rasa ingin tahu dengan banyak bertanya atau mencoba berbagai cara bermain.',
          'Dapat fokus mengeksplorasi satu kegiatan main minimal 10-15 menit.',
          'Mampu bekerja sama dan merapikan alat mainan ke tempat semula secara sukarela.'
        ],
        childWorkDocumentation: 'Tuliskan deskripsi ucapan anak saat menjelaskan hasil karyanya, serta analisis guru terhadap perkembangan motorik dan kreativitasnya.',
        photoSeriesIndicator: 'Ambil 3 rangkaian foto: (1) Saat anak memilih bahan, (2) Saat memproses/mengotak-atik, (3) Saat karya selesai dipresentasikan.'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  });
}

/**
 * 10. Asesmen Awal Non-Kognitif Generator (Konteks 2: Profil Murid)
 */
export async function generateNonCognitiveAssessment(params: {
  focuses: string[];
  format: string;
  itemCount: number;
  globalContext?: GlobalContext;
}): Promise<NonCognitiveInstrument> {
  const schoolName = params.globalContext?.identity.schoolName || 'Satuan Pendidikan';
  const level = params.globalContext?.identity.level || 'SD';
  const targetClass = params.globalContext?.studentProfile.targetClass || 'Kelas Awal';

  const prompt = `Anda adalah ahli asesmen diagnostik dan diferensiasi pembelajaran Kurikulum Merdeka.
Rancanglah instrumen "Asesmen Awal Non-Kognitif" yang hangat, aplikatif, dan kontekstual untuk:
Sekolah: ${schoolName}
Jenjang: ${level}
Kelas: ${targetClass}
Fokus yang Digali: ${params.focuses.join(', ')}
Bentuk Asesmen: ${params.format}
Jumlah Butir/Aktivitas: ${params.itemCount}

Berikan output JSON terstruktur persis sesuai skema:
{
  "id": "NONKOG-${Date.now()}",
  "title": "${params.format} — Aktivitas dan Minat Murid ${targetClass}",
  "focuses": ${JSON.stringify(params.focuses)},
  "format": "${params.format}",
  "itemCount": ${params.itemCount},
  "schoolName": "${schoolName}",
  "level": "${level}",
  "targetClass": "${targetClass}",
  "studentSheet": {
    "title": "Asesmen Awal Non-Kognitif — ${params.format} Aktivitas dan Minat Murid ${targetClass}",
    "instructions": "Sapaan hangat dan petunjuk bersahabat bagi murid di ${schoolName}...",
    "items": [
      "Pertanyaan / aktivitas 1...",
      "Pertanyaan / aktivitas 2..."
    ]
  },
  "teacherGuide": {
    "paradigm": "Asesmen for learning — asesmen awal non-kognitif",
    "format": "${params.format}",
    "schoolLevel": "${schoolName} | Jenjang: ${level}",
    "focusAreas": ${JSON.stringify(params.focuses)},
    "purpose": "Tujuan pedagogis asesmen...",
    "materials": "Alat dan bahan yang dibutuhkan...",
    "implementationSteps": [
      "1. ...",
      "2. ...",
      "3. ...",
      "4. ...",
      "5. ...",
      "6. ..."
    ],
    "diversityAdjustments": [
      "• Penyesuaian untuk murid belum lancar bicara...",
      "• Penyesuaian untuk murid pemalu...",
      "• Penyesuaian untuk murid berkebutuhan khusus..."
    ]
  },
  "differentiationFollowUp": {
    "scenarios": [
      {
        "scenarioTitle": "Skenario 1",
        "condition": "Jika: ...",
        "interpretation": "Tafsir: ...",
        "actions": {
          "konten": "...",
          "proses": "...",
          "produk": "...",
          "lingkunganBelajar": "..."
        }
      },
      {
        "scenarioTitle": "Skenario 2",
        "condition": "Jika: ...",
        "interpretation": "Tafsir: ...",
        "actions": {
          "konten": "...",
          "proses": "...",
          "produk": "...",
          "lingkunganBelajar": "..."
        }
      },
      {
        "scenarioTitle": "Skenario 3",
        "condition": "Jika: ...",
        "interpretation": "Tafsir: ...",
        "actions": {
          "konten": "...",
          "proses": "...",
          "produk": "...",
          "lingkunganBelajar": "..."
        }
      }
    ]
  },
  "createdAt": "${new Date().toISOString()}"
}`;

  return generatePedagogicalJSON<NonCognitiveInstrument>({
    prompt,
    globalContext: params.globalContext,
    fallbackGenerator: () => ({
      id: `NONKOG-${Date.now()}`,
      title: `Observasi Aktivitas dan Minat Murid Kelas Awal`,
      focuses: params.focuses,
      format: params.format,
      itemCount: params.itemCount,
      schoolName,
      level,
      targetClass,
      studentSheet: {
        title: `Asesmen Awal Non-Kognitif — ${params.format} Aktivitas dan Minat Murid Kelas Awal`,
        instructions: `Halo anak-anak pintar di ${schoolName}! Hari ini kita mau bermain dan bercerita santai bersama Ibu/Bapak Guru, ya. Nanti anak-anak boleh menunjuk gambar mana yang paling disukai, memilih kartu wajah yang menggambarkan perasaanmu saat belajar, dan bercerita tentang siapa yang sering menemanimu belajar di rumah. Tidak usah takut ya, semua cerita kalian pasti hebat!`,
        items: [
          'Aktivitas apa yang paling membuatmu bersemangat dan gembira ketika bermain atau belajar?',
          'Bagaimana perasaan hatimu saat guru mengajak membaca buku cerita atau berhitung bersama di kelas?',
          'Ketika belajar hal baru, kamu lebih senang melihat gambar/video, mendengarkan cerita, atau langsung mencoba dengan tanganmu?',
          'Kebiasaan apa yang paling sering kamu lakukan sebelum mulai belajar di rumah?',
          'Siapa yang paling sering menemanimu mengobrol atau belajar ketika berada di rumah?',
          'Siapa teman yang paling sering kamu ajak bermain atau berdiskusi saat berada di kelas?'
        ].slice(0, Math.max(3, params.itemCount))
      },
      teacherGuide: {
        paradigm: 'Asesmen for learning — asesmen awal non-kognitif',
        format: params.format,
        schoolLevel: `${schoolName} | Jenjang: ${level}`,
        focusAreas: params.focuses,
        purpose: `Memetakan ${params.focuses.join(', ')} pada murid kelas awal di ${schoolName} untuk merancang pembelajaran yang sesuai dengan kondisi nyata murid.`,
        materials: `Lembar panduan observasi guru, kartu gambar aktivitas/bermain (bola, menggambar, membaca buku, menyanyi, berkebun), dan kartu ekspresi emosi (senang, biasa saja, sedih).`,
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
              konten: 'Menyederhanakan instruksi tugas agar dapat diselesaikan secara bertahap di sekolah tanpa membebani rumah.',
              proses: 'Memberikan bimbingan mandiri (scaffolding) lebih intensif atau menerapkan sistem tutor sebaya di kelas.',
              produk: 'Mengutamakan penilaian proses langsung di kelas daripada memberikan tugas rumah (PR).',
              lingkunganBelajar: 'Menciptakan suasana kelas yang nyaman di kelas sebagai tempat belajar mandiri yang aman bagi murid.'
            }
          },
          {
            scenarioTitle: 'Skenario 2',
            condition: 'Murid menunjukkan ekspresi sedih atau bingung saat ditanya tentang belajar di rumah dan menyatakan tidak ada yang menemani belajar.',
            interpretation: 'Dukungan belajar di rumah membutuhkan penguatan afektif, kepedulian ekstra, dan ruang belajar aman di sekolah.',
            actions: {
              konten: 'Memfokuskan penugasan utama tuntas di dalam kelas dengan bimbingan langsung guru.',
              proses: 'Memberikan apresiasi berkala dan validasi emosi agar murid merasa didukung secara aman dan ramah.',
              produk: 'Memberikan opsi proyek kerja kelompok kolaboratif agar murid saling mendukung.',
              lingkunganBelajar: 'Menyediakan pojok baca dan ruang belajar santai di kelas dengan fasilitas buku bergambar.'
            }
          },
          {
            scenarioTitle: 'Skenario 3',
            condition: 'Murid sangat antusias pada gambar menggambar/mewarnai dan bercerita sering didampingi orang tua saat berkreasi di rumah.',
            interpretation: 'Murid memiliki minat visual-artistik yang kuat didukung oleh lingkungan rumah yang kondusif untuk berkreasi.',
            actions: {
              konten: 'Menyajikan materi pembelajaran dengan bantuan visual yang kaya warna dan menarik.',
              proses: 'Mengintegrasikan aktivitas menggambar atau mewarnai dalam proses eksplorasi konsep baru.',
              produk: 'Memberikan pilihan bagi murid untuk melaporkan hasil belajarnya dalam bentuk gambar atau karya rupa.',
              lingkunganBelajar: 'Memajang hasil karya gambar murid di dinding kelas untuk meningkatkan rasa percaya diri mereka.'
            }
          }
        ]
      },
      createdAt: new Date().toISOString()
    })
  });
}
