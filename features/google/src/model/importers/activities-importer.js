import UserActivity from "../entities/user-activity";

const activityHtmlRegex = /\/My Activity\/.*\.html$/;
const activityJsonRegex = /\/My Activity\/.*\.json$/;

class ActivityParser {
    constructor(isHtml) {
        this._isHtml = isHtml;
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
                    productName,
                })
        );
    }

    async parse(entry) {
        const content = await entry.getContent();
        if (!this._isHtml) {
            return this._parseJson(content, entry);
        }
        return await this._parseHtml(content, entry);
    }

    async _parseHtml(content, entry) {
        const text = await new TextDecoder("utf-8").decode(content);
        const { contentDocument } = this._iframe;
        contentDocument.write(text);
        contentDocument.close();

        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        return this._scrapeTimestamps(contentDocument, productName);
    }

    async _parseJson(content, entry) {
        const text = await new TextDecoder("utf-8").decode(content);
        const jsonObj = JSON.parse(text);
        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        return jsonObj.map(
            (entry) =>
                new UserActivity({
                    timestamp: new Date(entry.time),
                    productName,
                })
        );
    }

    release() {
        document.body.removeChild(this._iframe);
        this._iframe = null;
    }
}

export default class ActivitiesImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await zipFile.getEntries();
        const activityEntries = entries.filter(
            ({ path }) =>
                activityHtmlRegex.test(path) || activityJsonRegex.test(path)
        );
        const isHtml = activityHtmlRegex.test(activityEntries[0].path);
        const parser = new ActivityParser(isHtml);
        googleAccount.activities = (
            await Promise.all(
                activityEntries.map((entry) => parser.parse(entry))
            )
        ).flat();
        parser.release();
    }
}
