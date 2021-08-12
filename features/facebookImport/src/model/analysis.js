import { html } from "lit";
import * as zip from "@zip.js/zip.js";
import allStructure from "../static/allStructure";

async function jsonDataEntities(reader) {
    const entries = await reader.getEntries();
    const relevantEntries = entries.filter(
        (each) =>
            !each.filename.includes(".DS_Store") &&
            !each.filename.includes("__MACOSX") &&
            !each.filename.includes("/files/") && // Remove user files
            each.filename.endsWith(".json")
    );
    return relevantEntries;
}

function anonymisePathSegment(pathSegment, isFileName, fullPath) {
    let anonymizedSegment = pathSegment;

    if (
        fullPath.includes("messages") &&
        /^[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}$/.test(anonymizedSegment)
    ) {
        anonymizedSegment = "uniqueid_hash";
    }

    return anonymizedSegment;
}

function anonymiseJsonEntityPath(entity) {
    const fileName = entity.filename;
    const nameParts = fileName.split("/").slice(1);

    const anonymisedParts = nameParts.map((each) =>
        anonymisePathSegment(each, false, fileName)
    );
    return anonymisedParts.join("/");
}

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

        async _readOffFacebooEvents(reader) {
            const entries = await reader.getEntries();
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
            try {
                return JSON.parse(fileContent);
            } catch (exception) {
                //TODO: better error handling + error reporting
                console.log(exception);
                return;
            }
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
            if (!this.active) {
                return "No off-facebook events detected in your export!";
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
    class {
        get title() {
            return "NoData Folders";
        }

        get isForDataReport() {
            return true;
        }

        async parse({ reader }) {
            this._noDataFolderNames = [];
            this.active = false;
            if (!reader) return;

            const entries = await reader.getEntries();
            const extractedFolderNames = entries.map((entry) => {
                const fileName = entry.filename;
                const nameParts = fileName.split("/");
                if (nameParts.length >= 3 && nameParts[2] === "no-data.txt") {
                    return nameParts[1];
                }
                return;
            });

            this._noDataFolderNames = extractedFolderNames.filter(
                (each) => each != null
            );
            this.active = this._noDataFolderNames.length > 0;
        }

        render() {
            return html`<ul>
                ${this._noDataFolderNames.map(
                    (entry) => html`<li>${entry}</li>`
                )}
            </ul>`;
        }
    },
    class {
        get title() {
            return "Uknown JSON files";
        }

        get isForDataReport() {
            return true;
        }

        async parse({ reader }) {
            this._missingEntryNames = [];
            this.active = true;
            if (!reader) return;

            const relevantEntries = await jsonDataEntities(reader);
            const anonymizedPaths = relevantEntries.map((each) =>
                anonymiseJsonEntityPath(each)
            );

            this._unknownFiles = anonymizedPaths.filter(
                (each) => !allStructure.includes(each)
            );
            this.active = this._unknownFiles.length > 0;
        }

        render() {
            return html`<ul>
                ${this._unknownFiles.map((entry) => html`<li>${entry}</li>`)}
            </ul>`;
        }
    },
    class {
        get title() {
            return "Missing expected JSON files";
        }

        get isForDataReport() {
            return true;
        }

        _knownJsonFiles() {
            const knowsJsonFiles = allStructure.filter((each) =>
                each.endsWith(".json")
            );
            return knowsJsonFiles.filter(
                (each) =>
                    !/^(posts|photos_and_videos)\/album\/[1-9][0-9]?.json$/.test(
                        each
                    ) &&
                    !/^messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/uniqueid_hash\/message_[2-9][0-9]?.json$/.test(
                        each
                    )
            );
        }

        async parse({ reader }) {
            this._expectedMissingFiles = [];
            this.active = true;
            if (!reader) return;

            const relevantEntries = await jsonDataEntities(reader);
            const anonymizedPaths = relevantEntries.map((each) =>
                anonymiseJsonEntityPath(each)
            );

            const knowsJsonFiles = this._knownJsonFiles();
            this._expectedMissingFiles = knowsJsonFiles.filter(
                (each) => !anonymizedPaths.includes(each)
            );
            this.active = this._expectedMissingFiles.length > 0;
        }

        render() {
            return html`<ul>
                ${this._expectedMissingFiles.map(
                    (entry) => html`<li>${entry}</li>`
                )}
            </ul>`;
        }
    },
];

class UnrecognizedData {
    constructor(reportAnalyses) {
        this.reportAnalyses = reportAnalyses;
        this.active = this.reportAnalyses && this.reportAnalyses.length > 0;
    }

    get report() {
        if (!this.active) {
            return "No data to report!";
        }
        return this.reportAnalyses.length + " analyses included in the report";
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

    const activeAnalyses = parsedAnalyses.filter(
        (analysis) => !analysis.isForDataReport && analysis.active
    );
    const reportAnalyses = parsedAnalyses.filter(
        (analysis) =>
            (analysis.isForDataReport && analysis.active) ||
            (!analysis.isForDataReport && !analysis.active)
    );

    return {
        analyses: activeAnalyses,
        unrecognizedData: new UnrecognizedData(reportAnalyses),
    };
}
