import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const DataBubbles = ({
    data,
    width,
    height,
    bubbleColor,
    textColor,
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

    function clearSvg() {
        d3.select(bubbleRef.current).selectAll("svg").remove();
    }

    function makeHierarchy(children) {
        return d3.hierarchy({ children }).sum((d) => d.value);
    }

    function pack() {
        return d3
            .pack()
            .size([width - edgePadding, height - edgePadding])
            .padding(3);
    }

    function createBubbleContainer() {
        return d3
            .select(bubbleRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);
    }

    const drawLeafs = (leaf) => {
        leaf.append("circle")
            .attr("r", (d) => d.r)
            .style("fill", bubbleColor)
            .style("stroke", "#f7fafc")
            .style("vertical-align", "center")
            .attr("fill-opacity", opacity);

        showValues
            ? leaf
                  .append("text")
                  .text((d) => {
                      return d.r > smallBubblesRadius
                          ? Math.round(d.value)
                          : "";
                  })
                  .attr("text-anchor", "middle")
                  .attr("y", ".3em")
                  .style("fill", textColor)
                  .style("font-size", (d) => {
                      return d.r > bigBubblesRadius
                          ? bigBubblesFont
                          : mediumBubblesFont;
                  })
                  .style("font-family", "Jost Medium")
                  .style("font-weight", "500")
            : null;
    };

    function drawDataBubbles(bubbleContainer) {
        const hierarchicalData = makeHierarchy(data);
        const packLayout = pack();

        const root = packLayout(hierarchicalData);
        const leaf = bubbleContainer
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
            .on("click", onBubbleClick);

        if (drawLeafs) {
            drawLeafs(leaf, bubbleContainer);
        }
    }

    useEffect(() => {
        data.forEach((e) => {
            e.value = e.count;
        });
        clearSvg();
        drawDataBubbles(createBubbleContainer());
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default DataBubbles;
