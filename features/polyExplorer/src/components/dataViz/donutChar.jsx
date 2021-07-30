import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const DonutChart = ({ size, data, message }) => {
    const svgCanvas = useRef();

    function getRootSvg() {
        return d3.select(svgCanvas.current);
    }

    function buildPieChart() {
        const forth = size / 4;
        const eighth = size / 6;
        const half = size / 2;
        const chartData = data.reduce((acc, group) => {
            const info = Object.keys(group.attributes).map((key) => ({
                group: group.groupName,
                name: key,
                value: group.attributes[key],
                groupLabel: false,
            }));
            const indexGroupLabel = Math.ceil(info.length / 2) - 1;
            info[indexGroupLabel].groupLabel = true;

            return [...acc, ...info];
        }, []);
        const groupsName = data.map((group) => group.groupName);

        const colors = d3
            .scaleOrdinal()
            .domain(groupsName)
            .range(["#3BA6FF", "#3749A9"]);
        const labelOffset = forth * 1.5;
        const root = getRootSvg();
        const char = root
            .append("svg")
            .style("width", "100%")
            .style("height", 400)
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

        plotArea
            .selectAll("line")
            .data(arcs)
            .enter()
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", (d) => {
                const point = labelsArc.centroid(d);

                return point[0];
            })
            .attr("y1", (d) => {
                const point = labelsArc.centroid(d);
                return point[1];
            })
            .attr("x2", (d) => {
                const point = arc.centroid(d);

                return point[0] * 1.2;
            })
            .attr("y2", (d) => {
                const point = arc.centroid(d);

                return point[1] * 1.2;
            });

        const labelsGroup = plotArea
            .selectAll(".groupLabels")
            .data(arcs)
            .enter()
            .append("text")
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("font-size", "20px")
            .attr("transform", (d) => {
                const point = labelsArc.centroid(d);
                point[1] = point[1] * 2;
                return `translate(${point})`;
            });

        const labels = plotArea
            .selectAll(".labels")
            .data(arcs)
            .enter()
            .append("foreignObject")
            .style("width", 100)
            .style("height", 50)
            .attr("transform", (d) => {
                const point = labelsArc.centroid(d);
                if (point[0] > 0) {
                    point[0] = point[0] * 0.75;
                } else {
                    point[0] = point[0] * 1.4;
                }

                if (point[1] < 0) {
                    point[1] = point[1] * 1.2;
                }
                return `translate(${point})`;
            });

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
            .attr("fill", (d) => colors(d.data.group))
            .attr("stroke", "white")
            .attr("d", arc);

        labels
            .append("xhtml:div")
            .style("color", "black")
            .style("text-align", "center")
            .style("font-size", "20px")
            .style("font-family", "'Jost'")
            .style("line-height", "120%")
            .style("font-weight", 600)
            .style("background-color", "white")
            .text((d) => `${d.data.name}: ${d.data.value}`);

        labelsGroup
            .append("tspan")
            .attr("y", "-0.6em")
            .attr("x", 0)
            .style("line-height", "120%")
            .style("letter-spacing", "-0.01em")
            .style("font-weight", "600")
            .text((d) =>
                d.data.groupLabel && d.data.group !== "default"
                    ? d.data.group
                    : ""
            );

        messageArea
            .append("xhtml:div")
            .style("color", "black")
            .style("text-align", "center")
            .style("position", "relative")
            .style("top", "25%")
            .style("font-size", "20px")
            .style("font-family", "'Jost'")
            .style("line-height", "120%")
            .style("font-weight", 600)
            .text(message);
    }

    useEffect(buildPieChart, []);
    return <div ref={svgCanvas}></div>;
};

export default DonutChart;
