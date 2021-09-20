import React, { useContext, useEffect, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./report.css";

const PopUpMessage = ({ children, handleClosePopUp }) => {
    return (
        <div className="pop-up">
            <div className="pop-up-message">{children}</div>
            <div className="close-icon" onClick={handleClosePopUp}>
                x
            </div>
        </div>
    );
};

const ReportView = () => {
    const { fileAnalysis } = useContext(ImporterContext);
    const unrecognizedData = fileAnalysis.unrecognizedData;
    const [reportSent, setReportSent] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const handleClosePopUp = () => {
        setIsOpen(!isOpen);
    };

    const handleSendReport = async () => {
        setLoading(true);
        const error = await window.pod.network.httpPost(
            process.env.POLYPOD_POLYPEDIA_REPORT_URL,
            JSON.stringify(unrecognizedData.jsonReport),
            "application/json",
            process.env.POLYPOD_POLYPEDIA_REPORT_AUTHORIZATION
        );
        handleClosePopUp();

        if (error) {
            setError(error);
            return;
        }
        setReportSent(true);
    };

    useEffect(() => {
        if (reportSent || error) setLoading(false);
    }, [reportSent, error]);

    return (
        <div className="report-view">
            <h1 className="report-view-title">
                {i18n.t("report:intro.headline")}
            </h1>
            <p>{i18n.t("report:intro.text")}</p>
            <h1 className="report-view-title">
                {i18n.t("report:explanation.headline")}
            </h1>
            <p>{i18n.t("report:explanation.text")}</p>
            <div className="button-area">
                <RouteButton className="view-details" route="/report/details">
                    {i18n.t("report:explanation.viewDetails")}
                </RouteButton>
                <RouteButton className="send-later" route="/explore">
                    {i18n.t("report:explanation.sendLater")}
                </RouteButton>
                {isOpen && (
                    <PopUpMessage handleClosePopUp={handleClosePopUp}>
                        {reportSent ? (
                            i18n.t("report:success")
                        ) : (
                            <div>
                                <span className="unsuccessfully">
                                    {i18n.t("report:error")}
                                </span>
                                <br />
                                Message: {error} <br />
                                URL: {process.env.POLYPOD_POLYPEDIA_REPORT_URL}
                            </div>
                        )}
                    </PopUpMessage>
                )}
                {loading ? (
                    <button className="send disabled">
                        {" "}
                        {i18n.t("report:explanation.send")}
                    </button>
                ) : (
                    <button className="send" onClick={handleSendReport}>
                        {i18n.t("report:explanation.send")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReportView;
