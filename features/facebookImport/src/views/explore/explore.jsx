import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import RouteButton from "../../components/buttons/routeButton.jsx";
import Loading from "../../components/loading/loading.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";
import {
    List,
    RoutingCard,
    Card,
    PolyImportContext,
} from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";

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
    const { reportResult, setReportResult } = useContext(ImporterContext);
<<<<<<< HEAD
    const { account } = useContext(PolyImportContext);

=======

    const { account } = useContext(PolyImportContext);
>>>>>>> main
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
        if (!account.analyses)
            return (
                <Loading
                    loadingGif="./images/loading.gif"
                    message={i18n.t("explore:loading")}
                />
            );
        return (
            <List>
                <UnrecognizedCard />
                {ministories.map((MinistoryClass, index) => {
                    const ministory = new MinistoryClass(account);
                    if (!ministory.active) return;
                    const content = (
                        <>
                            <h1>{ministory.title}</h1>
                            {ministory.label !== null && (
                                <label>
                                    {i18n.t(
                                        `explore:analysis.label.${ministory.label}`
                                    )}
                                </label>
                            )}
                            {ministory.renderSummary()}
                        </>
                    );
                    return ministory.renderDetails ? (
                        <RoutingCard
                            key={index}
                            history={history}
                            route="/explore/details"
                            stateChange={{ activeAnalysis: ministory }}
                            buttonText={i18n.t("explore:details.button")}
                        >
                            {content}
                        </RoutingCard>
                    ) : (
                        <Card key={index}>{content}</Card>
                    );
                })}
            </List>
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
