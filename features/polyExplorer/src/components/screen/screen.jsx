import React from "react";

import TopShadow from "../topShadow/topShadow.jsx";

import "./screen.css";

const Screen = ({ className, light = false, topShadow = true, children }) => (
    <div className={light ? "explorer-container-light" : "explorer-container"}>
        {topShadow && <TopShadow />}
        <div className={`screen-content ${className}`}>{children}</div>
    </div>
);

export default Screen;
