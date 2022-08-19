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

        // Known formats:
        // 3 Feb 2001, 16:05:06 UTC
        // Feb 3, 2001, 4:05:06 PM UTC
        // 03.02.2001, 16:05:06 UTC

        let date = new Date(text);

        if (date && date !== null && date.toString() !== "Invalid Date") {
            return date;
        }

        date = null;

        const datePatterns = [
            /([A-Z][a-z][a-z]) ([0-9]{1,2}), ([0-9]{4,4}), ([0-9:]{7,8} [A|P]M) ([A-Z]{3,4})/,
            /([0-9]{1,2}) ([A-Z][a-z][a-z]) ([0-9]{4,4}), ([0-9:]{8,8}) ([A-Z]{3,4})/,
            /([0-9]{1,2}).([0-9]{1,2}).([0-9]{4,4}), ([0-9:]{8,8}) ([A-Z]{3,4})/,
        ];

        // Add +1 to the index because the entire matched string will be at index 0 in match.
        const dateMaps = [
            {
                day: 2,
                month: 1,
                year: 3,
                time: 4,
                timezone: 5,
            },
            {
                day: 1,
                month: 2,
                year: 3,
                time: 4,
                timezone: 5,
            },
            {
                day: 1,
                month: 2,
                year: 3,
                time: 4,
                timezone: 5,
            },
        ];

        const month2Name = {
            "01": "Jan",
            1: "Jan",
            "02": "Feb",
            2: "Feb",
            "03": "Mar",
            3: "Mar",
            "04": "Apr",
            0: "Apr",
            "05": "May",
            5: "May",
            "06": "Jun",
            6: "Jun",
            "07": "Jul",
            7: "Jul",
            "08": "Aug",
            8: "Aug",
            "09": "Sep",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec",
        };

        for (let index = 0; index < datePatterns.length; index++) {
            const match = text.match(datePatterns[index]);
            if (match && match.length > 0) {
                const day = match[dateMaps[index]["day"]];
                let month = match[dateMaps[index]["month"]];
                const year = match[dateMaps[index]["year"]];

                if (!isNaN(parseInt(month))) {
                    month = month2Name[month];
                }

                const dateString = `${day} ${month} ${year}`;
                date = new Date(dateString);
                break;
            }
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
        console.log(
            `ActivityHtmlParser: Decoding entry at path: ${entry.path}`
        );
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const { contentDocument } = this._iframe;
        contentDocument.write(text);
        contentDocument.close();
        const fileSize = convertFileSizeUnit(content.byteLength);
        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        console.log(
            `ActivityHtmlParser: Decoded entry at path: ${entry.path}, fileSize: ${fileSize}`
        );
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
