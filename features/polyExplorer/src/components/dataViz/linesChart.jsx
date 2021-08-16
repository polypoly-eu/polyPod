import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { BUBBLES_SPEECH_SIZES } from "../../constants";

import "./linesChart.css";

const LinesChart = ({ data }) => {
    const svgCanvas = useRef();
    const semiDarkColor = "#8d9caf";
    const darkColor = "#0f1938";
    const bubblesSpeachBackground = "rgba(255,255,255,0.75)";
    const yLabelsPosition = "-0.40em";
    const heightPicBubbleSpeech = 5;
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

    const bubblesSpeechSmall = {
        [screenSizes.smallScreen]: {
            width: 110,
            height: 32,
            fontSize: 14,
            fontWeight: 800,
        },
        [screenSizes.normalScreen]: {
            width: 87,
            height: 32,
            fontSize: 14,
            fontWeight: 800,
        },
        [screenSizes.bigScreen]: {
            width: 87,
            height: 32,
            fontSize: 14,
            fontWeight: 800,
        },
    };

    const bubblesSpeechBig = {
        [screenSizes.smallScreen]: {
            width: 204,
            height: 89,
            fontSize: 14,
            fontWeight: 500,
        },
        [screenSizes.normalScreen]: {
            width: 204,
            height: 89,
            fontSize: 14,
            fontWeight: 500,
        },
        [screenSizes.bigScreen]: {
            width: 204,
            height: 89,
            fontSize: 14,
            fontWeight: 500,
        },
    };
    const bubblesClass = "bubble-speech";
    const bubblesSelector = `.${bubblesClass}`;

    const [scaleX, updateScaleX] = useState(null);
    const [scaleY, updateScaleY] = useState(null);

    // function _getMesures(screenSize) {
    //     return {
    //         half: canvasConfig[screenSize].resolution / 2,
    //     };
    // }

    function jsDateTo3dDate(jsDate) {
        const date = `${jsDate.getFullYear()}-${
            jsDate.getMonth() + 1
        }-${jsDate.getDate()}`;

        return d3.timeParse("%Y-%m-%d")(date);
    }

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
            .domain(d3.extent(listOfDates, (jsDate) => jsDateTo3dDate(jsDate)))
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
                const point = x(jsDateTo3dDate(d.x));
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
                        const point = x(jsDateTo3dDate(d.x));

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

    function deactivatePaths() {
        const root = d3.select(svgCanvas.current).select("svg");
        if (!root.empty()) {
            root.selectAll(".gradient-area").remove();
        }
    }

    function deactivateOnClick(event) {
        if (event.target.tagName !== "path") {
            deactivatePaths();
        }
    }

    function onClickPath(event) {
        deactivatePaths();
        const path = d3.select(event.target);
        const gradientId = path.attr("group");
        const lineIndex = Number(path.attr("line-index"));
        const screenSize = calculateScreenSize();

        drawArea(lineIndex, gradientId, screenSize);
        drawBubblesSpeech(lineIndex, gradientId, screenSize);
    }

    function _getBubbleStartingPoint(bubbleData, screenSize) {
        const { leftMargin } = canvasConfig[screenSize];
        const x = _getScaleX(screenSize);
        const y = _getScaleY(screenSize);

        return [x(jsDateTo3dDate(bubbleData.x)) + leftMargin, y(bubbleData.y)];
    }

    function _drawBubbleInCanvas(
        commands,
        labelInitialPoint,
        bubbleConfig,
        text,
        screenSize,
        diagonal
    ) {
        const root = _getRoot(screenSize);

        root.append("path")
            .attr("stroke", darkColor)
            .attr("stroke-width", 2)
            .attr("fill", bubblesSpeachBackground)
            .attr("class", bubblesClass)
            .attr("diagonal", JSON.stringify(diagonal))
            .attr("d", commands);

        root.append("foreignObject")
            .style("width", bubbleConfig.width)
            .style("height", bubbleConfig.height)
            .attr(
                "transform",
                `translate(${labelInitialPoint[0]},${labelInitialPoint[1]})`
            )
            .append("xhtml:div")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("background-color", "transparent")
            .style("width", bubbleConfig.width)
            .style("height", bubbleConfig.height)
            .style("padding", "0px 10px")
            .append("xhtml:span")
            .style("color", darkColor)
            .style("font-size", bubbleConfig.fontSize)
            .style("font-weight", bubbleConfig.fontWeight)
            .text(text);
    }

    function drawBubbleTopMiddle(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const speechLine = [
            startPoint[0] + heightPicBubbleSpeech,
            startPoint[1] + heightPicBubbleSpeech,
        ];

        const firstCorner = [
            speechLine[0] + bubbleConfig.width / 2 - heightPicBubbleSpeech,
            speechLine[1],
        ];
        const secondCorner = [
            firstCorner[0],
            firstCorner[1] + bubbleConfig.height,
        ];
        const thirdCorner = [
            secondCorner[0] - bubbleConfig.width,
            secondCorner[1],
        ];
        const forthCorner = [
            thirdCorner[0],
            thirdCorner[1] - bubbleConfig.height,
        ];
        const speechPoint = [
            forthCorner[0] + bubbleConfig.width / 2 - heightPicBubbleSpeech,
            forthCorner[1],
        ];
        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${speechLine[0]} ${speechLine[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            L ${speechPoint[0]} ${speechPoint[1]}
            Z
        `;

        const root = _getRoot(screenSize);

        root.append("circle")
            .attr("r", 10)
            .attr("transform", `translate(${forthCorner})`)
            .attr("fill", "red");

        root.append("circle")
            .attr("r", 10)
            .attr("transform", `translate(${secondCorner})`)
            .attr("fill", "blue");

        if (
            !_bubblesOverLaping(
                [[...forthCorner], [...secondCorner]],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                forthCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [[...forthCorner], [...secondCorner]]
            );
            return true;
        } else {
            return false;
        }
    }

    function drawBubbleRightTop(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const firstCorner = [
            startPoint[0] - bubbleConfig.width - heightPicBubbleSpeech,
            startPoint[1],
        ];
        const secondCorner = [
            firstCorner[0],
            firstCorner[1] + bubbleConfig.height,
        ];
        const thirdCorner = [
            secondCorner[0] + bubbleConfig.width,
            secondCorner[1],
        ];
        const forthCorner = [
            thirdCorner[0],
            thirdCorner[1] - bubbleConfig.height + heightPicBubbleSpeech,
        ];
        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            Z
        `;

        if (
            !_bubblesOverLaping(
                [[...firstCorner], [...thirdCorner]],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                firstCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [[...firstCorner], [...thirdCorner]]
            );
            return true;
        } else {
            return false;
        }
    }

    function drawBubbleRightMiddle(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const speechLine = [
            startPoint[0] - heightPicBubbleSpeech,
            startPoint[1] + heightPicBubbleSpeech,
        ];
        const firstCorner = [
            speechLine[0],
            speechLine[1] + (bubbleConfig.height / 2 - heightPicBubbleSpeech),
        ];

        const secondCorner = [
            firstCorner[0] - bubbleConfig.width,
            firstCorner[1],
        ];
        const thirdCorner = [
            secondCorner[0],
            secondCorner[1] - bubbleConfig.height,
        ];
        const forthCorner = [
            thirdCorner[0] + bubbleConfig.width,
            thirdCorner[1],
        ];
        const speechPoint = [
            forthCorner[0],
            forthCorner[1] + bubbleConfig.height / 2 - heightPicBubbleSpeech,
        ];

        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${speechLine[0]} ${speechLine[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            L ${speechPoint[0]} ${speechPoint[1]}
            Z
        `;

        if (
            !_bubblesOverLaping(
                [[...thirdCorner], [...firstCorner]],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                thirdCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [[...thirdCorner], [...firstCorner]]
            );
            return true;
        } else {
            return false;
        }
    }

    function drawBubbleRightBottom(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const firstCorner = [
            startPoint[0] - bubbleConfig.width - heightPicBubbleSpeech,
            startPoint[1],
        ];
        const secondCorner = [
            firstCorner[0],
            firstCorner[1] - bubbleConfig.height,
        ];
        const thirdCorner = [
            secondCorner[0] + bubbleConfig.width,
            secondCorner[1],
        ];
        const forthCorner = [
            thirdCorner[0],
            thirdCorner[1] + bubbleConfig.height - heightPicBubbleSpeech,
        ];

        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            Z
        `;

        if (
            !_bubblesOverLaping(
                [
                    [...secondCorner],
                    [firstCorner[0] + heightPicBubbleSpeech, firstCorner[1]],
                ],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                secondCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [
                    [...secondCorner],
                    [firstCorner[0] + heightPicBubbleSpeech, firstCorner[1]],
                ]
            );
            return true;
        } else {
            return false;
        }
    }

    function drawBubbleMiddleBottom(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const speechLine = [
            startPoint[0] - heightPicBubbleSpeech,
            startPoint[1] - heightPicBubbleSpeech,
        ];
        const firstCorner = [
            speechLine[0] - bubbleConfig.width / 2 + heightPicBubbleSpeech,
            speechLine[1],
        ];
        const secondCorner = [
            firstCorner[0],
            firstCorner[1] - bubbleConfig.height,
        ];
        const thirdCorner = [
            secondCorner[0] + bubbleConfig.width,
            secondCorner[1],
        ];
        const forthCorner = [
            thirdCorner[0],
            thirdCorner[1] + bubbleConfig.height,
        ];
        const speechPoint = [
            forthCorner[0] - bubbleConfig.width / 2 + heightPicBubbleSpeech,
            forthCorner[1],
        ];

        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${speechLine[0]} ${speechLine[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            L ${speechPoint[0]} ${speechPoint[1]}
            Z
        `;

        if (
            !_bubblesOverLaping(
                [[...secondCorner], [...forthCorner]],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                secondCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [[...secondCorner], [...forthCorner]]
            );
            return true;
        } else {
            return false;
        }
    }

    function drawBubbleLeftBottom(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const firstCorner = [
            startPoint[0] + bubbleConfig.width + heightPicBubbleSpeech,
            startPoint[1],
        ];
        const secondCorner = [
            firstCorner[0],
            firstCorner[1] - bubbleConfig.height,
        ];
        const thirdCorner = [
            secondCorner[0] - bubbleConfig.width,
            secondCorner[1],
        ];
        const forthCorner = [
            thirdCorner[0],
            thirdCorner[1] + bubbleConfig.height - heightPicBubbleSpeech,
        ];

        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            Z
        `;

        if (
            !_bubblesOverLaping(
                [[...thirdCorner], [...firstCorner]],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                thirdCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [[...thirdCorner], [...firstCorner]]
            );
            return true;
        } else {
            return false;
        }
    }

    function drawBubbleLeftMiddle(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const speecheLine = [
            startPoint[0] + heightPicBubbleSpeech,
            startPoint[1] - heightPicBubbleSpeech,
        ];
        const firstCorner = [
            speecheLine[0],
            speecheLine[1] - bubbleConfig.height / 2 + heightPicBubbleSpeech,
        ];
        const secondCorner = [
            firstCorner[0] + bubbleConfig.width,
            firstCorner[1],
        ];
        const thirdCorner = [
            secondCorner[0],
            secondCorner[1] + bubbleConfig.height,
        ];
        const forthCorner = [
            thirdCorner[0] - bubbleConfig.width,
            thirdCorner[1],
        ];
        const speechPoint = [
            forthCorner[0],
            forthCorner[1] - bubbleConfig.height / 2 + heightPicBubbleSpeech,
        ];

        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${speecheLine[0]} ${speecheLine[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            L ${speechPoint[0]} ${speechPoint[1]}
            Z
        `;

        if (
            !_bubblesOverLaping(
                [[...firstCorner], [...thirdCorner]],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                firstCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [[...firstCorner], [...thirdCorner]]
            );
            return true;
        } else {
            return false;
        }
    }

    function drawBubbleLeftTop(bubbleConfig, bubbleData, screenSize) {
        const startPoint = _getBubbleStartingPoint(bubbleData, screenSize);
        const firstCorner = [
            startPoint[0] + bubbleConfig.width + heightPicBubbleSpeech,
            startPoint[1],
        ];
        const secondCorner = [
            firstCorner[0],
            firstCorner[1] + bubbleConfig.height,
        ];
        const thirdCorner = [
            secondCorner[0] - bubbleConfig.width,
            secondCorner[1],
        ];
        const forthCorner = [
            thirdCorner[0],
            thirdCorner[1] - bubbleConfig.height + heightPicBubbleSpeech,
        ];

        const commands = `
            M ${startPoint[0]} ${startPoint[1]}
            L ${firstCorner[0]} ${firstCorner[1]}
            L ${secondCorner[0]} ${secondCorner[1]}
            L ${thirdCorner[0]} ${thirdCorner[1]}
            L ${forthCorner[0]} ${forthCorner[1]}
            Z
        `;

        if (
            !_bubblesOverLaping(
                [
                    [startPoint[0] + heightPicBubbleSpeech, startPoint[1]],
                    [...secondCorner],
                ],
                screenSize
            )
        ) {
            _drawBubbleInCanvas(
                commands,
                [startPoint[0] + heightPicBubbleSpeech, startPoint[1]],
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [
                    [startPoint[0] + heightPicBubbleSpeech, startPoint[1]],
                    [...secondCorner],
                ]
            );
            return true;
        } else {
            return false;
        }
    }

    function _drawBubble(bubbleConfig, bubbleData, screenSize) {
        drawBubbleTopMiddle(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleRightTop(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleRightMiddle(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleRightBottom(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleMiddleBottom(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleLeftBottom(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleLeftMiddle(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleLeftTop(bubbleConfig, bubbleData, screenSize);
    }

    function drawBubblesSpeech(lineIndex, groupName, screenSize) {
        const groupData = data.groups.find(
            (group) => _getIdName(group.groupName) === groupName
        );
        const bubblesData = groupData.lines[lineIndex].messages;

        for (const bubbleData of bubblesData) {
            const bubbleConfig =
                BUBBLES_SPEECH_SIZES.SMALL === bubbleData.size
                    ? bubblesSpeechSmall[screenSize]
                    : bubblesSpeechBig[screenSize];

            _drawBubble(bubbleConfig, bubbleData, screenSize);
        }
    }

    function _bubblesOverLaping(diagonal, screenSize) {
        debugger;
        const pointA = diagonal[0];
        const pointB = diagonal[1];
        const root = _getRoot(screenSize);

        const bubbles = root.selectAll(bubblesSelector);

        let result = false;

        if (!bubbles.empty()) {
            debugger;
            bubbles.each(function checkOverLaping() {
                const bubble = d3.select(this);
                const bubbleDiagonal = JSON.parse(bubble.attr("diagonal"));
                const bubblePointA = bubbleDiagonal[0];
                const bubblePointB = bubbleDiagonal[1];

                const firstCond =
                    pointA[0] <= bubblePointB[0] &&
                    pointB[0] >= bubblePointB[0] &&
                    pointA[1] <= bubblePointB[1] &&
                    pointB[1] >= bubblePointB[1];

                const secondCond =
                    pointA[0] <= bubblePointA[0] &&
                    pointB[0] >= bubblePointA[0] &&
                    pointA[1] <= bubblePointA[1] &&
                    pointB[1] >= bubblePointA[1];

                result = result || firstCond || secondCond;
            });
        }

        debugger;

        return result;
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
