import React, { useState } from "react";

import i18n from "../../i18n";

import BarChartHorizontal from "../dataViz/barChartHorizontal.jsx";

import { fillArray } from "../dataViz/utils.jsx";

import "./activitiesMinistory.css";
import "./datePicker.css";
import "../tabs/tabs.css";

const monthsAbbreviation = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

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
                    <img src="./images/angle-left.svg" alt="arrow-left" />
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
                    <img src="./images/angle-right.svg" alt="arrow-right" />
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
            .map((_, index) => [
                monthsAbbreviation[index],
                totalEvents[selectedYear]?.[index] || 0,
            ])
    );

    const tabs = [
        {
            id: "total",
            translation: i18n.t("activitiesMinistory:tab.total"),
        },
        {
            id: "yearly",
            translation: i18n.t("activitiesMinistory:tab.year"),
        },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const constantTabData = {
        total: {
            barData: yearlyTotals,
            barWidth: "10px",
            barChartLegendText: i18n.t("activitiesMinistory:tab.events.total", {
                number_events: totalEvents.total,
            }),
        },
        yearly: {
            barData: monthlyTotals,
            barWidth: "22px",
            barChartLegendText: i18n.t(
                "activitiesMinistory:tab.events.yearly",
                {
                    number_events: totalEvents[selectedYear]?.total || 0,
                }
            ),
        },
    }[activeTab.id];

    //Adapt to oder of magnitude
    const orderOfMagintude = (() => {
        const highest = Math.max(...Object.values(constantTabData.barData));
        if (highest >= 1000) {
            constantTabData.barData = Object.fromEntries(
                Object.entries(constantTabData.barData).map(([key, value]) => [
                    key,
                    value / 1000,
                ])
            );
            return 1000;
        }
        return 1;
    })();

    const numberOfEventsString = i18n.t(
        `activitiesMinistory:number.events${
            orderOfMagintude > 1 ? ".thousands" : ""
        }`
    );

    return (
        <div className="activities-ministory">
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
                <div className="legend">
                    <div
                        className="bar-piece"
                        style={{
                            width: constantTabData.barWidth,
                        }}
                    ></div>
                    <p>{constantTabData.barChartLegendText}</p>
                </div>
                <p className="above-chart">{numberOfEventsString}</p>
                <BarChartHorizontal
                    data={constantTabData.barData}
                    barWidth={constantTabData.barWidth}
                />
            </div>
        </div>
    );
};

export default ActivitiesMinistory;
