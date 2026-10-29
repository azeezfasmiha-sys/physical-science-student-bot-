import { DisciplineId, DimensionalVector } from '../utils/physicsMath';

export interface DerivationStep {
  id: string;
  stepNumber: number;
  title: string;
  formulaLatex: string;
  explanation: string;
  siUnit: string;
  dimensions: DimensionalVector;
  marks: number;
}

export interface PastPaperQuestion {
  id: string;
  questionCode: string;
  year: number;
  paperType: 'Part I · MCQ' | 'Part II · Structured Essay' | 'Part II · Essay';
  discipline: DisciplineId;
  disciplineLabel: string;
  syllabusUnit: string;
  title: string;
  problemStatement: string;
  givenParameters: Array<{ symbol: string; value: string; unit: string }>;
  totalMarks: number;
  recommendedMinutes: number;
  steps: DerivationStep[];
  calculationPrompt: string;
  targetNumericalValue: number;
  tolerance: number;
  targetUnit: string;
  targetDimensions: DimensionalVector;
}

export interface FormulaReference {
  id: string;
  discipline: DisciplineId;
  disciplineLabel: string;
  topic: string;
  name: string;
  expression: string;
  siUnit: string;
  dimensions: DimensionalVector;
  notes: string;
}

export interface SyllabusUnitItem {
  id: string;
  code: string;
  discipline: DisciplineId;
  disciplineLabel: string;
  title: string;
  recommendedPeriods: number;
  weightPercentage: number;
  keyTopics: string[];
  defaultStatus: 'mastered' | 'in-progress' | 'revision';
}

export interface RevisionCardItem {
  id: string;
  discipline: DisciplineId;
  disciplineLabel: string;
  questionRef: string;
  title: string;
  formulaOrTrap: string;
  correctResolution: string;
  severity: 'amber' | 'crimson';
  mastered: boolean;
}

export const DISCIPLINE_META: Record<
  DisciplineId,
  {
    label: string;
    shortLabel: string;
    accentHex: string;
    chipFill: string;
    chipText: string;
    chipBorder: string;
  }
> = {
  'combined-maths': {
    label: 'Combined Maths',
    shortLabel: 'MATHS',
    accentHex: '#2563EB',
    chipFill: 'rgba(37, 99, 235, 0.12)',
    chipText: '#60A5FA',
    chipBorder: 'rgba(37, 99, 235, 0.3)',
  },
  physics: {
    label: 'Physics',
    shortLabel: 'PHYS',
    accentHex: '#06B6D4',
    chipFill: 'rgba(6, 182, 212, 0.12)',
    chipText: '#22D3EE',
    chipBorder: 'rgba(6, 182, 212, 0.3)',
  },
  chemistry: {
    label: 'Chemistry',
    shortLabel: 'CHEM',
    accentHex: '#10B981',
    chipFill: 'rgba(16, 185, 129, 0.12)',
    chipText: '#34D399',
    chipBorder: 'rgba(16, 185, 129, 0.3)',
  },
  ict: {
    label: 'ICT',
    shortLabel: 'ICT',
    accentHex: '#A855F7',
    chipFill: 'rgba(168, 85, 247, 0.12)',
    chipText: '#C084FC',
    chipBorder: 'rgba(168, 85, 247, 0.3)',
  },
};

