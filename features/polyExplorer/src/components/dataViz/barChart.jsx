import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
    data.sort(function (x, y) {
        return d3.descending(x.value, y.value);
    });

    const svgBarRef = useRef();
    const gHeight = 46;
    const width = 500;
    const height = data.length * (gHeight * 2);
    const margin = { top: 30, right: 30, bottom: 1, left: 0 };
    const labelContainerMargin = { top: 8, right: 12, bottom: 8, left: 12 };
    const barHeight = gHeight - margin.top;
    const maxValue = d3.max([d3.max(data, (d) => d.value)]);

    function render() {
        const svgChart = d3
            .select(svgBarRef.current)
            .append("svg")
            .style("width", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`);
        const xScale = d3
            .scaleLinear()
            .range([0, width - margin.left - margin.right])
            .domain([0, d3.max(data, (d) => d.value)]);
        const yScale = d3
            .scaleBand()
            .range([0, height - margin.top - margin.bottom])
            .domain(data.map((d) => d.title));
        const bars = svgChart
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        bars.append("rect")
            .attr("class", "bar")
            .attr("height", barHeight)
            .attr("width", (d) => xScale(d.value))
            .attr("x", margin.left)
            .attr("y", (d) => yScale(d.title) + gHeight)
            .attr("rx", "8")
            .attr("ry", "8")
            .attr("fill", "var(--data-exp-purposes)")
            .style("margin-top", margin.top);
        bars.append("text")
            .attr("class", "label-value")
            .attr("x", (d) => xScale(d.value) + margin.left + 4)
            .attr("y", (d) => yScale(d.title) + gHeight + 8)
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .attr("fill", "var(--data-exp-purposes)")
            .text((d) => d.value);

        const labelTitle = bars
            .append("text")
            .attr("class", "label-title")
            .text((d) => d.title)
            .attr("x", margin.left + labelContainerMargin.left)
            .attr("y", (d) => yScale(d.title) + margin.top)
            .style("font", "14px")
            .attr("fill", "var(--color-text-dark)");

        bars.append("rect")
            .attr("class", "label-title-container")
            .attr("x", margin.left)
            .attr("y", (d) => yScale(d.title) + labelContainerMargin.bottom)
            .attr(
                "width",
                200 + labelContainerMargin.left + labelContainerMargin.right
            )
            .attr(
                "height",
                14 + labelContainerMargin.top + labelContainerMargin.bottom
            )
            .attr("rx", "16")
            .attr("ry", "16")
            .attr("fill", "transparent")
            .attr("stroke", "var(--color-dark)");
        const maxValueLine = svgChart
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        maxValueLine
            .append("line")
            .attr("x1", xScale(maxValue))
            .attr("y1", labelContainerMargin.top)
            .attr("x2", xScale(maxValue))
            .attr("y2", height - margin.bottom)
            .style("stroke", "var(--data-exp-purposes)")
            .style("stroke-width", 2);
        maxValueLine
            .append("text")
            .text(maxValue + " Maximum")
            .attr("x", width - margin.right)
            .attr("y", 0)
            .attr("width", "10")
            .attr("height", "100")
            .style("font-size", "12px");
    }

    useEffect(render, [data]);

    return <div ref={svgBarRef}></div>;
};

export default BarChart;
