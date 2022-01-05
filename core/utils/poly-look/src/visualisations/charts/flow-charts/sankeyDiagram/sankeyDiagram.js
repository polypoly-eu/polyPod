import { Chart } from "../../chart";

import * as d3 from "d3";
import * as d3Sankey from "d3-sankey";

//default values
const linkSource = ({ source }) => source,
  linkTarget = ({ target }) => target,
  linkValue = ({ value }) => value,
  intern = (value) =>
    value !== null && typeof value === "object" ? value.valueOf() : value,
  nodeWidth = 5,
  nodePadding = 12,
  linkMixBlendMode = "multiply",
  linkPath = d3Sankey.sankeyLinkHorizontal(),
  defaultNodeLabel = (d) => `${d.id}: ${d.value}`,
  defaultMargin = {
    top: 8,
    right: 0,
    bottom: 16,
    left: 0,
  },
  defaultLinkOpacity = 0.5,
  defaultNodeLabelTextOpacity = 1,
  defaultTextColor = "#0F1938",
  defaultLinkColor = "blue",
  defaultNodeColor = "black",
  nodeLabelPadding = 10,
  nodeLabelBoxPaddingX = 4,
  nodeLabelBoxPaddingY = 1,
  nodeLabelBoxBorderRadius = 2,
  defaultNodeLabelBoxColor = "white",
  defaultNodeLabelBoxOpacity = 0.7;

/**
 * Visualizes data as a flow from n to m (to x to y ..) entitites
 *
 * @class
 * @param {Object[]} links - The data to be visualized as a sankey diagram
 * @param {string} links[].source - Source of the link
 * @param {string} links[].target - Target of the link
 * @param {number} links[].value - Value of the link
 * @param {number = 400} [width] - The width of the svg
 * @param {number = 300} [height] - The height of the svg
 * @param {Object} [options] - Options
 * @param {boolean = true} [options.labels] - Showing labels of the nodes in the diagram
 * @param {string} [options.align] - Alignment of the diagram (defaults to justify)
 * @param {Object} [margin] - Margins of the chart
 * @param {number = 0} [margin.top/right/bottom/left] - The respective margins
 * @param {Object} [color] - All color attributes
 * @param {string/callback = "black"} [color.node] - Color of the nodes
 * @param {string/callback = "#0F1938"} [color.text] - Color of the label text of the nodes
 * @param {number/callback = 1} [color.textOpacity] - Opacity of the label text of the nodes
 * @param {string/callback = "white"} [color.nodeLabelBoxColor] - Color of the box surrounding the node label
 * @param {number/callback =0.7"} [color.nodeLabelBoxOpacity] - Opacity of the box surrounding the node label
 * @param {string/callback = "blue"} [color.link] - Color of the link
 * @param {number/callback = 0.5} [color.linkOpacity] - Opacity of the link
 */
export class SankeyDiagram extends Chart {
  constructor({
    selector,
    links,
    width = 400,
    height = 300,
    options,
    margin,
    color,
    gradients,
    nodeLabel,
  }) {
    super({
      selector,
      width,
      height,
      gradients,
    });
    this._links = links;
    this._nodeAlign =
      {
        left: d3Sankey.sankeyLeft,
        right: d3Sankey.sankeyRight,
        center: d3Sankey.sankeyCenter,
      }[options?.align] ?? d3Sankey.sankeyJustify;
    this._labelsShowing = options?.labels !== false;
    this._margin = margin || defaultMargin;
    this._nodeColor = color?.node || defaultNodeColor;
    this._nodeLabel = nodeLabel;
    this._nodeLabelTextColor = color?.text || defaultTextColor;
    this._nodeLabelTextOpacity =
      color?.textOpacity || defaultNodeLabelTextOpacity;
    this._nodeLabelBoxColor =
      color?.nodeLabelBoxColor || defaultNodeLabelBoxColor;
    this._nodeLabelBoxOpacity =
      color?.nodeLabelBoxOpacity || defaultNodeLabelBoxOpacity;
    this._linkColor = color?.link || defaultLinkColor;
    this._linkOpacity = color?.linkOpacity || defaultLinkOpacity;
  }

