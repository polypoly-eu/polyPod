import React from "react";
import i18n from "../../i18n";

import "./advertisingValueMiniStory.css";

const AdvertisingValueMiniStory = ({ randomAdInterests, numberInterests }) => {
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
                {randomAdInterests.map((interest, index) => (
                    <li key={index}>{interest}</li>
                ))}
            </ul>
            <p>{i18n.t("advertisingValueMiniStory:end.text")}</p>
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </div>
    );
};

export default AdvertisingValueMiniStory;
