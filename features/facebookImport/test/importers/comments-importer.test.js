import { COMMENTS_FILE_PATH } from "../../src/model/importers/comments-importer";
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
        const { result } = await runCommentsImporter(zipFile);
        expectMissingFileError(result);
    });
});

describe("Import searches from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(COMMENTS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { result } = await runCommentsImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import comments", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithComments();
        ({ result, facebookAccount } = await runCommentsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of entities", () =>
        expect(facebookAccount.comments.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfComments
        ));
});
