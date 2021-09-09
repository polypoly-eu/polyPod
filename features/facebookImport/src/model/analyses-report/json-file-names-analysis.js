import React from "react";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import RootAnalysis from "../analyses/root-analysis.js";

export default class JSONFileNamesAnalysis extends RootAnalysis {
    get title() {
        return "JSON file names";
    }

    get isForDataReport() {
        return true;
    }

    get jsonReport() {
        return {
            id: this.id,
            jsonFileNames: this._jsonFileNames,
        };
    }

    async analyze({ id, zipFile }) {
        this._jsonFileNames = [];
        this.active = false;
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(zipFile);
        const anonymizedPaths = relevantEntries.map((each) =>
            anonymizeJsonEntityPath(each.replace(`${id}/`, ""))
        );
        this._jsonFileNames = [...new Set(anonymizedPaths)];

        this.active = this._jsonFileNames.length > 0;
    }

    render() {
        return (
            <ul>
                {this._jsonFileNames.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        );
    }
}
