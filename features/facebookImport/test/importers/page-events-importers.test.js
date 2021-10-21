import FollowedPagesImporter, {
    FOLLOWED_PAGES_FILE_PATH,
    FOLLOWED_PAGES_STORAGE_KEY,
} from "../../src/model/importers/pages-followed-importer";
import LikedPagesImporter, {
    LIKED_PAGES_FILE_PATH,
    LIKED_PAGES_STORAGE_KEY,
} from "../../src/model/importers/pages-liked-importer";
import RecommendedPagesImporter, {
    RECOMMENDED_PAGES_FILE_PATH,
    RECOMMENDED_PAGES_STORAGE_KEY,
} from "../../src/model/importers/pages-recommended-importer";
import UnfollowedPagesImporter, {
    UNFOLLOWED_PAGES_FILE_PATH,
    UNFOLLOWED_PAGES_STORAGE_KEY,
} from "../../src/model/importers/pages-unfollowed-importer";
import { zipFileWithFollowedPagesAndExpectedValues } from "../datasets/page-followed-data";
import { zipFileWithLikedPagesAndExpectedValues } from "../datasets/page-liked-data";
import { zipFileWithRecommendedPagesAndExpectedValues } from "../datasets/page-recommended-data";
import { zipFileWithUnfollowedPagesAndExpectedValues } from "../datasets/pages-unfollowed-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runSingleImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

const datasets = [
    [
        LikedPagesImporter.name,
        LikedPagesImporter,
        LIKED_PAGES_FILE_PATH,
        LIKED_PAGES_STORAGE_KEY,
        zipFileWithLikedPagesAndExpectedValues(),
    ],
    [
        FollowedPagesImporter.name,
        FollowedPagesImporter,
        FOLLOWED_PAGES_FILE_PATH,
        FOLLOWED_PAGES_STORAGE_KEY,
        zipFileWithFollowedPagesAndExpectedValues(),
    ],
    [
        RecommendedPagesImporter.name,
        RecommendedPagesImporter,
        RECOMMENDED_PAGES_FILE_PATH,
        RECOMMENDED_PAGES_STORAGE_KEY,
        zipFileWithRecommendedPagesAndExpectedValues(),
    ],
    [
        UnfollowedPagesImporter.name,
        UnfollowedPagesImporter,
        UNFOLLOWED_PAGES_FILE_PATH,
        UNFOLLOWED_PAGES_STORAGE_KEY,
        zipFileWithUnfollowedPagesAndExpectedValues(),
    ],
];

describe("Import from empty dataset triggers missing file error", () => {
    test.each(datasets)(
        "using importer %s",
        async (importerName, importerClass) => {
            const zipFile = new ZipFileMock();
            const { result } = await runSingleImporter(importerClass, zipFile);
            expectMissingFileError(result);
        }
    );
});

describe("Import from dataset with wrong data key triggers missing data key error", () => {
    test.each(datasets)(
        "using importer %s",
        async (importerName, importerClass, dataFileName) => {
            const zipFile = zipWithWrongDatasetKey(dataFileName);
            const { result } = await runSingleImporter(importerClass, zipFile);
            expectInvalidContentError(result);
        }
    );
});

describe("Import from dataset has correct number of entities", () => {
    test.each(datasets)(
        "using importer %s",
        async (
            importerName,
            importerClass,
            dataFileName,
            dataKey,
            { zipFile, expectedValues }
        ) => {
            const { result, facebookAccount } = await runSingleImporter(
                importerClass,
                zipFile
            );

            expectImportSuccess(result);

            expect(facebookAccount[dataKey].length).toBe(
                expectedValues.totalEventsCount
            );
        }
    );
});
