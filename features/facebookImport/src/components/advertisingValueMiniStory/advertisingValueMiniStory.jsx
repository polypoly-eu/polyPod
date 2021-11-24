import React, { useRef } from "react";
import i18n from "../../i18n";
import ListOfDetails from "../listOfDetails/listOfDetails.jsx";
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
    for (let fontSize = maxFontSize; fontSize > minFontSize; fontSize--) {
        context.font = `${fontSize}px Jost`;
        if (context.measureText(longestInterestWord).width <= maxWidth)
            return fontSize;
    }
    return minFontSize;
};

export const AdvertisingValueMiniStorySummary = ({
    randomAdInterests,
    numberInterests,
}) => {
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
            <ol>
                {randomAdInterests.map((interest, index) => {
                    return (
                        <li key={index} ref={refWidth} className="summary">
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
            </ol>
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
