import React, { useState } from "react";
import DataBubblesAll from "../../dataViz/dataBubblesAll.jsx";

import i18n from "../../../i18n.js";

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
                    {i18n.t("dataOverviewMiniStory:folder.info", {
                        clicked_folder: clickedButton,
                        number_files: fileNumber,
                    })}
                </p>
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
                <p className="source">
                    {i18n.t("common:source.your.facebook.data")}
                </p>
            </div>
        </>
    );
};

export default DataOverview;
