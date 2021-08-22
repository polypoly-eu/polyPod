import React from "react";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import allStructure from "../../static/allStructure";

class UknownJSONFilesAnalysis {
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
}

export default UknownJSONFilesAnalysis;
