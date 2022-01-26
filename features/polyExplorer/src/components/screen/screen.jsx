import React from "react";

import "./screen.css";

const Screen = ({ className, theme, topShadow = true, children }) => (
    <div className={`${theme || ""} explorer-container`}>
        {topShadow && <div className="poly-nav-bar-separator-overlay" />}
        <div className={`screen-content ${className}`}>{children}</div>
    </div>
);

export default Screen;
