import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import allStructure from "../../static/allStructure";
import ReportAnalysis from "./report-analysis.js";

export default class UknownJSONFilesAnalysis extends ReportAnalysis {
    get title() {
        return "Unknown JSON files";
    }

    get reportData() {
        return this._unknownFiles;
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
        return <BasicList items={this._unknownFiles} />;
    }
}
