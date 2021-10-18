import { FRIENDS_FILE_PATH } from "../../src/model/importers/friends-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithFriends,
} from "../datasets/friends-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runFriendsImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import friends from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runFriendsImporter(zipFile);
        expectMissingFileError(result);
    });
});

describe("Import friends from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(FRIENDS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { result } = await runFriendsImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import friends", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithFriends();
        ({ result, facebookAccount } = await runFriendsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of friends", () =>
        expect(facebookAccount.friends.length).toBe(
            DATASET_EXPECTED_VALUES.totalFriendsCount
        ));
});
