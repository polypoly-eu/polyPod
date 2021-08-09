import React, { useState, useRef, useContext } from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import Overview from "../../components/clusterStories/messengers/overview.jsx";
import { SUMMARY_ANIMATIONS, DONUT_CHART } from "../../constants";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import * as _ from "lodash";

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
    const { products } = useContext(ExplorerContext);
    const [introductionHeight, updateIntroHeight] = useState(0);
    const [summaryHeight, updateSummaryHeight] = useState(0);
    const [summaryAnimations, fireSummaryAnimation] = useState(0);
    const [overviewHeight, updateOverviewHeight] = useState(0);

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

    const overviewMarks = [
        {
            ref: useRef(),
            animation: animationPause,
            heightPercentage: 100,
            debugColor: "red",
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

    function buildScrollyTellingMarksOverview() {
        return buildScrollyTellingMark(overviewMarks, overviewHeight);
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

    function _calculateOverviewData() {
        const ownerFacebookTest = /.*[F,f]acebook.*/g;
        const installs = [
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(products).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].totalInstalls / 1000000) * 100
                            ) / 100,
                    }),
                    {}
                ),
            },
        ];

        const activeUsers = [
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(products).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].currentActiveUsers / 1000000) *
                                    100
                            ) / 100,
                    }),
                    {}
                ),
            },
        ];

        const [facebookProducts, noFacebookProducts] = Object.keys(
            products
        ).reduce(
            (acc, key) => {
                let [accFacebook, accNoFacebook] = acc;
                if (
                    products[key].productOwner.find((owner) =>
                        ownerFacebookTest.test(owner)
                    )
                ) {
                    accFacebook[key] = _.cloneDeep(products[key]);
                } else {
                    accNoFacebook[key] = _.cloneDeep(products[key]);
                }

                return [accFacebook, accNoFacebook];
            },
            [{}, {}]
        );

        const partOf = [
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(noFacebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].currentActiveUsers / 1000000) *
                                    100
                            ) / 100,
                    }),
                    {}
                ),
            },
            {
                groupName: DONUT_CHART.FACEBOOK_GROUP,
                color: DONUT_CHART.FACEBOOK_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(facebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].currentActiveUsers / 1000000) *
                                    100
                            ) / 100,
                    }),
                    {}
                ),
            },
        ];

        return { installs, activeUsers, partOf };
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
                    {buildScrollyTellingMarksOverview()}
                </div>
                <div className="messenger-parts">
                    <Introduction
                        heightEvent={updateIntroHeight}
                    ></Introduction>
                    <Summary
                        heightEvent={updateSummaryHeight}
                        animation={summaryAnimations}
                    ></Summary>
                    <Overview
                        donutData={_calculateOverviewData()}
                        heightEvent={updateOverviewHeight}
                    ></Overview>
                </div>
            </div>
        </DataStory>
    );
};

export default MessengerStory;
