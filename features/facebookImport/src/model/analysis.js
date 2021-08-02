import { html } from "lit";
import * as zip from "@zip.js/zip.js";

const subAnalyses = [
    class {
        get title() {
            return "File ID";
        }

        parse({ id }) {
            this.active = true;
            this._id = id;
        }

        render() {
            return "" + this._id;
        }
    },
    class {
        get title() {
            return "File size";
        }

        parse({ data }) {
            this.active = true;
            this._size = data.length;
        }

        render() {
            return "" + this._size;
        }
    },

    class {
        get title() {
            return "Off-Facebook events";
        }

        async _readOffFacebooEvents(archiveReader) {
            const entries = await archiveReader.getEntries();
            const offFacebookEventsFile = entries.find((each) =>
                each.filename.includes(
                    "apps_and_websites_off_of_facebook/your_off-facebook_activity.json"
                )
            );
            if (!offFacebookEventsFile) {
                return;
            }
            const fileContent = await offFacebookEventsFile.getData(
                new zip.TextWriter()
            );
            if (!fileContent) {
                return;
            }
            return JSON.parse(fileContent);
        }

        async parse({ reader }) {
            this._eventsCount = 0;
            this._companiesCount = 0;
            this.active = false;
            if (!reader) return;

            const offFacebookEvents = await this._readOffFacebooEvents(reader);
            const activityV2 = offFacebookEvents?.off_facebook_activity_v2;
            if (!activityV2) {
                return;
            }
            this._companiesCount = activityV2.length;
            this._eventsCount = activityV2.reduce((total, companyEvents) => {
                if (companyEvents?.events) {
                    return total + companyEvents.events.length;
                }
                return total;
            }, 0);
            this.active = this._companiesCount > 0;
        }

        render() {
            if (this._companiesCount <= 0) {
                return "No events!";
            }
            return (
                "Found " +
                this._eventsCount +
                " events from " +
                this._companiesCount +
                " companies"
            );
        }
    },
    class {
        get title() {
            return "Hexdump of compressed data";
        }

        parse({ data }) {
            this.active = !!data.length;
            if (!this.active) return;
            this._hex = [...data]
                .map((i) => i.toString(16).padStart(2, "0"))
                .join(" ");
        }

        render() {
            return html`<code>${this._hex}</code>`;
        }
    },
    class {
        get title() {
            return "List of contents";
        }

        async parse({ reader }) {
            this.active = !!reader;
            if (!this.active) return;
            this._entries = await reader.getEntries();
        }

        render() {
            return html`<ul>
                ${this._entries.map(
                    (entry) => html`<li>${entry.filename}</li>`
                )}
            </ul>`;
        }
    },
];

class UnrecognizedData {
    get isUnrecognized() {
        return true;
    }

    get report() {
        return "Data goes here!!!";
    }
}

export async function analyzeFile(file) {
    const reader = new zip.ZipReader(new zip.Uint8ArrayReader(file.data));
    const enrichedFile = { ...file, reader };
    const parsedAnalyses = await Promise.all(
        subAnalyses.map(async (subAnalysisClass) => {
            const subAnalysis = new subAnalysisClass();
            await subAnalysis.parse(enrichedFile);
            return subAnalysis;
        })
    );
    const activeAnalyses = parsedAnalyses.filter((analysis) => analysis.active);
    return {
        analyses: activeAnalyses,
        unrecognizedData: new UnrecognizedData(),
    };
}
