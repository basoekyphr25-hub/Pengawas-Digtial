import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  HeadingLevel, 
  AlignmentType, 
  WidthType, 
  BorderStyle 
} from 'docx';
import { ModulAjar, GlobalContext, LKPDData, PaudModulAjar, P5Project } from '../../types';

export async function exportModulAjarToDocx(modul: ModulAjar, globalContext?: GlobalContext): Promise<Blob> {
  const teacher = globalContext?.identity.teacherName || 'Guru Mata Pelajaran';
  const teacherNip = globalContext?.identity.teacherNip || '............................';
  const principal = globalContext?.identity.principalName || 'Kepala Sekolah';
  const principalNip = globalContext?.identity.principalNip || '............................';
  const school = globalContext?.identity.schoolName || 'Satuan Pendidikan';
  const city = globalContext?.identity.cityDistrict || 'Kota/Kabupaten';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `MODUL AJAR KURIKULUM ${globalContext?.identity.curriculum === 'kbc' ? 'BERBASIS CINTA (KBC)' : 'MERDEKA'}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${modul.subject.toUpperCase()} - FASE ${modul.phase} (${modul.grade})`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: school.toUpperCase(),
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // I. INFORMASI UMUM
          new Paragraph({
            text: 'I. INFORMASI UMUM',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'A. Identitas Sekolah\n', bold: true }),
              new TextRun(`   Nama Penyusun     : ${teacher}\n`),
              new TextRun(`   Satuan Pendidikan : ${school}\n`),
              new TextRun(`   Tahun Ajaran      : 2025/2026\n`),
              new TextRun(`   Mata Pelajaran    : ${modul.subject}\n`),
              new TextRun(`   Fase / Kelas      : ${modul.phase} / ${modul.grade}\n`),
              new TextRun(`   Alokasi Waktu     : ${modul.totalJp} JP (${modul.totalSessions} Pertemuan)\n`),
              new TextRun(`   Model Pembelajaran: ${modul.learningModel}\n`),
            ],
            spacing: { after: 200 },
          }),

          // B. Konteks Visi, Misi & Profil Kelas
          new Paragraph({
            children: [
              new TextRun({ text: 'B. Konteks Sekolah & Karakteristik Murid\n', bold: true }),
              new TextRun(`   Visi Sekolah: "${globalContext?.identity.vision || 'Mewujudkan peserta didik unggul dan berkarakter.'}"\n`),
              new TextRun(`   Kesiapan Belajar: ${globalContext?.studentProfile.learningReadiness || 'Heterogen'}\n`),
              new TextRun(`   Profil Gaya Belajar: Visual ${globalContext?.studentProfile.learningStyles.visual || 40}%, Auditori ${globalContext?.studentProfile.learningStyles.auditory || 30}%, Kinestetik ${globalContext?.studentProfile.learningStyles.kinesthetic || 30}%\n`),
            ],
            spacing: { after: 200 },
          }),

          // II. KOMPONEN INTI
          new Paragraph({
            text: 'II. KOMPONEN INTI',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'A. Tujuan Pembelajaran (TP):\n', bold: true }),
              ...modul.selectedTpTexts.map((tp, i) => new TextRun(`   ${i + 1}. ${tp}\n`)),
            ],
            spacing: { after: 150 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'B. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):\n', bold: true }),
              ...(modul.kktp || []).map((k, i) => 
                new TextRun(`   ${i + 1}. Indikator: ${k.indicator}\n      Kriteria Ketuntasan: ${k.passingThreshold}\n`)
              ),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'C. Asesmen Awal Kognitif (3 Level Diagnostik):\n', bold: true }),
              new TextRun(`   • Level -2 (Prasyarat Rendah): ${modul.initialCognitiveAssessment?.levelMinus2?.question || '-'}\n`),
              new TextRun(`     Tindak Lanjut: ${modul.initialCognitiveAssessment?.levelMinus2?.followUp || '-'}\n`),
              new TextRun(`   • Level -1 (Prasyarat Menengah): ${modul.initialCognitiveAssessment?.levelMinus1?.question || '-'}\n`),
              new TextRun(`     Tindak Lanjut: ${modul.initialCognitiveAssessment?.levelMinus1?.followUp || '-'}\n`),
              new TextRun(`   • Level Saat Ini: ${modul.initialCognitiveAssessment?.levelCurrent?.question || '-'}\n`),
            ],
            spacing: { after: 200 },
          }),

          // III. KEGIATAN PEMBELAJARAN
          new Paragraph({
            text: 'III. KEGIATAN PEMBELAJARAN BERDIFERENSIASI',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          ...(modul.learningActivities || []).map((act, idx) => (
            new Paragraph({
              children: [
                new TextRun({ text: `Pertemuan Ke-${act.sessionNumber}: ${act.title} (${act.durationMinutes} Menit)\n`, bold: true }),
                new TextRun('1. Kegiatan Awal (Pendahuluan):\n'),
                ...act.preliminary.map(p => new TextRun(`   - ${p}\n`)),
                new TextRun('\n2. Kegiatan Inti (Berdiferensiasi):\n'),
                new TextRun(`   • ${act.coreActivities.differentiatedContent || 'Diferensiasi Konten disesuaikan.'}\n`),
                new TextRun(`   • ${act.coreActivities.differentiatedProcess || 'Diferensiasi Proses disesuaikan.'}\n`),
                new TextRun(`   • ${act.coreActivities.differentiatedProduct || 'Diferensiasi Produk disesuaikan.'}\n`),
                new TextRun('   Alur Kerja Utama:\n'),
                ...act.coreActivities.mainFlow.map(f => new TextRun(`   - ${f}\n`)),
                new TextRun('\n3. Kegiatan Penutup (Refleksi & Doa):\n'),
                ...act.closing.map(c => new TextRun(`   - ${c}\n`)),
                new TextRun('\n'),
              ],
              spacing: { after: 200 },
            })
          )),

          // IV. ASESMEN & REFLEKSI
          new Paragraph({
            text: 'IV. INSTRUMEN ASESMEN & REFLEKSI',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Asesmen Formatif: ', bold: true }),
              new TextRun(`${modul.formativeAssessment?.title || 'Observasi dan kuis cepat.'}\n`),
              new TextRun({ text: '2. Asesmen Diri/Antarteman: ', bold: true }),
              new TextRun(`${modul.selfPeerAssessment?.title || 'Jurnal refleksi mandiri.'}\n`),
              new TextRun({ text: '3. Asesmen Sumatif: ', bold: true }),
              new TextRun(`${modul.summativeAssessment?.title || 'Tes unjuk kerja / tertulis akhir lingkup materi.'}\n`),
            ],
            spacing: { after: 300 },
          }),

          // Tanda Tangan
          new Paragraph({
            children: [
              new TextRun(`Mengetahui,\nKepala ${school}\n\n\n\n\n`),
              new TextRun({ text: `${principal}\n`, bold: true }),
              new TextRun(`NIP. ${principalNip}\n\n`),
              new TextRun(`${city}, ......................... 2025\nGuru Mata Pelajaran,\n\n\n\n\n`),
              new TextRun({ text: `${teacher}\n`, bold: true }),
              new TextRun(`NIP. ${teacherNip}`),
            ],
            spacing: { before: 400 },
          })
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export async function exportLkpdToDocx(lkpd: LKPDData, globalContext?: GlobalContext): Promise<Blob> {
  const school = globalContext?.identity.schoolName || 'Satuan Pendidikan';

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: lkpd.title.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${lkpd.subject} - Kelas/Fase: ${lkpd.grade} (${lkpd.phase})`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Nama Kelompok / Siswa : ........................................................\n' }),
              new TextRun({ text: 'Kelas / No. Absen      : ........................................................\n' }),
              new TextRun({ text: 'Hari, Tanggal          : ........................................................\n' }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'A. TUJUAN PEMBELAJARAN',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            children: (lkpd.learningObjectives || []).map((obj, i) => new TextRun(`${i + 1}. ${obj}\n`)),
            spacing: { after: 150 },
          }),

          new Paragraph({
            text: 'B. PETUNJUK PENGERJAAN',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            children: (lkpd.instructions || []).map((ins, i) => new TextRun(`${i + 1}. ${ins}\n`)),
            spacing: { after: 150 },
          }),

          new Paragraph({
            text: 'C. RINGKASAN MATERI',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: lkpd.briefMaterial,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'D. AKTIVITAS SISWA',
            heading: HeadingLevel.HEADING_3,
          }),
          ...(lkpd.activities || []).map(act => (
            new Paragraph({
              children: [
                new TextRun({ text: `${act.activityName}\n`, bold: true }),
                new TextRun(`${act.instruction}\n\n`),
              ],
            })
          )),

          new Paragraph({
            text: 'E. PERTANYAAN & RUANG JAWABAN',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150 },
          }),
          ...(lkpd.questions || []).map((q, idx) => (
            new Paragraph({
              children: [
                new TextRun({ text: `${idx + 1}. ${q.questionText}\n`, bold: true }),
                new TextRun('   Ruang Jawaban:\n\n\n\n\n\n'),
              ],
              spacing: { after: 100 },
            })
          )),

          new Paragraph({
            text: 'F. REFLEKSI & KESIMPULAN',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Pertanyaan Refleksi Diri:\n', bold: true }),
              ...(lkpd.reflectionQuestions || []).map(r => new TextRun(`- ${r}\n`)),
              new TextRun('\nKesimpulan Akhir:\n'),
              new TextRun(`${lkpd.conclusionPrompt}\n\n\n\n\n`),
            ],
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}

export async function exportKokurikulerToDocx(project: P5Project, globalContext?: GlobalContext): Promise<Blob> {
  const teacher = globalContext?.identity.teacherName || 'Fasilitator Kokurikuler';
  const teacherNip = globalContext?.identity.teacherNip || '............................';
  const principal = globalContext?.identity.principalName || 'Kepala Sekolah';
  const principalNip = globalContext?.identity.principalNip || '............................';
  const school = globalContext?.identity.schoolName || 'Satuan Pendidikan';
  const city = globalContext?.identity.cityDistrict || 'Kota/Kabupaten';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'MODUL KEGIATAN KOKURIKULER',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: 'PENGUATAN DELAPAN PROFIL LULUSAN (DPL)',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: school.toUpperCase(),
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'A. INFORMASI UMUM & IDENTITAS PROJEK',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Judul Kegiatan     : `, bold: true }),
              new TextRun(`${project.title}\n`),
              new TextRun({ text: `Tema Kokurikuler   : `, bold: true }),
              new TextRun(`${project.theme}\n`),
              new TextRun({ text: `Fokus Topik Masalah: `, bold: true }),
              new TextRun(`${project.focusTopic}\n`),
              new TextRun({ text: `Sasaran / Kelas    : `, bold: true }),
              new TextRun(`${project.gradeOrAge}\n`),
              new TextRun({ text: `Alokasi Waktu      : `, bold: true }),
              new TextRun(`${project.totalJp} Jam Pelajaran (JP)\n`),
              new TextRun({ text: `Jadwal Pelaksanaan : `, bold: true }),
              new TextRun(`${project.annualTimeline}\n`),
            ],
            spacing: { after: 150 },
          }),

          ...(project.annualPlanRows && project.annualPlanRows.length > 0 ? [
            new Paragraph({
              text: 'B. RENCANA KOKURIKULER SETAHUN',
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 150, after: 100 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'NO', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 6, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SMT', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TEMA / PROJEK', bold: true })] })], width: { size: 36, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'DIMENSI DPL', bold: true })] })], width: { size: 24, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'BENTUK', bold: true })] })], width: { size: 16, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'JP', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 6, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'JAM', bold: true })], alignment: AlignmentType.CENTER })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                  ]
                }),
                ...project.annualPlanRows.map(row => (
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: `${row.id}`, alignment: AlignmentType.CENTER })] }),
                      new TableCell({ children: [new Paragraph({ text: `${row.smt}`, alignment: AlignmentType.CENTER })] }),
                      new TableCell({ children: [new Paragraph(row.temaProjek)] }),
                      new TableCell({ children: [new Paragraph((row.dimensi || []).join(', '))] }),
                      new TableCell({ children: [new Paragraph(row.bentuk)] }),
                      new TableCell({ children: [new Paragraph({ text: `${row.jp}`, alignment: AlignmentType.CENTER })] }),
                      new TableCell({ children: [new Paragraph({ text: row.jam, alignment: AlignmentType.CENTER })] }),
                    ]
                  })
                ))
              ]
            }),
            new Paragraph({ text: '', spacing: { after: 150 } })
          ] : []),

          new Paragraph({
            text: project.annualPlanRows && project.annualPlanRows.length > 0 ? 'C. DIMENSI SASARAN DELAPAN PROFIL LULUSAN (DPL)' : 'B. DIMENSI SASARAN DELAPAN PROFIL LULUSAN (DPL)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Dimensi DPL yang Disasar:\n`, bold: true }),
              ...(project.dimensions || []).map(d => new TextRun(`• ${d}\n`)),
              new TextRun({ text: `\nElemen / Sub-Elemen:\n`, bold: true }),
              ...(project.subDimensions || []).map(sd => new TextRun(`• ${sd}\n`)),
              new TextRun({ text: `\nTarget Capaian Akhir:\n`, bold: true }),
              new TextRun(`${project.targetEndPhase}\n`),
            ],
            spacing: { after: 150 },
          }),

          new Paragraph({
            text: 'C. ALUR TAHAPAN PELAKSANAAN KOKURIKULER (4 TAHAP)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Tahap Pengenalan:\n', bold: true }),
              ...(project.flowPhases?.pengenalan || []).map(a => new TextRun(`   - ${a}\n`)),
              new TextRun({ text: '\n2. Tahap Kontekstualisasi:\n', bold: true }),
              ...(project.flowPhases?.kontekstualisasi || []).map(a => new TextRun(`   - ${a}\n`)),
              new TextRun({ text: '\n3. Tahap Aksi Nyata:\n', bold: true }),
              ...(project.flowPhases?.aksi || []).map(a => new TextRun(`   - ${a}\n`)),
              new TextRun({ text: '\n4. Tahap Refleksi & Tindak Lanjut:\n', bold: true }),
              ...(project.flowPhases?.refleksi || []).map(a => new TextRun(`   - ${a}\n`)),
            ],
            spacing: { after: 150 },
          }),

          new Paragraph({
            text: 'D. RUBRIK ASESMEN CAPAIAN KOKURIKULER (DPL)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          ...(project.assessmentRubric || []).map((r) => (
            new Paragraph({
              children: [
                new TextRun({ text: `Dimensi: ${r.dimension} - ${r.subElement}\n`, bold: true }),
                new TextRun(`- Mulai Berkembang (MB)        : ${r.stages.mulaiBerkembang}\n`),
                new TextRun(`- Sedang Berkembang (SB)       : ${r.stages.sedangBerkembang}\n`),
                new TextRun(`- Berkembang Sesuai Harapan(BSH): ${r.stages.berkembangSesuaiHarapan}\n`),
                new TextRun(`- Sangat Berkembang (SAB)      : ${r.stages.sangatBerkembang}\n\n`),
              ],
              spacing: { after: 100 },
            })
          )),

          new Paragraph({
            text: `${city}, .................... 2025\n`,
            alignment: AlignmentType.RIGHT,
            spacing: { before: 200, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun('Mengetahui,\n'),
              new TextRun('Kepala Sekolah                                     Koordinator Fasilitator Kokurikuler\n\n\n\n\n'),
              new TextRun({ text: `${principal}                                      ${teacher}\n`, bold: true }),
              new TextRun(`NIP. ${principalNip}                               NIP. ${teacherNip}`),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export async function exportAtpToDocx(params: {
  subject: string;
  phase: string;
  method: string;
  atpList: any[];
  globalContext?: GlobalContext;
}): Promise<Blob> {
  const teacher = params.globalContext?.identity.teacherName || 'Guru Mata Pelajaran';
  const principal = params.globalContext?.identity.principalName || 'Kepala Sekolah';
  const school = params.globalContext?.identity.schoolName || 'Satuan Pendidikan';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'ALUR TUJUAN PEMBELAJARAN (ATP)',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${params.subject.toUpperCase()} - FASE ${params.phase}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${school.toUpperCase()} | Metode: ${params.method}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'NO', alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: 'KELAS', alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: 'SMT', alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ELEMEN', alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: 'TUJUAN PEMBELAJARAN' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DIMENSI PROFIL LULUSAN' })] }),
                ],
              }),
              ...params.atpList.map((item, idx) => (
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: String(idx + 1), alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: item.gradeLevel || '1', alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: item.semesterNumber || (idx < 4 ? '1' : '2'), alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: item.element || item.material || 'Elemen' })] }),
                    new TableCell({ children: [new Paragraph({ text: item.tpText })] }),
                    new TableCell({ children: [new Paragraph({ text: (item.targetedDimensions || [item.profileDimension]).filter(Boolean).join(', ') })] }),
                  ],
                })
              )),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export const exportP5ProjectToDocx = exportKokurikulerToDocx;

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
