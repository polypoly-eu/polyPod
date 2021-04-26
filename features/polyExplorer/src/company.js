export function compare(a, b) {
    if (startsWithSpecialChar(a)) return compare(a.slice(1), b);
    if (startsWithSpecialChar(b)) return compare(a, b.slice(1));
    return a.localeCompare(b);
}

function startsWithSpecialChar(aString) {
    var format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|§,.<>/?~„]/;
    return format.test(aString.charAt(0));
}

export function getFirstNormalCharacter(aString) {
    return startsWithSpecialChar(aString)
        ? getFirstNormalCharacter(aString.slice(1))
        : aString[0];
}
