import React, { useRef, useEffect } from "react";
import GroupOfBubbles from "../../dataViz/groupOfBubbles.jsx";
import * as d3 from "d3";

const OneMessagerBubblesChart = ({ data, width, height, coord }) => {
    const chartRef = useRef();
    const darkColor = "#0f1938";
    const labelsConfig = {
        height: 50,
        yAxisCorrection: 10,
    };
    const fontConfig = {
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "-0.01em",
    };

    function setContainer() {
        d3.select(chartRef.current)
            .style("width", width)
            .style("height", height)
            .attr("transform", `translate(${coord})`);
    }

    function setTitle() {
        d3.select(chartRef.current)
            .append("foreignObject")
            .style("width", width)
            .style("height", labelsConfig.height)
            .attr(
                "transform",
                `translate(${coord[0]}, ${
                    coord[1] + height - labelsConfig.yAxisCorrection
                })`
            )
            .append("xhtml:div")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("width", `${width}px`)
            .style("height", `${labelsConfig.height}px`)
            .append("xhtml:span")
            .style("color", darkColor)
            .style("font-size", `${fontConfig.fontSize}px`)
            .style("font-weight", fontConfig.fontWeight)
            .style("letter-spacing", fontConfig.letterSpacing)
            .text(data.title);
    }

    useEffect(() => {
        setContainer();
        setTitle();
    }, []);

    return (
        <g ref={chartRef}>
            <GroupOfBubbles
                data={data.bubbles}
                width={width}
                height={height}
                color={data.color}
            ></GroupOfBubbles>
        </g>
    );
};

export default OneMessagerBubblesChart;
