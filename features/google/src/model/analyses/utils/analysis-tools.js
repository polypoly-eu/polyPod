export function groupAnalysisByKey(anlaysisEntries, keyGroup) {
    const groupedAnalysisByKey = {};
    anlaysisEntries.forEach((entry) => {
        if (!groupedAnalysisByKey[entry[keyGroup]])
            groupedAnalysisByKey[entry[keyGroup]] = 1;
        else groupedAnalysisByKey[entry[keyGroup]] += 1;
    });
}
