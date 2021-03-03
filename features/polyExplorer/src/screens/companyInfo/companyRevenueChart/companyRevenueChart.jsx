import React from "react";
import i18n from "../../../i18n.js";
import "./companyRevenueChart.css";

const CompanyRevenueChart = ({ annualRevenues }) => {
    const years = [2015, 2016, 2017, 2018, 2019];

    const numSteps = 4;
    console.log(annualRevenues);

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

    const getScaleVars = (value) => {
        const [unit, unitNumber] = getUnit(value);
        let scaleRef = Math.ceil(value / unitNumber / numSteps) * numSteps;
        if (scaleRef - value / unitNumber < 1) scaleRef += 4;
        return [scaleRef, unit, unitNumber];
    };

    const getHeight = (amount, scaleRef) => {
        //max percentage(max is 64%) * amount / scaleRef * 100
        return amount == null ? 0 : ((0.64 * amount) / scaleRef) * 100;
    };

    const highestValue = getHighestAmount();
    const [scaleRef, unit, unitNumber] = getScaleVars(highestValue);
    let scale = [0, scaleRef * 0.25, scaleRef * 0.5, scaleRef * 0.75, scaleRef];
    const amounts = [];
    years.forEach((year) => {
        amounts.push(getYearlyAmount(year, unitNumber));
    });
    console.log(amounts);
    if (
        amounts.filter((e) => e != null).length == 0 ||
        annualRevenues == null
    ) {
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
                        {i18n.t(`companyInfoScreen:${defaultUnit}`)} (EUR)
                    </div>
                </div>
                <div className="no-data-text">
                    More Data will be available soon!
                </div>
                <p className="source">
                    {i18n.t("companyInfoScreen:source")}: polyPedia
                </p>
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
                        {i18n.t(`companyInfoScreen:${unit}`)} (EUR)
                    </div>
                </div>
                <p className="source">Source: polyPedia</p>
                <div
                    className="bar"
                    style={{
                        left: "15%",
                        height: getHeight(amounts[0], scaleRef) + "%",
                    }}
                >
                    {amounts[0] ? (
                        <p className="in-bar-number">{amounts[0]}</p>
                    ) : (
                        <p className="no-data-tag">No Data</p>
                    )}
                </div>
                <div
                    className="bar"
                    style={{
                        left: "30%",
                        height: getHeight(amounts[1], scaleRef) + "%",
                    }}
                ></div>
                <div
                    className="bar"
                    style={{
                        left: "45%",
                        height: getHeight(amounts[2], scaleRef) + "%",
                    }}
                ></div>
                <div
                    className="bar"
                    style={{
                        left: "60%",
                        height: getHeight(amounts[3], scaleRef) + "%",
                    }}
                ></div>
                <div
                    className="bar"
                    style={{
                        left: "75%",
                        height: getHeight(amounts[4], scaleRef) + "%",
                    }}
                ></div>
            </div>
        );
    }
};

export default CompanyRevenueChart;
