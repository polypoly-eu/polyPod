import React from "react";

import "./screen.css";

const Screen = ({ className, theme, topShadow = true, children }) => {
    return (
        <div
            className={`${theme || ""} explorer-container`}
            style={{
                position: className.includes("-info") ? "static" : "absolute",
            }}
        >
            {topShadow && <div className="poly-nav-bar-separator-overlay" />}
            <div className={`screen-content ${className}`}>{children}</div>
        </div>
    );
};

export default Screen;
