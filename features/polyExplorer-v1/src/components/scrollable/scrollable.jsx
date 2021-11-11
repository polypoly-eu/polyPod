import React from "react";

import "./scrollable.css";

const Scrollable = ({ children }) => {
    return (
        <div className="scrolling-area">
            {children}
            <div className="gradient-area">
                <div className="gradient"></div>
            </div>
        </div>
    );
};

export default Scrollable;
