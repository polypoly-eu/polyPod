import React from "react";

import "./overviewTab.css";

const overviewTab = () => {
    const tabOverview = [
        {
            tabName: "install",
            tabContent: <div>1</div>,
        },
        {
            tabName: "users",
            tabContent: <div>2</div>,
        },
        {
            tabName: "partof",
            tabContent: <div>3</div>,
        },
    ];

    const onClickTab = () => {
        console.log("click tab");
    };

    return (
        <nav className="overview-tab">
            <button
                onClick={onClickTab}
                className="overview-button active"
            >
                Installs
            </button>
            <button
                onClick={onClickTab}
                className="overview-button"
            >
                Users
            </button>
            <button
                onClick={onClickTab}
                className="overview-button"
            >
                Part of
            </button>
        </nav>
    );
};

export default overviewTab;
