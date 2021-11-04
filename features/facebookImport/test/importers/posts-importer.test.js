import PostsImporter from "../../src/model/importers/posts-importer";
import { MissingFilesException } from "../../src/model/importers/utils/failed-import-exception";
import {
    DATASET_ONE_EXPECTED_VALUES,
    DATASET_TWO_EXPECTED_VALUES,
    zipFileWithFileError,
    zipFileWithOnePostsFiles,
    zipFileWithTwoPostsFiles,
} from "../datasets/posts-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runPostsImporter } from "../utils/data-importing";
import {
    expectError,
    expectImportSuccess,
    expectSyntaxError,
} from "../utils/importer-assertions";

describe("Import posts from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runPostsImporter(zipFile);
        expectError(result, MissingFilesException);
    });
});

describe("Import searches from export with file error", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithFileError();
        ({ result, facebookAccount } = await runPostsImporter(zipFile));
    });

    it("has one error status", async () => {
        expect(result.length).toBe(1);
    });

    it("triggers syntax error", async () => {
        expectSyntaxError(result[0]);
    });

    it("has correct importer class", async () => {
        expect(result[0].importerClass).toBe(PostsImporter);
    });

    it("has correct number of entities from file one", () =>
        expect(facebookAccount.posts.length).toBe(
            DATASET_ONE_EXPECTED_VALUES.numberOfPosts
        ));
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
