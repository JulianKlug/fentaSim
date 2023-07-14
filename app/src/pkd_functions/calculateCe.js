/**
 * Calculates Ce (elimination concentration) from Cp (plasma concentration), ke0 (elimination rate constant), dt (time interval), and L (length).
 * @param {number[]} Cp - Array of plasma concentrations.
 * @param {number[]} ke0 - Array of elimination rate constants.
 * @param {number[]} dt - Array of time intervals.
 * @param {number} L - Length of the arrays.
 * @returns {number[]} - Array of Ce values.
 */
function calculateCe(Cp, ke0, dt, L) {
  let Ce = Array(L).fill(0);

  for (let i = 1; i < L; i++) {
    let y0 = Cp[i - 1];
    let y1 = Cp[i];
    let k, input;

    if (y0 <= y1 || y0 === 0 || y1 === 0) {
      // Linear interpolation for increasing or zero concentrations
      k = (y1 - y0) / dt[i];
      input = k * dt[i] + (ke0[i] * y0 - k) * (1 - Math.exp(-ke0[i] * dt[i])) / ke0[i];
    } else {
      // Logarithmic interpolation for decreasing concentrations
      k = (Math.log(y1) - Math.log(y0)) / dt[i];
      input = (y0 * ke0[i] / (k + ke0[i])) * (Math.exp(k * dt[i]) - Math.exp(-ke0[i] * dt[i]));
    }

    Ce[i] = Ce[i - 1] * Math.exp(-ke0[i] * dt[i]) + input;
  }

  return Ce;
}


export default calculateCe;