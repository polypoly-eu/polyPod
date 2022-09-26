import CommentsImporter, {
    COMMENTS_FILE_PATH,
} from "../../src/model/importers/comments-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithComments,
} from "../datasets/comments-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runCommentsImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import comments from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { report } = await runCommentsImporter(zipFile);
        expectMissingFileError(report, CommentsImporter);
    });
});

describe("Import searches from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(COMMENTS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { report } = await runCommentsImporter(zipFile);
        expectInvalidContentError(report, CommentsImporter);
    });
});

describe("Import comments", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithComments();
        ({ result, report } = await runCommentsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(DATASET_EXPECTED_VALUES.numberOfComments));
});
