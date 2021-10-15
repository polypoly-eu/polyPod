import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import "./mirroredBarChart.css";

/**
 * Visualizes data as two bar charts mirrored on the x-axis.
 *
 * The y-scale is also mirrored and a x/y-grid is added.
 *
 * @function
 * @param {Object[]} data - The data to be visualized as a as two bar charts
 * @param {number} data[].key - The key x value for both charts
 * @param {number} data[].lower - The y value for the lower bar chart at key x value
 * @param {number} data[].upper - The y value for the lower bar chart at key x value
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 200} [height] - The height of the svg
 * @param {Object} [barColor] - The color of the bars
 * @param {string} [barColor.upperBarColor = "red"] - The color of the upper bars
 * @param {string} [barColor.lowerBarColor = "blue"] - The color of the lower bars
 * @param {number} [barPadding = 1] - The padding between the bars
 * @param {Object} [numberTicks] - The number of ticks for the axis
 * @param {number} [numberTicks.y = 4] - The number of ticks for the y axis scale
 * @param {number} [numberTicks.x = 5] - The number of ticks for the x axis scale
 * @returns {jsx-div with svg attached}
 */
export const MirroredBarChart = ({
  data,
  colors,
  width = 400,
  height = 200,
  barPadding = 1,
  numberTicks,
}) => {
  const mirrorBarRef = useRef();

  //constants
  const upperBarColor = colors?.upperBar || "red",
    lowerBarColor = colors?.lowerBar || "blue",
    margin = {
      top: 10,
      right: 40,
      bottom: 20,
      left: 0,
    },
    numberTicksY = numberTicks?.y || 4,
    numberTicksX = numberTicks?.x || 5,
    yGridMarginLeft = 18,
    yGridMarginRight = 24;

  //derived constants
  const chartHeight = height - margin.bottom - margin.top,
    chartWidth = width - margin.left - margin.right,
    barSpace = chartWidth - yGridMarginLeft - yGridMarginRight,
    totalBarPadding = data.length * barPadding;

  const xScale = d3
      .scaleLinear()
      .range([0 + yGridMarginLeft, chartWidth - yGridMarginRight]),
    upperYScale = d3.scaleLinear().range([chartHeight / 2, 0]),
    lowerYScale = d3.scaleLinear().range([0, chartHeight / 2]);

  function adaptScalesToData() {
    xScale.domain([d3.max(data, (d) => d.key), 0]);
    lowerYScale
      .domain([0, d3.max(data, (d) => Math.max(d.upper, d.lower))])
      .nice(numberTicksY);
    upperYScale
      .domain([0, d3.max(data, (d) => Math.max(d.upper, d.lower))])
      .nice(numberTicksY);
  }

  function createSVG() {
    return d3
      .select(mirrorBarRef.current)
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

  function addXAxis(barChart) {
    barChart
      .append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(xScale).ticks(numberTicksX))
      .attr("transform", `translate(0, ${chartHeight})`);
  }

  function addUpperYAxis(barChart) {
    barChart
      .append("g")
      .call(
        d3
          .axisRight(upperYScale)
          .tickFormat((d) => d)
          .ticks(numberTicksY)
      )
      .attr("class", "y-axis")
      .attr("transform", `translate(${chartWidth}, 0)`)
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");
  }

  function addLowerYAxis(barChart) {
    barChart
      .append("g")
      .call(
        d3
          .axisRight(lowerYScale)
          .tickFormat((d) => d)
          .ticks(numberTicksY)
      )
      .attr("class", "y-axis")
      .attr("transform", `translate(${chartWidth}, ${chartHeight / 2})`)
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");
  }

  function addYAxis(barChart) {
    addUpperYAxis(barChart);
    addLowerYAxis(barChart);
  }

  function addXGrid(barChart) {
    barChart
      .append("g")
      .attr("class", "axis-grid")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-chartHeight)
          .tickFormat("")
          .ticks(numberTicksX)
      );
  }

  function addUpperYGrid(barChart) {
    barChart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(upperYScale)
          .tickSize(-chartWidth + 20)
          .tickFormat("")
          .ticks(numberTicksY)
      )
      .attr("transform", `translate(${yGridMarginLeft}, 0)`);
  }

  function addLowerYGrid(barChart) {
    barChart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(lowerYScale)
          .tickSize(-chartWidth + 20)
          .tickFormat("")
          .ticks(numberTicksY)
      )
      .attr("transform", `translate(${yGridMarginLeft}, ${chartHeight / 2})`);
  }

  function addYGrid(barChart) {
    addUpperYGrid(barChart);
    addLowerYGrid(barChart);
  }

  function addGrid(barChart) {
    addXGrid(barChart);
    addYGrid(barChart);
  }

  function addAxis(barChart) {
    addXAxis(barChart);
    addYAxis(barChart);
    addGrid(barChart);
  }

  function addEnteringUpperBars(upperBars) {
    upperBars
      .enter()
      .append("rect")
      .attr(
        "x",
        (d) => xScale(d.key) - (barSpace - totalBarPadding) / data.length
      )
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", upperBarColor)
      .attr("class", "upper-bar")
      .attr("y", (d) => upperYScale(d.upper))
      .attr("height", (d) => chartHeight / 2 - upperYScale(d.upper));
  }

  function updateExistingUpperBars(upperBars) {
    upperBars
      .attr(
        "x",
        (d) => xScale(d.key) - (barSpace - totalBarPadding) / data.length
      )
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", upperBarColor)
      .attr("y", (d) => upperYScale(d.upper))
      .attr("height", (d) => chartHeight / 2 - upperYScale(d.upper));
  }

  function addEnteringLowerBars(lowerBars) {
    lowerBars
      .enter()
      .append("rect")
      .attr(
        "x",
        (d) => xScale(d.key) - (barSpace - totalBarPadding) / data.length
      )
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", lowerBarColor)
      .attr("class", "upper-bar")
      .attr("y", chartHeight / 2)
      .attr("height", (d) => lowerYScale(d.lower));
  }

  function updateExistingLowerBars(lowerBars) {
    lowerBars
      .attr(
        "x",
        (d) => xScale(d.key) - (barSpace - totalBarPadding) / data.length
      )
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", lowerBarColor)
      .attr("y", chartHeight / 2)
      .attr("height", (d) => lowerYScale(d.lower));
  }

  function displayUpperBars(barChart) {
    const upperBars = barChart.selectAll(".upper-bar").data(data, (d) => d.key);
    upperBars.exit().remove();
    updateExistingUpperBars(upperBars);
    addEnteringUpperBars(upperBars);
  }

  function displayLowerBars(barChart) {
    const lowerBars = barChart.selectAll(".lower-bar").data(data, (d) => d.key);
    lowerBars.exit().remove();
    updateExistingLowerBars(lowerBars);
    addEnteringLowerBars(lowerBars);
  }

  function displayBars(barChart) {
    displayUpperBars(barChart);
    displayLowerBars(barChart);
  }

  function drawOriginGridline(barChart) {
    barChart
      .append("rect")
      .attr("class", "origin-gridline")
      .attr("x", yGridMarginLeft)
      .attr("y", chartHeight / 2)
      .attr("width", barSpace)
      .attr("height", 1);
  }

  useEffect(() => {
    adaptScalesToData();
    let barChart = d3.select(mirrorBarRef.current).select(".chart");
    if (barChart.empty()) barChart = addChart(createSVG());
    if (barChart.select(".x-axis").empty()) addAxis(barChart);
    displayBars(barChart);
    if (barChart.select(".origin-gridline").empty())
      drawOriginGridline(barChart);
  }),
    [];

  return <div ref={mirrorBarRef} className="mirrored-bar-chart"></div>;
};
