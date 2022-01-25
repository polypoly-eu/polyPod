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
 * @param {number} [width = 400] - The width of the svg
 * @param {number} [height = 300] - The height of the svg
 * @param {Object} [margin] - The margin the chart has to the svg sides (eg. for scales)
 * @param {number} [margin.top = 0] - Top margin
 * @param {number} [margin.right = 0] - Right margin
 * @param {number} [margin.bottom = 0] - Bottom margin
 * @param {number} [margin.left = 0] - Left left
 */
export class Chart {
  constructor({ selector, data, width, height, margin, gradients }) {
    this._selector = selector;
    this._data = data;
    this._width = width || 400;
    this._height = height || 300;
    this._margin = margin || noMargin;
    this._chartHeight = height - this.margin.bottom - this.margin.top;
    this._chartWidth = width - this.margin.left - this.margin.right;
    this._gradients = gradients;
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
    return chart.empty() ? this._generateChart() : chart;
  }

  get type() {
    return this.constructor.name;
  }

  get CSSType() {
    return this.type
      .split(/(?=[A-Z])/)
      .reduce((prev, curr) => prev.toLowerCase() + "-" + curr.toLowerCase());
  }

  _createGradients(svg) {
    const defs = svg.append("defs");
    for (let gradientData of this._gradients) {
      const gradient = defs
        .append(gradientData.type)
        .attr("id", gradientData.id);

      for (let stop of gradientData.stops) {
        gradient
          .append("stop")
          .attr("offset", stop.offset)
          .attr("stop-color", stop.color)
          .attr("stop-opacity", stop.opacity);
      }
    }
  }

  _createSVG() {
    const svg = d3
      .select(this._selector)
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
    if (this._gradients) this._createGradients(svg);
    return svg;
  }

  _generateChart() {
    return this._createSVG()
      .append("g")
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .attr("class", `chart ${this.CSSType}`);
  }
}
