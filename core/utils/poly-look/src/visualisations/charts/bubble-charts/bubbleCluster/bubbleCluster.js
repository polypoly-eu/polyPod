import * as d3 from "d3";

import { Chart } from "../../chart";

export const type = "bubble-cluster";

const edgePadding = 5;
const smallBubblesRadius = 20;
const bigBubblesRadius = 50;
const bubblePadding = 3;
const bigBubblesFont = "20px";
const mediumBubblesFont = "16px";

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * @class
 * @extends Chart
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} width - The width of the svg
 * @param {number = 300} height - The height of the svg
 * @param {string|callback = "blue"} [bubbleColor] - The color of the bubble (callbacks receive event and data)
 * @param {string|callback = "white"} [textColor] - The color of the bubble text (callbacks receive event and data)
 * @param {number|callback = 1} [opacity] - The opacity of the bubbles color 0 <= opacity <= 1 (callbacks receive event and data)
 * @param {boolean = true} [showValues] - Whether texts displaying the value of the bubble are added
 * @param {callback = () => {}} [onBubbleClick] - Bubble onclick function
 */
export class BubbleCluster extends Chart {
  constructor({
    selector,
    data,
    width = 400,
    height = 300,
    bubbleColor = "blue",
    textColor = "white",
    opacity = 1,
    showValues = true,
    onBubbleClick = () => {},
  }) {
    super({ selector, data, width, height });
    this._bubbleColor = bubbleColor;
    this._textColor = textColor;
    this._opacity = opacity;
    this._showValues = showValues;
    this._onBubbleClick = onBubbleClick;
    this._bubblePadding = bubblePadding;
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

  _updateBubbles(leaves) {
    leaves
      .selectAll(".bubble")
      .style("fill", this._bubbleColor)
      .style("stroke", "#f7fafc")
      .style("vertical-align", "center")
      .attr("fill-opacity", this._opacity);
  }

  _addNewBubbleGroups(leaves) {
    return leaves
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .on("click", this._onBubbleClick);
  }

  _addBubbles(bubbleGroups) {
    bubbleGroups
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => d.r)
      .style("fill", this._bubbleColor)
      .style("stroke", "#f7fafc")
      .style("vertical-align", "center")
      .attr("fill-opacity", this._opacity);
  }

  _addTextToBubbleGroup(newBubbleGroups) {
    newBubbleGroups
      .append("text")
      .attr("class", "bubble-value")
      .text((d) => {
        return d.r > smallBubblesRadius ? Math.round(d.value) : "";
      })
      .attr("text-anchor", "middle")
      .attr("y", ".3em")
      .attr("fill", this._textColor)
      .style("font-size", (d) => {
        return d.r > bigBubblesRadius ? bigBubblesFont : mediumBubblesFont;
      })
      .style("font-family", "Jost Medium")
      .style("font-weight", "500")
      .attr("fill", this._textColor);
  }

  _updateBubbleValueTexts(leaves) {
    leaves
      .selectAll(".bubble-value")
      .text((d) => {
        return d.r > smallBubblesRadius ? Math.round(d.value) : "";
      })
      .attr("fill", this._textColor)
      .style("font-size", (d) => {
        return d.r > bigBubblesRadius ? bigBubblesFont : mediumBubblesFont;
      });
  }

  render() {
    const hierarchicalData = this._makeHierarchy();
    const packLayout = this._pack();
    const root = packLayout(hierarchicalData);
    const leaves = this.chart.selectAll("g").data(root.leaves());
    leaves.exit().remove();
    this._updateBubbles(leaves);
    const newBubbleGroups = this._addNewBubbleGroups(leaves);
    this._addBubbles(newBubbleGroups);

    if (this._showValues) {
      this._addTextToBubbleGroup(newBubbleGroups);
      this._updateBubbleValueTexts(leaves);
    }
  }
}
