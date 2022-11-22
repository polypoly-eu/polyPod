import {
    COMMENTS_DATA_KEY,
    COMMENTS_FILE_PATH,
} from "../../src/model/importers/comments-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    numberOfComments: 6,
};

export function wrapCommentsData(data) {
    return { [COMMENTS_DATA_KEY]: data };
}

function createCommentEntry(
    timestamp,
    accountName,
    commentText = "Lorem Ipsum"
) {
    return {
        timestamp,
        data: [
            {
                comment: {
                    timestamp,
                    comment: commentText,
                    author: "John Doe",
                },
            },
        ],
        title: `John Doe commented on ${accountName}'s post.`,
    };
}

export function createCommentsDataset() {
    return wrapCommentsData([
        createCommentEntry(1493407894, "Jane Doe"),
        createCommentEntry(1525674267, "Donald Duck"),
        createCommentEntry(1539113812, "Unknown Name"),
        createCommentEntry(1584725914, "Alice"),
        createCommentEntry(1584830064, "Donald Duck"),
        createCommentEntry(1585266926, "Facebook User"),
    ]);
}

export function zipFileWithComments() {
    return createMockedZip([[COMMENTS_FILE_PATH, createCommentsDataset()]]);
}
