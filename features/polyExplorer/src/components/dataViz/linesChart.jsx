import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import "./linesChart.css";

const LinesChart = ({ data }) => {
    const svgCanvas = useRef();
    const screenSizes = {
        smallScreen: "smallScreen",
        normalScreen: "normalScreen",
        bigScreen: "bigScreen",
    };
    const canvasConfig = {
        [screenSizes.smallScreen]: {
            resolution: 300,
            rightMargin: 16,
            leftMargin: 16,
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

    function _getMesures(screenSize) {
        return {
            half: canvasConfig[screenSize].resolution / 2,
        };
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

    function calculateScreenSize(screenWidth) {
        if (screenWidth <= 320) {
            return screenSizes.smallScreen;
        } else if (screenWidth <= 413) {
            return screenSizes.normalScreen;
        } else {
            return screenSizes.bigScreen;
        }
    }

    function calculateXAxis(screenSize) {
        const { resolution, rightMargin, leftMargin } = canvasConfig[
            screenSize
        ];
        const root = _getRoot(screenSize);
        const datesRange = data.rangeDates.map(
            (dateString) => new Date(dateString)
        );
        const listOfDates = [datesRange[0]];

        let x;
        while (
            listOfDates[listOfDates.length - 1].getTime() <
            datesRange[1].getTime()
        ) {
            const lastDate = listOfDates[listOfDates.length - 1];
            const day = lastDate.getDate();
            const month = lastDate.getMonth();
            const year = lastDate.getFullYear();

            listOfDates.push(new Date(year + 1, month, day));
        }

        x = d3
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

    useEffect(() => {
        const innerWidth = window.innerWidth;
        const screenSize = calculateScreenSize(innerWidth);
        calculateXAxis(screenSize);
    }, []);
    return <div className="line-chart" ref={svgCanvas}></div>;
};

export default LinesChart;
