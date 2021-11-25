import React, { useState } from "react";

import i18n from "../../i18n";

import InfoButton from "../buttons/infoButton/infoButton.jsx";

import { fillArray } from "../dataViz/utils.jsx";

import "./activitiesMiniStory.css";
import "./datePicker.css";
import "../tabs/tabs.css";
import { PolyChart } from "@polypoly-eu/poly-look";

const monthsAbbreviation = i18n.t("common:months.abbreviation").split(" ");

//TODO let this support actual dates not only years
const DatePicker = ({ year, yearRange, onYearChange }) => {
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

export const ActivitiesMiniStorySummary = ({ totalEvents }) => {
    return (
        <div className="render-summary">
            <p className="highlighted-number">
                {totalEvents.total.toLocaleString("de-DE")}
            </p>
            {i18n.t("activitiesMiniStory:summary", {
                number_activities: totalEvents.total,
            })}
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </div>
    );
};

export const ActivitiesMiniStoryDetails = ({ totalEvents }) => {
    const yearRange = fillArray(Object.keys(totalEvents.values));

    const yearlyTotals = yearRange.map((year) => {
        return {
            title: year.toString().substring(2, 4),
            value: totalEvents.values[year]?.total || 0,
        };
    });

    const [selectedYear, setSelectedYear] = useState(
        yearRange[yearRange.length - 1]
    );

    const monthlyTotals = monthsAbbreviation.map((month, index) => {
        return {
            title: month,
            value: totalEvents.values[selectedYear]?.values[index] || 0,
        };
    });

    const tabs = [
        {
            id: "total",
            translation: i18n.t("activitiesMiniStory:tab.total"),
        },
        {
            id: "yearly",
            translation: i18n.t("activitiesMiniStory:tab.year"),
        },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const constantTabData = {
        total: {
            barData: yearlyTotals,
            barWidth: 6,
            barChartLegendText: i18n.t("activitiesMiniStory:tab.events.total", {
                number_events: totalEvents.total,
            }),
            barValueColor: null,
        },
        yearly: {
            barData: monthlyTotals,
            barWidth: 22,
            barChartLegendText: i18n.t(
                "activitiesMiniStory:tab.events.yearly",
                {
                    number_events: totalEvents.values[selectedYear]?.total || 0,
                }
            ),
            barValueColor: "white",
        },
    }[activeTab.id];

    //Adapt to order of magnitude
    const orderOfMagnitude = (() => {
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
        `activitiesMiniStory:number.events${
            orderOfMagnitude > 1 ? ".thousands" : ""
        }`
    );

    return (
        <div className="activities-ministory">
            <p>
                {i18n.t("activitiesMiniStory:summary", {
                    number_activities: totalEvents.total,
                })}
            </p>
            <div className="tab-container">
                <div className="tab-button-container">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={
                                tab.id === activeTab.id
                                    ? "tab-button active"
                                    : "tab-button"
                            }
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.translation}
                            {tab.id === activeTab.id ? (
                                <div className="border"></div>
                            ) : null}
                        </div>
                    ))}
                </div>
                {activeTab.id == "yearly" ? (
                    <DatePicker
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
                            width: constantTabData.barWidth + "px",
                        }}
                    ></div>
                    <p>{constantTabData.barChartLegendText}</p>
                </div>
                <p className="above-chart">{numberOfEventsString}</p>
                <PolyChart
                    type="vertical-bar-chart"
                    data={constantTabData.barData}
                    barColor={"white"}
                    barWidth={constantTabData.barWidth}
                    barValueColor={constantTabData.barValueColor}
                />
                <p className="below-chart">
                    {activeTab.id == "total"
                        ? "Years since you joined Facebook"
                        : selectedYear}
                </p>
            </div>
            <InfoButton route="/report/details/activities-info" />
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </div>
    );
};
