import { ZipFileMock } from "../mocks/zipfile-mock";
import { createMockedZip } from "../utils/data-creation";

const POSTS_FILE_PATH = "posts/your_posts_X.json";
function createPathForIndex(fileIndex) {
    return POSTS_FILE_PATH.replace("X", fileIndex + "");
}

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
    return [1624458721, 1624481575, 1624595792, 1626976792, 1627001733].map(
        (timestamp) => createPostEntry(timestamp)
    );
}

export function createPostsTwoDataset() {
    return [1621560294, 1621585743, 1621604231, 1621632401].map((timestamp) =>
        createPostEntry(timestamp)
    );
}

export function zipFileWithTwoPostsFiles() {
    return createMockedZip([
        [createPathForIndex(1), createPostsOneDataset()],
        [createPathForIndex(2), createPostsTwoDataset()],
    ]);
}

export function zipFileWithOnePostsFiles() {
    return createMockedZip([[createPathForIndex(1), createPostsOneDataset()]]);
}

export function zipFileWithFileError() {
    let zipFile = createMockedZip([
        [createPathForIndex(1), createPostsOneDataset()],
    ]);
    zipFile.addTextEntry(createPathForIndex(2), "[");
    return zipFile;
}

export function zipFileWithTwoFileErrors() {
    let zipFile = new ZipFileMock();
    zipFile.addTextEntry(createPathForIndex(1), "");
    zipFile.addTextEntry(createPathForIndex(2), "[");
    return zipFile;
}
