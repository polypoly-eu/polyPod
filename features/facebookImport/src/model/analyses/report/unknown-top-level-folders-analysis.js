import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
import ReportAnalysis from "./report-analysis.js";
import topFolderNames from "../../../static/topFolders.js";
import {
    relevantZipEntries,
    removeEntryPrefix,
} from "../../importers/utils/importer-util.js";

async function extractTopLevelFolderNamesFromZip(zipFile) {
    const relevantEntries = await relevantZipEntries(zipFile);
    const topLevelFolderNames = new Set();

    relevantEntries.forEach((filename) => {
        const noIdFileName = removeEntryPrefix(filename);
        const folderNameMatch = noIdFileName.match(/^([^/]+)\/.*$/);
        if (
            folderNameMatch &&
            folderNameMatch.length === 2 &&
            folderNameMatch[1]
        ) {
            topLevelFolderNames.add(folderNameMatch[1]);
        }
    });
    return [...topLevelFolderNames];
}

export default class UknownTopLevelFoldersAnalysis extends ReportAnalysis {
    get title() {
        return "Unknown top-level folders";
    }

    get reportData() {
        return this._uknownFolderNames;
    }

    async analyze({ zipFile }) {
        const topLevelFolderNames = await extractTopLevelFolderNamesFromZip(
            zipFile
        );

        this._uknownFolderNames = topLevelFolderNames.filter(
            (each) => !topFolderNames.includes(each)
        );
        this.active = this._uknownFolderNames.length > 0;
    }

    render() {
        return <BasicList items={this._uknownFolderNames} />;
    }
}
