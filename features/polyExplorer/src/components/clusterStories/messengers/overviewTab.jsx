import React from "react";

import "./overviewTab.css";

const overviewTab = () => {
    // const handleOverviewTab = (idTab) => {
    //     const idTab = idTab.useRef();
    //     console.log("click " + idTab + " tab");
    // };

    return (
        <nav className="overview-tab">
            <button
                // onTabClick={handleOverviewTab()}
                className="overview-button"
                id="installs"
                // ref={idTab}
            >
                Installs
            </button>
            <button
                // onTabClick={handleOverviewTab()}
                className="overview-button"
                id="users"
                // ref={idTab}
            >
                Users
            </button>
            <button
                // onTabClick={handleOverviewTab()}
                className="overview-button"
                id="partof"
                // ref={idTab}
            >
                Part of
            </button>
        </nav>
    );
};

export default overviewTab;
