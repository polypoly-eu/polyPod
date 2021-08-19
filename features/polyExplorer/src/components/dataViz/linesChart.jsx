import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { BUBBLES_SPEECH_SIZES } from "../../constants";

import "./linesChart.css";

const LinesChart = ({ data }) => {
    const svgCanvas = useRef();
    const semiDarkColor = "#8d9caf";
    const darkColor = "#0f1938";
    const bubbleSpeechBackground = "rgba(255,255,255,0.75)";
    const yLabelsPosition = "-0.40em";
    const heightPicBubbleSpeech = 5;
    const correctionYAxisSize = 10;
    const correctionYAxisLabels = 20;
    const invisiblePathSeparation = 3;
    const screenSizes = {
        smallScreen: "smallScreen",
        normalScreen: "normalScreen",
        bigScreen: "bigScreen",
    };

    const canvasConfig = {
        [screenSizes.smallScreen]: {
            resolution: 450,
            rightMargin: 16,
            leftMargin: 35,
            topMargin: 146,
            bottomMargin: 0,
            limitMarginX: 50,
            limitMarginY: 50,
        },
        [screenSizes.normalScreen]: {
            resolution: 500,
            rightMargin: 16,
            leftMargin: 35,
            topMargin: 146,
            bottomMargin: 0,
            limitMarginX: 50,
            limitMarginY: 20,
        },
        [screenSizes.bigScreen]: {
            resolution: 500,
            rightMargin: 16,
            leftMargin: 35,
            topMargin: 146,
            bottomMargin: 16,
            limitMarginX: 50,
            limitMarginY: 20,
        },
    };

    const bubblesSpeechSmall = {
        [screenSizes.smallScreen]: {
            width: 110,
            height: 52,
            fontSize: 14,
            fontWeight: 800,
        },
        [screenSizes.normalScreen]: {
            width: 110,
            height: 52,
            fontSize: 14,
            fontWeight: 800,
        },
        [screenSizes.bigScreen]: {
            width: 110,
            height: 52,
            fontSize: 14,
            fontWeight: 800,
        },
    };

    const bubblesSpeechBig = {
        [screenSizes.smallScreen]: {
            width: 204,
            height: 59,
            fontSize: 14,
            fontWeight: 500,
        },
        [screenSizes.normalScreen]: {
            width: 204,
            height: 59,
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

    const labelYAxisPosition = {
        [screenSizes.smallScreen]: {
            left: 20,
            top: 120,
        },
        [screenSizes.normalScreen]: {
            left: 20,
            top: 120,
        },
        [screenSizes.bigScreen]: {
            left: 20,
            top: 120,
        },
    };

    const legendsConfiguration = {
        [screenSizes.smallScreen]: {
            left: 20,
            top: 50,
            width: 180,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
        },
        [screenSizes.normalScreen]: {
            left: 20,
            top: 50,
            width: 180,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
        },
        [screenSizes.bigScreen]: {
            left: 20,
            top: 50,
            width: 180,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
        },
    };

    const instructionsConfiguration = {
        [screenSizes.smallScreen]: {
            top: 50,
            width: 180,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
        },
        [screenSizes.normalScreen]: {
            top: 50,
            width: 180,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
        },
        [screenSizes.bigScreen]: {
            top: 50,
            width: 180,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
        },
    };

    const descriptionConfiguration = {
        [screenSizes.smallScreen]: {
            top: 0,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
            lineHeight: "120%",
            fontWeight: 500,
        },
        [screenSizes.normalScreen]: {
            top: 0,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
            lineHeight: "120%",
            fontWeight: 500,
        },
        [screenSizes.bigScreen]: {
            top: 0,
            height: 40,
            fontSize: 14,
            letterSpacing: "-0.01em",
            lineHeight: "120%",
            fontWeight: 500,
        },
    };
    const bubblesClass = "bubble-speech";
    const areasClass = "gradient-area";
    const textClass = "bubble-text";
    const bubblesSelector = `.${bubblesClass}`;
    const areasSelector = `.${areasClass}`;
    const textSelector = `.${textClass}`;

    const [scaleX, updateScaleX] = useState(null);
    const [scaleY, updateScaleY] = useState(null);

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
        } else if (screenWidth <= 410) {
            return screenSizes.normalScreen;
        } else {
            return screenSizes.bigScreen;
        }
    }

    function calculateXAxis(screenSize) {
        const { resolution, leftMargin, bottomMargin } = canvasConfig[
            screenSize
        ];
        const root = _getRoot(screenSize);
        const x = _getScaleX(screenSize);

        root.append("g")
            .attr(
                "transform",
                `translate(${leftMargin}, ${resolution - bottomMargin})`
            )
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
                    .tickSizeOuter(0)
                    .tickFormat((d, index) => (index % 2 === 0 ? d : ""))
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
        const {
            resolution,
            leftMargin,
            topMargin,
            bottomMargin,
        } = canvasConfig[screenSize];
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
                return point + leftMargin;
            })
            .y0(resolution)
            .y1((d) => {
                const point = y(d.y);
                return point + topMargin - bottomMargin;
            });

        root.append("path")
            .datum(points)
            .attr("class", areasClass)
            .attr("fill", `url(#${groupName})`)
            .attr("stroke", "none")
            .attr("group", _getIdName(groupName))
            .attr("d", area);
    }

    function drawLine(points, color, groupName, lineIndex, screenSize) {
        const { leftMargin, topMargin, bottomMargin } = canvasConfig[
            screenSize
        ];
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

                        return point + topMargin - bottomMargin;
                    })
            );

        const invisiblePathDown = root
            .append("path")
            .datum(points)
            .attr("fill", "none")
            .attr("stroke", "transparent")
            .attr("stroke-width", 2)
            .attr("group", _getIdName(groupName))
            .attr("line-index", lineIndex)
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => {
                        const point = x(jsDateTo3dDate(d.x));

                        return point + leftMargin + invisiblePathSeparation;
                    })
                    .y((d) => {
                        const point = y(d.y);

                        return (
                            point +
                            topMargin -
                            bottomMargin +
                            invisiblePathSeparation
                        );
                    })
            );

        const invisiblePathUp = root
            .append("path")
            .datum(points)
            .attr("fill", "none")
            .attr("stroke", "transparent")
            .attr("stroke-width", 2)
            .attr("group", _getIdName(groupName))
            .attr("line-index", lineIndex)
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => {
                        const point = x(jsDateTo3dDate(d.x));

                        return point + leftMargin - invisiblePathSeparation;
                    })
                    .y((d) => {
                        const point = y(d.y);

                        return (
                            point +
                            topMargin -
                            bottomMargin -
                            invisiblePathSeparation
                        );
                    })
            );

        path.node().addEventListener("click", onClickPath);
        invisiblePathDown.node().addEventListener("click", onClickPath);
        invisiblePathUp.node().addEventListener("click", onClickPath);
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
            root.selectAll(areasSelector).remove();
            root.selectAll(bubblesSelector).remove();
            root.selectAll(textSelector).remove();
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
        const { leftMargin, topMargin, bottomMargin } = canvasConfig[
            screenSize
        ];
        const x = _getScaleX(screenSize);
        const y = _getScaleY(screenSize);

        return [
            x(jsDateTo3dDate(bubbleData.x)) + leftMargin,
            y(bubbleData.y) + topMargin - bottomMargin,
        ];
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
            .attr("stroke-width", 1)
            .attr("fill", bubbleSpeechBackground)
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
            .attr("class", textClass)
            .append("xhtml:div")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("background-color", "transparent")
            .style("width", `${bubbleConfig.width}px`)
            .style("height", `${bubbleConfig.height}px`)
            .append("xhtml:div")
            .style("width", "95%")
            .style("text-align", "center")
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

        const isOverLaping = _bubblesOverLaping(
            [[...forthCorner], [...secondCorner]],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [[...forthCorner], [...secondCorner]],
            screenSize
        );

        if (!isOverLaping && !isBubbleOut) {
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

        const isOverlaping = _bubblesOverLaping(
            [[...firstCorner], [...thirdCorner]],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [[...firstCorner], [...thirdCorner]],
            screenSize
        );

        if (!isOverlaping && !isBubbleOut) {
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

        const isOverLaping = _bubblesOverLaping(
            [[...thirdCorner], [...firstCorner]],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [[...thirdCorner], [...firstCorner]],
            screenSize
        );

        if (!isOverLaping && !isBubbleOut) {
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

        const isOverLaping = _bubblesOverLaping(
            [
                [...secondCorner],
                [startPoint[0] - heightPicBubbleSpeech, startPoint[1]],
            ],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [
                [...secondCorner],
                [firstCorner[0] + heightPicBubbleSpeech, firstCorner[1]],
            ],
            screenSize
        );

        if (!isOverLaping && !isBubbleOut) {
            _drawBubbleInCanvas(
                commands,
                secondCorner,
                bubbleConfig,
                bubbleData.text,
                screenSize,
                [
                    [...secondCorner],
                    [startPoint[0] - heightPicBubbleSpeech, startPoint[1]],
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

        const isOverLaping = _bubblesOverLaping(
            [[...secondCorner], [...forthCorner]],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [[...secondCorner], [...forthCorner]],
            screenSize
        );

        if (!isOverLaping && !isBubbleOut) {
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

        const isOverLaping = _bubblesOverLaping(
            [[...thirdCorner], [...firstCorner]],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [[...thirdCorner], [...firstCorner]],
            screenSize
        );

        if (!isOverLaping && !isBubbleOut) {
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

        const isOverLaping = _bubblesOverLaping(
            [[...firstCorner], [...thirdCorner]],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [[...firstCorner], [...thirdCorner]],
            screenSize
        );

        if (!isOverLaping && !isBubbleOut) {
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

        const isOverLaping = _bubblesOverLaping(
            [
                [startPoint[0] + heightPicBubbleSpeech, startPoint[1]],
                [...secondCorner],
            ],
            screenSize
        );

        const isBubbleOut = _isBubbleOut(
            [
                [startPoint[0] + heightPicBubbleSpeech, startPoint[1]],
                [...secondCorner],
            ],
            screenSize
        );

        if (!isOverLaping && !isBubbleOut) {
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
            drawBubbleMiddleBottom(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleRightTop(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleRightMiddle(bubbleConfig, bubbleData, screenSize) ||
            drawBubbleRightBottom(bubbleConfig, bubbleData, screenSize) ||
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

    function _rangesOverlaping(rangeA, rangeB) {
        return (
            (rangeA[0] >= rangeB[0] && rangeA[0] <= rangeB[1]) ||
            (rangeA[1] >= rangeB[0] && rangeA[1] <= rangeB[1]) ||
            (rangeA[0] <= rangeB[0] && rangeA[1] >= rangeB[1])
        );
    }

    function _bubblesOverLaping(diagonal, screenSize) {
        const { rangeX, rangeY } = _getRangesFromDiagonal(diagonal);
        const root = _getRoot(screenSize);
        const bubbles = root.selectAll(bubblesSelector);

        let result = false;

        if (!bubbles.empty()) {
            bubbles.each(function checkOverLaping() {
                const bubble = d3.select(this);
                const bubbleDiagonal = JSON.parse(bubble.attr("diagonal"));

                const bubbleRangeX = [
                    bubbleDiagonal[0][0],
                    bubbleDiagonal[1][0],
                ];
                const bubbleRangeY = [
                    bubbleDiagonal[0][1],
                    bubbleDiagonal[1][1],
                ];

                result =
                    result ||
                    (_rangesOverlaping(rangeX, bubbleRangeX) &&
                        _rangesOverlaping(rangeY, bubbleRangeY));
            });
        }

        return result;
    }

    function _getRangesFromDiagonal(diagonal) {
        const rangeX = [diagonal[0][0], diagonal[1][0]];
        const rangeY = [diagonal[0][1], diagonal[1][1]];

        return { rangeX, rangeY };
    }

    function _isBubbleOut(diagonal, screenSize) {
        const {
            leftMargin,
            limitMarginX,
            limitMarginY,
            topMargin,
        } = canvasConfig[screenSize];
        const { rangeX, rangeY } = _getRangesFromDiagonal(diagonal);
        const x = _getScaleX(screenSize);
        const y = _getScaleY(screenSize);
        const limitsX = [
            x(jsDateTo3dDate(data.rangeDates[0])),
            x(jsDateTo3dDate(data.rangeDates[1])) + leftMargin + limitMarginX,
        ];
        const limitsY = [
            y(data.rangeY[1]),
            y(data.rangeY[0]) + limitMarginY + topMargin,
        ];

        const isOutLimitsOfX = rangeX[0] < limitsX[0] || rangeX[1] > limitsX[1];
        const isOutLimitsY = rangeY[0] < limitsY[0] || rangeY[1] > limitsY[1];

        return isOutLimitsOfX || isOutLimitsY;
    }

    function yAxisLabel(screenSize) {
        const root = _getRoot(screenSize);
        const { left, top } = labelYAxisPosition[screenSize];
        root.append("text")
            .attr("text-anchor", "center")
            .style("font-size", "12px")
            .style("font-weight", "500")
            .style("letter-spacing", "-0.01em")
            .attr("transform", `translate(${left}, ${top})`)
            .text(data.yAxisLabel);
    }

    function graphLegend(screenSize) {
        const legendConfig = legendsConfiguration[screenSize];
        const root = _getRoot(screenSize);

        const legendSpace = root
            .append("foreignObject")
            .style("width", legendConfig.width)
            .style("height", legendConfig.height)
            .attr(
                "transform",
                `translate(${legendConfig.left}, ${legendConfig.top})`
            )
            .append("xhtml:div")
            .style("display", "grid")
            .style("grid-template-rows", "1fr 1fr")
            .style("justify-content", "stretch")
            .style("align-content", "stretch")
            .style("width", `${legendConfig.width}px`)
            .style("height", `${legendConfig.height}px`);

        for (const group of data.groups) {
            const groupContent = legendSpace
                .append("xhtml:div")
                .style("display", "grid")
                .style("grid-template-columns", "1fr 2fr")
                .style("justify-content", "stretch")
                .style("align-content", "stretch")
                .style("align-items", "center")
                .style("width", "100%");

            groupContent
                .append("xhtml:div")
                .style("width", "15px")
                .style("height", "0px")
                .style("justify-self", "center")
                .style("border-bottom", `solid 1px ${group.color}`);
            groupContent
                .append("xhtml:div")
                .style("color", darkColor)
                .style("justify-self", "start")
                .style("font-size", `${legendConfig.fontSize}px`)
                .style("letter-spacing", legendConfig.letterSpacing)
                .text(group.groupName);
        }
    }

    function graphInstructions(screenSize) {
        const instructionsConfig = instructionsConfiguration[screenSize];
        const { resolution, rightMargin } = canvasConfig[screenSize];
        const root = _getRoot(screenSize);

        const instructionsContainer = root
            .append("foreignObject")
            .style("width", instructionsConfig.width)
            .style("height", instructionsConfig.height)
            .attr(
                "transform",
                `translate(${
                    resolution - instructionsConfig.width - rightMargin
                }, ${instructionsConfig.top})`
            )
            .append("xhtml:div")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "flex-start")
            .style("width", `${instructionsConfig.width}px`)
            .style("height", `${instructionsConfig.height}px`);

        instructionsContainer
            .append("xhtml:img")
            .style("margin-top", "5px")
            .attr("src", "./images/hand-pointer.svg");
        instructionsContainer
            .append("xhtml:div")
            .style("width", "95%")
            .style("padding", "0px 10px")
            .style("color", darkColor)
            .style("font-size", `${instructionsConfig.fontSize}`)
            .style("letter-spacing", instructionsConfig.letterSpacing)
            .text(data.instructionText);
    }

    function graphDescription(screenSize) {
        const { resolution, leftMargin, rightMargin } = canvasConfig[
            screenSize
        ];
        const descriptionConfig = descriptionConfiguration[screenSize];
        const root = _getRoot(screenSize);

        root.append("foreignObject")
            .style("width", resolution - leftMargin - rightMargin)
            .style("height", descriptionConfig.height)
            .attr("transform", `translate(${leftMargin}, 0)`)
            .append("xhtml:div")
            .style("color", darkColor)
            .style("font-size", descriptionConfig.fontSize)
            .style("letter-spacing", descriptionConfig.letterSpacing)
            .style("line-height", descriptionConfig.lineHeight)
            .style("font-weight", descriptionConfig.fontWeight)
            .text(data.graphDescription);
    }

    useEffect(() => {
        const screenSize = calculateScreenSize();
        calculateXAxis(screenSize);
        calculateYAxis(screenSize);
        yAxisLabel(screenSize);
        graphLegend(screenSize);
        graphInstructions(screenSize);
        graphDescription(screenSize);
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
