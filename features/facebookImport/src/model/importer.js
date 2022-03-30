import { ZipFile } from "@polypoly-eu/feature-file-storage";

import FacebookAccount from "./entities/facebook-account.js";
import OffFacebookEventsImporter from "./importers/off-facebook-events-importer.js";
import AdInterestsImporter from "./importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "./importers/connected-advertisers-importer.js";
import ConnectedAdvertisersAllTypesImporter from "./importers/connected-advertisers-all-types-importer.js";
import InteractedWithAdvertisersImporter from "./importers/interacted-with-advertisers-importer.js";
import FriendsImporter from "./importers/friends-importer.js";
import FollowedPagesImporter from "./importers/pages-followed-importer.js";
import ReceivedFriendRequestsImporter from "./importers/friend-requests-received-importer.js";
import LikedPagesImporter from "./importers/pages-liked-importer.js";
import RecommendedPagesImporter from "./importers/pages-recommended-importer.js";
import SearchesImporter from "./importers/searches-importer.js";
import UnfollowedPagesImporter from "./importers/pages-unfollowed-importer.js";
import MessagesImporter from "./importers/messages-importer.js";
import AdminRecordsImporter from "./importers/admin-records-importer.js";
import AccountSessionActivitiesImporter from "./importers/account-session-activities-importer.js";
import NameImporter from "./importers/name-importer.js";
import LanguageAndLocaleImporter from "./importers/language-and-locale-importer.js";
import RecentlyViewedAdsImporter from "./importers/recently-viewed-ads-importer.js";
import CommentsImporter from "./importers/comments-importer.js";
import PostReactionsImporter from "./importers/post-reactions-importer.js";
import { Telemetry } from "./analyses/utils/performance-telemetry.js";
import { createErrorStatus } from "./analyses/utils/analysis-status.js";
import PostsImporter from "./importers/posts-importer.js";
import ImporterExecutionResult from "./importers/utils/importer-execution-result.js";

export const dataImporters = [
    AdInterestsImporter,
    ConnectedAdvertisersImporter,
    ConnectedAdvertisersAllTypesImporter,
    OffFacebookEventsImporter,
    InteractedWithAdvertisersImporter,
    FriendsImporter,
    FollowedPagesImporter,
    LikedPagesImporter,
    ReceivedFriendRequestsImporter,
    RecommendedPagesImporter,
    SearchesImporter,
    UnfollowedPagesImporter,
    MessagesImporter,
    AdminRecordsImporter,
    AccountSessionActivitiesImporter,
    NameImporter,
    LanguageAndLocaleImporter,
    RecentlyViewedAdsImporter,
    CommentsImporter,
    PostReactionsImporter,
    PostsImporter,
];

export const NUMBER_OF_IMPORTERS = dataImporters.length;

export async function runImporter(
    importerClass,
    zipFile,
    facebookAccount,
    pod
) {
    const importer = new importerClass();

    const telemetry = new Telemetry();
    try {
        const status = await importer.import({
            zipFile,
            facebookAccount,
            pod,
        });
        return new ImporterExecutionResult(
            importer,
            status,
            telemetry.elapsedTime()
        );
    } catch (error) {
        return new ImporterExecutionResult(
            importer,
            createErrorStatus(error),
            telemetry.elapsedTime()
        );
    }
}

export async function runImporters(
    importerClasses,
    zipFile,
    facebookAccount,
    pod
) {
    return await Promise.all(
        importerClasses.map(async (importerClass) => {
            return runImporter(importerClass, zipFile, facebookAccount, pod);
        })
    );
}

export async function importZip(zipFile, pod) {
    const facebookAccount = new FacebookAccount();
    const importingResults = await runImporters(
        dataImporters,
        zipFile,
        facebookAccount,
        pod
    );

    facebookAccount.importingResults = importingResults;

    const info = await pod.info;
    facebookAccount.basePolyPodVersion = await info.getVersion();

    return facebookAccount;
}

export async function importData(zipData) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return importZip(zipFile, window.pod);
}
