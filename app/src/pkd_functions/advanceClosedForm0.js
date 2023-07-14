import advanceState from "./advanceState.js";
import calculateCe from "./calculateCe.js";
import fentanyl from "./fentanyl.js";
import preprocessDose from "./preprocessDose.js";

/**
 * Calculates advanced closed form approach for a given dose, pkSet, maximum
 * @param {Object} dose - Dose object.
 * @param {Object} pkSet - PK set object.
 * @param {number} maximum - Maximum value.
 * @returns {Object} - Results object containing Time, Cp, Ce, and Recovery arrays.
 */
function advanceClosedForm0(dose, pkSet, maximum) {
  // Create timeline
  // let timeLine = [0, ...dose.Time, dose.Time.filter((t, i) => dose.Bolus[i]).map(t => t - 0.01), maximum];
  // timeLine = timeLine.filter(t => t >= 0);
  //
  let timeLine = [0, ...dose.map(entry => entry.Time), ...dose.filter(entry => entry.Units === "mcg/kg/min" && entry.Dose > 0).map(entry => entry.Time - 0.01), maximum];
  timeLine = timeLine.filter(t => t >= 0);

  // Fill in gaps using exponentially decreasing amounts
  let gapStart = timeLine.slice(0, -1);
  let gapEnd = timeLine.slice(1);
  let start = Math.min(0.693 / pkSet.ke0 / 4, 1);
  let newTimes = Array.from({ length: 41 }, (_, i) => Math.exp(Math.log(start) + i * Math.log(1440 / start) / 41));
  for (let i = 0; i < gapEnd.length; i++) {
    let distance = gapEnd[i] - gapStart[i];
    let times = newTimes.filter(t => t <= distance);
    timeLine.push(...times.map(t => gapStart[i] + t));
  }
  timeLine.sort((a, b) => a - b);
  let L = timeLine.length;
  let doseNA = Array(L).fill(0);

  // Create bolusLine and infusionLine
  let bolusLine = Array(L).fill(0);
  let infusionLine = Array(L).fill(0);
  let dt = Array(L).fill(0);
  let rate = Array(L).fill(0);
  for (let i = 0; i < L; i++) {
    bolusLine[i] = dose.Dose.filter((_, j) => dose.Time[j] === timeLine[i] && dose.Bolus[j]).reduce((sum, val) => sum + val, 0);
    let USE = dose.Time.map((t, j) => t === timeLine[i] && !dose.Bolus[j]);
    if (i === 0) {
      infusionLine[i] = dose.Dose.filter((_, j) => USE[j]).reduce((sum, val) => sum + val, 0);
      rate[i] = 0;
      dt[i] = 0;
    } else {
      if (USE.every(u => !u)) {
        infusionLine[i] = infusionLine[i - 1];
      } else {
        infusionLine[i] = dose.Dose.filter((_, j) => USE[j]).reduce((sum, val) => sum + val, 0);
      }
      dt[i] = timeLine[i] - timeLine[i - 1];
      rate[i] = infusionLine[i - 1];
    }
  }

  // Vectorize calculations
  let l1_dt = dt.map(d => Math.exp(-pkSet.lambda_1 * d));
  let l2_dt = dt.map(d => Math.exp(-pkSet.lambda_2 * d));
  let l3_dt = dt.map(d => Math.exp(-pkSet.lambda_3 * d));

  let p_bolus_l1 = bolusLine.map(b => pkSet.p_coef_bolus_l1 * b);
  let p_bolus_l2 = bolusLine.map(b => pkSet.p_coef_bolus_l2 * b);
  let p_bolus_l3 = bolusLine.map(b => pkSet.p_coef_bolus_l3 * b);

  let p_infusion_l1 = rate.map((r, i) => pkSet.p_coef_infusion_l1 * r * (1 - l1_dt[i]));
  let p_infusion_l2 = rate.map((r, i) => pkSet.p_coef_infusion_l2 * r * (1 - l2_dt[i]));
  let p_infusion_l3 = rate.map((r, i) => pkSet.p_coef_infusion_l3 * r * (1 - l3_dt[i]));

  let p_state_l1 = advanceState(l1_dt, p_bolus_l1, p_infusion_l1, 0, L);
  let p_state_l2 = advanceState(l2_dt, p_bolus_l2, p_infusion_l2, 0, L);
  let p_state_l3 = advanceState(l3_dt, p_bolus_l3, p_infusion_l3, 0, L);

  // Wrap up, calculate Ce
  let Cp = p_state_l1.map((p, i) => p + p_state_l2[i] + p_state_l3[i]);
  let Ce = calculateCe(Cp, Array(L).fill(pkSet.ke0), dt, L);

  let recovery = Array(L).fill(0);
  let results = {
    Time: timeLine,
    Cp: Cp,
    Ce: Ce,
    Recovery: recovery
  };

  return results;
}


const fentanylPK = fentanyl(70,
    170,
    50,
    "male",).PK[0];

const doseTable = [
  { Drug: "fentanyl", Time: 0, Dose: 60, Units: "mcg" },
  { Drug: "fentanyl", Time: 0, Dose: 0.15, Units: "mcg/kg/min" },
  { Drug: "fentanyl", Time: 30, Dose: 0, Units: "mcg/kg/min" }
];

const processedDoseTable = preprocessDose(doseTable, "ng", 80);

console.log(fentanyl(70,
    170,
    50,
    "male"))

const maximum = 60;
let timeLine = [0, ...processedDoseTable.map(entry => entry.Time), ...processedDoseTable.filter(entry => entry.Units === "mcg/kg/min" && entry.Dose > 0).map(entry => entry.Time - 0.01), maximum];
timeLine = timeLine.filter(t => t >= 0);

// Fill in gaps using exponentially decreasing amounts
let gapStart = timeLine.slice(0, -1);
let gapEnd = timeLine.slice(1);
let start = Math.min(0.693 / fentanylPK.ke0 / 4, 1);
let newTimes = Array.from({ length: 41 }, (_, i) => Math.exp(Math.log(start) + i * Math.log(1440 / start) / 41));
for (let i = 0; i < gapEnd.length; i++) {
  let distance = gapEnd[i] - gapStart[i];
  let times = newTimes.filter(t => t <= distance);
  timeLine.push(...times.map(t => gapStart[i] + t));
}
timeLine.sort((a, b) => a - b);


console.log(timeLine)

// console.log(advanceClosedForm0(processedDoseTable, fentanylPK, 50));