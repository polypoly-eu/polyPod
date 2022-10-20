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
import { ZipFileMock } from "@polypoly-eu/poly-import";
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
        const { report } = await runPostsImporter(zipFile);
        expectError(report, MissingFilesException, PostsImporter);
    });
});

describe("Import posts from export with one file error", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithFileError();
        ({ result, report } = await runPostsImporter(zipFile));
    });

    it("has one error status", async () => {
        expect(
            report.statuses.filter((status) => !status.isSuccess).length
        ).toBe(1);
    });

    it("triggers syntax error", async () => {
        expectErrorStatus(report.statuses[1], SyntaxError);
    });

    it("has correct number of entities from file one", () =>
        expect(result.length).toBe(DATASET_ONE_EXPECTED_VALUES.numberOfPosts));
});

describe("Import posts from export with two file errors", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithTwoFileErrors();
        ({ result, report } = await runPostsImporter(zipFile));
    });

    it("has two error status", async () => {
        expect(
            report.statuses.filter((status) => !status.isSuccess).length
        ).toBe(2);
    });

    it("triggers syntax error", async () => {
        expectErrorStatus(report.statuses[0], MissingContentImportException);
        expectErrorStatus(report.statuses[1], SyntaxError);
    });

    it("has no imported posts", () => expect(result.length).toBe(0));
});

describe("Import posts from export with one file", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithOnePostsFiles();
        ({ result, report } = await runPostsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(DATASET_ONE_EXPECTED_VALUES.numberOfPosts));
});

describe("Import posts from export with two files", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithTwoPostsFiles();
        ({ result, report } = await runPostsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(
            DATASET_ONE_EXPECTED_VALUES.numberOfPosts +
                DATASET_TWO_EXPECTED_VALUES.numberOfPosts
        ));
});
