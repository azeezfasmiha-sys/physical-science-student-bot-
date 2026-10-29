import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import {
  RevisionCardItem,
  DISCIPLINE_META,
} from '../data/alCurriculum';
import { DisciplineId } from '../utils/physicsMath';

interface RevisionQueueViewProps {
  items: RevisionCardItem[];
  onToggleMastered: (id: string) => void;
  onAddRevisionItem: (item: Omit<RevisionCardItem, 'id'>) => void;
}

export const RevisionQueueView: React.FC<RevisionQueueViewProps> = ({
  items,
  onToggleMastered,
  onAddRevisionItem,
}) => {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'mastered'>('all');

  // Form state for adding a custom derivation trap / formula note
  const [discipline, setDiscipline] = useState<DisciplineId>('physics');
  const [questionRef, setQuestionRef] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [formulaOrTrap, setFormulaOrTrap] = useState<string>('');
  const [correctResolution, setCorrectResolution] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (filterMode === 'pending') return !item.mastered;
    if (filterMode === 'mastered') return item.mastered;
    return true;
  });

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !formulaOrTrap.trim() || !correctResolution.trim()) {
      setFormError(
        'Validation Error: Title, Formula/Trap expression, and Resolution notes are all required.'
      );
      return;
    }
    setFormError(null);
    const meta = DISCIPLINE_META[discipline];
    onAddRevisionItem({
      discipline,
      disciplineLabel: meta.label,
      questionRef: questionRef.trim() || '2024 A/L · Custom Note',
      title: title.trim(),
      formulaOrTrap: formulaOrTrap.trim(),
      correctResolution: correctResolution.trim(),
      severity: 'amber',
      mastered: false,
    });
    setTitle('');
    setQuestionRef('');
    setFormulaOrTrap('');
    setCorrectResolution('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#334155]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F8FAFC]">
            Dimensional Traps & Formula Revision Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Review flagged derivation warnings, SI unit prefix pitfalls, and high-yield past paper theorems.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#111C33] p-1 rounded border border-[#334155]">
          {(['all', 'pending', 'mastered'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded text-xs font-mono capitalize transition-colors ${
                filterMode === mode
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {mode} ({
                items.filter((i) =>
                  mode === 'all' ? true : mode === 'pending' ? !i.mastered : i.mastered
                ).length
              })
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Revision Cards List */}
        <div className="lg:col-span-8 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-[#111C33] border border-[#334155] rounded-lg p-8 text-center space-y-2">
              <p className="text-sm text-[#F8FAFC] font-medium">
                No revision cards match the current filter.
              </p>
              <p className="text-xs text-[#94A3B8]">
                Flag a derivation step in the Derivation Studio or log a new formula card using the form on the right.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const dMeta = DISCIPLINE_META[item.discipline];
              const isRevealed = Boolean(revealedIds[item.id]);
              return (
                <div
                  key={item.id}
                  className="bg-[#111C33] border border-[#334155] rounded-lg p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span style={{ color: dMeta.chipText }} className="font-semibold">
                        {item.disciplineLabel}
                      </span>
                      <span aria-hidden="true" className="text-[#475569]">
                        ·
                      </span>
                      <span className="text-[#94A3B8]">{item.questionRef}</span>
                      <span aria-hidden="true" className="text-[#475569]">
                        ·
                      </span>
                      <span
                        className={
                          item.mastered
                            ? 'text-[#10B981]'
                            : item.severity === 'crimson'
                            ? 'text-[#EF4444]'
                            : 'text-[#F59E0B]'
                        }
                      >
                        {item.mastered
                          ? '● MASTERED'
                          : item.severity === 'crimson'
                          ? '▲ CRITICAL TRAP'
                          : '▲ REVISION QUEUE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedIds((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className="px-2.5 py-1 rounded text-xs font-mono bg-[#0B1120] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            Hide Resolution
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            Reveal Resolution
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleMastered(item.id)}
                        className={`px-3 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                          item.mastered
                            ? 'bg-[#10B981]/20 border border-[#10B981] text-[#34D399]'
                            : 'bg-[#1E293B] border border-[#334155] text-[#F8FAFC] hover:border-[#10B981]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.mastered ? 'Mastered' : 'Mark Mastered'}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-[#F8FAFC]">
                    {item.title}
                  </h3>

                  <div className="bg-[#0B1120] border border-[#334155] rounded px-3.5 py-2.5 overflow-x-auto">
                    <code className="code-formula-md text-[#F8FAFC]">
                      {item.formulaOrTrap}
                    </code>
                  </div>

                  {isRevealed && (
                    <div className="bg-[#1E293B]/70 border border-[#06B6D4]/40 rounded p-3 text-xs text-[#DDE2F8] space-y-1">
                      <div className="label-sm text-[#06B6D4]">
                        VERIFIED ANALYTICAL RESOLUTION:
                      </div>
                      <p>{item.correctResolution}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right 4 Columns: Log New Formula / Dimensional Trap Form */}
        <div className="lg:col-span-4 bg-[#111C33] border border-[#334155] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#334155] pb-3">
            <Plus className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-[#F8FAFC]">
              Log Custom Revision Note
            </h2>
          </div>

          <form onSubmit={handleCreateCard} className="space-y-3.5">
            <div>
              <label
                htmlFor="rev-discipline"
                className="block label-sm text-[#94A3B8] mb-1.5"
              >
                DISCIPLINE
              </label>
              <select
                id="rev-discipline"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as DisciplineId)}
                className="w-full bg-[#0B1120] border border-[#334155] rounded px-3 py-2 text-xs font-mono text-[#F8FAFC]"
              >
                <option value="combined-maths">Combined Maths</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="ict">ICT</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="rev-ref"
                className="block label-sm text-[#94A3B8] mb-1.5"
              >
                PAST PAPER REFERENCE
              </label>
              <input
                id="rev-ref"
                type="text"
                value={questionRef}
                onChange={(e) => setQuestionRef(e.target.value)}
                placeholder="e.g. 2024 A/L · Part II Q.05"
                className="w-full bg-[#0B1120] border border-[#334155] rounded px-3 py-2 text-xs font-mono text-[#F8FAFC]"
              />
            </div>

            <div>
              <label
                htmlFor="rev-title"
                className="block label-sm text-[#94A3B8] mb-1.5"
              >
                CONCEPT OR TRAP TITLE *
              </label>
              <input
                id="rev-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rotational Kinetic Energy Moment of Inertia"
                className="w-full bg-[#0B1120] border border-[#334155] rounded px-3 py-2 text-xs text-[#F8FAFC]"
              />
            </div>

            <div>
              <label
                htmlFor="rev-formula"
                className="block label-sm text-[#94A3B8] mb-1.5"
              >
                FORMULA OR COMMON ERROR *
              </label>
              <input
                id="rev-formula"
                type="text"
                value={formulaOrTrap}
                onChange={(e) => setFormulaOrTrap(e.target.value)}
                placeholder="e.g. K_total = ½ m v² + ½ I ω²"
                className="w-full bg-[#0B1120] border border-[#334155] rounded px-3 py-2 text-xs font-mono text-[#F8FAFC]"
              />
            </div>

            <div>
              <label
                htmlFor="rev-resolution"
                className="block label-sm text-[#94A3B8] mb-1.5"
              >
                CORRECT RESOLUTION & SI UNITS *
              </label>
              <textarea
                id="rev-resolution"
                rows={3}
                value={correctResolution}
                onChange={(e) => setCorrectResolution(e.target.value)}
                placeholder="Include both translational and rotational kinetic energy terms for a rolling rigid cylinder."
                className="w-full bg-[#0B1120] border border-[#334155] rounded px-3 py-2 text-xs text-[#F8FAFC]"
              />
            </div>

            {formError && (
              <div
                role="alert"
                className="p-2.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/40 text-xs text-[#F87171] flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white label-md transition-colors cursor-pointer"
            >
              Add to Revision Queue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
