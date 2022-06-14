export function groupAnalysisByKey(analysisEntries, keyGroup) {
    const groupedAnalysisByKey = {};
    analysisEntries.forEach((entry) => {
        groupedAnalysisByKey[entry[keyGroup]] =
            (groupedAnalysisByKey[entry[keyGroup]] || 0) + 1;
    });
    return groupedAnalysisByKey;
}
