import { relevantZipEntries } from "../../../../facebookImport/src/model/importers/utils/importer-util";
import UserActivity from "../entities/user-activity";
import { matchRegex } from "./utils/lang-constants";

class ActivityJsonParser {
    constructor() {}
    async parse(entry) {
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const jsonObj = JSON.parse(text);
        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        return jsonObj.map(
            (entry) =>
                new UserActivity({
                    timestamp: new Date(entry.time),
                    productName,
                })
        );
    }
}

export default class ActivitiesJsonImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const activityEntries = entries.filter(({ path }) =>
            matchRegex(path, this)
        );
        const parser = new ActivityJsonParser();
        googleAccount.activities.push(
            ...(
                await Promise.all(
                    activityEntries.map((entry) => parser.parse(entry))
                )
            ).flat()
        );
    }
}
