import React, { useState } from "react";

import "./tab.css";

const Tab = ({ children, onClickedTab }) => {
    const [clickedTab, setClickedTab] = useState(children[0].props.tabId);

    const onClickTab = (ev, newClickedTab) => {
        ev.preventDefault();
        setClickedTab(newClickedTab);
        onClickedTab(newClickedTab);
    };

    return (
        <>
            <div className="tab">
                {children.map((tab, index) => (
                    <button
                        key={index}
                        onClick={(ev) => onClickTab(ev, tab.props.tabId)}
                        className={
                            tab.props.tabId === clickedTab
                                ? "tab-button active"
                                : "tab-button"
                        }
                    >
                        {tab.props.label}
                    </button>
                ))}
            </div>
            <div>
                {children.map((tabContent, index) => {
                    if (tabContent.props.tabId === clickedTab)
                        return (
                            <div key={index} className="tab-content">
                                {tabContent.props.children}
                            </div>
                        );
                })}
            </div>
        </>
    );
};

export default Tab;
