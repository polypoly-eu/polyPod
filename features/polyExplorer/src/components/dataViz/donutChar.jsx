import React, { useRef, useEffect } from "react";
import { DONUT_CHART } from "../../constants";
import * as d3 from "d3";

const DonutChart = ({ size, data, message }) => {
    const svgCanvas = useRef();
    const forth = size / 4;
    const eighth = size / 6;
    const half = size / 2;
    const messageConfig = {
        x: -76,
        y: -85,
        width: 152,
        height: 200,
        id: "donut-msg",
    };
    const darkColor = "#0f1938";
    const lightColor = "#f7fafc";
    const classNameLabels = "labels";
    const labelsSelector = `.${classNameLabels}`;
    const classNameGroupLabels = "groupLabels";
    const groupLabelsSelector = `.${classNameGroupLabels}`;
    const classNameLineLabels = "lineLabel";
    const lineLabelsSelector = `.${classNameLineLabels}`;
    const classNameLineGroups = "lineGroup";
    const lineGroupsSelector = `.${classNameLineGroups}`;
    const pathSelector = "path";
    const fontConfig = {
        fontFamily: "'Jost'",
        fontSize: "20px",
        fontWeight: 600,
        lineHeight: "120%",
        textAlign: "center",
    };
    const labelsConfig = {
        width: 100,
        height: 50,
    };
    const groupLabelsConfig = {
        width: 100,
        height: 50,
    };

    function getRootSvg() {
        let root = d3.select(svgCanvas.current).select("svg").select("g");

        if (root.empty()) {
            root = d3
                .select(svgCanvas.current)
                .append("svg")
                .style("width", "100%")
                .style("height", 400)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
                .attr("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
                .attr("viewBox", `0 0 ${size} ${size}`)
                .append("g")
                .attr("transform", `translate(${half}, ${half})`);
        }

        return root;
    }

    function _processData() {
        debugger;
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

        return { chartData, groupsInfo };
    }

    function _calculateArcsArea(chartData, groupsInfo) {
        const labelOffset = forth * 1.35;
        const groupLabelsOffset = labelOffset * 1.15;
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

        return {
            arcs,
            groupArcs,
            arc,
            labelsArc,
            groupLabelsArc,
        };
    }

    function _cleanLabels() {
        d3.selectAll(groupLabelsSelector).remove();
        d3.selectAll(labelsSelector).remove();
    }

    function _calculateDataMaps(plotArea, arcs, groupArcs) {
        const mapGraphParts = plotArea.selectAll(pathSelector).data(arcs);
        const mapLineLabel = plotArea.selectAll(lineLabelsSelector).data(arcs);
        const mapLineGroup = plotArea
            .selectAll(lineGroupsSelector)
            .data(
                groupArcs.filter(
                    (d) => d.data.name !== DONUT_CHART.DEFAULT_GROUP
                )
            );
        const mapLabelsGroup = plotArea
            .selectAll(groupLabelsSelector)
            .data(
                groupArcs.filter(
                    (d) => d.data.name !== DONUT_CHART.DEFAULT_GROUP
                )
            );
        const mapLabels = plotArea.selectAll(labelsSelector).data(arcs);

        return {
            mapGraphParts,
            mapLineLabel,
            mapLineGroup,
            mapLabelsGroup,
            mapLabels,
            exitAndClean: () => {
                mapGraphParts.exit().remove();
                mapLineLabel.exit().remove();
                mapLineGroup.exit().remove();
                mapLabelsGroup.exit().remove();
                mapLabels.exit().remove();
            },
        };
    }

    function buildPieChart() {
        debugger;
        const { chartData, groupsInfo } = _processData();

        const colors = d3
            .scaleOrdinal()
            .domain(groupsInfo.map(({ name }) => name))
            .range(groupsInfo.map(({ color }) => color));
        const plotArea = getRootSvg();
        const {
            arcs,
            groupArcs,
            arc,
            labelsArc,
            groupLabelsArc,
        } = _calculateArcsArea(chartData, groupsInfo);

        _cleanLabels();
        const {
            mapGraphParts,
            mapLineLabel,
            mapLineGroup,
            mapLabelsGroup,
            mapLabels,
            exitAndClean,
        } = _calculateDataMaps(plotArea, arcs, groupArcs);

        mapLineLabel
            .enter()
            .append("line")
            .merge(mapLineLabel)
            .transition()
            .duration(1000)
            .attr("class", classNameLineLabels)
            .attr("stroke", darkColor)
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

        mapLineGroup
            .enter()
            .append("line")
            .merge(mapLineGroup)
            .transition()
            .duration(1000)
            .attr("class", classNameLineGroups)
            .attr("stroke", darkColor)
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

        const labelsGroup = mapLabelsGroup
            .enter()
            .append("foreignObject")
            .style("width", groupLabelsConfig.width)
            .style("height", groupLabelsConfig.height)
            .attr("class", classNameGroupLabels)
            .attr("transform", (d) => {
                const point = groupLabelsArc.centroid(d);
                point[0] = point[0] * d.data.labelCorrection.x;
                point[1] = point[1] * d.data.labelCorrection.y;

                return `translate(${point})`;
            });

        const labels = mapLabels
            .enter()
            .append("foreignObject")
            .style("width", labelsConfig.width)
            .style("height", labelsConfig.height)
            .attr("class", classNameLabels)
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
            .attr("x", messageConfig.x)
            .attr("y", messageConfig.y)
            .attr("width", messageConfig.width)
            .attr("height", messageConfig.height)
            .attr("id", messageConfig.id);

        mapGraphParts
            .enter()
            .append("path")
            .merge(mapGraphParts)
            .transition()
            .duration(1000)
            .attr("fill", (d) => colors(d.data.group))
            .attr("stroke", lightColor)
            .attr("d", arc);

        labels
            .append("xhtml:div")
            .merge(labels)
            .transition()
            .duration(1000)
            .style("color", darkColor)
            .style("text-align", fontConfig.textAlign)
            .style("font-size", fontConfig.fontSize)
            .style("font-family", fontConfig.fontFamily)
            .style("line-height", fontConfig.lineHeight)
            .style("font-weight", fontConfig.fontWeight)
            .style("background-color", "transparent")
            .text((d) => `${d.data.name}: ${d.data.value}`);

        labelsGroup
            .append("xhtml:div")
            .merge(labelsGroup)
            .transition()
            .duration(1000)
            .style("color", lightColor)
            .style("text-align", fontConfig.textAlign)
            .style("font-size", fontConfig.fontSize)
            .style("font-family", fontConfig.fontFamily)
            .style("line-height", fontConfig.lineHeight)
            .style("font-weight", fontConfig.fontWeight)
            .style("background-color", (d) => d.data.color)
            .text((d) => `${d.data.name}: ${d.data.value}`);

        messageArea
            .append("xhtml:div")
            .style("color", darkColor)
            .style("text-align", fontConfig.textAlign)
            .style("position", "relative")
            .style("background-color", lightColor)
            .style("padding", "0px 10px")
            .style("top", "25%")
            .style("font-size", fontConfig.fontSize)
            .style("font-family", fontConfig.fontFamily)
            .style("line-height", fontConfig.lineHeight)
            .style("font-weight", fontConfig.fontWeight)
            .text(message);

        exitAndClean();
    }

    useEffect(buildPieChart, [data]);
    return <div ref={svgCanvas}></div>;
};

export default DonutChart;
