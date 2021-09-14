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
import ReceivedFriendRequestsAnalysis from "./analyses/friend-requests-received-analysis.js";
import PagesOverviewAnalysis from "./analyses/pages-overview-activity.js";
import ReportMetadataAnalysis from "./analyses-report/report-metadata.js";
import NoDataFoldersAnalysis from "./analyses-report/no-data-folders.js";
import MissingCommonJSONFilesAnalysis from "./analyses-report/missing-common-json-files.js";
import MissingKnownJSONFilesAnalysis from "./analyses-report/missing-known-json-files.js";
import UnknownJSONFilesAnalysis from "./analyses-report/unknown-json-files.js";
import MessagesDetailsAnalysis from "./analyses/messages-details-analysis.js";
import MessageThreadsAnalysis from "./analyses/message-threads-analysis.js";
import OffFacebookEventsTypesAnalysis from "./analyses/off-facebook-events-types-analysys.js";
import DataChartsAnalysis from "./analyses/data-points-charts-analysis.js";
import OffFacebookEventsTypesChartAnalysis from "./analyses/off-facebook-events-types-charts-analysis.js";
import DataImportingStatusAnalysis from "./analyses-report/importing-status-analysys.js";
import JsonFilesBubblesAnalysis from "./analyses/json-files-bubbles.js";
import ImportedJsonFilesAnalysis from "./analyses/json-files-imported-analysis.js";
import ExportTitleAnalysis from "./analyses/export-title-analysis.js";
import ExportSizeAnalysis from "./analyses/export-size-analysis.js";
import EmailAddressesAnalysis from "./analyses/email-addresses-analysis.js";
import UnknownMessageTypesAnalysis from "./analyses-report/unkown-message-types-analysis.js";
import SesssionActivityLocationsAnalysis from "./analyses/activity-locations-analysis.js";
import MessagesActivityAnalysis from "./analyses/messages-activity-analysis.js";
import JSONFileNamesAnalysis from "./analyses-report/json-file-names-analysis.js";
import OffFacebookEventTypesAnalysis from "./analyses-report/off-facebook-event-types-analysis.js";
import UknownTopLevelFoldersAnalysis from "./analyses-report/unknown-top-level-folders-analysis.js";

const subAnalyses = [
    ExportTitleAnalysis,
    ExportSizeAnalysis,
    DataBubblesAnalysis,
    DataChartsAnalysis,
    DataGroupsAnalysis,
    JsonFilesBubblesAnalysis,
    ConnectedAdvertisersAnalysis,
    InteractedWithAdvertisersAnalysis,
    AdInterestsAnalysis,
    OffFacebookEventsAnalysis,
    OffFacebookEventsTypesChartAnalysis,
    OffFacebookEventsTypesAnalysis,
    MessagesAnalysis,
    MessagesDetailsAnalysis,
    EmailAddressesAnalysis,
    MessageThreadsAnalysis,
    MessagesActivityAnalysis,
    SearchesAnalysis,
    FriendsAnalysis,
    ReceivedFriendRequestsAnalysis,
    PagesOverviewAnalysis,
    SesssionActivityLocationsAnalysis,
    ImportedJsonFilesAnalysis,

    ReportMetadataAnalysis,
    DataImportingStatusAnalysis,
    UnknownMessageTypesAnalysis,
    NoDataFoldersAnalysis,
    UknownTopLevelFoldersAnalysis,
    UnknownJSONFilesAnalysis,
    JSONFileNamesAnalysis,
    MissingCommonJSONFilesAnalysis,
    MissingKnownJSONFilesAnalysis,
    OffFacebookEventTypesAnalysis,
];

class InactiveCardsSummary {
    constructor(inactiveAnalyses) {
        this._inactiveAnalyses = inactiveAnalyses;
        this.active = this._inactiveAnalyses.length > 0;
    }

    get title() {
        return "Inactive Analyses";
    }

    get id() {
        return InactiveCardsSummary.name;
    }

    get jsonReport() {
        return {
            id: this.id,
            inactiveAnalyses: this._inactiveAnalyses,
        };
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

        const inactiveAnalyses = executedAnalyses.filter(
            (analysis) => !analysis.active
        );
        const inactiveCardsSummary = new InactiveCardsSummary(inactiveAnalyses);
        if (inactiveCardsSummary.active) {
            this._activeReportAnalyses.push(inactiveCardsSummary);
        }

        this.active = this._activeReportAnalyses.length > 0;
    }

    get reportAnalyses() {
        return this._activeReportAnalyses;
    }

    get report() {
        if (!this.active) {
            return "No data to report!";
        }
        return (
            this.reportAnalyses.length +
            " " +
            (this.reportAnalyses.length > 0 ? "analyses" : "analysis") +
            "  included in the report"
        );
    }

    get jsonReport() {
        if (!this.active) {
            return {};
        }

        const reportAnalyses = this.reportAnalyses.map(
            (analysis) => analysis.jsonReport
        );

        return { reportAnalyses_v1: reportAnalyses };
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
