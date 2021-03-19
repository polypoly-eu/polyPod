import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";
import utils from "./utils.js";
import "./dataViz.css";

const CompanyBubbles = ({
    data,
    view,
    width,
    height,
    opacity = 1,
    bubbleColor,
}) => {
    const bubbleRef = useRef();
    const edgePadding = 5;

    const clearSvg = () => {
        d3.select(bubbleRef.current).selectAll("svg").remove();
    };

    const appendBubbleContainer = () => {
        return d3
            .select(bubbleRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("opacity", opacity);
    };

    function appendBubbles(container, data) {
        const root = d3.hierarchy(data).sum(() => 1);

        const packLayout = d3
            .pack()
            .size([width - edgePadding, height - edgePadding])
            .padding(3);
        packLayout(root);

        return container
            .selectAll("circle")
            .data(root.descendants())
            .enter()
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", (d) => d.r);
    }

    const drawFunctions = {
        flat: (container) => {
            const viewData = {
                children: data.map((company) => ({ name: company })),
            };
            const bubbles = appendBubbles(container, viewData);
            bubbles.filter((d) => d.children).style("fill", "transparent");
            bubbles.filter((d) => !d.children).style("fill", bubbleColor);
        },
        industries: (container) => {
            const categoryMap = {};
            for (let { name, category } of data) {
                if (!categoryMap[category])
                    categoryMap[category] = { name: category, children: [] };
                categoryMap[category].children.push({ name });
            }
            const viewData = {
                children: Object.values(categoryMap),
            };

            const bubbles = appendBubbles(container, viewData);

            bubbles.filter((d) => d.children).style("fill", "transparent");

            const industryBubbles = bubbles.filter(
                (d) => d.parent && d.children
            );
            industryBubbles.style("stroke", bubbleColor);

            const companyBubbles = bubbles.filter((d) => !d.children);
            companyBubbles
                .style("fill", bubbleColor)
                .style("fill-opacity", 0.15);

            industryBubbles.each((e) => {
                const industry =
                    e.data.name || i18n.t("common:category.undisclosed");
                const count = categoryMap[e.data.name].children.length;
                const label = utils.appendLabel(
                    container,
                    `${industry}: ${count}`
                );

                const bounds = label.node().getBBox();
                const lineLength = 8;
                label.attr(
                    "transform",
                    `translate(${e.x}, ${
                        e.y - e.r - bounds.height / 2 - lineLength
                    })`
                );
                container
                    .append("line")
                    .style("stroke", "white")
                    .style("stroke-width", 1)
                    .attr("x1", e.x)
                    .attr("y1", e.y - e.r - lineLength)
                    .attr("x2", e.x)
                    .attr("y2", e.y - e.r);
            });
        },
    };

    function draw() {
        const bubbleContainer = appendBubbleContainer();
        const drawFunction = drawFunctions[view];
        if (drawFunction) drawFunction(bubbleContainer);
    }

    useEffect(() => {
        clearSvg();
        draw();
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default CompanyBubbles;