export const PAST_PAPER_QUESTIONS: PastPaperQuestion[] = [
  {
    id: 'cm-2024-p2-q4',
    questionCode: 'Q.04 (b) · 2024 A/L',
    year: 2024,
    paperType: 'Part II · Essay',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    syllabusUnit: 'Applied Maths · Unit 05: Oblique Projectile & Restitution',
    title: 'Oblique Impact of a Particle on a Smooth Horizontal Plane',
    problemStatement:
      'A particle P of mass m is projected from a point O on a smooth horizontal plane with initial speed u = 28 m·s⁻¹ at an angle of elevation α = 30° to the horizontal. Given the coefficient of restitution between P and the plane is e = 0.75 and g = 9.8 m·s⁻², derive the horizontal range of the first trajectory and compute the vertical velocity component immediately after the first rebound.',
    givenParameters: [
      { symbol: 'u', value: '28.0', unit: 'm·s⁻¹' },
      { symbol: 'α', value: '30°', unit: 'deg' },
      { symbol: 'e', value: '0.75', unit: 'dimensionless' },
      { symbol: 'g', value: '9.80', unit: 'm·s⁻²' },
    ],
    totalMarks: 150,
    recommendedMinutes: 30,
    steps: [
      {
        id: 'cm-s1',
        stepNumber: 1,
        title: 'Resolve initial velocity vector into orthogonal components',
        formulaLatex: 'u_x = u cos(α) = 28 · (√3 / 2) = 14√3 m·s⁻¹  |  u_y = u sin(α) = 28 · (1/2) = 14.0 m·s⁻¹',
        explanation: 'Decompose initial launch velocity along horizontal (invariant under smooth contact) and vertical axes.',
        siUnit: 'm·s⁻¹',
        dimensions: { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
        marks: 30,
      },
      {
        id: 'cm-s2',
        stepNumber: 2,
        title: 'Determine time of flight T₁ to first impact point A',
        formulaLatex: 's_y = 0 ⇒ u_y T₁ - ½ g T₁² = 0  ⇒  T₁ = (2 u sin α) / g = (2 × 14.0) / 9.80 = 2.857 s',
        explanation: 'Apply vertical kinematics from O to first impact A where vertical displacement returns to zero.',
        siUnit: 's',
        dimensions: { M: 0, L: 0, T: 1, I: 0, Theta: 0, N: 0 },
        marks: 40,
      },
      {
        id: 'cm-s3',
        stepNumber: 3,
        title: 'Apply Newton’s Experimental Law of Restitution along the normal',
        formulaLatex: 'v_{y,1} = e · u_y = 0.75 × 28 sin(30°) = 0.75 × 14.0 = 10.50 m·s⁻¹',
        explanation: 'Normal component reverses direction with magnitude scaled by restitution coefficient e = 0.75.',
        siUnit: 'm·s⁻¹',
        dimensions: { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
        marks: 45,
      },
      {
        id: 'cm-s4',
        stepNumber: 4,
        title: 'Evaluate total impulse J exerted by the horizontal plane at A',
        formulaLatex: 'J = m(v_{y,1} - (-u_y)) = m u sin(α) (1 + e) = 14.0 × 1.75 m = 24.5 m N·s',
        explanation: 'Impulse-momentum principle normal to the smooth horizontal plane.',
        siUnit: 'N·s',
        dimensions: { M: 1, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
        marks: 35,
      },
    ],
    calculationPrompt: 'Enter the upward vertical speed v_{y,1} immediately after the first rebound at A:',
    targetNumericalValue: 10.5,
    tolerance: 0.05,
    targetUnit: 'm·s⁻¹',
    targetDimensions: { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
  },
  {
    id: 'phy-2024-p2-q2',
    questionCode: 'Q.02 (c) · 2024 A/L',
    year: 2024,
    paperType: 'Part II · Structured Essay',
    discipline: 'physics',
    disciplineLabel: 'Physics',
    syllabusUnit: 'Unit 03: Oscillations & Waves · Standing Waves in Pipes',
    title: 'End-Correction & Fundamental Resonance in a Closed Cylindrical Tube',
    problemStatement:
      'A tuning fork of frequency f = 512 Hz produces fundamental resonance in a vertical glass tube closed at the lower end by a water column when the air column length is l₁ = 16.0 cm. The next resonance is observed at l₂ = 49.6 cm. Calculate the speed of sound v in air at laboratory temperature.',
    givenParameters: [
      { symbol: 'f', value: '512', unit: 'Hz (s⁻¹)' },
      { symbol: 'l₁', value: '0.160', unit: 'm' },
      { symbol: 'l₂', value: '0.496', unit: 'm' },
    ],
    totalMarks: 100,
    recommendedMinutes: 20,
    steps: [
      {
        id: 'phy-s1',
        stepNumber: 1,
        title: 'Formulate standing wave boundary equations with end-correction e',
        formulaLatex: 'l₁ + e = λ / 4   (Fundamental Mode)   and   l₂ + e = 3λ / 4   (First Overtone)',
        explanation: 'Account for antinode displacement distance e above the open rim of the resonance tube.',
        siUnit: 'm',
        dimensions: { M: 0, L: 1, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 25,
      },
      {
        id: 'phy-s2',
        stepNumber: 2,
        title: 'Eliminate end-correction e to isolate acoustic wavelength λ',
        formulaLatex: 'l₂ - l₁ = λ / 2  ⇒  λ = 2(l₂ - l₁) = 2(0.496 - 0.160) = 0.672 m',
        explanation: 'Subtracting the two resonance conditions removes systematic end-correction error.',
        siUnit: 'm',
        dimensions: { M: 0, L: 1, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 35,
      },
      {
        id: 'phy-s3',
        stepNumber: 3,
        title: 'Compute phase velocity v of longitudinal acoustic wave',
        formulaLatex: 'v = f · λ = 512 s⁻¹ × 0.672 m = 344.064 m·s⁻¹ ≈ 344.1 m·s⁻¹',
        explanation: 'Multiply source tuning fork frequency by derived acoustic wavelength in SI units.',
        siUnit: 'm·s⁻¹',
        dimensions: { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
        marks: 40,
      },
    ],
    calculationPrompt: 'Enter the calculated speed of sound v in air (to 1 decimal place):',
    targetNumericalValue: 344.1,
    tolerance: 0.2,
    targetUnit: 'm·s⁻¹',
    targetDimensions: { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
  },
  {
    id: 'chem-2024-p2-q7',
    questionCode: 'Q.07 (a) · 2024 A/L',
    year: 2024,
    paperType: 'Part II · Essay',
    discipline: 'chemistry',
    disciplineLabel: 'Chemistry',
    syllabusUnit: 'Unit 12: Chemical Equilibrium · Ionic & Buffer Systems',
    title: 'Buffer Capacity & pH Shift of Ethanoic Acid / Sodium Ethanoate System',
    problemStatement:
      'An aqueous buffer solution of volume 500 cm³ contains 0.15 mol·dm⁻³ CH₃COOH (Kₐ = 1.80 × 10⁻⁵ mol·dm⁻³) and 0.15 mol·dm⁻³ CH₃COONa at 298 K. Given -log₁₀(1.80 × 10⁻⁵) = 4.74, determine the pH of the buffer after adding 0.015 mol of solid NaOH (assuming negligible volume change).',
    givenParameters: [
      { symbol: '[CH₃COOH]₀', value: '0.150', unit: 'mol·dm⁻³' },
      { symbol: '[CH₃COO⁻]₀', value: '0.150', unit: 'mol·dm⁻³' },
      { symbol: 'pKₐ', value: '4.74', unit: 'dimensionless' },
      { symbol: 'n(NaOH)', value: '0.015', unit: 'mol' },
    ],
    totalMarks: 150,
    recommendedMinutes: 25,
    steps: [
      {
        id: 'chem-s1',
        stepNumber: 1,
        title: 'Compute initial molar quantities in V = 0.500 dm³ buffer solution',
        formulaLatex: 'n₀(CH₃COOH) = 0.150 × 0.500 = 0.075 mol  |  n₀(CH₃COO⁻) = 0.150 × 0.500 = 0.075 mol',
        explanation: 'Convert molarity (mol·dm⁻³) to absolute moles prior to stoichiometric neutralization.',
        siUnit: 'mol',
        dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 1 },
        marks: 40,
      },
      {
        id: 'chem-s2',
        stepNumber: 2,
        title: 'Apply stoichiometric neutralization by OH⁻ addition',
        formulaLatex: 'CH₃COOH(aq) + OH⁻(aq) → CH₃COO⁻(aq) + H₂O(l)  ⇒  n_f(HA) = 0.060 mol, n_f(A⁻) = 0.090 mol',
        explanation: '0.015 mol of OH⁻ quantitatively converts 0.015 mol of weak acid into its conjugate base.',
        siUnit: 'mol·dm⁻³',
        dimensions: { M: 0, L: -3, T: 0, I: 0, Theta: 0, N: 1 },
        marks: 55,
      },
      {
        id: 'chem-s3',
        stepNumber: 3,
        title: 'Evaluate final pH via Henderson–Hasselbalch logarithmic relation',
        formulaLatex: 'pH = pKₐ + log₁₀([CH₃COO⁻] / [CH₃COOH]) = 4.74 + log₁₀(0.090 / 0.060) = 4.74 + 0.18 = 4.92',
        explanation: 'Since log₁₀(1.5) = 0.176 ≈ 0.18, the buffer resists dramatic pH change.',
        siUnit: 'pH',
        dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 55,
      },
    ],
    calculationPrompt: 'Enter the final pH of the buffer solution after NaOH addition:',
    targetNumericalValue: 4.92,
    tolerance: 0.02,
    targetUnit: 'pH',
    targetDimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
  },
  {
    id: 'cm-2023-p1-q9',
    questionCode: 'Q.09 (a) · 2023 A/L',
    year: 2023,
    paperType: 'Part II · Essay',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    syllabusUnit: 'Pure Maths · Unit 08: Definite Integration & Reduction Formulas',
    title: 'Definite Integral Evaluation via Integration by Parts',
    problemStatement:
      'Let I = ∫₀^(π/2) x · cos(x) dx. Using integration by parts ∫ u dv = u v - ∫ v du, evaluate the exact numerical value of I to 3 decimal places (taking π = 3.1416).',
    givenParameters: [
      { symbol: 'u', value: 'x', unit: 'rad' },
      { symbol: 'dv', value: 'cos(x) dx', unit: 'rad' },
      { symbol: 'Bounds', value: '[0, π/2]', unit: 'rad' },
    ],
    totalMarks: 100,
    recommendedMinutes: 18,
    steps: [
      {
        id: 'cm2-s1',
        stepNumber: 1,
        title: 'Assign differentiable factor u and integrable differential dv',
        formulaLatex: 'u = x  ⇒  du = dx   and   dv = cos(x) dx  ⇒  v = sin(x)',
        explanation: 'Apply LIATE priority rule: algebraic term x precedes trigonometric term cos(x).',
        siUnit: 'rad',
        dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 30,
      },
      {
        id: 'cm2-s2',
        stepNumber: 2,
        title: 'Expand integration by parts expression with limits [0, π/2]',
        formulaLatex: 'I = [ x · sin(x) ]₀^(π/2) - ∫₀^(π/2) sin(x) dx = (π/2)(1) - 0 + [ cos(x) ]₀^(π/2)',
        explanation: 'Evaluate boundary term at upper limit π/2 and integrate remaining sin(x) term.',
        siUnit: 'rad',
        dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 40,
      },
      {
        id: 'cm2-s3',
        stepNumber: 3,
        title: 'Compute exact closed form and decimal approximation',
        formulaLatex: 'I = (π / 2) + (cos(π/2) - cos(0)) = (π / 2) - 1 ≈ 1.5708 - 1 = 0.571',
        explanation: 'Substitute cos(π/2) = 0 and cos(0) = 1 to obtain (π - 2)/2.',
        siUnit: 'dimensionless',
        dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 30,
      },
    ],
    calculationPrompt: 'Enter the numerical value of I = (π/2) - 1 (to 3 decimal places):',
    targetNumericalValue: 0.571,
    tolerance: 0.005,
    targetUnit: 'rad',
    targetDimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
  },
  {
    id: 'ict-2024-p2-q3',
    questionCode: 'Q.03 (b) · 2024 A/L',
    year: 2024,
    paperType: 'Part II · Structured Essay',
    discipline: 'ict',
    disciplineLabel: 'ICT',
    syllabusUnit: 'Unit 04: Digital Logic Gates & Karnaugh Map Minimization',
    title: 'IPv4 Subnet Masking & Usable Host Address Allocation',
    problemStatement:
      'A university laboratory network is assigned the CIDR block 192.168.14.0/26. Determine the total number of usable IPv4 host addresses per subnet after reserving the Network ID and Broadcast address.',
    givenParameters: [
      { symbol: 'Prefix', value: '/26', unit: 'bits' },
      { symbol: 'IPv4 Length', value: '32', unit: 'bits' },
      { symbol: 'Reserved', value: '2', unit: 'addresses' },
    ],
    totalMarks: 100,
    recommendedMinutes: 15,
    steps: [
      {
        id: 'ict-s1',
        stepNumber: 1,
        title: 'Calculate remaining host identifier bits h',
        formulaLatex: 'h = 32 - n = 32 - 26 = 6 host bits  (Subnet Mask: 255.255.255.192)',
        explanation: 'Subtract network prefix length (/26) from total 32-bit IPv4 address space.',
        siUnit: 'bits',
        dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 40,
      },
      {
        id: 'ict-s2',
        stepNumber: 2,
        title: 'Evaluate usable hosts formula 2^h - 2',
        formulaLatex: 'N_{usable} = 2⁶ - 2 = 64 - 2 = 62 hosts',
        explanation: 'Exclude all-zeros (Network ID: .0) and all-ones (Broadcast: .63) host bit patterns.',
        siUnit: 'hosts',
        dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
        marks: 60,
      },
    ],
    calculationPrompt: 'Enter the number of usable host IPv4 addresses in a /26 subnet:',
    targetNumericalValue: 62,
    tolerance: 0,
    targetUnit: 'hosts',
    targetDimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
  },
];

export const FORMULA_REFERENCES: FormulaReference[] = [
  {
    id: 'f-cm-1',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    topic: 'Oblique Impact & Restitution',
    name: 'Newton’s Law of Restitution',
    expression: 'v₂ - v₁ = -e (u₂ - u₁)',
    siUnit: 'm·s⁻¹',
    dimensions: { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
    notes: 'Applied strictly along the common normal of colliding smooth spheres or planes.',
  },
  {
    id: 'f-cm-2',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    topic: 'Rotational Dynamics',
    name: 'Parallel Axes Theorem',
    expression: 'I = I_G + M d²',
    siUnit: 'kg·m²',
    dimensions: { M: 1, L: 2, T: 0, I: 0, Theta: 0, N: 0 },
    notes: 'I_G must pass through the center of mass G parallel to the target axis.',
  },
  {
    id: 'f-phy-1',
    discipline: 'physics',
    disciplineLabel: 'Physics',
    topic: 'Gravitational & Electrostatic Fields',
    name: 'Escape Velocity from Planetary Surface',
    expression: 'v_e = √(2 G M / R) = √(2 g R)',
    siUnit: 'm·s⁻¹',
    dimensions: { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 },
    notes: 'Independent of test particle mass m; derived by setting total mechanical energy E = 0.',
  },
  {
    id: 'f-phy-2',
    discipline: 'physics',
    disciplineLabel: 'Physics',
    topic: 'Fluid Dynamics & Viscosity',
    name: 'Poiseuille’s Laminar Flow Equation',
    expression: 'Q = (V / t) = (π ΔP r⁴) / (8 η L)',
    siUnit: 'm³·s⁻¹',
    dimensions: { M: 0, L: 3, T: -1, I: 0, Theta: 0, N: 0 },
    notes: 'Dynamic viscosity η has SI unit Pa·s (kg·m⁻¹·s⁻¹) and dimensions [M][L]⁻¹[T]⁻¹.',
  },
  {
    id: 'f-chem-1',
    discipline: 'chemistry',
    disciplineLabel: 'Chemistry',
    topic: 'Electrochemistry',
    name: 'Nernst Equation at 298 K',
    expression: 'E_cell = E°_cell - (0.0592 / n) log₁₀(Q)',
    siUnit: 'V (J·C⁻¹)',
    dimensions: { M: 1, L: 2, T: -3, I: -1, Theta: 0, N: 0 },
    notes: 'n is moles of electrons transferred in the balanced half-cell redox equation.',
  },
  {
    id: 'f-chem-2',
    discipline: 'chemistry',
    disciplineLabel: 'Chemistry',
    topic: 'Chemical Energetics',
    name: 'Gibbs Free Energy & Equilibrium Constant',
    expression: 'ΔG° = ΔH° - TΔS° = -R T ln(K_p)',
    siUnit: 'J·mol⁻¹',
    dimensions: { M: 1, L: 2, T: -2, I: 0, Theta: 0, N: -1 },
    notes: 'Always convert ΔH° from kJ·mol⁻¹ to J·mol⁻¹ before adding to -TΔS°.',
  },
  {
    id: 'f-ict-1',
    discipline: 'ict',
    disciplineLabel: 'ICT',
    topic: 'Boolean Algebra',
    name: 'De Morgan’s Dual Theorems',
    expression: '(A · B)′ = A′ + B′   |   (A + B)′ = A′ · B′',
    siUnit: 'Boolean',
    dimensions: { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 },
    notes: 'Essential for converting SOP expressions to all-NAND hardware gate implementations.',
  },
];

export const INITIAL_SYLLABUS_UNITS: SyllabusUnitItem[] = [
  {
    id: 'syl-cm-1',
    code: 'CM.PURE.04',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    title: 'Differential & Integral Calculus (Limits, Taylor, Reduction)',
    recommendedPeriods: 75,
    weightPercentage: 22,
    keyTopics: ['First Principles', 'Integration by Parts', 'Definite Integrals'],
    defaultStatus: 'mastered',
  },
  {
    id: 'syl-cm-2',
    code: 'CM.APPL.05',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    title: 'Projectiles, Impulse, Collisions & Simple Harmonic Motion',
    recommendedPeriods: 68,
    weightPercentage: 20,
    keyTopics: ['Oblique Impact', 'Newton’s Restitution', 'SHM Phase Circle'],
    defaultStatus: 'in-progress',
  },
  {
    id: 'syl-cm-3',
    code: 'CM.APPL.08',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    title: 'Statics of Rigid Bodies, Frameworks & Jointed Rods',
    recommendedPeriods: 52,
    weightPercentage: 15,
    keyTopics: ['Bow’s Notation', 'Virtual Work', 'Frictional Equilibrium'],
    defaultStatus: 'revision',
  },
  {
    id: 'syl-phy-1',
    code: 'PHY.U02',
    discipline: 'physics',
    disciplineLabel: 'Physics',
    title: 'Mechanics (Rotational Dynamics, Hydrostatics & Bernoulli)',
    recommendedPeriods: 110,
    weightPercentage: 20,
    keyTopics: ['Moment of Inertia', 'Bernoulli’s Principle', 'Surface Tension'],
    defaultStatus: 'mastered',
  },
  {
    id: 'syl-phy-2',
    code: 'PHY.U03',
    discipline: 'physics',
    disciplineLabel: 'Physics',
    title: 'Oscillations & Waves (Doppler, Resonance, Physical Optics)',
    recommendedPeriods: 100,
    weightPercentage: 18,
    keyTopics: ['Closed/Open Pipes', 'Doppler Effect', 'Spectrometer Adjustments'],
    defaultStatus: 'in-progress',
  },
  {
    id: 'syl-phy-3',
    code: 'PHY.U08',
    discipline: 'physics',
    disciplineLabel: 'Physics',
    title: 'Current Electricity (Kirchhoff, Potentiometer, Wheatstone Bridge)',
    recommendedPeriods: 70,
    weightPercentage: 14,
    keyTopics: ['Internal Resistance', 'Potentiometer Calibration', 'Meter Bridge'],
    defaultStatus: 'revision',
  },
  {
    id: 'syl-chem-1',
    code: 'CHEM.U11',
    discipline: 'chemistry',
    disciplineLabel: 'Chemistry',
    title: 'Chemical Kinetics & Rate Laws (Arrhenius & Reaction Mechanisms)',
    recommendedPeriods: 48,
    weightPercentage: 12,
    keyTopics: ['Order of Reaction', 'Half-Life Derivation', 'Activation Energy'],
    defaultStatus: 'mastered',
  },
  {
    id: 'syl-chem-2',
    code: 'CHEM.U12',
    discipline: 'chemistry',
    disciplineLabel: 'Chemistry',
    title: 'Ionic Equilibrium (K_a, K_w, Buffer Solutions, K_sp & Titration)',
    recommendedPeriods: 64,
    weightPercentage: 18,
    keyTopics: ['Henderson-Hasselbalch', 'Common Ion Effect', 'Indicator Selection'],
    defaultStatus: 'in-progress',
  },
  {
    id: 'syl-ict-1',
    code: 'ICT.U04',
    discipline: 'ict',
    disciplineLabel: 'ICT',
    title: 'Digital Logic, Boolean Algebra & Computer Architecture',
    recommendedPeriods: 45,
    weightPercentage: 15,
    keyTopics: ['4-Variable K-Maps', 'NAND/NOR Universal Gates', 'Fetch-Execute Cycle'],
    defaultStatus: 'mastered',
  },
];

export const INITIAL_REVISION_CARDS: RevisionCardItem[] = [
  {
    id: 'rev-1',
    discipline: 'chemistry',
    disciplineLabel: 'Chemistry',
    questionRef: '2023 A/L · Part II Q.04',
    title: 'Gibbs Free Energy ΔG° Unit Mismatch Trap',
    formulaOrTrap: 'ΔG° = ΔH° - TΔS°  (Warning: ΔH° given in kJ·mol⁻¹ while ΔS° given in J·K⁻¹·mol⁻¹)',
    correctResolution: 'Multiply ΔH° by 10³ to convert to J·mol⁻¹ before subtracting TΔS°; otherwise TΔS° is scaled wrongly by 1000×.',
    severity: 'amber',
    mastered: false,
  },
  {
    id: 'rev-2',
    discipline: 'physics',
    disciplineLabel: 'Physics',
    questionRef: '2024 A/L · Part II Q.02',
    title: 'Poiseuille’s Law Diameter vs Radius Fourth-Power Error',
    formulaOrTrap: 'Q = (π ΔP r⁴) / (8 η L)  (Candidate substituted capillary diameter d instead of r = d/2)',
    correctResolution: 'Halving diameter d reduces volume flow rate Q by 2⁴ = 16 times. Always divide given diameter by 2 first.',
    severity: 'crimson',
    mastered: false,
  },
  {
    id: 'rev-3',
    discipline: 'combined-maths',
    disciplineLabel: 'Combined Maths',
    questionRef: '2022 A/L · Applied Q.12',
    title: 'Sign Convention in Newton’s Law of Restitution on Inclined Plane',
    formulaOrTrap: 'v_n = -e · u_n  (Ensure velocities are resolved strictly perpendicular and parallel to the inclined plane)',
    correctResolution: 'Only the component perpendicular to the plane scales by e; the component parallel to the smooth plane remains unchanged.',
    severity: 'amber',
    mastered: false,
  },
];
