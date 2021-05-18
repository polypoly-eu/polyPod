import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const DataTypeBubbles = ({ data, width, height, drawLeafs }) => {
    const bubbleRef = useRef();
    const edgePadding = 5;

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

    function drawDataBubbles(bubbleContainer) {
        const hierarchicalData = makeHierarchy(data);
        const packLayout = pack();

        const root = packLayout(hierarchicalData);
        const leaf = bubbleContainer
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

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

export default DataTypeBubbles;
