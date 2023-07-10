import Graph from './components/Graph';
import {useEffect, useState} from "react";


function App() {
    const [doseHistory, setDoseHistory] = useState([]);
    const [concentrationEstimation, setConcentrationEstimation] = useState([]);

  function estimateConcentrationEvolution(currentConcentration, currentTimestamp) {
      const currentTimestampClone = new Date(currentTimestamp.getTime())
      // future concentrations will be an exponential decay, computed at 30s intervals
      const concentration_at_t = (t) => currentConcentration * Math.exp(-t / 10);
      const future_timestamps = Array.from({length: 10}, (_, i) => {
       return new Date(currentTimestampClone.setSeconds(currentTimestampClone.getSeconds() + i * 30))
      })
      const future_deltas_from_current_time = Array.from({length: 10}, (_, i) => i * 30);
      const future_concentrations = future_deltas_from_current_time.map(concentration_at_t);
      const future_concentrations_with_timestamps = future_concentrations.map((c, i) => ({x: future_timestamps[i], y: c}));
      return future_concentrations_with_timestamps;
  }

  function addDose() {
      const dose = 10;
    //   use current time as x value
    const currentTime = new Date();
    setDoseHistory([...doseHistory, {x: currentTime, y: dose}]);

    // get current concentration from last concentration estimation (find item with x value closest to current time)
    if (concentrationEstimation.length === 0) {
        setConcentrationEstimation(estimateConcentrationEvolution(dose, currentTime));
        return;
    } else {
        const currentConcentration = concentrationEstimation.reduce((prev, curr) => {
            return (Math.abs(curr.x - currentTime) < Math.abs(prev.x - currentTime) ? curr : prev);
        }).y;
        const newConcentration = currentConcentration + dose;
        const futureConcentrations = estimateConcentrationEvolution(newConcentration, currentTime);

        // add the new concentration to the existing concentration estimation up to the current time
        const newConcentrationEstimation = concentrationEstimation.filter((c) => c.x.getTime() <= currentTime.getTime());
        newConcentrationEstimation.push(...futureConcentrations);
        setConcentrationEstimation(newConcentrationEstimation);
    }
  }

  return (
    <div className="App">
        <div style={{width: '80vw', margin: 'auto', marginTop: '10vh', marginBottom: '5vh'}}>
             <Graph data={concentrationEstimation} />
        </div>
         <button
             style={{margin: 'auto', display: 'block'}}
             onClick={addDose}>
             Add Dose</button>
    </div>
  );
}

export default App;
