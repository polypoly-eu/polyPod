import React from "react";

import "./screen.css";

const Screen = ({ className, light = false, topShadow = true, children }) => (
    <div className={light ? "explorer-container-light" : "explorer-container"}>
        {topShadow && <div className="poly-nav-bar-separator-overlay" />}
        <div className={`screen-content ${className}`}>{children}</div>
    </div>
);

export default Screen;
