import React from "react";

import TopSeparator from "../topSeparator/topSeparator.jsx";

import "./screen.css";

const Screen = ({ className, light = false, topShadow = true, children }) => (
    <div className={light ? "explorer-container-light" : "explorer-container"}>
        {topShadow && <TopSeparator />}
        <div className={`screen-content ${className}`}>{children}</div>
    </div>
);

export default Screen;
