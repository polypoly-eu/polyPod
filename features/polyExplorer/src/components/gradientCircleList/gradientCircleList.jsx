import React from "react";

import "./gradientCircleList.css";

const GradientCircleList = ({
    introText,
    list,
    color,
    rotation = "180deg",
}) => {
    const style = {
        background: `linear-gradient(${rotation}, ${color} 0%, var(--transparent-light) 85%)`,
    };

    return (
        <div className="gradient-circle-list">
            <p>{introText}</p>
            <ul>
                {list.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
            <div className="gradient-circle" style={style}></div>
            <div className="ratio"></div>
        </div>
    );
};

export default GradientCircleList;
