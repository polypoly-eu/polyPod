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
            .style("fill", (d) => bubbleColor(d))
            .style("vertical-align", "center")
            .attr("fill-opacity", opacity);

        showValues
            ? leaf
                  //   .append("foreignObject")
                  //   .attr("width", (d) => d.r * 2)
                  //   .attr("height", (d) => d.r * 2)
                  //   .attr("x", 0)
                  //   .attr("y", ".3em")
                  //   .attr("transform", (d) => {
                  //       return "translate( " + (d.r * -1) + "," + (d.r * -1) + ")";
                  //   })
                  //   .style("display", "flex")
                  //   .style("justify-content", "center")
                  //   .style("align-items", "center")
                  //   .append("xhtml:div")
                  //   .attr("width", (d) => d.r * 2)
                  //   .attr("height", (d) => d.r * 2)
                  //   .attr("x", 0)
                  //   .attr("y", (d) => d.r)
                  //   .style("display", "flex")
                  //   .style("flex-direction", "column")
                  //   .style("justify-content", "center")
                  //   .style("align-items", "center")
                  //   .append("p")
                  //  .style("color", textColor)
                  .append("text")
                  .text((d) => {
                      return d.value > 5 ? d.data.title : "";
                  })
                  .attr("text-anchor", "middle")
                  .attr("y", ".3em")
                  .style("fill", textColor)
                  .style("font-size", (d) => {
                      return (8 + d.value / 5).toString() + "px";
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
