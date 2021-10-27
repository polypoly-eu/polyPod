import React, { useEffect, useRef } from "react";

import * as d3 from "d3";

import "./verticalBarChart.css";

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
 * @param {number = adaptive} [barWidth] - The width of the bars
 * @param {string|callback = "blue"} [barColor] - The color of the bar (callbacks receive event and data)
 * @param {string = null} [barValues] - The color the values are shown in (default = no values shown)
 * @returns {jsx-div with svg attached}
 */
export const VerticalBarChart = ({
  data,
  barColor = "blue",
  width = 400,
  height = 200,
  barWidth,
  barValues = false,
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
    initializingBarHeight = 2,
    barValueMargin = 4,
    numberTicksY = 4,
    gridXMargin = 12;

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

  function addAxis(barChart) {
    barChart
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => d)
          .ticks(numberTicksY)
      )
      .attr("class", "y-axis axis")
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    barChart
      .append("g")
      .attr("class", "x-axis axis")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(0, ${chartHeight})`);
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
      .attr("class", "y-axis axis")
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
  }

  function updateExistingBars(barChart) {
    barChart
      .selectAll(".bar-group")
      .select(".bar")
      .transition()
      .duration(750)
      .attr("y", chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("x", (d) =>
        barWidth
          ? xScale(d.title) + (xScale.bandwidth() - barWidth) / 2
          : xScale(d.title)
      )
      .attr("width", barWidth || xScale.bandwidth())
      .attr("fill", barColor)
      .transition()
      .duration(750)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => chartHeight - yScale(d.value));
  }

  function addEnteringBars(enteringBarGroups) {
    enteringBarGroups
      .append("rect")
      .attr("y", chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("class", "bar")
      .attr("x", (d) =>
        barWidth
          ? xScale(d.title) + (xScale.bandwidth() - barWidth) / 2
          : xScale(d.title)
      )
      .attr("width", barWidth || xScale.bandwidth())
      .attr("fill", barColor)
      .transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => chartHeight - yScale(d.value));
  }

  function addEnteringBarValues(enteringBarGroups) {
    enteringBarGroups
      .append("text")
      .attr("x", (d) => xScale(d.title) + xScale.bandwidth() / 2)
      .attr("class", "bar-value")
      .attr("text-anchor", "middle")
      .attr("y", (d) => yScale(d.value) - barValueMargin)
      .text((d) => d.value)
      .attr("fill", "transparent")
      .style("font-size", "10px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", barValues);
  }

  function updateExistingBarValues(barChart) {
    barChart
      .selectAll(".bar-group")
      .select(".bar-value")
      .attr("fill", "transparent")
      .attr("y", (d) => yScale(d.value) - barValueMargin)
      .text((d) => d.value)
      .transition()
      .delay(1500)
      .duration(500)
      .attr("fill", barValues);
  }

  function addYAxisGrid(barChart) {
    barChart.select(".axis-grid").remove();
    barChart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-chartWidth + gridXMargin)
          .tickFormat("")
          .ticks(numberTicksY)
      )
      .attr("transform", `translate(${gridXMargin / 2}, 0)`);
  }

  function displayBars(barChart) {
    const barGroups = barChart
      .selectAll(".bar-group")
      .data(data, (d) => d.title);
    barGroups.exit().remove();
    const enteringBarGroups = barGroups
      .enter()
      .append("g")
      .attr("class", "bar-group");
    updateExistingBars(barChart);
    addEnteringBars(enteringBarGroups);
    if (barValues) {
      updateExistingBarValues(barChart);
      addEnteringBarValues(enteringBarGroups);
    }
  }

  useEffect(() => {
    adaptScalesToData();

    let barChart = d3.select(barChartRef.current).select(".chart");
    if (barChart.empty()) barChart = addChart(createSVG());

    if (barChart.select(".x-axis").empty()) addAxis(barChart);
    else transitionAxis(barChart);
    displayBars(barChart);
    addYAxisGrid(barChart);
  });

  return <div className="bar-chart vertical-bar-chart" ref={barChartRef}></div>;
};
