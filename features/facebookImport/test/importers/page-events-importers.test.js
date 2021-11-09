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
import { defineEventImportersTestsForDatasets } from "./test-definition/importer-tests-definition";

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

defineEventImportersTestsForDatasets(datasets);
