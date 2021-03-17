import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const RectangleTree = ({ data, width, height, fontSize }) => {
    let treeRef = useRef(null);

    const createTreeContainer = () => {
        return d3
            .select(treeRef.current)
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .style("border", "thin black solid")
            .style("font", "10px sans-serif");
    };

    const drawRectangleTree = (treeContainer) => {
        const root = d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value);

        const treemapRoot = d3.treemap().size([width, height]).padding(1)(root);
        const nodes = treeContainer
            .selectAll("g")
            .data(treemapRoot.leaves())
            .join("g")
            .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

        const fader = (color) => d3.interpolateRgb(color, "#fff")(0.3);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader));

        nodes
            .append("rect")
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("fill", (d) => colorScale(d.data.category));

        nodes
            .append("text")
            .text((d) => `${d.data.name} ${d.data.value}`)
            .attr("font-size", `${fontSize}px`)
            .attr("x", 3)
            .attr("y", fontSize)
            .call(wrapText)
            .style("fill", "white");
    };

    function wrapText(selection) {
        selection.each(function () {
            const node = d3.select(this);
            const rectWidth = +node.attr("data-width");
            let word;
            const words = node.text().split(" ").reverse();
            let line = [];
            const x = node.attr("x");
            const y = node.attr("y");
            let tspan = node.text("").append("tspan").attr("x", x).attr("y", y);
            let lineNumber = 0;
            while (words.length > 1) {
                word = words.pop();
                line.push(word);
                tspan.text(line.join(" "));
                const tspanLength = tspan.node().getComputedTextLength();
                if (tspanLength > rectWidth && line.length !== 1) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = addTspan(word);
                }
            }

            addTspan(words.pop());

            function addTspan(text) {
                lineNumber += 1;
                return node
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", `${lineNumber * fontSize}px`)
                    .text(text);
            }
        });
    }

    useEffect(() => {
        drawRectangleTree(createTreeContainer());
    });

    return <div ref={treeRef}></div>;
};

export default RectangleTree;
