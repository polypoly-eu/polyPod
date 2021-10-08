import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import "./mirroredBarChart.css";

export const MirroredBarChart = ({ data, colors, width, height }) => {
  const mirrorBarRef = useRef();

  //constants
  const upperBarColor = colors.upperBar,
    lowerBarColor = colors.lowerBar,
    margin = {
      top: 10,
      right: 40,
      bottom: 20,
      left: 0,
    },
    numberTicksY = 3,
    numberTicksX = 4,
    yGridMarginLeft = 18,
    yGridMarginRight = 24,
    barPadding = 10;

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
    xScale.domain([d3.max(data, (d) => d.time), 0]);
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
      .attr("x", (d) => xScale(d.time))
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", upperBarColor)
      .attr("class", "upper-bar")
      .attr("y", (d) => upperYScale(d.upper))
      .attr("height", (d) => chartHeight / 2 - upperYScale(d.upper));
  }

  function updateExistingUpperBars(upperBars) {
    upperBars
      .attr("x", (d) => xScale(d.time))
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", upperBarColor)
      .attr("y", (d) => upperYScale(d.upper))
      .attr("height", (d) => chartHeight / 2 - upperYScale(d.upper));
  }

  function addEnteringLowerBars(lowerBars) {
    lowerBars
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.time))
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", lowerBarColor)
      .attr("class", "upper-bar")
      .attr("y", chartHeight / 2)
      .attr("height", (d) => lowerYScale(d.lower));
  }

  function updateExistingLowerBars(lowerBars) {
    lowerBars
      .attr("x", (d) => xScale(d.time))
      .attr("width", (barSpace - totalBarPadding) / data.length)
      .attr("fill", lowerBarColor)
      .attr("y", chartHeight / 2)
      .attr("height", (d) => lowerYScale(d.lower));
  }

  function displayUpperBars(barChart) {
    const upperBars = barChart
      .selectAll(".upper-bar")
      .data(data, (d) => d.time);
    upperBars.exit().remove();
    updateExistingUpperBars(upperBars);
    addEnteringUpperBars(upperBars);
  }

  function displayLowerBars(barChart) {
    const lowerBars = barChart
      .selectAll(".lower-bar")
      .data(data, (d) => d.time);
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
