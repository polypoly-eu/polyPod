import { Chart } from "../../chart";
import * as d3 from "d3";
import { trimTimeOfDate } from "../../../d3-utils";

const semiDarkColor = "#8d9caf";
const yLabelsPosition = "-0.40em";
const correctionYAxisLabels = 20;
const startingLog = -2;
const xScaleMarginBottom = 16;
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
    this._xScale = d3.scaleTime().range([0, this.chartWidth]);

    const allDates = this.data.reduce(
      (prev, curr) => [...prev, ...curr.dataPoints.map((dp) => dp.date)],
      []
    );
    this._timeExtent = d3.extent(allDates, (jsDate) =>
      trimTimeOfDate(new Date(jsDate))
    );
    this._ticksX = d3.timeMonths(this._timeExtent[0], this._timeExtent[1]);
  }

  get lineGroups() {
    return this.chart.selectAll(".line-group");
  }

  _adaptScalesToData() {
    this._yScale.domain([
      Math.pow(10, startingLog),
      d3.max(this._data, (d) => d3.max(d.dataPoints, (dp) => dp.value)),
    ]);

    this._xScale.domain(this._timeExtent);
  }

  _drawXAxis() {
    let xAxis = this.chart.select("#x-axis");
    if (xAxis.empty()) xAxis = this.chart.append("g").attr("id", "x-axis");
    xAxis
      .attr(
        "transform",
        `translate(0, ${this.chartHeight - xScaleMarginBottom})`
      )
      .call(
        d3
          .axisBottom(this._xScale)
          .ticks(this._ticksX.length)
          .tickFormat((d) => (d <= d3.timeYear(d) ? d.getFullYear() : null))
      );

    xAxis.select("path").style("visibility", "hidden");
  }

  _drawYAxis() {
    let yAxis = this.chart.select("#y-axis");
    if (yAxis.empty()) yAxis = this.chart.append("g").attr("id", "y-axis");
    yAxis.attr("transform", `translate(${this.chartWidth}, 0)`).call(
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

    yAxis.select(".domain").style("visibility", "hidden");
  }

  _drawPath() {
    const xScale = this._xScale;
    const yScale = this._yScale;
    const lineColor = this._lineColor;
    this.lineGroups.each(function (datum) {
      const lineGroup = d3.select(this);
      let line = lineGroup.select(".line");
      if (line.empty()) line = lineGroup.append("path").attr("class", "line");
      line
        .datum(datum.dataPoints)
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(trimTimeOfDate(new Date(d.date))))
            .y((d) => yScale(d.value))
        );
    });
  }

  _drawArea() {
    const xScale = this._xScale;
    const yScale = this._yScale;
    const areaColor = this._areaColor;

    const areaCalculation = d3
      .area()
      .x((d) => xScale(trimTimeOfDate(new Date(d.date))))
      .y0(this.chartHeight - xScaleMarginBottom)
      .y1((d) => yScale(d.value));

    this.lineGroups.each(function (datum) {
      const lineGroup = d3.select(this);
      let area = lineGroup.select(".area");
      if (area.empty()) area = lineGroup.append("path").attr("class", "area");
      area
        .datum(datum.dataPoints)
        .attr("fill", areaColor)
        .attr("stroke", "none")
        .attr("d", areaCalculation);
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
    this._adaptScalesToData();
    this._drawXAxis();
    this._drawYAxis();

    this.lineGroups
      .data(this._data, (d) => d.id)
      .enter()
      .append("g")
      .attr("class", "line-group");
    this._drawPath();
    this._drawArea();
  }
}
