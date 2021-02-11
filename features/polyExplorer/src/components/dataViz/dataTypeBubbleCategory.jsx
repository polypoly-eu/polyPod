import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

/*
    Component to visualize data in a non-ordered bubble-diagram
    Takes in width and height of the output svg as well as
    data object: [{dataType, value},{},..]
*/

const DataTypeBubbleCategory = ({
    data,
    width,
    height,
    category,
    categoryColor,
    defaultColor,
}) => {
    const bubbleRef = useRef(null);
    let counter = 0;

    data.forEach((e) => {
        e.category = dataCategories[counter];
        if (counter == 3) {
            counter = 0;
        } else counter++;
    });

    // state
    let edgePadding = 5;
    let bubbleColor = "navy";

    const makeHierarchy = () => {
        return d3.hierarchy({ children: data }).sum((d) => d.value);
    };

    const pack = () => {
        return d3
            .pack()
            .size([width - edgePadding, height - edgePadding])
            .padding(3);
    };

    const createBubbleContainer = () => {
        return d3
            .select(bubbleRef.current)
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .style("border", "thin black solid");
    };

    // d3 svg bubble-diagram drawing function
    const drawDataBubbles = (bubbleContainer) => {
        let hierarchicalData = makeHierarchy(data);
        let packLayout = pack();

        const root = packLayout(hierarchicalData);

        const leaf = bubbleContainer
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

        leaf.append("circle")
            .attr("r", (d) => d.r)
            .attr("fill-opacity", 0.7)
            .attr("fill", (d) => {
                d.data.category === category ? categoryColor : defaultColor;
            })
            .style("vertical-align", "center");

        leaf.append("text")
            .text((d) => {
                return d.value.toString();
            })
            .attr("text-anchor", "middle")
            .attr("y", ".3em")
            .style("fill", "white")
            .style("font-size", (d) => {
                return (14 + d.value).toString() + "px";
            });
    };

    useEffect(() => {
        drawDataBubbles(createBubbleContainer());
    });

    return (
        <div>
            <div ref={bubbleRef}></div>
        </div>
    );
};

export default DataTypeBubbleCategory;
