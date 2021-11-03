import { createMockedZip } from "../utils/data-creation";

const POSTS_FILE_PATH = "posts/your_posts_X.json";

export const DATASET_ONE_EXPECTED_VALUES = {
    numberOfPosts: 5,
};

export const DATASET_TWO_EXPECTED_VALUES = {
    numberOfPosts: 4,
};

function createPostEntry(timestamp, postText = "Lorem Ipsum") {
    return {
        timestamp,
        data: [
            {
                post: postText,
            },
        ],
    };
}

export function createPostsOneDataset() {
    return [
        createPostEntry(1624458721),
        createPostEntry(1624481575),
        createPostEntry(1624595792),
        createPostEntry(1626976792),
        createPostEntry(1627001733),
    ];
}

export function createPostsTwoDataset() {
    return [
        createPostEntry(1621560294),
        createPostEntry(1621585743),
        createPostEntry(1621604231),
        createPostEntry(1621632401),
    ];
}

export function zipFileWithTwoPostsFiles() {
    return createMockedZip([
        [POSTS_FILE_PATH.replace("X", "1"), createPostsOneDataset()],
        [POSTS_FILE_PATH.replace("X", "2"), createPostsTwoDataset()],
    ]);
}

export function zipFileWithOnePostsFiles() {
    return createMockedZip([
        [POSTS_FILE_PATH.replace("X", "1"), createPostsOneDataset()],
    ]);
}

export function zipFileWithFileError() {
    let zipFile = createMockedZip([
        [POSTS_FILE_PATH.replace("X", "1"), createPostsOneDataset()],
    ]);
    zipFile.addTextEntry(POSTS_FILE_PATH.replace("X", "2"), "[");
    return zipFile;
}
