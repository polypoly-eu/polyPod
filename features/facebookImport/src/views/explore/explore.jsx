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
        <>
            <div className="analysis-card">
                <h1>{analysis.title}</h1>
                {analysis.label !== null && (
                    <label>
                        {i18n.t(`explore:analysis.label.${analysis.label}`)}
                    </label>
                )}
                <div className="summary-text">{analysis.renderSummary()}</div>
                {analysis.renderDetails ? (
                    <RouteButton
                        route="/explore/details"
                        className="details-button"
                        onClick={() => setActiveDetails(analysis)}
                        stateChange={{ exploreScrollingProgress }}
                    >
                        {i18n.t("explore:details.button")}
                    </RouteButton>
                ) : null}
            </div>
            <div className="card-separator"></div>
        </>
        // <div className="analysis-card">
        //     <h1>{analysis.title}</h1>
        //     <div>{analysis.renderSummary()}</div>
        //     {analysis.renderDetails ? (
        //         <RouteButton
        //             route="/explore/details"
        //             className="details-button"
        //             onClick={() => setActiveDetails(analysis)}
        //             stateChange={{ exploreScrollingProgress }}
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
                <UnrecognizedCard />
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
            {renderReportResult()}
            {renderFileAnalyses()}
        </div>
    );
};

export default ExploreView;
