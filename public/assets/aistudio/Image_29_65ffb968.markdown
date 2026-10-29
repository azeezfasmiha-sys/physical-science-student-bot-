---
name: Physical Science A/L System
colors:
  surface: '#0d1322'
  surface-dim: '#0d1322'
  surface-bright: '#33394a'
  surface-container-lowest: '#080e1d'
  surface-container-low: '#151b2b'
  surface-container: '#191f2f'
  surface-container-high: '#242a3a'
  surface-container-highest: '#2f3445'
  on-surface: '#dde2f8'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dde2f8'
  inverse-on-surface: '#2a3040'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0d1322'
  on-background: '#dde2f8'
  surface-variant: '#2f3445'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-formula-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  code-formula-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system is tailored for Sri Lankan G.C.E. Advanced Level Physical Science candidates tackling Combined Mathematics, Physics, Chemistry, and ICT. It balances academic rigor with high-performance computational aesthetics. The visual narrative combines the surgical precision of developer terminals and scientific laboratory instruments with a focused, deep midnight slate canvas.

The aesthetic fuses modern dark-mode ergonomics with crisp technical precision:
- **Tone:** Methodical, focused, intellectually serious, empowering.
- **Visual Style:** Minimalist engineering console meets high-contrast academic dashboard. It avoids frivolous ornamentation in favor of fine structural borders (1px hairline slate dividers), technical monospaced telemetry for formulas and marks, and precise, functional color cues for each core discipline.
- **Emotional Intent:** Reduces cognitive friction and eye fatigue during multi-hour study marathons, cultivating clarity, disciplined mastery, and confidence under exam pressure.

## Colors
The palette is built around an ink-black midnight foundation engineered for high-contrast legibility, sustained nocturnal focus, and instant subject recognition:

- **Foundation & Neutrals:**
  - `Canvas / Background`: `#0B1120` (Deep Midnight Slate)
  - `Surface Tier 1 (Card/Container)`: `#111C33`
  - `Surface Tier 2 (Elevated Panels/Flyouts)`: `#1E293B`
  - `Border / Hairline Dividers`: `#334155` (Subtle Slate Outline)
  - `Text High-Contrast`: `#F8FAFC`
  - `Text Muted / Metadata`: `#94A3B8`

- **Functional Discipline & System Accents:**
  - `Primary / Academic Cobalt`: `#2563EB` (Primary CTAs, Combined Mathematics, active session states)
  - `Secondary / Luminous Cyan`: `#06B6D4` (Physics, ICT, operational telemetry, step vectors)
  - `Tertiary / Emerald`: `#10B981` (Chemistry balances, mastery completion, correct answer markers)
  - `Alert / Amber`: `#F59E0B` (Formula warnings, revision queues, dimensional analysis errors)
  - `Error / Crimson`: `#EF4444` (Incorrect derivation steps, critical time alerts)

Colors serve semantic clarity: discipline-specific chips and syntax boundaries never overwhelm the UI; they anchor specific scientific workflows and mastery tiers.

## Typography
Typography is organized around a dual-engine architecture:
1. **Inter:** Handles structural headlines, theoretical narratives, essay solutions, and primary navigation with neutral, high-density legibility.
2. **JetBrains Mono:** Handles LaTeX equations, chemical reactions, SI units, scalar/vector tags, question numbering, and mastery metrics. Its tabular figures and distinct glyph disambiguation (e.g., `0` vs `O`, `1` vs `l`) prevent misinterpretations in complex physics and mathematics proofs.

Formulas larger than inline text render in dedicated `code-formula-lg` blocks with subtle background shading and horizontal scroll boundaries to avoid line breaks in multi-step integration or organic chemistry synthesis chains.

## Layout & Spacing
The layout follows a modular 12-column grid on desktop and a continuous 4-column flow on mobile, structured for side-by-side problem-solving and telemetry observation:

- **Desktop (1280px+):** 12-column layout with 2rem page margins and 1.25rem gutters. Typical split: 8 columns dedicated to the primary paper / LaTeX derivation canvas, 4 columns dedicated to real-time unit breakdowns, formula sheets, timer, and syllabus tracking.
- **Tablet (768px - 1279px):** 8-column layout with 1.5rem margins. Collapsible secondary inspection drawers for formula lookups.
- **Mobile (<768px):** 4-column layout with 1rem margins. Persistent bottom sheet or segmented control to toggle between problem statements and scratchpad calculations.
- **Rhythm:** Spacing follows a strict 4px/8px micro-grid. Component padding scales cleanly (`space-sm` for inline equation chips, `space-md` for standard problem list items, `space-lg` for structural question partitions).

