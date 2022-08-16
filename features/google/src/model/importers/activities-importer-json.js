import UserActivity from "../entities/user-activity";
import ActivityFileInfo from "../entities/activity-file-info";
import { convertFileSizeUnit } from "./utils/importer-utils";
import BaseActivitiesImporter from "./base-activities-importer";
class ActivityJsonParser {
    constructor() {}
    async parse(entry) {
        console.log(`ActivityJsonParser: Decoding entry at path: ${entry.path}`);
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const fileSize = convertFileSizeUnit(content.byteLength);
        const jsonObj = JSON.parse(text);
        const pathParts = entry.path.split("/");
        const productName = pathParts[pathParts.length - 2];
        console.log(`ActivityJsonParser: Decoded entry at path: ${entry.path}, fileSize: ${fileSize}`);
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

export default class ActivitiesJsonImporter extends BaseActivitiesImporter {
    constructor() {
        super(new ActivityJsonParser());
    }
    async import({ zipFile, facebookAccount: googleAccount }) {
        await super.import({ zipFile, googleAccount });
    }
}
