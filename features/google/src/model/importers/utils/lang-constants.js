export const langConstants = {
    AccessLogImporter: {
        regex: /\/(Access Log Activity|Zugriffsprotokollaktivitäten|Aktiviteter i adgangsloggen)\/(Activities [-–] A list of Google services accessed by|Aktivitäten [-–] eine Liste der Google-Dienste, auf d|Aktiviteter [-–] en liste over Google-tjenester, som d)\.csv$/u,
    },
    ActivitiesHtmlImporter: {
        regex: /\/(My Activity|Meine Aktivitäten|Mine aktiviteter|MyActivity|MeineAktivitäten|MineAktiviteter)\/.*\.html$/u,
    },
    ActivitiesJsonImporter: {
        regex: /\/(My Activity|Meine Aktivitäten|Mine aktiviteter|MyActivity|MeineAktivitäten|MineAktiviteter)\/.*\.json$/u,
    },
    SemanticLocationsImporter: {
        regex: /\/[^/]+\/(Semantic Location History)\/\d+\/[^.]+\.json$/u,
    },
};
export function matchRegex(path, importerName) {
    // There can be non standard spaces in the path. Replace them with a normal space.
    const sanitizedPath = path.replace(
        /[\u00a0\u1680\u2000-\u200b\u202f\u205f\u3000\ufeff]/g,
        " "
    );
    return langConstants[importerName].regex.test(sanitizedPath);
}
