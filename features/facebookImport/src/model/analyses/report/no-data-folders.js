import React from "react";
import BasicList from "../../../components/basicList/basicList.jsx";
import ReportAnalysis from "./report-analysis";
import { noDataFileName } from "../../../globals/index";
import { relevantZipEntries } from "../../importers/utils/importer-util.js";

export default class NoDataFoldersAnalysis extends ReportAnalysis {
    get title() {
        return "NoData Folders";
    }

    get reportData() {
        return this._noDataFolderNames;
    }

    async analyze({ zipFile }) {
        const entries = await relevantZipEntries(zipFile);
        const extractedFolderNames = entries.map((entry) => {
            const fileNameWithoutId = entry.path;
            const nameParts = fileNameWithoutId.split("/");
            if (nameParts.length >= 2) {
                for (const [i, part] of Object.entries(nameParts)) {
                    if (part === noDataFileName) {
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
