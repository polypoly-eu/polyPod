import React, { useState } from "react";
import InfoButton from "../buttons/infoButton/infoButton.jsx";
import { PolyChart } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./dataStructureMiniStory.css";
import ChartButtons from "../chartButtons/chartButtons.jsx";

const DataStructureMiniStory = ({ data }) => {
    data.forEach((d) => {
        d.value = d.count;
    });
    data.sort(function (a, b) {
        return b.value - a.value;
    });

    const bubbleVizWidth = 400;
    const bubbleVizHeight = 400;
    const dataBubblesDarkColor = "#0f1938";
    const dataBubblesLightColor = "#f7fafc";
    const [selectedFolder, setSelectedFolder] = useState(data[0].title);

    const handleFolderSelected = (buttonContent) => {
        setSelectedFolder(buttonContent);
    };

    const handleBubbleClick = (_, node) => {
        setSelectedFolder(node.data.title);
    };

    const bubbleColor = (bubble) => {
        if (bubble.data.title === selectedFolder) {
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
                <p
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("dataStructureMiniStory:folder.info", {
                            selected_folder: selectedFolder,
                            amount_of_files: amountOfFiles,
                        }),
                    }}
                />
                <PolyChart
                    type="poly-bubble-cluster"
                    data={data}
                    width={bubbleVizWidth}
                    height={bubbleVizHeight}
                    bubbleColor={bubbleColor}
                    textColor={dataBubblesDarkColor}
                    onBubbleClick={handleBubbleClick}
                />
            </div>
            <ChartButtons
                buttonsContent={data.map((d) => {
                    return { id: d.title };
                })}
                activeButton={selectedFolder}
                onButtonsClick={handleFolderSelected}
            />
            <InfoButton route="/report/data-structure-info" />
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </>
    );
};

export default DataStructureMiniStory;
