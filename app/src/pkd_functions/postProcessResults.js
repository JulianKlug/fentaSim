import getDrugPK from "./getDrugPK.js";
import preprocessDose from "./preprocessDose.js";
import advanceClosedForm0 from "./advanceClosedForm0.js";

/**

 Performs post-processing on the results data.
 @param {Object} results - Results object.
 @param {Object} pk - PK object.
 @param {number} resolution - Resolution value.
 @returns {Object} - Post-processed data.
 */
function postProcessResults(results, pk, resolution) {
// Rename the columns in the results object
    results = {
        Time: results.Time,
        Plasma: results.Cp,
        "Effect Site": results.Ce,
        Recovery: results.Recovery
    };
// Calculate the maximum Cp and Ce values
    const maxCp = Math.max(...results.Plasma);
    const maxCe = Math.max(...results["Effect Site"]);

    if (maxCp === 0) {
// Normalize Cp and Ce to 0 if maxCp is 0
        results.CpNormCp = Array(results.Plasma.length).fill(0);
        results.CeNormCp = Array(results["Effect Site"].length).fill(0);
        results.CpNormCe = Array(results.Plasma.length).fill(0);
        results.CeNormCe = Array(results["Effect Site"].length).fill(0);
    } else {
// Normalize Cp and Ce using maxCp and maxCe
        results.CpNormCp = results.Plasma.map(cp => (cp / maxCp) * 100);
        results.CeNormCp = results["Effect Site"].map(ce => (ce / maxCp) * 100);
        results.CpNormCe = results.Plasma.map(cp => (cp / maxCe) * 100);
        results.CeNormCe = results["Effect Site"].map(ce => (ce / maxCe) * 100);
    }

// Generate equiSpace data frame
    const xout = Array.from({length: resolution + 1}, (_, i) => (i / resolution) * maximum);
    const equiSpace = {
        Drug: pk.drug,
        Time: xout,
        Ce: interpolate(results.Time, results["Effect Site"], xout),
        Recovery: interpolate(results.Time, results.Recovery, xout)
    };
    equiSpace.Ce[0] = 0;

    if (pk.MEAC === 0) {
        equiSpace.MEAC = Array(xout.length).fill(0);
    } else {
        equiSpace.MEAC = equiSpace.Ce.map(ce => (ce / pk.MEAC) * 100);
    }

// Calculate maximum values
    const maxValues = {
        Drug: pk.drug,
        Recovery: Math.max(...results.Recovery),
        Cp: Math.max(...results.Plasma),
        Ce: Math.max(...results["Effect Site"])
    };

// Remove Recovery column from the results object
    delete results.Recovery;
    results.Drug = pk.drug;

    return {results, equiSpace, max: maxValues};
}

/**
 Interpolates values for a given x and y data using linear interpolation.
 @param {Array} x - x data.
 @param {Array} y - y data.
 @param {Array} xout - x values to interpolate.
 @returns {Array} - Interpolated y values.
 */
function interpolate(x, y, xout) {
    return xout.map((xVal) => {
        const index = findIndex(x, (val) => val >= xVal);
        if (index === -1) return 0;
        if (x[index] === xVal) return y[index];
        const x0 = x[index - 1];
        const x1 = x[index];
        const y0 = y[index - 1];
        const y1 = y[index];
        const ratio = (xVal - x0) / (x1 - x0);
        return y0 + ratio * (y1 - y0);
    });
}


/**
 Finds the index of the first element in an array that satisfies the condition.
 @param {Array} array - The input array.
 @param {Function} condition - The condition function.
 @returns {number} - The index of the found element, or -1 if not found.
 */
function findIndex(array, condition) {
    for (let i = 0; i < array.length; i++) {
        if (condition(array[i])) return i;
    }
    return -1;
}

export default postProcessResults;

