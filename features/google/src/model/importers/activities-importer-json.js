import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import UserActivity from "../entities/user-activity";
import ActivityFileInfo from "../entities/activity-file-info";
import { matchRegex } from "./utils/lang-constants";
import { convertFileSizeUnit } from "./utils/importer-utils";

class ActivityJsonParser {
    constructor() {}
    async parse(entry) {
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const fileSize = convertFileSizeUnit(content.byteLength);
        const jsonObj = JSON.parse(text);
        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];

        return {
            userActivity: jsonObj.map(
                (entry) =>
                    new UserActivity({
                        timestamp: new Date(entry.time),
                        productName,
                    })
            ),
            fileInfo: new ActivityFileInfo({
                productName,
                fileSize,
            }),
        };
    }
}

export default class ActivitiesJsonImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const activityEntries = entries.filter(({ path }) =>
            matchRegex(path, this)
        );
        const parser = new ActivityJsonParser();
        const parserOutput = await Promise.all(
            activityEntries.map((entry) => parser.parse(entry))
        );
        googleAccount.activities.push(
            ...parserOutput.map((output) => output.userActivity).flat()
        );
        googleAccount.activityFileInfo.push(
            ...parserOutput.map((output) => output.fileInfo)
        );
    }
}
