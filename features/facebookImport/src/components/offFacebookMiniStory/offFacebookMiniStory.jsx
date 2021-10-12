import React from "react";
import { MirroredBarChart } from "@polypoly-eu/poly-look";
import i18n from "../../i18n";

import "./offFacebookMiniStory.css";

export const OffFacebookMiniStorySummary = ({
    companiesCount,
    purchasesCount,
}) => {
    return (
        <div className="off-facebook-events-mini-story-summary">
            <h2>{companiesCount}</h2>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("offFacebookEventsMiniStory:total", {
                        number_companies: companiesCount,
                        number_purchases: purchasesCount,
                    }),
                }}
            />
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </div>
    );
};

export const OffFacebookMiniStoryDetails = ({ displayData }) => {
    return (
        <div className="ministory-details">
            {Object.entries(displayData).map(([companyName, data], i) => (
                <div key={i}>
                    <p>{companyName}</p>
                    <MirroredBarChart
                        data={data}
                        colors={{ upperBar: "#EB6561", lowerBar: "#F7FAFC" }}
                        width="400"
                        height="200"
                    />
                </div>
            ))}
        </div>
    );
};
