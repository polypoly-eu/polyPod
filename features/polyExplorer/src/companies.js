export function compare(a, b) {
    if (startsWithSpecialChar(a) && startsWithSpecialChar(b))
        return compare(a.slice(1), b.slice(1));
    if (startsWithSpecialChar(a)) return compare(a.slice(1), b);
    if (startsWithSpecialChar(b)) return compare(a, b.slice(1));
    else {
        return a.localeCompare(b);
    }
}

export function startsWithSpecialChar(aString) {
    var format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    return format.test(aString.charAt(0));
}
