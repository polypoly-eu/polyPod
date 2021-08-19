import React from "react";
import { ZipFile } from "../model/storage.js";
import allStructure from "../static/allStructure";

function isJsonMessageFile(entryName, id) {
    const formattedEntryName = entryName.replace(`${id}/`, "");
    return /messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/[0-9_a-z]+\/message_[1-9][0-9]?.json$/.test(
        formattedEntryName
    );
}

async function jsonDataEntities(id, zipFile) {
    const entries = await zipFile.getEntries();
    const relevantEntries = entries
        .map((each) => each.replace(`${id}/`, ""))
        .filter(
            (each) =>
                !each.includes(".DS_Store") &&
                !each.includes("__MACOSX") &&
                !each.includes("/files/") && // Remove user files
                each.endsWith(".json")
        );
    return relevantEntries;
}

function anonymizePathSegment(pathSegment, fullPath) {
    if (
        fullPath.includes("messages") &&
        /^[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}$/.test(pathSegment)
    ) {
        return "uniqueid_hash";
    }
    return pathSegment;
}

function anonymizeJsonEntityPath(fileName) {
    const nameParts = fileName.split("/").slice(1);

    const anonymizedParts = nameParts.map((each) =>
        anonymizePathSegment(each, fileName)
    );
    return anonymizedParts.join("/");
}

