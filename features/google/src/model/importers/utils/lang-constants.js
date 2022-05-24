export const langConstants = {
    AccessLogImporter: {
        regex: /\/Access Log Activity|Zugriffsprotokollaktivitäten|Aktiviteter i adgangsloggen\/.*\.csv$/,
    },
    ActivitiesHtmlImporter: {
        regex: /\/(My Activity|Meine Aktivitäten|Mine aktiviteter)\/.*\.html$/,
    },
    ActivitiesJsonImporter: {
        regex: /\/(My Activity|Meine Aktivitäten|Mine aktiviteter)\/.*\.json$/,
    },
    SemanticLocationsImporter: {
        regex: /\/[^/]+\/Semantic Location History\/\d+\/[^.]+\.json$/,
    },
};
export function matchRegex(path, importer) {
    const importerName = importer.constructor;
    return langConstants[importerName].regex.test(path);
}
