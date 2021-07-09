import React from "react";
import utils from "./utils.js";
import "./dataViz.css";
import DataTypeBubbles from "./dataTypeBubbles.jsx";
//import { text } from "d3";

/*
    Component to visualize data in a non-ordered bubble-diagram
    Takes in width and height of the output svg as well as
    data object: [{dataType, value},{},..]
*/

const DataTypeBubbleAll = ({
    data,
    width,
    height,
    bubbleColor,
    textColor,
    opacity = 1,
    showValues = true,
    highlight = null,
}) => {
    //this is needed for the font-size calculations
    let highestValue = 0;
    //This is necessary because later d.count is a function

    //data.sort((a, b) => b.value - a.value);

    // d3 svg bubble-diagram drawing function
    const drawBubblesLeafs = (leaf, bubbleContainer) => {
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
                  .style("font-family", "Jost Medium")
                  .style("font-weight", "500")
            : null;

        if (highlight) {
            const bubbles = bubbleContainer.selectAll("circle");
            const highlightedBubble = utils.findNode(
                bubbles,
                (d) => d.data["dpv:Category"] === highlight?.["dpv:Category"]
            );
            bubbles
                .filter((d) => d !== highlightedBubble)
                .style("fill-opacity", opacity * 0.2);
            const highlightText = highlightedBubble.data.translation;
            utils.appendCircleLabel(
                bubbleContainer,
                highlightedBubble,
                highlightText
            );
        }
    };

    return (
        <DataTypeBubbles
            data={data}
            width={width}
            height={height}
            drawLeafs={drawBubblesLeafs}
        ></DataTypeBubbles>
    );
};

export default DataTypeBubbleAll;
