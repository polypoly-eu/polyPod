export const langConstants = {
    AccessLogImporter: {
        regex: /\/(Access Log Activity|Zugriffsprotokollaktivitäten|Aktiviteter i adgangsloggen)\/(Activities [-–] A list of Google services accessed by|Aktivitäten [-–] eine Liste der Google-Dienste, auf d|Aktiviteter [-–] en liste over Google-tjenester, som d)\.csv$/,
    },
    ActivitiesHtmlImporter: {
        regex: /\/(My Activity|Meine Aktivitäten|Mine aktiviteter|MyActivity|MeineAktivitäten|MineAktiviteter)\/.*\.html$/,
    },
    ActivitiesJsonImporter: {
        regex: /\/(My Activity|Meine Aktivitäten|Mine aktiviteter|MyActivity|MeineAktivitäten|MineAktiviteter)\/.*\.json$/,
    },
    SemanticLocationsImporter: {
        regex: /\/[^/]+\/(Semantic Location History)\/\d+\/[^.]+\.json$/,
    },
};
export function matchRegex(path, importer) {
    const importerName = importer.constructor.name;
    const normalizedPath = path.normalize("NFC");
    console.log(`matchRegex normalized path: ${normalizedPath}`);
    return langConstants[importerName].regex.test(normalizedPath);
}
