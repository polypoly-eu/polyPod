import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import RouteButton from "../../components/buttons/routeButton.jsx";
import Loading from "../../components/loading/loading.jsx";
import { FileLoaderContext } from "../../context/file-loader-context.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";
import { StoryCardList, StoryCard } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./explore.css";

const PopUpMessage = ({ children, reportResultAnswer }) => {
    return <div className={"pop-up" + reportResultAnswer}>{children}</div>;
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
    const { setActiveDetails, reportResult, setReportResult } =
        useContext(ImporterContext);

    const { fileAnalysis } = useContext(FileLoaderContext);

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
            <StoryCardList>
                <UnrecognizedCard />
                {fileAnalysis.analyses.map((analysis, index) => (
                    <StoryCard
                        key={index}
                        navigation={
                            analysis.renderDetails && {
                                history: history,
                                route: "/explore/details",
                                stateChange: { activeAnalysis: analysis },
                                buttonText: i18n.t("explore:details.button"),
                            }
                        }
                    >
                        <h1>{analysis.title}</h1>
                        {analysis.label !== null && (
                            <label>
                                {i18n.t(
                                    `explore:analysis.label.${analysis.label}`
                                )}
                            </label>
                        )}
                        {analysis.renderSummary()}
                    </StoryCard>
                ))}
            </StoryCardList>
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
