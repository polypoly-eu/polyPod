import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";

/*
    Component to visualize data in a non-ordered bubble-diagram
    Takes in width and height of the output svg as well as
    data object: [{dataType, value},{},..]
*/

const DataTypeBubbleCategory = ({
    data,
    width,
    height,
    typeBundle,
    correlationColor,
}) => {
    const bubbleRef = useRef(null);
    const edgePadding = 5;

    const correlatingElements = [];

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

    const calculateDistance = (x1, y1, x2, y2) => {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    };

    const getFurthestFromCenter = (possibilities, correlationCenter) => {
        let furthest = possibilities[0];
        possibilities.forEach((p) => {
            calculateDistance(
                p.x,
                p.y,
                correlationCenter.x,
                correlationCenter.y
            ) >
            calculateDistance(
                furthest.x,
                furthest.y,
                correlationCenter.x,
                correlationCenter.y
            )
                ? (furthest = p)
                : null;
        });
        return furthest;
    };

    const getTextPosition = (
        { x, y, r, name },
        maxWidth,
        maxHeight,
        correlationCenter
    ) => {
        const dx = r + name.length * 4;
        const edgeDistance = -20;
        const possibilities = [
            { x: x, y: y - (r + 8) }, //above
            { x: x, y: y + (r + 16) }, //below
            { x: x + dx, y: y + r / 2 }, //right
            { x: x - dx, y: y + r / 2 }, //left
        ].filter(
            (e) =>
                e.x - edgeDistance > 0 &&
                maxWidth - e.x > edgeDistance &&
                e.y - edgeDistance > 0 &&
                maxHeight - e.y > edgeDistance
        );
        return getFurthestFromCenter(possibilities, correlationCenter);
    };

    const getCorrelationCenter = () => {
        let x = 0;
        let y = 0;
        const length = correlatingElements.length;
        correlatingElements.forEach((e) => {
            x += e.x;
            y += e.y;
        });
        return { x: x / length, y: y / length };
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
            .attr("fill-opacity", (d) =>
                typeBundle.includes(d.data["dpv:Category"]) ? 1 : 0.2
            )
            .attr("fill", correlationColor)
            .style("vertical-align", "center")
            .each(function (d) {
                if (typeBundle.includes(d.data["dpv:Category"])) {
                    correlatingElements.push({
                        x: d.x,
                        y: d.y,
                        r: d.r,
                        name:
                            d.data[
                                i18n.t("dataTypeBubble:category.translation")
                            ],
                    });
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
            .style("font-weight", "500");

        bubbleContainer
            .append("line")
            .style("stroke", "#F7FAFC")
            .style("stroke-width", 1)
            .attr("x1", correlatingElements[0].x)
            .attr("y1", correlatingElements[0].y)
            .attr("x2", correlatingElements[1].x)
            .attr("y2", correlatingElements[1].y);

        if (correlatingElements.length > 2) {
            bubbleContainer
                .append("line")
                .style("stroke", "#F7FAFC")
                .style("stroke-width", 1)
                .attr("x1", correlatingElements[1].x)
                .attr("y1", correlatingElements[1].y)
                .attr("x2", correlatingElements[2].x)
                .attr("y2", correlatingElements[2].y);

            bubbleContainer
                .append("line")
                .style("stroke", "#F7FAFC")
                .style("stroke-width", 1)
                .attr("x1", correlatingElements[0].x)
                .attr("y1", correlatingElements[0].y)
                .attr("x2", correlatingElements[2].x)
                .attr("y2", correlatingElements[2].y);
        }

        const correlationCenter = getCorrelationCenter();

        correlatingElements.forEach((e) => {
            //draw a new circle over the line -> d3/svg has no z-index
            bubbleContainer
                .append("circle")
                .attr("r", e.r)
                .attr("transform", `translate(${e.x + 1},${e.y + 1})`)
                .attr("fill-opacity", 1)
                .attr("fill", correlationColor)
                .style("vertical-align", "center");

            const textPosition = getTextPosition(
                e,
                bubbleContainer._groups[0][0].scrollWidth,
                bubbleContainer._groups[0][0].scrollHeight,
                correlationCenter
            );

            bubbleContainer
                .append("text")
                .text(e.name)
                .attr("text-anchor", "middle")
                .attr("x", textPosition.x)
                .attr("y", textPosition.y)
                .style("fill", "#F7FAFC")
                .style("font-size", 14)
                .style("font-weight", "500");
        });
    };

    useEffect(() => {
        clearSvg();
        drawDataBubbles(createBubbleContainer());
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default DataTypeBubbleCategory;
