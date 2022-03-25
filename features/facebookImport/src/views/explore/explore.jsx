import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import RouteButton from "../../components/buttons/routeButton.jsx";
import Loading from "../../components/loading/loading.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./explore.css";
import "./ministory-styles.css";

const PopUpMessage = ({ children, reportResultAnswer }) => {
    return <div className={"pop-up" + reportResultAnswer}>{children}</div>;
};

const AnalysisCard = ({ analysis, setActiveDetails }) => {
    return (
        <div className="analysis-card">
            <div className="card-container">
                <h1 className="ministory-title">{analysis.title}</h1>
                {analysis.label !== null && (
                    <label>
                        {i18n.t(`explore:analysis.label.${analysis.label}`)}
                    </label>
                )}
            </div>
            <div className="summary-text">{analysis.renderSummary()}</div>
            {analysis.renderDetails ? (
                <RouteButton
                    route="/explore/details"
                    className="details-button"
                    onClick={() => setActiveDetails(analysis)}
                >
                    {i18n.t("explore:details.button")}
                </RouteButton>
            ) : null}
            <div className="card-separator"></div>
        </div>
        // <div className="analysis-card">
        //     <h1>{analysis.title}</h1>
        //     <div>{analysis.renderSummary()}</div>
        //     {analysis.renderDetails ? (
        //         <RouteButton
        //             route="/explore/details"
        //             className="details-button"
        //             onClick={() => setActiveDetails(analysis)}
        //             stateChange={{ scrollingProgress }}
        //         >
        //             {i18n.t("explore:details.button")}
        //         </RouteButton>
        //     ) : null}
        // </div>
    );
};

const UnrecognizedCard = () => {
    return (
        <div className="analysis-card unrecognized-analysis-card">
            <div className="unrecognized-analysis-title">
                <h1>{i18n.t("explore:unrecognizedCard.headline")}</h1>
            </div>
            <p>{i18n.t("explore:unrecognizedCard.text")}</p>
            <RouteButton route="/report" className="report-button">
                {i18n.t("explore:unrecognizedCard.button")}
            </RouteButton>
        </div>
    );
};

const ExploreView = () => {
    const { fileAnalysis, setActiveDetails, reportResult, setReportResult } =
        useContext(ImporterContext);

    const history = useHistory();
    const exploreRef = useRef();

    const handleCloseReportResult = () => {
        setReportResult(null);
    };

    const renderReportResult = () =>
        reportResult !== null && (
            <PopUpMessage
                reportResultAnswer={
                    reportResult ? " successfully" : " unsuccessfully"
                }
            >
                {reportResult ? (
                    <>
                        <div>{i18n.t("explore:report.success")}</div>
                        <img
                            src="./images/close_green.svg"
                            alt="close"
                            onClick={handleCloseReportResult}
                        />
                    </>
                ) : (
                    <>
                        <div>{i18n.t("explore:report.error")}</div>
                        <img
                            src="./images/close_red.svg"
                            alt="close"
                            onClick={handleCloseReportResult}
                        />
                    </>
                )}
            </PopUpMessage>
        );

    const renderFileAnalyses = () => {
        if (!fileAnalysis)
            return (
                <Loading
                    loadingGif="./images/loading.gif"
                    message={i18n.t("explore:loading")}
                />
            );
        return (
            <div>
                <UnrecognizedCard />
                {fileAnalysis.analyses.map((analysis, index) => (
                    <AnalysisCard
                        analysis={analysis}
                        key={index}
                        setActiveDetails={setActiveDetails}
                    />
                ))}
            </div>
        );
    };

    const saveScrollingProgress = (e) => {
        history.location.state.scrollingProgress = e.target.scrollTop;
    };

    //on start-up
    useEffect(() => {
        exploreRef.current.scrollTo(
            0,
            history.location?.state?.scrollingProgress || 0
        );
    }, []);

    return (
        <div
            ref={exploreRef}
            className="explore-view"
            onScroll={saveScrollingProgress}
        >
            {renderReportResult()}
            {renderFileAnalyses()}
        </div>
    );
};

export default ExploreView;
