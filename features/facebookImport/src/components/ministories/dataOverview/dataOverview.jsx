import React, { useState } from "react";
import DataBubblesAll from "../../dataViz/dataBubblesAll.jsx";

import "./dataOverview.css";

const DataOverview = ({ data }) => {
    data.sort(function (a, b) {
        return b.count - a.count;
    });

    const [clickedButton, setClickedButton] = useState(data[0].title);

    const onClickButton = (ev, newClickedButton) => {
        ev.preventDefault();
        setClickedButton(newClickedButton);
    };

    const bubbleColor = (bubbles) => {
        if (bubbles.data.title === clickedButton) {
            return "#f7fafc";
        } else {
            return "#0f1938";
        }
    };

    return (
        <>
            <div>
                <DataBubblesAll
                    data={data}
                    width={400}
                    height={400}
                    bubbleColor={bubbleColor}
                    textColor={"#0f1938"}
                />
            </div>
            <div className="explore-data">
                {data.map((bubble, index) => {
                    return (
                        <button
                            className={
                                bubble.title === clickedButton
                                    ? "explore-data-button selected-data"
                                    : "explore-data-button"
                            }
                            onClick={(ev) => onClickButton(ev, bubble.title)}
                            key={index}
                        >
                            {bubble.title}
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default DataOverview;
