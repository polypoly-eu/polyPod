function appendLabel(container, text, props = {}) {
    const label = container.append("g").attr("class", "label");
    label
        .append("text")
        .text(text)
        .style("fill", "#F7FAFC")
        .style("font-size", props.fontSize || 14)
        .style("font-family", "Jost Medium")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle");

    // Vertically, the text's bounding box height looks larger than the
    // text, so the paddings account for that. Horizontally however, it fits
    // the text visually tightly, so the padding defined here is what it
    // looks like.
    const padding = {
        top: 3,
        right: 6,
        bottom: 0,
        left: 6,
    };

    const bounds = label.node().getBBox();
    label
        .append("rect")
        .attr("x", -bounds.width / 2 - padding.left)
        .attr("y", -bounds.height / 2 - padding.top)
        .attr("width", bounds.width + padding.left + padding.right)
        .attr("height", bounds.height + padding.top + padding.bottom)
        .style("fill", "rgba(15, 25, 56, 0.7")
        .attr("rx", 2)
        .lower();

    return label;
}

function findCircleLabelPosition(labelBounds, circle, distance) {
    const topY = circle.y - circle.r - labelBounds.height - distance;
    const y =
        (topY >= 0 ? topY : circle.y + circle.r + distance) +
        labelBounds.height / 2;
    return {
        x: circle.x,
        y,
    };
}

function appendCircleLabel(container, circle, text, props = {}) {
    const circleLabel = container.append("g").attr("class", "circle-label");
    const label = appendLabel(circleLabel, text, props);
    const bounds = label.node().getBBox();
    const lineLength = 8;
    const labelPosition = findCircleLabelPosition(bounds, circle, lineLength);
    label.attr(
        "transform",
        `translate(${labelPosition.x}, ${labelPosition.y})`
    );
    const lineY =
        labelPosition.y < circle.y
            ? circle.y - circle.r - lineLength
            : circle.y + circle.r;
    circleLabel
        .append("line")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .attr("x1", circle.x)
        .attr("y1", lineY)
        .attr("x2", circle.x)
        .attr("y2", lineY + lineLength);
}

function findNode(selection, matchFunction) {
    let match = null;
    selection.filter(matchFunction).each((node) => (match = node));
    return match;
}

export default {
    appendLabel,
    appendCircleLabel,
    findNode,
};
