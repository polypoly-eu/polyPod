import React, { useState } from "react";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import "./companyInfo.css";

const CompanyInfo = ({ company, onShowScreenChange }) => {
    const [openTab, setOpenTab] = useState("location");
    const availableTabs = ["location", "structure", "revenue"];

    //get this from somewhere else
    const tabTranslation = {
        location: "Location",
        structure: "Structure",
        revenue: "Revenue",
    };
    const tabContent = {
        location: (
            <div className={`location-block ${company.jurisdiction}`}></div>
        ),
        structure: 0,
        revenue: 0,
    };
    const featuredTabContent = {
        location: <div className={"location-block"}></div>,
        structure: 0,
        revenue: 0,
    };

    const handleOpenTabChange = (tab) => {
        setOpenTab(tab);
    };

    return (
        <div className="explorer-container">
            <button onClick={() => onShowScreenChange("start", undefined)}>
                X
            </button>
            <CompanyShortInfo company={company} onShowScreenChange={() => {}} />
            <div className="tab-button-container">
                {availableTabs.map((tab, index) => (
                    <button
                        key={index}
                        className={
                            openTab === tab ? "tab-button active" : "tab-button"
                        }
                        onClick={() => handleOpenTabChange(tab)}
                    >
                        {tabTranslation[tab]}
                    </button>
                ))}
            </div>
            <div className="tab-content-container">
                {company.featured
                    ? featuredTabContent[openTab]
                    : tabContent[openTab]}
            </div>
        </div>
    );
};

export default CompanyInfo;
