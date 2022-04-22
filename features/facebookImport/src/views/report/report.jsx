import {
    MinistoriesStatusReport,
    ReportStories,
} from "@polypoly-eu/poly-analysis";
import { PolyImportContext } from "@polypoly-eu/poly-look";
import React, { useContext, useEffect, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";
import ministories from "../ministories/ministories.js";
import reports from "../ministories/reports.js";

import "./report.css";

const ReportView = ({ reportStories, setReportStories }) => {
    const { setReportResult, handleBack } = useContext(ImporterContext);
    const { account } = useContext(PolyImportContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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

        setReportStories(computedReportStories);
    }, [account]);

    const handleSendReport = async () => {
        setLoading(true);
        try {
            await window.pod.endpoint.send(
                "polyPediaReports",
                JSON.stringify(reportStories.jsonReport),
                "application/json"
            );
            setReportResult(true);
        } catch (_) {
            setReportResult(false);
        }

        handleBack();
    };

    return (
        <div className="report-view">
            <h1 className="report-view-title">
                {i18n.t("report:intro.headline")}
            </h1>
            <p>{i18n.t("report:intro.text")}</p>
            <div className={"button-area" + (loading ? " disabled" : "")}>
                <RouteButton className="view-details" route="/report/details">
                    {i18n.t("report:viewDetails")}
                </RouteButton>
                <button className="send-later" onClick={handleBack}>
                    {i18n.t("report:sendLater")}
                </button>
                <button className="send" onClick={handleSendReport}>
                    {i18n.t("report:send")}
                </button>
            </div>
        </div>
    );
};
export default ReportView;
