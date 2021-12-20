import React, { useState } from "react";
import Tab from "./tab.jsx";

import "./tabs.css";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const onTabClick = (ev, newActiveTabId) => {
    ev.preventDefault();
    setActiveTab(newActiveTabId);
  };

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {children.map((tab, index) => (
          <button
            key={index}
            onClick={(ev) => onTabClick(ev, tab.props.label)}
            className={
              tab.props.label === activeTab ? "tab-button active" : "tab-button"
            }
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children.find((tab) => tab.props.label == activeTab).props.children}
      </div>
    </div>
  );
};

export { Tabs, Tab };
