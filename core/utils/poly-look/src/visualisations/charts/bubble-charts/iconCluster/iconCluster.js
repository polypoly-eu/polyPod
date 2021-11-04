import * as d3 from "d3";

import { BubbleCluster } from "../..";

export const type = "icon-cluster";

const bubblePadding = 15;

/**
 * Visualizes data as a cluster of icon (unicode-emoji or svg) where the value of the icon is represented as the size.
 *
 * The icons are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small icons in the middle or outside.
 *
 * @class
 * @extends BubbleCluster
 * @param {CSS-selector} selector - A CSS selector, where the svg will be attached to
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - A svg icon path
 * @param {number} data[].value - The value of the bubble, which corresponds to it's font-size/ svg-size
 * @param {string = null} data[].background - Color of a circle that's drawn circle is drawn and the icon is put inside
 * @param {number = 400} width - The width of the svg
 * @param {number = 300} height - The height of the svg
 * @param {boolean = true} [showValues] - Whether texts displaying the value of the bubble are added
 * @param {callback = () => {}} [onIconClick] - Icon onclick function
 * @param {number|callback = 1} [opacity] - The opacity of the bubbles color 0 <= opacity <= 1 (callbacks receive event and data)
 */
export class IconCluster extends BubbleCluster {
  constructor({
    selector,
    data,
    width,
    height,
    showValues = true,
    onIconClick = () => {},
    opacity = 1,
  }) {
    super({
      type: "icon-cluster",
      selector,
      data,
      width,
      height,
      showValues,
      onBubbleClick: onIconClick,
      opacity,
    });
    this._bubblePadding = bubblePadding;
  }

  _addNewBubbleGroups(leaves) {
    return leaves
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x - d.r},${d.y - d.r})`)
      .on("click", this._onBubbleClick);
  }

  _addBubbles(bubbleGroups) {
    bubbleGroups
      .html((d) => d.data.icon)
      .select("svg")
      .attr("height", (d) => d.r * 2)
      .attr("width", (d) => d.r * 2);
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
