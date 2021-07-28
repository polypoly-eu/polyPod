import React from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import "./messengerStory.css";

/*
 * The scrollyTellingDebug variable is used to show in the screen
 * how the scrollytelling marks are distributed. It is useful to
 * understand where the scrollytelling events are fired.
 * IT NEVER MUST BE PUSHED IN A PRODUCTION BRANCH WITH THE VALUE "TRUE"
 */
const scrollTellingDebug = false;
const animationPause = "pause";
const animations = []

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
    const marks = [];

    function scrollStory() {
        const introAnimations = Object.values(animations);
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

    return (
        <DataStory
            progressBarColor="black"
            className="messenger"
            scrollEvent={scrollStory}
        >
            <div className="messenger-story">
                <div className="messenger-parts">
                </div>
                <div className="messenger-parts">
                    <Introduction></Introduction>
                    <Summary></Summary>
                </div>
            </div>
        </DataStory>
    );
};

export default MessengerStory;
