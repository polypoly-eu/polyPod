import React, { useState } from "react";
import i18n from "../../../i18n.js";

import "./overviewTab.css";

const overviewTab = ({ children }) => {
    const [clickedTab, setClickedTab] = useState(children[0].props.label);

    const overviewTabTranslations = {
        installs: i18n.t("clusterStoriesMessengers:overview.tab.installs"),
        users: i18n.t("clusterStoriesMessengers:overview.tab.users"),
        partof: i18n.t("clusterStoriesMessengers:overview.tab.partof")
    };

    const onClickTab = (ev, newClickedTab) => {
        ev.preventDefault();
        setClickedTab(newClickedTab);
    };

    return (
        <div>
            <div className="overview-tab">
                {children.map((tab, index) => (
                    <button
                        key={index}
                        onClick={(ev) => onClickTab(ev, tab.props.label)}
                        className={
                            tab.props.label === clickedTab
                                ? "overview-button active"
                                : "overview-button"
                        }
                    >
                        {overviewTabTranslations[tab.props.label]}
                    </button>
                ))}
            </div>
            <div>
                {children.map((tabContent, index) => {
                    if (tabContent.props.label === clickedTab)
                        return (
                            <div key={index} className="overview-content">
                                {tabContent.props.children}
                            </div>
                        );
                })}
            </div>
        </div>
    );
};

export default overviewTab;
