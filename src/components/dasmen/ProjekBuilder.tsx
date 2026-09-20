import React, { useState } from 'react';
import { Compass, Sparkles, CheckCircle2, Bookmark, Download, Printer, Award } from 'lucide-react';
import { P5Project, GlobalContext, SavedDocument } from '../../types';
import { KOKURIKULER_THEMES, DELAPAN_PROFIL_LULUSAN } from '../../data/curriculumData';
import { generateP5Project } from '../../lib/gemini/prompts';
import { exportKokurikulerToDocx, downloadBlob } from '../../lib/export/docxExport';
import { printKokurikuler } from '../../lib/export/pdfExport';

interface ProjekBuilderProps {
  globalContext: GlobalContext;
  onSaveToCollection: (doc: SavedDocument) => void;
}

export const ProjekBuilder: React.FC<ProjekBuilderProps> = ({ globalContext, onSaveToCollection }) => {
  const availableThemes = KOKURIKULER_THEMES.dasmen;
  const [selectedThemeTitle, setSelectedThemeTitle] = useState(availableThemes[0].title);
  const [gradeOrAge, setGradeOrAge] = useState('Kelas 7 (Fase D)');
  const [focusTopic, setFocusTopic] = useState('Pemanfaatan Sampah Organik & Plastik di Sekolah');
  const [totalJp, setTotalJp] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  const [projectData, setProjectData] = useState<P5Project>({
    id: `KOKUR-${Date.now()}`,
    title: 'Garda Hijau: Solusi Inovatif Daur Ulang Sampah Organik & Plastik di Lingkungan Sekolah',
    targetLevel: 'dasmen',
    gradeOrAge: 'Kelas 7 (Fase D)',
    totalJp: 60,
    theme: availableThemes[0].title,
    focusTopic: 'Pemanfaatan Sampah Organik & Plastik di Sekolah',
    dimensions: [
      'Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa',
      'Kewargaan',
      'Kolaborasi',
      'Penalaran Kritis'
    ],
    subDimensions: [
      'Akhlak kepada alam & pemeliharaan ekosistem',
      'Tanggung jawab sosial menjaga kebersihan lingkungan',
      'Kerja sama tim dalam aksi nyata lingkungan',
      'Analisis logis dan pemecahan masalah sampah sekolah'
    ],
    targetEndPhase: 'Peserta didik mampu memahami keterhubungan ekosistem bumi, berkolaborasi secara inklusif dengan masyarakat sekolah, dan menghasilkan karya nyata yang mengurangi timbulan sampah berlandaskan Delapan Profil Lulusan.',
    annualTimeline: 'Sistem blok mingguan pada pertengahan semester (total 60 JP). Pameran Gelar Karya diadakan pada pekan jeda semester.',
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
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateP5Project({
        theme: selectedThemeTitle,
        focusTopic,
        totalJp,
        gradeOrAge,
        path: 'dasmen',
        globalContext
      });
      setProjectData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleDimension = (dimName: string) => {
    setProjectData(prev => {
      const exists = prev.dimensions.includes(dimName);
      return {
        ...prev,
        dimensions: exists 
          ? prev.dimensions.filter(d => d !== dimName)
          : [...prev.dimensions, dimName]
      };
    });
  };

  const handleSaveDoc = () => {
    const doc: SavedDocument = {
      id: projectData.id,
      title: `Kokurikuler (DPL): ${projectData.title}`,
      category: 'kokurikuler',
      subjectOrTheme: projectData.theme,
      gradeOrAge: projectData.gradeOrAge,
      createdAt: new Date().toISOString(),
      data: projectData
    };
    onSaveToCollection(doc);
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2500);
  };

  const handleExportDocx = async () => {
    try {
      const blob = await exportKokurikulerToDocx(projectData, globalContext);
      downloadBlob(blob, `Kokurikuler_DPL_${projectData.title.slice(0, 30)}.docx`);
    } catch (err) {
      console.error('Error exporting Kokurikuler to docx:', err);
    }
  };

  const handlePrint = () => {
    printKokurikuler(projectData, globalContext);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              Kokurikuler — Delapan Profil Lulusan (DPL)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Modul kegiatan kokurikuler terpadu lintas disiplin berbasis 4 alur tahapan (Pengenalan, Kontekstualisasi, Aksi, Refleksi) dengan sasaran Delapan Profil Lulusan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={handleExportDocx}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Unduh format Microsoft Word (.docx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Word</span>
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Menyusun Modul Kokurikuler...' : 'Rancang Kokurikuler (AI)'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tema Kokurikuler</label>
            <select
              value={selectedThemeTitle}
              onChange={(e) => setSelectedThemeTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {availableThemes.map((t, idx) => (
                <option key={idx} value={t.title}>{t.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fokus Topik Masalah</label>
            <input
              type="text"
              value={focusTopic}
              onChange={(e) => setFocusTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="Contoh: Pengelolaan Sampah Plastik di Sekolah"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sasaran Kelas & Alokasi JP</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={gradeOrAge}
                onChange={(e) => setGradeOrAge(e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Kelas 7"
              />
              <input
                type="number"
                value={totalJp}
                onChange={(e) => setTotalJp(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="60 JP"
              />
            </div>
          </div>
        </div>

        {/* Quick DPL Dimension Toggles */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Sasaran Delapan Profil Lulusan (DPL):
            </span>
            <span className="text-[11px] text-slate-400">Klik untuk menyalakan/mematikan dimensi</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DELAPAN_PROFIL_LULUSAN.map((dpl) => {
              const active = projectData.dimensions.some(d => 
                d.toLowerCase().includes(dpl.name.toLowerCase()) || 
                dpl.name.toLowerCase().includes(d.toLowerCase())
              );
              return (
                <button
                  key={dpl.id}
                  type="button"
                  onClick={() => handleToggleDimension(dpl.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {dpl.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Card Preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full uppercase tracking-wider">
            Tema Kokurikuler: {projectData.theme}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2">{projectData.title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Sasaran: {projectData.gradeOrAge} • Alokasi: {projectData.totalJp} JP • Jadwal: {projectData.annualTimeline}
          </p>
        </div>

        {/* Dimensi & Elemen */}
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 block uppercase tracking-wider text-[11px]">
              Dimensi Sasaran Delapan Profil Lulusan (DPL):
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">{projectData.dimensions.length} Dimensi Terpilih</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {projectData.dimensions.map((d, i) => (
              <span key={i} className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-950 font-semibold text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {d}
              </span>
            ))}
          </div>
          {projectData.subDimensions && projectData.subDimensions.length > 0 && (
            <div className="pt-2 border-t border-amber-200/60 text-slate-600 space-y-1">
              <span className="font-semibold text-amber-900 text-[11px] block">Elemen & Sub-Elemen Sasaran:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {projectData.subDimensions.map((sd, i) => (
                  <li key={i}>{sd}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 4 Alur Kokurikuler */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Alur Tahapan Pelaksanaan Kokurikuler (4 Tahap):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-xs block text-emerald-800">1. Tahap Pengenalan</span>
              <ul className="list-disc pl-4 text-slate-600 space-y-1">
                {projectData.flowPhases.pengenalan.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-xs block text-blue-800">2. Tahap Kontekstualisasi</span>
              <ul className="list-disc pl-4 text-slate-600 space-y-1">
                {projectData.flowPhases.kontekstualisasi.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-xs block text-amber-800">3. Tahap Aksi Nyata</span>
              <ul className="list-disc pl-4 text-slate-600 space-y-1">
                {projectData.flowPhases.aksi.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-xs block text-purple-800">4. Tahap Refleksi & Tindak Lanjut</span>
              <ul className="list-disc pl-4 text-slate-600 space-y-1">
                {projectData.flowPhases.refleksi.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Rubrik Penilaian */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Rubrik Asesmen Capaian Kokurikuler (DPL):
          </h4>
          <div className="space-y-2">
            {projectData.assessmentRubric.map((r, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-900 block">{r.dimension} — {r.subElement}</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="text-rose-700 block">Mulai Berkembang (MB)</strong>
                    <p className="text-slate-600 mt-0.5">{r.stages.mulaiBerkembang}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="text-amber-700 block">Sedang Berkembang (SB)</strong>
                    <p className="text-slate-600 mt-0.5">{r.stages.sedangBerkembang}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="text-sky-700 block">Sesuai Harapan (BSH)</strong>
                    <p className="text-slate-600 mt-0.5">{r.stages.berkembangSesuaiHarapan}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="text-emerald-700 block">Sangat Berkembang (SAB)</strong>
                    <p className="text-slate-600 mt-0.5">{r.stages.sangatBerkembang}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          {savedBadge && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Modul Kokurikuler (DPL) tersimpan di Koleksi!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDocx}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Unduh DOCX
          </button>
          <button
            onClick={handleSaveDoc}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" /> Simpan ke Koleksi Dokumen
          </button>
        </div>
      </div>
    </div>
  );
};
