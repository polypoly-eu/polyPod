import PostsImporter from "../../src/model/importers/posts-importer";
import {
    MissingContentImportException,
    MissingFilesException,
} from "../../src/model/importers/utils/failed-import-exception";
import {
    DATASET_ONE_EXPECTED_VALUES,
    DATASET_TWO_EXPECTED_VALUES,
    zipFileWithFileError,
    zipFileWithOnePostsFiles,
    zipFileWithTwoFileErrors,
    zipFileWithTwoPostsFiles,
} from "../datasets/posts-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runPostsImporter } from "../utils/data-importing";
import {
    expectError,
    expectErrorStatus,
    expectImportSuccess,
} from "../utils/importer-assertions";

describe("Import posts from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runPostsImporter(zipFile);
        expectError(result, MissingFilesException, PostsImporter);
    });
});

describe("Import posts from export with one file error", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithFileError();
        ({ result, facebookAccount } = await runPostsImporter(zipFile));
    });

    it("has one error status", async () => {
        expect(result.status.length).toBe(1);
    });

    it("triggers syntax error", async () => {
        expectErrorStatus(result.status[0], SyntaxError);
    });

    it("has correct number of entities from file one", () =>
        expect(facebookAccount.posts.length).toBe(
            DATASET_ONE_EXPECTED_VALUES.numberOfPosts
        ));
});

describe("Import posts from export with two file errors", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithTwoFileErrors();
        ({ result, facebookAccount } = await runPostsImporter(zipFile));
    });

    it("has two error status", async () => {
        expect(result.status.length).toBe(2);
    });

    it("triggers syntax error", async () => {
        expectErrorStatus(result.status[0], MissingContentImportException);
        expectErrorStatus(result.status[1], SyntaxError);
    });

    it("has no imported posts", () =>
        expect(facebookAccount.posts.length).toBe(0));
});

describe("Import posts from export with one file", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithOnePostsFiles();
        ({ result, facebookAccount } = await runPostsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of entities", () =>
        expect(facebookAccount.posts.length).toBe(
            DATASET_ONE_EXPECTED_VALUES.numberOfPosts
        ));
});

describe("Import posts from export with two files", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithTwoPostsFiles();
        ({ result, facebookAccount } = await runPostsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of entities", () =>
        expect(facebookAccount.posts.length).toBe(
            DATASET_ONE_EXPECTED_VALUES.numberOfPosts +
                DATASET_TWO_EXPECTED_VALUES.numberOfPosts
        ));
});
