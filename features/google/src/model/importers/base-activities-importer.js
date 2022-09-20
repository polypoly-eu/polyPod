import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import { matchRegex } from "./utils/lang-constants";

export default class BaseActivitiesImporter {
    constructor(parser) {
        this._parser = parser;
    }

    async import({ zipFile, googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const activityEntries = entries.filter(({ path }) => {
            return matchRegex(path, this.constructor.name);
        });
        const parserOutput = await Promise.all(
            activityEntries.map((entry) => this._parser.parse(entry))
        );
        googleAccount.activities.push(
            ...parserOutput.map((output) => output.userActivity).flat()
        );
        googleAccount.activityFileInfo.push(
            ...parserOutput.map((output) => output.fileInfo)
        );

        console.log(
            `Imported zip into GoogleAccount: ${JSON.stringify(
                googleAccount.dataGroups,
                null,
                4
            )}`
        );
    }
}
