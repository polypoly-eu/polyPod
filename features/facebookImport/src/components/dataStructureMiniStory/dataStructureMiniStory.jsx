import React, { useState } from "react";
import DataBubblesAll from "../dataViz/dataBubblesAll.jsx";

import i18n from "../../i18n.js";

import "./dataStructureMiniStory.css";

const DataStructureMiniStory = ({ data }) => {
    data.sort(function (a, b) {
        return b.count - a.count;
    });

    const dataBubblesWidth = 400;
    const dataBubblesHeight = 400;
    const dataBubblesDarkColor = "#0f1938";
    const dataBubblesLightColor = "#f7fafc";
    const [clickedButton, setClickedButton] = useState(data[0].title);

    const onClickButton = (ev, newClickedButton) => {
        ev.preventDefault();
        setClickedButton(newClickedButton);
    };

    const bubbleColor = (bubbles) => {
        if (bubbles.data.title === clickedButton) {
            return dataBubblesLightColor;
        } else {
            return dataBubblesDarkColor;
        }
    };

    let fileNumber = data[0].count;
    data.map((bubble) => {
        bubble.title === clickedButton
            ? (fileNumber = bubble.count)
            : fileNumber;
    });

    return (
        <>
            <div>
                <p>
                    {i18n.t("dataStructureMiniStory:folder.info", {
                        clicked_folder: clickedButton,
                        number_files: fileNumber,
                    })}
                </p>
                <DataBubblesAll
                    data={data}
                    width={dataBubblesWidth}
                    height={dataBubblesHeight}
                    bubbleColor={bubbleColor}
                    textColor={dataBubblesDarkColor}
                />
            </div>
            <div className="data-structure">
                {data.map((bubble, index) => {
                    return (
                        <button
                            className={
                                bubble.title === clickedButton
                                    ? "data-structure-button selected-data"
                                    : "data-structure-button"
                            }
                            onClick={(ev) => onClickButton(ev, bubble.title)}
                            key={index}
                        >
                            {bubble.title}
                        </button>
                    );
                })}
                <p className="source">
                    {i18n.t("common:source.your.facebook.data")}
                </p>
            </div>
        </>
    );
};

export default DataStructureMiniStory;
