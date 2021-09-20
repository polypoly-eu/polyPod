import React from "react";
import DataBubbles from "./dataBubbles.jsx";

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
}) => {
    const smallBubblesRadius = 20;
    const bigBubblesRadius = 50;
    const bigBubblesFont = "20px";
    const mediumBubblesFont = "16px";

    // d3 svg bubble-diagram drawing function
    const drawBubblesLeafs = (leaf) => {
        leaf.append("circle")
            .attr("r", (d) => d.r)
            .style("fill", bubbleColor)
            .style("stroke", "white")
            .style("vertical-align", "center")
            .attr("fill-opacity", opacity);

        showValues
            ? leaf
                  .append("text")
                  .text((d) => {
                      return d.r > smallBubblesRadius
                          ? Math.round(d.value)
                          : "";
                  })
                  .attr("text-anchor", "middle")
                  .attr("y", ".3em")
                  .style("fill", textColor)
                  .style("font-size", (d) => {
                      return d.r > bigBubblesRadius
                          ? bigBubblesFont
                          : mediumBubblesFont;
                  })
                  .style("font-family", "Jost Medium")
                  .style("font-weight", "500")
            : null;
    };

    return (
        <DataBubbles
            data={data}
            width={width}
            height={height}
            drawLeafs={drawBubblesLeafs}
        ></DataBubbles>
    );
};

export default DataTypeBubbleAll;
