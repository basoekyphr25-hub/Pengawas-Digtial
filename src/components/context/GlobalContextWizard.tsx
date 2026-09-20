import React, { useState } from 'react';
import { 
  Compass, 
  Users, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Heart, 
  Info,
  Sliders,
  Plus,
  Trash2
} from 'lucide-react';
import { GlobalContext, EducationLevel, CurriculumType, SavedDocument } from '../../types';
import { ContextStudentProfile } from './ContextStudentProfile';

interface GlobalContextWizardProps {
  initialStage?: 1 | 2 | 3;
  context: GlobalContext;
  onUpdateContext: (updated: GlobalContext) => void;
  onProceedToNext?: () => void;
  onNavigate?: (item: any) => void;
  onSaveToCollection?: (doc: SavedDocument) => void;
}

export const GlobalContextWizard: React.FC<GlobalContextWizardProps> = ({
  initialStage = 1,
  context,
  onUpdateContext,
  onProceedToNext,
  onNavigate,
  onSaveToCollection
}) => {
  const [stage, setStage] = useState<1 | 2 | 3>(initialStage);
  const [formData, setFormData] = useState<GlobalContext>(context);
  const [savedBadge, setSavedBadge] = useState(false);

  const handleSave = () => {
    onUpdateContext({ ...formData, isCompleted: true });
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  const handleAutoSynthesizeClassProfile = () => {
    const { studentProfile } = formData;
    const dominantStyle = studentProfile.learningStyles.visual >= studentProfile.learningStyles.auditory && 
      studentProfile.learningStyles.visual >= studentProfile.learningStyles.kinesthetic 
      ? 'Visual' 
      : studentProfile.learningStyles.kinesthetic >= studentProfile.learningStyles.auditory 
      ? 'Kinestetik' 
      : 'Auditori';

    const synth = `Kelas ${studentProfile.targetClass || 'pilihan'} dengan ${studentProfile.totalStudents} murid berkesiapan ${studentProfile.learningReadiness}. Gaya belajar dominan ${dominantStyle} (${Math.max(studentProfile.learningStyles.visual, studentProfile.learningStyles.auditory, studentProfile.learningStyles.kinesthetic)}%). Membutuhkan strategi scaffolding bertahap, demonstrasi visual konkret, dan aktivitas berbasis pemecahan masalah kolaboratif untuk mengoptimalkan potensi seluruh murid.`;

    setFormData(prev => ({
      ...prev,
      studentProfile: {
        ...prev.studentProfile,
        classProfileSummary: synth
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Stage Tracker Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <button
            onClick={() => setStage(1)}
            className={`p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
              stage === 1 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              stage === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              <Compass className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">Tahap 1</span>
              <span className="text-xs sm:text-sm font-semibold truncate block">Identitas & Arah</span>
            </div>
          </button>

          <button
            onClick={() => setStage(2)}
            className={`p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
              stage === 2 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              stage === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              <Users className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">Tahap 2</span>
              <span className="text-xs sm:text-sm font-semibold truncate block">Profil Murid</span>
            </div>
          </button>

          <button
            onClick={() => setStage(3)}
            className={`p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
              stage === 3 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              stage === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">Tahap 3</span>
              <span className="text-xs sm:text-sm font-semibold truncate block">Konteks Sekolah</span>
            </div>
          </button>
        </div>
      </div>

      {/* STAGE 1: IDENTITAS & ARAH SEKOLAH */}
      {stage === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Konteks 1: Identitas Satuan Pendidikan & Arah Pedagogis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Visi dan misi sekolah menjadi kompas moral bagi AI saat merumuskan TP, ATP, modul ajar, dan diferensiasi.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">Konteks Wajib</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Guru / Pendidik</label>
              <input
                type="text"
                value={formData.identity.teacherName}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, teacherName: e.target.value }
                })}
                placeholder="Contoh: Basuki, S.Kom."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Pendidik (Opsional)</label>
              <input
                type="text"
                value={formData.identity.teacherNip}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, teacherNip: e.target.value }
                })}
                placeholder="19850712..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan (Sekolah / Madrasah)</label>
              <input
                type="text"
                value={formData.identity.schoolName}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, schoolName: e.target.value }
                })}
                placeholder="SMP Negeri 1..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={formData.identity.cityDistrict}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, cityDistrict: e.target.value }
                })}
                placeholder="Kabupaten Semarang"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenjang Pendidikan</label>
              <select
                value={formData.identity.level}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, level: e.target.value as EducationLevel }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm bg-white"
              >
                <option value="SD">SD (Sekolah Dasar)</option>
                <option value="MI">MI (Madrasah Ibtidaiyah)</option>
                <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                <option value="MTs">MTs (Madrasah Tsanawiyah)</option>
                <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                <option value="MA">MA (Madrasah Aliyah)</option>
                <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                <option value="MAK">MAK (Madrasah Aliyah Kejuruan)</option>
                <option value="PAUD">PAUD (Pendidikan Anak Usia Dini)</option>
                <option value="RA">RA (Raudhatul Athfal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kurikulum Digunakan</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    identity: { ...formData.identity, curriculum: 'merdeka' }
                  })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    formData.identity.curriculum === 'merdeka'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>Kurikulum Merdeka</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    identity: { ...formData.identity, curriculum: 'kbc' }
                  })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    formData.identity.curriculum === 'kbc'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>KBC (Madrasah)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={formData.identity.principalName}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, principalName: e.target.value }
                })}
                placeholder="Dra. Hj. Siti Aminah, M.Pd."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={formData.identity.principalNip}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, principalNip: e.target.value }
                })}
                placeholder="19720315..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Visi Sekolah</label>
              <textarea
                rows={2}
                value={formData.identity.vision}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, vision: e.target.value }
                })}
                placeholder="Tuliskan visi sekolah..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Misi Sekolah</label>
              <textarea
                rows={3}
                value={formData.identity.mission}
                onChange={(e) => setFormData({
                  ...formData,
                  identity: { ...formData.identity, mission: e.target.value }
                })}
                placeholder="Tuliskan butir-butir misi sekolah..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: PROFIL MURID & DIFERENSIASI */}
      {stage === 2 && (
        <ContextStudentProfile
          globalContext={formData}
          onUpdateContext={(updated) => {
            setFormData(updated);
            onUpdateContext(updated);
          }}
          onNavigate={(item) => {
            if (item === 'dashboard' && onNavigate) {
              onNavigate('dashboard');
            } else if (onNavigate) {
              onNavigate(item);
            }
          }}
          onSaveToCollection={onSaveToCollection}
        />
      )}

      {/* STAGE 3: SEKOLAH & KOMUNITAS LOKAL */}
      {stage === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Konteks 3: Tantangan Lokal, Potensi Lingkungan & Mitra</h3>
            <p className="text-xs text-slate-500 mt-0.5">Memastikan materi, contoh kasus, dan aktivitas pembelajaran relevan dengan kehidupan nyata di sekitar murid.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tantangan / Isu Lokal Terdekat (Pisahkan dengan koma)
              </label>
              <textarea
                rows={2}
                value={formData.community.localChallenges.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  community: {
                    ...formData.community,
                    localChallenges: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                })}
                placeholder="Pengelolaan sampah plastik di lingkungan sekolah, literasi digital kritis, konservasi air..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Potensi Lingkungan Sekitar (Pisahkan dengan koma)
              </label>
              <textarea
                rows={2}
                value={formData.community.environmentalPotential.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  community: {
                    ...formData.community,
                    environmentalPotential: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                })}
                placeholder="Kebun toga sekolah, sentra pertanian hidroponik lokal, pasar rakyat, situs budaya bersejarah..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sumber Daya & Fasilitas (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.community.localResources.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    community: {
                      ...formData.community,
                      localResources: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  placeholder="Perpustakaan Daerah, Puskesmas, Balai RW..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mitra & Tokoh Komunitas (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.community.partners.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    community: {
                      ...formData.community,
                      partners: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  placeholder="Asosiasi Bank Sampah, Seniman Lokal, Paguyuban Wali Murid..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control buttons bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          {stage > 1 && (
            <button
              onClick={() => setStage((stage - 1) as any)}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Kembali
            </button>
          )}
          {savedBadge && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tersimpan!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Simpan Konteks
          </button>

          {stage < 3 ? (
            <button
              onClick={() => {
                handleSave();
                setStage((stage + 1) as any);
              }}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Lanjut ke Tahap {stage + 1}
            </button>
          ) : (
            onProceedToNext && (
              <button
                onClick={() => {
                  handleSave();
                  onProceedToNext();
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Selesai & Mulai Modul Ajar
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
