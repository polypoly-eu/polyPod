import React, { useRef } from "react";
import Screen from "../screen/screen.jsx";

import "./clusterStory.css";

const defaultProgressBarColor = "#3BA6FF";

const ClusterStory = ({
    children,
    progressBarColor = defaultProgressBarColor,
    className,
    fadingTopBackground,
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
                style={
                    true
                        ? {
                              background: `linear-gradient( 180deg, ${"var(--color-primary-messenger-story)"} 0%, var(--color-secondary-messenger-story) 600px)`,
                          }
                        : null
                }
            >
                {children}
            </div>
        </Screen>
    );
};

export default ClusterStory;
