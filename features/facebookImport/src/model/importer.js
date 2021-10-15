import { ZipFile } from "./storage.js";

import FacebookAccount from "./entities/facebook-account.js";
import OffFacebookEventsImporter from "./importers/off-facebook-events-importer.js";
import AdInterestsImporter from "./importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "./importers/connected-advertisers-importer.js";
import InteractedWithAdvertisersImporter from "./importers/interacted-advertisers-importer.js";
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

import {
    IMPORT_SUCCESS,
    createErrorResult,
} from "./importers/utils/importer-status.js";
import LanguageAndLocaleImporter from "./importers/language-and-locale-importer.js";
import RecentlyViewedAdsImporter from "./importers/recently-viewed-ads-importer.js";

const dataImporters = [
    AdInterestsImporter,
    ConnectedAdvertisersImporter,
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
];

export async function runImporter(
    importerClass,
    enrichedData,
    facebookAccount,
    pod
) {
    const importer = new importerClass();
    return importer
        .import(enrichedData, facebookAccount, pod)
        .then(
            (status) =>
                status || {
                    status: IMPORT_SUCCESS,
                    importerClass,
                }
        )
        .catch((error) => {
            return createErrorResult(importerClass, error);
        });
}

export async function runImporters(
    importerClasses,
    enrichedData,
    facebookAccount,
    pod
) {
    const importingResultsPerImporter = await Promise.all(
        importerClasses.map(async (importerClass) => {
            return runImporter(
                importerClass,
                enrichedData,
                facebookAccount,
                pod
            );
        })
    );

    const importingResults = importingResultsPerImporter.reduce(
        (results, importResult) =>
            results.concat(
                Array.isArray(importResult) ? importResult : [importResult]
            ),
        []
    );

    return importingResults;
}

export async function importZip(zipFile, zipData, pod) {
    const facebookAccount = new FacebookAccount();
    const enrichedData = { ...zipData, zipFile };

    const importingResults = await runImporters(
        dataImporters,
        enrichedData,
        facebookAccount,
        pod
    );

    facebookAccount.importingResults = importingResults;

    return facebookAccount;
}

export async function importData(file) {
    const zipFile = new ZipFile(file, window.pod);
    return importZip(zipFile, file, window.pod);
}
