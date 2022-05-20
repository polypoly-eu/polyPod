import React from "react";
import { PolyChart } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

import "./onOffFacebookMiniStory.css";
import BarChart from "../dataViz/barChart.jsx";
import InfoButton from "../buttons/infoButton/infoButton.jsx";

const legend = (
    <div className="legend">
        <div>
            <img
                className="on-bars"
                src="./images/legend-bars-on.svg"
                alt="legend-on-facebook-bars"
            />
            <p>{i18n.t("offFacebookEventsMiniStory:on.fb.events")}</p>
        </div>
        <div>
            <img
                src="./images/legend-bars-off.svg"
                alt="legend-off-facebook-bars"
            />
            <p>{i18n.t("offFacebookEventsMiniStory:off.fb.events")}</p>
        </div>
    </div>
);

export const OnOffFacebookMiniStorySummary = ({
    companiesCount,
    companiesWithAdsCount,
}) => {
    return (
        <div className="off-facebook-events-ministory-summary">
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("offFacebookEventsMiniStory:general"),
                }}
            />
            <p className="highlighted-number">{companiesCount}</p>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("offFacebookEventsMiniStory:companies", {
                        number_companies: companiesCount,
                    }),
                }}
            />
            {companiesWithAdsCount === 0 ? null : (
                <>
                    <p className="highlighted-number">
                        {companiesWithAdsCount}
                    </p>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: i18n.t(
                                "offFacebookEventsMiniStory:companiesWithAds",
                                {
                                    companiesWithAds: companiesWithAdsCount,
                                }
                            ),
                        }}
                    />
                </>
            )}
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </div>
    );
};

export const OnOffFacebookMiniStoryDetails = ({ displayData }) => {
    return (
        <div className="off-facebook-events-ministory-details">
            <p>{i18n.t("offFacebookEventsMiniStory:off.events.text.1")}</p>
            <p>{i18n.t("offFacebookEventsMiniStory:off.events.text.2")}</p>
            <BarChart data={displayData.offEvents.companies.slice(0, 5)} />
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
            <h2>{displayData.offEvents.activityTypes.length}</h2>
            <p>{i18n.t("offFacebookEventsMiniStory:off.events.text.3")}</p>
            <BarChart data={displayData.offEvents.activityTypes.slice(0, 5)} />
            <div className="off-facebook-info-button">
                <InfoButton infoScreen="off-facebook-info" />
            </div>
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
            {displayData.onOffEvents ? (
                <>
                    <div className="poly-separator"></div>
                    <h3>
                        {i18n.t(
                            "offFacebookEventsMiniStory:on.off.events.title"
                        )}
                    </h3>
                    <p>
                        {i18n.t(
                            "offFacebookEventsMiniStory:on.off.events.text.1"
                        )}
                    </p>
                    {legend}
                    {Object.entries(displayData.onOffEvents).map(
                        ([companyName, data], i) => (
                            <div key={i}>
                                <div className="divide-y">
                                    <p>{companyName}</p>
                                    <p className="source">
                                        {i18n.t(
                                            "offFacebookEventsMiniStory:on.off.events.number.events"
                                        )}
                                    </p>
                                </div>
                                <PolyChart
                                    type="mirrored-bar-chart"
                                    data={data}
                                    colors={{
                                        upperBar: "#EB6561",
                                        lowerBar: "#F7FAFC",
                                    }}
                                    width="400"
                                    height="200"
                                    numberTicks={{ x: 9, y: 3 }}
                                />
                                <div className="source">
                                    {i18n.t(
                                        "offFacebookEventsMiniStory:last.90.days"
                                    )}
                                </div>
                            </div>
                        )
                    )}
                    <p>
                        {i18n.t(
                            "offFacebookEventsMiniStory:on.off.events.text.2"
                        )}
                    </p>
                    <div className="on-off-facebook-info-button">
                        <InfoButton infoScreen="on-off-facebook-info" />
                    </div>
                    <p className="source">
                        {i18n.t("common:source.your.facebook.data")}
                    </p>
                </>
            ) : null}
        </div>
    );
};
