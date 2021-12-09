import React, { useRef } from "react";
import Screen from "../screen/screen.jsx";

import "./dataStory.css";

const defaultProgressBarColor = "#3BA6FF";

const DataStory = ({
    children,
    progressBarColor = defaultProgressBarColor,
    className,
}) => {
    const scrollRef = useRef();
    const progressRef = useRef();

    const handleScrollUp = () => {
        scrollRef.current.scrollTo(0, 0);
    };

    const handleProgress = () => {
        progressRef.current.style.width = `${
            (scrollRef.current.scrollTop /
                (scrollRef.current.scrollHeight -
                    scrollRef.current.offsetHeight)) *
            100
        }%`;
    };

    return (
        <Screen className={`story ${className}`} light={true}>
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
                <div className="story-sections">{children}</div>
            </div>
        </Screen>
    );
};

export default DataStory;
