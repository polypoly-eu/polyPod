import MessagesImporter from "../../src/model/importers/messages-importer.js";
import NameImporter from "../../src/model/importers/name-importer.js";
import FacebookAccount from "../../src/model/entities/facebook-account.js";
import { runImporter, runImporters } from "../../src/model/importer.js";
import RecentlyViewedAdsImporter, {
    RECENTLY_VIEWED_FILE_PATH,
} from "../../src/model/importers/recently-viewed-ads-importer.js";
import OffFacebookEventsImporter from "../../src/model/importers/off-facebook-events-importer.js";
import { ZipFileMock } from "../mocks/zipfile-mock.js";
import LanguageAndLocaleImporter from "../../src/model/importers/language-and-locale-importer.js";
import FriendsImporter from "../../src/model/importers/friends-importer.js";
import LikedPagesImporter from "../../src/model/importers/pages-liked-importer.js";
import AdInterestsImporter from "../../src/model/importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "../../src/model/importers/connected-advertisers-importer.js";
import SearchesImporter from "../../src/model/importers/searches-importer.js";
import InteractedWithAdvertisersImporter from "../../src/model/importers/interacted-with-advertisers-importer.js";
import PostReactionsImporter from "../../src/model/importers/post-reactions-importer.js";
import PostsImporter from "../../src/model/importers/posts-importer.js";

export async function runMultipleImporters(importerClasses, zipFile) {
    const facebookAccount = new FacebookAccount();
    const results = await runImporters(
        importerClasses,
        zipFile,
        facebookAccount
    );
    return { facebookAccount, results };
}

export async function runSingleImporter(importerClass, zipFile) {
    const facebookAccount = new FacebookAccount();
    const result = await runImporter(importerClass, zipFile, facebookAccount);
    return { facebookAccount, result };
}

export async function runAdInterestsImporter(zipFile) {
    return runSingleImporter(AdInterestsImporter, zipFile);
}

export async function runConnectedAdvertisersImporter(zipFile) {
    return runSingleImporter(ConnectedAdvertisersImporter, zipFile);
}

export async function runLanguageAndLocaleImporter(zipFile) {
    return runSingleImporter(LanguageAndLocaleImporter, zipFile);
}

export async function runNameImporter(zipFile) {
    return runSingleImporter(NameImporter, zipFile);
}

export async function runMessagesImporter(zipFile) {
    return runSingleImporter(MessagesImporter, zipFile);
}

export async function runRecentlyViewedAdsImporter(zipFile) {
    return runSingleImporter(RecentlyViewedAdsImporter, zipFile);
}

export async function runOffFacebookEventsImporter(zipFile) {
    return runSingleImporter(OffFacebookEventsImporter, zipFile);
}

export async function runFriendsImporter(zipFile) {
    return runSingleImporter(FriendsImporter, zipFile);
}

export async function runLikedPagesImporter(zipFile) {
    return runSingleImporter(LikedPagesImporter, zipFile);
}

export async function runSearchesImporter(zipFile) {
    return runSingleImporter(SearchesImporter, zipFile);
}

export async function runInteractedWithAdvertisersImporter(zipFile) {
    return runSingleImporter(InteractedWithAdvertisersImporter, zipFile);
}

export async function runPostReactionsImporter(zipFile) {
    return runSingleImporter(PostReactionsImporter, zipFile);
}

export async function runPostsImporter(zipFile) {
    return runSingleImporter(PostsImporter, zipFile);
}

export async function runImportForDataset(importerClass, filePath, dataset) {
    const zipFile = new ZipFileMock();
    zipFile.addJsonEntry(filePath, dataset);

    return await runSingleImporter(importerClass, zipFile);
}

export async function runAdsImportForDataset(dataset) {
    const { result, facebookAccount } = await runImportForDataset(
        RecentlyViewedAdsImporter,
        RECENTLY_VIEWED_FILE_PATH,
        dataset
    );
    return { result, relatedAccounts: facebookAccount.relatedAccounts };
}
