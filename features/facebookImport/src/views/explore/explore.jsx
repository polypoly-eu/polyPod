import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { ImporterContext } from "../../context/importer-context.jsx";
import {
    List,
    Card,
    LoadingOverlay,
    PolyImportContext,
    RoutingWrapper,
    ClickableCard,
    Screen,
    Banner,
    NotificationBanner,
    notificationTypes,
} from "@polypoly-eu/poly-look";

import i18n from "!silly-i18n";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";

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
            <NotificationBanner
                notificationType={
                    reportResult
                        ? Object.keys(notificationTypes)[1]
                        : Object.keys(notificationTypes)[2]
                }
                handleCloseNotification={handleCloseReportResult}
            >
                {reportResult ? (
                    <div>{i18n.t("explore:report.success")}</div>
                ) : (
                    <div>{i18n.t("explore:report.error")}</div>
                )}
            </NotificationBanner>
        );

    const renderFileAnalyses = () => {
        if (!account.analyses)
            return (
                <LoadingOverlay
                    loadingGif="./images/loading.gif"
                    message={i18n.t("explore:loading")}
                />
            );
        return (
            <List>
                <Banner
                    title={i18n.t("explore:reportCard.headline")}
                    description={i18n.t("explore:reportCard.text")}
                    button={{
                        label: i18n.t("explore:reportCard.button"),
                        history: history,
                        route: "/report",
                    }}
                />
                {ministories.map((MinistoryClass, index) => {
                    const ministory = new MinistoryClass({
                        account,
                    });
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
                            {ministory.render()}
                        </>
                    );
                    return ministory.hasDetails() ? (
                        <RoutingWrapper
                            key={index}
                            history={history}
                            route="/explore/details"
                            stateChange={{ ActiveStoryClass: MinistoryClass }}
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
