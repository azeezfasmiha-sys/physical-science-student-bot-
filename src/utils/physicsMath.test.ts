import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyNumericalCalculation,
  formatDimensions,
  checkDimensionalHomogeneity,
  calculateProjectileMetrics,
  calculateTitrationMetrics,
  calculateSriLankaALZScore,
} from './physicsMath';

test('verifyNumericalCalculation rejects empty and non-numeric inputs', () => {
  const emptyResult = verifyNumericalCalculation('   ', 9.81, 0.05, 25, 'm·s⁻²');
  assert.equal(emptyResult.isValidInput, false);
  assert.equal(emptyResult.awardedMarks, 0);

  const nanResult = verifyNumericalCalculation('abc', 9.81, 0.05, 25, 'm·s⁻²');
  assert.equal(nanResult.isValidInput, false);
});

test('verifyNumericalCalculation awards full marks within tolerance and detects 10^n prefix scaling warnings', () => {
  const exact = verifyNumericalCalculation('24.52', 24.5, 0.05, 25, 'm·s⁻¹');
  assert.equal(exact.isCorrect, true);
  assert.equal(exact.awardedMarks, 25);
  assert.equal(exact.severity, 'success');

  const prefixError = verifyNumericalCalculation('245', 24.5, 0.05, 25, 'm·s⁻¹');
  assert.equal(prefixError.isCorrect, false);
  assert.equal(prefixError.severity, 'warning');
  assert.ok(prefixError.awardedMarks > 0);
});

test('formatDimensions and checkDimensionalHomogeneity validate SI base vectors', () => {
  const forceDim = { M: 1, L: 1, T: -2, I: 0, Theta: 0, N: 0 };
  const energyDim = { M: 1, L: 2, T: -2, I: 0, Theta: 0, N: 0 };

  assert.equal(formatDimensions(forceDim), '[M] [L] [T]⁻²');
  assert.equal(formatDimensions(energyDim), '[M] [L]² [T]⁻²');

  const same = checkDimensionalHomogeneity(forceDim, { ...forceDim });
  assert.equal(same.homogeneous, true);
  assert.equal(same.mismatches.length, 0);

  const diff = checkDimensionalHomogeneity(forceDim, energyDim);
  assert.equal(diff.homogeneous, false);
  assert.equal(diff.mismatches.length, 1);
});

test('calculateProjectileMetrics computes accurate range, max height, and second bounce', () => {
  const metrics = calculateProjectileMetrics({
    initialVelocity: 20,
    launchAngleDeg: 30,
    gravity: 10,
    restitution: 0.5,
  });

  // uy = 20 * sin(30) = 10 m/s -> T = 2*10/10 = 2.0 s, H = 100/20 = 5.0 m
  assert.equal(metrics.timeOfFlight, 2);
  assert.equal(metrics.maxHeight, 5);
  assert.ok(metrics.horizontalRange > 34.6 && metrics.horizontalRange < 34.7);
  assert.ok(metrics.secondBounceRange > 17.3 && metrics.secondBounceRange < 17.4);
});

test('calculateTitrationMetrics identifies Henderson-Hasselbalch half-equivalence pH = pKa', () => {
  const res = calculateTitrationMetrics({
    acidConc: 0.1,
    acidVolCm3: 25,
    baseConc: 0.1,
    pKa: 4.76,
    currentBaseVolCm3: 12.5,
  });

  assert.equal(res.equivalenceVolCm3, 25);
  assert.equal(res.currentPh, 4.76);
  assert.equal(res.bufferRegionActive, true);
});

test('calculateSriLankaALZScore computes standardized Z-score and faculty eligibility', () => {
  const highPerformer = calculateSriLankaALZScore({
    combinedMaths: 88,
    physics: 85,
    thirdSubject: 86,
    thirdSubjectType: 'chemistry',
  });

  assert.ok(highPerformer.zScore > 2.1);
  assert.equal(highPerformer.eligibleFaculties[0].eligible, true);
});
