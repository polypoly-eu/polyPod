import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import UserActivity from "../entities/user-activity";
import { matchRegex } from "./utils/lang-constants";

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

        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        return this._scrapeTimestamps(contentDocument, productName);
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
        googleAccount.activities.push(
            ...(
                await Promise.all(
                    activityEntries.map((entry) => parser.parse(entry))
                )
            ).flat()
        );
        parser.release();
    }
}
