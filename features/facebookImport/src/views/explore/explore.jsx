import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FacebookContext } from "../../context/facebook-context.jsx";
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
    const { reportResult, setReportResult } = useContext(FacebookContext);
    const { account } = useContext(PolyImportContext);

    const navigate = useNavigate();
    const location = useLocation();
    const exploreRef = useRef();

    const handleCloseReportResult = () => {
        setReportResult(null);
    };

    const renderReportResult = () =>
        reportResult !== null && (
            <NotificationBanner
                notificationType={
                    reportResult
                        ? notificationTypes.success
                        : notificationTypes.error
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

            console.log(ministory);

            return ministory.hasDetails() ? (
                <RoutingWrapper
                    key={index}
                    navigate={navigate}
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
                <Banner
                    title={i18n.t("explore:reportCard.headline")}
                    description={i18n.t("explore:reportCard.text")}
                    button={{
                        label: i18n.t("explore:reportCard.button"),
                        navigate: navigate,
                        route: "/report",
                    }}
                />
                {!activeMinistories.length ? (
                    <NoStoriesCard />
                ) : (
                    activeMinistories.map(renderMinistory)
                )}
            </List>
        );
    };

    // const saveScrollingProgress = (e) => {
    //     location.state.scrollingProgress = e.target.scrollTop;
    // };

    //on start-up
    useEffect(() => {
        exploreRef.current.scrollTo(0, location?.state?.scrollingProgress || 0);
    }, []);

    return (
        <Screen
            className="explore-view"
            layout="poly-standard-layout"
            // onScroll={saveScrollingProgress}
            scrollingRef={exploreRef}
        >
            {renderReportResult()}
            {renderFileAnalyses()}
        </Screen>
    );
};

export default ExploreView;
