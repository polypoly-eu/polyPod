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
    notificationTypes,
} from "@polypoly-eu/poly-look";

import i18n from "!silly-i18n";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleContext } from "../../context/google-context.jsx";

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);
    const { reportIsSent, handleReportSent } = useContext(GoogleContext);

    const navigate = useNavigate();
    const location = useLocation();
    const exploreRef = useRef();

    const handleCloseNotification = () => {
        handleReportSent(null);
    };

    const renderReportResult = () =>
        reportIsSent !== null && (
            <NotificationBanner
                notificationType={
                    reportIsSent
                        ? notificationTypes.success
                        : notificationTypes.error
                }
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
                            navigate: useNavigate(),
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
                            navigate={navigate}
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
        location.state.scrollingProgress = e.target.scrollTop;
    };

    //on start-up
    useEffect(() => {
        exploreRef.current.scrollTo(0, location?.state?.scrollingProgress || 0);
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
