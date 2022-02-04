import React from "react";
import utils from "./utils.js";
import "./dataViz.css";
import DataTypeBubbles from "./dataTypeBubbles.jsx";

const smallBubblesFontSize = "10px";
const bigBubblesFontSize = "20px";
const bigBubblesRadius = 50;
const mediumBubblesFontSize = "16px";
const smallBubblesRadius = 20;
const smallBubbleThreshold = 10;

/*
    Component to visualize data in a non-ordered bubble-diagram
    Takes in width and height of the output svg as well as
    data object: [{dataType, value},{},..]
*/

const bubbleFontSize = (d) => {
        if (d.r < smallBubblesRadius) return smallBubblesFontSize;
        if (d.r > bigBubblesRadius) return bigBubblesFontSize;
        return mediumBubblesFontSize;
    };
    const filterText = (d) =>
        d.r > smallBubbleThreshold ? Math.round(d.value) : "";

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
                  .text((d) => filterText(d))
                  .attr("text-anchor", "middle")
                  .attr("y", ".3em")
                  .style("fill", textColor)
                  .style("font-size", (d) => bubbleFontSize(d))
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
