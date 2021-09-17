import React, { useState } from "react";

import i18n from "../../i18n";

import BarChartHorizontal from "../dataViz/barChartHorizontal.jsx";

import { fillArray } from "../dataViz/utils.jsx";

import "./activitiesMinistory.css";
import "./datePicker.css";
import "../tabs/tabs.css";

//TODO let this support actual dates not only years
const Datepicker = ({ year, yearRange, onYearChange }) => {
    const rangeIndex = yearRange.indexOf(year);
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
    const yearRange = fillArray(
        Object.keys(totalEvents).filter((key) => key != "total")
    );

    const yearlyTotals = Object.fromEntries(
        yearRange.map((year) => [
            year.toString().substring(2, 4),
            totalEvents[year]?.total || 0,
        ])
    );

    const [selectedYear, setSelectedYear] = useState(
        yearRange[yearRange.length - 1]
    );

    const monthlyTotals = Object.fromEntries(
        new Array(12)
            .fill(undefined)
            .map((_, index) => [index, totalEvents[selectedYear]?.[index] || 0])
    );

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
                    yearRange={yearRange}
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
