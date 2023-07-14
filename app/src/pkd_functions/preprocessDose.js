/**
 * Converts dose values based on the specified concentration units.
 * @param {Object[]} dose - Dose array containing objects with Drug, Time, Dose, and Units properties.
 * @param {string} concentration_units - Concentration units (mcg or ng - per ml).
 * @param {int} weight - weight
 * @returns {Object} - Converted dose object.
 */
function preprocessDose(dose, concentration_units, weight) {
  let mg_Conv, mcg_Conv, ng_Conv;

  // Switch statement to set conversion factors based on concentration units
  switch (concentration_units) { // Units (per ml)
    case 'mcg':
      mg_Conv = 1; // 1 mcg/ml = 1000 mg/L
      mcg_Conv = 1000; // 1 mcg/ml = 1000 mcg/L
      ng_Conv = 1e6;  // 1 mcg/ml = 1e6 ng/L
      break;
    case 'ng':
      mg_Conv = 0.001; // 1 ng/ml = 0.001 mcg/ml = 0.001 mg/L
      mcg_Conv = 1
      ng_Conv = 1000; // 1 ng/ml = 1000 mcg/L
      break;
    default:
      mg_Conv = 1;
      mcg_Conv = 1;
      ng_Conv = 1;
  }

    // Convert dose values based on units and weight
  for (let i = 0; i < dose.length; i++) {
    let unit = dose[i].Units;
    let convertedDose = dose[i].Dose;

    switch (unit) {
      case "mg":
        convertedDose /= mg_Conv;
        break;
      case "mcg":
        convertedDose /= mcg_Conv;
        break;
      case "ng":
        convertedDose /= ng_Conv;
        break;
      case "mcg/kg/min":
        convertedDose *= weight;
        break;
      case "hr":
        convertedDose /= 60;
        break;
    }

    dose[i].Dose = convertedDose;
  }

  // Update Bolus, PO, IM, IN flags based on Units
  for (let i = 0; i < dose.length; i++) {
    let unit = dose[i].Units;

    dose[i].Bolus = !(unit.includes("min") || unit.includes("hr") ||
                      unit.includes("PO") || unit.includes("IM") ||
                      unit.includes("IN"));
    dose[i].PO = unit.includes("PO");
    dose[i].IM = unit.includes("IM");
    dose[i].IN = unit.includes("IN");
  }

  return dose;
}


export default preprocessDose