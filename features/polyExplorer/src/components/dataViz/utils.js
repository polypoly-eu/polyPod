function appendLabel(container, text, props = {}) {
    const label = container.append("g").attr("class", "label");
    label
        .append("text")
        .text(text)
        .style("fill", "#F7FAFC")
        .style("font-size", props.fontSize || 14)
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

export default {
    appendLabel,
};
