import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import UserActivity from "../entities/user-activity";
import ActivityFileInfo from "../entities/activity-file-info";
import { matchRegex } from "./utils/lang-constants";
import { convertFileSizeUnit } from "./utils/importer-utils";
class ActivityHtmlParser {
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
                    productName,
                })
        );
    }

    async parse(entry) {
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const { contentDocument } = this._iframe;
        contentDocument.write(text);
        contentDocument.close();
        const fileSize = convertFileSizeUnit(content.byteLength);
        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        return {
            userActivity: this._scrapeTimestamps(contentDocument, productName),
            fileInfo: new ActivityFileInfo({
                productName,
                fileSize,
            }),
        };
    }

    release() {
        document.body.removeChild(this._iframe);
        this._iframe = null;
    }
}

export default class ActivitiesHtmlImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const activityEntries = entries.filter(({ path }) =>
            matchRegex(path, this)
        );
        const parser = new ActivityHtmlParser();
        const parserOutput = await Promise.all(
            activityEntries.map((entry) => parser.parse(entry))
        );
        googleAccount.activities.push(
            ...parserOutput.map((output) => output.userActivity).flat()
        );
        googleAccount.activityFileInfo.push(
            ...parserOutput.map((output) => output.fileInfo)
        );
        parser.release();
    }
}
