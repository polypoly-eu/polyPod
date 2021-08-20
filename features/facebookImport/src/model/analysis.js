import { ZipFile } from "../model/storage.js";

import DataBubblesAnalysis from "./analyses/data-points-bubles.js";
import DataGroupsAnalysis from "./analyses/data-groups.js";
import ConnectedAdvertisersAnalysis from "./analyses/connected-advertisers.js";
import InteractedWithAdvertisersAnalysis from "./analyses/interacted-advertisers.js";
import AdInterestsAnalysis from "./analyses/ad-interests.js";
import OffFacebookEventsAnalysis from "./analyses/off-facebook-events.js";
import MessagesAnalysis from "./analyses/messages.js";
import SearchesAnalysis from "./analyses/searches.js";
import FriendsAnalysis from "./analyses/friends.js";
import LikedPagesAnalysis from "./analyses/pages-liked.js";
import FollowedPagesAnalysis from "./analyses/pages-followed.js";
import RecommendedPagesAnalysis from "./analyses/pages-recommended.js";
import UnfollowedPagesAnalysis from "./analyses/pages-unfollowed.js";
import ReceivedFriendRequestsAnalysis from "./analyses/friend-requests-received.js";

import ReportMetadataAnalysis from "./analyses-report/report-metadata.js";
import NoDataFoldersAnalysis from "./analyses-report/no-data-folders.js";
import MissingExpectedJSONFilesAnalysis from "./analyses-report/missing-expected-json-files.js";
import UknownJSONFilesAnalysis from "./analyses-report/unknown-json-files.js";

const subAnalyses = [
    class {
        get title() {
            return "File name";
        }

        get id() {
            return "file-name";
        }

        parse({ name }) {
            this.active = true;
            this._name = name;
        }

        render() {
            return "" + this._name;
        }
    },
    class {
        get title() {
            return "File size";
        }

        get id() {
            return "file-size";
        }

        parse({ size }) {
            this.active = true;
            this._size = size;
        }

        render() {
            return "" + this._size;
        }
    },

    DataBubblesAnalysis,
    DataGroupsAnalysis,
    //JsonFilesBubblesAnalysis,
    ConnectedAdvertisersAnalysis,
    InteractedWithAdvertisersAnalysis,
    AdInterestsAnalysis,
    OffFacebookEventsAnalysis,
    MessagesAnalysis,
    SearchesAnalysis,
    FriendsAnalysis,
    LikedPagesAnalysis,
    FollowedPagesAnalysis,
    RecommendedPagesAnalysis,
    UnfollowedPagesAnalysis,
    ReceivedFriendRequestsAnalysis,

    ReportMetadataAnalysis,
    NoDataFoldersAnalysis,
    UknownJSONFilesAnalysis,
    MissingExpectedJSONFilesAnalysis,
];

class UnrecognizedData {
    constructor(reportAnalyses) {
        this.reportAnalyses = reportAnalyses;
        this.active = this.reportAnalyses && this.reportAnalyses.length > 0;
    }

    get report() {
        if (!this.active) {
            return "No data to report!";
        }
        return this.reportAnalyses.length + " analyses included in the report";
    }

    get jsonReport() {
        if (!this.active) {
            return {};
        }
        const reportAnalyses = this.reportAnalyses
            .filter((analysis) => analysis.isForDataReport)
            .map((analysis) => analysis.jsonReport);
        const inactiveAnalyses = this.reportAnalyses
            .filter((analysis) => !analysis.isForDataReport)
            .map((analysis) => analysis.id);

        return { reportAnalyses, inactiveAnalyses };
    }
}

export async function analyzeFile(file) {
    const zipFile = new ZipFile(file, window.pod);
    const enrichedFile = { ...file, zipFile };
    const parsedAnalyses = await Promise.all(
        subAnalyses.map(async (subAnalysisClass) => {
            const subAnalysis = new subAnalysisClass();
            await subAnalysis.parse(enrichedFile);
            return subAnalysis;
        })
    );

    const activeAnalyses = parsedAnalyses.filter(
        (analysis) => !analysis.isForDataReport && analysis.active
    );
    const reportAnalyses = parsedAnalyses.filter(
        (analysis) =>
            (analysis.isForDataReport && analysis.active) ||
            (!analysis.isForDataReport && !analysis.active)
    );

    return {
        analyses: activeAnalyses,
        unrecognizedData: new UnrecognizedData(reportAnalyses),
    };
}
