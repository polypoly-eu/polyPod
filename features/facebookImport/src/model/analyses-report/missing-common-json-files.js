import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";

import { jsonDataEntities } from "../../importer/importer-util.js";

import commonStructure from "../../static/commonStructure";
import ReportAnalysis from "./report-analysis.js";

export default class MissingCommonJSONFilesAnalysis extends ReportAnalysis {
    get title() {
        return "Missing common JSON files";
    }

    get reportData() {
        return this._missingCommonFileNames;
    }

    async analyze({ zipFile }) {
        this._missingCommonFileNames = [];
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(zipFile);
        this._missingCommonFileNames = commonStructure
            .filter((each) => each.endsWith(".json"))
            .filter((each) => relevantEntries.includes(each));
        this.active = this._missingCommonFileNames.length > 0;
    }

    render() {
        return <BasicList items={this._missingCommonFileNames} />;
    }
}
