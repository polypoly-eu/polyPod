import PostReactionsImporter, {
    POST_REACTIONS_FILE_PATH,
} from "../../src/model/importers/post-reactions-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithPostReactions,
} from "../datasets/post-reactions-data";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runPostReactionsImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import post reactions from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { report } = await runPostReactionsImporter(zipFile);

        expectMissingFileError(report, PostReactionsImporter);
    });
});

describe("Import post reactions from export with wrong data key", () => {
    let zipFile = null;

    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(POST_REACTIONS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { report } = await runPostReactionsImporter(zipFile);
        expectInvalidContentError(report, PostReactionsImporter);
    });
});

describe("Import post reactions", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithPostReactions();
        ({ report, result } = await runPostReactionsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has corrent number of entities", () =>
        expect(result.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfPostsReactions
        ));
});
