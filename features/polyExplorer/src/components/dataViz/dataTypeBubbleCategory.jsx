import React from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";
import utils from "./utils.js";
import DataTypeBubbles from "./dataTypeBubbles.jsx";

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
    defaultColor,
    highlightedType,
}) => {
    // d3 svg bubble-diagram drawing function
    const drawBubblesLeafs = (leaf) => {
        leaf.append("circle")
            .attr("r", (d) => d.r)
            .attr("fill-opacity", (d) =>
                d.data.Polypoly_Parent_Category.indexOf(category) >= 0 ? 1 : 0.2
            )
            .attr("fill", defaultColor)
            .style("vertical-align", "center")
            .each(function (d) {
                if (d.data["dpv:Category"] === highlightedType) {
                    const diagram = d3.select(this.parentNode.parentNode);
                    const labelText =
                        d.data[
                            i18n.t(
                                "dataExplorationScreen:from.polyPedia.translation"
                            )
                        ];
                    utils.appendCircleLabel(diagram, d, labelText);
                }
            });

        //This is just so the size of the graph is equal to the other dataBubble-Graphs
        leaf.append("text")
            .text((d) => {
                return d.value.toString();
            })
            .attr("text-anchor", "middle")
            .attr("y", ".3em")
            .style("fill", "transparent")
            .style("font-size", (d) => {
                return (8 + d.value / 60).toString() + "px";
            })
            .style("font-family", "Jost Medium")
            .style("font-weight", "500");

        leaf.select();
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

export default DataTypeBubbleCategory;
