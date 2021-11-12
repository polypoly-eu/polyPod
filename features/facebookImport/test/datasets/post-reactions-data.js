import {
    POST_REACTIONS_DATA_KEY,
    POST_REACTIONS_FILE_PATH,
} from "../../src/model/importers/post-reactions-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    numberOfPostsReactions:
        createPostReactionsDataset()[POST_REACTIONS_DATA_KEY].length,
};

export function wrapPostReactionsData(data) {
    return { [POST_REACTIONS_DATA_KEY]: data };
}

function createPostReaction(timestamp, type, accountName) {
    return {
        timestamp: timestamp,
        data: [
            {
                reaction: {
                    reaction: type,
                    actor: "John Doe",
                },
            },
        ],
        title: `John Doe likes ${accountName}'s post.`,
    };
}

export function createPostReactionsDataset() {
    return wrapPostReactionsData([
        createPostReaction(1589138279, "LIKE", "Jane Doe"),
        createPostReaction(1512409643, "LIKE", "Test Name"),
        createPostReaction(1494999874, "WOW", "Jane Doe"),
        createPostReaction(1398893265, "SAD", "Donald Duck"),
        createPostReaction(1416949925, "LIKE", "Alice Joe"),
        createPostReaction(1498845994, "WOW", "Jane Doe"),
        createPostReaction(1598845994, "SORRY", "Jane Doe"),
    ]);
}

export function zipFileWithPostReactions() {
    return createMockedZip([
        [POST_REACTIONS_FILE_PATH, createPostReactionsDataset()],
    ]);
}
