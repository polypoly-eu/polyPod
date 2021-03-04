import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./dataViz.css";

/*
    Component to visualize data in a non-ordered bubble-diagram
    Takes in width and height of the output svg as well as
    data object: [{dataType, value},{},..]
*/

const DataTypeBubbles = ({ data, width, height, bubbleColor, textColor }) => {
    const bubbleRef = useRef(null);
    const edgePadding = 5;

    const makeHierarchy = () => {
        return d3.hierarchy({ children: data }).sum((d) => d.count);
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
            .attr("width", width);
    };

    // d3 svg bubble-diagram drawing function
    const drawDataBubbles = (bubbleContainer) => {
        const hierarchicalData = makeHierarchy(data);
        const packLayout = pack();

        const root = packLayout(hierarchicalData);

        const leaf = bubbleContainer
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

        leaf.append("circle")
            .attr("r", (d) => d.r)
            .style("fill", bubbleColor)
            .style("vertical-align", "center");

        //Ok this is weird, count is already a function of some sort
        /*
        leaf.append("text")
            .text((d) => {
                return d.count.toString();
            })
            .attr("text-anchor", "middle")
            .attr("y", ".3em")
            .style("fill", textColor)
            .style("font-size", (d) => {
                "14px"; //return (10 + d.count / 2).toString() + "px";
            })
            .style("font-weight", "500");
            */
    };

    useEffect(() => {
        drawDataBubbles(createBubbleContainer());
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default DataTypeBubbles;
