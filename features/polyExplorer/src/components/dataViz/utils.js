function appendLabel(container, text) {
    const label = container.append("g").attr("class", "label");
    label
        .append("text")
        .text(text)
        .style("fill", "#F7FAFC")
        .style("font-size", 14)
        .style("font-family", "Jost Medium")
        .style("font-weight", "500")
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

function findCircleLabelPosition(
    labelBounds,
    containerBounds,
    circle,
    distance
) {
    let x = circle.x;
    const xApothem = labelBounds.width / 2;
    if (circle.x - xApothem < 0) x = xApothem;
    else if (circle.x + xApothem > containerBounds.width)
        x = containerBounds.width - xApothem;

    const topY = circle.y - circle.r - labelBounds.height - distance;
    const y =
        (topY >= 0 ? topY : circle.y + circle.r + distance) +
        labelBounds.height / 2;

    return { x, y };
}

function appendCircleLabel(container, circle, text) {
    const circleLabel = container.append("g").attr("class", "circle-label");
    const label = appendLabel(circleLabel, text);
    const bounds = label.node().getBBox();
    const containerBounds = container.node().viewBox.baseVal;
    const lineLength = 8;
    const labelPosition = findCircleLabelPosition(
        bounds,
        containerBounds,
        circle,
        lineLength
    );
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

    return circleLabel;
}

function findNode(selection, matchFunction) {
    let match = null;
    selection.filter(matchFunction).each((node) => (match = node));
    return match;
}

function calculateElementRect(element) {
    const bounds = element.getBBox();
    const rect = {
        left: bounds.x,
        right: bounds.x + bounds.width,
        top: bounds.y,
        bottom: bounds.y + bounds.height,
    };

    // The element's bounding box is relative to its own coordinate system,
    // i.e. it does not consider its transformation matrix. This is an
    // attempt to do that manually, that does however not consider anything
    // but translate().
    const transform = element.transform.baseVal.consolidate().matrix;
    rect.left += transform.e;
    rect.right += transform.e;
    rect.top += transform.f;
    rect.bottom += transform.f;
    return rect;
}

function scaleFactor(viewBox, svg) {
    return Math.min(svg.width / viewBox.width, svg.height / viewBox.height);
}

const detectRectCollision = (a, b) =>
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top;

export default {
    appendLabel,
    appendCircleLabel,
    findNode,
    calculateElementRect,
    detectRectCollision,
    scaleFactor,
};
