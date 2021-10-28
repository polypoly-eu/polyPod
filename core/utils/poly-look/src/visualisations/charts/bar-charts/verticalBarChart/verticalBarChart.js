import * as d3 from "d3";

import { Chart } from "../../chart";

import "./verticalBarChart.css";

const initializingBarHeight = 2;
const margin = {
  top: 10,
  right: 0,
  bottom: 20,
  left: 40,
};
const barValueMargin = 4;
const gridXMargin = 12;

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * @class
 * @extends Chart
 * @param Object[] data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 300} [height] - The height of the svg
 * @param {string|callback = "blue"} [barColor] - The color of the bar (callbacks receive event and data)
 * @param {string = null} [barValueColor] - The color the values are shown in (default = no values shown)
 * @param {number = 4} [numberTicksY] - Number of Ticks on the y-axis (will deviate by 1 if the values wouldn't make a nice scale otherwise)
 */
export class VerticalBarChart extends Chart {
  constructor({
    type,
    selector,
    data,
    barColor = "blue",
    width = 400,
    height = 300,
    barValueColor,
    numberTicksY,
  }) {
    super({ type, selector, data, width, height, margin });
    this._barColor = barColor || "blue";
    this._xScale = d3.scaleBand().range([0, this.chartWidth]).padding(0.2);
    this._yScale = d3
      .scaleLinear()
      .range([this.chartHeight, this.margin.bottom]);
    this._barValueColor = barValueColor;
    this._numberTicksY = numberTicksY || 4;
  }

  adaptScalesToData() {
    this._xScale.domain(this.data.map((d) => d.title));
    this._yScale.domain([0, d3.max(this.data, (d) => d.value)]);
  }

  addAxis() {
    this.chart
      .append("g")
      .call(
        d3
          .axisLeft(this._yScale)
          .tickFormat((d) => d)
          .ticks(this._numberTicksY)
      )
      .attr("class", "y-axis axis")
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    this.chart
      .append("g")
      .attr("class", "x-axis axis")
      .call(d3.axisBottom(this._xScale))
      .attr("transform", `translate(0, ${this.chartHeight})`);
  }

  //TODO: transition of y-axis
  transitionAxis() {
    this.chart.selectAll(".y-axis").remove();
    this.chart
      .append("g")
      .call(
        d3
          .axisLeft(this._yScale)
          .tickFormat((d) => d)
          .ticks(5)
      )
      .attr("class", "y-axis axis")
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    this.chart
      .transition()
      .selectAll(".x-axis")
      .call(d3.axisBottom(this._xScale))
      .attr("transform", `translate(0, ${this.chartHeight})`);
  }

  updateExistingBars(bars) {
    bars
      .transition()
      .duration(750)
      .attr("y", this.chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("x", (d) => this._xScale(d.title))
      .attr("width", this._xScale.bandwidth())
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .attr("y", (d) => this._yScale(d.value))
      .attr("height", (d) => this.chartHeight - this._yScale(d.value));
  }

  addEnteringBars(bars) {
    bars
      .enter()
      .append("rect")
      .attr("y", this.chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("x", (d) => this._xScale(d.title))
      .attr("width", this._xScale.bandwidth())
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr("y", (d) => this._yScale(d.value))
      .attr("height", (d) => this.chartHeight - this._yScale(d.value));
  }

  addEnteringBarValues(barValues) {
    barValues
      .enter()
      .append("text")
      .attr("x", (d) => this._xScale(d.title) + this._xScale.bandwidth() / 2)
      .attr("class", "bar-value")
      .attr("text-anchor", "middle")
      .attr("y", (d) => this._yScale(d.value) - barValueMargin)
      .text((d) => d.value)
      .attr("fill", "transparent")
      .style("font-size", "10px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  updateExistingBarValues(barValues) {
    barValues
      .attr("fill", "transparent")
      .attr("y", (d) => this._yScale(d.value) - barValueMargin)
      .text((d) => d.value)
      .raise()
      .transition()
      .delay(1500)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  addYAxisGrid() {
    this.chart.select(".axis-grid").remove();
    this.chart
      .append("g")
      .attr("class", "axis-grid")
      .call(
        d3
          .axisLeft(this._yScale)
          .tickSize(-this.chartWidth + gridXMargin)
          .tickFormat("")
          .ticks(this._numberTicksY * 2)
      )
      .attr("transform", `translate(${gridXMargin / 2}, 0)`);
  }

  displayBars() {
    const bars = this.chart.selectAll(".bar").data(this.data, (d) => d.title);
    bars.exit().remove();
    this.updateExistingBars(bars);
    this.addEnteringBars(bars);
  }

  displayValues() {
    const barValues = this.chart
      .selectAll(".bar-value")
      .data(this._data, (d) => d.title);
    barValues.exit().remove();
    this.updateExistingBarValues(barValues);
    this.addEnteringBarValues(barValues);
  }

  render() {
    this.adaptScalesToData();
    if (this.chart.select(".x-axis").empty()) this.addAxis();
    else this.transitionAxis();
    this.displayBars();
    this.addYAxisGrid();
    if (this._barValueColor) this.displayValues();
    else this.chart.selectAll(".bar-value").remove();
  }
}
