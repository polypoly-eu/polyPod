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
                      return d.r > 30 ? Math.round(d.value) : "";
                  })
                  .attr("text-anchor", "middle")
                  .attr("y", ".3em")
                  .style("fill", textColor)
                  .style("font-size", "16px")
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
