import React from "react";
import BasicList from "../../components/basicList/basicList.jsx";
import ReportAnalysis from "./report-analysis";

export default class NoDataFoldersAnalysis extends ReportAnalysis {
    get title() {
        return "NoData Folders";
    }

    get jsonReport() {
        return {
            id: this.id,
            noDataFolderNames: this._noDataFolderNames,
        };
    }

    async analyze({ id, zipFile }) {
        this._noDataFolderNames = [];
        this.active = false;
        if (!zipFile) return;
        const entries = await zipFile.getEntries();
        const extractedFolderNames = entries.map((fileName) => {
            const nameParts = fileName.replace(`${id}/`, "").split("/");
            if (nameParts.length >= 2) {
                for (const [i, part] of Object.entries(nameParts)) {
                    if (part === "no-data.txt") {
                        return nameParts[i - 1];
                    }
                }
            }
            return;
        });

        this._noDataFolderNames = extractedFolderNames.filter(
            (each) => each != null
        );
        this.active = this._noDataFolderNames.length > 0;
    }

    render() {
        return <BasicList items={this._noDataFolderNames} />;
    }
}
