import React, { useRef } from "react";
import i18n from "../../i18n";

import "./advertisingValueMiniStory.css";

const calculateFontSize = (text, maxWidth) => {
    // TODO: Extract text size affecting styles from target element

    const minFontSize = 14;
    const maxFontSize = 34;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // following takes the three interests, splits them into single words and picks the longest word
    let splitInterests = [].concat.apply(
        [],
        text.map((interest) => interest.split(" "))
    );
    let interestsLength = splitInterests.map(
        (word) => context.measureText(word).width
    );
    let longestInterestWordIndex = interestsLength.indexOf(
        Math.max(...interestsLength)
    );
    let longestInterestWord = splitInterests[longestInterestWordIndex];
    console.log(longestInterestWord);
    for (let fontSize = maxFontSize; fontSize > minFontSize; fontSize--) {
        context.font = `${fontSize}px Jost`;
        if (context.measureText(longestInterestWord).width <= maxWidth)
            return fontSize;
    }
    return minFontSize;
};

const AdvertisingValueMiniStory = ({ randomAdInterests, numberInterests }) => {
    const refWidth = useRef(0);
    const fontSize = calculateFontSize(
        randomAdInterests,
        refWidth.current.clientWidth
    );
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
                        <li key={index} ref={refWidth}>
                            <p
                                style={{
                                    fontSize: fontSize,
                                }}
                            >
                                {interest}
                            </p>
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

export default AdvertisingValueMiniStory;
