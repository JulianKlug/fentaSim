/**
 * Advances a single state variable over time.
 * @param {number[]} l - Array of l values.
 * @param {number[]} bolus - Array of bolus values.
 * @param {number[]} infusion - Array of infusion values.
 * @param {number} start - Starting state value.
 * @param {number} L - Length of the arrays.
 * @returns {number[]} - Array of advanced state values.
 */
function advanceState(l, bolus, infusion, start, L) {
  let Z = Array.from({ length: L }, (_, i) => ({ l: l[i], bolus: bolus[i], infusion: infusion[i] }));
  let states = Z.reduce((state, Z) => [...state, state[state.length - 1] * Z.l + Z.bolus + Z.infusion], [start]);

  return states.slice(1);
}

export default advanceState;