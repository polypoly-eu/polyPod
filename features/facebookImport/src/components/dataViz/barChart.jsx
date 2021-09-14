import React from "react";

import generateScale from "../../model/generate-scale";

import "./barChart.css";

const BarChart = ({
    data,
    names,
    shouldSort = true,
    onClickBar = () => {},
    footerContent,
    screenPadding = 0,
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

    const pixelPerChar = 7;

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
                        <p>{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const bars = (
        <div className="bars">
            {data.map(({ title, count, extraData }, index) => (
                <div key={index} className="bar-box" onClick={onClickBar}>
                    <div className="above-bar">
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
                                              13 + count.toString().length * 7
                                          }px, -50%)`,
                                          color: "var(--color-grey-50)",
                                      }
                                    : null
                            }
                        >
                            {count}
                            {(() => {
                                console.log(
                                    (document.body.scrollWidth -
                                        screenPadding) *
                                        (count /
                                            scaleValues[
                                                scaleValues.length - 1
                                            ]) <
                                        pixelPerChar * count.toString().length
                                );
                            })()}
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
            {bars}
        </div>
    );
};

export default BarChart;
