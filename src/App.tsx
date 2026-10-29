/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PAST_PAPER_QUESTIONS,
  FORMULA_REFERENCES,
  INITIAL_SYLLABUS_UNITS,
  INITIAL_REVISION_CARDS,
  RevisionCardItem,
} from './data/alCurriculum';
import { DisciplineId } from './utils/physicsMath';
import { DerivationStudio } from './components/DerivationStudio';
import { InteractiveLabView } from './components/InteractiveLabView';
import { SyllabusZScoreView } from './components/SyllabusZScoreView';
import { RevisionQueueView } from './components/RevisionQueueView';

type ActiveScreen = 'derivation' | 'lab' | 'syllabus' | 'revision';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('derivation');
  const [selectedDiscipline, setSelectedDiscipline] = useState<
    DisciplineId | 'all'
  >('all');

  // Persisted solved question marks
  const [solvedMap, setSolvedMap] = useState<
    Record<string, { marks: number; input: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('al_phy_sci_solved');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persisted syllabus unit statuses
  const [unitStatuses, setUnitStatuses] = useState<
    Record<string, 'mastered' | 'in-progress' | 'revision'>
  >(() => {
    try {
      const saved = localStorage.getItem('al_phy_sci_units');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persisted revision cards
  const [revisionCards, setRevisionCards] = useState<RevisionCardItem[]>(() => {
    try {
      const saved = localStorage.getItem('al_phy_sci_revision');
      return saved ? JSON.parse(saved) : INITIAL_REVISION_CARDS;
    } catch {
      return INITIAL_REVISION_CARDS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('al_phy_sci_solved', JSON.stringify(solvedMap));
    } catch {}
  }, [solvedMap]);

  useEffect(() => {
    try {
      localStorage.setItem('al_phy_sci_units', JSON.stringify(unitStatuses));
    } catch {}
  }, [unitStatuses]);

  useEffect(() => {
    try {
      localStorage.setItem('al_phy_sci_revision', JSON.stringify(revisionCards));
    } catch {}
  }, [revisionCards]);

  const handleRecordQuestionResult = (
    questionId: string,
    marks: number,
    input: string
  ) => {
    setSolvedMap((prev) => ({
      ...prev,
      [questionId]: { marks, input },
    }));
  };

  const handleUpdateUnitStatus = (
    unitId: string,
    status: 'mastered' | 'in-progress' | 'revision'
  ) => {
    setUnitStatuses((prev) => ({
      ...prev,
      [unitId]: status,
    }));
  };

  const handleAddRevisionItem = (item: Omit<RevisionCardItem, 'id'>) => {
    const newItem: RevisionCardItem = {
      ...item,
      id: `rev-${Date.now()}`,
    };
    setRevisionCards((prev) => [newItem, ...prev]);
  };

  const handleToggleMasteredRevision = (id: string) => {
    setRevisionCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mastered: !c.mastered } : c))
    );
  };

  const totalEarnedMarks = (
    Object.values(solvedMap) as Array<{ marks: number; input: string }>
  ).reduce((acc, item) => acc + item.marks, 0);
  const totalAvailableMarks = PAST_PAPER_QUESTIONS.reduce(
    (acc, q) => acc + q.totalMarks,
    0
  );

  const pendingRevisionCount = revisionCards.filter((c) => !c.mastered).length;

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col">
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="flex items-center justify-between gap-3 lg:gap-8 px-4 sm:px-8 py-3.5 bg-[#0B1120] border-b border-[#334155]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#derivation"
          onClick={(e) => {
            e.preventDefault();
            setActiveScreen('derivation');
          }}
          className="text-sm sm:text-lg font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap shrink-0"
        >
          Physical Science A/L System
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label="Primary Workspace Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#94A3B8]"
        >
          <a
            href="#derivation"
            onClick={(e) => {
              e.preventDefault();
              setActiveScreen('derivation');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeScreen === 'derivation'
                ? 'text-[#F8FAFC] border-[#2563EB]'
                : 'border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            Derivation Studio
          </a>
          <a
            href="#lab"
            onClick={(e) => {
              e.preventDefault();
              setActiveScreen('lab');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeScreen === 'lab'
                ? 'text-[#F8FAFC] border-[#06B6D4]'
                : 'border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            Interactive Lab
          </a>
          <a
            href="#syllabus"
            onClick={(e) => {
              e.preventDefault();
              setActiveScreen('syllabus');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeScreen === 'syllabus'
                ? 'text-[#F8FAFC] border-[#10B981]'
                : 'border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            Syllabus & Z-Score
          </a>
          <a
            href="#revision"
            onClick={(e) => {
              e.preventDefault();
              setActiveScreen('revision');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeScreen === 'revision'
                ? 'text-[#F8FAFC] border-[#F59E0B]'
                : 'border-transparent hover:text-[#F8FAFC]'
            }`}
          >
            Revision Queue ({pendingRevisionCount})
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveScreen('syllabus')}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Z-Score Calculator
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar (<768px) */}
      <nav
        aria-label="Mobile Workspace Navigation"
        className="flex md:hidden items-center justify-around border-b border-[#334155] bg-[#111C33] px-2 py-2 text-xs font-mono"
      >
        <button
          type="button"
          onClick={() => setActiveScreen('derivation')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeScreen === 'derivation'
              ? 'bg-[#2563EB] text-white'
              : 'text-[#94A3B8]'
          }`}
        >
          Derivations
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('lab')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeScreen === 'lab' ? 'bg-[#06B6D4] text-[#001F26] font-semibold' : 'text-[#94A3B8]'
          }`}
        >
          Sim Lab
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('syllabus')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeScreen === 'syllabus'
              ? 'bg-[#10B981] text-[#002113] font-semibold'
              : 'text-[#94A3B8]'
          }`}
        >
          Z-Score
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('revision')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeScreen === 'revision'
              ? 'bg-[#F59E0B] text-[#0B1120] font-semibold'
              : 'text-[#94A3B8]'
          }`}
        >
          Queue ({pendingRevisionCount})
        </button>
      </nav>

      {/* Candidate Session Telemetry & Discipline Summary Strip */}
      <div className="bg-[#111C33]/60 border-b border-[#334155] px-4 sm:px-8 py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 text-[#94A3B8]">
            <span className="text-[#F8FAFC] font-medium">
              G.C.E. A/L Physical Science Stream
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#60A5FA]">Combined Maths</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#22D3EE]">Physics</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#34D399]">Chemistry</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#C084FC]">ICT</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 tabular-nums">
            <span className="text-[#94A3B8]">
              Verified Paper Score:{' '}
              <strong className="text-[#10B981]">
                {totalEarnedMarks} / {totalAvailableMarks} Marks
              </strong>
            </span>
            <span aria-hidden="true" className="text-[#334155]">
              |
            </span>
            <span className="text-[#94A3B8]">
              Problems Verified:{' '}
              <strong className="text-[#F8FAFC]">
                {Object.keys(solvedMap).length} / {PAST_PAPER_QUESTIONS.length}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container (Desktop 2rem margin, Mobile 1rem margin) */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
        {activeScreen === 'derivation' && (
          <DerivationStudio
            questions={PAST_PAPER_QUESTIONS}
            formulas={FORMULA_REFERENCES}
            selectedDiscipline={selectedDiscipline}
            onSelectDiscipline={setSelectedDiscipline}
            solvedMap={solvedMap}
            onRecordQuestionResult={handleRecordQuestionResult}
            onAddRevisionItem={handleAddRevisionItem}
          />
        )}

        {activeScreen === 'lab' && <InteractiveLabView />}

        {activeScreen === 'syllabus' && (
          <SyllabusZScoreView
            units={INITIAL_SYLLABUS_UNITS}
            unitStatuses={unitStatuses}
            onUpdateUnitStatus={handleUpdateUnitStatus}
          />
        )}

        {activeScreen === 'revision' && (
          <RevisionQueueView
            items={revisionCards}
            onToggleMastered={handleToggleMasteredRevision}
            onAddRevisionItem={handleAddRevisionItem}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#334155] bg-[#0B1120] px-4 sm:px-8 py-4 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <div>
            Sri Lankan G.C.E. Advanced Level Physical Science Candidate Console · NIE Syllabus & SI Standard Compliant
          </div>
          <div className="font-mono text-[11px] tabular-nums">
            Combined Mathematics (09) · Physics (01) · Chemistry (02) · ICT (20)
          </div>
        </div>
      </footer>
    </div>
  );
}
