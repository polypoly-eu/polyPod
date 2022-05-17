import UserActivity from "../entities/user-activity";

const activityRegex = /\/My Activity\/.*\.html$/;

class ActivityParser {
    constructor() {
        this._iframe = document.createElement("iframe");
        this._iframe.style.display = "none";
        document.body.appendChild(this._iframe);
    }

    _scrapeTimestamps(contentDocument, productName) {
        const contentCells = contentDocument.querySelectorAll(
            ".mdl-grid>.mdl-cell>.mdl-grid>.content-cell:nth-child(2)"
        );
        return [...contentCells].map(
            ({ childNodes }) =>
                new UserActivity({
                    timestamp: new Date(
                        childNodes[childNodes.length - 1].textContent
                    ),
                    productName: productName,
                })
        );
    }

    async parse(entry) {
        const content = await entry.getContent();
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

export default class ActivitiesImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await zipFile.getEntries();
        const activityEntries = entries.filter(({ path }) =>
            activityRegex.test(path)
        );

        const parser = new ActivityParser();
        googleAccount.activities = (
            await Promise.all(
                activityEntries.map((entry) => parser.parse(entry))
            )
        ).flat();
        parser.release();
    }
}
