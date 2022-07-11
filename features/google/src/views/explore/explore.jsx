import React, { useContext, useRef, useEffect } from "react";
import {
    List,
    Card,
    PolyImportContext,
    Screen,
    RoutingWrapper,
    ClickableCard,
    Banner,
} from "@polypoly-eu/poly-look";

import i18n from "!silly-i18n";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";
import { useHistory } from "react-router-dom";
import { GoogleContext } from "../../context/google-context.jsx";

const PopUpMessage = ({ children, reportResultAnswer }) => {
    return (
        <div className="pop-up-container">
            <div className={"pop-up" + reportResultAnswer}>{children}</div>
        </div>
    );
};

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);
    const { reportIsSent, handleReportSent } = useContext(GoogleContext);

    const history = useHistory();
    const exploreRef = useRef();

    const handleCloseReportResult = () => {
        handleReportSent(null);
    };

    const renderReportResult = () =>
        reportIsSent !== null && (
            <PopUpMessage
                reportResultAnswer={
                    reportIsSent ? " successfully" : " unsuccessfully"
                }
            >
                {reportIsSent ? (
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
