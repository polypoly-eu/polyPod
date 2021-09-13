import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import commonStructure from "../../static/commonStructure";
import ReportAnalysis from "./report-analysis.js";

export default class MissingCommonJSONFilesAnalysis extends ReportAnalysis {
    get title() {
        return "Missing common JSON files";
    }

    get reportData() {
        return this._missingCommonFileNames;
    }

    _knownJsonFiles() {
        const knowsJsonFileNames = commonStructure.filter((each) =>
            each.endsWith(".json")
        );
        return knowsJsonFileNames;
    }

    async analyze({ id, zipFile }) {
        this._missingCommonFileNames = [];
        this.active = true;
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(zipFile);
        const knowsJsonFiles = this._knownJsonFiles();
        this._missingCommonFileNames = knowsJsonFiles;
        this.active = this._missingKnownFileNames.length > 0;
    }

    render() {
        return <BasicList items={this._missingKnownFileNames} />;
    }
}
