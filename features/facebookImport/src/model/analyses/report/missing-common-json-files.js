import commonStructure from "../../../static/commonStructure";
import { ReportAnalysis, jsonDataEntities } from "@polypoly-eu/poly-analysis";

export default class MissingCommonJSONFilesAnalysis extends ReportAnalysis {
    async analyze({ zipFile, dataAccount }) {
        const relevantEntries = await jsonDataEntities(zipFile);
        const formattedPaths = relevantEntries.map((entry) => "/" + entry.path);
        const missingCommonFileNames = commonStructure
            .filter((each) => each.endsWith(".json"))
            .filter((each) => !formattedPaths.includes(each));
        if (missingCommonFileNames.length > 0)
            dataAccount.processedData._missingCommonFileNames =
                missingCommonFileNames;
    }
}
