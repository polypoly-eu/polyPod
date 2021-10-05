const stepBasis = [
    0,
    0.2,
    0.5,
    "next",
    1,
    1,
    1,
    "next",
    2,
    "nextPowerOfTen",
    "nextPowerOfTen",
];

/**
 * Generate a scale with decent step number values from any number
 * Limited to positive numbers
 * @param {Number} aNumber - Any number
 * @returns {Number[]} - Scale where this number fits in
 */
export default function generateScale(aNumber) {
    let log10 = Math.floor(Math.log10(aNumber));
    const decimalNumber = +(aNumber / Math.pow(10, log10)).toPrecision(10);
    let nextHigherInteger = Math.ceil(decimalNumber);
    if (stepBasis[nextHigherInteger] == "next") nextHigherInteger++;
    if (stepBasis[nextHigherInteger] == "nextPowerOfTen") {
        nextHigherInteger = 1;
        log10++;
    }
    const scale = [];
    for (
        let step = stepBasis[nextHigherInteger];
        step <= nextHigherInteger;
        step += stepBasis[nextHigherInteger]
    ) {
        scale.push(Math.round(step * 10) / 10);
    }
    if (decimalNumber < scale[scale.length - 2]) scale.pop();
    return log10 == 0
        ? scale
        : scale.map(
              (val) =>
                  +(val * Math.pow(10, log10)).toPrecision(Math.abs(log10 + 1))
          );
}
