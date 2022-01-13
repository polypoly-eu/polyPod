import { Chart } from "../../chart";
import * as d3 from "d3";
import { jsDateToD3Date } from "../../../d3-utils";

const semiDarkColor = "#8d9caf";
const darkColor = "#0f1938";
const yLabelsPosition = "-0.40em";
const correctionYAxisSize = 10;
const correctionYAxisLabels = 20;
const startingLog = -2;
const xScaleMarginBottom = 16;
const xScaleMarginLeft = 12;
const defaultColor = "blue";

export class TimeLineChart extends Chart {
  constructor({
    selector,
    data,
    width = 400,
    height = 300,
    lineColor,
    areaColor,
    gradients,
  }) {
    super({ selector, data, width, height, gradients });
    this._lineColor = lineColor || defaultColor;
    this._areaColor = areaColor || defaultColor;
    this._yScale = d3
      .scaleLog()
      .range([this.chartHeight - xScaleMarginBottom, 0]);
    this._xScale = d3.scaleTime().range([xScaleMarginLeft, this.chartWidth]);

    const allDates = this.data.reduce(
      (prev, curr) => [...prev, ...curr.dataPoints.map((dp) => dp.date)],
      []
    );
    this._timeExtent = d3.extent(allDates, (jsDate) =>
      jsDateToD3Date(new Date(jsDate))
    );
    this._ticksX = d3.timeMonths(this._timeExtent[0], this._timeExtent[1]);
  }

  _adaptScalesToData() {
    this._yScale.domain([
      Math.pow(10, startingLog),
      d3.max(this._data, (d) => d3.max(d.dataPoints, (dp) => dp.value)),
    ]);

    this._xScale.domain(this._timeExtent);
  }

  _drawXAxis() {
    const xAxis = this.chart
      .append("g")
      .attr(
        "transform",
        `translate(0, ${this.chartHeight - xScaleMarginBottom})`
      )
      .attr("id", "x-axis")
      .call(
        d3
          .axisBottom(this._xScale)
          .ticks(this._ticksX.length)
          .tickFormat((d) => (d <= d3.timeYear(d) ? d.getFullYear() : null))
      );

    xAxis.select("path").style("visibility", "hidden");
  }

  _drawYAxis() {
    const yAxis = this.chart
      .append("g")
      .attr("id", "y-axis")
      .attr(
        "transform",
        `translate(${this.chartWidth + correctionYAxisSize}, 0)`
      )
      .call(
        d3
          .axisLeft(this._yScale)
          .tickSizeOuter(0)
          .tickFormat((d) =>
            Number.isInteger(Math.log10(d)) && Math.log10(d) !== startingLog
              ? d
              : ""
          )
          .tickSize(this.chartWidth)
      );

    yAxis
      .selectAll(".tick")
      .selectAll("line")
      .attr("stroke", (d) =>
        Number.isInteger(Math.log10(d)) && Math.log10(d) !== startingLog
          ? semiDarkColor
          : "hidden"
      );

    yAxis
      .selectAll(".tick")
      .selectAll("text")
      .attr("dy", yLabelsPosition)
      .attr("x", function xCorrection() {
        const currentX = Number(d3.select(this).attr("x"));
        return currentX + correctionYAxisLabels;
      });

    //d3.select(yAxis.selectAll(".tick").node()).style("visibility", "hidden");

    yAxis.select(".domain").style("visibility", "hidden");
  }

  _drawPath(lineGroups) {
    const xScale = this._xScale;
    const yScale = this._yScale;
    const lineColor = this._lineColor;
    lineGroups.each(function (datum) {
      d3.select(this)
        .append("path")
        .datum(datum.dataPoints)
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(jsDateToD3Date(new Date(d.date))))
            .y((d) => yScale(d.value))
        );
    });
  }

  _drawArea(lineGroups) {
    const xScale = this._xScale;
    const yScale = this._yScale;
    const areaColor = this._areaColor;

    const area = d3
      .area()
      .x((d) => xScale(jsDateToD3Date(new Date(d.date))))
      .y0(this.chartHeight - xScaleMarginBottom)
      .y1((d) => yScale(d.value));

    lineGroups.each(function (datum) {
      d3.select(this)
        .append("path")
        .datum(datum.dataPoints)
        .attr("fill", areaColor)
        .attr("stroke", "none")
        .attr("d", area);
    });
  }

  _createGradients(svg) {
    const defs = svg.append("defs");
    for (let gradientData of this._gradients) {
      const gradient = defs
        .append(gradientData.type)
        .attr("id", gradientData.id)
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

      for (let stop of gradientData.stops) {
        gradient
          .append("stop")
          .attr("offset", stop.offset)
          .attr("stop-color", stop.color)
          .attr("stop-opacity", stop.opacity);
      }
    }
  }

  render() {
    const chart = this.chart;
    this._adaptScalesToData();
    this._drawXAxis();
    this._drawYAxis();

    const lineGroups = this.chart
      .selectAll(".line-group")
      .data(this._data)
      .enter()
      .append("g");
    this._drawPath(lineGroups);
    this._drawArea(lineGroups);
  }
}
