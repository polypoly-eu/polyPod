import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importer/importer-util.js";
import ReportAnalysis from "./report-analysis.js";

export default class JSONFileNamesAnalysis extends ReportAnalysis {
    get title() {
        return "JSON file names";
    }

    get reportData() {
        return this._jsonFileNames;
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
        return <BasicList items={this._jsonFileNames} />;
    }
}
