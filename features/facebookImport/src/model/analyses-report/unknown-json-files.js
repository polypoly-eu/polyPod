import React from "react";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import allStructure from "../../static/allStructure";

export default class UknownJSONFilesAnalysis {
    get title() {
        return "Unknown JSON files";
    }

    get id() {
        return "unknown-json-files";
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

    async analyze({ id, zipFile }) {
        this._missingEntryNames = [];
        this.active = true;
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(zipFile);
        const anonymizedPaths = relevantEntries.map((each) =>
            anonymizeJsonEntityPath(each.replace(`${id}/`, ""))
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
}
