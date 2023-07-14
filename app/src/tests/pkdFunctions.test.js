import advanceState from '../pkd_functions/advanceState';
import calculateCe from '../pkd_functions/calculateCe';
import fentanyl from '../pkd_functions/fentanyl';
import preprocessDose from '../pkd_functions/preprocessDose';
import solveCubic from '../pkd_functions/solveCubic';
import CE from '../pkd_functions/CE';

test('advanceState: Output of advanceState matches Output of R version', () => {
  expect(advanceState([0,1,2,3], [0,1,2,3], [1,2,3,0], 0, 4)).toStrictEqual([ 1, 4, 13, 42 ]);
});

test('calculateCe: Output of calculateCe matches Output of R version', () => {
  expect(calculateCe([1,2,3], [1,2,3], [1,2,3], 3)).toStrictEqual([ 0, 1.7362632708334493, 2.888870053391266 ]);
});


test('fentanyl: Output of fentanyl matches Output of R version', () => {
  expect(fentanyl(80, 180, 80, "male")).toStrictEqual(
      {
                PK: [
                  {
                    v1: 13.828571428571427,
                    v2: 40.800000000000004,
                    v3: 256,
                    cl1: 0.6985717814909526,
                    cl2: 3.0949382724282706,
                    cl3: 1.713269400808507
                  }
                ],
                tPeak: 3.694,
                MEAC: 0.6,
                typical: 0.72,
                upperTypical: 0.48,
                lowerTypical: 1.2,
                reference: 'JPET 1987,240:159-166'
              }
  )
});

test('preprocessDose: Output of preprocessDose matches Output of R version', () => {
    // Example usage
    const doseTable = [
      { Drug: "fentanyl", Time: 0, Dose: 60, Units: "mcg" },
      { Drug: "fentanyl", Time: 0, Dose: 0.15, Units: "mcg/kg/min" },
      { Drug: "fentanyl", Time: 30, Dose: 0, Units: "mcg/kg/min" }
    ];

    const processedDoseTable = preprocessDose(doseTable, "ng", 80);

    expect(processedDoseTable).toStrictEqual(
        [
          {
            Drug: 'fentanyl',
            Time: 0,
            Dose: 60,
            Units: 'mcg',
            Bolus: true,
            PO: false,
            IM: false,
            IN: false
          },
          {
            Drug: 'fentanyl',
            Time: 0,
            Dose: 12,
            Units: 'mcg/kg/min',
            Bolus: false,
            PO: false,
            IM: false,
            IN: false
          },
          {
            Drug: 'fentanyl',
            Time: 30,
            Dose: 0,
            Units: 'mcg/kg/min',
            Bolus: false,
            PO: false,
            IM: false,
            IN: false
          }
        ]
    )
})

test('solveCubic: Output of solveCubic matches Output of R version', () => {
    expect(solveCubic(1, 2, 3, 4, 5)).toStrictEqual(
        [ 10.185799316824578, 4.364295805565773, 0.4499048776096499 ]
    )
})


test('CE: Output of CE matches Output of R version', () => {
    expect(CE(1, 1, 2, 3, 4, 1, 2, 3, 4)).toStrictEqual(
        0.8611737683031964);
})