import React, { useContext } from "react";
import {
    List,
    Card,
    PolyImportContext,
    Screen,
    RoutingWrapper,
    ClickableCard,
    PolyButton,
} from "@polypoly-eu/poly-look";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";
import { useHistory } from "react-router-dom";

const UnrecognizedCard = () => {
    const history = useHistory();

    return (
        <div className="analysis-card unrecognized-analysis-card">
            <div className="unrecognized-analysis-title">
                <h1>{"We need your help!"}</h1>
            </div>
            <p>
                {
                    "If you send us an anonymised report about the structure of your Facebook data, it would help us improve the Google Data Importer so that it can show you even more insights."
                }
            </p>
            <RoutingWrapper route="/report" history={history}>
                <PolyButton className="report-button">
                    {"Learn more"}
                </PolyButton>
            </RoutingWrapper>
        </div>
    );
};

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);
    const renderFileAnalyses = () => {
        if (!account) return null;
        return (
            <Screen className="explore" layout="poly-standard-layout">
                <List>
                    <UnrecognizedCard />
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
                                history={history}
                                route="/explore/details"
                                stateChange={{
                                    ActiveStoryClass: MinistoryClass,
                                }}
                            >
                                <ClickableCard
                                    key={index}
                                    buttonText={"Details"}
                                >
                                    {content}
                                </ClickableCard>
                            </RoutingWrapper>
                        ) : (
                            <Card key={index}>{content}</Card>
                        );
                    })}
                </List>
            </Screen>
        );
    };

    const saveScrollingProgress = (e) => {
        history.location.state.scrollingProgress = e.target.scrollTop;
    };

    return (
        <div className="explore-view" onScroll={saveScrollingProgress}>
            {renderFileAnalyses()}
        </div>
    );
};

export default ExploreView;
