import getDrugPK from "./getDrugPK.js";
import preprocessDose from "./preprocessDose.js";
import advanceClosedForm0 from "./advanceClosedForm0.js";
import postProcessResults from "./postProcessResults.js";

const fentanyl = getDrugPK('fentanyl', 70, 170, 50, 'male');
const fentanylPK = fentanyl.PK[0];

const doseTable = [
  { Drug: "fentanyl", Time: 0, Dose: 60, Units: "mcg" },
  { Drug: "fentanyl", Time: 0, Dose: 0.15, Units: "mcg/kg/min" },
  { Drug: "fentanyl", Time: 30, Dose: 0, Units: "mcg/kg/min" }
];

const processedDoseTable = preprocessDose(doseTable, "ng", 70);


const maximum = 60;

const results = advanceClosedForm0(processedDoseTable, fentanylPK, maximum )

const postProcessedResults = postProcessResults(results, fentanyl, 100);

console.log(postProcessedResults)
