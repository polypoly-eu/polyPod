import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";

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
 * @param Object[] data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 300} [height] - The height of the svg
 * @param {Object} margin - The margin the chart has to the svg sides
 * @param {number = 0} margin.top - Top margin
 * @param {number = 0} margin.right - Right margin
 * @param {number = 0} margin.bottom - Bottom margin
 * @param {number = 0} margin.left - Left left
 */
export class Chart {
  constructor({ data, width, height, margin, type }) {
    this._id = uuidv4();
    this._data = data;
    this._width = width;
    this._height = height;
    this._margin = margin || noMargin;
    this._chartHeight = height - this.margin.bottom - this.margin.top;
    this._chartWidth = width - this.margin.left - this.margin.right;
    this.type = type || "";
  }

  get id() {
    return this._id;
  }

  get escapedId() {
    return CSS.escape(this.id);
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
    const chart = d3.select("#" + this.escapedId).select(".chart");
    return chart.empty() ? this.generateChart() : chart;
  }

  createSVG() {
    return d3
      .select("#" + this.escapedId)
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
  }

  generateChart() {
    return this.createSVG()
      .append("g")
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .attr("class", `chart ${this.type}`);
  }
}
