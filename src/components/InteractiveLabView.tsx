import React, { useState } from 'react';
import { RotateCcw, Sliders, Activity, FlaskConical } from 'lucide-react';
import {
  calculateProjectileMetrics,
  calculateTitrationMetrics,
} from '../utils/physicsMath';

export const InteractiveLabView: React.FC = () => {
  const [labMode, setLabMode] = useState<'projectile' | 'titration'>('projectile');

  // Projectile & Restitution simulator state
  const [velocity, setVelocity] = useState<number>(28);
  const [angleDeg, setAngleDeg] = useState<number>(30);
  const [restitution, setRestitution] = useState<number>(0.75);
  const [gravity, setGravity] = useState<number>(9.8);

  // Chemistry Titration simulator state
  const [acidConc, setAcidConc] = useState<number>(0.1);
  const [baseConc, setBaseConc] = useState<number>(0.1);
  const [pKa, setPKa] = useState<number>(4.74);
  const [baseVolAdded, setBaseVolAdded] = useState<number>(12.5);

  const projMetrics = calculateProjectileMetrics({
    initialVelocity: velocity,
    launchAngleDeg: angleDeg,
    gravity,
    restitution,
  });

  const titrMetrics = calculateTitrationMetrics({
    acidConc,
    acidVolCm3: 25.0,
    baseConc,
    pKa,
    currentBaseVolCm3: baseVolAdded,
  });

  const totalRange = Math.max(
    10,
    projMetrics.horizontalRange + projMetrics.secondBounceRange
  );
  const maxPlotY = Math.max(15, projMetrics.maxHeight * 1.25);

  return (
    <div className="space-y-6">
      {/* Header & Simulation Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#334155]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F8FAFC]">
            Interactive Physical Science Practical Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Manipulate boundary conditions and inspect live trajectory vectors or ionic equilibrium curves.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111C33] p-1 rounded border border-[#334155]">
          <button
            type="button"
            onClick={() => setLabMode('projectile')}
            className={`px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              labMode === 'projectile'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Mechanics: Oblique Impact & Restitution
          </button>
          <button
            type="button"
            onClick={() => setLabMode('titration')}
            className={`px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              labMode === 'titration'
                ? 'bg-[#10B981] text-[#002113] font-semibold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Chemistry: Buffer & Titration Curve
          </button>
        </div>
      </div>

      {labMode === 'projectile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Columns: Interactive Trajectory SVG Stage */}
          <div className="lg:col-span-8 bg-[#111C33] border border-[#334155] rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#334155] pb-3">
              <div className="text-xs font-mono text-[#06B6D4]">
                STAGE · PARABOLIC TRAJECTORY WITH RESTITUTION REBOUND (e = {restitution})
              </div>
              <div className="text-xs font-mono text-[#94A3B8] tabular-nums">
                R₁ = {projMetrics.horizontalRange} m · R₂ = {projMetrics.secondBounceRange} m
              </div>
            </div>

            {/* Vector Plot Canvas */}
            <div className="bg-[#0B1120] border border-[#334155] rounded-md p-4">
              <svg
                viewBox="0 0 640 280"
                className="w-full h-64 overflow-visible"
                role="img"
                aria-label="Projectile trajectory plot showing first flight and restitution rebound"
              >
                {/* Coordinate grid lines */}
                {[0.25, 0.5, 0.75].map((frac) => (
                  <line
                    key={frac}
                    x1={45}
                    y1={240 - frac * 200}
                    x2={610}
                    y2={240 - frac * 200}
                    stroke="#1E293B"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}
                {/* Axes */}
                <line
                  x1={45}
                  y1={20}
                  x2={45}
                  y2={240}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <line
                  x1={45}
                  y1={240}
                  x2={615}
                  y2={240}
                  stroke="#475569"
                  strokeWidth="1.5"
                />

                {/* First bounce path */}
                <polyline
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                  points={projMetrics.trajectoryPoints
                    .filter((pt) => pt.bounce === 1)
                    .map((pt) => {
                      const px = 45 + (pt.x / totalRange) * 550;
                      const py = 240 - (pt.y / maxPlotY) * 200;
                      return `${px.toFixed(1)},${py.toFixed(1)}`;
                    })
                    .join(' ')}
                />

                {/* Second bounce path */}
                <polyline
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  points={projMetrics.trajectoryPoints
                    .filter((pt) => pt.bounce === 2)
                    .map((pt) => {
                      const px = 45 + (pt.x / totalRange) * 550;
                      const py = 240 - (pt.y / maxPlotY) * 200;
                      return `${px.toFixed(1)},${py.toFixed(1)}`;
                    })
                    .join(' ')}
                />

                {/* Impact point A marker */}
                {(() => {
                  const impactX =
                    45 + (projMetrics.horizontalRange / totalRange) * 550;
                  return (
                    <g>
                      <circle
                        cx={impactX}
                        cy={240}
                        r={5}
                        fill="#F59E0B"
                      />
                      <text
                        x={impactX}
                        y={260}
                        textAnchor="middle"
                        fill="#F59E0B"
                        fontSize="11"
                        fontFamily="JetBrains Mono"
                      >
                        Impact A ({projMetrics.horizontalRange}m)
                      </text>
                    </g>
                  );
                })()}

                {/* Max height marker */}
                {(() => {
                  const peakX =
                    45 + (projMetrics.horizontalRange / 2 / totalRange) * 550;
                  const peakY = 240 - (projMetrics.maxHeight / maxPlotY) * 200;
                  return (
                    <g>
                      <circle cx={peakX} cy={peakY} r={4} fill="#10B981" />
                      <text
                        x={peakX}
                        y={Math.max(16, peakY - 10)}
                        textAnchor="middle"
                        fill="#34D399"
                        fontSize="11"
                        fontFamily="JetBrains Mono"
                      >
                        H_max = {projMetrics.maxHeight}m
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Telemetry Output Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">TIME OF FLIGHT T₁</div>
                <div className="text-lg font-mono font-semibold text-[#F8FAFC] tabular-nums mt-1">
                  {projMetrics.timeOfFlight} <span className="text-xs text-[#06B6D4]">s</span>
                </div>
              </div>
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">MAX HEIGHT H₁</div>
                <div className="text-lg font-mono font-semibold text-[#10B981] tabular-nums mt-1">
                  {projMetrics.maxHeight} <span className="text-xs">m</span>
                </div>
              </div>
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">PRIMARY RANGE R₁</div>
                <div className="text-lg font-mono font-semibold text-[#06B6D4] tabular-nums mt-1">
                  {projMetrics.horizontalRange} <span className="text-xs">m</span>
                </div>
              </div>
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">REBOUND RANGE R₂</div>
                <div className="text-lg font-mono font-semibold text-[#60A5FA] tabular-nums mt-1">
                  {projMetrics.secondBounceRange} <span className="text-xs">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Parameter Control Deck */}
          <div className="lg:col-span-4 bg-[#111C33] border border-[#334155] rounded-lg p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#06B6D4]" />
                <h2 className="text-sm font-semibold text-[#F8FAFC]">
                  Boundary Parameter Controls
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVelocity(28);
                  setAngleDeg(30);
                  setRestitution(0.75);
                  setGravity(9.8);
                }}
                className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <label htmlFor="slider-velocity" className="text-[#94A3B8]">
                    Initial Velocity (u):
                  </label>
                  <span className="text-[#F8FAFC] tabular-nums">{velocity} m·s⁻¹</span>
                </div>
                <input
                  id="slider-velocity"
                  type="range"
                  min={10}
                  max={50}
                  step={1}
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <label htmlFor="slider-angle" className="text-[#94A3B8]">
                    Launch Elevation (α):
                  </label>
                  <span className="text-[#F8FAFC] tabular-nums">{angleDeg}°</span>
                </div>
                <input
                  id="slider-angle"
                  type="range"
                  min={15}
                  max={75}
                  step={1}
                  value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="w-full accent-[#06B6D4]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <label htmlFor="slider-restitution" className="text-[#94A3B8]">
                    Restitution Coefficient (e):
                  </label>
                  <span className="text-[#F8FAFC] tabular-nums">{restitution}</span>
                </div>
                <input
                  id="slider-restitution"
                  type="range"
                  min={0.2}
                  max={0.95}
                  step={0.05}
                  value={restitution}
                  onChange={(e) => setRestitution(Number(e.target.value))}
                  className="w-full accent-[#10B981]"
                />
              </div>
            </div>

            <div className="bg-[#0B1120] border border-[#334155] rounded p-3.5 space-y-1.5">
              <div className="label-sm text-[#06B6D4]">GOVERNING EQUATION</div>
              <div className="code-formula-md text-[#F8FAFC]">
                R₁ = (u² sin 2α) / g  |  R₂ = e · R₁
              </div>
              <p className="text-xs text-[#94A3B8]">
                Horizontal velocity u cos(α) remains constant across smooth impact while vertical speed scales by e.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Columns: Titration & Buffer Curve Stage */}
          <div className="lg:col-span-8 bg-[#111C33] border border-[#334155] rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#334155] pb-3">
              <div className="text-xs font-mono text-[#10B981]">
                STAGE · WEAK ACID / STRONG BASE TITRATION CURVE (25.0 cm³ CH₃COOH vs NaOH)
              </div>
              <div className="text-xs font-mono text-[#F8FAFC] tabular-nums">
                Current pH: <span className="text-[#34D399] font-bold">{titrMetrics.currentPh}</span>
              </div>
            </div>

            <div className="bg-[#0B1120] border border-[#334155] rounded-md p-4">
              <svg
                viewBox="0 0 640 280"
                className="w-full h-64 overflow-visible"
                role="img"
                aria-label="pH titration curve plotting pH against volume of NaOH added"
              >
                {/* pH 7 neutral line */}
                <line
                  x1={45}
                  y1={240 - (7 / 14) * 200}
                  x2={610}
                  y2={240 - (7 / 14) * 200}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                {/* Axes */}
                <line x1={45} y1={20} x2={45} y2={240} stroke="#475569" strokeWidth="1.5" />
                <line x1={45} y1={240} x2={615} y2={240} stroke="#475569" strokeWidth="1.5" />

                {/* Titration Curve */}
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  points={titrMetrics.curvePoints
                    .map((pt) => {
                      const px = 45 + (pt.volume / 50) * 550;
                      const py = 240 - (pt.ph / 14) * 200;
                      return `${px.toFixed(1)},${py.toFixed(1)}`;
                    })
                    .join(' ')}
                />

                {/* Current Volume Operating Point */}
                {(() => {
                  const cx = 45 + (baseVolAdded / 50) * 550;
                  const cy = 240 - (titrMetrics.currentPh / 14) * 200;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={5.5} fill="#06B6D4" />
                      <text
                        x={cx}
                        y={Math.max(18, cy - 12)}
                        textAnchor="middle"
                        fill="#22D3EE"
                        fontSize="11"
                        fontFamily="JetBrains Mono"
                      >
                        ({baseVolAdded} cm³, pH {titrMetrics.currentPh})
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">EQUIVALENCE VOL V_eq</div>
                <div className="text-lg font-mono font-semibold text-[#F8FAFC] tabular-nums mt-1">
                  {titrMetrics.equivalenceVolCm3} <span className="text-xs text-[#10B981]">cm³</span>
                </div>
              </div>
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">EQUIVALENCE pH</div>
                <div className="text-lg font-mono font-semibold text-[#10B981] tabular-nums mt-1">
                  {titrMetrics.equivalencePh}
                </div>
              </div>
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">HALF-EQUIV pH (pKₐ)</div>
                <div className="text-lg font-mono font-semibold text-[#06B6D4] tabular-nums mt-1">
                  {titrMetrics.halfEquivalencePh}
                </div>
              </div>
              <div className="bg-[#0B1120] border border-[#334155] rounded p-3">
                <div className="label-sm text-[#94A3B8]">REGIME STATUS</div>
                <div className="text-sm font-mono font-semibold text-[#F59E0B] mt-1.5">
                  {titrMetrics.bufferRegionActive ? 'BUFFER ZONE ACTIVE' : 'NON-BUFFER REGIME'}
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Titration Controls */}
          <div className="lg:col-span-4 bg-[#111C33] border border-[#334155] rounded-lg p-5 space-y-5">
            <h2 className="text-sm font-semibold text-[#F8FAFC] border-b border-[#334155] pb-3">
              Burette & Concentration Parameters
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <label htmlFor="slider-burette" className="text-[#94A3B8]">
                    Titrant NaOH Added (V_b):
                  </label>
                  <span className="text-[#F8FAFC] tabular-nums">{baseVolAdded} cm³</span>
                </div>
                <input
                  id="slider-burette"
                  type="range"
                  min={0}
                  max={50}
                  step={0.5}
                  value={baseVolAdded}
                  onChange={(e) => setBaseVolAdded(Number(e.target.value))}
                  className="w-full accent-[#10B981]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <label htmlFor="slider-pka" className="text-[#94A3B8]">
                    Weak Acid pKₐ:
                  </label>
                  <span className="text-[#F8FAFC] tabular-nums">{pKa}</span>
                </div>
                <input
                  id="slider-pka"
                  type="range"
                  min={3.5}
                  max={6.5}
                  step={0.02}
                  value={pKa}
                  onChange={(e) => setPKa(Number(e.target.value))}
                  className="w-full accent-[#06B6D4]"
                />
              </div>
            </div>

            <div className="bg-[#0B1120] border border-[#334155] rounded p-3.5 space-y-1.5">
              <div className="label-sm text-[#10B981]">HENDERSON–HASSELBALCH</div>
              <div className="code-formula-md text-[#F8FAFC]">
                pH = pKₐ + log₁₀([A⁻] / [HA])
              </div>
              <p className="text-xs text-[#94A3B8]">
                At half-equivalence (V = {titrMetrics.equivalenceVolCm3 / 2} cm³), [A⁻] = [HA] and pH equals pKₐ ({pKa}). Suitable indicator: Phenolphthalein (pH 8.2–10.0).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
