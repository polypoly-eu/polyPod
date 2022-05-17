import AccessLogEntry from "../entities/access-log-entry";

const accessLogRegex = /\/Access Log Activity\/.*\.csv$/;

class AccessLogParser {
    constructor() {}

    _scrapeTimestamps(contentDocument, productName) {
        const contentCells = contentDocument.querySelectorAll(
            ".mdl-grid>.mdl-cell>.mdl-grid>.content-cell:nth-child(2)"
        );
        return [...contentCells].map(
            ({ childNodes }) =>
                new AccessLogEntry({
                    timestamp: new Date(
                        childNodes[childNodes.length - 1].textContent
                    ),
                    productName: productName,
                })
        );
    }

    async parse(entry) {
        const content = await entry.getContent();
        debugger;
        const text = await new TextDecoder("utf-8").decode(content);
        const { contentDocument } = this._iframe;
        contentDocument.write(text);
        contentDocument.close();

        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        return this._scrapeTimestamps(contentDocument, productName);
    }

    release() {
        document.body.removeChild(this._iframe);
        this._iframe = null;
    }
}

export default class AccessLogImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await zipFile.getEntries();
        const accessLog = entries.filter(({ path }) =>
            accessLogRegex.test(path)
        );

        const parser = new AccessLogParser();
        googleAccount.activities = (
            await Promise.all(accessLog.map((entry) => parser.parse(entry)))
        ).flat();
        parser.release();
    }
}