const subAnalyses = [
    class {
        get title() {
            return "File name";
        }

        get id() {
            return "file-name";
        }

        parse({ name }) {
            this.active = true;
            this._name = name;
        }

        render() {
            return "" + this._name;
        }
    },
    class {
        get title() {
            return "File size";
        }

        get id() {
            return "file-size";
        }

        parse({ size }) {
            this.active = true;
            this._size = size;
        }

        render() {
            return "" + this._size;
        }
    },

    class {
        get title() {
            return "Messages";
        }

        get id() {
            return "messsages";
        }

        async _messagesCountFromFile(zipFile, messagesFile) {
            const fileContent = new TextDecoder("utf-8").decode(
                await zipFile.getContent(messagesFile)
            );
            if (!fileContent) {
                return 0;
            }
            try {
                const messagesData = JSON.parse(fileContent);
                const messagesList = messagesData?.messages;
                return messagesList ? messagesList.length : 0;
            } catch (exception) {
                //TODO: better error handling + error reporting
                console.log(exception);
                return 0;
            }
        }

        async parse({ id, zipFile }) {
            this._messageThreadsCount = 0;
            this._messagesCount = 0;
            this.active = false;
            if (!zipFile) return;
            const entries = await zipFile.getEntries();
            const messagesFiles = entries.filter((fileName) =>
                isJsonMessageFile(fileName, id)
            );
            this._messageThreadsCount = messagesFiles.length;
            const filesMessagesCount = await Promise.all(
                messagesFiles.map((messageFile) =>
                    this._messagesCountFromFile(zipFile, messageFile)
                )
            );
            this._messagesCount = filesMessagesCount.reduce((total, each) => {
                return total + each;
            }, 0);
            this.active = this._messagesCount > 0;
        }

        render() {
            if (!this.active) {
                return "No messages detected in your export!";
            }
            return (
                "Found " +
                this._messagesCount +
                " messages from " +
                this._messageThreadsCount +
                " threads"
            );
        }
    },

    class {
        get title() {
            return "Off-Facebook events";
        }

        get id() {
            return "off-Facebook-events";
        }

        async _readOffFacebooEvents(id, zipFile) {
            const entries = await zipFile.getEntries();
            const offFacebookEventsFile = entries.find((fileName) =>
                fileName.includes(
                    "apps_and_websites_off_of_facebook/your_off-facebook_activity.json"
                )
            );
            if (!offFacebookEventsFile) {
                return;
            }
            const fileContent = new TextDecoder("utf-8").decode(
                await zipFile.getContent(offFacebookEventsFile)
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

        async parse({ id, zipFile }) {
            this._eventsCount = 0;
            this._companiesCount = 0;
            this.active = false;
            if (!zipFile) return;

            const offFacebookEvents = await this._readOffFacebooEvents(
                id,
                zipFile
            );
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
            return "NoData Folders";
        }

        get id() {
            return "no-data-Folders";
        }

        get isForDataReport() {
            return true;
        }

        get jsonReport() {
            return {
                id: this.id,
                noDataFolderNames: this._noDataFolderNames,
            };
        }

        async parse({ id, zipFile }) {
            this._noDataFolderNames = [];
            this.active = false;
            if (!zipFile) return;
            const entries = await zipFile.getEntries();
            const extractedFolderNames = entries.map((fileName) => {
                const nameParts = fileName.replace(`${id}/`, "").split("/");
                if (nameParts.length >= 2) {
                    for (const [i, part] of Object.entries(nameParts)) {
                        if (part === "no-data.txt") {
                            return nameParts[i - 1];
                        }
                    }
                }
                return;
            });

            this._noDataFolderNames = extractedFolderNames.filter(
                (each) => each != null
            );
            this.active = this._noDataFolderNames.length > 0;
        }

        render() {
            return (
                <ul>
                    {this._noDataFolderNames.map((entry, index) => (
                        <li key={index}>{entry}</li>
                    ))}
                </ul>
            );
        }
    },
    class {
        get title() {
            return "Uknown JSON files";
        }

        get id() {
            return "uknown-json-files";
        }

        get isForDataReport() {
            return true;
        }

        get jsonReport() {
            return {
                id: this.id,
                unknownFiles: this._unknownFiles,
            };
        }

        async parse({ id, zipFile }) {
            this._missingEntryNames = [];
            this.active = true;
            if (!zipFile) return;

            const relevantEntries = await jsonDataEntities(id, zipFile);
            const anonymizedPaths = relevantEntries.map((each) =>
                anonymizeJsonEntityPath(each)
            );

            this._unknownFiles = anonymizedPaths.filter(
                (each) => !allStructure.includes(each)
            );
            this.active = this._unknownFiles.length > 0;
        }

        render() {
            return (
                <ul>
                    {this._unknownFiles.map((entry, index) => (
                        <li key={index}>{entry}</li>
                    ))}
                </ul>
            );
        }
    },
    class {
        get title() {
            return "Missing expected JSON files";
        }

        get id() {
            return "missing-expected-json-files";
        }

        get isForDataReport() {
            return true;
        }

        get jsonReport() {
            return {
                id: this.id,
                expectedMissingFiles: this._expectedMissingFiles,
            };
        }

        _knownJsonFiles() {
            const knowsJsonFileNames = allStructure.filter((each) =>
                each.endsWith(".json")
            );
            return knowsJsonFileNames.filter(
                (each) =>
                    !/^(posts|photos_and_videos)\/album\/[1-9][0-9]?.json$/.test(
                        each
                    ) &&
                    !/^messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/uniqueid_hash\/message_[2-9][0-9]?.json$/.test(
                        each
                    )
            );
        }

        async parse({ id, zipFile }) {
            this._expectedMissingFiles = [];
            this.active = true;
            if (!zipFile) return;

            const relevantEntries = await jsonDataEntities(id, zipFile);
            const anonymizedPaths = relevantEntries.map((each) =>
                anonymizeJsonEntityPath(each)
            );
            const knowsJsonFiles = this._knownJsonFiles();
            this._expectedMissingFiles = knowsJsonFiles.filter(
                (each) => !anonymizedPaths.includes(each)
            );
            this.active = this._expectedMissingFiles.length > 0;
        }

        render() {
            return (
                <ul>
                    {this._expectedMissingFiles.map((entry, index) => (
                        <li key={index}>{entry}</li>
                    ))}
                </ul>
            );
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

    get jsonReport() {
        if (!this.active) {
            return {};
        }
        const reportAnalyses = this.reportAnalyses
            .filter((analysis) => analysis.isForDataReport)
            .map((analysis) => analysis.jsonReport);
        const inactiveAnalyses = this.reportAnalyses
            .filter((analysis) => !analysis.isForDataReport)
            .map((analysis) => analysis.id);

        return { reportAnalyses, inactiveAnalyses };
    }
}

export async function analyzeFile(file) {
    const zipFile = new ZipFile(file, window.pod);
    const enrichedFile = { ...file, zipFile };
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
