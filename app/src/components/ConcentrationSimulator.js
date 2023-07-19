import {makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
import Graph from "./Graph";
import getDrugPK from "../pkd_functions/getDrugPK.js";
import preprocessDose from "../pkd_functions/preprocessDose.js";
import advanceClosedForm0 from "../pkd_functions/advanceClosedForm0.js";
import DoseInput from "./DoseInput";


const useStyles = makeStyles((theme) => ({
    simulator: {
        width: '80vw',
        margin: 'auto',
        marginTop: '10vh',
        marginBottom: '5vh'
    },
    doseInput: {
        width: '90%',
        margin: 'auto',
    }

}));

const ConcentrationSimulator = ({}) => {
    const classes = useStyles();
    const [doseHistory, setDoseHistory] = useState([]);
    const [concentrationEvolution, setConcentrationEvolution] = useState([]);

    const weight = 70;
    const height = 170;
    const age = 50;
    const sex = 'male'
    const fentanyl = getDrugPK('fentanyl', weight, height, age, sex);
    const fentanylPK = fentanyl.PK[0];
    const maximum = 60;
    const site = 'Effect Site'

    // Update dose history and concentration evolution when a new dose is added, and return new dose history as well as reference timepoint
    const updateDoseHistory = (newDose) => {
        const tempDoseHistory = [...doseHistory, newDose];
        // get smallest time in doseHistory
        const referenceTime = tempDoseHistory.reduce((prev, curr) => {
            return (curr.TimeDate < prev.TimeDate ? curr : prev);
        }).TimeDate;
        // set Time to delta time from smallest time for every dose in doseHistory (in minutes)
        tempDoseHistory.forEach((dose) => {
            dose.Time = (dose.TimeDate - referenceTime) / 1000 / 60;
        });
        setDoseHistory(tempDoseHistory);
        return [tempDoseHistory, referenceTime];
    }

  const addDose = (dose, time) => {
        // dose in mcg
      const currentTime = new Date(time);
      const newDose = { Drug: "fentanyl", TimeDate: currentTime.getTime(), Dose: dose, Units: "mcg" }

      const [newDoseHistory, referenceTime] = updateDoseHistory(newDose);

      const processedDoseTable = preprocessDose(newDoseHistory, fentanyl.ConcentrationUnits, weight);
      const results = advanceClosedForm0(processedDoseTable, fentanylPK, maximum)

      // set concentration evolution to x (results.time + reference time) and y (results.Cp)
        const newConcentrationEvolution = results.Time.map((t, i) => {
            return {x: new Date(referenceTime + (t * 60 * 1000)), y: results.Ce[i], Cp: results.Cp[i]}
        });
    setConcentrationEvolution(newConcentrationEvolution);
  }

    return (
    <div>
        <div className={classes.simulator}>
            <Graph data={concentrationEvolution} site={site} />
        </div>
        <div className={classes.doseInput}>
        <DoseInput
            addDose={addDose}
        />
        </div>
    </div>
    )
}

export default ConcentrationSimulator;