import { anonymizeJsonEntityPath } from "../../importers/utils/importer-util.js";
import allStructure from "../../../static/allStructure";
import { ReportAnalysis, jsonDataEntities } from "@polypoly-eu/poly-analysis";
import analysisKeys from "../utils/analysisKeys";

export default class MissingKnownJSONFilesAnalysis extends ReportAnalysis {
    _knownJsonFiles() {
        const knownJsonFileNames = allStructure.filter((each) =>
            each.endsWith(".json")
        );
        return knownJsonFileNames.filter(
            (each) =>
                !/^(posts|photos_and_videos)\/album\/[1-9][0-9]?.json$/.test(
                    each
                ) &&
                !/^messages\/(inbox|legacy_threads|message_requests|filtered_threads|archived_threads)\/uniqueid_hash\/message_[2-9][0-9]?.json$/.test(
                    each
                )
        );
    }

    async analyze({ zipFile, dataAccount }) {
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(zipFile);
        const anonymizedPaths = relevantEntries.map((entry) =>
            anonymizeJsonEntityPath(entry.path)
        );
        const knownJsonFiles = this._knownJsonFiles();

        dataAccount.reports[analysisKeys.missingKnownFileNames] =
            knownJsonFiles.filter((each) => !anonymizedPaths.includes(each));
    }
}
