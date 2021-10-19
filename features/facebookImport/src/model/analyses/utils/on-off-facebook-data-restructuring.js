const secondsPerDay = 86400;

export function daysBetween(timestampA, timestampB) {
    return Math.abs(Math.round((timestampA - timestampB) / secondsPerDay));
}

export function generate90DaysObject() {
    return Array.from({ length: 91 }, (_, i) => i).map((e) => {
        return { on: 0, off: 0 };
    });
}
