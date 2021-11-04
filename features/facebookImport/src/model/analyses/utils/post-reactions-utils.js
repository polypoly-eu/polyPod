export function groupDataByType(dataEntries) {
    const dataCountByType = {};
    dataEntries.forEach((dataEntry) => {
        if (!dataCountByType[dataEntry.type]) {
            dataCountByType[dataEntry.type] = 0;
        }
        dataCountByType[dataEntry.type]++;
    });

    const dataTypeCountPairs = [];
    for (const type in dataCountByType) {
        dataTypeCountPairs.push({
            type,
            count: dataCountByType[type],
        });
    }
    return dataTypeCountPairs.sort(function (pairA, pairB) {
        return pairB.count - pairA.count;
    });
}

export function groupPostReactionsByType(facebookAccount) {
    return groupDataByType(facebookAccount.postReactions);
}
