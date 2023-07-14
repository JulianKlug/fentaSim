/**
 * One-dimensional optimization using the golden section search and successive parabolic interpolation method.
 *
 * @param {function} f The function to be optimized. The function is either minimized or maximized over its first argument depending on the value of maximum.
 * @param {number[]} interval A vector containing the end-points of the interval to be searched for the minimum.
 * @param {object} options Additional named or unnamed arguments to be passed to f.
 * @param {number} options.lower The lower end point of the interval to be searched.
 * @param {number} options.upper The upper end point of the interval to be searched.
 * @param {boolean} options.maximum Should we maximize or minimize (default is false)?
 * @param {number} options.tol The desired accuracy.
 * @returns {object} An object with properties 'minimum' and 'objective' representing the location of the minimum (or maximum) and the value of the function at that point.
 */
function optimize(f, interval, options = {}, functionArgs = {}) {
  const { lower = Math.min(...interval), upper = Math.max(...interval), maximum = false, tol = Math.sqrt(Number.EPSILON) ** 0.25 } = options;

  const gr = (Math.sqrt(5) + 1) / 2; // Golden section ratio

  let a = lower;
  let b = upper;
  let c = b - (b - a) / gr;
  let d = a + (b - a) / gr;

  let fa = f(a, functionArgs);
  let fb = f(b, functionArgs);
  let fc, fd;

  while (Math.abs(c - d) > tol) {
    fc = f(c, functionArgs);
    fd = f(d, functionArgs);

    if (maximum) {
      if (fc > fd) {
        b = d;
        fb = fd;
      } else {
        a = c;
        fa = fc;
      }
    } else {
      if (fc < fd) {
        b = d;
        fb = fd;
      } else {
        a = c;
        fa = fc;
      }
    }

    c = b - (b - a) / gr;
    d = a + (b - a) / gr;
  }

  const minimum = (b + a) / 2;
  const objective = f(minimum, functionArgs);

  return { minimum, objective };
}

export default optimize;

