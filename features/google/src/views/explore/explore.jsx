import React, { useContext } from "react";
import {
    List,
    Card,
    PolyImportContext,
    Screen,
    RoutingWrapper,
    ClickableCard,
} from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);
    const renderFileAnalyses = () => {
        if (!account) return null;
        console.log(account);
        return (
            <Screen className="explore" layout="poly-standard-layout">
                <List>
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
                                history={history}
                                route="/explore/details"
                                stateChange={{
                                    ActiveStoryClass: MinistoryClass,
                                }}
                            >
                                <ClickableCard
                                    key={index}
                                    buttonText={i18n.t(
                                        "explore:details.button"
                                    )}
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
