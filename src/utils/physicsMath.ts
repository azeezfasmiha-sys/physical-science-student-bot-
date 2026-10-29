export type DisciplineId = 'combined-maths' | 'physics' | 'chemistry' | 'ict';

export interface DimensionalVector {
  M: number; // Mass
  L: number; // Length
  T: number; // Time
  I: number; // Electric Current
  Theta: number; // Thermodynamic Temperature
  N: number; // Amount of Substance
}

export interface AnswerCheckResult {
  isValidInput: boolean;
  isCorrect: boolean;
  isWithinTolerance: boolean;
  percentageError: number;
  feedback: string;
  awardedMarks: number;
  severity: 'success' | 'warning' | 'error';
}

/**
 * Verifies a candidate's numerical calculation against an expected target value,
 * enforcing form validation, relative/absolute tolerance, and mark allocation.
 */
export function verifyNumericalCalculation(
  rawInput: string,
  targetValue: number,
  tolerance: number,
  maxMarks: number,
  expectedUnit: string
): AnswerCheckResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      isValidInput: false,
      isCorrect: false,
      isWithinTolerance: false,
      percentageError: 100,
      feedback: 'Input required: Enter a numeric value before verifying.',
      awardedMarks: 0,
      severity: 'error',
    };
  }

  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return {
      isValidInput: false,
      isCorrect: false,
      isWithinTolerance: false,
      percentageError: 100,
      feedback: 'Invalid syntax: Enter a valid decimal or scientific notation number (e.g. 24.5 or 1.2e-3).',
      awardedMarks: 0,
      severity: 'error',
    };
  }

  const diff = Math.abs(parsed - targetValue);
  const pctError = targetValue !== 0 ? (diff / Math.abs(targetValue)) * 100 : diff * 100;

  if (diff <= tolerance) {
    return {
      isValidInput: true,
      isCorrect: true,
      isWithinTolerance: true,
      percentageError: Number(pctError.toFixed(2)),
      feedback: `Exact match within tolerance (±${tolerance} ${expectedUnit}). Full marks awarded (+${maxMarks}).`,
      awardedMarks: maxMarks,
      severity: 'success',
    };
  }

  // Check if off by power of 10 (classic SI unit prefix error in A/L exams: cm vs m, kJ vs J)
  const ratio = targetValue !== 0 ? Math.abs(parsed / targetValue) : 0;
  const isPowerOfTenOff =
    Math.abs(ratio - 10) < 0.05 ||
    Math.abs(ratio - 100) < 0.5 ||
    Math.abs(ratio - 1000) < 5 ||
    Math.abs(ratio - 0.1) < 0.005 ||
    Math.abs(ratio - 0.01) < 0.0005 ||
    Math.abs(ratio - 0.001) < 0.00005;

  if (isPowerOfTenOff) {
    const partialMarks = Math.max(1, Math.floor(maxMarks * 0.4));
    return {
      isValidInput: true,
      isCorrect: false,
      isWithinTolerance: false,
      percentageError: Number(pctError.toFixed(2)),
      feedback: `Dimensional / SI prefix scaling warning: Your magnitude differs by a factor of 10ⁿ from ${targetValue} ${expectedUnit}. Check unit conversions (e.g. cm³ to dm³ or mJ to J). Partial method credit (+${partialMarks}).`,
      awardedMarks: partialMarks,
      severity: 'warning',
    };
  }

  // Check if close (within 3x tolerance) for rounding warning
  if (diff <= tolerance * 3) {
    const partialMarks = Math.max(1, Math.floor(maxMarks * 0.6));
    return {
      isValidInput: true,
      isCorrect: false,
      isWithinTolerance: false,
      percentageError: Number(pctError.toFixed(2)),
      feedback: `Intermediate rounding drift (${pctError.toFixed(2)}% error vs ${targetValue} ${expectedUnit}). Retain 4 significant figures during intermediate steps. Partial marks (+${partialMarks}).`,
      awardedMarks: partialMarks,
      severity: 'warning',
    };
  }

  return {
    isValidInput: true,
    isCorrect: false,
    isWithinTolerance: false,
    percentageError: Number(pctError.toFixed(2)),
    feedback: `Derivation deviation: Expected ${targetValue} ${expectedUnit} (±${tolerance}), received ${parsed} ${expectedUnit}. Inspect the step breakdown above.`,
    awardedMarks: 0,
    severity: 'error',
  };
}

/**
 * Formats a DimensionalVector into standard G.C.E. A/L Physics dimensional bracket notation
 * e.g. [M]¹[L]²[T]⁻²
 */
