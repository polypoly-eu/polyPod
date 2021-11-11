import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const JurisdictionTree = ({ data }) => {
    const width = 300;
    const height = 250;
    const fontSize = 14;
    let treeRef = useRef(null);

    const getDistance = (x, y) => {
        return Math.abs(x - y);
    };

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
            "EU-GDPR": "var(--jurisdiction-EU-GDPR)",
            "Five-Eyes": "var(--jurisdiction-five-eyes)",
            China: "var(--jurisdiction-china)",
            Russia: "var(--jurisdiction-russia)",
            Other: "var(--jurisdiction-others)",
        };

        const fontColors = {
            "EU-GDPR": "var(--color-text-dark)",
            "Five-Eyes": "var(--color-text-light)",
            China: "var(--color-text-light)",
            Russia: "var(--color-text-light)",
            Other: "var(--color-text-dark)",
        };

        nodes
            .append("rect")
            .attr("width", (d) => Math.max(d.x1 - d.x0, 3))
            .attr("height", (d) => Math.max(d.y1 - d.y0, 3))
            .attr("fill", (d) => backgroundColors[d.data.category] || "#A9B6C6")
            .each(function (node) {
                const texts = d3.select(this.parentNode);
                if (
                    getDistance(node.x0, node.x1) > 20 &&
                    getDistance(node.y0, node.y1) > 35
                ) {
                    texts
                        .append("text")
                        .text(`${node.data.name}: ${node.data.value}`)
                        .attr("font-size", fontSize)
                        .attr("x", 3)
                        .attr("y", fontSize)
                        .call(wrapText)
                        .style(
                            "fill",
                            fontColors[node.data.category] || "#F7FAFC"
                        );
                } else if (
                    getDistance(node.x0, node.x1) > 40 &&
                    getDistance(node.y0, node.y1) > 20
                ) {
                    texts
                        .append("text")
                        .text(`${node.data.name}: ${node.data.value}`)
                        .attr("font-size", fontSize)
                        .attr("x", 3)
                        .attr("y", fontSize)
                        .style(
                            "fill",
                            fontColors[node.data.category] || "#F7FAFC"
                        );
                }
            });
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
