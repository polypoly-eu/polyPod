export function groupAnalysisByKey(analysisEntries, keyGroup) {
    const groupedAnalysisByKey = {};
    analysisEntries.forEach((entry) => {
        if (!groupedAnalysisByKey[entry[keyGroup]])
            groupedAnalysisByKey[entry[keyGroup]] = 1;
        else groupedAnalysisByKey[entry[keyGroup]] += 1;
    });
    return groupedAnalysisByKey;
}
