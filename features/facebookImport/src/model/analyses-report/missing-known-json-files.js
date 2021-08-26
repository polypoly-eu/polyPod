import React from "react";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import allStructure from "../../static/allStructure";
import RootAnalysis from "../analyses/root-analysis.js";

export default class MissingKnownJSONFilesAnalysis extends RootAnalysis {
    get title() {
        return "Missing known JSON files";
    }

    get isForDataReport() {
        return true;
    }

    get jsonReport() {
        return {
            id: this.id,
            missingKnownFileNames: this._missingKnownFileNames,
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

    async analyze({ id, zipFile }) {
        this._missingKnownFileNames = [];
        this.active = true;
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(zipFile);
        const anonymizedPaths = relevantEntries.map((each) =>
            anonymizeJsonEntityPath(each.replace(`${id}/`, ""))
        );
        const knowsJsonFiles = this._knownJsonFiles();
        this._missingKnownFileNames = knowsJsonFiles.filter(
            (each) => !anonymizedPaths.includes(each)
        );
        this.active = this._missingKnownFileNames.length > 0;
    }

    render() {
        return (
            <ul>
                {this._missingKnownFileNames.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        );
    }
}
