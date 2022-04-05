import React, { useState } from "react";
import InfoButton from "../buttons/infoButton/infoButton.jsx";
import { PolyChart, FilterChips } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./dataStructureMiniStory.css";

const DataStructureMiniStory = ({ data }) => {
    data.forEach((d) => {
        d.value = d.count;
    });
    data.sort(function (a, b) {
        return b.value - a.value;
    });

    const totalFiles = data.reduce(
        (previous, current) => previous + current.count,
        0
    );

    const bubbleVizWidth = 400;
    const bubbleVizHeight = 400;
    const dataBubblesDarkColor = "#0f1938";
    const dataBubblesLightColor = "#f7fafc";
    const [selectedFolder, setSelectedFolder] = useState(data[0].title);

    const totalTitle = i18n.t("dataStructureMiniStory:total.chip");

    const dataWithTotal = [
        ...data,
        { title: totalTitle, count: totalFiles, value: totalFiles },
    ];

    const amountOfFiles = dataWithTotal.find(
        (bubble) => bubble.title === selectedFolder
    )?.count;

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

    const category =
        selectedFolder === totalTitle
            ? ""
            : i18n.t("dataStructureMiniStory:category");

    return (
        <>
            <div>
                <p
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("dataStructureMiniStory:folder.info", {
                            category: category,
                            selected_folder: selectedFolder,
                            amount_of_files: amountOfFiles,
                        }),
                    }}
                />
                <PolyChart
                    type="bubble-cluster"
                    data={data}
                    width={bubbleVizWidth}
                    height={bubbleVizHeight}
                    bubbleColor={
                        selectedFolder === totalTitle
                            ? dataBubblesLightColor
                            : bubbleColor
                    }
                    textColor={dataBubblesDarkColor}
                    onBubbleClick={handleBubbleClick}
                />
            </div>
            <FilterChips
                chipsContent={dataWithTotal.map((d) => {
                    return { id: d.title };
                })}
                defaultActiveChips={[selectedFolder]}
                onChipClick={handleFolderSelected}
            />
            <div className="right-edge-aligned">
                <InfoButton route="/report/data-structure-info" />
            </div>
            <p className="source data-structure-source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </>
    );
};

export default DataStructureMiniStory;