## Elevation & Depth
Visual hierarchy is conveyed using tonal surface layering and precise hairline borders, avoiding heavy dropped shadows:

- **Tonal Tiers:**
  - `Base`: `#0B1120` (Canvas)
  - `Level 1`: `#111C33` (Study cards, problem panes, code containers)
  - `Level 2`: `#1E293B` (Flyout calculation panels, active formula modulators, tooltips)
- **Low-Contrast Technical Outlines:**
  - Surfaces utilize a 1px solid border (`#334155`). Under hover or active calculation focus, the border transitions to subject-specific tokens (e.g., `#2563EB` for Maths, `#06B6D4` for Physics).
- **Subtle Glow Elevation:**
  - Ambient shadows are reserved for floating diagnostic drawers or modal steps: `0 8px 32px -4px rgba(2, 6, 23, 0.7)`, layered with an ultra-soft subject hue rim (e.g., cyan tint `rgba(6, 182, 212, 0.08)` for active Physics simulations).

## Shapes
This system uses a disciplined **Soft (`1`)** shape language to reinforce the engineering console feel:
- **Base Components (Inputs, Buttons, Badges):** `0.25rem` (4px). Clean, sharp, highly defined edges that conserve screen real estate.
- **Medium Panels & Cards (`rounded-lg`):** `0.5rem` (8px). Delivers subtle corner easing without appearing consumer-playful.
- **Major Overlays (`rounded-xl`):** `0.75rem` (12px). Applied strictly to major modal dialogs and equation inspection sheets.
- **Data Points & Status Dots:** Fully circular badges (`9999px`) are reserved solely for syllabus completion tags, progress rings, and timer indicators.

## Components

### Buttons
- **Primary:** Background `#2563EB`, text `#FFFFFF`, border none, font `JetBrains Mono` 13px weight 500. Hover: `#1D4ED8`. Active: `#1E40AF`.
- **Secondary / Outline:** Background `transparent`, border `1px solid #334155`, text `#F8FAFC`. Hover: background `#1E293B`, border `#64748B`.
- **Subject-Specific Action:** Bordered pill with dynamic glow (`#06B6D4` for Physics calculations, `#10B981` for Chemistry reaction verification).

### Formula & Derivation Cards
- Background `#111C33` with 1px `#334155` border.
- Header contains question index in `label-sm` with subject tag.
- Core derivation section rendered in `code-formula-md` with dedicated copy LaTeX / inspect SI units triggers.
- Step-by-step indicator bar on the left edge (2px solid line changing from `#334155` to `#06B6D4` on active step).

### Chips & Badges
- Discipline and taxonomy chips use low-opacity tinted fills with crisp monospaced text:
  - *Combined Maths:* `rgba(37, 99, 235, 0.12)` fill, `#60A5FA` text, `rgba(37, 99, 235, 0.3)` border.
  - *Physics:* `rgba(6, 182, 212, 0.12)` fill, `#22D3EE` text, `rgba(6, 182, 212, 0.3)` border.
  - *Chemistry:* `rgba(16, 185, 129, 0.12)` fill, `#34D399` text, `rgba(16, 185, 129, 0.3)` border.
  - *ICT:* `rgba(168, 85, 247, 0.12)` fill, `#C084FC` text, `rgba(168, 85, 247, 0.3)` border.

### Input Fields & Calculation Boxes
- Background `#0B1120`, border `1px solid #334155`, text `#F8FAFC`.
- Focus state: border `1px solid #2563EB`, box-shadow `0 0 0 1px #2563EB`.
- Includes trailing unit markers in `label-sm` (e.g., `m·p�n�X[�0��x�n�����X
H���Y[��MLЎ�������X�؛�\�	��Y[��[X�ܜH�Y�YM���\��]�L�\�[X�Y]\˂�H[�X�]�N�\�ܙ\���MM�X�X��ܛ�[��[��\�[���H�[X�Y��X��ܛ�[�̍M��P��ܙ\�̍M��P��X��X\��X�ۈ[�Y�X�۝�\��]K�������X�X[^�YX\�\�H	���ܙ\���X��\�H�Y�Y[�Y[�X\�ZXܛ�X�\���\�\�[�[��K��[X�\��X�][�]�
K�ˋ��][ۘ[[�[ۋܙ�[�X�YX�[�\�\�K��HX\�\�Y������[[���Y�L�NX�[�\��ܙ\��������[�\�[�������]�Y]�YYH��������H�\��[��\�وэNQL���H�^YX�[\���[�\��[��]��Z[��[ۛ�\�^Z[��X��\�X�H\��[�Y�\�[��YY\��[�[\�Y�Z[��\�[��[���[��X\���