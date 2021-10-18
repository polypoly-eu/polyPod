import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";

const noMargin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

export class Chart {
  constructor({ data, width, height, margin }) {
    this._id = uuidv4();
    this._data = data;
    this._width = width;
    this._height = height;
    this._margin = margin || noMargin;
    this._chartHeight = height - this.margin.bottom - this.margin.top;
    this._chartWidth = width - this.margin.left - this.margin.right;
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
      .attr("class", "chart");
  }
}
