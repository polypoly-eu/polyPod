import React, { useState } from "react";
import { PolyChart, FilterChips } from "@polypoly-eu/poly-look";

import "./dataStructureMiniStory.css";
import {
    BUBBLE_DARK_COLOR,
    BUBBLE_LIGHT_COLOR,
    BUBBLE_VIZ_HEIGHT,
    BUBBLE_VIZ_WIDTH,
} from "../../constants/bubbleViz";
import SourceInfoButton from "../sourceInfoButton/sourceInfoButton.jsx";
import i18n from "!silly-i18n";

//This component needs to go to poly-look
const DataStructureMiniStory = ({ data }) => {
    let totalFiles = 0;
    data.forEach((d) => {
        totalFiles += d.count;
        d.value = d.count;
    });
    data.sort(function (a, b) {
        return b.value - a.value;
    });

    const [selectedFolder, setSelectedFolder] = useState(data[0].title);

    const totalTitle = "Total";

    const dataWithTotal = [...data, { title: totalTitle, value: totalFiles }];

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
            return BUBBLE_LIGHT_COLOR;
        } else {
            return BUBBLE_DARK_COLOR;
        }
    };

    const category = selectedFolder === totalTitle ? "" : "category";

    return (
        <>
            <div>
                <p
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("dataStructure:folder.info", {
                            category: category,
                            selected_folder: selectedFolder,
                            amount_of_files: amountOfFiles,
                        }),
                    }}
                />
                <PolyChart
                    type="bubble-cluster"
                    data={data}
                    width={BUBBLE_VIZ_WIDTH}
                    height={BUBBLE_VIZ_HEIGHT}
                    bubbleColor={
                        selectedFolder === totalTitle
                            ? BUBBLE_LIGHT_COLOR
                            : bubbleColor
                    }
                    textColor={BUBBLE_DARK_COLOR}
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
            <SourceInfoButton
                source={"Your google data"}
                popUpProps={{ name: "info-data-structure" }}
            />
        </>
    );
};

export default DataStructureMiniStory;
