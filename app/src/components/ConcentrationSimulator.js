import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import Graph from "./Graph";
import getDrugPK from "../pkd_functions/getDrugPK.js";
import preprocessDose from "../pkd_functions/preprocessDose.js";
import advanceClosedForm0 from "../pkd_functions/advanceClosedForm0.js";
import DoseInput from "./DoseInput";
import MetaInput from "./MetaInput";
import DoseHistory from "./DoseHistory";
import RefreshButton from "./basicComponents/RefreshButton";


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
        marginBottom: '0.5vh'
    },
    refreshButtonPosition: {
        position: "absolute",
        top: '0',
        right: '1vw ',
    }
}));


const ConcentrationSimulator = ({ }) => {
    const classes = useStyles();
    const [doseHistory, setDoseHistory] = useState([]);
    const [referenceTime, setReferenceTime] = useState(new Date());
    // maximum time span to compute concentration evolution for (in minutes)
    const [maximum, setMaximum] = useState(60)
    const [concentrationEvolution, setConcentrationEvolution] = useState([]);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [age, setAge] = useState(70);
    const [sex, setSex] = useState('Male');
    const [model, setModel] = useState('scott');
    const drug = 'fentanyl';
    const [drugInfo, setDrugInfo] = useState(getDrugPK(drug, weight, height, age, sex, model));

    const site = 'Effect Site'


    // Use effect to monitor changes in height, weight, age, sex, and update drugInfo
    useEffect(() => {
        const newDrugInfo = getDrugPK(drug, weight, height, age, sex, model)
        setDrugInfo(newDrugInfo)

        // if doseHistory is not empty, update concentrationEvolution
        if (doseHistory.length !== 0) {
            const processedDoseTable = preprocessDose(doseHistory, newDrugInfo.ConcentrationUnits, weight);
            const drugPK = newDrugInfo.PK[0];
            const results = advanceClosedForm0(processedDoseTable, drugPK, maximum)

            // set concentration evolution to x (results.time + reference time) and y (results.Cp)
            const newConcentrationEvolution = results.Time.map((t, i) => {
                return { x: new Date(referenceTime + (t * 60 * 1000)), y: results.Ce[i], Cp: results.Cp[i] }
            });
            setConcentrationEvolution(newConcentrationEvolution);
        }
    }, [height, weight, age, sex, model]);

    
    // Update dose history and concentration evolution when a new dose is added, and return new dose history as well as reference timepoint
    const updateDoseHistory = (newDoseHistory) => {
        // get smallest time in doseHistory
        const referenceTime = newDoseHistory.reduce((prev, curr) => {
            return (curr.TimeDate < prev.TimeDate ? curr : prev);
        }).TimeDate;
        setReferenceTime(referenceTime);

        // get last dose time
        const lastDoseTime = newDoseHistory.reduce((prev, curr) => {
            return (curr.TimeDate > prev.TimeDate ? curr : prev);
        }).TimeDate;

        let minTimeSpan = 120;
        // let new maximum be time from referenceTime to lastDoseTime plus 120min (in minutes)
        const newMaximum = (lastDoseTime - referenceTime) / (60 * 1000) + minTimeSpan;
        setMaximum(newMaximum)

        // set Time to delta time from smallest time for every dose in doseHistory (in minutes)
        newDoseHistory.forEach((dose) => {
            dose.Time = (dose.TimeDate - referenceTime) / 1000 / 60;
        });
        setDoseHistory(newDoseHistory);

        return [newDoseHistory, referenceTime, lastDoseTime, newMaximum];
    }

    const updateConcentrationEvolution = (newDoseHistory, newReferenceTime, newMaximum) => {
        const processedDoseTable = preprocessDose(newDoseHistory, drugInfo.ConcentrationUnits, weight);
        const drugPK = drugInfo.PK[0];
        const results = advanceClosedForm0(processedDoseTable, drugPK, newMaximum)

        // set concentration evolution to x (results.time + reference time) and y (results.Cp)
        const newConcentrationEvolution = results.Time.map((t, i) => {
            return { x: new Date(newReferenceTime + (t * 60 * 1000)), y: results.Ce[i], Cp: results.Cp[i] }
        });
        setConcentrationEvolution(newConcentrationEvolution);
    };

    const addDoses = (doses) => {
        // doses is an array of objects with keys dose and time
        doses = doses.map((dose) => {
            const adminTime = new Date(dose.time);
            return { Drug: drug, TimeDate: adminTime.getTime(), Dose: dose.dose, Units: "mcg" }
        });
        const tempDoseHistory = [...doseHistory, ...doses];
        const [newDoseHistory, newReferenceTime, _, newMaximum] = updateDoseHistory(tempDoseHistory);
        updateConcentrationEvolution(newDoseHistory, newReferenceTime, newMaximum);
    }

    const addDose = (dose, time) => {
        addDoses([{ dose: dose, time: time}]);
    }

    const deleteDose = (index) => {
        const tempDoseHistory = [...doseHistory];
        tempDoseHistory.splice(index, 1);
        if (tempDoseHistory.length === 0) {
            setDoseHistory([]);
            setConcentrationEvolution([]);
            return;
        }
        const [newDoseHistory, newReferenceTime, _, newMaximum] = updateDoseHistory(tempDoseHistory);
        updateConcentrationEvolution(newDoseHistory, newReferenceTime, newMaximum);
    }

    return (
        <div>
            <div>
                <MetaInput age={age} height={height} weight={weight} sex={sex} model={model}
                    setAge={setAge} setHeight={setHeight} setWeight={setWeight} setSex={setSex} setModel={setModel} />
                <div className={classes.refreshButtonPosition}>
                    <RefreshButton />    
                </div>
            </div>
            <div className={classes.simulator}>
                <Graph data={concentrationEvolution} site={site} />
            </div>
            <div className={classes.doseInput}>
                <DoseInput
                    addDoses={addDoses}
                />
                <DoseHistory summaryContent={"Dose history"} doseHistory={doseHistory} deleteDose={deleteDose} />
            </div>
        </div>
    )
}

export default ConcentrationSimulator;