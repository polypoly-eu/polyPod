import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";
import {
    List,
    Card,
    LoadingOverlay,
    PolyImportContext,
    RoutingWrapper,
    ClickableCard,
    Screen,
} from "@polypoly-eu/poly-look";

import i18n from "!silly-i18n";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";

const PopUpMessage = ({ children, reportResultAnswer }) => {
    return <div className={"pop-up" + reportResultAnswer}>{children}</div>;
};

const ReportCard = () => {
    return (
        <div className="analysis-card unrecognized-analysis-card">
            <div className="unrecognized-analysis-title">
                <h1>{i18n.t("explore:reportCard.headline")}</h1>
            </div>
            <p>{i18n.t("explore:reportCard.text")}</p>
            <RouteButton route="/report" className="report-button">
                {i18n.t("explore:reportCard.button")}
            </RouteButton>
        </div>
    );
};

function NoStoriesCard() {
    const message = useRef(null);

    useEffect(() => {
        const link = message.current.querySelector("a");
        link.style.textDecoration = "underline";
        link.href = "#";
        link.addEventListener("click", () => {
            window.pod.polyNav.openUrl("support-email");
        });
    });

    return (
        <Card>
            <div
                ref={message}
                dangerouslySetInnerHTML={{
                    __html: i18n.t("explore:details.noAnalyses"),
                }}
            />
        </Card>
    );
}

const ExploreView = () => {
    const { reportResult, setReportResult } = useContext(ImporterContext);
    const { account } = useContext(PolyImportContext);

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
                <LoadingOverlay
                    loadingGif="./images/loading.gif"
                    message={i18n.t("explore:loading")}
                />
            );

        function renderMinistory(ministory, index) {
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
                    {ministory.render()}
                </>
            );

            return ministory.hasDetails() ? (
                <RoutingWrapper
                    key={index}
                    history={history}
                    route="/explore/details"
                    stateChange={{
                        activeStory: ministory,
                    }}
                >
                    <ClickableCard
                        key={index}
                        buttonText={i18n.t("explore:details.button")}
                    >
                        {content}
                    </ClickableCard>
                </RoutingWrapper>
            ) : (
                <Card key={index}>{content}</Card>
            );
        }

        const activeMinistories = ministories
            .map((MinistoryClass) => new MinistoryClass({ account }))
            .filter(({ active }) => active);
        return (
            <List>
                <ReportCard />
                {!activeMinistories.length ? (
                    <NoStoriesCard />
                ) : (
                    activeMinistories.map(renderMinistory)
                )}
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
        <Screen
            className="explore-view"
            layout="poly-standard-layout"
            onScroll={saveScrollingProgress}
            scrollingRef={exploreRef}
        >
            {renderReportResult()}
            {renderFileAnalyses()}
        </Screen>
    );
};

export default ExploreView;
