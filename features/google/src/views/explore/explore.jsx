import React, { useContext } from "react";
import {
    List,
    RoutingCard,
    Card,
    PolyImportContext,
} from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./explore.css";
import { ministories } from "../ministories/ministories.js";

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);

    const renderFileAnalyses = () => {
        return (
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
