export function isCamelCase(string) {
    //contains uppercase and no spaces
    return /[A-Z]/.test(string) && !/\s/.test(string);
}

export function convertCamelCaseToHyphen(string) {
    return string.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}
