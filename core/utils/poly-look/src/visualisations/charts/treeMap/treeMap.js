import { Chart } from "../chart";
import * as d3 from "d3";

// default constants
const defaultPadding = 2,
  defaultWidth = 300,
  defaultHeight = 250,
  defaultFontSize = 10;

export class TreeMap extends Chart {
  constructor({
    selector,
    data,
    width,
    height,
    padding,
    color,
    fontSize,
    fontColor,
    onUnfittingText,
  }) {
    super({
      selector,
      data,
      width: width || defaultWidth,
      height: height || defaultHeight,
    });
    this._padding = padding || defaultPadding;
    this._color = color || "blue";
    this._fontSize = fontSize || defaultFontSize;
    this._fontColor = fontColor || "white";
    this._onUnfittingText = onUnfittingText;
  }

  _distance(x, y) {
    return Math.abs(x - y);
  }

  _makeHierarchy() {
    return d3
      .hierarchy(this.data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
  }

  _addTreeMapRoot(root) {
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
      .attr("fill", this._fontColor);

    const onUnfittingText = this._onUnfittingText;

    nodes.each(function () {
      const node = d3.select(this);
      const text = node.select("text");
      const rect = node.select("rect");
      if (text.node().getBBox().width > rect.node().getBBox().width)
        text.text(onUnfittingText || "");
    });

    texts.call(this._wrapText);
  }

  _drawJurisdictionTree() {
    const root = this._makeHierarchy();
    const treemapRoot = this._addTreeMapRoot(root);
    const nodes = this._addNodes(treemapRoot);
    this._addRects(nodes);
    this._addAndWrapTexts(nodes);
  }

  _wrapText(text) {
    text.each(function () {
      let text = d3.select(this),
        rectWidth = +text.attr("data-width"),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = 0,
        dy = 0,
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > rectWidth) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 2)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }

  render() {
    this._drawJurisdictionTree();
  }
}
