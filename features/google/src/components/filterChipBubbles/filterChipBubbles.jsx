import React, { useState } from "react";
import { PolyChart, FilterChips } from "@polypoly-eu/poly-look";

const bubbleVizWidth = 400;
const bubbleVizHeight = 400;
const dataBubblesDarkColor = "#0f1938";
const dataBubblesLightColor = "#f7fafc";

const FilterChipBubbles = ({ data }) => {
    const [selectedActivityType, setSelectedActivityType] = useState(
        data[0].title
    );

    const totalFiles = data.reduce(
        (previous, current) => previous + current.count,
        0
    );
    const totalTitle = "Total";

    const dataWithTotal = [...data, { title: totalTitle, value: totalFiles }];

    const handleBubbleClick = (_, node) => {
        setSelectedActivityType(node.data.title);
    };

    const bubbleColor = (bubble) => {
        if (bubble.data.title === selectedActivityType) {
            return dataBubblesLightColor;
        } else {
            return dataBubblesDarkColor;
        }
    };

    return (
        <>
            <PolyChart
                type="bubble-cluster"
                data={data}
                width={bubbleVizWidth}
                height={bubbleVizHeight}
                bubbleColor={
                    selectedActivityType === totalTitle
                        ? dataBubblesLightColor
                        : bubbleColor
                }
                textColor={dataBubblesDarkColor}
                onBubbleClick={handleBubbleClick}
            />
            <FilterChips
                chipsContent={dataWithTotal.map((d) => {
                    return { id: d.title };
                })}
                defaultActiveChips={[selectedActivityType]}
                onChipClick={(title) => setSelectedActivityType(title)}
            />
        </>
    );
};

export default FilterChipBubbles;
