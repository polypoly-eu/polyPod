import * as d3 from "d3";

import { Chart } from "../chart";

const initializingBarHeight = 2;
const margin = {
  top: 10,
  right: 0,
  bottom: 20,
  left: 40,
};

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
 */
export class VerticalBarChart extends Chart {
  constructor({ data, barColor = "blue", width = 400, height = 300 }) {
    super({ data, width, height, margin });
    this.barColor = barColor || "blue";
    this.xScale = d3.scaleBand().range([0, this.chartWidth]).padding(0.2);
    this.yScale = d3
      .scaleLinear()
      .range([this.chartHeight, this.margin.bottom]);
  }

  adaptScalesToData() {
    this.xScale.domain(this.data.map((d) => d.title));
    this.yScale.domain([0, d3.max(this.data, (d) => d.value)]);
  }

  addAxis() {
    this.chart
      .append("g")
      .call(
        d3
          .axisLeft(this.yScale)
          .tickFormat((d) => d)
          .ticks(5)
      )
      .attr("class", "y-axis")
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    this.chart
      .append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(this.xScale))
      .attr("transform", `translate(0, ${this.chartHeight})`);
  }

  //TODO: transition of y-axis
  transitionAxis() {
    this.chart.selectAll(".y-axis").remove();
    this.chart
      .append("g")
      .call(
        d3
          .axisLeft(this.yScale)
          .tickFormat((d) => d)
          .ticks(5)
      )
      .attr("class", "y-axis")
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

    this.chart
      .transition()
      .selectAll(".x-axis")
      .call(d3.axisBottom(this.xScale))
      .attr("transform", `translate(0, ${this.chartHeight})`);
  }

  updateExistingBars(bars) {
    bars
      .transition()
      .duration(750)
      .attr("y", this.chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("x", (d) => this.xScale(d.title))
      .attr("width", this.xScale.bandwidth())
      .attr("fill", this.barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .attr("y", (d) => this.yScale(d.value))
      .attr("height", (d) => this.chartHeight - this.yScale(d.value));
  }

  addEnteringBars(bars) {
    bars
      .enter()
      .append("rect")
      .attr("y", this.chartHeight - initializingBarHeight)
      .attr("height", initializingBarHeight)
      .attr("x", (d) => this.xScale(d.title))
      .attr("width", this.xScale.bandwidth())
      .attr("fill", this.barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr("y", (d) => this.yScale(d.value))
      .attr("height", (d) => this.chartHeight - this.yScale(d.value));
  }

  displayBars() {
    const bars = this.chart.selectAll(".bar").data(this.data, (d) => d.title);
    bars.exit().remove();
    this.updateExistingBars(bars);
    this.addEnteringBars(bars);
  }

  render() {
    this.adaptScalesToData();
    if (this.chart.select(".x-axis").empty()) this.addAxis();
    else this.transitionAxis();
    this.displayBars();
  }
}
