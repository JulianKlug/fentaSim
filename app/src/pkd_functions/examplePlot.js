import getDrugPK from "./getDrugPK.js";
import preprocessDose from "./preprocessDose.js";
import advanceClosedForm0 from "./advanceClosedForm0.js";
import postProcessResults from "./postProcessResults.js";
import { plot } from 'nodeplotlib';


const weight = 70
const fentanyl = getDrugPK('fentanyl', weight, 170, 50, 'male', 'scott');

const fentanylPK = fentanyl.PK[0];

const doseTable = [
  { Drug: "fentanyl", Time: 0, Dose: 150, Units: "mcg/min" },
  { Drug: "fentanyl", Time: 6, Dose: 0, Units: "mcg/min" },
];

const processedDoseTable = preprocessDose(doseTable, "ng", weight);


const maximum = 60;

const results = advanceClosedForm0(processedDoseTable, fentanylPK, maximum )

// const postProcessedResults = postProcessResults(results, fentanyl, 100);

// plot results Ce and Cp vs time
const plotTitle = 'FentaSim: 150mcg/min over 6min; 70kg';
const plotData = [
  {
    x: results.Time,
    y: results.Ce,
    type: 'line',
    name: 'Ce'
  },
  {
    x: results.Time,
    y: results.Cp,
    type: 'line',
    name: 'Cp'
  }
];
const plotLayout = { title: plotTitle, xaxis: { title: 'time' }, yaxis: { title: 'concentration' } };

plot(plotData, plotLayout);

