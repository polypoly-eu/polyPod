import * as d3 from "d3";

import { Chart } from "../chart";

import "mirroredBarChart.css";

const margin = {
  top: 10,
  right: 40,
  bottom: 20,
  left: 0,
};
const yGridMarginLeft = 18;
const yGridMarginRight = 24;

/**
 * Visualizes data as two bar charts mirrored on the x-axis.
 *
 * The y-scale is also mirrored and a x/y-grid is added.
 *
 * @class
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
 */
export class MirroredBarChart extends Chart {
  constructor({
    data,
    colors,
    width = 400,
    height = 200,
    barPadding = 1,
    numberTicks,
  }) {
    super({ data, width, height, margin });
    this.upperBarColor = colors?.upperBar || "red";
    this.lowerBarColor = colors?.lowerBar || "blue";
    this.numberTicksY = numberTicks?.y || 4;
    this.numberTicksX = numberTicks?.x || 5;
    this.barPadding = barPadding;
    this.barSpace = this.chartWidth - yGridMarginLeft - yGridMarginRight;
    this.totalBarPadding = this.data.length * barPadding;

    this.xScale = d3
      .scaleLinear()
      .range([0 + yGridMarginLeft, this.chartWidth - yGridMarginRight]);
    this.upperYScale = d3.scaleLinear().range([this.chartHeight / 2, 0]);
    this.lowerYScale = d3.scaleLinear().range([0, this.chartHeight / 2]);
  }

  adaptScalesToData() {
    this.xScale.domain([d3.max(this.data, (d) => d.key), 0]);
    this.lowerYScale
      .domain([0, d3.max(this.data, (d) => Math.max(d.upper, d.lower))])
      .nice(this.numberTicksY);
    this.upperYScale
      .domain([0, d3.max(this.data, (d) => Math.max(d.upper, d.lower))])
      .nice(this.numberTicksY);
  }

  addXAxis() {
    this.chart
      .append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(this.xScale).ticks(this.numberTicksX))
      .attr("transform", `translate(0, ${this.chartHeight})`);
  }

  addUpperYAxis() {
    this.chart
      .append("g")
      .call(
        d3
          .axisRight(this.upperYScale)
          .tickFormat((d) => d)
          .ticks(this.numberTicksY)
      )
      .attr("class", "y-axis")
      .attr("transform", `translate(${this.chartWidth}, 0)`)
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");
  }

  addLowerYAxis() {
    this.chart
      .append("g")
      .call(
        d3
          .axisRight(this.lowerYScale)
          .tickFormat((d) => d)
          .ticks(this.numberTicksY)
      )
      .attr("class", "y-axis")
      .attr(
        "transform",
        `translate(${this.chartWidth}, ${this.chartHeight / 2})`
      )
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");
  }

  addYAxis() {
    this.addUpperYAxis();
    this.addLowerYAxis();
  }

  addXGrid() {
    this.chart
      .append("g")
      .attr("class", "axis-grid")
      .attr("transform", "translate(0," + this.chartHeight + ")")
      .call(
        d3
          .axisBottom(this.xScale)
          .tickSize(-this.chartHeight)
          .tickFormat("")
          .ticks(this.numberTicksX)
      );
  }

  addUpperYGrid() {
    this.chart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(this.upperYScale)
          .tickSize(-this.chartWidth + 20)
          .tickFormat("")
          .ticks(this.numberTicksY)
      )
      .attr("transform", `translate(${yGridMarginLeft}, 0)`);
  }

  addLowerYGrid() {
    this.chart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(this.lowerYScale)
          .tickSize(-this.chartWidth + 20)
          .tickFormat("")
          .ticks(this.numberTicksY)
      )
      .attr(
        "transform",
        `translate(${yGridMarginLeft}, ${this.chartHeight / 2})`
      );
  }

  addYGrid() {
    this.addUpperYGrid();
    this.addLowerYGrid();
  }

  addGrid() {
    this.addXGrid();
    this.addYGrid();
  }

  addAxis() {
    this.addXAxis();
    this.addYAxis();
    this.addGrid();
  }

  addEnteringUpperBars(upperBars) {
    upperBars
      .enter()
      .append("rect")
      .attr(
        "x",
        (d) =>
          this.xScale(d.key) -
          (this.barSpace - this.totalBarPadding) / this.data.length
      )
      .attr("width", (this.barSpace - this.totalBarPadding) / this.data.length)
      .attr("fill", this.upperBarColor)
      .attr("class", "upper-bar")
      .attr("y", (d) => this.upperYScale(d.upper))
      .attr("height", (d) => this.chartHeight / 2 - this.upperYScale(d.upper));
  }

  updateExistingUpperBars(upperBars) {
    upperBars
      .attr(
        "x",
        (d) =>
          this.xScale(d.key) -
          (this.barSpace - this.totalBarPadding) / this.data.length
      )
      .attr("width", (this.barSpace - this.totalBarPadding) / this.data.length)
      .attr("fill", this.upperBarColor)
      .attr("y", (d) => this.upperYScale(d.upper))
      .attr("height", (d) => this.chartHeight / 2 - this.upperYScale(d.upper));
  }

  addEnteringLowerBars(lowerBars) {
    lowerBars
      .enter()
      .append("rect")
      .attr(
        "x",
        (d) =>
          this.xScale(d.key) -
          (this.barSpace - this.totalBarPadding) / this.data.length
      )
      .attr("width", (this.barSpace - this.totalBarPadding) / this.data.length)
      .attr("fill", this.lowerBarColor)
      .attr("class", "upper-bar")
      .attr("y", this.chartHeight / 2)
      .attr("height", (d) => this.lowerYScale(d.lower));
  }

  updateExistingLowerBars(lowerBars) {
    lowerBars
      .attr(
        "x",
        (d) =>
          this.xScale(d.key) -
          (this.barSpace - this.totalBarPadding) / this.data.length
      )
      .attr("width", (this.barSpace - this.totalBarPadding) / this.data.length)
      .attr("fill", this.lowerBarColor)
      .attr("y", this.chartHeight / 2)
      .attr("height", (d) => this.lowerYScale(d.lower));
  }

  displayUpperBars() {
    const upperBars = this.chart
      .selectAll(".upper-bar")
      .data(this.data, (d) => d.key);
    upperBars.exit().remove();
    this.updateExistingUpperBars(upperBars);
    this.addEnteringUpperBars(upperBars);
  }

  displayLowerBars() {
    const lowerBars = this.chart
      .selectAll(".lower-bar")
      .data(this.data, (d) => d.key);
    lowerBars.exit().remove();
    this.updateExistingLowerBars(lowerBars);
    this.addEnteringLowerBars(lowerBars);
  }

  displayBars() {
    this.displayUpperBars();
    this.displayLowerBars();
  }

  drawOriginGridline() {
    this.chart
      .append("rect")
      .attr("class", "origin-gridline")
      .attr("x", yGridMarginLeft)
      .attr("y", this.chartHeight / 2)
      .attr("width", this.barSpace)
      .attr("height", 1);
  }

  render() {
    this.adaptScalesToData();
    if (this.chart.select(".x-axis").empty()) this.addAxis();
    if (this.chart.select(".origin-gridline").empty())
      this.drawOriginGridline();
    this.displayBars();
  }
}
