import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
    data.sort(function (x, y) {
        return d3.descending(x.value, y.value);
    });

    const svgBarRef = useRef();
    const gHeight = 52;
    const width = 500;
    const height = data.length * (gHeight * 2);
    const margin = { top: 36, right: 30, bottom: 1, left: 1 };
    const barHeight = gHeight - margin.top;
    const legendWidth = 120;
    const legendHeight = 40;
    const fontSize = "14px";
    const labelTitlePadding = { top: 8, right: 12, bottom: 8, left: 12 };
    const maxValue = d3.max(data, (d) => d.value);
    const averageValue = d3.mean(data, (d) => d.value);

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
            .attr("transform", `translate(${margin.left}, ${gHeight})`);
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
            .attr("x", (d) => xScale(d.value) + margin.left + 2)
            .attr("y", (d) => yScale(d.title) + gHeight + 8)
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .style("font-weight", "500")
            .attr("fill", "var(--data-exp-purposes)")
            .text((d) =>
                d.value >= 1000000
                    ? Math.trunc(d.value / 1000000) + "M"
                    : d.value
            );

        const labelTitle = svgChart
            .selectAll("foreignObject")
            .data(data)
            .enter()
            .append("foreignObject")
            .attr("x", 0)
            .attr("y", (d) => yScale(d.title) + gHeight)
            .attr("width", width)
            .attr("height", 42);
        const labelTitleDiv = labelTitle.append("xhtml:div");
        const labelTitleP = labelTitleDiv
            .append("p")
            .text((d) => d.title)
            .attr("height", "32px")
            .style("margin", "0")
            .style("display", "inline-block")
            .style("font-size", fontSize)
            .style(
                "padding",
                labelTitlePadding.top + "px " + labelTitlePadding.left + "px"
            )
            .style("color", "var(--color-dark)")
            .style("border-radius", "16px")
            .style("border", "solid 1px var(--color-dark)")
            .style("background-color", "var(--color-background-light)");
        const labelTitleWidth = labelTitleP.node().getBoundingClientRect()
            .width;
        labelTitleDiv.attr("width", labelTitleWidth).attr("height", "32px");

        const valueLines = svgChart
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        valueLines
            .append("line")
            .attr("x1", xScale(maxValue))
            .attr("y1", margin.top / 2)
            .attr("x2", xScale(maxValue))
            .attr("y2", height - margin.bottom)
            .style("stroke", "var(--data-exp-purposes)")
            .style("stroke-width", 2);
        valueLines
            .append("line")
            .attr("x1", xScale(averageValue))
            .attr("y1", margin.top / 2)
            .attr("x2", xScale(averageValue))
            .attr("y2", height - margin.bottom)
            .style("stroke", "var(--data-exp-purposes)")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5, 5");
        const legendTitle = svgChart
            .append("foreignObject")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", legendWidth)
            .attr("height", legendHeight);
        legendTitle
            .append("xhtml:div")
            .attr("x", 0)
            .attr("y", 0)
            .html("Number of mentions")
            .style("font-size", "12px")
            .style("color", "var(--color-text-dark)")
            .style("font-weight", "500");

        const averageValueLegend = svgChart
            .append("foreignObject")
            .attr("x", xScale(averageValue) - legendWidth / 2)
            .attr("y", 20)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .append("xhtml:div")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("justify-content", "center");
        averageValueLegend
            .append("p")
            .text(
                averageValue >= 1000000
                    ? Math.trunc(averageValue / 1000000) + "M"
                    : Math.trunc(averageValue)
            )
            .style("font-size", "12px")
            .style("color", "var(--color-text-dark)")
            .style("margin", 0)
            .style("text-align", "center")
            .style("font-weight", "500")
            .style("line-height", "14.4px");
        averageValueLegend
            .append("p")
            .html("Average")
            .style("font-size", "12px")
            .style("color", "var(--color-text-dark)")
            .style("margin", 0)
            .style("text-align", "center")
            .style("font-weight", "400")
            .style("line-height", "14.4px");

        const maxValueLegend = svgChart
            .append("foreignObject")
            .attr("x", xScale(maxValue) - legendWidth / 2)
            .attr("y", 20)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .append("xhtml:div")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("justify-content", "center");
        maxValueLegend
            .append("p")
            .text(
                maxValue >= 1000000
                    ? Math.trunc(maxValue / 1000000) + "M"
                    : maxValue
            )
            .style("font-size", "12px")
            .style("color", "var(--color-text-dark)")
            .style("margin", 0)
            .style("text-align", "center")
            .style("font-weight", "400")
            .style("line-height", "14.4px");
        maxValueLegend
            .append("p")
            .html("Maximum")
            .style("font-size", "12px")
            .style("color", "var(--color-text-dark)")
            .style("margin", 0)
            .style("text-align", "center")
            .style("font-weight", "500")
            .style("line-height", "14.4px");
    }

    useEffect(render, [data]);

    return <div ref={svgBarRef}></div>;
};

export default BarChart;
