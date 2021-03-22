import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const JurisdictionTree = ({ data, width, height, fontSize }) => {
    let treeRef = useRef(null);

    const clearSvg = () => {
        d3.select(treeRef.current).selectAll("svg").remove();
    };

    const createTreeContainer = () => {
        return d3
            .select(treeRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("font", "10px sans-serif");
    };

    const drawJurisdictionTree = (treeContainer) => {
        const root = d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value);

        const treemapRoot = d3.treemap().size([width, height]).padding(2)(root);
        const nodes = treeContainer
            .selectAll("g")
            .data(treemapRoot.leaves())
            .join("g")
            .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

        const backgroundColors = {
            "EU-GDPR": "#60E6DE",
            "Five-Eyes": "#EC453D",
            China: "#C5271E",
            Russia: "#FE8988",
            Other: "#A9B6C6",
        };

        const fontColors = {
            "EU-GDPR": "#0F1938",
            "Five-Eyes": "white",
            China: "white",
            Russia: "white",
            Other: "#0F1938",
        };

        nodes
            .append("rect")
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr(
                "fill",
                (d) => backgroundColors[d.data.category] || "#0F1938"
            );

        console.log(nodes);
        nodes
            .append("text")
            .text((d) => `${d.data.name}: ${d.data.value}`)
            .attr("font-size", (d) =>
                d.x1 - d.x0 > 24
                    ? `${fontSize}px`
                    : `${fontSize - (d.x1 - d.x0) / 2}px`
            )
            .attr("x", (d) => (d.x1 - d.x0 > 24 ? 3 : 2))
            .attr("y", (d) =>
                d.x1 - d.x0 > 24 ? fontSize : fontSize - (d.x1 - d.x0) / 2
            )
            .call(wrapText)
            .style("fill", (d) => fontColors[d.data.category] || "white");
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
        clearSvg();
        drawJurisdictionTree(createTreeContainer());
    });

    return <div className="jurisdiction-tree" ref={treeRef}></div>;
};

export default JurisdictionTree;
