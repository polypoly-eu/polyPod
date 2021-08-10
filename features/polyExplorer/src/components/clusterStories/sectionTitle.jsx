import React from "react";

import "./sectionTitle.css";

const SectionTitle = ({ title }) => {
    return (
        <div className="section-title-container">
            <div className="line"></div>
            <h3 className="section-title">{title}</h3>
            <div className="line"></div>
        </div>
    );
};

export default SectionTitle;
