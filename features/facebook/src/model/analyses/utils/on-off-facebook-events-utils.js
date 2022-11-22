export function groupOffFacebookEventsByType(facebookAccount) {
    const eventsCountByType = {};
    facebookAccount.forEachOffFacebookEvent((event) => {
        if (!eventsCountByType[event.type]) {
            eventsCountByType[event.type] = 0;
        }
        eventsCountByType[event.type]++;
    });

    const eventsTypeCountPairs = [];
    for (const type in eventsCountByType) {
        eventsTypeCountPairs.push({
            type,
            count: eventsCountByType[type],
        });
    }

    return eventsTypeCountPairs.sort(function (pairA, pairB) {
        return pairB.count - pairA.count;
    });
}
