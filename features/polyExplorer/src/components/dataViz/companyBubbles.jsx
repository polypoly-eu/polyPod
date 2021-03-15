import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./dataViz.css";

const CompanyBubbles = ({ data, width, height, bubbleColor }) => {
    const bubbleRef = useRef();
    const edgePadding = 5;

    const companies = [];

    data.forEach((e) => {
        companies.push({ name: e, value: 1 });
    });

    const clearSvg = () => {
        d3.select(bubbleRef.current).selectAll("svg").remove();
    };

    const makeHierarchy = () => {
        return d3.hierarchy({ children: companies }).sum((d) => d.value);
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
            .attr("fill-opacity", 1);
    };

    useEffect(() => {
        clearSvg();
        drawDataBubbles(createBubbleContainer());
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default CompanyBubbles;
