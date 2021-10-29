import * as d3 from "d3";

import { Chart } from "../../chart";

import "./mirroredBarChart.css";

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
    type,
    selector,
    data,
    colors,
    width = 400,
    height = 200,
    barPadding = 1,
    numberTicks,
  }) {
    super({ selector, type, data, width, height, margin });
    this._upperBarColor = colors?.upperBar || "red";
    this._lowerBarColor = colors?.lowerBar || "blue";
    this._numberTicksY = numberTicks?.y || 4;
    this._numberTicksX = numberTicks?.x || 5;
    this._barSpace = this.chartWidth - yGridMarginLeft - yGridMarginRight;
    this._totalBarPadding = this.data.length * barPadding;

    this._xScale = d3
      .scaleLinear()
      .range([0 + yGridMarginLeft, this.chartWidth - yGridMarginRight]);
    this._upperYScale = d3.scaleLinear().range([this.chartHeight / 2, 0]);
    this._lowerYScale = d3.scaleLinear().range([0, this.chartHeight / 2]);
  }

  _adaptScalesToData() {
    this._xScale.domain([d3.max(this.data, (d) => d.key), 0]);
    this._lowerYScale
      .domain([0, d3.max(this.data, (d) => Math.max(d.upper, d.lower))])
      .nice(this._numberTicksY);
    this._upperYScale
      .domain([0, d3.max(this.data, (d) => Math.max(d.upper, d.lower))])
      .nice(this._numberTicksY);
  }

  _addXAxis() {
    this.chart
      .append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(this._xScale).ticks(this._numberTicksX))
      .attr("transform", `translate(0, ${this.chartHeight})`);
  }

  _addUpperYAxis() {
    this.chart
      .append("g")
      .call(
        d3
          .axisRight(this._upperYScale)
          .tickFormat((d) => d)
          .ticks(this._numberTicksY)
      )
      .attr("class", "y-axis")
      .attr("transform", `translate(${this.chartWidth}, 0)`)
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");
  }

  _addLowerYAxis() {
    this.chart
      .append("g")
      .call(
        d3
          .axisRight(this._lowerYScale)
          .tickFormat((d) => d)
          .ticks(this._numberTicksY)
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

  _addYAxis() {
    this._addUpperYAxis();
    this._addLowerYAxis();
  }

  _addXGrid() {
    this.chart
      .append("g")
      .attr("class", "axis-grid")
      .attr("transform", "translate(0," + this.chartHeight + ")")
      .call(
        d3
          .axisBottom(this._xScale)
          .tickSize(-this.chartHeight)
          .tickFormat("")
          .ticks(this._numberTicksX)
      );
  }

  _addUpperYGrid() {
    this.chart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(this._upperYScale)
          .tickSize(-this.chartWidth + 20)
          .tickFormat("")
          .ticks(this._numberTicksY)
      )
      .attr("transform", `translate(${yGridMarginLeft}, 0)`);
  }

  _addLowerYGrid() {
    this.chart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(this._lowerYScale)
          .tickSize(-this.chartWidth + 20)
          .tickFormat("")
          .ticks(this._numberTicksY)
      )
      .attr(
        "transform",
        `translate(${yGridMarginLeft}, ${this.chartHeight / 2})`
      );
  }

  _addYGrid() {
    this._addUpperYGrid();
    this._addLowerYGrid();
  }

  _addGrid() {
    this._addXGrid();
    this._addYGrid();
  }

  _addAxis() {
    this._addXAxis();
    this._addYAxis();
    this._addGrid();
  }

  _addEnteringUpperBars(upperBars) {
    upperBars
      .enter()
      .append("rect")
      .attr(
        "x",
        (d) =>
          this._xScale(d.key) -
          (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr(
        "width",
        (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr("fill", this._upperBarColor)
      .attr("class", "upper-bar")
      .attr("y", (d) => this._upperYScale(d.upper))
      .attr("height", (d) => this.chartHeight / 2 - this._upperYScale(d.upper));
  }

  _updateExistingUpperBars(upperBars) {
    upperBars
      .attr(
        "x",
        (d) =>
          this._xScale(d.key) -
          (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr(
        "width",
        (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr("fill", this._upperBarColor)
      .attr("y", (d) => this._upperYScale(d.upper))
      .attr("height", (d) => this.chartHeight / 2 - this._upperYScale(d.upper));
  }

  _addEnteringLowerBars(lowerBars) {
    lowerBars
      .enter()
      .append("rect")
      .attr(
        "x",
        (d) =>
          this._xScale(d.key) -
          (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr(
        "width",
        (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr("fill", this._lowerBarColor)
      .attr("class", "upper-bar")
      .attr("y", this.chartHeight / 2)
      .attr("height", (d) => this._lowerYScale(d.lower));
  }

  _updateExistingLowerBars(lowerBars) {
    lowerBars
      .attr(
        "x",
        (d) =>
          this._xScale(d.key) -
          (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr(
        "width",
        (this._barSpace - this._totalBarPadding) / this.data.length
      )
      .attr("fill", this._lowerBarColor)
      .attr("y", this.chartHeight / 2)
      .attr("height", (d) => this._lowerYScale(d.lower));
  }

  _displayUpperBars() {
    const upperBars = this.chart
      .selectAll(".upper-bar")
      .data(this.data, (d) => d.key);
    upperBars.exit().remove();
    this._updateExistingUpperBars(upperBars);
    this._addEnteringUpperBars(upperBars);
  }

  _displayLowerBars() {
    const lowerBars = this.chart
      .selectAll(".lower-bar")
      .data(this.data, (d) => d.key);
    lowerBars.exit().remove();
    this._updateExistingLowerBars(lowerBars);
    this._addEnteringLowerBars(lowerBars);
  }

  _displayBars() {
    this._displayUpperBars();
    this._displayLowerBars();
  }

  _drawOriginGridline() {
    this.chart
      .append("rect")
      .attr("class", "origin-gridline")
      .attr("x", yGridMarginLeft)
      .attr("y", this.chartHeight / 2)
      .attr("width", this._barSpace)
      .attr("height", 1);
  }

  render() {
    this._adaptScalesToData();
    if (this.chart.select(".x-axis").empty()) this._addAxis();
    if (this.chart.select(".origin-gridline").empty())
      this._drawOriginGridline();
    this._displayBars();
  }
}
