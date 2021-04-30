import React from "react";

import "./scrollingFadeOut.css";

const ScrollingFadeOut = ({ children }) => {
    return (
        <div className="scrolling-area">
            {children}
            <div className="gradient-area">
                <div className="gradient"></div>
            </div>
        </div>
    );
};

export default ScrollingFadeOut;
