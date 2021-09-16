import React, { useState } from "react";

import i18n from "../../i18n";

import BarChartHorizontal, {
    fillArray,
} from "../dataViz/barChartHorizontal.jsx";

import "./activitiesMinistory.css";
import "./datePicker.css";
import "../tabs/tabs.css";

//TODO let this support actual dates not only years
const Datepicker = ({ year, yearRange, onYearChange }) => {
    const rangeIndex = yearRange.indexOf(+year);
    return (
        <div className="datepicker">
            {rangeIndex != 0 ? (
                <button
                    className="arrow left"
                    onClick={() => onYearChange(yearRange[rangeIndex - 1])}
                >
                    X
                </button>
            ) : (
                <div className="arrow filler"></div>
            )}
            <div className="year">{year}</div>
            {rangeIndex != yearRange.length - 1 ? (
                <button
                    className="arrow right"
                    onClick={() => onYearChange(yearRange[rangeIndex + 1])}
                >
                    X
                </button>
            ) : (
                <div className="arrow filler"></div>
            )}
        </div>
    );
};

const ActivitiesMinistory = ({ totalEvents }) => {
    const yearlyTotals = Object.fromEntries(
        Object.entries(totalEvents)
            .map(([year, { total }]) =>
                total ? [year.toString().substring(2, 4), total] : null
            )
            .filter((entry) => entry)
    );
    const yearRange = Object.keys(totalEvents).filter((e) => e != "total");

    const [selectedYear, setSelectedYear] = useState(yearRange.at(-1));

    const monthlyTotals = {
        ...{ 0: 0, 11: 0 },
        ...Object.fromEntries(
            Object.entries(totalEvents[selectedYear] || {}).filter(
                ([month, _]) => month != "total"
            )
        ),
    };

    const tabs = [
        {
            id: "total",
            translation: i18n.t("explore:tab.total"),
        },
        {
            id: "yearly",
            translation: i18n.t("explore:tab.year"),
        },
    ];

    const tabContentData = {
        total: yearlyTotals,
        yearly: monthlyTotals,
    };

    const [activeTab, setActiveTab] = useState(tabs[0]);

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
            {activeTab.id == "yearly" ? (
                <Datepicker
                    year={selectedYear}
                    yearRange={fillArray(yearRange)}
                    onYearChange={setSelectedYear}
                />
            ) : (
                <div className="datepicker-filler" />
            )}
            <BarChartHorizontal
                data={tabContentData[activeTab.id]}
                barSize="big"
            />
        </div>
    );
};

export default ActivitiesMinistory;
