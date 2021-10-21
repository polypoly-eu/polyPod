import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

/**
 * Visualizes data as a cluster of bubbles where the value of the bubble is represented as the radius.
 *
 * The bubbles are being added in a spiral starting in the center of the cluster meaning sorted data will lead to all small bubbles in the middle or outside.
 *
 * @function
 * @param {Object[]} data - The data to be visualized as a bubble cluster
 * @param {string} data[].title - The title/name the bubble has
 * @param {number} data[].value - The value of the bubble, which corresponds to it's radius
 * @param {number = 400} width - The width of the svg
 * @param {number = 300} height - The height of the svg
 * @param {string|callback = "blue"} [bubbleColor] - The color of the bubble (callbacks receive event and data)
 * @param {string|callback = "white"} [textColor] - The color of the bubble text (callbacks receive event and data)
 * @param {number|callback = 1} [bubbleColor] - The opacity of the bubbles color 0 <= opacity <= 1 (callbacks receive event and data)
 * @param {boolean = true} [showValues] - Whether texts displaying the value of the bubble are added
 * @param {callback = () => {}} [onBubbleClick] - Bubble onclick function
 * @returns {jsx-div with svg attached}
 */
export const BubbleCluster = ({
  data,
  width,
  height,
  bubbleColor = "blue",
  textColor = "white",
  opacity = 1,
  showValues = true,
  onBubbleClick = () => {},
}) => {
  const bubbleRef = useRef();
  const edgePadding = 5;
  const smallBubblesRadius = 20;
  const bigBubblesRadius = 50;
  const bigBubblesFont = "20px";
  const mediumBubblesFont = "16px";

  function makeHierarchy(children) {
    return d3.hierarchy({ children }).sum((d) => d.value);
  }

  function pack() {
    return d3
      .pack()
      .size([width - edgePadding, height - edgePadding])
      .padding(3);
  }

  function createSvg() {
    return d3
      .select(bubbleRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);
  }

  function updateBubbles(leaves) {
    leaves
      .selectAll(".bubble")
      .style("fill", bubbleColor)
      .style("stroke", "#f7fafc")
      .style("vertical-align", "center")
      .attr("fill-opacity", opacity);
  }

  function addNewBubbleGroups(leaves) {
    return leaves
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .on("click", onBubbleClick);
  }

  function addBubbles(bubbleGroups) {
    bubbleGroups
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => d.r)
      .style("fill", bubbleColor)
      .style("stroke", "#f7fafc")
      .style("vertical-align", "center")
      .attr("fill-opacity", opacity);
  }

  function addTextToBubbleGroup(newBubbleGroups) {
    newBubbleGroups
      .append("text")
      .attr("class", "bubble-value")
      .text((d) => {
        return d.r > smallBubblesRadius ? Math.round(d.value) : "";
      })
      .attr("text-anchor", "middle")
      .attr("y", ".3em")
      .attr("fill", textColor)
      .style("font-size", (d) => {
        return d.r > bigBubblesRadius ? bigBubblesFont : mediumBubblesFont;
      })
      .style("font-family", "Jost Medium")
      .style("font-weight", "500")
      .attr("fill", textColor);
  }

  function updateBubbleValueTexts(leaves) {
    leaves
      .selectAll(".bubble-value")
      .text((d) => {
        return d.r > smallBubblesRadius ? Math.round(d.value) : "";
      })
      .attr("fill", textColor)
      .style("font-size", (d) => {
        return d.r > bigBubblesRadius ? bigBubblesFont : mediumBubblesFont;
      });
  }

  function drawClusteredBubbles(svg) {
    const hierarchicalData = makeHierarchy(data);
    const packLayout = pack();

    const root = packLayout(hierarchicalData);

    const leaves = svg.selectAll("g").data(root.leaves());

    leaves.exit().remove();
    updateBubbles(leaves);
    const newBubbleGroups = addNewBubbleGroups(leaves);
    addBubbles(newBubbleGroups);

    if (showValues) {
      addTextToBubbleGroup(newBubbleGroups);
      updateBubbleValueTexts(leaves);
    }
  }

  useEffect(() => {
    let svg = d3.select(bubbleRef.current).select("svg");
    if (svg.empty()) {
      svg = createSvg();
    }
    drawClusteredBubbles(svg);
  });

  return <div className="bubble-chart" ref={bubbleRef}></div>;
};
