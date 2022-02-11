import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

/*
    This component is used for saving a scrolling progression in a screen when a child of it is clicked.
    The problem this solves is that the child's onclick has priority to the parent's one. So when the child's
    onClick moves forward in the history the scrolling progress needs to be saved in the previous history entry.
 */
const ScrollingProgressTracker = ({ children, scrollingRef }) => {
    const history = useHistory();

    const handleExitStory = () => {
        history.entries[
            history.entries.length - 2
        ].state.storyScrollingProgress = scrollingRef.scrollTop;
    };

    useEffect(() => {
        scrollingRef?.scrollTo(
            0,
            history.location.state.storyScrollingProgress || 0
        );
    });

    return (
        <div className="scrolling-progress-tracker" onClick={handleExitStory}>
            {children}
        </div>
    );
};

export default ScrollingProgressTracker;
