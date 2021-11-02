import * as d3 from "d3";

import { BubbleCluster } from "../..";

export const type = "icon-cluster";

const bubblePadding = 10;

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * @class
 * @extends BubbleCluster
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {string} inputType - The inputType of the icons (font or svg)
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title -
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} width - The width of the svg
 * @param {number = 300} height - The height of the svg
 * @param {boolean = true} [showValues] - Whether texts displaying the value of the bubble are added
 * @param {callback = () => {}} [onIconClick] - Icon onclick function
 */
export class IconCluster extends BubbleCluster {
  constructor({
    selector,
    inputType,
    data,
    width,
    height,
    showValues = true,
    onIconClick = () => {},
  }) {
    super({
      type: "icon-cluster",
      selector,
      data,
      width,
      height,
      showValues,
      onBubbleClick: onIconClick,
    });
    this._inputType = inputType;
    this._bubblePadding = bubblePadding;
  }

  _addNewBubbleGroups(leaves) {
    return leaves.enter().append("g").on("click", this._onBubbleClick);
  }

  _addBubbles(bubbleGroups) {
    bubbleGroups
      .filter((d) => d.data.background == true)
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => d.r)
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .style("fill", "white")
      .style("stroke", "#f7fafc")
      .style("vertical-align", "center")
      .attr("fill-opacity", 1);
    /*
    this._inputType == "font"
      ? bubbleGroups
          .append("text")
          .text((d) => d.data.title)
          .attr("class", "bubble")
          .attr("y", (d) => d.y + 40)
          .attr("x", (d) => d.x - d.r)
          .attr("font-size", (d) => d.r * 2)
          .attr("text-anchor", "center")
      : bubbleGroups
          .append("svg:image")
          .attr("xlink:href", (d) => d.data.title)
          .attr("class", "bubble")
          .style("vertical-align", "center");
  */
  }

  render() {
    const hierarchicalData = this._makeHierarchy();
    const packLayout = this._pack();
    const root = packLayout(hierarchicalData);
    const leaves = this.chart.selectAll("g").data(root.leaves());
    leaves.exit().remove();
    const newBubbleGroups = this._addNewBubbleGroups(leaves);
    this._addBubbles(newBubbleGroups);
  }
}
