import React, { useRef, useEffect, useState } from "react";
import i18n from "../../i18n.js";
import * as d3 from "d3";

const BarChart = ({ data, animation, legendTitle }) => {
    const [barWidth, setBarWidth] = useState(0);
    const [labelXPosition, setLabelXPosition] = useState(0);

    const legendTranslations = {
        title: legendTitle,
        max: i18n.t("barChart:max"),
        average: i18n.t("barChart:average"),
    };

    const svgBarRef = useRef();
    const gHeight = 52;
    const width = 500;
    const height = data.length * (gHeight * 2);
    const margin = { top: 36, right: 30, bottom: 1, left: 1 };
    const barHeight = gHeight - margin.top;
    const minBarWidth = 1;
    const barRadius = 8;
    const barColor = "var(--data-exp-purposes)";
    const labelValueColor = "var(--data-exp-purposes)";
    const labelValuePositionAdjust = {
        x: 2,
        yAdj: 8,
        dy: ".35em",
    };
    const legendWidth = 150;
    const legendHeight = 40;
    const legendMargin = 0;
    const valueLinesConfig = {
        y1: 12,
        strokeColor: "var(--data-exp-purposes)",
        strokeWidth: 2,
        strokeDasharray: "5, 5",
    };
    const labelTitlePadding = { top: 8, right: 12, bottom: 8, left: 12 };
    const labelTitleHeight = {
        fo: 42,
        div: 32,
        p: 32,
    };
    const labelTitleRadius = "16px";
    const labelTitleBorder = "solid 1px var(--color-dark)";
    const labelTitleBackground = "#F7FAFC80";
    const fontConfig = {
        color: "var(--color-text-dark)",
        fontSize: "12px",
        fontSizeTitle: "14px",
        lineHeight: "14.4px",
        fontWeight: "400",
        fontWeightBold: "500",
        textAlign: "center",
    };
    const maxValue = d3.max(data, (d) => d.value);
    const averageValue = d3.mean(data, (d) => d.value);

    data.sort(function (x, y) {
        return d3.descending(x.value, y.value);
    });

    const xScale = d3
        .scaleLinear()
        .range([0, width - margin.left - margin.right])
        .domain([0, d3.max(data, (d) => d.value)]);
    const yScale = d3
        .scaleBand()
        .range([0, height - margin.top - margin.bottom])
        .domain(data.map((d) => d.title));

    function render() {
        let svgChart = d3.select(svgBarRef.current).select("svg");
        if (svgChart.empty()) {
            svgChart = d3
                .select(svgBarRef.current)
                .append("svg")
                .style("width", "100%")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
                .attr("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
                .attr("viewBox", `0 0 ${width} ${height}`);

            const bars = svgChart
                .selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", `translate(${margin.left}, ${gHeight})`);
            bars.append("rect")
                .attr("class", "bar")
                .attr("height", barHeight)
                .attr("width", barWidth)
                .attr("x", margin.left)
                .attr("y", (d) => yScale(d.title) + gHeight)
                .attr("rx", barRadius)
                .attr("ry", barRadius)
                .attr("fill", barColor)
                .style("margin-top", margin.top);
            bars.append("text")
                .attr("class", "label-value")
                .attr("x", labelValuePositionAdjust.x)
                .attr(
                    "y",
                    (d) =>
                        yScale(d.title) +
                        gHeight +
                        labelValuePositionAdjust.yAdj
                )
                .attr("dy", labelValuePositionAdjust.dy)
                .style("font-size", fontConfig.fontSize)
                .style("font-weight", fontConfig.fontWeightBold)
                .attr("fill", labelValueColor)
                .text((d) =>
                    d.value >= 1000000
                        ? Math.trunc(d.value / 1000000) + "M"
                        : d.value
                );

            const valueLines = svgChart
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
            valueLines
                .append("line")
                .attr("x1", xScale(maxValue))
                .attr("y1", valueLinesConfig.y1)
                .attr("x2", xScale(maxValue))
                .attr("y2", height - margin.bottom)
                .style("stroke", valueLinesConfig.strokeColor)
                .style("stroke-width", valueLinesConfig.strokeWidth);
            valueLines
                .append("line")
                .attr("x1", xScale(averageValue))
                .attr("y1", valueLinesConfig.y1)
                .attr("x2", xScale(averageValue))
                .attr("y2", height - margin.bottom)
                .style("stroke", valueLinesConfig.strokeColor)
                .style("stroke-width", valueLinesConfig.strokeWidth)
                .style("stroke-dasharray", valueLinesConfig.strokeDasharray);

            const labelTitle = svgChart
                .selectAll("foreignObject")
                .data(data)
                .enter()
                .append("foreignObject")
                .attr("x", labelXPosition)
                .attr("y", (d) => yScale(d.title) + gHeight)
                .attr("width", width)
                .attr("height", labelTitleHeight.fo);
            const labelTitleDiv = labelTitle.append("xhtml:div");
            const labelTitleP = labelTitleDiv
                .append("p")
                .text((d) => d.title)
                .attr("height", labelTitleHeight.p)
                .style("margin", legendMargin)
                .style("display", "inline-block")
                .style("font-size", fontConfig.fontSizeTitle)
                .style(
                    "padding",
                    labelTitlePadding.top +
                        "px " +
                        labelTitlePadding.left +
                        "px"
                )
                .style("color", fontConfig.color)
                .style("border", labelTitleBorder)
                .style("border-radius", labelTitleRadius)
                .style("background-color", labelTitleBackground);
            const labelTitleWidth = labelTitleP.node().getBoundingClientRect()
                .width;
            labelTitleDiv
                .attr("width", labelTitleWidth)
                .attr("height", labelTitleHeight.div);

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
                .html(legendTranslations.title)
                .style("font-size", fontConfig.fontSize)
                .style("color", fontConfig.color)
                .style("font-weight", fontConfig.fontWeightBold);

            const averageValueLegend = svgChart
                .append("foreignObject")
                .attr("x", xScale(averageValue) - legendWidth / 2)
                .attr("y", legendHeight / 2)
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
                .style("font-size", fontConfig.fontSize)
                .style("color", fontConfig.color)
                .style("margin", legendMargin)
                .style("text-align", fontConfig.textAlign)
                .style("font-weight", fontConfig.fontWeightBold)
                .style("line-height", fontConfig.lineHeight);
            averageValueLegend
                .append("p")
                .html(legendTranslations.average)
                .style("font-size", fontConfig.fontSize)
                .style("color", fontConfig.color)
                .style("margin", legendMargin)
                .style("text-align", fontConfig.textAlign)
                .style("font-weight", fontConfig.fontWeight)
                .style("line-height", fontConfig.lineHeight);

            const maxValueLegend = svgChart
                .append("foreignObject")
                .attr("x", xScale(maxValue) - legendWidth / 2)
                .attr("y", legendHeight / 2)
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
                .style("font-size", fontConfig.fontSize)
                .style("color", fontConfig.color)
                .style("margin", legendMargin)
                .style("text-align", fontConfig.textAlign)
                .style("font-weight", fontConfig.fontWeight)
                .style("line-height", fontConfig.lineHeight);
            maxValueLegend
                .append("p")
                .html(legendTranslations.max)
                .style("font-size", fontConfig.fontSize)
                .style("color", fontConfig.color)
                .style("margin", legendMargin)
                .style("text-align", fontConfig.textAlign)
                .style("font-weight", fontConfig.fontWeightBold)
                .style("line-height", fontConfig.lineHeight);
        }

        return svgChart;
    }

    function animateChart(animation) {
        if (animation) {
            const svgChart = render();
            const barTransition = svgChart
                .selectAll(".bar")
                .transition()
                .duration(2000)
                .attr("width", (d) =>
                    xScale(d.value) < minBarWidth
                        ? minBarWidth
                        : xScale(d.value)
                );
            const labelTransition = svgChart
                .selectAll(".label-value")
                .transition()
                .duration(2000)
                .attr(
                    "x",
                    (d) =>
                        xScale(d.value) +
                        margin.left +
                        labelValuePositionAdjust.x
                );
            setBarWidth(barTransition);
            setLabelXPosition(labelTransition);
        }
    }

    useEffect(() => {
        render();
        animateChart(animation);
    }, [data, animation]);

    return <div ref={svgBarRef}></div>;
};

export default BarChart;
