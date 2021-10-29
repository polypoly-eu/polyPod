import DirectKeyDataImporter from "./direct-key-data-importer.js";

export const POST_REACTIONS_FILE_PATH =
    "comments_and_reactions/posts_and_comments.json";
export const POST_REACTIONS_DATA_KEY = "reactions_v2";
export const POST_REACTIONS_STORAGE_KEY = "postReactions";

export default class PostReactionsImporter extends DirectKeyDataImporter {
    constructor() {
        super(
            POST_REACTIONS_FILE_PATH,
            POST_REACTIONS_DATA_KEY,
            POST_REACTIONS_STORAGE_KEY
        );
    }

    _extractDataFromReaction(reactionData) {
        return {
            timestamp: reactionData.timestamp,
            type: reactionData?.data[0]?.reaction?.reaction,
        };
    }

    extractData(rawData) {
        return rawData.map((reactionData) =>
            this._extractDataFromReaction(reactionData)
        );
    }
}
