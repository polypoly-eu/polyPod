/*
    A function to generate a nice looking scale from any number
    Returns an array (scale)
*/

function generateScale(aNumber) {
    const log10 = Math.log10(aNumber);
    const decimalNumber = aNumber / Math.pow(10, log10 - 1);
    console.log(decimalNumber);
}

generateScale();
