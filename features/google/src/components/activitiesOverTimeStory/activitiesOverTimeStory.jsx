import React, { useState } from "react";

import i18n from "!silly-i18n";

import "./activitiesOverTimeStory.css";
import "./datePicker.css";
import { PolyChart, Tab, Tabs } from "@polypoly-eu/poly-look";

const monthsAbbreviation = i18n.t("common:months.abbreviation").split(" ");

const fillMissingArrayValues = (arr) => {
    let filled = [];
    for (let i = Math.min(...arr); i <= Math.max(...arr); i++) filled.push(i);
    return filled;
};

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
                    <img
                        src="./images/angle-left.svg"
                        alt="arrow-left"
                        className="space-right"
                    />
                    <p>{i18n.t("activitiesOverTime:tab.arrow.left")}</p>
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
                    <p>{i18n.t("activitiesOverTime:tab.arrow.right")}</p>
                    <img
                        src="./images/angle-right.svg"
                        alt="arrow-right"
                        className="space-left"
                    />
                </button>
            ) : (
                <div className="arrow filler"></div>
            )}
        </div>
    );
};

export const ActivitiesOverTimeStorySummary = ({ activitiesOverTime }) => {
    return (
        <div className="render-summary">
            <p className="highlighted-number">
                {activitiesOverTime.total.toLocaleString("de-DE")}
            </p>
            {i18n.t("activitiesOverTime:summary", {
                number_activities: activitiesOverTime.total,
            })}
            <p className="poly-small-print">
                {i18n.t("common:source.your.google.data")}
            </p>
        </div>
    );
};

export const ActivitiesOverTimeStoryDetails = ({ activitiesOverTime }) => {
    const yearRange = fillMissingArrayValues(
        Object.keys(activitiesOverTime.values)
    );

    const yearlyTotals = yearRange.map((year) => {
        return {
            title: year.toString().substring(2, 4),
            value: activitiesOverTime.values[year]?.total || 0,
        };
    });

    const [selectedYear, setSelectedYear] = useState(
        yearRange[yearRange.length - 1]
    );

    const monthlyTotals = monthsAbbreviation.map((month, index) => {
        return {
            title: month,
            value: activitiesOverTime.values[selectedYear]?.values[index] || 0,
        };
    });

    const tabData = [
        {
            id: "total",
            translation: i18n.t("activitiesOverTime:tab.total"),
            barData: yearlyTotals,
            barWidth: 6,
            barChartLegendText: i18n.t("activitiesOverTime:tab.events.total", {
                number_events: activitiesOverTime.total,
            }),
            barValueColor: null,
            datePicker: <div className="datepicker-filler" />,
            belowChart: i18n.t("common:total.years"),
        },
        {
            id: "yearly",
            translation: i18n.t("activitiesOverTime:tab.year"),
            barData: monthlyTotals,
            barWidth: 22,
            barChartLegendText: i18n.t("activitiesOverTime:tab.events.yearly", {
                number_events:
                    activitiesOverTime.values[selectedYear]?.total || 0,
            }),
            barValueColor: "white",
            datePicker: (
                <DatePicker
                    year={selectedYear}
                    yearRange={yearRange}
                    onYearChange={setSelectedYear}
                />
            ),
            belowChart: selectedYear,
        },
    ];

    //Adapt to order of magnitude
    const orderOfMagnitude = (data) => {
        const highest = Math.max(...Object.values(data));
        if (highest >= 1000) {
            tabData.barData = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, value / 1000])
            );
            return 1000;
        }
        return 1;
    };

    const numberOfEventsString = (data) =>
        i18n.t(
            `activitiesOverTime:number.events${
                orderOfMagnitude(data) > 1 ? ".thousands" : ""
            }`
        );

    return (
        <div className="activities-ministory">
            <p>
                {i18n.t("activitiesOverTime:summary", {
                    number_activities: activitiesOverTime.total,
                })}
            </p>
            <Tabs key={0}>
                {tabData.map((tab, index) => (
                    <Tab id={index} key={index} label={tab.translation}>
                        {tab.datePicker}
                        <div className="legend">
                            <div
                                className="bar-piece"
                                style={{
                                    width: tab.barWidth + "px",
                                }}
                            ></div>
                            <p>{tab.barChartLegendText}</p>
                        </div>
                        <p className="above-chart">
                            {numberOfEventsString(tab.barData)}
                        </p>
                        <PolyChart
                            type="vertical-bar-chart"
                            data={tab.barData}
                            barColor={"white"}
                            barWidth={tab.barWidth}
                            barValueColor={tab.barValueColor}
                        />
                        <p className="below-chart">{tab.belowChart}</p>
                    </Tab>
                ))}
            </Tabs>
            <p className="source">{i18n.t("common:source.your.google.data")}</p>
        </div>
    );
};
