import commonStructure from "../../../static/commonStructure";
import { ReportAnalysis, jsonDataEntities } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class MissingCommonJSONFilesAnalysis extends ReportAnalysis {
    async analyze({ zipFile, dataAccount }) {
        const relevantEntries = await jsonDataEntities(zipFile);
        const formattedPaths = relevantEntries.map((entry) => "/" + entry.path);
        dataAccount.analyses[analysisKeys.missingCommonFileNames] =
            commonStructure
                .filter((each) => each.endsWith(".json"))
                .filter((each) => !formattedPaths.includes(each));
    }
}
