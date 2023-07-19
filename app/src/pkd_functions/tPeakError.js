import optimize from "../utils/optimize.js";
import CE from "./CE.js";

/**
 * Calculate the error between the predicted and actual time of peak effect site concentration.
 *
 * @param {number} lambda_4 The lambda value associated with the peak effect site concentration.
 * @param {number} tPeak The actual time of peak effect.
 * @param {number} p_coef_bolus_l1 The bolus coefficient for lambda_1.
 * @param {number} p_coef_bolus_l2 The bolus coefficient for lambda_2.
 * @param {number} p_coef_bolus_l3 The bolus coefficient for lambda_3.
 * @param {number} lambda_1 The lambda value associated with the first exponent.
 * @param {number} lambda_2 The lambda value associated with the second exponent.
 * @param {number} lambda_3 The lambda value associated with the third exponent.
 * @returns {number} The squared error between the predicted and actual time of peak effect.
 */
function tPeakError(lambda_4, {tPeak, p_coef_bolus_l1, p_coef_bolus_l2, p_coef_bolus_l3, lambda_1, lambda_2, lambda_3}) {
  const e_coef_bolus_1 = (p_coef_bolus_l1 / (lambda_4 - lambda_1)) * lambda_4;

  let e_coef_bolus_2, e_coef_bolus_3;
  if (lambda_2 > 0) {
    e_coef_bolus_2 = (p_coef_bolus_l2 / (lambda_4 - lambda_2)) * lambda_4;
  } else {
    e_coef_bolus_2 = 0;
  }
  if (lambda_3 > 0) {
    e_coef_bolus_3 = (p_coef_bolus_l3 / (lambda_4 - lambda_3)) * lambda_4;
  } else {
    e_coef_bolus_3 = 0;
  }
  const e_coef_bolus_4 = -e_coef_bolus_1 - e_coef_bolus_2 - e_coef_bolus_3;

  const predPeak = optimize(CE, [0, 100], { maximum: true },
      {e_coef_bolus_1, e_coef_bolus_2, e_coef_bolus_3, e_coef_bolus_4, lambda_1, lambda_2, lambda_3, lambda_4}).extremum;

  return Math.pow(tPeak - predPeak, 2);
}

export default tPeakError;