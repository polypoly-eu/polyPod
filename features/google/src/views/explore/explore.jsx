import React, { useContext, useRef, useEffect } from "react";
import {
    List,
    Card,
    PolyImportContext,
    Screen,
    RoutingWrapper,
    ClickableCard,
    PolyButton,
} from "@polypoly-eu/poly-look";

import i18n from "!silly-i18n";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";
import { useHistory } from "react-router-dom";

const ReportCard = () => {
    const history = useHistory();

    return (
        <div className="analysis-card unrecognized-analysis-card poly-theme-light">
            <div className="unrecognized-analysis-title">
                <h1>{"We need your help!"}</h1>
            </div>
            <p>
                {
                    "If you send us an anonymised report about the structure of your Google data, it would help us improve the Google Data Importer so that it can show you even more insights."
                }
            </p>
            <RoutingWrapper route="/report" history={history}>
                <PolyButton label="Learn more" className="report-button" />
            </RoutingWrapper>
        </div>
    );
};

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);

    const history = useHistory();
    const exploreRef = useRef();

    const renderFileAnalyses = () => {
        if (!account) return null;
        return (
            <List>
                <ReportCard />
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
            className="explore"
            layout="poly-standard-layout"
            onScroll={saveScrollingProgress}
            scrollingRef={exploreRef}
        >
            {renderFileAnalyses()}
        </Screen>
    );
};

export default ExploreView;
