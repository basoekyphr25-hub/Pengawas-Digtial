import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { TargetPembelajaran, AtpItem, GlobalContext, Phase } from '../../types';
import { NavItem } from '../layout/Sidebar';

interface PilihTpViewProps {
  globalContext: GlobalContext;
  atpList: AtpItem[];
  tps: TargetPembelajaran[];
  onSelectTpForModul: (tp: AtpItem) => void;
  onNavigate?: (item: NavItem) => void;
}

const DEFAULT_TP_ITEMS: AtpItem[] = [
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
    pedagogicalNote: 'Eksplorasi benda konkrit'
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
    pedagogicalNote: 'Pengenalan simbol matematika'
  },
  {
    tpId: 'TP-03',
    stepNumber: 3,
    gradeLevel: '1',
    semesterNumber: '2',
    element: 'Penjumlahan',
    tpText: 'Melakukan penjumlahan bilangan cacah sampai dengan 20 menggunakan berbagai representasi visual dan simbol matematika secara mandiri.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 2',
    profileDimension: 'Kreativitas',
    pedagogicalNote: 'Kemandirian berhitung'
  },
  {
    tpId: 'TP-04',
    stepNumber: 4,
    gradeLevel: '1',
    semesterNumber: '2',
    element: 'Penjumlahan',
    tpText: 'Menyelesaikan masalah kontekstual penjumlahan bilangan cacah sampai dengan 20 menggunakan berbagai strategi pemecahan masalah.',
    material: 'Penjumlahan',
    allocationJp: 4,
    targetTerm: 'Semester 2',
    profileDimension: 'Penalaran Kritis, Kolaborasi',
    pedagogicalNote: 'Pemecahan masalah kontekstual'
  }
];

export const PilihTpView: React.FC<PilihTpViewProps> = ({
  globalContext,
  atpList,
  tps,
  onSelectTpForModul,
  onNavigate
}) => {
  // Filter state for class
  const [filterClass, setFilterClass] = useState<string | null>('1');

  // Determine source list
  const sourceList: AtpItem[] = atpList.length > 0 
    ? atpList 
    : (tps.length > 0 
        ? tps.map((t, idx) => ({
            tpId: t.id,
            stepNumber: idx + 1,
            gradeLevel: '1',
            semesterNumber: idx < Math.ceil(tps.length / 2) ? '1' : '2',
            element: t.material || 'Penjumlahan',
            tpText: t.text,
            material: t.material,
            allocationJp: 4,
            targetTerm: idx < Math.ceil(tps.length / 2) ? 'Semester 1' : 'Semester 2',
            profileDimension: t.pancasilaDimension || 'Penalaran Kritis',
            pedagogicalNote: 'Pendekatan kontekstual'
          }))
        : DEFAULT_TP_ITEMS
      );

  // Filtered by selected class if set
  const displayedItems = filterClass
    ? sourceList.filter(item => (item.gradeLevel || '1') === filterClass)
    : sourceList;

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn pb-16 font-sans">
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

          {/* Step 3: Active with Black Border and Badge 3 */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              Pilih TP
            </span>
          </div>

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

      {/* Main Card: Pilih TP untuk dikembangkan */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0f2942] font-serif">
            Pilih TP untuk dikembangkan
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Kembangkan satu per satu jadi modul ajar lengkap dengan KKTP & instrumen asesmen.
          </p>
        </div>

        {/* Info / Filter Banner */}
        <div className="bg-[#f0f4fa] border border-[#d8e2ef] rounded-xl p-3 sm:p-3.5 flex items-start sm:items-center gap-2.5 text-xs text-slate-700">
          <GraduationCap className="w-4 h-4 text-slate-700 shrink-0 mt-0.5 sm:mt-0" />
          <div className="leading-relaxed">
            <span>
              Menampilkan TP <strong>Kelas {filterClass || '1, 2'}</strong> {filterClass ? '(kelas yang kamu tulis)' : ''} — modul dibuat untuk kelas ini saja. · 
            </span>{' '}
            <button
              type="button"
              onClick={() => setFilterClass(filterClass ? null : '1')}
              className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer ml-1"
            >
              {filterClass ? 'tampilkan semua kelas (1, 2)' : 'tampilkan hanya Kelas 1'}
            </button>
          </div>
        </div>

        {/* List of TP Cards */}
        <div className="space-y-3.5">
          {displayedItems.map((item, idx) => (
            <div
              key={item.tpId || idx}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3 hover:border-slate-300 transition-all"
            >
              {/* Pills / Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#e8f1fb] text-[#1c497d] font-semibold text-[11px] px-2.5 py-0.5 rounded-full">
                  Kelas {item.gradeLevel || '1'} · Smt {item.semesterNumber || (idx < 2 ? '1' : '2')}
                </span>
                <span className="bg-[#e8f1fb] text-[#1c497d] font-semibold text-[11px] px-2.5 py-0.5 rounded-full">
                  {item.element || item.material || 'Penjumlahan'}
                </span>
              </div>

              {/* Number and TP Text */}
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                <span className="font-bold mr-1.5">{idx + 1}.</span>
                {item.tpText}
              </p>

              {/* Action Button: Kembangkan */}
              <div>
                <button
                  type="button"
                  onClick={() => onSelectTpForModul(item)}
                  className="px-4 py-2 bg-[#0f2942] hover:bg-[#1a3a5a] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Kembangkan →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
