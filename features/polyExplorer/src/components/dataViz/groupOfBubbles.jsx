import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const GroupOfBubbles = ({ data, width, height, color }) => {
    const bubbleRef = useRef();
    const edgePadding = 5;
    const bubblesClass = "bubble-group";
    const bubblesSelector = `.${bubblesClass}`;

    function cleanBubbles() {
        d3.select(bubbleRef.current).selectAll(bubblesSelector).remove();
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
            .style("width", width)
            .style("height", height);
    }

    function drawDataBubbles(bubbleContainer, bubblesData) {
        const hierarchicalData = makeHierarchy(bubblesData);
        const packLayout = pack();

        const root = packLayout(hierarchicalData);
        const bubblesGroups = bubbleContainer
            .selectAll(bubblesSelector)
            .data(root.leaves());

        bubblesGroups
            .enter()
            .append("g")
            .merge(bubblesGroups)
            .attr("class", bubblesClass)
            .attr("transform", (d) => `translate(${d.x + 1}, ${d.y + 1})`)
            .append("circle")
            .transition()
            .duration(1000)
            .attr("r", (d) => d.r)
            .style("fill", color);
    }

    useEffect(() => {
        const bubblesData = data.map((value) => ({ value }));
        cleanBubbles();
        drawDataBubbles(createBubbleContainer(), bubblesData);
    }, [data]);

    return <g ref={bubbleRef}></g>;
};

export default GroupOfBubbles;
