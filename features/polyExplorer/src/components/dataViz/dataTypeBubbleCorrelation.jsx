import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";
import utils from "./utils.js";

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

    const calculateRectBounds = (center, apothems) => ({
        left: center.x - apothems.x,
        right: center.x + apothems.x,
        top: center.y - apothems.y,
        bottom: center.y + apothems.y,
    });

    const containsRect = (containerRect, rect) =>
        rect.left > containerRect.left &&
        rect.right < containerRect.right &&
        rect.top > containerRect.top &&
        rect.bottom < containerRect.bottom;

    const findContainedPositions = (positions, container) =>
        Object.values(positions).filter((p) => {
            const viewBox = container.node().viewBox.baseVal;
            const containerRect = {
                left: viewBox.x,
                right: viewBox.x + viewBox.width,
                top: viewBox.y,
                bottom: viewBox.y + viewBox.height,
            };
            return containsRect(containerRect, p.rect);
        });

    function calculateElementRect(element) {
        const bounds = element.getBBox();
        const rect = {
            left: bounds.x,
            right: bounds.x + bounds.width,
            top: bounds.y,
            bottom: bounds.y + bounds.height,
        };

        // The element's bounding box is relative to its own coordinate system,
        // i.e. it does not consider its transformation matrix. This is an
        // attempt to do that manually, that does however not consider anything
        // but translate().
        const transform = element.transform.baseVal.consolidate().matrix;
        rect.left += transform.e;
        rect.right += transform.e;
        rect.top += transform.f;
        rect.bottom += transform.f;
        return rect;
    }

    const detectRectCollision = (a, b) =>
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top;

    const findCollisionFreePositions = (positions, elements) =>
        positions.filter(
            (position) =>
                !elements.some((element) => {
                    const elementRect = calculateElementRect(element);
                    return detectRectCollision(position.rect, elementRect);
                })
        );

    function calculateRectToPointDistance(rect, point) {
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    function findFurthestFromCenter(positions, correlationCenter) {
        const distancePerPosition = positions.map((p) => [
            p,
            calculateRectToPointDistance(p.rect, correlationCenter),
        ]);
        return distancePerPosition.sort((a, b) => b[1] - a[1])[0][0];
    }

    function findLabelPosition(label, bubble, container, correlationCenter) {
        const bounds = label.node().getBBox();
        const apothems = {
            x: bounds.width / 2,
            y: bounds.height / 2,
        };

        const margin = 4;
        const offset = {
            x: bubble.r + apothems.x + margin,
            y: bubble.r + apothems.y + margin,
        };
        const positions = {
            top: {
                x: bubble.x,
                y: bubble.y - offset.y,
            },
            bottom: {
                x: bubble.x,
                y: bubble.y + offset.y,
            },
            left: {
                x: bubble.x - offset.x,
                y: bubble.y,
            },
            right: {
                x: bubble.x + offset.x,
                y: bubble.y,
            },
        };
        for (let [, p] of Object.entries(positions))
            p.rect = calculateRectBounds(p, apothems);

        const containedPositions = findContainedPositions(positions, container);
        const validPositions = findCollisionFreePositions(
            containedPositions,
            d3
                .selectAll("g.label")
                .nodes()
                .filter((otherLabel) => !label.node().isSameNode(otherLabel))
        );
        return findFurthestFromCenter(validPositions, correlationCenter);
    }

    function appendBubbleLabel(container, bubble, correlationCenter) {
        const label = utils.appendLabel(container, bubble.name);
        const position = findLabelPosition(
            label,
            bubble,
            container,
            correlationCenter
        );
        label.attr("transform", `translate(${position.x}, ${position.y})`);
    }

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
                                i18n.t(
                                    "dataExplorationScreen:from.polyPedia.translation"
                                )
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

        //draw a new circle over the line -> d3/svg has no z-index
        correlatingElements.forEach((e) => {
            bubbleContainer
                .append("circle")
                .attr("r", e.r)
                .attr("transform", `translate(${e.x + 1},${e.y + 1})`)
                .attr("fill-opacity", 1)
                .attr("fill", correlationColor)
                .style("vertical-align", "center");
        });

        correlatingElements.forEach((e) => {
            appendBubbleLabel(
                bubbleContainer,
                {
                    name: e.name,
                    x: e.x + 1,
                    y: e.y + 1,
                    r: e.r,
                },
                correlationCenter
            );
        });
    };

    useEffect(() => {
        data.forEach((e) => {
            e.value = e.count;
        });
        clearSvg();
        drawDataBubbles(createBubbleContainer());
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default DataTypeBubbleCategory;
