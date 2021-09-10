const stepBasis = [0, 0.2, 0.5, "next", 1, 1, 1, "next", 2, "nextPow"];

/**
 * Generate a scale with decent step number values from any number
 * Limted to 10 decimal places and only positive numbers
 * @param {Number} aNumber - Any number
 * @returns {Number[]} - Scale where this number fits in
 */
export default function generateScale(aNumber) {
    let log10 = Math.floor(Math.log10(aNumber));
    const decimalNumber = aNumber / Math.pow(10, log10);
    let nextHigherInteger = Math.ceil(decimalNumber);
    if (stepBasis[nextHigherInteger] == "next") nextHigherInteger++;
    if (stepBasis[nextHigherInteger] == "nextPow") {
        nextHigherInteger = 1;
        log10++;
    }
    const scale = [];
    for (
        let step = 0;
        step <= nextHigherInteger;
        step += stepBasis[nextHigherInteger]
    ) {
        scale.push(Math.round(step * 10) / 10);
    }
    if (decimalNumber < scale[scale.length - 2]) scale.pop();
    return scale.map((val) => val * Math.pow(10, log10));
}
