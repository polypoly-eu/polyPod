import { ZipFile } from "../model/storage.js";

import FacebookAccount from "./facebook-account.js";
import OffFacebookEventsImporter from "./data-importers/off-facebook-events-importer.js";
import AdInterestsImporter from "./data-importers/ad-interests-importer.js";
import ConnectedAdvertisersImporter from "./data-importers/connected-advertisers-importer.js";
import InteractedWithAdvertisersImporter from "./data-importers/interacted-advertisers-importer.js";
import FriendsImporter from "./data-importers/friends-importer.js";
import FollowedPagesImporter from "./data-importers/pages-followed-importer.js";
import ReceivedFriendRequestsImporter from "./data-importers/friend-requests-received-importer.js";
import LikedPagesImporter from "./data-importers/pages-liked-importer.js";
import RecommendedPagesImporter from "./data-importers/pages-recommended-importer.js";
import SearchesImporter from "./data-importers/searches-importer.js";
import UnfollowedPagesImporter from "./data-importers/pages-unfollowed-importer.js";
import MessagesImporter from "./data-importers/messages-importer.js";

import { IMPORT_SUCCESS, IMPORT_ERROR } from "./importer-status.js";

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
];

export async function importData(file) {
    const zipFile = new ZipFile(file, window.pod);
    const facebookAccount = new FacebookAccount(window.pod);
    const enrichedData = { ...file, zipFile };

    const importingResults = await Promise.all(
        dataImporters.map(async (importerClass) => {
            const importer = new importerClass();
            const importStatus = await importer
                .import(enrichedData, facebookAccount, window.pod)
                .then((status) =>
                    status
                        ? { ...status, importerClass }
                        : {
                              status: IMPORT_SUCCESS,
                              importerClass,
                          }
                )
                .catch((error) => {
                    return {
                        status: IMPORT_ERROR,
                        importerClass,
                        error,
                        message: error.name,
                    };
                });
            return importStatus;
        })
    );
    facebookAccount.importingResults = importingResults;

    return facebookAccount;
}
