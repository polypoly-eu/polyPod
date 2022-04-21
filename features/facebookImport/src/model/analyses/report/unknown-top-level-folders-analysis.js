import { ReportAnalysis } from "@polypoly-eu/poly-analysis";
import topFolderNames from "../../../static/topFolders.js";
import analysisKeys from "../utils/analysisKeys";
import { relevantZipEntries } from "../../importers/utils/importer-util.js";

async function extractTopLevelFolderNamesFromZip(zipFile) {
    const relevantEntries = await relevantZipEntries(zipFile);
    const topLevelFolderNames = new Set();

    relevantEntries.forEach((entry) => {
        const folderNameMatch = entry.path.match(/^([^/]+)\/.*$/);
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

export default class UnknownTopLevelFoldersAnalysis extends ReportAnalysis {
    async analyze({ zipFile, dataAccount }) {
        const topLevelFolderNames = await extractTopLevelFolderNamesFromZip(
            zipFile
        );

        dataAccount.reports[analysisKeys.unknownFolderNames] =
            topLevelFolderNames.filter(
                (each) => !topFolderNames.includes(each)
            );
    }
}
