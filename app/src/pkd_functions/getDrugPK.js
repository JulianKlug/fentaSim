import fentanyl from "./fentanyl.js";
import solveCubic from "./solveCubic.js";
import tPeakError from "./tPeakError.js";
import optimize from "../utils/optimize.js";

/**
 * Get the pharmacokinetic and pharmacodynamic values for a drug based on patient covariates.
 *
 * @param {string} drug - Name of the drug.
 * @param {number} weight - Weight in kg.
 * @param {number} height - Height in cm.
 * @param {number} age - Age in years.
 * @param {string} sex - Sex as string: "female" or "male".
 * @param {string} model - Model to use for PK/PD calculations: "shafer" or "scott".
 * @returns {Object} - Pharmacokinetic and pharmacodynamic values for the drug.
 */
function getDrugPK(drug = "fentanyl", weight = 70, height = 170, age = 50, sex = "male", model = "shafer") {
  const DEBUG = false;

  const implemented_drugs = {
      'fentanyl': fentanyl,
  }
  if (!(drug in implemented_drugs)) {
      throw new Error(`Drug ${drug} not implemented`);
  }
  const drug_function = implemented_drugs[drug];

  const drug_parameters = drug_function(weight, height, age, sex, model);
  const tPeak = drug_parameters.tPeak;

  const events = Object.keys(drug_parameters.PK);
  for (const event of events) {
    const { v1, v2, v3, cl1, cl2, cl3 } = drug_parameters.PK[event];

    // Note on Oral, IM, and IN route PK
    // Oral is (for now) state 4 for plasma and state 5 for effect site
    // IM is state 5 for plasma and state 6 for effect site
    // IN is state 6 for plasma and state 7 for effect site
    // Plan to change these to make the code clearer:
    // For IV, states 1-3 for plasma, states 1-4 for effect site
    // PO will add state_PO, associated with ka_PO
    // IM will add state_IM, associated with ka_IM
    // IN will add state_IN, associated with ka_IN

    // Set up PK for oral delivery
    let ka_PO, bioavailability_PO, tlag_PO;
    if (drug_parameters.PK[event].ka_PO !== null) {
      ka_PO = drug_parameters.PK[event].ka_PO;
      bioavailability_PO = drug_parameters.PK[event].bioavailability_PO ?? 1;
      tlag_PO = drug_parameters.PK[event].tlag_PO ?? 0;
    } else {
      ka_PO = bioavailability_PO = tlag_PO = 0;
    }

    // Set up PK for IM delivery
    let ka_IM, bioavailability_IM, tlag_IM;
    if (drug_parameters.PK[event].ka_IM !== null) {
      ka_IM = drug_parameters.PK[event].ka_IM;
      bioavailability_IM = drug_parameters.PK[event].bioavailability_IM ?? 1;
      tlag_IM = drug_parameters.PK[event].tlag_IM ?? 0;
    } else {
      ka_IM = bioavailability_IM = tlag_IM = 0;
    }

    // Set up PK for IN delivery
    let ka_IN, bioavailability_IN, tlag_IN;
    if (drug_parameters.PK[event].ka_IN !== null) {
      ka_IN = drug_parameters.PK[event].ka_IN;
      bioavailability_IN = drug_parameters.PK[event].bioavailability_IN ?? 1;
      tlag_IN = drug_parameters.PK[event].tlag_IN ?? 0;
    } else {
      ka_IN = bioavailability_IN = tlag_IN = 0;
    }

    const customFunction = drug_parameters.PK[event].customFunction ?? "";

    const k10 = cl1 / v1;
    const k12 = cl2 / v1;
    const k13 = cl3 / v1;
    const k21 = cl2 / v2;
    const k31 = cl3 / v3;

    const roots = solveCubic(k10, k12, k13, k21, k31);
    const lambda_1 = roots[0];
    const lambda_2 = roots[1];
    const lambda_3 = roots[2];

    // Bolus Delivery
    let p_coef_bolus_l1 = 0,
      p_coef_bolus_l2 = 0,
      p_coef_bolus_l3 = 0;

    let e_coef_bolus_l1 = 0,
      e_coef_bolus_l2 = 0,
      e_coef_bolus_l3 = 0,
      e_coef_bolus_ke0 = 0;

    // Infusion delivery
    let p_coef_infusion_l1 = 0,
      p_coef_infusion_l2 = 0,
      p_coef_infusion_l3 = 0;

    let e_coef_infusion_l1 = 0,
      e_coef_infusion_l2 = 0,
      e_coef_infusion_l3 = 0,
      e_coef_infusion_ke0 = 0;

    // PO Delivery
    let p_coef_PO_l1 = 0,
      p_coef_PO_l2 = 0,
      p_coef_PO_l3 = 0,
      p_coef_PO_ka = 0;

    let e_coef_PO_l1 = 0,
      e_coef_PO_l2 = 0,
      e_coef_PO_l3 = 0,
      e_coef_PO_ke0 = 0,
      e_coef_PO_ka = 0;

    // IM Delivery
    let p_coef_IM_l1 = 0,
      p_coef_IM_l2 = 0,
      p_coef_IM_l3 = 0,
      p_coef_IM_ka = 0;

    let e_coef_IM_l1 = 0,
      e_coef_IM_l2 = 0,
      e_coef_IM_l3 = 0,
      e_coef_IM_ke0 = 0,
      e_coef_IM_ka = 0;

    // IN Delivery
    let p_coef_IN_l1 = 0,
      p_coef_IN_l2 = 0,
      p_coef_IN_l3 = 0,
      p_coef_IN_ka = 0;

    let e_coef_IN_l1 = 0,
      e_coef_IN_l2 = 0,
      e_coef_IN_l3 = 0,
      e_coef_IN_ke0 = 0,
      e_coef_IN_ka = 0;

    if (k31 > 0) {
      p_coef_bolus_l1 =
        ((k21 - lambda_1) * (k31 - lambda_1)) /
        ((lambda_1 - lambda_2) * (lambda_1 - lambda_3)) /
        v1;
      p_coef_bolus_l2 =
        ((k21 - lambda_2) * (k31 - lambda_2)) /
        ((lambda_2 - lambda_1) * (lambda_2 - lambda_3)) /
        v1;
      p_coef_bolus_l3 =
        ((k21 - lambda_3) * (k31 - lambda_3)) /
        ((lambda_3 - lambda_2) * (lambda_3 - lambda_1)) /
        v1;
    } else {
      if (lambda_2 > 0) {
        p_coef_bolus_l1 = (k21 - lambda_1) / ((lambda_2 - lambda_1) * v1);
        p_coef_bolus_l2 = (k21 - lambda_2) / ((lambda_1 - lambda_2) * v1);
      } else {
        p_coef_bolus_l1 = 1 / (lambda_1 * v1);
      }
    }

    p_coef_infusion_l1 = p_coef_bolus_l1 / lambda_1;
    if (lambda_2 > 0) p_coef_infusion_l2 = p_coef_bolus_l2 / lambda_2;
    if (lambda_3 > 0) p_coef_infusion_l3 = p_coef_bolus_l3 / lambda_3;

    // Find ke0 from tPeak
    let ke0;
    if (model === "shafer") {
      if (tPeak > 0) {
        ke0 = optimize(tPeakError, [0, 200], {maximum:false}, {
          tPeak,
          p_coef_bolus_l1,
          p_coef_bolus_l2,
          p_coef_bolus_l3,
          lambda_1,
          lambda_2,
          lambda_3
        }).extremum;
      } else {
        ke0 = 0;
      }
    } else if (model === "scott") {
      ke0 = 0.146 * Math.pow(weight / 70, 0.75)
    } else {
      throw new Error("Invalid model");
    }

    if (ke0 > 0) {
      e_coef_bolus_l1 = (p_coef_bolus_l1 / (ke0 - lambda_1)) * ke0;
      e_coef_infusion_l1 = e_coef_bolus_l1 / lambda_1;

      if (lambda_2 > 0) {
        e_coef_bolus_l2 = (p_coef_bolus_l2 / (ke0 - lambda_2)) * ke0;
        e_coef_infusion_l2 = e_coef_bolus_l2 / lambda_2;
      }
      if (lambda_3 > 0) {
        e_coef_bolus_l3 = (p_coef_bolus_l3 / (ke0 - lambda_3)) * ke0;
        e_coef_infusion_l3 = e_coef_bolus_l3 / lambda_3;
      }
      e_coef_bolus_ke0 = -e_coef_bolus_l1 - e_coef_bolus_l2 - e_coef_bolus_l3;
      e_coef_infusion_ke0 = e_coef_bolus_ke0 / ke0;
    }

    if (ka_PO > 0) {
      p_coef_PO_l1 = (p_coef_bolus_l1 / (ka_PO - lambda_1)) * ka_PO * bioavailability_PO;
      p_coef_PO_l2 = (p_coef_bolus_l2 / (ka_PO - lambda_2)) * ka_PO * bioavailability_PO;
      p_coef_PO_l3 = (p_coef_bolus_l3 / (ka_PO - lambda_3)) * ka_PO * bioavailability_PO;
      p_coef_PO_ka = -p_coef_PO_l1 - p_coef_PO_l2 - p_coef_PO_l3;

      e_coef_PO_l1 = (e_coef_bolus_l1 / (ka_PO - lambda_1)) * ka_PO * bioavailability_PO;
      e_coef_PO_l2 = (e_coef_bolus_l2 / (ka_PO - lambda_2)) * ka_PO * bioavailability_PO;
      e_coef_PO_l3 = (e_coef_bolus_l3 / (ka_PO - lambda_3)) * ka_PO * bioavailability_PO;
      e_coef_PO_ke0 = (e_coef_bolus_ke0 / (ka_PO - ke0)) * ka_PO * bioavailability_PO;
      e_coef_PO_ka = -e_coef_PO_l1 - e_coef_PO_l2 - e_coef_PO_l3 - e_coef_PO_ke0;
    }

    if (ka_IM > 0) {
      p_coef_IM_l1 = (p_coef_bolus_l1 / (ka_IM - lambda_1)) * ka_IM * bioavailability_IM;
      p_coef_IM_l2 = (p_coef_bolus_l2 / (ka_IM - lambda_2)) * ka_IM * bioavailability_IM;
      p_coef_IM_l3 = (p_coef_bolus_l3 / (ka_IM - lambda_3)) * ka_IM * bioavailability_IM;
      p_coef_IM_ka = -p_coef_IM_l1 - p_coef_IM_l2 - p_coef_IM_l3;

      e_coef_IM_l1 = (e_coef_bolus_l1 / (ka_IM - lambda_1)) * ka_IM * bioavailability_IM;
      e_coef_IM_l2 = (e_coef_bolus_l2 / (ka_IM - lambda_2)) * ka_IM * bioavailability_IM;
      e_coef_IM_l3 = (e_coef_bolus_l3 / (ka_IM - lambda_3)) * ka_IM * bioavailability_IM;
      e_coef_IM_ke0 = (e_coef_bolus_ke0 / (ka_IM - ke0)) * ka_IM * bioavailability_IM;
      e_coef_IM_ka = -e_coef_IM_l1 - e_coef_IM_l2 - e_coef_IM_l3 - e_coef_IM_ke0;
    }

    if (ka_IN > 0) {
      p_coef_IN_l1 = (p_coef_bolus_l1 / (ka_IN - lambda_1)) * ka_IN * bioavailability_IN;
      p_coef_IN_l2 = (p_coef_bolus_l2 / (ka_IN - lambda_2)) * ka_IN * bioavailability_IN;
      p_coef_IN_l3 = (p_coef_bolus_l3 / (ka_IN - lambda_3)) * ka_IN * bioavailability_IN;
      p_coef_IN_ka = -p_coef_IN_l1 - p_coef_IN_l2 - p_coef_IN_l3;

      e_coef_IN_l1 = (e_coef_bolus_l1 / (ka_IN - lambda_1)) * ka_IN * bioavailability_IN;
      e_coef_IN_l2 = (e_coef_bolus_l2 / (ka_IN - lambda_2)) * ka_IN * bioavailability_IN;
      e_coef_IN_l3 = (e_coef_bolus_l3 / (ka_IN - lambda_3)) * ka_IN * bioavailability_IN;
      e_coef_IN_ke0 = (e_coef_bolus_ke0 / (ka_IN - ke0)) * ka_IN * bioavailability_IN;
      e_coef_IN_ka = -e_coef_IN_l1 - e_coef_IN_l2 - e_coef_IN_l3 - e_coef_IN_ke0;
    }

    // Vd Peak Effect
    let vdPeakEffect;
    if (tPeak === 0) {
      vdPeakEffect = 0;
    } else {
      vdPeakEffect =
        1 /
        (e_coef_bolus_l1 * Math.exp(-lambda_1 * tPeak) +
          e_coef_bolus_l2 * Math.exp(-lambda_2 * tPeak) +
          e_coef_bolus_l3 * Math.exp(-lambda_3 * tPeak) +
          e_coef_bolus_ke0 * Math.exp(-ke0 * tPeak));
    }

    // Assign PK values to event
    drug_parameters.PK[event] = {
      v1,
      v2,
      v3,
      cl1,
      cl2,
      cl3,
      k10,
      k12,
      k13,
      k21,
      k31,

      ka_PO,
      bioavailability_PO,
      tlag_PO,

      ka_IM,
      bioavailability_IM,
      tlag_IM,

      ka_IN,
      bioavailability_IN,
      tlag_IN,

      customFunction,

      lambda_1,
      lambda_2,
      lambda_3,
      ke0,

      // Bolus Coefficients
      p_coef_bolus_l1,
      p_coef_bolus_l2,
      p_coef_bolus_l3,

      e_coef_bolus_l1,
      e_coef_bolus_l2,
      e_coef_bolus_l3,
      e_coef_bolus_ke0,

      // Infusion Coefficients
      p_coef_infusion_l1,
      p_coef_infusion_l2,
      p_coef_infusion_l3,

      e_coef_infusion_l1,
      e_coef_infusion_l2,
      e_coef_infusion_l3,
      e_coef_infusion_ke0,

      // PO Coefficients
      p_coef_PO_l1,
      p_coef_PO_l2,
      p_coef_PO_l3,
      p_coef_PO_ka,

      e_coef_PO_l1,
      e_coef_PO_l2,
      e_coef_PO_l3,
      e_coef_PO_ke0,
      e_coef_PO_ka,

      // IM Coefficients
      p_coef_IM_l1,
      p_coef_IM_l2,
      p_coef_IM_l3,
      p_coef_IM_ka,

      e_coef_IM_l1,
      e_coef_IM_l2,
      e_coef_IM_l3,
      e_coef_IM_ke0,
      e_coef_IM_ka,

      // IN Coefficients
      p_coef_IN_l1,
      p_coef_IN_l2,
      p_coef_IN_l3,
      p_coef_IN_ka,

      e_coef_IN_l1,
      e_coef_IN_l2,
      e_coef_IN_l3,
      e_coef_IN_ke0,
      e_coef_IN_ka,
    };
  }

  // Convert events object to array of PK values
  const PKValues = Object.values(drug_parameters.PK);

  // Sort the PK values by event number
  PKValues.sort((a, b) => a.event - b.event);

  if (DEBUG) {
    console.log(PKValues);
  }

  drug_parameters.drug = drug;
  drug_parameters.PK = PKValues;

  return drug_parameters;
}


export default getDrugPK;