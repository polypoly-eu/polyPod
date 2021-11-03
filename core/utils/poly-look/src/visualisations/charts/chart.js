import * as d3 from "d3";

const noMargin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

/**
 * Creates a svg and a chart group inside
 *
 * @class
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {string} type - The type of the chart (eg. vertical-bar-chart)
 * @param {Object[]} data - The data to be visualized by the chart
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 300} [height] - The height of the svg
 * @param {Object} [margin] - The margin the chart has to the svg sides (eg. for scales)
 * @param {number = 0} [margin.top] - Top margin
 * @param {number = 0} [margin.right] - Right margin
 * @param {number = 0} [margin.bottom] - Bottom margin
 * @param {number = 0} [margin.left] - Left left
 */
export class Chart {
  constructor({ selector, type, data, width, height, margin }) {
    this._selector = selector;
    this._data = data;
    this._width = width || 400;
    this._height = height || 300;
    this._margin = margin || noMargin;
    this._chartHeight = height - this.margin.bottom - this.margin.top;
    this._chartWidth = width - this.margin.left - this.margin.right;
  }

  get data() {
    return this._data;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get chartWidth() {
    return this._chartWidth;
  }

  get chartHeight() {
    return this._chartHeight;
  }

  get margin() {
    return this._margin;
  }

  get chart() {
    const chart = d3.select(this._selector).select(".chart");
    return chart.empty() ? this.generateChart() : chart;
  }

  get type() {
    return this.constructor.name;
  }

  get CSSType() {
    return this.type
      .split(/(?=[A-Z])/)
      .reduce((prev, curr) => prev.toLowerCase() + "-" + curr.toLowerCase());
  }

  createSVG() {
    return d3
      .select(this._selector)
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
  }

  generateChart() {
    return this.createSVG()
      .append("g")
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .attr("class", `chart ${this.CSSType}`);
  }
}
