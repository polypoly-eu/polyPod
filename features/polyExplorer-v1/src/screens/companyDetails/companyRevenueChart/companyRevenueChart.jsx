import React from "react";
import i18n from "../../../i18n.js";
import "./companyRevenueChart.css";

const CompanyRevenueChart = ({ annualRevenues }) => {
    const years = [2015, 2016, 2017, 2018, 2019];

    //from 2015
    const recentAnnualRevenues = annualRevenues?.filter(
        (e) => e.year >= years[0] && e.year <= years[years.length - 1]
    );

    const getHighestAmount = () => {
        let highest = 0;
        recentAnnualRevenues?.forEach((e) =>
            e.amount > highest ? (highest = e.amount) : null
        );
        return highest;
    };

    const getYearlyAmount = (year, unitNumber) => {
        let amount;
        annualRevenues?.forEach((e) => {
            e.year == year ? (amount = e.amount / unitNumber) : null;
        });
        return amount ? amount : null;
    };

    const getUnit = (value) => {
        const b = Math.pow(10, 9);
        const m = Math.pow(10, 6);
        if (value >= b) {
            return ["B", b];
        } else if (value >= m) {
            return ["M", m];
        } else {
            return ["K", 1000];
        }
    };

    //Scaleref is the next higher multiple of 4 (scale has 4 steps excl. 0)
    const getScaleVars = (value) => {
        const [unit, unitNumber] = getUnit(value);
        let refValue = Math.round(value / unitNumber);
        let scaleRef = refValue;
        for (let i = refValue; refValue > 0; i++) {
            if (i < 20 && i % 4 == 0) {
                scaleRef = i;
                break;
            }
            if (i >= 20 && i % 4 == 0 && i % 5 == 0) {
                scaleRef = i;
                break;
            }
        }
        return [scaleRef, unit, unitNumber];
    };

    //Gives bar height in %
    const getHeight = (amount, scaleRef) => {
        return amount == null ? 0 : ((0.73 * amount) / scaleRef) * 100;
    };

    const highestValue = getHighestAmount();
    const [scaleRef, unit, unitNumber] = getScaleVars(highestValue);
    let scale = [0, scaleRef * 0.25, scaleRef * 0.5, scaleRef * 0.75, scaleRef];
    const amounts = [];
    years.forEach((year) => {
        amounts.push(getYearlyAmount(year, unitNumber));
    });
    if (
        amounts.filter((e) => e != null).length == 0 ||
        annualRevenues == null
    ) {
        //A generic empty graph
        const defaultScale = [0, 20, 40, 60, 80];
        const defaultUnit = "M";

        return (
            <div className="revenue-chart-container">
                <div className="revenue-chart">
                    <div className="gridline" style={{ bottom: "95%" }}></div>
                    <div className="gridline" style={{ bottom: "85%" }}></div>
                    <div className="gridline" style={{ bottom: "75%" }}></div>
                    <div className="gridline" style={{ bottom: "65%" }}></div>
                    <div className="gridline" style={{ bottom: "55%" }}></div>
                    <div className="gridline" style={{ bottom: "45%" }}></div>
                    <div className="gridline" style={{ bottom: "35%" }}></div>
                    <div className="gridline" style={{ bottom: "25%" }}></div>
                    <div className="gridline" style={{ bottom: "15%" }}></div>
                    <div className="x-axis" style={{ left: "20%" }}>
                        {years[0]}
                    </div>
                    <div className="x-axis" style={{ left: "35%" }}>
                        {years[1]}
                    </div>
                    <div className="x-axis" style={{ left: "50%" }}>
                        {years[2]}
                    </div>
                    <div className="x-axis" style={{ left: "65%" }}>
                        {years[3]}
                    </div>
                    <div className="x-axis" style={{ left: "80%" }}>
                        {years[4]}
                    </div>
                    <div className="y-axis" style={{ bottom: "95%" }}>
                        {defaultScale[4]}
                    </div>
                    <div className="y-axis" style={{ bottom: "75%" }}>
                        {defaultScale[3]}
                    </div>
                    <div className="y-axis" style={{ bottom: "55%" }}>
                        {defaultScale[2]}
                    </div>
                    <div className="y-axis" style={{ bottom: "35%" }}>
                        {defaultScale[1]}
                    </div>
                    <div className="y-axis" style={{ bottom: "15%" }}>
                        {defaultScale[0]}
                    </div>
                    <div className="unit">
                        {i18n.t(`companyDetailsScreen:${defaultUnit}`)} (EUR)
                    </div>
                </div>
                <div className="no-data-text">
                    {i18n.t("companyDetailsScreen:tab.revenue.fallbackText")}
                </div>
            </div>
        );
    } else {
        return (
            <div className="revenue-chart-container">
                <div className="revenue-chart">
                    <div className="gridline" style={{ bottom: "95%" }}></div>
                    <div className="gridline" style={{ bottom: "85%" }}></div>
                    <div className="gridline" style={{ bottom: "75%" }}></div>
                    <div className="gridline" style={{ bottom: "65%" }}></div>
                    <div className="gridline" style={{ bottom: "55%" }}></div>
                    <div className="gridline" style={{ bottom: "45%" }}></div>
                    <div className="gridline" style={{ bottom: "35%" }}></div>
                    <div className="gridline" style={{ bottom: "25%" }}></div>
                    <div className="gridline" style={{ bottom: "15%" }}></div>
                    <div className="x-axis" style={{ left: "20%" }}>
                        {years[0]}
                    </div>
                    <div className="x-axis" style={{ left: "35%" }}>
                        {years[1]}
                    </div>
                    <div className="x-axis" style={{ left: "50%" }}>
                        {years[2]}
                    </div>
                    <div className="x-axis" style={{ left: "65%" }}>
                        {years[3]}
                    </div>
                    <div className="x-axis" style={{ left: "80%" }}>
                        {years[4]}
                    </div>
                    <div className="y-axis" style={{ bottom: "95%" }}>
                        {scale[4]}
                    </div>
                    <div className="y-axis" style={{ bottom: "75%" }}>
                        {scale[3]}
                    </div>
                    <div className="y-axis" style={{ bottom: "55%" }}>
                        {scale[2]}
                    </div>
                    <div className="y-axis" style={{ bottom: "35%" }}>
                        {scale[1]}
                    </div>
                    <div className="y-axis" style={{ bottom: "15%" }}>
                        {scale[0]}
                    </div>
                    <div className="unit">
                        {i18n.t(`companyDetailsScreen:${unit}`)} (EUR)
                    </div>
                </div>
                <p className="source">
                    {i18n.t("companyDetailsScreen:source")}: polyPedia
                </p>
                <div
                    className="bar"
                    style={{
                        left: "15%",
                        height: getHeight(amounts[0], scaleRef) + "%",
                    }}
                >
                    {amounts[0] ? (
                        getHeight(amounts[0], scaleRef) > 15 ? (
                            <p className="in-bar-number">
                                {amounts[0].toFixed(0)}
                            </p>
                        ) : (
                            <p className="over-bar-number">
                                {amounts[0].toFixed(0)}
                            </p>
                        )
                    ) : (
                        <p className="no-data-for-column-tag">
                            {i18n.t("companyDetailsScreen:no-data")}
                        </p>
                    )}
                </div>
                <div
                    className="bar"
                    style={{
                        left: "30%",
                        height: getHeight(amounts[1], scaleRef) + "%",
                    }}
                >
                    {amounts[1] ? (
                        getHeight(amounts[1], scaleRef) > 15 ? (
                            <p className="in-bar-number">
                                {amounts[1].toFixed(0)}
                            </p>
                        ) : (
                            <p className="over-bar-number">
                                {amounts[1].toFixed(0)}
                            </p>
                        )
                    ) : (
                        <p className="no-data-for-column-tag">
                            {i18n.t("companyDetailsScreen:no-data")}
                        </p>
                    )}
                </div>
                <div
                    className="bar"
                    style={{
                        left: "45%",
                        height: getHeight(amounts[2], scaleRef) + "%",
                    }}
                >
                    {amounts[2] ? (
                        getHeight(amounts[2], scaleRef) > 15 ? (
                            <p className="in-bar-number">
                                {amounts[2].toFixed(0)}
                            </p>
                        ) : (
                            <p className="over-bar-number">
                                {amounts[2].toFixed(0)}
                            </p>
                        )
                    ) : (
                        <p className="no-data-for-column-tag">
                            {i18n.t("companyDetailsScreen:no-data")}
                        </p>
                    )}
                </div>
                <div
                    className="bar"
                    style={{
                        left: "60%",
                        height: getHeight(amounts[3], scaleRef) + "%",
                    }}
                >
                    {amounts[3] ? (
                        getHeight(amounts[3], scaleRef) > 15 ? (
                            <p className="in-bar-number">
                                {amounts[3].toFixed(0)}
                            </p>
                        ) : (
                            <p className="over-bar-number">
                                {amounts[3].toFixed(0)}
                            </p>
                        )
                    ) : (
                        <p className="no-data-for-column-tag">
                            {i18n.t("companyDetailsScreen:no-data")}
                        </p>
                    )}
                </div>
                <div
                    className="bar"
                    style={{
                        left: "75%",
                        height: getHeight(amounts[4], scaleRef) + "%",
                    }}
                >
                    {amounts[4] ? (
                        getHeight(amounts[4], scaleRef) > 15 ? (
                            <p className="in-bar-number">
                                {amounts[4].toFixed(0)}
                            </p>
                        ) : (
                            <p className="over-bar-number">
                                {amounts[4].toFixed(0)}
                            </p>
                        )
                    ) : (
                        <p className="no-data-for-column-tag">
                            {i18n.t("companyDetailsScreen:no-data")}
                        </p>
                    )}
                </div>
            </div>
        );
    }
};

export default CompanyRevenueChart;
