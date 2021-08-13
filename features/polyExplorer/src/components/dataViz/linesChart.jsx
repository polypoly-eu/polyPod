import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import "./linesChart.css";

const LinesChart = ({ data }) => {
    const svgCanvas = useRef();
    const semiDarkColor = "#8d9caf";
    const yLabelsPosition = "-0.40em";
    const correctionYAxisSize = 10;
    const correctionYAxisLabels = 20;
    const screenSizes = {
        smallScreen: "smallScreen",
        normalScreen: "normalScreen",
        bigScreen: "bigScreen",
    };

    const canvasConfig = {
        [screenSizes.smallScreen]: {
            resolution: 300,
            rightMargin: 16,
            leftMargin: 35,
            topMargin: 16,
            bottomMargin: 16,
        },
        [screenSizes.normalScreen]: {
            resolution: 650,
            rightMargin: 16,
            leftMargin: 16,
            topMargin: 16,
            bottomMargin: 16,
        },
        [screenSizes.bigScreen]: {
            resolution: 650,
            rightMargin: 16,
            leftMargin: 16,
            topMargin: 16,
            bottomMargin: 16,
        },
    };

    const [scaleX, updateScaleX] = useState(null);
    const [scaleY, updateScaleY] = useState(null);

    // function _getMesures(screenSize) {
    //     return {
    //         half: canvasConfig[screenSize].resolution / 2,
    //     };
    // }

    function _getIdName(id) {
        return id.replace(/\s/g, "_");
    }

    function _calculateScaleX(screenSize) {
        const { resolution, leftMargin, rightMargin } = canvasConfig[
            screenSize
        ];
        const listOfDates = [data.rangeDates[0]];

        while (
            listOfDates[listOfDates.length - 1].getTime() <
            data.rangeDates[1].getTime()
        ) {
            const lastDate = listOfDates[listOfDates.length - 1];
            const day = lastDate.getDate();
            const month = lastDate.getMonth();
            const year = lastDate.getFullYear();

            listOfDates.push(new Date(year + 1, month, day));
        }

        return d3
            .scaleTime()
            .domain(
                d3.extent(listOfDates, (jsDate) =>
                    d3.timeParse("%Y-%m-%d")(
                        `${jsDate.getFullYear()}-${
                            jsDate.getMonth() + 1
                        }-${jsDate.getDate()}`
                    )
                )
            )
            .range([0, resolution - leftMargin - rightMargin]);
    }

    function _calculateScaleY(screenSize) {
        const { resolution, topMargin } = canvasConfig[screenSize];

        return d3
            .scaleLinear()
            .domain(data.rangeY)
            .range([resolution - topMargin, 0]);
    }

    function _getScaleX(screenSize) {
        if (scaleX) {
            return scaleX;
        } else {
            let x = _calculateScaleX(screenSize);
            updateScaleX(x);
            return x;
        }
    }

    function _getScaleY(screenSize) {
        if (scaleY) {
            return scaleY;
        } else {
            let y = _calculateScaleY(screenSize);
            updateScaleY(y);
            return y;
        }
    }

    function _getRoot(screenSize) {
        const { resolution } = canvasConfig[screenSize];
        let root = d3.select(svgCanvas.current).select("svg");

        if (root.empty()) {
            root = d3
                .select(svgCanvas.current)
                .append("svg")
                .style("width", "100%")
                .style("height", 400)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
                .attr("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
                .attr("viewBox", `0 0 ${resolution} ${resolution}`);
        }

        return root;
    }

    function calculateScreenSize() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 320) {
            return screenSizes.smallScreen;
        } else if (screenWidth <= 413) {
            return screenSizes.normalScreen;
        } else {
            return screenSizes.bigScreen;
        }
    }

    function calculateXAxis(screenSize) {
        const { resolution, leftMargin } = canvasConfig[screenSize];
        const root = _getRoot(screenSize);
        const x = _getScaleX(screenSize);

        root.append("g")
            .attr("transform", `translate(${leftMargin}, ${resolution})`)
            .attr("id", "x-axis")
            .call(
                d3
                    .axisBottom(x)
                    .ticks(d3.timeMonth.every(6))
                    .tickFormat((d) =>
                        d <= d3.timeYear(d) ? d.getFullYear() : null
                    )
            );

        root.select("#x-axis")
            .select("path")
            .style("stroke-dasharray", "1,2")
            .style("stroke-width", "3");
        root.select("#x-axis")
            .selectAll(".tick")
            .selectAll("line")
            .style("stroke-width", "1");
    }

    function calculateYAxis(screenSize) {
        const { resolution, topMargin, leftMargin, rightMargin } = canvasConfig[
            screenSize
        ];
        const root = _getRoot(screenSize);

        const y = _getScaleY(screenSize);

        const yAxis = root
            .append("g")
            .attr("id", "y-axis")
            .attr(
                "transform",
                `translate(${resolution - rightMargin}, ${topMargin})`
            )
            .call(
                d3
                    .axisLeft(y)
                    .ticks(2)
                    .tickSizeOuter(0)
                    .tickSize(
                        resolution -
                            leftMargin -
                            rightMargin +
                            correctionYAxisSize
                    )
            );

        yAxis
            .selectAll(".tick")
            .selectAll("line")
            .attr("stroke", semiDarkColor);

        yAxis
            .selectAll(".tick")
            .selectAll("text")
            .attr("dy", yLabelsPosition)
            .attr("x", function xCorrection() {
                const currentX = Number(d3.select(this).attr("x"));
                return currentX + correctionYAxisLabels;
            });

        d3.select(yAxis.selectAll(".tick").node()).style(
            "visibility",
            "hidden"
        );

        yAxis.select(".domain").style("visibility", "hidden");
    }

    function createLinearGradient(color, groupName, screenSize) {
        const root = _getRoot(screenSize);
        const gradient = root
            .append("linearGradient")
            .attr("id", _getIdName(groupName))
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient
            .append("stop")
            .attr("offset", "0%")
            .style("stop-color", color)
            .style("stop-opacity", 1);
        gradient
            .append("stop")
            .attr("offset", "100%")
            .style("stop-color", color)
            .style("stop-opacity", 0);
    }

    function drawArea(lineIndex, groupName, screenSize) {
        const { resolution, leftMargin } = canvasConfig[screenSize];
        const root = _getRoot(screenSize);
        const x = _getScaleX(screenSize);
        const y = _getScaleY(screenSize);
        const groupData = data.groups.find(
            (group) => _getIdName(group.groupName) === groupName
        );
        const points = groupData.lines[lineIndex].points;

        const area = d3
            .area()
            .x((d) => {
                const date = `${d.x.getFullYear()}-${d.x.getMonth()}-${d.x.getDate()}`;
                const d3Date = d3.timeParse("%Y-%m-%d")(date);
                const point = x(d3Date);

                return point + leftMargin + 3;
            })
            .y0(resolution)
            .y1((d) => {
                const point = y(d.y);
                return point;
            });

        const path = root
            .append("path")
            .datum(points)
            .attr("class", "gradient-area")
            .attr("fill", `url(#${groupName})`)
            .attr("stroke", "none")
            .attr("group", _getIdName(groupName))
            .attr("d", area);

        path.node().addEventListener("click", onClickPath);
    }

    function drawLine(points, color, groupName, lineIndex, screenSize) {
        const { leftMargin } = canvasConfig[screenSize];
        const root = _getRoot(screenSize);
        const x = _getScaleX(screenSize);
        const y = _getScaleY(screenSize);

        const path = root
            .append("path")
            .datum(points)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("group", _getIdName(groupName))
            .attr("line-index", lineIndex)
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => {
                        const date = `${d.x.getFullYear()}-${
                            d.x.getMonth() + 1
                        }-${d.x.getDate()}`;
                        const d3Date = d3.timeParse("%Y-%m-%d")(date);
                        const point = x(d3Date);

                        return point + leftMargin;
                    })
                    .y((d) => {
                        const point = y(d.y);

                        return point;
                    })
            );

        path.node().addEventListener("click", onClickPath);
    }

    function drawLines(screenSize) {
        for (const group of data.groups) {
            createLinearGradient(group.color, group.groupName, screenSize);
            const leng = group.lines.length;

            for (let i = 0; i < leng; i++) {
                drawLine(
                    group.lines[i].points,
                    group.color,
                    group.groupName,
                    i,
                    screenSize
                );
            }
        }
    }

    function deactivatePaths(origin) {
        console.log("NNN Origin: ", origin);
        const root = d3.select(svgCanvas.current).select("svg");
        if (!root.empty()) {
            root.selectAll(".gradient-area").remove();
        }
    }

    function deactivateOnClick(event) {
        if (event.target.tagName !== "path") {
            deactivatePaths("deactivateOnClick");
        }
    }

    function onClickPath(event) {
        deactivatePaths("OnClickPath");
        const path = d3.select(event.target);
        const gradientId = path.attr("group");
        const lineIndex = Number(path.attr("line-index"));
        const screenSize = calculateScreenSize();

        drawArea(lineIndex, gradientId, screenSize);
    }

    useEffect(() => {
        const screenSize = calculateScreenSize();
        calculateXAxis(screenSize);
        calculateYAxis(screenSize);
        drawLines(screenSize);
        document.addEventListener("click", deactivateOnClick);

        return () => {
            const root = _getRoot(screenSize);
            root.selectAll("path").each(function cleanEvents() {
                this.removeEventListener("click", onClickPath);
            });
            document.removeEventListener("click", deactivateOnClick);
        };
    }, []);
    return <div className="line-chart" ref={svgCanvas}></div>;
};

export default LinesChart;
