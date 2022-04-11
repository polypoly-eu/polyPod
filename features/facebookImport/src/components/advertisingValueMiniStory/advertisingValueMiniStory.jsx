import React from "react";
import i18n from "../../i18n";
import ListOfDetails from "../listOfDetails/listOfDetails.jsx";
import "./advertisingValueMiniStory.css";

export const AdvertisingValueMiniStorySummary = ({
    randomAdInterests,
    numberInterests,
}) => {
    return (
        <div className="advertising-value-mini-story">
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("advertisingValueMiniStory:intro", {
                        number_interests: numberInterests,
                    }),
                }}
            />
            <ul>
                {randomAdInterests.map((interest, index) => {
                    return (
                        <li key={index} className="summary">
                            <p>{interest}</p>
                        </li>
                    );
                })}
            </ul>
            <p>{i18n.t("advertisingValueMiniStory:end.text")}</p>
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </div>
    );
};

export const AdvertisingValueMiniStoryDetails = ({
    displayData,
    numberInterests,
}) => {
    return (
        <div className="detail-view">
            <p
                className="intro"
                dangerouslySetInnerHTML={{
                    __html: i18n.t("advertisingValueMiniStory:details.text.1", {
                        number: numberInterests,
                    }),
                }}
            />
            <ListOfDetails list={displayData}></ListOfDetails>
        </div>
    );
};
