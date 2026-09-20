import { Phase, EducationLevel } from '../types';

export interface SubjectOption {
  id: string;
  name: string;
  category: 'umum' | 'madrasah' | 'kejuruan' | 'paud';
  phases: Phase[];
}

export const SUBJECT_OPTIONS: SubjectOption[] = [
  // Madrasah (KBC)
  { id: 'quran_hadis', name: "Al-Qur'an Hadis", category: 'madrasah', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  { id: 'akidah_akhlak', name: 'Akidah Akhlak', category: 'madrasah', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  { id: 'fikih', name: 'Fikih', category: 'madrasah', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  { id: 'ski', name: 'Sejarah Kebudayaan Islam (SKI)', category: 'madrasah', phases: ['C', 'D', 'E', 'F'] },
  { id: 'bahasa_arab', name: 'Bahasa Arab', category: 'madrasah', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  // Umum
  { id: 'bahasa_indonesia', name: 'Bahasa Indonesia', category: 'umum', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  { id: 'matematika', name: 'Matematika', category: 'umum', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  { id: 'ipas', name: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', category: 'umum', phases: ['B', 'C'] },
  { id: 'ipa', name: 'Ilmu Pengetahuan Alam (IPA)', category: 'umum', phases: ['D'] },
  { id: 'ips', name: 'Ilmu Pengetahuan Sosial (IPS)', category: 'umum', phases: ['D'] },
  { id: 'pendidikan_pancasila', name: 'Pendidikan Pancasila', category: 'umum', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  { id: 'bahasa_inggris', name: 'Bahasa Inggris', category: 'umum', phases: ['B', 'C', 'D', 'E', 'F'] },
  { id: 'informatika', name: 'Informatika', category: 'umum', phases: ['D', 'E', 'F'] },
  { id: 'pai_bp', name: 'Pendidikan Agama Islam dan Budi Pekerti', category: 'umum', phases: ['A', 'B', 'C', 'D', 'E', 'F'] },
  // Kejuruan
  { id: 'kejuruan_rpl', name: 'Dasar Pengembangan Perangkat Lunak & Gim (RPL)', category: 'kejuruan', phases: ['E', 'F'] },
  { id: 'kejuruan_tkj', name: 'Teknik Jaringan Komputer dan Telekomunikasi', category: 'kejuruan', phases: ['E', 'F'] },
  // PAUD
  { id: 'paud_fondasi', name: 'Fondasi PAUD / RA Terintegrasi', category: 'paud', phases: ['Fondasi'] }
];

export const PHASE_MAPPINGS: Record<Phase, { grades: string[]; levels: string[] }> = {
  Fondasi: { grades: ['KB (2-4 Thn)', 'TK/RA A (4-5 Thn)', 'TK/RA B (5-6 Thn)'], levels: ['PAUD', 'RA'] },
  A: { grades: ['Kelas 1', 'Kelas 2'], levels: ['SD', 'MI'] },
  B: { grades: ['Kelas 3', 'Kelas 4'], levels: ['SD', 'MI'] },
  C: { grades: ['Kelas 5', 'Kelas 6'], levels: ['SD', 'MI'] },
  D: { grades: ['Kelas 7', 'Kelas 8', 'Kelas 9'], levels: ['SMP', 'MTs'] },
  E: { grades: ['Kelas 10'], levels: ['SMA', 'MA', 'SMK', 'MAK'] },
  F: { grades: ['Kelas 11', 'Kelas 12'], levels: ['SMA', 'MA', 'SMK', 'MAK'] },
};

export const DEFAULT_CP_PRESETS: Record<string, Record<string, string>> = {
  bahasa_indonesia: {
    A: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar, sesuai dengan tujuan, konteks sosial, dan akademis. Peserta didik mampu memahami teks narasi pendek dan mengekspresikan gagasan secara lisan dan tertulis sederhana dengan kosakata yang relevan.',
    B: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar, sesuai dengan tujuan, konteks sosial, dan akademis. Peserta didik mampu memahami teks narasi, eksposisi, dan instruksional, serta menyusun teks deskripsi dan laporan sederhana dengan ejaan yang tepat.',
    C: 'Peserta didik mampu menganalisis informasi berupa fakta, prosedur, dan interpretasi gagasan dari berbagai tipe teks. Mampu menulis teks eksplanasi, narasi, dan argumentasi dengan kalimat efektif dan kohesif.',
    D: 'Peserta didik mampu membaca, mengevaluasi, dan mengkreasi teks deskriptif, naratif, eksposisi, dan diskusi kritis yang relevan dengan isu sosial dan kebangsaan, serta mempresentasikan ide secara santun dan logis.',
    E: 'Peserta didik mampu mengevaluasi gagasan dan pandangan berdasarkan kaidah logika berbahasa dari membaca berbagai tipe teks di media cetak dan elektronik, serta mengalihwahanakan teks secara kreatif.',
    F: 'Peserta didik mampu mengapresiasi, mengevaluasi, dan mencipta karya sastra serta teks ilmiah/kebahasaan tingkat lanjut dengan argumen mendalam dan etika akademik.'
  },
  matematika: {
    A: 'Peserta didik dapat membilang lambang bilangan cacah sampai dengan 100, melakukan operasi penjumlahan dan pengurangan sederhana, mengenal bangun datar dan ruang, serta membaca piktogram sederhana.',
    B: 'Peserta didik dapat melakukan operasi hitung penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah sampai 1.000, memahami pecahan senilai, menghitung keliling dan luas bangun datar, serta menyajikan data dalam diagram batang.',
    C: 'Peserta didik memahami konsep bilangan desimal dan persen, menyelesaikan operasi hitung pecahan campuran, menghitung volume kubus dan balok, serta menginterpretasi data statistik sederhana.',
    D: 'Peserta didik memahami bilangan berpangkat, sistem persamaan linear, relasi dan fungsi, teorema Pythagoras, transformasi geometri, serta peluang dan statistika untuk menyelesaikan masalah kontekstual.'
  },
  fikih: {
    A: 'Peserta didik mampu mengenal rukun Islam, thaharah (bersuci dari hadas kecil), tata cara berwudu, dan salat fardhu lima waktu secara tertib dan penuh cinta kepada Allah SWT.',
    B: 'Peserta didik memahami tata cara salat berjemaah, salat sunah rawatib, zikir dan doa setelah salat, serta hukum makanan dan minuman halal berdasarkan syariat Islam.',
    C: 'Peserta didik memahami konsep zakat fitrah, kurban, puasa Ramadan, serta tata cara ibadah haji dan umrah sebagai bukti ketaatan dan cinta kepada sesama dan Sang Khaliq.',
    D: 'Peserta didik menganalisis ketentuan bersuci dari hadas besar, salat jenazah, muamalah jual beli yang adil, serta menghindari riba dan penipuan dalam kehidupan modern.'
  },
  quran_hadis: {
    A: 'Peserta didik mampu melafalkan, menghafal, dan memahami pesan pokok surat-surat pendek (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas) dengan makhraj huruf yang benar dan cinta Al-Qur\'an.',
    B: 'Peserta didik mampu membaca Al-Qur\'an sesuai hukum tajwid nun sukun dan tanwin, serta memahami hadis tentang kebersihan dan menghormati orang tua.',
    D: 'Peserta didik mampu menganalisis hukum mad, waqaf, serta hadis tentang persaudaraan, toleransi, dan etika menuntut ilmu dengan penalaran kritis.'
  },
  ipas: {
    B: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada hewan dan tumbuhan, siklus hidup makhluk hidup, wujud zat dan perubahannya, serta peran manusia dalam melestarikan lingkungan sekitar.',
    C: 'Peserta didik memahami sistem organ tubuh manusia, transfer energi dalam ekosistem, gelombang bunyi dan cahaya, kondisi geografis Indonesia, serta kearifan lokal dalam menjaga ketahanan pangan dan budaya.'
  }
};

export const PANCA_CINTA_TOPICS = [
  { id: 'cinta_allah_rasul', name: 'Cinta Allah SWT dan Rasulullah SAW', desc: 'Penanaman tauhid, ibadah dengan kesadaran hati, dan keteladanan akhlak mulia' },
  { id: 'cinta_ilmu', name: 'Cinta Ilmu Pengetahuan', desc: 'Rasa ingin tahu tinggi, kegigihan belajar, literasi mendalam, dan daya kritis' },
  { id: 'cinta_diri_sesama', name: 'Cinta Diri dan Sesama', desc: 'Menghargai keberagaman, empati, anti-perundungan, dan gotong royong' },
  { id: 'cinta_lingkungan', name: 'Cinta Lingkungan Alam', desc: 'Karakter ekologis, peduli sampah, pelestarian hayati, dan mitigasi iklim' },
  { id: 'cinta_tanah_air', name: 'Cinta Tanah Air & Bangsa', desc: 'Nasionalisme, toleransi bhinneka tunggal ika, dan kontribusi nyata untuk negeri' }
];

export const DELAPAN_PROFIL_LULUSAN = [
  { id: 'keimanan_ketakwaan', name: 'Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa', desc: 'Penghayatan nilai spiritual, budi pekerti luhur, dan akhlak mulia dalam kehidupan.' },
  { id: 'kewargaan', name: 'Kewargaan', desc: 'Rasa cinta tanah air, kepatuhan norma, kepedulian sosial, dan tanggung jawab atas keberlanjutan lingkungan.' },
  { id: 'penalaran_kritis', name: 'Penalaran Kritis', desc: 'Kemampuan berpikir logis, analitis, evaluatif, dan reflektif dalam memecahkan masalah.' },
  { id: 'kreativitas', name: 'Kreativitas', desc: 'Kemampuan berpikir inovatif, orisinal, dan fleksibel untuk menghasilkan solusi bermakna.' },
  { id: 'kolaborasi', name: 'Kolaborasi', desc: 'Bekerja sama secara inklusif, menghargai keberagaman, dan berkontribusi aktif mencapai tujuan bersama.' },
  { id: 'kemandirian', name: 'Kemandirian', desc: 'Bertanggung jawab atas proses dan hasil belajar, berinisiatif, dan pantang menyerah.' },
  { id: 'kesehatan', name: 'Kesehatan', desc: 'Menjaga kesehatan fisik dan mental, kebiasaan hidup bersih dan sehat, serta kebugaran tubuh.' },
  { id: 'komunikasi', name: 'Komunikasi', desc: 'Menyampaikan gagasan secara efektif dan santun, baik lisan maupun tulisan, serta interaksi positif.' }
];

export const DIMENSI_PANCASILA = [
  { id: 'keimanan_ketakwaan', name: 'Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa' },
  { id: 'kewargaan', name: 'Kewargaan' },
  { id: 'penalaran_kritis', name: 'Penalaran Kritis' },
  { id: 'kreativitas', name: 'Kreativitas' },
  { id: 'kolaborasi', name: 'Kolaborasi' },
  { id: 'kemandirian', name: 'Kemandirian' },
  { id: 'kesehatan', name: 'Kesehatan' },
  { id: 'komunikasi', name: 'Komunikasi' }
];

export const PAUD_FOUNDATION_ELEMENTS = [
  {
    element: 'Nilai Agama dan Budi Pekerti',
    desc: 'Mengenal Tuhan, mempraktikkan ibadah harian sesuai agamanya, menyayangi ciptaan-Nya, dan berakhlak mulia.'
  },
  {
    element: 'Jati Diri',
    desc: 'Mengenal dan mengelola emosi, percaya diri, kebiasaan hidup bersih dan sehat, motorik kasar dan halus.'
  },
  {
    element: 'Dasar-Dasar Literasi dan STEAM',
    desc: 'Mengenal simbol, bunyi huruf, konsep angka, bentuk, sains sederhana, eksplorasi lingkungan dan kreasi seni.'
  }
];

export const KOKURIKULER_THEMES = {
  dasmen: [
    { title: 'Gaya Hidup Berkelanjutan', desc: 'Memahami dampak aktivitas manusia terhadap lingkungan dan aksi nyata penanggulangan.' },
    { title: 'Kearifan Lokal', desc: 'Menelusuri dan melestarikan tradisi, budaya, dan kearifan masyarakat lokal.' },
    { title: 'Bhinneka Tunggal Ika', desc: 'Membangun dialog antarbudaya, toleransi, dan pencegahan kekerasan/intoleransi.' },
    { title: 'Bangunlah Jiwa dan Raganya', desc: 'Kesehatan mental, fisik, anti-bullying, dan manajemen emosi murid.' },
    { title: 'Suara Demokrasi', desc: 'Musyawarah, pemilihan OSIS/ketua kelas, hak berpendapat secara bertanggung jawab.' },
    { title: 'Rekayasa dan Teknologi', desc: 'Membuat karya teknologi sederhana/tepat guna untuk memecahkan masalah sekolah.' },
    { title: 'Kewirausahaan', desc: 'Mengembangkan inovasi produk berbasis potensi lokal dan etika wirausaha.' },
    { title: 'Kebekerjaan (Khusus SMK)', desc: 'Budaya kerja industri, etos kerja profesional, dan keselamatan kerja (K3).' }
  ],
  paud: [
    { title: 'Aku Sayang Bumi', desc: 'Eksplorasi tanaman, binatang, membuang sampah pada tempatnya, dan hemat air.' },
    { title: 'Aku Cinta Indonesia', desc: 'Mengenal bendera, pakaian adat, makanan tradisional, dan lagu kebangsaan.' },
    { title: 'Kita Semua Bersaudara', desc: 'Bermain bersama tanpa membeda-bedakan teman, tolong menolong dan berbagi.' },
    { title: 'Imajinasiku / Rekayasa dan Berteknologi', desc: 'Bermain balok, loose parts, dan membuat kreasi karya dari bahan bekas.' }
  ]
};

export const P5_THEMES = KOKURIKULER_THEMES;
