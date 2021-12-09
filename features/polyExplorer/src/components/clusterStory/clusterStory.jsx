import React, { useRef } from "react";
import Screen from "../screen/screen.jsx";

import "./clusterStory.css";

const defaultProgressBarColor = "#3BA6FF";

/* This component is used as a base for the different Cluster Stories screens. In order to style the screen,
    some classes with CSS properties already implemented have been created. You just need to add those classNames 
    to the HTML tags in the "children" component.
    These are the mentioned classNames and how to implement them:
      - "cluster-story-main-title" to the first <h1> tag.
      - "cluster-story-title" to the rest of headers. You will also need to add the "color" attribute
        to its related CSS file. For example, in messengerStory.css:
                .messenger-story .cluster-story-title {
                    color: var(--color-primary-messenger-story);
                }
      - "cluster-story-img" to the image in the introduction part. 
      - "big-first-letter" to all the paragraphs with a first big letter in it.
    
    You can check the CSS properties for these classes in clusterStory.css.
 */

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
                    fadingTopBackground
                        ? {
                              background: `linear-gradient( 180deg, ${fadingTopBackground.color} 0%, transparent ${fadingTopBackground.distance})`,
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
