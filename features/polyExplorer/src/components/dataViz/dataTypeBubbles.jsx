import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./dataViz.css";
//import { text } from "d3";

/*
    Component to visualize data in a non-ordered bubble-diagram
    Takes in width and height of the output svg as well as
    data object: [{dataType, value},{},..]
*/

const DataTypeBubbles = ({
    data,
    width,
    height,
    bubbleColor,
    textColor,
    opacity = 1,
    showValues = true,
}) => {
    const bubbleRef = useRef();
    const edgePadding = 5;

    //this is needed for the font-size calculations
    let highestValue = 0;
    //This is necessary because later d.count is a function

    //data.sort((a, b) => b.value - a.value);

    const clearSvg = () => {
        d3.select(bubbleRef.current).selectAll("svg").remove();
    };

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
            .attr("viewBox", `0 0 ${width} ${height}`);
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
            .style("vertical-align", "center")
            .attr("fill-opacity", opacity);

        showValues
            ? leaf
                  .append("text")
                  .text((d) => {
                      if (highestValue < 2000) return d.value.toString();
                      else return d.value > 25 ? d.value : "";
                  })
                  .attr("text-anchor", "middle")
                  .attr("y", ".3em")
                  .style("fill", textColor)
                  .style("font-size", (d) => {
                      return (
                          (8 + d.value / (highestValue / 4)).toString() + "px"
                      );
                  })
                  .style("font-weight", "500")
            : null;
    };

    useEffect(() => {
        data.forEach((e) => {
            e.value = e.count;
            e.count > highestValue ? (highestValue = e.count) : null;
        });
        clearSvg();
        drawDataBubbles(createBubbleContainer());
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default DataTypeBubbles;
