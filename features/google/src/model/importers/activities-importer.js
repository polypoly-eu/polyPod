const activityRegex = /\/My Activity\/.*\.html$/;

class ActivityParser {
    constructor() {
        this._iframe = document.createElement("iframe");
        this._iframe.style.display = "none";
        document.body.appendChild(this._iframe);
    }

    _scrapeTimestamps(contentDocument) {
        const contentCells = contentDocument.querySelectorAll(
            ".mdl-grid>.mdl-cell>.mdl-grid>.content-cell:nth-child(2)"
        );
        return [...contentCells].map(
            ({ childNodes }) => childNodes[childNodes.length - 1].textContent
        );
    }

    async parse(entry) {
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const { contentDocument } = this._iframe;
        contentDocument.write(text);
        contentDocument.close();
        return this._scrapeTimestamps(contentDocument);
    }

    release() {
        document.body.removeChild(this._iframe);
        this._iframe = null;
    }
}

export default class ActivitiesImporter {
    async import({ zipFile, facebookAccount }) {
        const entries = await zipFile.getEntries();
        const activityEntries = entries.filter(({ path }) =>
            activityRegex.test(path)
        );

        const parser = new ActivityParser();
        facebookAccount.activities = (
            await Promise.all(
                activityEntries.map((entry) => parser.parse(entry))
            )
        ).flat();
        parser.release();
    }
}
