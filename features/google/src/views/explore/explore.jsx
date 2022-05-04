import React, { useContext } from "react";
import {
    List,
    RoutingCard,
    Card,
    PolyImportContext,
    Screen,
} from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);
    const renderFileAnalyses = () => {
        if (!account) return null;
        return (
            <Screen className="import" layout="poly-standard-layout">
                <List>
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

                <div>
                    <h1>Activities</h1>
                    {account?.activities.map((activity, i) => (
                        <div key={i}>{activity.timestamp.toUTCString()}</div>
                    ))}
                </div>
                <div>
                    <h1>Place Visits</h1>
                    {account?.placeVisits.map((placeVisit, i) => (
                        <div key={i}>{placeVisit.timestamp.toUTCString()}</div>
                    ))}
                </div>
                <div>
                    <h1>Activity segments</h1>
                    {account?.activitySegments.map((activitySegment, i) => (
                        <div key={i}>
                            {activitySegment.timestamp.toUTCString()}
                        </div>
                    ))}
                </div>
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
