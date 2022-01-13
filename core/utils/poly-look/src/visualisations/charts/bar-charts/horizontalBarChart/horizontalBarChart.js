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
    //barWidth is actually bar height since it is a horizontal bar chart but for all intents and purposes it is the bar's width
    barWidth,
    numberTicksX,
    groups,
  }) {
    super({ selector, data, width, height, margin });
    this._groups = groups;
    this._barColor = barColor || "blue";
    this._barWidth = barWidth;
    this._xScale = d3.scaleLinear().range([0, this.chartWidth]);
    this._yScales = this._getYscales(groups);
    this._barValueColor = barValueColor;
    this._numberTicksX = numberTicksX || 4;
  }

  _getYscales(groups) {
    if (groups) {
      const yScales = [];
      let headingSpace = groupHeadlineHeight + headlinePadding;
      for (let group of groups) {
        const relevantBars = this.data.filter(
          (data) => data.group === group.id
        ).length;
        // totalSpan * barPadding = paddingSpan
        const barsSpan = relevantBars * this._barWidth;
        const paddingSpan = barsSpan / (1 / barPadding - 1);
        const totalSpan = barsSpan + relevantBars * paddingSpan;
        // const totalSpan = barsSpan;
        const scale = d3
          .scaleBand()
          .range([headingSpace, totalSpan])
          .padding(barPadding);
        headingSpace = headingSpace + totalSpan;
        yScales.push({ scale, id: group.id });
      }
      return yScales;
    } else {
      return [
        {
          scale: d3
            .scaleBand()
            .range([0, this.chartHeight])
            .padding(barPadding),
        },
      ];
    }
  }

  _adaptScalesToData() {
    this._xScale.domain([0, d3.max(this.data, (d) => d.value)]);
    for (let scale of this._yScales) {
      const relevantData = scale.id
        ? this.data
            .filter((data) => data.group === scale.id)
            .map((data) => data.title)
        : this.data.map((data) => data.title);
      scale.scale.domain(relevantData);
    }
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
          ? this._yScales
              .map((scale) =>
                scale.scale(d.title)
                  ? scale.scale(d.title) +
                    (scale.scale.bandwidth() - this._barWidth) / 2
                  : null
              )
              .find((value) => value)
          : this._yScales
              .map((scale) =>
                scale.scale(d.title) ? scale.scale(d.title) : null
              )
              .find((value) => value)
      )
      .attr(
        "height",
        this._barWidth ||
          ((d) => {
            for (let scale of this._yScales) {
              if (d.group === scale.id) return scale.scale.bandwidth() / 2;
            }
            return this._yScales[0].scale.bandwidth() / 2;
          })
      )
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .attr("x", 0)
      .attr("width", (d) => this._xScale(d.value));
  }

  _addEnteringBarLabels(barLabels) {
    barLabels
      .append("text")
      .attr("y", (d) =>
        this._yScales
          .map((scale) =>
            scale.scale(d.title)
              ? this._groups
                ? scale.scale(d.title) + scale.scale.bandwidth()
                : scale.scale(d.title)
              : null
          )
          .find((value) => value)
      )
      .attr("class", "bar-label")
      .attr("x", 0)
      .text((d) => d.title)
      .attr("fill", "transparent")
      .style("font-size", "15px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  _addEnteringGroupLabels(groupLabels) {
    groupLabels
      .append("text")
      .attr(
        "y",
        (d) => this._yScales.find((scale) => scale.id === d.id).scale.range()[0]
      )
      .attr("class", "group-label")
      .attr("x", 0)
      .text((d) => d.translation)
      .attr("fill", "transparent")
      .style("font-size", "15px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  _addEnteringBars(barGroups) {
    barGroups
      .append("rect")
      .attr("x", 0)
      .attr("width", initializingBarHeight)
      .attr("y", (d) =>
        this._barWidth
          ? this._yScales
              .map((scale) =>
                scale.scale(d.title)
                  ? scale.scale(d.title) +
                    (scale.scale.bandwidth() - this._barWidth) / 2
                  : null
              )
              .find((value) => value)
          : this._yScales
              .map((scale) =>
                scale.scale(d.title)
                  ? scale.scale(d.title) + scale.scale.bandwidth() / 4
                  : null
              )
              .find((value) => value)
      )
      .attr(
        "height",
        this._barWidth ||
          ((d) => {
            for (let scale of this._yScales) {
              if (d.group === scale.id) return scale.scale.bandwidth() / 2;
            }
            return this._yScales[0].scale.bandwidth() / 2;
          })
      )
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr("x", 0)
      .attr("width", (d) => this._xScale(d.value));
  }

  _addEnteringBarValues(barGroups) {
    barGroups
      .append("text")
      .attr("y", (d) =>
        this._yScales
          .map((scale) =>
            scale.scale(d.title)
              ? scale.scale(d.title) + scale.scale.bandwidth() / 2
              : null
          )
          .find((value) => value)
      )
      .attr("class", "bar-value")
      .attr("text-anchor", "end")
      .attr("x", (d) => this._xScale(d.value) - barValueMargin)
      .text((d) => d.value)
      .attr("fill", "transparent")
      .style("font-size", "10px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", this._barValueColor);
  }

  _alignBarText() {
    const xScale = this._xScale;
    const groups = this._groups;
    this.chart.selectAll(".bar-group").each(function () {
      const node = d3.select(this);
      const text = node.select(".bar-value");
      const label = node.select(".bar-label");
      const labelWidth = groups ? label.node().getBBox().width : 0;
      if (
        text.node().getBBox().width + labelWidth + barValueMargin >
        xScale(+text.node().textContent)
      ) {
        if (groups)
          label.attr("text-anchor", "start").attr("x", (d) => xScale(d.value));
        text
          .attr("text-anchor", "start")
          .attr("x", (d) => xScale(d.value) + labelWidth);
      }
    });
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

  _displayBars(barGroups, enteringBarGroups) {
    this._updateExistingBars(barGroups);
    this._addEnteringBars(enteringBarGroups);
    // if (this.grouped) this._addEnteringBars(bars);
    // else this._addEnteringBar(bars);
  }

  _displayValues(barGroups, enteringBarGroups) {
    // this._updateExistingBarValues(barGroups);
    this._addEnteringBarValues(enteringBarGroups);
    this._addEnteringBarLabels(enteringBarGroups);
  }

  render() {
    this._adaptScalesToData();
    const barGroups = this.chart
      .selectAll(".bar-group")
      .data(this._data, (d) => d.title);
    const enteringBarGroups = barGroups
      .enter()
      .append("g")
      .attr("class", "bar-group");

    barGroups.exit().remove();
    this._displayBars(barGroups, enteringBarGroups);
    if (this._barValueColor) this._displayValues(barGroups, enteringBarGroups);
    else this.chart.selectAll(".bar-value").remove();
    if (this._groups) {
      const groupLabels = this.chart
        .selectAll(".bar-group")
        .data(this._groups, (g) => g.id);
      const enteringGroupLabels = groupLabels.enter();
      this._addEnteringGroupLabels(enteringGroupLabels);
    }
    this._alignBarText(barGroups);
  }
}
