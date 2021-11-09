import React, { useState, useRef, useContext } from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import Overview from "../../components/clusterStories/messengers/overview.jsx";
import { SUMMARY_ANIMATIONS } from "../../constants";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import "./messengerStory.css";

/*
 * The scrollyTellingDebug variable is used to show in the screen
 * how the scrollytelling marks are distributed. It is useful to
 * understand where the scrollytelling events are fired.
 * IT NEVER MUST BE PUSHED IN A PRODUCTION BRANCH WITH THE VALUE "TRUE"
 */
const scrollTellingDebug = false;
const animationPause = "pause";

const MessengerStory = () => {
    const { products } = useContext(ExplorerContext);
    const [summaryAnimations, fireSummaryAnimation] = useState(0);
    const [allMarks, updateAllMarks] = useState([]);

    const sections = {
        introduction: "introduction",
        summary: "summary",
        overview: "overview",
    };

    const marks = [
        {
            sectionName: sections.introduction,
            totalHeight: 0,
            marks: [
                {
                    animation: animationPause,
                    heightPercentage: 100,
                    debugColor: "red",
                },
            ],
        },
        {
            sectionName: sections.summary,
            totalHeight: 0,
            marks: [
                {
                    animation: animationPause,
                    heightPercentage: 40,
                    debugColor: "green",
                },
                {
                    animation: SUMMARY_ANIMATIONS.ANIMATE_BULLET_ONE,
                    heightPercentage: 5,
                    debugColor: "pink",
                },
                {
                    animation: animationPause,
                    heightPercentage: 15,
                    debugColor: "green",
                },
                {
                    animation: SUMMARY_ANIMATIONS.ANIMETE_BULLET_TWO,
                    heightPercentage: 5,
                    debugColor: "pink",
                },
                {
                    animation: animationPause,
                    heightPercentage: 15,
                    debugColor: "green",
                },
                {
                    animation: SUMMARY_ANIMATIONS.ANIMATE_BULLET_THREE,
                    heightPercentage: 5,
                    debugColor: "pink",
                },
                {
                    animation: animationPause,
                    heightPercentage: 15,
                    debugColor: "green",
                },
            ],
        },
        {
            sectionName: sections.overview,
            totalHeight: 0,
            marks: [
                {
                    ref: useRef(),
                    animation: animationPause,
                    heightPercentage: 100,
                    debugColor: "red",
                },
            ],
        },
    ];

    function handleSummaryAnimation(animation) {
        switch (animation) {
            case SUMMARY_ANIMATIONS.ANIMATE_BULLET_ONE:
                fireSummaryAnimation(1);
                break;
            case SUMMARY_ANIMATIONS.ANIMETE_BULLET_TWO:
                fireSummaryAnimation(2);
                break;
            case SUMMARY_ANIMATIONS.ANIMATE_BULLET_THREE:
                fireSummaryAnimation(3);
                break;
        }
    }

    function scrollStory(section, animation) {
        switch (section) {
            case sections.summary:
                handleSummaryAnimation(animation);
        }
    }

    function updateMarks() {
        if (!marks.find((section) => section.totalHeight === 0)) {
            updateAllMarks(marks);
        }
    }

    function updateHeight(height, sectionName) {
        const leng = marks.length;

        let index = 0;

        while (index < leng && marks[index].sectionName !== sectionName) {
            index++;
        }

        if (index < leng) {
            marks[index].totalHeight = height;
            updateMarks(marks);
        }
    }

    function updateIntroHeight(height) {
        updateHeight(height, sections.introduction);
    }

    function updateSummaryHeight(height) {
        updateHeight(height, sections.summary);
    }

    function updateOverviewHeight(height) {
        updateHeight(height, sections.overview);
    }

    return (
        <DataStory
            progressBarColor="black"
            className="messenger"
            marks={allMarks}
            animationEvent={scrollStory}
            debugMode={scrollTellingDebug}
        >
            <div className="messenger-parts">
                <Introduction heightEvent={updateIntroHeight}></Introduction>
                <Summary
                    heightEvent={updateSummaryHeight}
                    animation={summaryAnimations}
                ></Summary>
                <Overview
                    products={products}
                    heightEvent={updateOverviewHeight}
                ></Overview>
            </div>
        </DataStory>
    );
};

export default MessengerStory;
