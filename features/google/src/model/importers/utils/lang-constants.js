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
export function matchRegex(path, importerName) {
    // There can be non standard spaces in the path. Replace them with a normal space.
    const sanitizedPath = path.replace(
        /[\u00a0\u1680\u2000-\u200b\u202f\u205f\u3000\ufeff]/g,
        " "
    );
    const normalizedPath = sanitizedPath.normalize("NFC");
    const normalizedRegex = RegExp(
        langConstants[importerName].regex
            .toString()
            .normalize("NFC")
            .slice(1, -1)
    );
    return normalizedRegex.test(normalizedPath);
}
