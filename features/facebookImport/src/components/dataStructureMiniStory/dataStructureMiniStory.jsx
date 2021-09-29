import React, { useState } from "react";
import { ClusteredBubbles } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./dataStructureMiniStory.css";

const DataStructureMiniStory = ({ data }) => {
    data.sort(function (a, b) {
        return b.count - a.count;
    });

    const bubbleVizWidth = 400;
    const bubbleVizHeight = 400;
    const dataBubblesDarkColor = "#0f1938";
    const dataBubblesLightColor = "#f7fafc";
    const [selectedFolder, setSelectedFolder] = useState(data[0].title);

    const handleSelectedFolder = (ev, newSelectedFolder) => {
        ev.preventDefault();
        setSelectedFolder(newSelectedFolder);
    };

    const handleBubbleClick = (_, node) => {
        setSelectedFolder(node.data.title);
    };

    const bubbleColor = (bubbles) => {
        if (bubbles.data.title === selectedFolder) {
            return dataBubblesLightColor;
        } else {
            return dataBubblesDarkColor;
        }
    };

    const amountOfFiles = data.find(
        (bubble) => bubble.title === selectedFolder
    )?.count;

    return (
        <>
            <div>
                <p>
                    {i18n.t("dataStructureMiniStory:folder.info", {
                        selected_folder: selectedFolder,
                        amount_of_files: amountOfFiles,
                    })}
                </p>
                <ClusteredBubbles
                    data={data}
                    width={bubbleVizWidth}
                    height={bubbleVizHeight}
                    bubbleColor={bubbleColor}
                    textColor={dataBubblesDarkColor}
                    onBubbleClick={handleBubbleClick}
                />
            </div>
            <div className="data-structure">
                {data.map((bubble, index) => {
                    return (
                        <button
                            className={
                                bubble.title === selectedFolder
                                    ? "data-structure-button selected-data"
                                    : "data-structure-button"
                            }
                            onClick={(ev) =>
                                handleSelectedFolder(ev, bubble.title)
                            }
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
