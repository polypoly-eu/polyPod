import * as d3 from "d3";

import { Chart } from "../../chart";

import "./horizontalBarChart.css";
const initializingBarHeight = 2;
const margin = {
  top: 10,
  right: 0,
  bottom: 20,
  left: 0,
};
const barValueMargin = 4;
const barPadding = 0.2;
const groupHeadlineHeight = 14;
const headlinePadding = 6;

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * @class
 * @extends Chart
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 200} [height] - The height of the svg
 * @param {string|callback = "blue"} [barColor] - The color of the bar (callbacks receive event and data)
 * @param {string = null} [barValueColor] - The color the values are shown in (default = no values shown)
 * @param {number = 4} [numberTicksY] - Number of Ticks on the y-axis (will deviate by 1 if the values wouldn't make a nice scale otherwise)
 */
export class HorizontalBarChart extends Chart {
  constructor({
    selector,
    data,
    barColor = "blue",
    width = 400,
    height = 400,
    barValueColor,
    barWidth,
    numberTicksX,
    groups,
  }) {
    super({ selector, data, width, height, margin });
    this.groups = groups;
    this._barColor = barColor || "blue";
    this._barWidth = barWidth;
    this._xScale = d3.scaleLinear().range([0, this.chartWidth]);
    this._yScales = this._getYscales(groups);
    this._barValueColor = barValueColor;
    this._numberTicksX = numberTicksX || 4;
  }

  _getYscales(groups) {
    if (groups) {
      const _yScales = [];
      for (let group of groups) {
        const relevantBars = this.data.filter((data)=> data.group === group.id).length
        const scale = d3
          .scaleBand()
          .range([groupHeadlineHeight + headlinePadding, relevantBars *  ]);
      }
    } else {
      return [d3.scaleBand().range([0, this.chartHeight]).padding(barPadding)];
    }
  }

  _adaptScalesToData() {
    this._xScale.domain([0, d3.max(this.data, (d) => d.value)]);
    if (this.grouped) {
      const ownedByFaceBook = this.data
        .filter((d) => d.facebookGroup)
        .map((d) => d.title)
        .unshift("Owned By Facebook");
      const other = this.data
        .filter((d) => !d.facebookGroup)
        .map((d) => d.title)
        .unshift("Other");
      const domain = [...ownedByFaceBook, ...other];
      this._yScale.domain(domain);
    } else this._yScale.domain(this.data.map((d) => d.title));
  }

  _addAxis() {
    this.chart
      .append("g")
      .call(d3.axisLeft(this._yScale))
      .attr("class", "y-axis axis")
      .append("text")
      .attr("y", 0)
      .attr("dy", 0)
      .attr("text-anchor", "end")
      .text("value");

    this.chart
      .append("g")
      .attr("class", "x-axis axis")
      .call(
        d3
          .axisBottom(this._xScale)
          .tickFormat((d) => d)
          .ticks(this._numberTicksX)
      )
      .attr("transform", `translate(0, ${this.chartHeight})`);
  }

  //TODO: transition of y-axis
  _transitionAxis() {
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
      .attr("x", 0)
      .attr("width", (d) => this._xScale(d.value));
  }

  _updateExistingBars(bars) {
    bars
      .transition()
      .duration(750)
      .attr("x", 0)
      .attr("width", initializingBarHeight)
      .attr("y", (d) =>
        this._barWidth
          ? this._yScale(d.title) +
            (this._yScale.bandwidth() - this._barWidth) / 2
          : this._yScale(d.title)
      )
      .attr("height", this._barWidth || this._yScale.bandwidth())
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .attr("x", 0)
      .attr("width", (d) => this._xScale(d.value));
  }

  _addEnteringBarLabels(barLabels) {
    barLabels
      .enter()
      .append("text")
      .attr("y", (d) => this._yScale(d.title))
      .attr("class", "bar-value")
      .attr("x", 0)
      .text((d) => d.title)
      .attr("fill", "transparent")
      .style("font-size", "15px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  _addEnteringBars(bars) {
    bars
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("width", initializingBarHeight)
      .attr("y", (d) => this._yScale(d.title) + this._yScale.bandwidth() / 4)
      .attr("height", this._yScale.bandwidth() / 2)
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr("x", 0)
      .attr("width", (d) => this._xScale(d.value));
  }

  _addEnteringBarValues(barValues) {
    barValues
      .enter()
      .append("text")
      .attr("y", (d) => this._yScale(d.title) + this._yScale.bandwidth() / 2)
      .attr("class", "bar-value")
      .attr("text-anchor", "middle")
      .attr("x", (d) => this._xScale(d.value) - barValueMargin)
      .text((d) => d.value)
      .attr("fill", "transparent")
      .style("font-size", "10px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  _updateExistingBarValues(barValues) {
    barValues
      .attr("fill", "transparent")
      .attr("x", 0)
      .text((d) => d.value)
      .raise()
      .transition()
      .delay(1500)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  _displayBars() {
    const bars = this.chart.selectAll(".bar").data(this.data, (d) => d.title);
    bars.exit().remove();
    // this._updateExistingBars(bars);
    if (this.grouped) this._addEnteringBars(bars);
    else this._addEnteringBar(bars);
  }

  _displayValues() {
    const barValues = this.chart
      .selectAll(".bar-value")
      .data(this._data, (d) => d.title);
    barValues.exit().remove();
    // this._updateExistingBarValues(barValues);
    this._addEnteringBarValues(barValues);
    if (this.grouped) this._addEnteringBarGroupedLabels(barValues);
    else this._addEnteringBarLabels(barValues);
  }

  render() {
    this._adaptScalesToData();
    if (this._barValueColor) this._displayValues();
    this._displayBars();
    // else this.chart.selectAll(".bar-value").remove();
  }
}
