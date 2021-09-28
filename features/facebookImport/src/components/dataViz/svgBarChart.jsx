import React, { useEffect, useRef } from "react";

import * as d3 from "d3";

const SvgBarChart = ({ data, barColor }) => {
    const barChartRef = useRef();

    //constants
    const margin = {
            top: 10,
            right: 20,
            bottom: 20,
            left: 40,
        },
        width = 400,
        height = 300,
        chartHeight = height - margin.bottom - margin.top,
        chartWidth = width - margin.left - margin.right,
        initializingBarHeight = 2;

    const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.2),
        yScale = d3.scaleLinear().range([chartHeight, margin.bottom]);

    function adaptScalesToData() {
        xScale.domain(data.map((d) => d.title));
        yScale.domain([0, d3.max(data, (d) => d.value)]);
    }

    function createSVG() {
        return d3
            .select(barChartRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);
    }

    function addAxis(barChart) {
        barChart
            .append("g")
            .call(
                d3
                    .axisLeft(yScale)
                    .tickFormat((d) => d)
                    .ticks(10)
            )
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("value")
            .attr("class", "y-axis");

        barChart
            .append("g")
            .attr("class", "x-axis")
            .call(d3.axisBottom(xScale))
            .attr("transform", `translate(0, ${chartHeight})`);
    }

    function addChart(svg) {
        return svg
            .append("g")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr("class", "chart");
    }

    function addBars(barChart) {
        const bars = barChart.selectAll(".bars").data(data, function (d) {
            return d.title;
        });
        console.log(bars);

        bars.exit().remove();

        bars.remove();

        bars.enter()
            .append("rect")
            .attr("y", chartHeight - initializingBarHeight)
            .attr("height", initializingBarHeight)
            .attr("x", (d) => xScale(d.title))
            .attr("width", xScale.bandwidth())
            .attr("fill", barColor)
            .attr("class", "bar")
            .transition()
            .duration(1000)

            .attr("y", (d) => yScale(d.value))
            .attr("height", (d) => chartHeight - yScale(d.value));
    }

    function transformAxis() {
        barChart
            .selectAll(".y-axis")
            .transition()
            .call(
                d3
                    .axisLeft(yScale)
                    .tickFormat((d) => d)
                    .ticks(10)
            );

        barChart
            .transition()
            .selectAll(".x-axis")
            .call(d3.axisBottom(xScale))
            .attr("transform", `translate(0, ${chartHeight})`);
    }

    useEffect(() => {
        adaptScalesToData();
        let barChart = d3.select(barChartRef.current).select(".chart");

        if (barChart.empty()) {
            let svg = createSVG();
            barChart = addChart(svg);
        }
        addAxis(barChart);
        addBars(barChart);
    });

    return <div className="bar-chart" ref={barChartRef}></div>;
};

export default SvgBarChart;
