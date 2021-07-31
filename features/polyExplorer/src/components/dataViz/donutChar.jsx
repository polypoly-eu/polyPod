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
            }));

            return [...acc, ...info];
        }, []);
        const groupsInfo = data.map((group) => {
            const totalValue = Object.values(group.attributes).reduce(
                (acc, current) => acc + current,
                0
            );

            return {
                name: group.groupName,
                value: totalValue,
                color: group.color,
                labelCorrection: group.groupLabelCorrection,
            };
        });

        const colors = d3
            .scaleOrdinal()
            .domain(groupsInfo.map(({ name }) => name))
            .range(groupsInfo.map(({ color }) => color));
        const labelOffset = forth * 1.3;
        const groupLabelsOffset = labelOffset * 1.2;
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
        const groupArcs = pie(groupsInfo);
        const arc = d3.arc().innerRadius(eighth).outerRadius(forth);
        const labelsArc = d3
            .arc()
            .innerRadius(labelOffset)
            .outerRadius(labelOffset);
        const groupLabelsArc = d3
            .arc()
            .innerRadius(groupLabelsOffset)
            .outerRadius(groupLabelsOffset);

        plotArea
            .selectAll(".lineLabel")
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

        plotArea
            .selectAll(".lineGroup")
            .data(groupArcs.filter((d) => d.data.name !== "default"))
            .enter()
            .append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", (d) => {
                const point = groupLabelsArc.centroid(d);
                return point[0] * d.data.labelCorrection.x;
            })
            .attr("y1", (d) => {
                const point = groupLabelsArc.centroid(d);
                return point[1] * d.data.labelCorrection.y;
            })
            .attr("x2", "0")
            .attr("y2", "0");

        const labelsGroup = plotArea
            .selectAll(".groupLabels")
            .data(groupArcs.filter((d) => d.data.name !== "default"))
            .enter()
            .append("foreignObject")
            .style("width", 100)
            .style("height", 50)
            .attr("transform", (d) => {
                const point = groupLabelsArc.centroid(d);
                point[0] = point[0] * d.data.labelCorrection.x;
                point[1] = point[1] * d.data.labelCorrection.y;

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
            .attr("x", -85)
            .attr("y", -85)
            .attr("width", 170)
            .attr("height", 200);

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
            .append("xhtml:div")
            .style("color", "white")
            .style("text-align", "center")
            .style("font-size", "20px")
            .style("font-family", "'Jost'")
            .style("line-height", "120%")
            .style("font-weight", 600)
            .style("background-color", (d) => d.data.color)
            .text((d) => `${d.data.name}: ${d.data.value}`);

        messageArea
            .append("xhtml:div")
            .style("color", "black")
            .style("text-align", "center")
            .style("position", "relative")
            .style("background-color", "white")
            .style("padding", "0px 10px")
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
