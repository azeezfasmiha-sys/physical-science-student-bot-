import React, { useState } from 'react';
import { Award, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import {
  SyllabusUnitItem,
  DISCIPLINE_META,
} from '../data/alCurriculum';
import { calculateSriLankaALZScore } from '../utils/physicsMath';

interface SyllabusZScoreViewProps {
  units: SyllabusUnitItem[];
  unitStatuses: Record<string, 'mastered' | 'in-progress' | 'revision'>;
  onUpdateUnitStatus: (
    unitId: string,
    status: 'mastered' | 'in-progress' | 'revision'
  ) => void;
}

export const SyllabusZScoreView: React.FC<SyllabusZScoreViewProps> = ({
  units,
  unitStatuses,
  onUpdateUnitStatus,
}) => {
  const [mathsMark, setMathsMark] = useState<number>(84);
  const [physicsMark, setPhysicsMark] = useState<number>(81);
  const [thirdMark, setThirdMark] = useState<number>(79);
  const [thirdSubjectType, setThirdSubjectType] = useState<'chemistry' | 'ict'>(
    'chemistry'
  );

  const zReport = calculateSriLankaALZScore({
    combinedMaths: mathsMark,
    physics: physicsMark,
    thirdSubject: thirdMark,
    thirdSubjectType,
  });

  const masteredCount = units.filter(
    (u) => (unitStatuses[u.id] || u.defaultStatus) === 'mastered'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#334155]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F8FAFC]">
            G.C.E. A/L Syllabus Mastery & University Z-Score Estimator
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Track NIE syllabus unit completion and compute standardized Z-Scores against UGC Engineering & Physical Science cutoffs.
          </p>
        </div>

        <div className="bg-[#111C33] border border-[#334155] rounded px-4 py-2 text-xs font-mono tabular-nums">
          Syllabus Mastery:{' '}
          <span className="text-[#10B981] font-semibold">
            {masteredCount} / {units.length} Units ({Math.round((masteredCount / units.length) * 100)}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Syllabus Unit Mastery Matrix */}
        <div className="lg:col-span-7 bg-[#111C33] border border-[#334155] rounded-lg p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#F8FAFC] border-b border-[#334155] pb-3">
            National Institute of Education (NIE) Core Syllabus Units
          </h2>

          <div className="space-y-3">
            {units.map((u) => {
              const currentStatus = unitStatuses[u.id] || u.defaultStatus;
              const dMeta = DISCIPLINE_META[u.discipline];
              return (
                <div
                  key={u.id}
                  className="bg-[#0B1120] border border-[#334155] rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span style={{ color: dMeta.chipText }} className="font-semibold">
                        {u.disciplineLabel}
                      </span>
                      <span aria-hidden="true" className="text-[#475569]">
                        ·
                      </span>
                      <span className="text-[#F8FAFC]">{u.code}</span>
                      <span aria-hidden="true" className="text-[#475569]">
                        ·
                      </span>
                      <span className="text-[#94A3B8] tabular-nums">
                        {u.recommendedPeriods} Periods ({u.weightPercentage}% Paper Weight)
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#F8FAFC]">
                      {u.title}
                    </h3>
                    <div className="text-xs text-[#94A3B8]">
                      {u.keyTopics.join(' · ')}
                    </div>
                  </div>

                  {/* Interactive Status Segmented Control */}
                  <div className="flex items-center gap-1 bg-[#111C33] p-1 rounded border border-[#334155] shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateUnitStatus(u.id, 'mastered')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                        currentStatus === 'mastered'
                          ? 'bg-[#10B981] text-[#002113] font-semibold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Mastered
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateUnitStatus(u.id, 'in-progress')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                        currentStatus === 'in-progress'
                          ? 'bg-[#2563EB] text-white font-semibold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateUnitStatus(u.id, 'revision')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                        currentStatus === 'revision'
                          ? 'bg-[#F59E0B] text-[#0B1120] font-semibold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <AlertCircle className="w-3 h-3" />
                      Revision
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Live Z-Score Calculator & UGC Cutoff Eligibility */}
        <div className="lg:col-span-5 bg-[#111C33] border border-[#334155] rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#06B6D4]" />
              <h2 className="text-base font-semibold text-[#F8FAFC]">
                Standardized Z-Score Simulator
              </h2>
            </div>
            <span className="label-sm text-[#06B6D4]">UGC FORMULA</span>
          </div>

          {/* Subject Mark Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <label htmlFor="z-maths" className="text-[#60A5FA]">
                  Combined Mathematics Raw Mark:
                </label>
                <span className="text-[#F8FAFC] tabular-nums">
                  {mathsMark}% (z = {zReport.zMaths})
                </span>
              </div>
              <input
                id="z-maths"
                type="range"
                min={20}
                max={100}
                value={mathsMark}
                onChange={(e) => setMathsMark(Number(e.target.value))}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <label htmlFor="z-physics" className="text-[#22D3EE]">
                  Physics Raw Mark:
                </label>
                <span className="text-[#F8FAFC] tabular-nums">
                  {physicsMark}% (z = {zReport.zPhysics})
                </span>
              </div>
              <input
                id="z-physics"
                type="range"
                min={20}
                max={100}
                value={physicsMark}
                onChange={(e) => setPhysicsMark(Number(e.target.value))}
                className="w-full accent-[#06B6D4]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setThirdSubjectType('chemistry')}
                    className={`px-2 py-0.5 rounded border ${
                      thirdSubjectType === 'chemistry'
                        ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399]'
                        : 'border-[#334155] text-[#94A3B8]'
                    }`}
                  >
                    Chemistry
                  </button>
                  <button
                    type="button"
                    onClick={() => setThirdSubjectType('ict')}
                    className={`px-2 py-0.5 rounded border ${
                      thirdSubjectType === 'ict'
                        ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#C084FC]'
                        : 'border-[#334155] text-[#94A3B8]'
                    }`}
                  >
                    ICT
                  </button>
                </div>
                <span className="text-[#F8FAFC] tabular-nums">
                  {thirdMark}% (z = {zReport.zThird})
                </span>
              </div>
              <input
                id="z-third"
                aria-label="Third Subject Raw Mark"
                type="range"
                min={20}
                max={100}
                value={thirdMark}
                onChange={(e) => setThirdMark(Number(e.target.value))}
                className="w-full accent-[#10B981]"
              />
            </div>
          </div>

          {/* Computed Composite Z-Score Readout */}
          <div className="bg-[#0B1120] border border-[#334155] rounded-md p-4 flex items-center justify-between">
            <div>
              <div className="label-sm text-[#94A3B8]">ESTIMATED COMPOSITE Z-SCORE</div>
              <div className="text-xs text-[#06B6D4] font-mono mt-1">
                {zReport.islandRankEstimate}
              </div>
            </div>
            <div className="text-3xl font-mono font-bold text-[#F8FAFC] tabular-nums">
              {zReport.zScore > 0 ? `+${zReport.zScore.toFixed(4)}` : zReport.zScore.toFixed(4)}
            </div>
          </div>

          {/* University Faculty Cutoff Table */}
          <div className="space-y-2">
            <div className="label-sm text-[#94A3B8]">
              STATE UNIVERSITY FACULTY CUTOFF ELIGIBILITY
            </div>
            <div className="divide-y divide-[#334155] border border-[#334155] rounded bg-[#0B1120]">
              {zReport.eligibleFaculties.map((fac, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#F8FAFC]">
                      {fac.university}
                    </div>
                    <div className="text-[#94A3B8]">{fac.course}</div>
                  </div>
                  <div className="text-right font-mono tabular-nums shrink-0">
                    <div className="text-[#F8FAFC]">Cutoff: {fac.cutoff.toFixed(4)}</div>
                    <div
                      className={
                        fac.eligible ? 'text-[#10B981] font-semibold' : 'text-[#EF4444]'
                      }
                    >
                      {fac.eligible ? '✓ ELIGIBLE' : '✕ BELOW CUTOFF'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
