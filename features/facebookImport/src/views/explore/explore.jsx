import React, { useContext, useEffect, useRef, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import Loading from "../../components/loading/loading.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./explore.css";

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

const AnalysisCard = ({
    analysis,
    setActiveDetails,
    exploreScrollingProgress,
}) => {
    return (
        <div className="analysis-card">
            <h1>{analysis.title}</h1>
            <div>{analysis.renderSummary()}</div>
            {analysis.renderDetails ? (
                <RouteButton
                    route="/explore/details"
                    className="details-button"
                    onClick={() => setActiveDetails(analysis)}
                    stateChange={{ exploreScrollingProgress }}
                >
                    View details
                </RouteButton>
            ) : null}
        </div>
    );
};

const UnrecognizedCard = ({ unrecognizedData }) => {
    return (
        <div className="analysis-card unrecognized-analysis-card">
            <div className="unrecognized-analysis-title">
                <div className="alert-fake-icon">!</div>
                <h1>Unrecognised and Missing Data</h1>
            </div>
            <p>{unrecognizedData.report}</p>
            <RouteButton route="/report" className="report-button">
                View and send report
            </RouteButton>
        </div>
    );
};

const ExploreView = () => {
    const {
        navigationState,
        fileAnalysis,
        setActiveDetails,
        reportResult,
        setReportResult,
    } = useContext(ImporterContext);

    const [scrollingProgress, setScrollingProgress] = useState(
        navigationState.exploreScrollingProgress
    );
    const exploreRef = useRef();

    const handleCloseReportResult = () => {
        setReportResult(null);
    };

    const renderReportResult = () =>
        reportResult !== null && (
            <PopUpMessage handleClosePopUp={handleCloseReportResult}>
                {reportResult ? (
                    i18n.t("explore:report.success")
                ) : (
                    <span className="unsuccessfully">
                        {i18n.t("explore:report.error")}
                    </span>
                )}
            </PopUpMessage>
        );

    const renderFileAnalyses = () => {
        if (!fileAnalysis)
            return <Loading message={i18n.t("explore:loading")} />;
        return (
            <div>
                <UnrecognizedCard
                    unrecognizedData={fileAnalysis.unrecognizedData}
                />
                {fileAnalysis.analyses.map((analysis, index) => (
                    <AnalysisCard
                        analysis={analysis}
                        key={index}
                        setActiveDetails={setActiveDetails}
                        exploreScrollingProgress={scrollingProgress}
                    />
                ))}
            </div>
        );
    };

    const saveScrollingProgress = (e) => {
        setScrollingProgress(e.target.scrollTop);
    };

    useEffect(() => {
        exploreRef.current.scrollTo(0, scrollingProgress);
    }, []);

    return (
        <div
            ref={exploreRef}
            className="explore-view"
            onScroll={saveScrollingProgress}
        >
            <h1 className="explore-view-title">Explore your data</h1>
            {renderReportResult()}
            {renderFileAnalyses()}
        </div>
    );
};

export default ExploreView;
