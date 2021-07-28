import React, { useRef, useState } from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import { INTRO_ANIMATIONS } from "../../constants/index.js";

import "./messengerStory.css";

/*
 * The scrollyTellingDebug variable is used to show in the screen
 * how the scrollytelling marks are distributed. It is useful to
 * understand where the scrollytelling events are fired.
 * IT NEVER MUST BE PUSHED IN A PRODUCTION BRANCH WITH THE VALUE "TRUE"
 */
const scrollTellingDebug = true;
const animationPause = "pause";

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
}

const MessengerStory = () => {
    const [introductionHeight, updateintroductionHeight] = useState(0);
    const [introductionAnimation, fireIntroductionAnimation] = useState(
        INTRO_ANIMATIONS.BACKWARD
    );
    const marks = [
        {
            ref: useRef(),
            animation: INTRO_ANIMATIONS.BACKWARD,
            debugColor: "red",
            heightPercentage: 40,
        },
        {
            ref: useRef(),
            animation: animationPause,
            debugColor: "white",
            heightPercentage: 40,
        },
        {
            ref: useRef(),
            animation: INTRO_ANIMATIONS.FORDWARD,
            debugColor: "green",
            heightPercentage: 20,
        },
    ];

    function scrollStory() {
        const introAnimations = Object.values(INTRO_ANIMATIONS);
        const activeMark = marks.find(
            (mark) =>
                introAnimations.includes(mark.animation) &&
                mark.animation !== introductionAnimation &&
                isInViewport(mark.ref.current)
        );

        if (activeMark) {
            fireIntroductionAnimation(activeMark.animation);
        }
    }

    function getIntroductionHeight(height) {
        updateintroductionHeight(height);
    }

    function buildScrollyTellingMarksIntroduction() {
        return marks.map((mark, index) => {
            const markHeight = Math.ceil(
                introductionHeight * (mark.heightPercentage / 100)
            );
            const markStyle = {
                width: "1px",
                height: `${markHeight}px`,
                backgroundColor: scrollTellingDebug
                    ? mark.debugColor
                    : "transparent",
            };

            return (
                <div
                    key={index}
                    className="scrollytelling-mark"
                    ref={mark.ref}
                    style={markStyle}
                ></div>
            );
        });
    }

    return (
        <DataStory
            progressBarColor="black"
            className="messenger"
            scrollEvent={scrollStory}
        >
            <div className="messenger-story">
                <div className="messenger-parts">
                    {buildScrollyTellingMarksIntroduction()}
                </div>
                <div className="messenger-parts">
                    <Introduction
                        setHeight={getIntroductionHeight}
                        animation={introductionAnimation}
                    ></Introduction>
                    <Summary></Summary>
                </div>
            </div>
        </DataStory>
    );
};

export default MessengerStory;
