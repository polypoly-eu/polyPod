import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";

import {
    jsonDataEntities,
    removeEntryPrefix,
} from "../../importers/utils/importer-util.js";

import commonStructure from "../../../static/commonStructure";
import ReportAnalysis from "./report-analysis.js";

export default class MissingCommonJSONFilesAnalysis extends ReportAnalysis {
    get title() {
        return "Missing common JSON files";
    }

    get reportData() {
        return this._missingCommonFileNames;
    }

    async analyze({ zipFile }) {
        const relevantEntries = await jsonDataEntities(zipFile);
        const formattedPaths = relevantEntries.map(
            (each) => "/" + removeEntryPrefix(each)
        );
        this._missingCommonFileNames = commonStructure
            .filter((each) => each.endsWith(".json"))
            .filter((each) => !formattedPaths.includes(each));
        this.active = this._missingCommonFileNames.length > 0;
    }

    render() {
        return <BasicList items={this._missingCommonFileNames} />;
    }
}
