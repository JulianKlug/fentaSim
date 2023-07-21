import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import Graph from "./Graph";
import getDrugPK from "../pkd_functions/getDrugPK.js";
import preprocessDose from "../pkd_functions/preprocessDose.js";
import advanceClosedForm0 from "../pkd_functions/advanceClosedForm0.js";
import DoseInput from "./DoseInput";
import PatientInfoInput from "./PatientInfoInput";

const useStyles = makeStyles((theme) => ({
    simulator: {
        width: '80vw',
        margin: 'auto',
        marginTop: '5vh',
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
    const [referenceTime, setReferenceTime] = useState(new Date());
    const [concentrationEvolution, setConcentrationEvolution] = useState([]);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [age, setAge] = useState(70);
    const [sex, setSex] = useState('Male');
    const drug = 'fentanyl';
    const [drugInfo, setDrugInfo] = useState(getDrugPK(drug, weight, height, age, sex));

    // maximum time span to compute concentration evolution for (in minutes)
    const maximum = 60;
    const site = 'Effect Site'

    // Use effect to monitor changes in height, weight, age, sex, and update drugInfo
    useEffect(() => {
        const newDrugInfo = getDrugPK(drug, weight, height, age, sex)
        setDrugInfo(newDrugInfo)

        // if doseHistory is not empty, update concentrationEvolution
        if (doseHistory.length !== 0) {
            const processedDoseTable = preprocessDose(doseHistory, newDrugInfo.ConcentrationUnits, weight);
          const drugPK = newDrugInfo.PK[0];
          const results = advanceClosedForm0(processedDoseTable, drugPK, maximum)

              // set concentration evolution to x (results.time + reference time) and y (results.Cp)
                const newConcentrationEvolution = results.Time.map((t, i) => {
                    return {x: new Date(referenceTime + (t * 60 * 1000)), y: results.Ce[i], Cp: results.Cp[i]}
                });
            setConcentrationEvolution(newConcentrationEvolution);
        }
    }, [height, weight, age, sex]);


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
      const newDose = { Drug: drug, TimeDate: currentTime.getTime(), Dose: dose, Units: "mcg" }

      const [newDoseHistory, newReferenceTime] = updateDoseHistory(newDose);
      setReferenceTime(newReferenceTime);

      const processedDoseTable = preprocessDose(newDoseHistory, drugInfo.ConcentrationUnits, weight);
      const drugPK = drugInfo.PK[0];
      const results = advanceClosedForm0(processedDoseTable, drugPK, maximum)

      // set concentration evolution to x (results.time + reference time) and y (results.Cp)
        const newConcentrationEvolution = results.Time.map((t, i) => {
            return {x: new Date(newReferenceTime + (t * 60 * 1000)), y: results.Ce[i], Cp: results.Cp[i]}
        });
    setConcentrationEvolution(newConcentrationEvolution);
  }

    return (
    <div>
        <div>
            <PatientInfoInput age={age} height={height} weight={weight}  sex={sex}
                setAge={setAge} setHeight={setHeight} setWeight={setWeight} setSex={setSex}/>
        </div>
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