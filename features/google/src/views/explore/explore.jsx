import React, { useContext, useRef, useEffect } from "react";
import {
    List,
    Card,
    PolyImportContext,
    Screen,
    RoutingWrapper,
    ClickableCard,
    Banner,
    NotificationBanner,
} from "@polypoly-eu/poly-look";

import i18n from "!silly-i18n";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";
import { useHistory } from "react-router-dom";
import { GoogleContext } from "../../context/google-context.jsx";

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);
    const { reportIsSent, handleReportSent } = useContext(GoogleContext);

    const history = useHistory();
    const exploreRef = useRef();

    const handleCloseNotification = () => {
        handleReportSent(null);
    };

    const renderReportResult = () =>
        reportIsSent !== null && (
            <NotificationBanner
                notificationType={reportIsSent ? "success" : "error"}
                handleCloseNotification={handleCloseNotification}
            >
                {reportIsSent ? (
                    <div>{i18n.t("explore:report.success")}</div>
                ) : (
                    <div>{i18n.t("explore:report.error")}</div>
                )}
            </NotificationBanner>
        );

    const renderFileAnalyses = () => {
        if (!account) return null;
        return (
            <List>
                {!reportIsSent && (
                    <Banner
                        title={i18n.t("explore:reportCard.headline")}
                        description={i18n.t("explore:reportCard.text")}
                        button={{
                            label: i18n.t("explore:reportCard.button"),
                            history: useHistory(),
                            route: "/report",
                        }}
                    />
                )}
                {ministories.map((MinistoryClass, index) => {
                    const ministory = new MinistoryClass({
                        account,
                    });
                    if (!ministory.active) return;
                    const content = (
                        <>
                            <h1>{ministory.title}</h1>
                            {ministory.label !== null && (
                                <label>{ministory.label}</label>
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
                                ActiveStoryClass: MinistoryClass,
                            }}
                        >
                            <ClickableCard
                                key={index}
                                buttonText={i18n.t("common:details")}
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
