import React, { useState } from "react";

import "./tabs.css";

const Tabs = ({ tabs, initialActiveTabId }) => {
    const [activeTab, setActiveTab] = useState(
        tabs.find(({ id }) => id == initialActiveTabId)
    );
    return (
        <div className="tab-container">
            <div className="tab-button-container">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={
                            tab.id === activeTab.id
                                ? "tab-button active"
                                : "tab-button"
                        }
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.translation}
                    </button>
                ))}
            </div>
            <div className="tab-content">{activeTab.content}</div>
        </div>
    );
};

export default Tabs;
