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
const barPaddingProportion = 0.2;
const groupHeadlineHeight = 14;
const headlinePadding = 6;
const barTextBottomMargin = 6;
const defaultBarColor = "blue";
const defaultBarValueColor = "white";
const defaultBarWidth = 20;
/**
 *
 * @class
 * @extends Chart
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number} [width  = 400] - The width of the svg
 * @param {number} [height = 400] - The height of the svg
 * @param {string|callback} [barColor = defaultBarColor] - The color of the bar (callbacks receive event and data)
 * @param {string} [barValueColor] - The color the values are shown in (default = no values shown)
 * @param {string} [barWidth] - barWidth is actually bar height since it is a horizontal bar chart but for all intents and purposes it is the bar's width
 * @param {Object[]} [groups] - This holds the information of what groups are associated with the data (default: dafta is not grouped)
 */

class ScaleContainer {
  constructor({ scale, id }) {
    this.scale = scale;
    this.id = id;
  }
}

export class HorizontalBarChart extends Chart {
  constructor({
    selector,
    data,
    barWidth,
    groups,
    barColor,
    barValueColor,
    width = 400,
    height = 400,
  }) {
    super({ selector, data, width, height, margin });
    this._groups = groups;
    this._barColor = barColor || defaultBarColor;
    this._barWidth = defaultBarWidth || barWidth;
    this._xScale = d3.scaleLinear().range([0, this.chartWidth]);
    this._yScales = this._getYscales(groups);
    this._barValueColor = barValueColor || defaultBarValueColor;
  }

  _getYscales(groups) {
    if (groups) {
      const yScales = [];
      let headingSpace = groupHeadlineHeight + headlinePadding;
      for (let group of groups) {
        const relevantBars = this.data.filter(
          (data) => data.group === group.id
        ).length;
        const barsSpan = relevantBars * this._barWidth;
        const paddingSpan = barsSpan / (1 / barPaddingProportion - 1);
        const totalSpan = barsSpan + relevantBars * paddingSpan;
        const scale = d3
          .scaleBand()
          .range([headingSpace, totalSpan])
          .padding(barPaddingProportion);
        headingSpace = headingSpace + totalSpan;
        yScales.push(new ScaleContainer({ scale, id: group.id }));
      }
      return yScales;
    } else {
      return [
        new ScaleContainer({
          scale: d3
            .scaleBand()
            .range([0, this.chartHeight])
            .padding(barPaddingProportion),
          id: null,
        }),
      ];
    }
  }

  _adaptScalesToData() {
    this._xScale.domain([0, d3.max(this.data, (d) => d.value)]);
    for (let scaleContainer of this._yScales) {
      const relevantData = scaleContainer.id
        ? this.data
            .filter((data) => data.group === scaleContainer.id)
            .sort((a, b) => b.value - a.value)
            .map((data) => data.title)
        : this.data.sort((a, b) => b.value - a.value).map((data) => data.title);
      scaleContainer.scale.domain(relevantData);
    }
  }

  _updateExistingBars(bars) {
    bars
      .transition()
      .duration(750)
      .attr("x", 0)
      .attr("width", initializingBarHeight)
      .attr("y", (d) => {
        for (let scaleContainer of this._yScales) {
          if (!scaleContainer.id)
            scaleContainer.scale(d.title) +
              scaleContainer.scale.bandwidth() / 4;
          if (d.group === scaleContainer.id)
            return (
              scaleContainer.scale(d.title) +
              (scaleContainer.scale.bandwidth() - this._barWidth) / 2
            );
        }
      })
      .attr("height", this._barWidth)
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .attr("x", 0)
      .attr("width", (d) => this._xScale(d.value));
  }

  _addEnteringBars(barGroups) {
    barGroups
      .append("rect")
      .attr("x", 0)
      .attr("width", initializingBarHeight)
      .attr("y", (d) => {
        for (let scaleContainer of this._yScales) {
          if (!scaleContainer.id)
            return (
              scaleContainer.scale(d.title) +
              scaleContainer.scale.bandwidth() / 4
            );
          if (d.group === scaleContainer.id)
            return (
              scaleContainer.scale(d.title) +
              (scaleContainer.scale.bandwidth() - this._barWidth) / 2
            );
        }
      })
      .attr("height", this._barWidth)
      .attr("fill", this._barColor)
      .attr("class", "bar")
      .transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr("x", 0)
      .attr("width", (d) => this._xScale(d.value));
  }

  _addEnteringBarLabels(barLabels) {
    barLabels
      .append("text")
      .attr("y", (d) => {
        for (let scaleContainer of this._yScales) {
          if (!scaleContainer.id) return scaleContainer.scale(d.title);
          if (d.group === scaleContainer.id)
            return (
              scaleContainer.scale(d.title) +
              scaleContainer.scale.bandwidth() -
              barTextBottomMargin
            );
        }
      })
      .attr("class", "bar-label")
      .attr("x", 0)
      .text((d) => d.title)
      .attr("fill", "transparent")
      .style("font-size", "15px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", this._groups ? this._barValueColor : "black");
  }

  _addEnteringGroupLabels(groupLabels) {
    groupLabels
      .append("text")
      .attr(
        "y",
        (d) =>
          this._yScales
            .find((scaleContainer) => scaleContainer.id === d.id)
            .scale.range()[0]
      )
      .attr("class", "group-label")
      .attr("x", 0)
      .text((d) => d.translation)
      .attr("fill", "transparent")
      .style("font-size", "15px")
      .transition()
      .delay(1000)
      .duration(500)
      .attr("fill", "black");
  }

  _addEnteringBarValues(barGroups) {
    barGroups
      .append("text")
      .attr("y", (d) => {
        for (let scaleContainer of this._yScales) {
          if (!scaleContainer.id)
            return scaleContainer.scale(d.title) + this._barWidth;
          if (scaleContainer.id === d.group)
            return (
              scaleContainer.scale(d.title) +
              scaleContainer.scale.bandwidth() -
              barTextBottomMargin
            );
        }
      })
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

  _alignBarText() {
    const xScale = this._xScale;
    const groups = this._groups;
    const barColor = this._barColor;
    this.chart.selectAll(".bar-group").each(function () {
      const node = d3.select(this);
      const value = node.select(".bar-value");
      const label = node.select(".bar-label");
      const labelWidth = groups ? label.node().getBBox().width : 0;
      if (
        value.node().getBBox().width + labelWidth + barValueMargin >
        xScale(+value.node().textContent)
      ) {
        if (groups)
          label
            .attr("text-anchor", "start")
            .attr("x", (d) => barValueMargin + xScale(d.value))
            .attr("fill", "transparent")
            .transition()
            .delay(1000)
            .duration(500)
            .attr("fill", barColor);
        value
          .attr("text-anchor", "start")
          .attr(
            "x",
            (d) =>
              barValueMargin + xScale(d.value) + barValueMargin + labelWidth
          )
          .attr("fill", "transparent")
          .transition()
          .delay(1000)
          .duration(500)
          .attr("fill", barColor);
      }
    });
  }

  _displayBars(barGroups, enteringBarGroups) {
    this._addEnteringBars(enteringBarGroups);
    this._updateExistingBars(barGroups);
  }

  _displayValues(barGroups, enteringBarGroups) {
    this._updateExistingBarValues(barGroups);
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
