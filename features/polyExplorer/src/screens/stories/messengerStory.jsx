import React, { useState, useRef } from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import { SUMMARY_ANIMATIONS } from "../../constants";

import "./messengerStory.css";

/*
 * The scrollyTellingDebug variable is used to show in the screen
 * how the scrollytelling marks are distributed. It is useful to
 * understand where the scrollytelling events are fired.
 * IT NEVER MUST BE PUSHED IN A PRODUCTION BRANCH WITH THE VALUE "TRUE"
 */
const scrollTellingDebug = false;
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
    const [introductionHeight, updateIntroHeight] = useState(0);
    const [summaryHeight, updateSummaryHeight] = useState(0);
    const [summaryAnimations, fireSummaryAnimation] = useState(0);

    const introMarks = [
        {
            ref: useRef(),
            animation: animationPause,
            heightPercentage: 100,
            debugColor: "red",
        },
    ];

    const summaryMarks = [
        {
            ref: useRef(),
            animation: animationPause,
            heightPercentage: 40,
            debugColor: "green",
        },
        {
            ref: useRef(),
            animation: SUMMARY_ANIMATIONS.ANIMATE_BULLET,
            heightPercentage: 5,
            debugColor: "pink",
        },
        {
            ref: useRef(),
            animation: animationPause,
            heightPercentage: 15,
            debugColor: "green",
        },
        {
            ref: useRef(),
            animation: SUMMARY_ANIMATIONS.ANIMATE_BULLET,
            heightPercentage: 5,
            debugColor: "pink",
        },
        {
            ref: useRef(),
            animation: SUMMARY_ANIMATIONS.ANIMATE_BULLET,
            heightPercentage: 15,
            debugColor: "green",
        },
        {
            ref: useRef(),
            animation: SUMMARY_ANIMATIONS.ANIMATE_BULLET,
            heightPercentage: 5,
            debugColor: "pink",
        },
        {
            ref: useRef(),
            animation: SUMMARY_ANIMATIONS.ANIMATE_BULLET,
            heightPercentage: 15,
            debugColor: "green",
        },
    ];

    function buildScrollyTellingMark(marks, totalHeight) {
        return marks.map((mark, index) => {
            const markHeight = Math.ceil(
                totalHeight * (mark.heightPercentage / 100)
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
                    style={markStyle}
                    className="scrollytelling-mark"
                    ref={mark.ref}
                ></div>
            );
        });
    }

    function scrollStory() {
        animateSummary();
    }

    function buildScrollyTellingMarksIntroduction() {
        return buildScrollyTellingMark(introMarks, introductionHeight);
    }

    function buildScrollyTellingMarksSummary() {
        return buildScrollyTellingMark(summaryMarks, summaryHeight);
    }

    function animateSummary() {
        const animationSummary = Object.values(SUMMARY_ANIMATIONS);
        const visibleMarks = summaryMarks.filter(
            (mark) => (
                animationSummary.includes(mark.animation),
                isInViewport(mark.ref.current)
            )
        );

        if (visibleMarks.length !== summaryAnimations) {
            fireSummaryAnimation(visibleMarks.length);
        }
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
                    {buildScrollyTellingMarksSummary()}
                </div>
                <div className="messenger-parts">
                    <Introduction
                        heightEvent={updateIntroHeight}
                    ></Introduction>
                    <Summary
                        heightEvent={updateSummaryHeight}
                        animation={summaryAnimations}
                    ></Summary>
                </div>
            </div>
        </DataStory>
    );
};

export default MessengerStory;