export function formatDimensions(dim: DimensionalVector): string {
  const superscriptMap: Record<string, string> = {
    '-': '⁻',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
  };

  const toSup = (n: number): string =>
    String(n)
      .split('')
      .map((ch) => superscriptMap[ch] ?? ch)
      .join('');

  const entries: Array<[string, number]> = [
    ['M', dim.M],
    ['L', dim.L],
    ['T', dim.T],
    ['I', dim.I],
    ['Θ', dim.Theta],
    ['N', dim.N],
  ];

  const active = entries.filter(([, exp]) => exp !== 0);
  if (active.length === 0) {
    return '[Dimensionless · M⁰L⁰T⁰]';
  }

  return active
    .map(([sym, exp]) => `[${sym}]${exp === 1 ? '' : toSup(exp)}`)
    .join(' ');
}

/**
 * Checks whether two dimensional vectors are homogeneous (identical in all 6 base quantities)
 */
export function checkDimensionalHomogeneity(
  lhs: DimensionalVector,
  rhs: DimensionalVector
): { homogeneous: boolean; mismatches: string[] } {
  const keys: Array<keyof DimensionalVector> = ['M', 'L', 'T', 'I', 'Theta', 'N'];
  const mismatches: string[] = [];

  for (const key of keys) {
    if (lhs[key] !== rhs[key]) {
      mismatches.push(`${key}: LHS(${lhs[key]}) ≠ RHS(${rhs[key]})`);
    }
  }

  return {
    homogeneous: mismatches.length === 0,
    mismatches,
  };
}

/**
 * Computes projectile mechanics metrics for Combined Mathematics / Physics lab simulation
 */
export function calculateProjectileMetrics(params: {
  initialVelocity: number; // u in m/s
  launchAngleDeg: number; // theta in degrees
  gravity: number; // g in m/s^2
  restitution: number; // e (0 to 1)
}): {
  timeOfFlight: number;
  maxHeight: number;
  horizontalRange: number;
  secondBounceRange: number;
  kineticEnergyPerKg: number;
  trajectoryPoints: Array<{ x: number; y: number; bounce: number }>;
} {
  const { initialVelocity: u, launchAngleDeg, gravity: g, restitution: e } = params;
  const rad = (launchAngleDeg * Math.PI) / 180;
  const ux = u * Math.cos(rad);
  const uy = u * Math.sin(rad);

  const timeOfFlight = (2 * uy) / g;
  const maxHeight = (uy * uy) / (2 * g);
  const horizontalRange = ux * timeOfFlight;
  const secondBounceRange = horizontalRange * e;
  const kineticEnergyPerKg = 0.5 * u * u;

  const trajectoryPoints: Array<{ x: number; y: number; bounce: number }> = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * timeOfFlight;
    const x = ux * t;
    const y = Math.max(0, uy * t - 0.5 * g * t * t);
    trajectoryPoints.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), bounce: 1 });
  }

  // Second bounce arc using coefficient of restitution e
  const tFlight2 = timeOfFlight * e;
  const uy2 = uy * e;
  const steps2 = 24;
  for (let i = 1; i <= steps2; i++) {
    const t = (i / steps2) * tFlight2;
    const x = horizontalRange + ux * t;
    const y = Math.max(0, uy2 * t - 0.5 * g * t * t);
    trajectoryPoints.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), bounce: 2 });
  }

  return {
    timeOfFlight: Number(timeOfFlight.toFixed(2)),
    maxHeight: Number(maxHeight.toFixed(2)),
    horizontalRange: Number(horizontalRange.toFixed(2)),
    secondBounceRange: Number(secondBounceRange.toFixed(2)),
    kineticEnergyPerKg: Number(kineticEnergyPerKg.toFixed(1)),
    trajectoryPoints,
  };
}

/**
 * Computes weak acid / strong base titration curve points & equivalence pH for Chemistry lab
 */
