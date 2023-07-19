/**
 * Calculates fentanyl parameters based on weight, height, age, and sex.
 * @param {number} weight - Weight in kilograms.
 * @param {number} height - Height in centimeters.
 * @param {number} age - Age in years.
 * @param {string} sex - Sex (male or female).
 * @returns {Object} - Fentanyl parameters.
 */
function fentanyl(weight, height, age, sex) {
  // Units:
  // Time: Minutes
  // Volume: Liters
  // Data from:
  // 1 = McClain and Hug, Clin Pharmacol Ther. 1980;28:106-14.
  // 2 = Scott and Stanski, Anesthesiology. 1990;73:1091-102.
  // 3 = Hudson, Anesthesiology. 1986;64:334-8.
  // 4 = Varvel, Anesthesiology. 1989;70:928-34.
  // 5 = Shafer, Anesthesiology. 1990;73:1091-102.

  // Default parameters based on weight
  let v1 = 12.1 * (weight / 70);
  let v2 = 35.7 * (weight / 70);
  let v3 = 224 * (weight / 70);
  let cl1 = 0.632 * Math.pow(weight / 70, 0.75);
  let cl2 = 2.8 * Math.pow(weight / 70, 0.75);
  let cl3 = 1.55 * Math.pow(weight / 70, 0.75);

  let defaultParams = {
    v1: v1,
    v2: v2,
    v3: v3,
    cl1: cl1,
    cl2: cl2,
    cl3: cl3
  };

  let events = ["default"];
  let PK = events.map(x => getParams(x));

  let tPeak = 3.694; // from Shafer/Varvel, t_peaks.xls
  let MEAC = 0.6;
  let typical = MEAC * 1.2;
  let upperTypical = MEAC * 0.8;
  let lowerTypical = MEAC * 2.0;
  let reference = "JPET 1987,240:159-166";


  return {
    Drug: 'fentanyl',
    ConcentrationUnits: 'ng',
    BolusUnits: 'mcg',
    InfusionUnits: 'mcg/kg/hr',
    DefaultUnits: 'mcg',
    Units: ['mcg', 'mcg/kg', 'mcg/kg/hr'],
    Color: '#0491E2',
    PK: PK,
    tPeak: tPeak,
    MEAC: MEAC,
    Lower: 0.48,
    Upper: 1.2,
    endCe: 0.6,
    endCeText: 'ventilation',
    typical: typical,
    upperTypical: upperTypical,
    lowerTypical: lowerTypical,

    reference: reference
  };

  /**
   * Retrieves parameters based on the given event.
   * @param {string} event - Event name.
   * @returns {Object} - Parameters for the event.
   */
  function getParams(event) {
    return defaultParams;
  }
}


export default fentanyl;