import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";
import ReportAnalysis from "./report-analysis.js";
import allStructure from "../../static/allStructure";
import { relevantZipEntries } from "../../importer/importer-util.js";

async function extractTopLevelFolderNamesFromZip(id, zipFile) {
    const relevantEntries = await relevantZipEntries(zipFile);
    const topLevelFolderNames = new Set();
    relevantEntries.forEach((filename) => {
        const noIdFileName = filename.replace(`${id}/`, "");
        const nameParts = noIdFileName.split("/");
        if (nameParts.length >= 1 && nameParts[1].length > 0) {
            topLevelFolderNames.add(nameParts[1]);
        }
    });

    return [...topLevelFolderNames];
}

function extractKnownTopLevelFolderNames() {
    const topLevelFolderNames = new Set();
    allStructure.forEach((fileName) => {
        const nameParts = fileName.split("/");
        if (nameParts.length >= 0) {
            topLevelFolderNames.add(nameParts[0]);
        }
    });
    return [...topLevelFolderNames];
}

export default class UknownTopLelFoldersAnalysis extends ReportAnalysis {
    get title() {
        return "Unknown top-level folders";
    }

    get reportData() {
        return this._uknownFolderNames;
    }

    async analyze({ id, zipFile }) {
        const topLevelFolderNames = await extractTopLevelFolderNamesFromZip(
            id,
            zipFile
        );
        const knownTopLevelFolderNames = extractKnownTopLevelFolderNames();

        this._uknownFolderNames = topLevelFolderNames.filter(
            (each) => !knownTopLevelFolderNames.includes(each)
        );
        this.active = this._uknownFolderNames.length > 0;
    }

    render() {
        return <BasicList items={this._uknownFolderNames} />;
    }
}