export function calculateTitrationMetrics(params: {
  acidConc: number; // C_a in mol/dm^3
  acidVolCm3: number; // V_a in cm^3
  baseConc: number; // C_b in mol/dm^3
  pKa: number; // -log10(Ka)
  currentBaseVolCm3: number;
}): {
  equivalenceVolCm3: number;
  currentPh: number;
  halfEquivalencePh: number;
   equivalencePh: number;
  bufferRegionActive: boolean;
  curvePoints: Array<{ volume: number; ph: number }>;
} {
  const { acidConc, acidVolCm3, baseConc, pKa, currentBaseVolCm3 } = params;
  const Ka = Math.pow(10, -pKa);
  const Kw = 1e-14;
  const equivalenceVolCm3 = (acidConc * acidVolCm3) / baseConc;

  const computePhAtVol = (vb: number): number => {
    const totalVol = acidVolCm3 + vb;
    if (vb <= 0.001) {
      // Initial weak acid: [H+] = sqrt(Ka * Ca)
      const h = Math.sqrt(Ka * acidConc);
      return -Math.log10(h);
    }
    if (Math.abs(vb - equivalenceVolCm3) < 0.15) {
      // Equivalence point: salt hydrolysis [OH-] = sqrt((Kw/Ka) * C_salt)
      const cSalt = (acidConc * acidVolCm3) / totalVol;
      const oh = Math.sqrt((Kw / Ka) * cSalt);
      const pOH = -Math.log10(oh);
      return 14 - pOH;
    }
    if (vb < equivalenceVolCm3) {
      // Buffer region: Henderson-Hasselbalch pH = pKa + log10([A-]/[HA])
      const ratio = vb / (equivalenceVolCm3 - vb);
      const clampedRatio = Math.max(0.005, Math.min(200, ratio));
      return pKa + Math.log10(clampedRatio);
    }
    // Excess strong base after equivalence
    const excessMolesOh = ((vb - equivalenceVolCm3) * baseConc) / 1000;
    const ohConc = excessMolesOh / (totalVol / 1000);
    const pOH = -Math.log10(Math.max(1e-7, ohConc));
    return Math.min(13.8, 14 - pOH);
  };

  const currentPh = Number(computePhAtVol(currentBaseVolCm3).toFixed(2));
  const equivalencePh = Number(computePhAtVol(equivalenceVolCm3).toFixed(2));
  const bufferRegionActive =
    currentBaseVolCm3 >= equivalenceVolCm3 * 0.15 &&
    currentBaseVolCm3 <= equivalenceVolCm3 * 0.85;

  const curvePoints: Array<{ volume: number; ph: number }> = [];
  for (let v = 0; v <= 50; v += 1) {
    curvePoints.push({
      volume: v,
      ph: Number(computePhAtVol(v).toFixed(2)),
    });
  }

  return {
    equivalenceVolCm3: Number(equivalenceVolCm3.toFixed(1)),
    currentPh,
    halfEquivalencePh: Number(pKa.toFixed(2)),
    equivalencePh,
    bufferRegionActive,
    curvePoints,
  };
}

/**
 * Calculates Sri Lankan G.C.E. A/L Physical Science Z-Score based on standard subject distributions
 * Formula: Z = (z1 + z2 + z3) / 3 where z_i = (mark_i - mean_i) / sd_i
 */
export function calculateSriLankaALZScore(marks: {
  combinedMaths: number;
  physics: number;
  thirdSubject: number;
  thirdSubjectType: 'chemistry' | 'ict';
}): {
  zScore: number;
  zMaths: number;
  zPhysics: number;
  zThird: number;
  islandRankEstimate: string;
  eligibleFaculties: Array<{ university: string; course: string; cutoff: number; eligible: boolean }>;
} {
  // Authentic G.C.E. A/L national distribution parameters (Mean & SD)
  const dist = {
    combinedMaths: { mean: 43.5, sd: 18.2 },
    physics: { mean: 45.0, sd: 16.8 },
    chemistry: { mean: 46.2, sd: 17.4 },
    ict: { mean: 48.0, sd: 16.5 },
  };

  const zMaths = (marks.combinedMaths - dist.combinedMaths.mean) / dist.combinedMaths.sd;
  const zPhysics = (marks.physics - dist.physics.mean) / dist.physics.sd;
  const thirdDist = dist[marks.thirdSubjectType];
  const zThird = (marks.thirdSubject - thirdDist.mean) / thirdDist.sd;

  const zScore = Number(((zMaths + zPhysics + zThird) / 3).toFixed(4));

  let islandRankEstimate = 'Outside Top 5,000';
  if (zScore >= 2.45) islandRankEstimate = 'Top 50 Island Rank (National Merit)';
  else if (zScore >= 2.15) islandRankEstimate = 'Top 350 Island Rank';
  else if (zScore >= 1.85) islandRankEstimate = 'Top 1,100 Island Rank';
  else if (zScore >= 1.50) islandRankEstimate = 'Top 2,400 Island Rank';
  else if (zScore >= 1.15) islandRankEstimate = 'Top 4,500 Island Rank';

  const cutoffs = [
    { university: 'University of Moratuwa', course: 'B.Sc. Engineering (Hons)', cutoff: 2.0845 },
    { university: 'University of Peradeniya', course: 'B.Sc. Engineering (Hons)', cutoff: 1.8412 },
    { university: 'University of Colombo (UCSC)', course: 'B.Sc. (Hons) Computer Science', cutoff: 1.7650 },
    { university: 'University of Moratuwa', course: 'B.Sc. (Hons) Information Technology', cutoff: 1.6820 },
    { university: 'University of Ruhuna', course: 'B.Sc. Engineering (Hons)', cutoff: 1.5940 },
    { university: 'University of Colombo', course: 'B.Sc. Physical Science', cutoff: 1.3850 },
    { university: 'University of Sri Jayewardenepura', course: 'B.Sc. Physical Science', cutoff: 1.2410 },
  ];

  return {
    zScore,
    zMaths: Number(zMaths.toFixed(3)),
    zPhysics: Number(zPhysics.toFixed(3)),
    zThird: Number(zThird.toFixed(3)),
    islandRankEstimate,
    eligibleFaculties: cutoffs.map((c) => ({
      ...c,
      eligible: zScore >= c.cutoff,
    })),
  };
}
