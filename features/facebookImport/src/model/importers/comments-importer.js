import DirectKeyDataImporter from "./direct-key-data-importer";

export const COMMENTS_FILE_PATH = "comments_and_reactions/comments.json";
export const COMMENTS_DATA_KEY = "comments_v2";
export const COMMENTS_STORAGE_KEY = "comments";

export default class CommentsImporter extends DirectKeyDataImporter {
    constructor() {
        super(COMMENTS_FILE_PATH, COMMENTS_DATA_KEY, COMMENTS_STORAGE_KEY);
    }

    _extractDataFromComment(commentData) {
        return {
            timestamp: commentData.timestamp,
        };
    }

    extractData(rawData) {
        return rawData.map((commentData) =>
            this._extractDataFromComment(commentData)
        );
    }
}
