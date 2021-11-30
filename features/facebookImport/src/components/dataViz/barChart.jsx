import React from "react";

import generateScale from "../../model/analyses/utils/generate-scale";

import "./barChart.css";

const BarChart = ({
    data,
    names,
    shouldSort = true,
    onClickBar = () => {},
    footerContent,
    screenPadding = 0,
    groupMessage = false,
}) => {
    if (names) data.map((data) => (data.title = data[names]));
    const getHighestCount = () => {
        let highest = 0;
        data.forEach((e) => {
            e.count > highest ? (highest = e.count) : null;
        });
        return highest;
    };

    if (shouldSort) {
        data.sort((a, b) => b.count - a.count);
    }

    const highestCount = getHighestCount();
    const scaleValues = generateScale(highestCount);

    const pixelPerChar = 10;

    const scale = (
        <div className="scale-container">
            <div className="scale">
                <div className="origin">
                    <p>0</p>
                    <div></div>
                </div>
                {scaleValues.map((value, index) => (
                    <div key={index} className="tick-box">
                        <div className="half-tick"></div>
                        <div className="tick"></div>
                        <p>{index < 1 ? value : ""}</p>
                    </div>
                ))}
                <div
                    className="max-indicator"
                    style={{
                        left:
                            (highestCount /
                                scaleValues[scaleValues.length - 1]) *
                                100 +
                            "%",
                    }}
                >
                    <p>{`Max: ${highestCount}`}</p>
                    <div className="marker"></div>
                </div>
            </div>
        </div>
    );

    const bars = (
        <div className="bars">
            {data.map(({ title, count, extraData }, index) => (
                <div key={index} className="bar-box" onClick={onClickBar}>
                    <div className="above-bar">
                        {groupMessage && title.includes(" and ") ? (
                            <img
                                className="group-icon"
                                src="./images/users.svg"
                            />
                        ) : (
                            <></>
                        )}
                        <p className="name">{title}</p>
                    </div>
                    <div
                        className="bar"
                        style={{
                            width:
                                (count / scaleValues[scaleValues.length - 1]) *
                                    100 +
                                "%",
                        }}
                    >
                        <p
                            style={
                                (document.body.scrollWidth - screenPadding) *
                                    (count /
                                        scaleValues[scaleValues.length - 1]) <
                                pixelPerChar * count.toString().length
                                    ? {
                                          transform: `translate(${
                                              4 +
                                              count.toString().length *
                                                  pixelPerChar
                                          }px, -50%)`,
                                          color: "var(--color-grey-50)",
                                      }
                                    : null
                            }
                        >
                            {count}
                        </p>
                    </div>

                    {footerContent ? (
                        <div className="bottom-bar">
                            {footerContent({ title, count, extraData })}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="bar-chart">
            {scale}
            <div className="scrollable-wrapper">{bars}</div>
        </div>
    );
};

export default BarChart;
