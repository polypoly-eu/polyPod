import React, { useRef, useEffect, useState } from "react";
import Screen from "../../screen/screen.jsx";

import "./baseClusterStory.css";

const defaultProgressBarColor = "#3BA6FF";

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

const ClusterStory = ({
    children,
    progressBarColor = defaultProgressBarColor,
    className,
    marks,
    animationEvent,
    debugMode,
}) => {
    const scrollRef = useRef();
    const progressRef = useRef();
    const marksContainer = useRef();
    const [listOfMarks, updateListOfMarks] = useState([]);

    const processMarks = () => {
        const marksProcessed = marks.reduce((acc, section) => {
            const sectionsMarks = section.marks.map((mark) => {
                const markHeight = Math.ceil(
                    section.totalHeight * (mark.heightPercentage / 100)
                );

                return {
                    ...mark,
                    markHeight,
                    sectionName: section.sectionName,
                    animationList: section.animationList,
                };
            });

            return acc.concat(sectionsMarks);
        }, []);
        updateListOfMarks(marksProcessed);
    };

    const buildMarks = () => {
        return listOfMarks.map((mark, index) => {
            const markStyle = {
                width: "1px",
                height: `${mark.markHeight}px`,
                backgroundColor: debugMode ? mark.debugColor : "transparent",
            };

            return (
                <div
                    key={index}
                    style={markStyle}
                    className="scrollytelling-mark"
                    section={mark.sectionName}
                    animation={mark.animation}
                ></div>
            );
        });
    };

    const handleScrollUp = () => {
        scrollRef.current.scrollTo(0, 0);
    };

    const checkScrollytellingMarks = () => {
        const listMarks = marksContainer.current.querySelectorAll(
            ".scrollytelling-mark"
        );

        for (const markElement of listMarks) {
            const isOnScreen = isInViewport(markElement);

            if (isOnScreen) {
                animationEvent(
                    markElement.getAttribute("section"),
                    markElement.getAttribute("animation")
                );
            }
        }
    };

    const handleProgress = () => {
        checkScrollytellingMarks();
        progressRef.current.style.width = `${
            (scrollRef.current.scrollTop /
                (scrollRef.current.scrollHeight -
                    scrollRef.current.offsetHeight)) *
            100
        }%`;
    };

    useEffect(() => {
        processMarks();
    }, [marks]);

    return (
        <Screen className={`cluster-story ${className}`} light={true}>
            <div
                className="progress-bar"
                style={{ backgroundColor: progressBarColor }}
                ref={progressRef}
            ></div>
            <div className="scroll-up-btn" onClick={handleScrollUp}></div>
            <div
                className="content"
                ref={scrollRef}
                onScroll={() => handleProgress()}
            >
                <div className="scrollytelling-marks" ref={marksContainer}>
                    {buildMarks()}
                </div>
                {children}
            </div>
        </Screen>
    );
};

export default ClusterStory;
