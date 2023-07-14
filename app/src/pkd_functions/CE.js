/**
 * CE function calculates the value of the function at time t based on the given coefficients and lambdas.
 *
 * @param {number} t The time at which to evaluate the function.
 * @param {number} e_coef_bolus_1 The bolus coefficient for lambda_1.
 * @param {number} e_coef_bolus_2 The bolus coefficient for lambda_2.
 * @param {number} e_coef_bolus_3 The bolus coefficient for lambda_3.
 * @param {number} e_coef_bolus_4 The bolus coefficient for lambda_4.
 * @param {number} lambda_1 The lambda value associated with the first exponent.
 * @param {number} lambda_2 The lambda value associated with the second exponent.
 * @param {number} lambda_3 The lambda value associated with the third exponent.
 * @param {number} lambda_4 The lambda value associated with the peak effect site concentration.
 * @returns {number} The value of the function at time t.
 */
function CE(t, e_coef_bolus_1, e_coef_bolus_2, e_coef_bolus_3, e_coef_bolus_4, lambda_1, lambda_2, lambda_3, lambda_4) {
  return (
    e_coef_bolus_1 * Math.exp(-lambda_1 * t) +
    e_coef_bolus_2 * Math.exp(-lambda_2 * t) +
    e_coef_bolus_3 * Math.exp(-lambda_3 * t) +
    e_coef_bolus_4 * Math.exp(-lambda_4 * t)
  );
}

export default CE;