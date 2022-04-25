import {
    MinistoriesStatusReport,
    ReportStories,
} from "@polypoly-eu/poly-analysis";
import { PolyImportContext } from "@polypoly-eu/poly-look";
import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { ministories } from "../ministories/ministories.js";
import { reports } from "../ministories/reports.js";
import ReportDetails from "./details.jsx";
import ReportView from "./report.jsx";

const ReportWrapper = () => {
    const { account } = useContext(PolyImportContext);

    const computedReportStoriesList = reports.map(
        (reportClass) => new reportClass(account)
    );

    const computedMinistories = ministories.map(
        (MinistoryClass) => new MinistoryClass(account)
    );

    const activeReportStories = computedReportStoriesList.filter(
        (reportStory) => reportStory.active
    );
    const statusReport = new MinistoriesStatusReport([
        ...computedReportStoriesList,
        ...computedMinistories,
    ]);

    const computedReportStories = new ReportStories([
        ...activeReportStories,
        statusReport,
    ]);

    return (
        <>
            <Route exact path="/report">
                <ReportView reportStories={computedReportStories} />
            </Route>
            <Route exact path="/report/details">
                <ReportDetails reportStories={computedReportStories} />
            </Route>
        </>
    );
};

export default ReportWrapper;
