import React, { useRef, useEffect } from "react";
import { DONUT_CHART } from "../../constants";
import * as d3 from "d3";

const DonutChart = ({ data, message }) => {
    // Beginning of the constants section
    const svgCanvas = useRef();
    const screenSizes = {
        smallScreen: "smallScreen",
        normalScreen: "normalScreen",
        bigScreen: "bigScreen",
    };
    const messageConfig = {
        x: -76,
        y: -100,
        width: 152,
        height: 200,
    };
    const canvasConfig = {
        [screenSizes.smallScreen]: {
            resolution: 600,
            rightMargin: 16,
        },
        [screenSizes.normalScreen]: {
            resolution: 650,
            rightMargin: 16,
        },
        [screenSizes.bigScreen]: {
            resolution: 650,
            rightMargin: 5,
        },
    };

    const darkColor = "#0f1938";
    const lightColor = "#f7fafc";
    const classNameLabels = "labels";
    const classNameLabelsUp = "up";
    const classNameLabelsRight = "right";
    const classNameLabelsDown = "down";
    const classNameLabelsLeft = "left";
    const labelsSelector = `.${classNameLabels}`;
    const labelsUpSelector = `.${classNameLabels}.${classNameLabelsUp}`;
    const labelsRightSelector = `.${classNameLabels}.${classNameLabelsRight}`;
    const labelsDownSelector = `.${classNameLabels}.${classNameLabelsDown}`;
    const labelsLeftSelector = `.${classNameLabels}.${classNameLabelsLeft}`;
    const classNameGroupLabels = "groupLabels";
    const groupLabelsSelector = `.${classNameGroupLabels}`;
    const classNameLineLabels = "lineLabel";
    const lineLabelsSelector = `.${classNameLineLabels}`;
    const lineLabelsUpSelector = `.${classNameLineLabels} .${classNameLabelsUp}`;
    const lineLabelsRightSelector = `.${classNameLineLabels} .${classNameLabelsRight}`;
    const lineLabelsDownSelector = `.${classNameLineLabels} .${classNameLabelsDown}`;
    const lineLabelsLeftSelector = `.${classNameLineLabels} .${classNameLabelsLeft}`;
    const classNameLineGroups = "lineGroup";
    const lineGroupsSelector = `.${classNameLineGroups}`;
    const classNameMessage = "centralMessage";
    const messageSelector = `.${classNameMessage}`;
    const pathSelector = "path";
    const fontConfig = {
        fontFamily: "'Jost'",
        fontSize: "20px",
        fontWeight: 600,
        lineHeight: "normal",
        textAlign: "center",
    };
    const labelsConfig = {
        width: 100,
        height: 90,
    };
    const groupLabelsConfig = {
        width: 100,
        height: 90,
    };

    const sections = {
        up: "up",
        right: "right",
        down: "down",
        left: "left",
    };
    const lineCorrection = 1.2;
    // End of the constants section

    function _distrubuteLabels(arcs, labelsArc, screenSize) {
        const { outerRadius } = _getMesures(screenSize);
        const up = [];
        const right = [];
        const down = [];
        const left = [];
        const sortOnX = (data1, data2) => {
            const coord1 = labelsArc.centroid(data1);
            const coord2 = labelsArc.centroid(data2);

            return coord1[0] - coord2[0];
        };
        const sortOnY = (data1, data2) => {
            const coord1 = labelsArc.centroid(data1);
            const coord2 = labelsArc.centroid(data2);

            return coord1[1] - coord2[1];
        };

        for (const data of arcs) {
            const coord = labelsArc.centroid(data);

            if (coord[1] < outerRadius * -1) {
                up.push(data);
            } else if (coord[1] > outerRadius) {
                down.push(data);
            } else if (coord[0] > outerRadius) {
                right.push(data);
            } else {
                left.push(data);
            }
        }

        up.sort(sortOnX);
        down.sort(sortOnX);
        left.sort(sortOnY);
        right.sort(sortOnY);

        return { up, right, down, left };
    }

    function _getRootSvg(screenSize) {
        const { half } = _getMesures(screenSize);
        const { resolution, rightMargin } = canvasConfig[screenSize];
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
                .attr("viewBox", `0 0 ${resolution} ${resolution}`)
                .append("g")
                .attr("transform", `translate(${half - rightMargin}, ${half})`);
        }

        return root;
    }

    function _getMesures(screenSize) {
        return {
            outerRadius: canvasConfig[screenSize].resolution / 4.5,
            innerRadius: canvasConfig[screenSize].resolution / 7,
            half: canvasConfig[screenSize].resolution / 2,
        };
    }

    function _processData() {
        if (data) {
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
        } else {
            return { chartData: [], groupsInfo: [] };
        }
    }

    function _calculateArcsArea(chartData, groupsInfo, screenSize) {
        const { outerRadius, innerRadius } = _getMesures(screenSize);
        const labelOffset = outerRadius * 1.35;
        const groupLabelsOffset = labelOffset * 1.45;
        const pie = d3
            .pie()
            .sort(null)
            .value((d) => d.value);
        const arcs = pie(chartData);
        const groupArcs = pie(groupsInfo);
        const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
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
        d3.selectAll(lineLabelsSelector).remove();
        d3.select(messageSelector).remove();
    }

    function _calculateDataMaps(
        plotArea,
        arcs,
        groupArcs,
        labelsArc,
        screenSize
    ) {
        const { up, right, down, left } = _distrubuteLabels(
            arcs,
            labelsArc,
            screenSize
        );
        const mapGraphParts = plotArea.selectAll(pathSelector).data(arcs);
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

        const mapLineLabelsUp = plotArea
            .selectAll(lineLabelsUpSelector)
            .data(up);
        const mapLabelsUp = plotArea.selectAll(labelsUpSelector).data(up);
        const mapLineLabelsRight = plotArea
            .selectAll(lineLabelsRightSelector)
            .data(right);
        const mapLabelsRight = plotArea
            .selectAll(labelsRightSelector)
            .data(right);
        const mapLineLabelsDown = plotArea
            .selectAll(lineLabelsDownSelector)
            .data(down);
        const mapLabelsDown = plotArea.selectAll(labelsDownSelector).data(down);
        const mapLineLabelsLeft = plotArea
            .selectAll(lineLabelsLeftSelector)
            .data(left);
        const mapLabelsLeft = plotArea.selectAll(labelsLeftSelector).data(left);

        return {
            mapGraphParts,
            mapLineLabelsUp,
            mapLineLabelsRight,
            mapLineLabelsDown,
            mapLineLabelsLeft,
            mapLineGroup,
            mapLabelsGroup,
            mapLabelsUp,
            mapLabelsRight,
            mapLabelsDown,
            mapLabelsLeft,
            exitAndClean: () => {
                mapGraphParts.exit().remove();
                mapLineLabelsUp.exit().remove();
                mapLineLabelsRight.exit().remove();
                mapLineLabelsDown.exit().remove();
                mapLineLabelsLeft.exit().remove();
                mapLineGroup.exit().remove();
                mapLabelsGroup.exit().remove();
                mapLabelsUp.exit().remove();
                mapLabelsRight.exit().remove();
                mapLabelsDown.exit().remove();
                mapLabelsLeft.exit().remove();
            },
        };
    }

    function _drawLabels(labels) {
        const textSpaces = labels
            .append("xhtml:div")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("width", `${labelsConfig.width}px`)
            .style("height", `${labelsConfig.height}px`)
            .append("xhtml:span")
            .merge(labels)
            .style("background-color", "transparent");

        textSpaces
            .append("xhtml:p")
            .style("color", darkColor)
            .style("text-align", fontConfig.textAlign)
            .style("font-size", fontConfig.fontSize)
            .style("font-family", fontConfig.fontFamily)
            .style("line-height", fontConfig.lineHeight)
            .style("font-weight", fontConfig.fontWeight)
            .text((d) => `${d.data.name}:`);
        textSpaces
            .append("xhtml:p")
            .style("color", darkColor)
            .style("text-align", fontConfig.textAlign)
            .style("font-size", fontConfig.fontSize)
            .style("font-family", fontConfig.fontFamily)
            .style("line-height", fontConfig.lineHeight)
            .style("font-weight", fontConfig.fontWeight)
            .style("line-height", "0px")
            .text((d) => d.data.value);
    }

    function _getsIdName(d) {
        return d.data.name.replace(/\s/g, "_");
    }

    function _getsCoordTransfrom(translate) {
        return translate
            .replace(/translate\(/, "")
            .replace(/\)/, "")
            .split(",")
            .map((coord) => Number(coord));
    }

    function _drawLinesLabelsOnYAxis(linesLabels, arc, labelsArc, section) {
        linesLabels
            .enter()
            .append("polyline")
            .merge(linesLabels)
            .transition()
            .duration(1000)
            .attr("stroke", darkColor)
            .attr("class", `${classNameLineLabels} ${classNameLabelsUp}`)
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr("points", (d) => {
                const pointA = arc
                    .centroid(d)
                    .map((coord) => coord * lineCorrection);
                const pointB = labelsArc.centroid(d);
                const pointC = _getsCoordTransfrom(
                    d3.select(`#${_getsIdName(d)}`).attr("transform")
                );

                pointC[0] += labelsConfig.width / 2;

                if (section === sections.up) {
                    pointC[1] += labelsConfig.height;
                }

                return [pointA, pointB, pointC];
            });
    }

    function _drawLinesLabelsOnXAxis(linesLabels, arc, section) {
        linesLabels
            .enter()
            .append("line")
            .merge(linesLabels)
            .transition()
            .duration(1000)
            .attr("class", `${classNameLineLabels} ${classNameLabelsRight}`)
            .attr("stroke", darkColor)
            .attr("stroke-width", 1)
            .attr("x1", (d) => {
                const point = arc.centroid(d);
                return point[0] * lineCorrection;
            })
            .attr("y1", (d) => {
                const point = arc.centroid(d);
                return point[1] * lineCorrection;
            })
            .attr("x2", (d) => {
                const point = _getsCoordTransfrom(
                    d3.select(`#${_getsIdName(d)}`).attr("transform")
                );

                return section === sections.left
                    ? point[0] + labelsConfig.width
                    : point[0];
            })
            .attr("y2", (d) => {
                const point = _getsCoordTransfrom(
                    d3.select(`#${_getsIdName(d)}`).attr("transform")
                );

                return point[1] + labelsConfig.height / 2;
            });
    }

    function calculateScreenSize(screenWidth) {
        if (screenWidth <= 320) {
            return screenSizes.smallScreen;
        } else if (screenWidth <= 413) {
            return screenSizes.normalScreen;
        } else {
            return screenSizes.bigScreen;
        }
    }

    function buildPieChart(screenSize) {
        const { chartData, groupsInfo } = _processData();
        const { half } = _getMesures(screenSize);

        const colors = d3
            .scaleOrdinal()
            .domain(groupsInfo.map(({ name }) => name))
            .range(groupsInfo.map(({ color }) => color));
        const plotArea = _getRootSvg(screenSize);
        const { arcs, groupArcs, arc, labelsArc, groupLabelsArc } =
            _calculateArcsArea(chartData, groupsInfo, screenSize);

        _cleanLabels();
        const {
            mapGraphParts,
            mapLineLabelsUp,
            mapLineLabelsRight,
            mapLineLabelsDown,
            mapLineLabelsLeft,
            mapLineGroup,
            mapLabelsGroup,
            mapLabelsUp,
            mapLabelsRight,
            mapLabelsDown,
            mapLabelsLeft,
            exitAndClean,
        } = _calculateDataMaps(
            plotArea,
            arcs,
            groupArcs,
            labelsArc,
            screenSize
        );

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
                return point[0] > 0
                    ? point[0] - groupLabelsConfig.width / 2
                    : point[0] + groupLabelsConfig.width / 2;
            })
            .attr("y1", (d) => {
                const point = groupLabelsArc.centroid(d);
                return point[1];
            })
            .attr("x2", (d) => {
                const point = arc.centroid(d);

                return point[0] * lineCorrection;
            })
            .attr("y2", (d) => {
                const point = arc.centroid(d);

                return point[1] * lineCorrection;
            });

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

        const labelsUp = mapLabelsUp
            .enter()
            .append("foreignObject")
            .style("width", labelsConfig.width)
            .style("height", labelsConfig.height)
            .attr("id", (d) => _getsIdName(d))
            .attr("class", `${classNameLabels} ${classNameLabelsUp}`)
            .attr("transform", (d, index, list) => {
                const halfPoint = Math.ceil(list.length / 2);
                const coordY = -half;
                const coordX = labelsConfig.width * (index - halfPoint);
                return `translate(${coordX}, ${coordY})`;
            });

        const labelsRight = mapLabelsRight
            .enter()
            .append("foreignObject")
            .style("width", labelsConfig.width)
            .style("height", labelsConfig.height)
            .attr("id", (d) => _getsIdName(d))
            .attr("class", `${classNameLabels} ${classNameLabelsRight}`)
            .attr("transform", (d, index, list) => {
                const halfPoint = Math.ceil(list.length / 2);
                const coordX = half - labelsConfig.width * 1.5;
                const coordY = labelsConfig.height * (index - halfPoint);
                return `translate(${coordX}, ${coordY})`;
            });

        const labelsDown = mapLabelsDown
            .enter()
            .append("foreignObject")
            .style("width", labelsConfig.width)
            .style("height", labelsConfig.height)
            .attr("id", (d) => _getsIdName(d))
            .attr("class", `${classNameLabels} ${classNameLabelsRight}`)
            .attr("transform", (d, index, list) => {
                const halfPoint = Math.ceil(list.length / 2);
                const coordY = half - labelsConfig.height;
                const coordX = labelsConfig.width * (index - halfPoint);

                return `translate(${coordX}, ${coordY})`;
            });

        const labelsLeft = mapLabelsLeft
            .enter()
            .append("foreignObject")
            .style("width", labelsConfig.width)
            .style("height", labelsConfig.height)
            .attr("id", (d) => _getsIdName(d))
            .attr("class", `${classNameLabels} ${classNameLabelsLeft}`)
            .attr("transform", (d, index, list) => {
                const halfPoint = Math.ceil(list.length / 2);
                const coordX = -half + labelsConfig.width / 2;
                const coordY = labelsConfig.height * (index - halfPoint);

                return `translate(${coordX}, ${coordY})`;
            });
        const messageArea = plotArea
            .append("foreignObject")
            .attr("class", classNameMessage)
            .attr("x", messageConfig.x)
            .attr("y", messageConfig.y)
            .attr("width", messageConfig.width)
            .attr("height", messageConfig.height);

        mapGraphParts
            .enter()
            .append("path")
            .merge(mapGraphParts)
            .transition()
            .duration(1000)
            .attr("fill", (d) => colors(d.data.group))
            .attr("stroke", lightColor)
            .attr("d", arc);

        _drawLabels(labelsUp);
        _drawLabels(labelsRight);
        _drawLabels(labelsDown);
        _drawLabels(labelsLeft);

        _drawLinesLabelsOnYAxis(mapLineLabelsUp, arc, labelsArc, sections.up);
        _drawLinesLabelsOnYAxis(
            mapLineLabelsDown,
            arc,
            labelsArc,
            sections.down
        );
        _drawLinesLabelsOnXAxis(mapLineLabelsRight, arc, sections.right);
        _drawLinesLabelsOnXAxis(mapLineLabelsLeft, arc, sections.left);

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
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("width", `${messageConfig.width}px`)
            .style("height", `${messageConfig.height}px`)
            .append("xhtml:span")
            .transition()
            .duration(1000)
            .style("color", darkColor)
            .style("text-align", fontConfig.textAlign)
            .style("background-color", "transparent")
            .style("font-size", fontConfig.fontSize)
            .style("font-family", fontConfig.fontFamily)
            .style("line-height", fontConfig.lineHeight)
            .style("font-weight", fontConfig.fontWeight)
            .text(message);

        exitAndClean();
    }

    useEffect(() => {
        const screenWidth = window.innerWidth;
        buildPieChart(calculateScreenSize(screenWidth));
    }, [data]);
    return <div ref={svgCanvas}></div>;
};

export default DonutChart;
