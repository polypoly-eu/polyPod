import React from "react";

import i18n from "../../i18n.js";
import Scrollable from "../../components/scrollable/scrollable.jsx";

import "./purposeChart.css";

const PurposeChart = ({ purposes, openPopup, openPurposeInfo }) => {
    const getHighestCount = () => {
        let highest = 0;
        purposes.forEach((e) => {
            e.count > highest ? (highest = e.count) : null;
        });
        return highest;
    };

    purposes.sort((a, b) => b.count - a.count);

    const fillScale = (highest, multiple) => {
        const scale = [];
        for (
            let i = multiple;
            i <= Math.ceil(highest / multiple) * multiple;
            i += multiple
        ) {
            scale.push(i);
        }
        return scale;
    };

    const calculateScaleValues = (highest) => {
        if (highest < 35) return fillScale(highest, 5);
        else if (highest <= 70) return fillScale(highest, 10);
        else if (highest <= 140) return fillScale(highest, 20);
        else if (highest <= 200) return fillScale(highest, 25);
        else if (highest <= 400) return fillScale(highest, 50);
        else if (highest <= 1000) return fillScale(highest, 100);
        else return fillScale(highest, 500);
    };
    const highestCount = getHighestCount();
    const scaleValues = calculateScaleValues(highestCount);
    const scale = (
        <div className="scale">
            <div className="origin">
                <p>0</p>
                <div></div>
            </div>
            {scaleValues.map((value, index) => (
                <div key={index} className="tick-box">
                    <div className="half-tick"></div>
                    <div className="tick"></div>
                    <p>{value}</p>
                </div>
            ))}
        </div>
    );

    const bars = (
        <div className="bars">
            {purposes.map((p, index) => (
                <div
                    key={index}
                    className="bar-box"
                    onClick={() => openPopup(p)}
                >
                    <div className="above-bar">
                        <p className="name">
                            {
                                p[
                                    i18n.t(
                                        "dataExplorationScreen:from.polyPedia.translation"
                                    )
                                ]
                            }
                        </p>
                        <img src="./images/question-circle-light.svg" />
                    </div>
                    <div
                        className="bar"
                        style={{ width: (p.count / highestCount) * 95 + "%" }}
                    ></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="purpose-chart">
            <div className="scale-container">
                <div className="descriptions">
                    <div>
                        {i18n.t(
                            "dataExplorationScreen:purposes.description.scale"
                        )}
                    </div>
                    <div className="fill"></div>
                </div>
                {scale}
            </div>
            <Scrollable>{bars}</Scrollable>
            <div className="help" onClick={() => openPurposeInfo()}>
                <img src="./images/question-circle.svg" />
                <div>{i18n.t("common:how-to-read")}</div>
            </div>
        </div>
    );
};

export default PurposeChart;
