import React, { useState } from "react";
import DataBubblesAll from "../../dataViz/dataBubblesAll.jsx";

import "./dataOverview.css";

const DataOverview = ({ data }) => {
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

    const textColor = (bubbles) => {
        if (bubbles.data.title === clickedButton) {
            return "#0f1938";
        } else {
            return "#f7fafc";
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
                    textColor={textColor}
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
