import * as d3 from "d3";

import { Chart } from "../../chart";

const edgePadding = 5;
const smallBubblesRadius = 20;
const bigBubblesRadius = 50;
const bubblePadding = 3;
const bigBubblesFont = "20px";
const mediumBubblesFont = "16px";
const defaultBubbleColor = "blue";
const defaultStrokeColor = "#f7fafc";
const defaultTextColor = "white";
const defaultOpacity = 1;
const defaultText = (d) =>
  d.r > smallBubblesRadius ? Math.round(d.value) : "";
const defaultOnClickFunction = () => {};

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * Adding svg icons to a data point will load the svg instead of a bubble
 *
 * @class
 * @extends Chart
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number} data[].icon - A svg that should be displayed as the bubble in string form as you would get it from rollup-svg-plugin (eg. "<svg>...</svg>")
 * @param {Object[]} data[].children - Data for nested bubbles - only one level of nesting is currently supported, i.e. no grandchildren.
 * @param {number} [width  = 400] - The width of the svg
 * @param {number} [height = 300] - The height of the svg
 * @param {string|callback} [bubbleColor  = "blue" ] - The color of the bubble (callbacks receive event and data)
 * @param {string|callback} [strokeColor  = "#f7fafc" ] - The color of the bubble outline (callbacks receive event and data)
 * @param {string|callback} [textColor  = "white" ] - The color of the bubble text (callbacks receive event and data)
 * @param {number|callback} [opacity  = 1] - The opacity of the bubbles color 0 <= opacity <= 1 (callbacks receive event and data)
 * @param {string|callback} [text] - The text rendered on top of each bubble, by default its value (callbacks receive event and data)
 * @param {callback} [onBubbleClick = () => {} ] - Bubble onclick function
 * @param {Object} [filter] - A filter that is applied to the elements
 * @param {SVG-Filter-Element} [filter.filterElement] - The svg filter element created (https://developer.mozilla.org/en-US/docs/Web/SVG/Element#filter_primitive_elements)
 * @param {string} [filter.type] - Filter type has different meanings depending on the context it's used in (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type)
 * @param {string} [filter.in] - Where the filter is used (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/in)
 * @param {string} [filter.values] - Values has different meanings depending on the context it's used in (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/values)
 * @param {callback} [filter.activationCondition] - Condition applied to the bubbles when filter is active (receives d)
 */
export class BubbleCluster extends Chart {
  constructor({
    selector,
    data,
    width,
    height,
    bubbleColor = defaultBubbleColor,
    strokeColor = defaultStrokeColor,
    textColor = defaultTextColor,
    opacity = defaultOpacity,
    text = defaultText,
    onBubbleClick = defaultOnClickFunction,
    filter,
  }) {
    super({ selector, data, width, height });
    this._bubbleColor = bubbleColor;
    this._strokeColor = strokeColor;
    this._textColor = textColor;
    this._opacity = opacity;
    this._text = text;
    this._onBubbleClick = onBubbleClick;
    this._bubblePadding = bubblePadding;
    this._filter = filter;

    this._filterActivationCondition = (d) => {
      if (!this._filter) return null;
      const { activationCondition } = this._filter;
      if (activationCondition && !activationCondition(d)) return null;
      return `url(#${this._filter.type})`;
    };
  }

  _makeHierarchy() {
    return d3.hierarchy({ children: this.data }).sum((d) => d.value);
  }

  _pack() {
    return d3
      .pack()
      .size([this._width - edgePadding, this._height - edgePadding])
      .padding(this._bubblePadding);
  }

  _setUpFilters() {
    const filter = this._filter;
    if (this._filter && this.chart.select(`.filter.${filter.type}`).empty())
      this.chart
        .append("filter")
        .attr("class", `filter ${filter.type}`)
        .attr("id", filter.type)
        .append(filter.filterElement)
        .attr("type", filter.type)
        .attr("in", filter.in)
        .attr("values", filter.values);
  }

  _addNewBubbleGroups(nodes) {
    return nodes
      .enter()
      .append("g")
      .attr("transform", (d) =>
        d.data.icon
          ? `translate(${d.x - d.r},${d.y - d.r})`
          : `translate(${d.x},${d.y})`
      )
      .on("click", this._onBubbleClick)
      .style("-webkit-tap-highlight-color", "transparent");
  }

  _updateBubbles(nodes) {
    nodes
      .selectAll(".bubble")
      .style("fill", this._bubbleColor)
      .style("stroke", this._strokeColor)
      .style("vertical-align", "center")
      .attr("filter", this._filterActivationCondition);

    nodes
      .selectAll(".icon")
      .attr("height", (d) => d.r * 2)
      .attr("width", (d) => d.r * 2)
      .attr("filter", this._filterActivationCondition);
  }

  _addBubbles(bubbleGroups) {
    bubbleGroups
      .filter((d) => d.data.icon)
      .html((d) => d.data.icon)
      .select("svg")
      .attr("class", "icon")
      .attr("height", (d) => d.r * 2)
      .attr("width", (d) => d.r * 2)
      .attr("filter", this._filterActivationCondition);

    bubbleGroups
      .filter((d) => !d.data.icon)
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => d.r)
      .style("fill", this._bubbleColor)
      .style("stroke", this._strokeColor)
      .style("vertical-align", "center")
      .attr("fill-opacity", this._opacity);
  }

  _addTextToBubbleGroup(newBubbleGroups) {
    newBubbleGroups
      .append("text")
      .attr("class", "bubble-text")
      .text(this._text)
      .attr("text-anchor", "middle")
      .attr("y", ".3em")
      .attr("fill", this._textColor)
      .style("font-size", (d) => {
        return d.r > bigBubblesRadius ? bigBubblesFont : mediumBubblesFont;
      })
      .style("font-family", "Jost Medium")
      .style("font-weight", "500")
      .attr("fill", this._textColor)
      .attr("transform", (d) =>
        d.data.icon ? `translate(${d.x},${d.y})` : ""
      );
  }

  _updateBubbleTexts(nodes) {
    nodes
      .selectAll(".bubble-text")
      .text(this._text)
      .attr("fill", this._textColor)
      .style("font-size", (d) => {
        return d.r > bigBubblesRadius ? bigBubblesFont : mediumBubblesFont;
      });
  }

  render() {
    const hierarchicalData = this._makeHierarchy();
    const packLayout = this._pack();
    const root = packLayout(hierarchicalData);
    this._setUpFilters();
    const nodes = this.chart
      .selectAll("g")
      .data(root.descendants().filter(({ parent }) => !!parent));
    nodes.exit().remove();
    this._updateBubbles(nodes);
    const newBubbleGroups = this._addNewBubbleGroups(nodes);
    this._addBubbles(newBubbleGroups);

    if (this._text) {
      this._addTextToBubbleGroup(newBubbleGroups);
      this._updateBubbleTexts(nodes);

      // Bit of a hack to ensure that the texts of bubbles with children are
      // rendered on top of those children. As a consequence of this, bubbles
      // that have both a solid color fill and children will hide their
      // children. If we were to render all texts on top of all bubbles, we
      // could avoid this problem.
      newBubbleGroups.filter((d) => d.children).raise();
    }
  }
}
