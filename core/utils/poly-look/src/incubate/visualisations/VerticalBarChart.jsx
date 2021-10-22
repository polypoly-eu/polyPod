import React, { useEffect, useRef } from "react";

import * as d3 from "d3";

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * @function
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 300} [height] - The height of the svg
 * @param {string|callback = "blue"} [barColor] - The color of the bar (callbacks receive event and data)
 * @returns {jsx-div with svg attached}
 */
export const VerticalBarChart = ({
  data,
  barColor = "blue",
  width = 400,
  height = 300,
}) => {
  const barChartRef = useRef();

  //constants
  const margin = {
      top: 10,
      right: 0,
      bottom: 20,
      left: 40,
    },
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

  function addChart(svg) {
    return svg
      .append("g")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class", "chart");
  }

  function styleAxis(barChart) {
    barChart.selectAll(".domain").style("visibility", "hidden");
    barChart.selectAll("line").style("visibility", "hidden");
    barChart
      .selectAll(".tick")
      .selectAll("text")
      .attr("fill", "#a9b6c6")
      .style("font-size", "12px");
  }

  function addAxis(barChart) {
    barChart
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => d)
          .ticks(5)
      )
      .attr("class", "y-axis")
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    barChart
      .append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(0, ${chartHeight})`);

    styleAxis(barChart);
  }

  //TODO: transition of y-axis
  function transitionAxis(barChart) {
    barChart.selectAll(".y-axis").remove();
    barChart
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => d)
          .ticks(5)
      )
      .attr("class", "y-axis")
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    barChart
      .transition()
      .selectAll(".x-axis")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(0, ${chartHeight})`);

    styleAxis(barChart);
  }

  function updateExistingBars(bars) {
    bars
      .transition()
      .duration(750)
      .attr("y", chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("x", (d) => xScale(d.title))
      .attr("width", xScale.bandwidth())
      .attr("fill", barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => chartHeight - yScale(d.value));
  }

  function addEnteringBars(bars) {
    bars
      .enter()
      .append("rect")
      .attr("y", chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("x", (d) => xScale(d.title))
      .attr("width", xScale.bandwidth())
      .attr("fill", barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => chartHeight - yScale(d.value));
  }

  function displayBars(barChart) {
    const bars = barChart.selectAll(".bar").data(data, (d) => d.title);
    bars.exit().remove();
    updateExistingBars(bars);
    addEnteringBars(bars);
  }

  useEffect(() => {
    adaptScalesToData();

    let barChart = d3.select(barChartRef.current).select(".chart");
    if (barChart.empty()) barChart = addChart(createSVG());

    if (barChart.select(".x-axis").empty()) addAxis(barChart);
    else transitionAxis(barChart);
    displayBars(barChart);
  });

  return <div className="bar-chart" ref={barChartRef}></div>;
};
