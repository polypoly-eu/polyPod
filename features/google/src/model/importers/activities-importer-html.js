import UserActivity from "../entities/user-activity";
import ActivityFileInfo from "../entities/activity-file-info";
import { convertFileSizeUnit } from "./utils/importer-utils";
import BaseActivitiesImporter from "./base-activities-importer";
class ActivityHtmlParser {
    constructor() {
        this._iframe = document.createElement("iframe");
        this._iframe.style.display = "none";
        document.body.appendChild(this._iframe);
    }

    _extractDate(text) {
        // Ignoring the timestamp for now - we don't need hourly accuracy at the
        // time of writing this.
        const datePattern =
            /[0-9]{1,2} [A-Z][a-z][a-z] [0-9]{4,4}, [0-9:]{8,8}/;
        const dateString = text.match(datePattern)?.[0];
        return dateString ? new Date(dateString) : null;
    }

    _scrapeTimestamps(contentDocument, productName) {
        const contentCells = contentDocument.querySelectorAll(
            ".mdl-grid>.mdl-cell>.mdl-grid>.content-cell:nth-child(2)"
        );
        return [...contentCells]
            .map(({ childNodes }) => {
                const timestamp = this._extractDate(
                    childNodes[childNodes.length - 1].textContent
                );
                if (!timestamp) return null;
                return new UserActivity({ timestamp, productName });
            })
            .filter((activity) => activity !== null);
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

export default class ActivitiesHtmlImporter extends BaseActivitiesImporter {
    constructor() {
        super(new ActivityHtmlParser());
    }
    async import({ zipFile, facebookAccount: googleAccount }) {
        await super.import({ zipFile, googleAccount });
        this._parser.release();
    }
}
