export function latestTimestamp(timestamps) {
    debugger;
    return timestamps.reduce(
        (maxim, current) => (current > maxim ? current : maxim),
        0
    );
}

const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
export function filterForDurationInDays(
    timestamps,
    referenceTimestamp,
    daysCount
) {
    const referenceDate = new Date(referenceTimestamp * 1000);
    return timestamps.filter((timestamp) => {
        const date = new Date(timestamp * 1000);
        const diffTime = Math.abs(referenceDate - date);
        const diffDays = Math.ceil(diffTime / MILISECONDS_IN_DAY);
        return diffDays < daysCount;
    });
}

export function toUnixTimestamp(dateString) {
    return Math.round(new Date(dateString).getTime() / 1000);
}
