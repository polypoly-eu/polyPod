import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import { matchRegex } from "./utils/lang-constants";

export default class BaseActivitiesImporter {
    constructor(parser) {
        this._parser = parser;
    }

    async import({ zipFile, googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const activityEntries = entries.filter(({ path }) =>
            matchRegex(path, this)
        );

        const parserOutput = await Promise.all(
            activityEntries.map((entry) => this._parser.parse(entry))
        );
        googleAccount.activities.push(
            ...parserOutput.map((output) => output.userActivity).flat()
        );
        googleAccount.activityFileInfo.push(
            ...parserOutput.map((output) => output.fileInfo)
        );
    }
}
