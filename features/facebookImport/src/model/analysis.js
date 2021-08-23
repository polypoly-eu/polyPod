import { ZipFile } from "../model/storage.js";

import DataBubblesAnalysis from "./analyses/data-points-bubles-analysis.js";
import DataGroupsAnalysis from "./analyses/data-groups-analysis.js";
import ConnectedAdvertisersAnalysis from "./analyses/connected-advertisers-analysis.js";
import InteractedWithAdvertisersAnalysis from "./analyses/interacted-advertisers-analysis.js";
import AdInterestsAnalysis from "./analyses/ad-interests-analysis.js";
import OffFacebookEventsAnalysis from "./analyses/off-facebook-events-analysis.js";
import MessagesAnalysis from "./analyses/messages-analysis.js";
import SearchesAnalysis from "./analyses/searches-analysis.js";
import FriendsAnalysis from "./analyses/friends-analysis.js";
import LikedPagesAnalysis from "./analyses/pages-liked-analysis";
import FollowedPagesAnalysis from "./analyses/pages-followed-analysis.js";
import RecommendedPagesAnalysis from "./analyses/pages-recommended-analysis.js";
import UnfollowedPagesAnalysis from "./analyses/pages-unfollowed-analysis.js";
import ReceivedFriendRequestsAnalysis from "./analyses/friend-requests-received-analysis.js";

import ReportMetadataAnalysis from "./analyses-report/report-metadata.js";
import NoDataFoldersAnalysis from "./analyses-report/no-data-folders.js";
import MissingExpectedJSONFilesAnalysis from "./analyses-report/missing-expected-json-files.js";
import UknownJSONFilesAnalysis from "./analyses-report/unknown-json-files.js";
import MessagesDetailsAnalysis from "./analyses/messages-details-analysis.js";
import OffFacebookEventsTypesAnalysis from "./analyses/off-facebook-events-types-analysys.js";

const subAnalyses = [
    class {
        get title() {
            return "File name";
        }

        get id() {
            return "file-name";
        }

        analyze({ name }) {
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

        analyze({ size }) {
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
    OffFacebookEventsTypesAnalysis,
    MessagesAnalysis,
    MessagesDetailsAnalysis,
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

export async function analyzeFile(file, facebookAccount) {
    const zipFile = new ZipFile(file, window.pod);
    const enrichedData = { ...file, zipFile, facebookAccount };
    const parsedAnalyses = await Promise.all(
        subAnalyses.map(async (subAnalysisClass) => {
            const subAnalysis = new subAnalysisClass();
            await subAnalysis.analyze(enrichedData);
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
