export const langConstants = {
    AccessLogImporter: {
        english: { regex: /\/Access Log Activity\/.*\.csv$/ },
        german: { regex: /\/Zugriffsprotokollaktivitäten\/.*\.csv$/ },
        danish: { regex: /\/Aktiviteter i adgangsloggen\/.*\.csv$/ },
    },
    ActivitiesImporter: {
        english: { regex: /\/My Activity\/.*\.html$/ },
        german: { regex: /\/Meine Aktivitäten\/.*\.html$/ },
        danish: { regex: /\/Mine aktiviteter\/.*\.html$/ },
    },
    SemanticLocationsImporter: {
        english: {
            regex: /\/[^/]+\/Semantic Location History\/\d+\/[^.]+\.json$/,
        },
        german: {
            regex: /\/[^/]+\/Semantic Location History\/\d+\/[^.]+\.json$/,
        },
        danish: {
            regex: /\/[^/]+\/Semantic Location History\/\d+\/[^.]+\.json$/,
        },
    },
};
export function matchRegex(path, importer) {
    const importerRegex = langConstants[importer];
    const language = Object.keys(importerRegex).find((key) =>
        importerRegex[key].regex.test(path)
    );
    if (language) return true;
    return false;
}
