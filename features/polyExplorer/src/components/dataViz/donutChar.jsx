import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import "./donutChar.css";
const DonutChart = ({ size, data, message }) => {
    const svgCanvas = useRef();

    function getRootSvg() {
        return d3.select(svgCanvas.current);
    }

    function buildPieChart() {
        const forth = size / 4;
        const eighth = size / 6;
        const half = size / 2;
        // const chartData = data.reduce((acc, group) => {
        //     const info = Object.keys(group.attributes).map((key) => ({
        //         name: key,
        //         value: group.attributes[key],
        //     }));

        //     return [...acc, ...info];
        // }, []);
        const chartData = data.map((group) => {
            const name = group.groupName;
            const value = Object.values(group.attributes).reduce(
                (acc, value) => acc + value,
                0
            );

            return {
                name,
                value,
            };
        });
        const colors = d3
            .scaleOrdinal()
            .domain(chartData.map((d) => d.name))
            .range(["#3BA6FF", "#3749A9"]);
        const labelOffset = forth * 1.6;
        const root = getRootSvg();
        const char = root
            .append("svg")
            .style("width", "100%")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
            .attr("viewBox", `0 0 ${size} ${size}`);
        const plotArea = char
            .append("g")
            .attr("transform", `translate(${half}, ${half})`);
        const pie = d3
            .pie()
            .sort(null)
            .value((d) => d.value);
        const arcs = pie(chartData);
        const arc = d3.arc().innerRadius(eighth).outerRadius(forth);
        const labelsArc = d3
            .arc()
            .innerRadius(labelOffset)
            .outerRadius(labelOffset);

        const labels = plotArea
            .selectAll("text")
            .data(arcs)
            .enter()
            .append("text")
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("font-size", "20px")
            .attr("transform", (d) => `translate(${labelsArc.centroid(d)})`);

        const messageArea = plotArea
            .append("foreignObject")
            .attr("x", -75)
            .attr("y", -75)
            .attr("width", 150)
            .attr("height", 150);

        plotArea
            .selectAll("path")
            .data(arcs)
            .enter()
            .append("path")
            .attr("fill", (d) => colors(d.data.name))
            .attr("stroke", "white")
            .attr("d", arc);

        labels
            .append("tspan")
            .attr("y", "-0.6em")
            .attr("x", 0)
            .style("line-height", "120%")
            .style("letter-spacing", "-0.01em")
            .style("font-weight", "600")
            .text((d) => `${d.data.name}:${d.data.value}`);

        plotArea
            .selectAll("line")
            .data(arcs)
            .enter()
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", (d) => {
                const point = labelsArc.centroid(d);
                let result = point[0];

                if (point[1] > 0) {
                    result = result * 0.8;
                }

                return result;
            })
            .attr("y1", (d) => {
                const point = labelsArc.centroid(d);
                let result = point[1];
                if (point[1] > 0) {
                    result = result * 0.8;
                }
                return result;
            })
            .attr("x2", (d) => {
                const point = arc.centroid(d);

                return point[0] * 1.2;
            })
            .attr("y2", (d) => {
                const point = arc.centroid(d);

                return point[1] * 1.2;
            });

        messageArea
            .append("xhtml:div")
            .attr("class", "donut-message")
            .text(message);
    }

    useEffect(buildPieChart, []);
    return <div ref={svgCanvas}></div>;
};

export default DonutChart;
