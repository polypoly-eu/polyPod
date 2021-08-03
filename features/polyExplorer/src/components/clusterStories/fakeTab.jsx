import React, { useState } from "react";

import "./fakeTab.css";

const FakeTab = ({ children, tabTranslations, onClickedTab }) => {
    const [clickedTab, setClickedTab] = useState(children[0].props.tabId);

    const onClickTab = (ev, newClickedTab) => {
        ev.preventDefault();
        setClickedTab(newClickedTab);
        onClickedTab(newClickedTab);
    };

    return (
        <div>
            <div className="faketab">
                {children.map((tab, index) => (
                    <button
                        key={index}
                        onClick={(ev) => onClickTab(ev, tab.props.tabId)}
                        className={
                            tab.props.tabId === clickedTab
                                ? "faketab-button active"
                                : "faketab-button"
                        }
                    >
                        {tabTranslations[tab.props.label]}
                    </button>
                ))}
            </div>
            <div>
                {children.map((tabContent, index) => {
                    if (tabContent.props.tabId === clickedTab)
                        return (
                            <div key={index} className="faketab-content">
                                {tabContent.props.children}
                            </div>
                        );
                })}
            </div>
        </div>
    );
};

export default FakeTab;
