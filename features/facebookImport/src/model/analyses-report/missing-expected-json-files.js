import React from "react";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import allStructure from "../../static/allStructure";

export default class MissingExpectedJSONFilesAnalysis {
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
}
