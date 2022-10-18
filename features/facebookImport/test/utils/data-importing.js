import MessagesImporter from "../../src/model/importers/messages-importer.js";
import NameImporter from "../../src/model/importers/name-importer.js";
import PersonalDataImporter from "../../src/model/importers/personal-data-importer.js";
import FacebookAccount from "../../src/model/entities/facebook-account.js";
import {
    runImporter,
    runImporters,
    runOutdatedImporter,
    runOutdatedImporters,
} from "@polypoly-eu/poly-import";
import RecentlyViewedAdsImporter, {
    RECENTLY_VIEWED_FILE_PATH,
} from "../../src/model/importers/recently-viewed-ads-importer.js";
import OffFacebookEventsImporter from "../../src/model/importers/off-facebook-events-importer.js";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { MockPod } from "@polypoly-eu/api/dist/mock-pod";
import LanguageAndLocaleImporter from "../../src/model/importers/language-and-locale-importer.js";
import FriendsImporter from "../../src/model/importers/friends-importer.js";
import LikedPagesImporter from "../../src/model/importers/pages-liked-importer.js";
import AdInterestsImporter from "../../src/model/importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "../../src/model/importers/connected-advertisers-importer.js";
import SearchesImporter from "../../src/model/importers/searches-importer.js";
import InteractedWithAdvertisersImporter from "../../src/model/importers/interacted-with-advertisers-importer.js";
import PostReactionsImporter from "../../src/model/importers/post-reactions-importer.js";
import CommentsImporter from "../../src/model/importers/comments-importer.js";
import PostsImporter from "../../src/model/importers/posts-importer.js";
import ConnectedAdvertisersAllTypesImporter from "../../src/model/importers/connected-advertisers-all-types-importer.js";
import RelatedAccountsGroup from "../../src/model/entities/related-accounts-group.js";

export async function runMultipleImporters(importerClasses, zipFile) {
    const facebookAccount = new FacebookAccount();
    return await runImporters({
        importerClasses,
        zipFile,
        facebookAccount,
        pod: new MockPod(),
    });
}

export async function runSingleImporter(importerClass, zipFile) {
    const facebookAccount = new FacebookAccount();
    const { report, result } = await runImporter({
        importerClass,
        zipFile,
        facebookAccount,
        pod: new MockPod(),
    });
    return { facebookAccount, result, report };
}

export async function runMultipleOutdatedImporters(importerClasses, zipFile) {
    const facebookAccount = new FacebookAccount();
    const results = await runOutdatedImporters(
        importerClasses,
        zipFile,
        facebookAccount
    );
    return { facebookAccount, results };
}

export async function runSingleOutdatedImporter(importerClass, zipFile) {
    const facebookAccount = new FacebookAccount();
    const result = await runOutdatedImporter(
        importerClass,
        zipFile,
        facebookAccount
    );
    return { facebookAccount, result };
}

export async function runAdInterestsImporter(zipFile) {
    return runSingleImporter(AdInterestsImporter, zipFile);
}

export async function runConnectedAdvertisersImporter(zipFile) {
    return runSingleImporter(ConnectedAdvertisersImporter, zipFile);
}

export async function runConnectedAdvertisersWithAllTypesImporter(zipFile) {
    return runSingleImporter(ConnectedAdvertisersAllTypesImporter, zipFile);
}

export async function runLanguageAndLocaleImporter(zipFile) {
    return runSingleOutdatedImporter(LanguageAndLocaleImporter, zipFile);
}

export async function runNameImporter(zipFile) {
    return runSingleOutdatedImporter(NameImporter, zipFile);
}

export async function runPersonalDataImporter(zipFile) {
    return runImporter({
        importerClass: PersonalDataImporter,
        zipFile,
        pod: new MockPod(),
    });
}

export async function runMessagesImporter(zipFile) {
    return runSingleOutdatedImporter(MessagesImporter, zipFile);
}

export async function runRecentlyViewedAdsImporter(zipFile) {
    return runSingleImporter(RecentlyViewedAdsImporter, zipFile);
}

export async function runOffFacebookEventsImporter(zipFile) {
    return runSingleImporter(OffFacebookEventsImporter, zipFile);
}

export async function runFriendsImporter(zipFile) {
    return runSingleOutdatedImporter(FriendsImporter, zipFile);
}

export async function runLikedPagesImporter(zipFile) {
    return runSingleOutdatedImporter(LikedPagesImporter, zipFile);
}

export async function runSearchesImporter(zipFile) {
    return runSingleImporter(SearchesImporter, zipFile);
}

export async function runInteractedWithAdvertisersImporter(zipFile) {
    return runSingleImporter(InteractedWithAdvertisersImporter, zipFile);
}

export async function runCommentsImporter(zipFile) {
    return runSingleImporter(CommentsImporter, zipFile);
}

export async function runPostReactionsImporter(zipFile) {
    return runSingleImporter(PostReactionsImporter, zipFile);
}

export async function runPostsImporter(zipFile) {
    return runSingleOutdatedImporter(PostsImporter, zipFile);
}

export async function runImportForDataset(importerClass, filePath, dataset) {
    const zipFile = new ZipFileMock();
    zipFile.addJsonEntry(filePath, dataset);

    return await runSingleImporter(importerClass, zipFile);
}

export async function runAdsImportForDataset(dataset) {
    const { result, report } = await runImportForDataset(
        RecentlyViewedAdsImporter,
        RECENTLY_VIEWED_FILE_PATH,
        dataset
    );
    const relatedAccounts = new RelatedAccountsGroup();
    if (result) relatedAccounts.addAll(result);
    return { relatedAccounts, report };
}
