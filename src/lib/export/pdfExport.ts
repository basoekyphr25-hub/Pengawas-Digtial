import { ModulAjar, GlobalContext, LKPDData, PaudModulAjar, P5Project } from '../../types';

export function printModulAjar(modul: ModulAjar, globalContext?: GlobalContext): void {
  const teacher = globalContext?.identity.teacherName || 'Guru Mata Pelajaran';
  const teacherNip = globalContext?.identity.teacherNip || '............................';
  const principal = globalContext?.identity.principalName || 'Kepala Sekolah';
  const principalNip = globalContext?.identity.principalNip || '............................';
  const school = globalContext?.identity.schoolName || 'Satuan Pendidikan';
  const city = globalContext?.identity.cityDistrict || 'Kota/Kabupaten';
  const curriculum = globalContext?.identity.curriculum === 'kbc' ? 'Kurikulum Berbasis Cinta (KBC)' : 'Kurikulum Merdeka';

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Modul Ajar - ${modul.subject} ${modul.grade}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #111; }
        h1, h2, h3 { text-align: center; margin: 4px 0; }
        h1 { font-size: 14pt; font-weight: bold; }
        h2 { font-size: 13pt; font-weight: bold; }
        h3 { font-size: 12pt; font-weight: bold; text-decoration: underline; }
        .section-title { font-weight: bold; margin-top: 16px; margin-bottom: 6px; font-size: 12pt; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; font-size: 11pt; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .meta-table td { border: none; padding: 3px 0; }
        .meta-table { margin-bottom: 12px; }
        .signature { margin-top: 40px; width: 100%; }
        .signature td { border: none; text-align: center; width: 50%; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>MODUL AJAR ${curriculum.toUpperCase()}</h1>
      <h2>${modul.subject.toUpperCase()} - FASE ${modul.phase} (${modul.grade.toUpperCase()})</h2>
      <h2>${school.toUpperCase()}</h2>
      <hr style="border: 1px double #000; margin: 12px 0 20px 0;" />

      <div class="section-title">I. INFORMASI UMUM</div>
      <table class="meta-table">
        <tr><td style="width: 25%;">Nama Penyusun</td><td>: ${teacher}</td></tr>
        <tr><td>Satuan Pendidikan</td><td>: ${school}</td></tr>
        <tr><td>Tahun Ajaran</td><td>: 2025/2026</td></tr>
        <tr><td>Mata Pelajaran</td><td>: ${modul.subject}</td></tr>
        <tr><td>Fase / Kelas / Semester</td><td>: ${modul.phase} / ${modul.grade} / ${modul.semester}</td></tr>
        <tr><td>Alokasi Waktu</td><td>: ${modul.totalJp} JP (${modul.totalSessions} Pertemuan)</td></tr>
        <tr><td>Model Pembelajaran</td><td>: ${modul.learningModel}</td></tr>
        <tr><td>Visi Sekolah</td><td>: "${globalContext?.identity.vision || 'Mewujudkan peserta didik unggul dan berakhlak mulia'}"</td></tr>
      </table>

      <div class="section-title">II. KOMPONEN INTI</div>
      <p><strong>A. Tujuan Pembelajaran (TP):</strong></p>
      <ol>
        ${(modul.selectedTpTexts || []).map(tp => `<li>${tp}</li>`).join('')}
      </ol>

      <p><strong>B. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</strong></p>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Indikator Ketercapaian</th>
            <th>Perlu Bimbingan</th>
            <th>Cukup</th>
            <th>Baik</th>
            <th>Sangat Baik</th>
          </tr>
        </thead>
        <tbody>
          ${(modul.kktp || []).map((k, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td><strong>${k.indicator}</strong><br/><small>Syarat Tuntas: ${k.passingThreshold}</small></td>
              <td>${k.rubric.perluBimbingan}</td>
              <td>${k.rubric.cukup}</td>
              <td>${k.rubric.baik}</td>
              <td>${k.rubric.sangatBaik}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <p><strong>C. Asesmen Awal Kognitif (3 Tingkat):</strong></p>
      <ul>
        <li><strong>Level -2:</strong> ${modul.initialCognitiveAssessment?.levelMinus2?.question || '-'}<br/><em>Tindak lanjut: ${modul.initialCognitiveAssessment?.levelMinus2?.followUp || '-'}</em></li>
        <li><strong>Level -1:</strong> ${modul.initialCognitiveAssessment?.levelMinus1?.question || '-'}<br/><em>Tindak lanjut: ${modul.initialCognitiveAssessment?.levelMinus1?.followUp || '-'}</em></li>
        <li><strong>Level Saat Ini:</strong> ${modul.initialCognitiveAssessment?.levelCurrent?.question || '-'}<br/><em>Tindak lanjut: ${modul.initialCognitiveAssessment?.levelCurrent?.followUp || '-'}</em></li>
      </ul>

      <div class="section-title">III. LANGKAH-LANGKAH PEMBELAJARAN BERDIFERENSIASI</div>
      ${(modul.learningActivities || []).map(act => `
        <div style="margin-bottom: 16px;">
          <p><strong>Pertemuan Ke-${act.sessionNumber}: ${act.title} (${act.durationMinutes} Menit)</strong></p>
          <p><em>1. Kegiatan Pendahuluan:</em></p>
          <ul>${act.preliminary.map(p => `<li>${p}</li>`).join('')}</ul>
          <p><em>2. Kegiatan Inti:</em></p>
          <ul>
            <li>${act.coreActivities.differentiatedContent || 'Diferensiasi Konten'}</li>
            <li>${act.coreActivities.differentiatedProcess || 'Diferensiasi Proses'}</li>
            <li>${act.coreActivities.differentiatedProduct || 'Diferensiasi Produk'}</li>
          </ul>
          <p>Alur Pelaksanaan:</p>
          <ol>${act.coreActivities.mainFlow.map(f => `<li>${f}</li>`).join('')}</ol>
          <p><em>3. Kegiatan Penutup:</em></p>
          <ul>${act.closing.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      `).join('')}

      <div class="section-title">IV. ASESMEN PEMBELAJARAN</div>
      <p><strong>1. Asesmen Formatif (Assessment for Learning):</strong> ${modul.formativeAssessment?.title || 'Observasi dan Cek Pemahaman'}</p>
      <p><strong>2. Asesmen Diri & Teman (Assessment as Learning):</strong> ${modul.selfPeerAssessment?.title || 'Jurnal Reflektif Diri'}</p>
      <p><strong>3. Asesmen Sumatif (Assessment of Learning):</strong> ${modul.summativeAssessment?.title || 'Uji Kompetensi Akhir Lingkup Materi'}</p>

      <table class="signature">
        <tr>
          <td>
            Mengetahui,<br/>
            Kepala ${school}<br/><br/><br/><br/>
            <strong>${principal}</strong><br/>
            NIP. ${principalNip}
          </td>
          <td>
            ${city}, ...................... 2025<br/>
            Guru Mata Pelajaran,<br/><br/><br/><br/>
            <strong>${teacher}</strong><br/>
            NIP. ${teacherNip}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

export function printLkpd(lkpd: LKPDData, globalContext?: GlobalContext): void {
  const school = globalContext?.identity.schoolName || 'Satuan Pendidikan';

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>LKPD - ${lkpd.subject}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; color: #111; }
        h1, h2 { text-align: center; margin: 3px 0; }
        h1 { font-size: 15pt; font-weight: bold; }
        h2 { font-size: 13pt; }
        .meta-box { border: 1px solid #444; padding: 10px; margin: 15px 0; border-radius: 4px; }
        .meta-table td { padding: 4px 6px; }
        .section-title { font-weight: bold; margin-top: 14px; margin-bottom: 4px; }
        .box-answer { border: 1px dashed #777; min-height: 80px; margin: 8px 0 16px 0; padding: 6px; background-color: #fafafa; }
      </style>
    </head>
    <body>
      <h1>${lkpd.title.toUpperCase()}</h1>
      <h2>${lkpd.subject} - FASE ${lkpd.phase} (${lkpd.grade})</h2>
      <h2>${school}</h2>

      <div class="meta-box">
        <table class="meta-table" style="width: 100%;">
          <tr><td style="width: 20%;">Nama Kelompok / Siswa</td><td>: ............................................................................</td></tr>
          <tr><td>Anggota</td><td>: ............................................................................</td></tr>
          <tr><td>Kelas / Semester</td><td>: ${lkpd.grade} / ............</td></tr>
          <tr><td>Hari, Tanggal</td><td>: ............................................................................</td></tr>
        </table>
      </div>

      <div class="section-title">A. TUJUAN PEMBELAJARAN</div>
      <ol>${(lkpd.learningObjectives || []).map(o => `<li>${o}</li>`).join('')}</ol>

      <div class="section-title">B. PETUNJUK PENGERJAAN</div>
      <ol>${(lkpd.instructions || []).map(i => `<li>${i}</li>`).join('')}</ol>

      <div class="section-title">C. RINGKASAN MATERI</div>
      <div style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #333; margin: 8px 0;">
        ${lkpd.briefMaterial}
      </div>

      <div class="section-title">D. AKTIVITAS SISWA</div>
      ${(lkpd.activities || []).map(a => `
        <div style="margin-bottom: 10px;">
          <strong>${a.activityName}</strong>
          <p style="margin: 3px 0 8px 0;">${a.instruction}</p>
        </div>
      `).join('')}

      <div class="section-title">E. PERTANYAAN & RUANG JAWABAN</div>
      ${(lkpd.questions || []).map((q, idx) => `
        <p><strong>${idx + 1}. ${q.questionText}</strong></p>
        <div class="box-answer"><small style="color: #888;">Ruang jawaban siswa:</small></div>
      `).join('')}

      <div class="section-title">F. REFLEKSI & KESIMPULAN</div>
      <p><em>Pertanyaan Refleksi:</em></p>
      <ul>${(lkpd.reflectionQuestions || []).map(r => `<li>${r}</li>`).join('')}</ul>
      <p><em>Kesimpulan Akhir Kelompok:</em></p>
      <div class="box-answer" style="min-height: 100px;"><small style="color: #888;">Tuliskan kesimpulan di sini...</small></div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

export function printKokurikuler(project: P5Project, globalContext?: GlobalContext) {
  const teacher = globalContext?.identity.teacherName || 'Fasilitator Kokurikuler';
  const teacherNip = globalContext?.identity.teacherNip || '............................';
  const principal = globalContext?.identity.principalName || 'Kepala Sekolah';
  const principalNip = globalContext?.identity.principalNip || '............................';
  const school = globalContext?.identity.schoolName || 'Satuan Pendidikan';
  const city = globalContext?.identity.cityDistrict || 'Kota/Kabupaten';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${project.title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; padding: 25mm 20mm; margin: 0; }
        .kop-surat { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
        .kop-surat h1 { font-size: 14pt; margin: 0; text-transform: uppercase; font-weight: bold; }
        .kop-surat h2 { font-size: 12pt; margin: 2px 0 0 0; font-weight: normal; }
        .section-title { font-weight: bold; margin-top: 16px; margin-bottom: 6px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px; font-size: 11pt; }
        table.meta { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.meta td { padding: 4px 6px; font-size: 11pt; vertical-align: top; }
        table.rubric { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt; }
        table.rubric th, table.rubric td { border: 1px solid #333; padding: 6px; vertical-align: top; }
        table.rubric th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
        ul, ol { margin: 4px 0 10px 24px; padding: 0; }
        li { margin-bottom: 4px; }
        .ttd-box { margin-top: 30px; width: 100%; page-break-inside: avoid; }
        .ttd-box table { width: 100%; }
        .ttd-box td { text-align: center; width: 50%; vertical-align: top; }
      </style>
    </head>
    <body>
      <div class="kop-surat">
        <h1>MODUL KEGIATAN KOKURIKULER</h1>
        <h2>PENGUATAN DELAPAN PROFIL LULUSAN (DPL)</h2>
        <h2 style="font-weight: bold;">${school.toUpperCase()}</h2>
      </div>

      <table class="meta">
        <tr><td style="width: 25%;"><strong>Judul Kegiatan</strong></td><td>: ${project.title}</td></tr>
        <tr><td><strong>Tema Kokurikuler</strong></td><td>: ${project.theme}</td></tr>
        <tr><td><strong>Fokus Topik Masalah</strong></td><td>: ${project.focusTopic}</td></tr>
        <tr><td><strong>Sasaran / Kelas</strong></td><td>: ${project.gradeOrAge}</td></tr>
        <tr><td><strong>Alokasi Waktu</strong></td><td>: ${project.totalJp} JP</td></tr>
        <tr><td><strong>Jadwal Pelaksanaan</strong></td><td>: ${project.annualTimeline}</td></tr>
      </table>

      <div class="section-title">A. Dimensi Sasaran Delapan Profil Lulusan (DPL)</div>
      <ul>
        ${(project.dimensions || []).map(d => `<li><strong>${d}</strong></li>`).join('')}
      </ul>
      <p><strong>Sub-Elemen:</strong> ${(project.subDimensions || []).join(', ')}</p>
      <p><strong>Target Capaian Akhir:</strong> ${project.targetEndPhase}</p>

      <div class="section-title">B. Alur 4 Tahapan Pelaksanaan Kokurikuler</div>
      <p><strong>1. Tahap Pengenalan</strong></p>
      <ol>${(project.flowPhases?.pengenalan || []).map(a => `<li>${a}</li>`).join('')}</ol>
      <p><strong>2. Tahap Kontekstualisasi</strong></p>
      <ol>${(project.flowPhases?.kontekstualisasi || []).map(a => `<li>${a}</li>`).join('')}</ol>
      <p><strong>3. Tahap Aksi Nyata</strong></p>
      <ol>${(project.flowPhases?.aksi || []).map(a => `<li>${a}</li>`).join('')}</ol>
      <p><strong>4. Tahap Refleksi & Tindak Lanjut</strong></p>
      <ol>${(project.flowPhases?.refleksi || []).map(a => `<li>${a}</li>`).join('')}</ol>

      <div class="section-title">C. Rubrik Asesmen Capaian Kokurikuler (DPL)</div>
      <table class="rubric">
        <thead>
          <tr>
            <th style="width: 20%;">Dimensi & Sub-elemen</th>
            <th style="width: 20%;">Mulai Berkembang (MB)</th>
            <th style="width: 20%;">Sedang Berkembang (SB)</th>
            <th style="width: 20%;">Berkembang Sesuai Harapan (BSH)</th>
            <th style="width: 20%;">Sangat Berkembang (SAB)</th>
          </tr>
        </thead>
        <tbody>
          ${(project.assessmentRubric || []).map(r => `
            <tr>
              <td><strong>${r.dimension}</strong><br/><small>${r.subElement}</small></td>
              <td>${r.stages.mulaiBerkembang}</td>
              <td>${r.stages.sedangBerkembang}</td>
              <td>${r.stages.berkembangSesuaiHarapan}</td>
              <td>${r.stages.sangatBerkembang}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="ttd-box">
        <p style="text-align: right; margin-bottom: 20px;">${city}, .................... 2025</p>
        <table>
          <tr>
            <td>Mengetahui,<br/>Kepala Sekolah<br/><br/><br/><br/><strong>${principal}</strong><br/>NIP. ${principalNip}</td>
            <td>Koordinator Fasilitator Kokurikuler<br/><br/><br/><br/><br/><strong>${teacher}</strong><br/>NIP. ${teacherNip}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

export const printP5Project = printKokurikuler;
