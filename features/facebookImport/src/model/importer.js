import { ZipFile } from "./storage.js";

import FacebookAccount from "./entities/facebook-account.js";
import OffFacebookEventsImporter from "./importers/off-facebook-events-importer.js";
import AdInterestsImporter from "./importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "./importers/connected-advertisers-importer.js";
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
import {
    createErrorStatus,
    createSuccessStatus,
} from "./analyses/utils/analysis-status.js";
import PostsImporter from "./importers/posts-importer.js";

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
    CommentsImporter,
    PostReactionsImporter,
    PostsImporter,
];

class ImporterExecutionResult {
    constructor(importer, status, executionTime) {
        this._importer = importer;
        this._status = status || createSuccessStatus();
        this._executionTime = executionTime;
    }

    get importer() {
        return this._importer;
    }

    get status() {
        return this._status;
    }

    get executionTime() {
        return this._executionTime;
    }

    _extractDataFromStatus(status) {
        return {
            name: status.name,
            message: status.message,
        };
    }

    get reportJsonData() {
        return {
            formatVersion: "v2",
            importerName: this.importer.constructor.name,
            executionTime: this.executionTime.toFixed(0),
            status: Array.isArray(this.status)
                ? this.status.map((each) => this._extractDataFromStatus(each))
                : this._extractDataFromStatus(this.status),
        };
    }
}

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

    return facebookAccount;
}

export async function importData(zipData) {
    const zipFile = new ZipFile(zipData, window.pod);
    return importZip(zipFile, zipData, window.pod);
}
