import UserActivity from "../entities/user-activity";
import ActivityFileInfo from "../entities/activity-file-info";
import { convertFileSizeUnit } from "./utils/importer-utils";
import BaseActivitiesImporter from "./base-activities-importer";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import namedOffsets from "./utils/namedOffsets.json";

dayjs.extend(customParseFormat);

class ActivityHtmlParser {
    constructor() {
        this._iframe = document.createElement("iframe");
        this._iframe.style.display = "none";
        document.body.appendChild(this._iframe);
    }

    _extractDate(text) {
        // Known formats:
        // 3 Feb 2001, 16:05:06 UTC
        // Feb 3, 2001, 4:05:06 PM UTC
        // 03.02.2001, 16:05:06 UTC

        // Replace named time offsets with UTC
        for (const [key, value] of Object.entries(namedOffsets)) {
            const newText = text.replace(RegExp(` ${key}$`), " " + value);
            if (newText != text) {
                text = newText;
                break;
            }
        }

        let date = dayjs(text).$d;

        // dayjs cannot parse 03.02.2001, 16:05:06 UTC without help
        if (date.toString() === "Invalid Date") {
            date = dayjs(text, ["DD.MM.YYYY", "DD/MM/YYYY"]).$d;
        }

        if (!date || date === null || date.toString() === "Invalid Date") {
            console.log(`Error: Unable to parse date format ${text}`);
        }

        return date;
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
    async import({ zipFile, account: googleAccount }) {
        await super.import({ zipFile, googleAccount });
        this._parser.release();
    }
}
