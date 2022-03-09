import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";

import {
    anonymizeJsonEntityPath,
    jsonDataEntities,
} from "../../importers/utils/importer-util.js";
import allStructure from "../../../static/allStructure";
import ReportAnalysis from "./report-analysis.js";

export default class UnknownJSONFilesAnalysis extends ReportAnalysis {
    get title() {
        return "Unknown JSON files";
    }

    get reportData() {
        return this._unknownFiles;
    }

    async analyze({ zipFile }) {
        const relevantEntries = await jsonDataEntities(zipFile);
        const anonymizedPaths = relevantEntries.map((entry) =>
            anonymizeJsonEntityPath(entry.path)
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
