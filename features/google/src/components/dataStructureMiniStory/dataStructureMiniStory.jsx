import React, { useState } from "react";
import { PolyChart, FilterChips } from "@polypoly-eu/poly-look";

import "./dataStructureMiniStory.css";
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

    const bubbleVizWidth = 400;
    const bubbleVizHeight = 400;
    const dataBubblesDarkColor = "#0f1938";
    const dataBubblesLightColor = "#f7fafc";
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
            return dataBubblesLightColor;
        } else {
            return dataBubblesDarkColor;
        }
    };

    const category = selectedFolder === totalTitle ? "" : "category";

    return (
        <>
            <div>
                <p
                    dangerouslySetInnerHTML={{
                        __html: `dataStructureMiniStory:folder.info
                            category ${category}
                            selected_folder ${selectedFolder},
                            amount_of_files ${amountOfFiles}`,
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
            <p className="source data-structure-source">{"your google data"}</p>
        </>
    );
};

export default DataStructureMiniStory;
