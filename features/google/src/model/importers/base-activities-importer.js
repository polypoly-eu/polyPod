import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import { matchRegex } from "./utils/lang-constants";

export default class BaseActivitiesImporter {
    constructor(parser) {
        this._parser = parser;
    }

    async import({ zipFile, googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        console.log(`Relevant entries count ${entries.length}`);
        const activityEntries = entries.filter(({ path }) => {
            console.log(`Entry path about to be filtered by regex: ${path}`);
            return matchRegex(path, this);
        });
        console.log(`Activity entries count ${activityEntries.length}`);

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
