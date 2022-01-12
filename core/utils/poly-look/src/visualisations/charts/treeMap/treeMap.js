import { Chart } from "../chart";
import * as d3 from "d3";
import { wrapTexts } from "../../d3-utils";

// default constants
const defaultPadding = 2,
  defaultWidth = 300,
  defaultHeight = 250,
  defaultFontSize = 10,
  defaultColor = "blue",
  defaultFontColor = "white",
  defaultOnUnfittingText = "";

/**
 * Visualizes data as a tree map
 *
 * The data can be infinitely nested to visualize grouping
 *
 * @class
 * @extends Chart
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {Object[]} data - The data to be visualized as a tree map
 * @param {string} data[].name - The title/name the leave/ branch
 * @param {number} data[].value - The value of the leave, which corresponds to it's area
 * @param {Array} data[].children - Making it a group (branch) with nested data (no value attribute needed in this case)
 * @param {number} [width  = defaultWidth] - The width of the svg
 * @param {number} [height = defaultHeight] - The height of the svg
 * @param {string|callback} [color = defaultColor] - The color of the rectangle (callbacks receive data)
 * @param {string|callback} [fontColor = defaultFontColor] - The color of the text (callbacks receive data)
 * @param {string|callback} [fontSize = defaultFontSize] - The fontSize of the text (callbacks receive data)
 * @param {string|callback} [onUnfittingText = defaultOnUnfittingText] - Callback fired when text does not fit inside of the rectangle (callbacks receive data)
 */
export class TreeMap extends Chart {
  constructor({
    selector,
    data,
    width = defaultWidth,
    height = defaultHeight,
    padding,
    color,
    fontSize,
    fontColor,
    onUnfittingText,
  }) {
    super({
      selector,
      data,
      width,
      height,
    });
    this._padding = padding || defaultPadding;
    this._color = color || defaultColor;
    this._fontSize = fontSize || defaultFontSize;
    this._fontColor = fontColor || defaultFontColor;
    this._onUnfittingText = onUnfittingText || defaultOnUnfittingText;
  }

  _distance(x, y) {
    return Math.abs(x - y);
  }

  _addTreeMapRoot() {
    const root = d3
      .hierarchy(this.data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    return d3.treemap().size([this.width, this.height]).padding(this._padding)(
      root
    );
  }

  _addNodes(treemapRoot) {
    return this.chart
      .selectAll("g")
      .data(treemapRoot.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);
  }

  _addRects(nodes) {
    nodes
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0, 3)
      .attr("height", (d) => d.y1 - d.y0, 3)
      .attr("fill", this._color);
  }

  _addAndWrapTexts(nodes) {
    const texts = nodes
      .append("text")
      .text((d) => `${d.data.name}:\n${d.data.value}`)
      .attr("font-size", this._fontSize)
      .attr("y", this._fontSize)
      .attr("x", defaultPadding)
      .attr("fill", this._fontColor);

    const onUnfittingText = this._onUnfittingText;
    texts.call(wrapTexts);

    nodes.each(function () {
      const node = d3.select(this);
      const text = node.select("text");
      const rect = node.select("rect");
      if (text.node().getBBox().width > rect.node().getBBox().width)
        text.text(onUnfittingText);
    });
  }

  _drawJurisdictionTree() {
    const treemapRoot = this._addTreeMapRoot();
    const nodes = this._addNodes(treemapRoot);
    this._addRects(nodes);
    this._addAndWrapTexts(nodes);
  }

  render() {
    this._drawJurisdictionTree();
  }
}
