import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

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

  function drawClusteredBubbles(svg) {
    const hierarchicalData = makeHierarchy(data);
    const packLayout = pack();

    const root = packLayout(hierarchicalData);

    const leafs = svg.selectAll("g").data(root.leaves());

    //exit
    leafs.exit().remove();

    //update
    leafs
      .selectAll(".bubble")
      .style("fill", bubbleColor)
      .style("stroke", "#f7fafc")
      .style("vertical-align", "center")
      .attr("fill-opacity", opacity);

    //enter
    const newBubbles = leafs
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .on("click", onBubbleClick);
    newBubbles
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => d.r)
      .style("fill", bubbleColor)
      .style("stroke", "#f7fafc")
      .style("vertical-align", "center")
      .attr("fill-opacity", opacity);

    if (showValues) {
      //add texts to new bubbles
      newBubbles
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

      //update texts on current ones
      leafs
        .selectAll(".bubble-value")
        .text((d) => {
          return d.r > smallBubblesRadius ? Math.round(d.value) : "";
        })
        .attr("fill", textColor)
        .style("font-size", (d) => {
          return d.r > bigBubblesRadius ? bigBubblesFont : mediumBubblesFont;
        });
    }
  }

  useEffect(() => {
    let svg = d3.select("svg");
    if (svg.empty()) {
      svg = createSvg();
    }
    drawClusteredBubbles(svg);
  });

  return <div className="bubble-chart" ref={bubbleRef}></div>;
};
