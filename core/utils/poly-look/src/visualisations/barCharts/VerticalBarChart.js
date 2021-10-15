import * as d3 from "d3";

const initializingBarHeight = 2;

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * @class
 * @param {string} id - The id of the div element the chart is added to
 * @param Object[] data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 300} [height] - The height of the svg
 * @param {string|callback = "blue"} [barColor] - The color of the bar (callbacks receive event and data)
 */

export class VerticalBarChart {
  constructor({ id, data, barColor = "blue", width = 400, height = 300 }) {
    this.id = id;
    this.data = data;
    this.barColor = barColor || "blue";
    this.width = width || 400;
    this.height = height || 300;
    //constants
    this.margin = {
      top: 10,
      right: 0,
      bottom: 20,
      left: 40,
    };
    this.chartHeight = height - this.margin.bottom - this.margin.top;
    this.chartWidth = width - this.margin.left - this.margin.right;
    this.xScale = d3.scaleBand().range([0, this.chartWidth]).padding(0.2);
    this.yScale = d3
      .scaleLinear()
      .range([this.chartHeight, this.margin.bottom]);
  }

  get chart() {
    const chart = d3.select("#" + this.id).select(".chart");
    return chart.empty() ? this.generateChart() : chart;
  }

  adaptScalesToData() {
    this.xScale.domain(this.data.map((d) => d.title));
    this.yScale.domain([0, d3.max(this.data, (d) => d.value)]);
  }

  createSVG() {
    return d3
      .select("#" + this.id)
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
  }

  generateChart() {
    return this.createSVG()
      .append("g")
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .attr("class", "chart");
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
