/**
 * Solve the cubic equation required to convert k10, k12, k13, k21, and k31
 * to 3 exponents.
 *
 * @param {number} k10 Coefficient k10
 * @param {number} k12 Coefficient k12
 * @param {number} k13 Coefficient k13
 * @param {number} k21 Coefficient k21
 * @param {number} k31 Coefficient k31
 * @returns {number[]} Array of sorted roots
 */
function solveCubic(k10, k12, k13, k21, k31) {
  const toradian = Math.asin(1.0) * 2.0 / 180.0; // pi/180

  if (k31 > 0) {
    // First take roots of X^3 + a2X^2 + a1X^1 + a0 <- 0
    // where the coefficients are:
    const a0 = k10 * k21 * k31;
    const a1 = k10 * k31 + k21 * k31 + k21 * k13 + k10 * k21 + k31 * k12;
    const a2 = k10 + k12 + k13 + k21 + k31;

    // Now transform to x^3 + px + q <- 0
    const p = a1 - (a2 * a2 / 3.0);
    const q = (2 * a2 * a2 * a2 / 27.0) - (a1 * a2 / 3.0) + a0;
    let r1 = Math.sqrt(-(p * p * p) / 27.0);
    let phi = (-q / 2.0) / r1;

    if (phi > 1) {
      phi = 1;
    } else if (phi < -1) {
      phi = -1;
    }

    phi = Math.acos(phi) / 3.0;
    r1 = 2.0 * Math.exp(Math.log(r1) / 3.0);

    const root1 = -(Math.cos(phi) * r1 - a2 / 3.0);
    const root2 = -(Math.cos(phi + 120.0 * toradian) * r1 - a2 / 3.0);
    const root3 = -(Math.cos(phi + 240.0 * toradian) * r1 - a2 / 3.0);

    // Sort the roots in descending order
    const roots = [root1, root2, root3].sort((a, b) => b - a);
    return roots;
  } else {
    if (k21 > 0) {
      // First take roots of X^2 - a1X^1 + a0 = 0
      // where the coefficients are:
      const a0 = k10 * k21;
      const a1 = -(k10 + k12 + k21);

      const root1 = (-a1 + Math.sqrt(a1 * a1 - 4 * a0)) / 2;
      const root2 = (-a1 - Math.sqrt(a1 * a1 - 4 * a0)) / 2;
      const root3 = 0;

      // Sort the roots in descending order
      const roots = [root1, root2, root3].sort((a, b) => b - a);
      return roots;
    } else {
      // One compartment model
      const root1 = k10;
      const root2 = 0;
      const root3 = 0;

      return [root1, root2, root3];
    }
  }
}

export default solveCubic;