import { LIKED_PAGES_FILE_PATH } from "../../src/model/importers/pages-liked-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithLikedPages,
} from "../datasets/page-liked-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runLikedPagesImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import liked pages from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runLikedPagesImporter(zipFile);
        expectMissingFileError(result);
    });
});

describe("Import liked pages from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(LIKED_PAGES_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { result } = await runLikedPagesImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import liked pages", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithLikedPages();
        ({ result, facebookAccount } = await runLikedPagesImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of liked pages", () =>
        expect(facebookAccount.likedPages.length).toBe(
            DATASET_EXPECTED_VALUES.totalLikedPagesCount
        ));
});
