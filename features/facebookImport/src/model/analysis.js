import React from "react";
import { ZipFile } from "../model/storage.js";

import DataBubblesAnalysis from "./analyses/data-points-bubbles-analysis.js";
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
import MissingKnownJSONFilesAnalysis from "./analyses-report/missing-known-json-files.js";
import UknownJSONFilesAnalysis from "./analyses-report/unknown-json-files.js";
import MessagesDetailsAnalysis from "./analyses/messages-details-analysis.js";
import MessagesChatsAnalysis from "./analyses/messages-chats-analysis.js";
import OffFacebookEventsTypesAnalysis from "./analyses/off-facebook-events-types-analysys.js";
import DataChartsAnalysis from "./analyses/data-points-charts-analysis.js";
import OffFacebookEventsTypesChartAnalysis from "./analyses/off-facebook-events-types-charts-analysis.js";
import DataImportingStatusAnalysis from "./analyses-report/importing-status-analysys.js";
import JsonFilesBubblesAnalysis from "./analyses/json-files-bubbles.js";
import ImportedJsonFilesAnalysis from "./analyses/json-files-imported-analysis.js";
import ExportTitleAnalysis from "./analyses/export-title-analysis.js";
import ExportSizeAnalysis from "./analyses/export-size-analysis.js";

const subAnalyses = [
    ExportTitleAnalysis,
    ExportSizeAnalysis,

    DataBubblesAnalysis,
    DataChartsAnalysis,
    DataGroupsAnalysis,
    JsonFilesBubblesAnalysis,
    ImportedJsonFilesAnalysis,
    ConnectedAdvertisersAnalysis,
    InteractedWithAdvertisersAnalysis,
    AdInterestsAnalysis,
    OffFacebookEventsAnalysis,
    OffFacebookEventsTypesChartAnalysis,
    OffFacebookEventsTypesAnalysis,
    MessagesAnalysis,
    MessagesDetailsAnalysis,
    MessagesChatsAnalysis,
    SearchesAnalysis,
    FriendsAnalysis,
    LikedPagesAnalysis,
    FollowedPagesAnalysis,
    RecommendedPagesAnalysis,
    UnfollowedPagesAnalysis,
    ReceivedFriendRequestsAnalysis,

    ReportMetadataAnalysis,
    DataImportingStatusAnalysis,
    NoDataFoldersAnalysis,
    UknownJSONFilesAnalysis,
    MissingKnownJSONFilesAnalysis,
];

class InactiveAnalysis {
    constructor(inactiveAnalyses) {
        this._inactiveAnalyses = inactiveAnalyses;
    }

    get title() {
        return "Inactive Analyses";
    }

    get id() {
        return InactiveAnalysis.name;
    }

    render() {
        return (
            <ul>
                {this._inactiveAnalyses.map((analysis, index) => (
                    <li key={index}>{analysis.id}</li>
                ))}
            </ul>
        );
    }
}

class UnrecognizedData {
    constructor(executedAnalyses) {
        this._activeReportAnalyses = executedAnalyses.filter(
            (analysis) => analysis.isForDataReport && analysis.active
        );
        this._inactiveAnalyses = executedAnalyses.filter(
            (analysis) => !analysis.active
        );
        this.active =
            this._activeReportAnalyses.length > 0 ||
            this._inactiveAnalyses.length > 0;
    }

    get reportAnalyses() {
        return this._activeReportAnalyses;
    }

    get inactiveAnalysis() {
        return new InactiveAnalysis(this._inactiveAnalyses);
    }

    get report() {
        if (!this.active) {
            return "No data to report!";
        }
        return (
            this._activeReportAnalyses.length +
            " analyses included in the report"
        );
    }

    get jsonReport() {
        if (!this.active) {
            return {};
        }
        const reportAnalyses = this._activeReportAnalyses.map(
            (analysis) => analysis.jsonReport
        );
        const inactiveAnalysesIds = this._inactiveAnalyses.map(
            (analysis) => analysis.id
        );

        return { reportAnalyses, inactiveAnalysesIds };
    }
}

export async function analyzeFile(file, facebookAccount) {
    const zipFile = new ZipFile(file, window.pod);
    const enrichedData = { ...file, zipFile, facebookAccount };
    const executedAnalyses = await Promise.all(
        subAnalyses.map(async (subAnalysisClass) => {
            const subAnalysis = new subAnalysisClass();
            await subAnalysis.analyze(enrichedData);
            return subAnalysis;
        })
    );

    const activeGlobalAnalyses = executedAnalyses.filter(
        (analysis) => !analysis.isForDataReport && analysis.active
    );

    return {
        analyses: activeGlobalAnalyses,
        unrecognizedData: new UnrecognizedData(executedAnalyses),
    };
}
