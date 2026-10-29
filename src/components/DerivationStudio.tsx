import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Search,
  BookmarkPlus,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  SlidersHorizontal,
  FileCode2,
} from 'lucide-react';
import {
  DisciplineId,
  verifyNumericalCalculation,
  formatDimensions,
  checkDimensionalHomogeneity,
  AnswerCheckResult,
  DimensionalVector,
} from '../utils/physicsMath';
import {
  PastPaperQuestion,
  FormulaReference,
  DISCIPLINE_META,
  RevisionCardItem,
} from '../data/alCurriculum';

interface DerivationStudioProps {
  questions: PastPaperQuestion[];
  formulas: FormulaReference[];
  selectedDiscipline: DisciplineId | 'all';
  onSelectDiscipline: (d: DisciplineId | 'all') => void;
  solvedMap: Record<string, { marks: number; input: string }>;
  onRecordQuestionResult: (questionId: string, marks: number, input: string) => void;
  onAddRevisionItem: (item: Omit<RevisionCardItem, 'id'>) => void;
}

export const DerivationStudio: React.FC<DerivationStudioProps> = ({
  questions,
  formulas,
  selectedDiscipline,
  onSelectDiscipline,
  solvedMap,
  onRecordQuestionResult,
  onAddRevisionItem,
}) => {
  const filteredQuestions =
    selectedDiscipline === 'all'
      ? questions
      : questions.filter((q) => q.discipline === selectedDiscipline);

  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    filteredQuestions[0]?.id || questions[0].id
  );

  useEffect(() => {
    if (!filteredQuestions.some((q) => q.id === activeQuestionId) && filteredQuestions[0]) {
      setActiveQuestionId(filteredQuestions[0].id);
    }
  }, [selectedDiscipline, filteredQuestions, activeQuestionId]);

  const activeQuestion =
    questions.find((q) => q.id === activeQuestionId) || questions[0];

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [candidateInput, setCandidateInput] = useState<string>(
    solvedMap[activeQuestion.id]?.input ?? ''
  );
  const [checkResult, setCheckResult] = useState<AnswerCheckResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [flaggedFeedback, setFlaggedFeedback] = useState<string | null>(null);

  // Mobile segmented toggle (<768px): 'paper' vs 'telemetry'
  const [mobilePane, setMobilePane] = useState<'paper' | 'telemetry'>('paper');

  // Exam timer state (default 25 mins per structured/essay question)
  const [timerSeconds, setTimerSeconds] = useState<number>(
    activeQuestion.recommendedMinutes * 60
  );
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Formula search & scratchpad state
  const [formulaSearch, setFormulaSearch] = useState<string>('');
  const [scratchpadText, setScratchpadText] = useState<string>(
    `u_x = 28 * cos(30°) = 24.25 m·s⁻¹\nu_y = 28 * sin(30°) = 14.00 m·s⁻¹\nv_{y,1} = e * u_y = 0.75 * 14.00 = 10.50 m·s⁻¹`
  );

  // Custom Dimensional Homogeneity Comparator
  const [rhsDim, setRhsDim] = useState<DimensionalVector>(
    activeQuestion.steps[0]?.dimensions || { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 }
  );

  useEffect(() => {
    setActiveStepIndex(0);
    setCandidateInput(solvedMap[activeQuestion.id]?.input ?? '');
    setCheckResult(null);
    setFlaggedFeedback(null);
    setTimerSeconds(activeQuestion.recommendedMinutes * 60);
    setTimerRunning(false);
    if (activeQuestion.steps[0]) {
      setRhsDim(activeQuestion.steps[0].dimensions);
    }
  }, [activeQuestion.id]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const activeStep =
    activeQuestion.steps[activeStepIndex] || activeQuestion.steps[0];

  const handleCopyLatex = (id: string, latex: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(latex).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleInspectStep = (index: number) => {
    setActiveStepIndex(index);
    const step = activeQuestion.steps[index];
    if (step) {
      setRhsDim(step.dimensions);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyNumericalCalculation(
      candidateInput,
      activeQuestion.targetNumericalValue,
      activeQuestion.tolerance,
      activeQuestion.totalMarks,
      activeQuestion.targetUnit
    );
    setCheckResult(res);
    if (res.isValidInput && res.awardedMarks > 0) {
      onRecordQuestionResult(activeQuestion.id, res.awardedMarks, candidateInput.trim());
    }
  };

  const handleFlagStepToQueue = () => {
    onAddRevisionItem({
      discipline: activeQuestion.discipline,
      disciplineLabel: activeQuestion.disciplineLabel,
      questionRef: activeQuestion.questionCode,
      title: `${activeQuestion.title} — Step ${activeStep.stepNumber}`,
      formulaOrTrap: activeStep.formulaLatex,
      correctResolution: `${activeStep.explanation} (SI Unit: ${activeStep.siUnit}, Dimensions: ${formatDimensions(activeStep.dimensions)})`,
      severity: 'amber',
      mastered: false,
    });
    setFlaggedFeedback(`Step ${activeStep.stepNumber} added to Revision Queue`);
    setTimeout(() => setFlaggedFeedback(null), 2500);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const filteredFormulas = formulas.filter((f) => {
    const matchesDisc =
      selectedDiscipline === 'all' || f.discipline === selectedDiscipline;
    const q = formulaSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.topic.toLowerCase().includes(q) ||
      f.expression.toLowerCase().includes(q);
    return matchesDisc && matchesSearch;
  });

  const homogeneityCheck = checkDimensionalHomogeneity(
    activeStep.dimensions,
    rhsDim
  );

  const meta = DISCIPLINE_META[activeQuestion.discipline];

  return (
    <div className="space-y-5">
      {/* Discipline Filter Bar & Question Switcher Strip */}
      <div className="space-y-3 pb-4 border-b border-[#334155]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Filter by Physical Science Discipline"
          >
            <button
              type="button"
              onClick={() => onSelectDiscipline('all')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 border ${
                selectedDiscipline === 'all'
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-[#111C33] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC] hover:border-[#64748B]'
              }`}
            >
              All Subjects ({questions.length})
            </button>
            {(['combined-maths', 'physics', 'chemistry', 'ict'] as DisciplineId[]).map(
              (disc) => {
                const dMeta = DISCIPLINE_META[disc];
                const isSelected = selectedDiscipline === disc;
                return (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => onSelectDiscipline(disc)}
                    style={
                      isSelected
                        ? {
                            backgroundColor: dMeta.chipFill,
                            color: dMeta.chipText,
                            borderColor: dMeta.accentHex,
                          }
                        : undefined
                    }
                    className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 border ${
                      isSelected
                        ? ''
                        : 'bg-[#111C33] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC] hover:border-[#64748B]'
                    }`}
                  >
                    {dMeta.label}
                  </button>
                );
              }
            )}
          </div>

          <span className="label-sm text-[#94A3B8] hidden sm:inline whitespace-nowrap">
            Select Past Paper Problem ({filteredQuestions.length} Available)
          </span>
        </div>

        {/* Question Selector Queue */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-sm text-[#94A3B8] whitespace-nowrap shrink-0">
            Paper Queue:
          </span>
          {filteredQuestions.map((q) => {
            const isActive = q.id === activeQuestion.id;
            const isSolved = Boolean(solvedMap[q.id]);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setActiveQuestionId(q.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-[#1E293B] text-[#F8FAFC] border-[#06B6D4]'
                    : 'bg-[#111C33] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC]'
                }`}
              >
                {q.questionCode} · {q.disciplineLabel}
                {isSolved ? ' [✓]' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Segmented Control (<768px) */}
      <div className="grid grid-cols-2 gap-1.5 md:hidden bg-[#111C33] p-1 rounded border border-[#334155]">
        <button
          type="button"
          onClick={() => setMobilePane('paper')}
          className={`px-2 py-2 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap truncate ${
            mobilePane === 'paper'
              ? 'bg-[#2563EB] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Problem & Derivation
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('telemetry')}
          className={`px-2 py-2 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap truncate ${
            mobilePane === 'telemetry'
              ? 'bg-[#2563EB] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          SI Units & Formulas
        </button>
      </div>

      {/* Desktop 12-Column Split: 8 Columns Primary Paper / LaTeX Derivation + 4 Columns Telemetry & Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 8 COLUMNS: Primary Paper & Step-by-Step LaTeX Derivation Canvas */}
        <div
          className={`lg:col-span-8 space-y-5 ${
            mobilePane === 'telemetry' ? 'hidden md:block' : 'block'
          }`}
        >
          {/* Problem Statement Header Container */}
          <section
            aria-label="Active Examination Problem"
            className="bg-[#111C33] border border-[#334155] rounded-lg p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#334155] pb-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span style={{ color: meta.chipText }} className="font-semibold">
                  {activeQuestion.disciplineLabel}
                </span>
                <span aria-hidden="true" className="text-[#475569]">
                  ·
                </span>
                <span className="text-[#F8FAFC]">{activeQuestion.questionCode}</span>
                <span aria-hidden="true" className="text-[#475569]">
                  ·
                </span>
                <span className="text-[#94A3B8]">{activeQuestion.paperType}</span>
                <span aria-hidden="true" className="text-[#475569]">
                  ·
                </span>
                <span className="text-[#94A3B8]">{activeQuestion.syllabusUnit}</span>
              </div>
              <div className="label-sm text-[#06B6D4] tabular-nums">
                Max Allocation: {activeQuestion.totalMarks} Marks ({activeQuestion.recommendedMinutes} min)
              </div>
            </div>

            <h1 className="text-xl sm:text-[22px] font-semibold leading-7 text-[#F8FAFC] text-balance">
              {activeQuestion.title}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[#DDE2F8]">
              {activeQuestion.problemStatement}
            </p>

            {/* Given Parameters Strip */}
            <div className="pt-2">
              <div className="label-sm text-[#94A3B8] mb-2">
                Given Boundary Parameters (SI Standard):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeQuestion.givenParameters.map((param) => (
                  <div
                    key={param.symbol}
                    className="bg-[#0B1120] border border-[#334155] rounded px-3 py-2 flex items-baseline justify-between gap-2"
                  >
                    <span className="font-mono text-xs text-[#94A3B8]">
                      {param.symbol} =
                    </span>
                    <span className="font-mono text-xs font-medium text-[#F8FAFC] tabular-nums">
                      {param.value}{' '}
                      <span className="text-[#06B6D4]">{param.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Step-by-Step Derivation & Marking Scheme Section */}
          <section
            aria-label="Step-by-Step Analytical Derivation"
            className="bg-[#111C33] border border-[#334155] rounded-lg p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-3">
              <div>
                <h2 className="text-base font-semibold text-[#F8FAFC]">
                  Analytical Derivation & Marking Scheme Breakdown
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  Select any step to inspect its base SI dimensional vector in the right telemetry console.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {flaggedFeedback && (
                  <span className="text-xs font-mono text-[#F59E0B]">
                    {flaggedFeedback}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleFlagStepToQueue}
                  className="px-3 py-1.5 rounded text-xs font-mono bg-transparent border border-[#334155] text-[#F8FAFC] hover:bg-[#1E293B] hover:border-[#64748B] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Flag Active Step
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {activeQuestion.steps.map((step, idx) => {
                const isStepActive = idx === activeStepIndex;
                return (
                  <div
                    key={step.id}
                    onClick={() => handleInspectStep(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleInspectStep(idx);
                      }
                    }}
                    className={`rounded-md p-4 transition-colors cursor-pointer border ${
                      isStepActive
                        ? 'bg-[#1E293B]/90 border-[#06B6D4]'
                        : 'bg-[#0B1120]/70 border-[#334155] hover:border-[#64748B]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`label-sm px-2 py-0.5 rounded font-mono ${
                            isStepActive
                              ? 'bg-[#06B6D4]/20 text-[#22D3EE]'
                              : 'bg-[#1E293B] text-[#94A3B8]'
                          }`}
                        >
                          STEP 0{step.stepNumber}
                        </span>
                        <h3 className="text-sm font-semibold text-[#F8FAFC]">
                          {step.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="label-sm text-[#10B981] tabular-nums">
                          +{step.marks} Marks
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLatex(step.id, step.formulaLatex);
                          }}
                          aria-label={`Copy LaTeX for Step ${step.stepNumber}`}
                          className="px-2 py-1 rounded text-[11px] font-mono bg-[#111C33] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#64748B] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          {copiedId === step.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#10B981]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy LaTeX
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Monospace Formula Expression Block */}
                    <div className="bg-[#0B1120] border border-[#334155] rounded px-3.5 py-2.5 overflow-x-auto my-2">
                      <code className="code-formula-md text-[#F8FAFC] whitespace-nowrap">
                        {step.formulaLatex}
                      </code>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8] pt-1">
                      <span>{step.explanation}</span>
                      <span className="font-mono text-[11px] text-[#06B6D4] whitespace-nowrap">
                        SI: {step.siUnit} · {formatDimensions(step.dimensions)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Numerical Answer Verification & Calculation Box */}
          <section
            aria-label="Numerical Answer Verification"
            className="bg-[#111C33] border border-[#334155] rounded-lg p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-[#F8FAFC]">
                  Candidate Numerical Verification & Dimensional Check
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  {activeQuestion.calculationPrompt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCandidateInput(String(activeQuestion.targetNumericalValue));
                  const res = verifyNumericalCalculation(
                    String(activeQuestion.targetNumericalValue),
                    activeQuestion.targetNumericalValue,
                    activeQuestion.tolerance,
                    activeQuestion.totalMarks,
                    activeQuestion.targetUnit
                  );
                  setCheckResult(res);
                  onRecordQuestionResult(
                    activeQuestion.id,
                    res.awardedMarks,
                    String(activeQuestion.targetNumericalValue)
                  );
                }}
                className="px-3 py-1.5 rounded text-xs font-mono bg-transparent border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors whitespace-nowrap shrink-0"
              >
                Insert Worked Target ({activeQuestion.targetNumericalValue} {activeQuestion.targetUnit})
              </button>
            </div>

            <form
              onSubmit={handleVerifySubmit}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="relative flex-1">
                <label htmlFor="candidate-numeric-input" className="sr-only">
                  Numerical Answer Input
                </label>
                <input
                  id="candidate-numeric-input"
                  type="text"
                  value={candidateInput}
                  onChange={(e) => setCandidateInput(e.target.value)}
                  placeholder={`Enter value (e.g. ${activeQuestion.targetNumericalValue})`}
                  className="w-full bg-[#0B1120] border border-[#334155] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] rounded px-3.5 py-2.5 pr-24 text-sm font-mono text-[#F8FAFC] placeholder-[#64748B] tabular-nums"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 label-sm text-[#06B6D4] bg-[#111C33] px-2 py-0.5 rounded border border-[#334155]">
                  {activeQuestion.targetUnit}
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white label-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Verify Calculation
              </button>
            </form>

            {checkResult && (
              <div
                role="status"
                className={`p-3.5 rounded border text-xs font-mono flex items-start gap-2.5 ${
                  checkResult.severity === 'success'
                    ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#34D399]'
                    : checkResult.severity === 'warning'
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#FBBF24]'
                    : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#F87171]'
                }`}
              >
                {checkResult.severity === 'success' && (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#10B981]" />
                )}
                {checkResult.severity === 'warning' && (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#F59E0B]" />
                )}
                {checkResult.severity === 'error' && (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#EF4444]" />
                )}
                <div className="space-y-1">
                  <div className="font-semibold">
                    {checkResult.severity === 'success'
                      ? 'VERIFIED · FULL MARKS AWARDED'
                      : checkResult.severity === 'warning'
                      ? 'DIMENSIONAL / ROUNDING WARNING'
                      : 'VERIFICATION FAILED'}
                  </div>
                  <p className="text-[#F8FAFC] font-sans">{checkResult.feedback}</p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT 4 COLUMNS: Telemetry Console, Exam Timer, SI Dimensional Analyzer & Formula Lookup */}
        <aside
          aria-label="Telemetry, Dimensional Analysis, and Formula Console"
          className={`lg:col-span-4 space-y-5 ${
            mobilePane === 'paper' ? 'hidden md:block' : 'block'
          }`}
        >
          {/* 1. Exam Pace & Countdown Timer */}
          <div className="bg-[#111C33] border border-[#334155] rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="label-sm text-[#94A3B8]">
                A/L EXAM SPRINT TIMER
              </span>
              <span className="label-sm text-[#06B6D4] tabular-nums">
                Target: {(activeQuestion.totalMarks / activeQuestion.recommendedMinutes).toFixed(1)} Marks/min
              </span>
            </div>

            <div className="bg-[#0B1120] border border-[#334155] rounded px-4 py-3 flex items-center justify-between">
              <div
                className={`text-2xl font-mono font-bold tabular-nums ${
                  timerSeconds < 180 ? 'text-[#EF4444]' : 'text-[#F8FAFC]'
                }`}
              >
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerRunning((r) => !r)}
                  aria-label={timerRunning ? 'Pause Exam Timer' : 'Start Exam Timer'}
                  className="px-3 py-1.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-medium flex items-center gap-1 transition-colors"
                >
                  {timerRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Start
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(activeQuestion.recommendedMinutes * 60);
                  }}
                  aria-label="Reset Exam Timer"
                  className="p-1.5 rounded bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Real-Time SI Dimensional Homogeneity Inspector */}
          <div className="bg-[#111C33] border border-[#334155] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#06B6D4]" />
                <h2 className="text-sm font-semibold text-[#F8FAFC]">
                  SI Dimensional Homogeneity
                </h2>
              </div>
              <span className="label-sm text-[#06B6D4]">
                STEP 0{activeStep.stepNumber}
              </span>
            </div>

            <div className="bg-[#0B1120] border border-[#334155] rounded p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">LHS Step Vector:</span>
                <span className="text-[#22D3EE] font-semibold">
                  {formatDimensions(activeStep.dimensions)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Derived SI Unit:</span>
                <span className="text-[#F8FAFC]">{activeStep.siUnit}</span>
              </div>
            </div>

            {/* Interactive Base Exponent Adjuster to test Homogeneity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="label-sm text-[#94A3B8]">
                  Test Candidate RHS Exponents:
                </span>
                <button
                  type="button"
                  onClick={() => setRhsDim(activeStep.dimensions)}
                  className="text-[11px] font-mono text-[#60A5FA] hover:underline"
                >
                  Sync to Step
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['M', 'L', 'T'] as Array<keyof DimensionalVector>).map((dimKey) => (
                  <div
                    key={dimKey}
                    className="bg-[#0B1120] border border-[#334155] rounded p-2 flex items-center justify-between"
                  >
                    <span className="font-mono text-xs text-[#94A3B8]">[{dimKey}]</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Decrease ${dimKey} dimension`}
                        onClick={() =>
                          setRhsDim((prev) => ({ ...prev, [dimKey]: prev[dimKey] - 1 }))
                        }
                        className="w-5 h-5 rounded bg-[#1E293B] text-xs font-mono text-[#F8FAFC] hover:bg-[#334155]"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs w-4 text-center tabular-nums">
                        {rhsDim[dimKey]}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${dimKey} dimension`}
                        onClick={() =>
                          setRhsDim((prev) => ({ ...prev, [dimKey]: prev[dimKey] + 1 }))
                        }
                        className="w-5 h-5 rounded bg-[#1E293B] text-xs font-mono text-[#F8FAFC] hover:bg-[#334155]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`px-3 py-2 rounded border text-xs font-mono ${
                homogeneityCheck.homogeneous
                  ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#34D399]'
                  : 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#FBBF24]'
              }`}
            >
              {homogeneityCheck.homogeneous ? (
                <span>✓ Dimensionally Homogeneous: LHS = RHS</span>
              ) : (
                <span>
                  ⚠ Dimensional Mismatch: {homogeneityCheck.mismatches.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* 3. Formula Sheet Lookup & Scratchpad */}
          <div className="bg-[#111C33] border border-[#334155] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#60A5FA]" />
                <h2 className="text-sm font-semibold text-[#F8FAFC]">
                  A/L Formula & Constant Sheet
                </h2>
              </div>
              <span className="label-sm text-[#94A3B8]">
                {filteredFormulas.length} entries
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formulaSearch}
                onChange={(e) => setFormulaSearch(e.target.value)}
                placeholder="Search Poiseuille, Nernst, Restitution..."
                aria-label="Search Formula Sheet"
                className="w-full bg-[#0B1120] border border-[#334155] focus:border-[#2563EB] focus:outline-none rounded pl-8 pr-3 py-1.5 text-xs font-mono text-[#F8FAFC] placeholder-[#64748B]"
              />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredFormulas.map((f) => (
                <div
                  key={f.id}
                  className="bg-[#0B1120] border border-[#334155] rounded p-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#F8FAFC]">
                      {f.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setScratchpadText((prev) => `${prev}\n${f.expression}  [${f.siUnit}]`)
                      }
                      className="text-[11px] font-mono text-[#06B6D4] hover:underline whitespace-nowrap shrink-0"
                    >
                      + Scratchpad
                    </button>
                  </div>
                  <div className="font-mono text-xs text-[#60A5FA] bg-[#111C33] px-2 py-1 rounded border border-[#334155]/80 overflow-x-auto">
                    {f.expression}
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">{f.notes}</p>
                </div>
              ))}
            </div>

            {/* Interactive Calculation Scratchpad */}
            <div className="pt-2 border-t border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="rough-scratchpad"
                  className="label-sm text-[#94A3B8] flex items-center gap-1.5"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                  CANDIDATE ROUGH SCRATCHPAD
                </label>
                <button
                  type="button"
                  onClick={() => setScratchpadText('')}
                  className="text-[11px] font-mono text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Clear
                </button>
              </div>
              <textarea
                id="rough-scratchpad"
                rows={4}
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="Write intermediate algebraic substitutions or rough steps..."
                className="w-full bg-[#0B1120] border border-[#334155] focus:border-[#2563EB] focus:outline-none rounded p-2.5 text-xs font-mono text-[#F8FAFC] leading-relaxed"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