  _createSVG() {
    const svg = d3
      .select(this._selector)
      .append("svg")
      .attr("viewBox", [0, 0, this._width, this._height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    if (this._gradients) this._createGradients(svg);
    return svg;
  }

  _computeSankeyLayout(nodes, links) {
    d3Sankey
      .sankey()
      .nodeId((d) => d.id)
      .nodeAlign(this._nodeAlign)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [this._margin.left, this._margin.top],
        [this._width - this._margin.right, this._height - this._margin.bottom],
      ])({ nodes, links });
  }

  _addNodes(nodesData) {
    let nodes = this.chart.select(".nodes");
    if (nodes.empty()) nodes = this.chart.append("g").attr("class", "nodes");
    nodes
      .selectAll("rect")
      .data(nodesData)
      .join("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0);
  }

  _addLinks(linksData) {
    let links = this.chart.select(".links");
    if (links.empty()) links = this.chart.append("g").attr("class", "links");
    let pathGroups = links
      .selectAll("g")
      .data(linksData)
      .join("g")
      .attr("fill", "none")
      .style("mix-blend-mode", linkMixBlendMode);

    if (pathGroups.select("path").empty()) pathGroups.append("path");
    pathGroups
      .select("path")
      //Rectangular paths where d.y0 === d.y1 do not have a width -> with " l0,0.001" we force it to have one so gradients can be applied
      .attr("d", (d) => linkPath(d) + " l0,0.001")
      .attr("stroke", this._linkColor)
      .attr("stroke-width", ({ width }) => Math.max(1, width))
      .attr("stroke-opacity", this._linkOpacity);
  }

  _addNodeLabelText(nodesData, nodeLabels) {
    nodeLabels
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("text")
      .data(nodesData)
      .join("text")
      .attr("x", (d) =>
        d.x0 < this._width / 2
          ? d.x1 + nodeLabelPadding
          : d.x0 - nodeLabelPadding
      )
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0 < this._width / 2 ? "start" : "end"))
      .attr("opacity", this._nodeLabelTextOpacity)
      .attr("fill", this._nodeLabelTextColor)
      .text((d) => {
        if (!this._nodeLabel) return defaultNodeLabel(d);
        if (!this._nodeLabel.source) return this._nodeLabel(d);
        return d.x0 < this._width / 2
          ? this._nodeLabel.source(d)
          : this._nodeLabel.target(d);
      });
  }

  _addNodeLabelsContainer(nodeLabels) {
    nodeLabels.selectAll("text").each((_, i, nodes) => {
      const bBox = nodes[i].getBBox();
      nodeLabels
        .append("rect")
        .attr("x", bBox.x - nodeLabelBoxPaddingX)
        .attr("y", bBox.y - nodeLabelBoxPaddingY)
        .attr("width", bBox.width + nodeLabelBoxPaddingX * 2)
        .attr("height", bBox.height + nodeLabelBoxPaddingY * 2)
        .attr("fill", defaultNodeLabelBoxColor)
        .attr("opacity", defaultNodeLabelBoxOpacity)
        .attr("rx", nodeLabelBoxBorderRadius);
    });
  }

  _addNodeLabels(nodesData) {
    let nodeLabels = this.chart.select(".node-labels");
    if (nodeLabels.empty())
      nodeLabels = this.chart.append("g").attr("class", "node-labels");

    //Drawing labels to have bounding boxes
    this._addNodeLabelText(nodesData, nodeLabels);

    nodeLabels.selectAll("rect").remove();
    this._addNodeLabelsContainer(nodeLabels);

    //Redrawing the labels so they are on top
    nodeLabels.selectAll("text").remove();
    this._addNodeLabelText(nodesData, nodeLabels);
  }

  render() {
    const linkSources = d3.map(this._links, linkSource).map(intern);
    const linkTargets = d3.map(this._links, linkTarget).map(intern);
    const linkValues = d3.map(this._links, linkValue);
    const nodes = Array.from(d3.union(linkSources, linkTargets), (id) => ({
      id,
    }));

    // Replace the input nodes and links with mutable objects for the simulation.
    const links = d3.map(this._links, (_, i) => ({
      source: linkSources[i],
      target: linkTargets[i],
      value: linkValues[i],
    }));

    this._computeSankeyLayout(nodes, links);
    this._addNodes(nodes);
    this._addLinks(links);
    if (this._labelsShowing) this._addNodeLabels(nodes);
  }
}
