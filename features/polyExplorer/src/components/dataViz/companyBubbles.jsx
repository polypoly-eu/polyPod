import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";
import utils from "./utils.js";
import "./dataViz.css";

const CompanyBubbles = ({
    data,
    view,
    width,
    height,
    opacity = 1,
    bubbleColor,
    maxCompanies,
    highlight = {},
}) => {
    const bubbleRef = useRef();
    const edgePadding = 5;

    const clearSvg = () => {
        d3.select(bubbleRef.current).selectAll("svg").remove();
    };

    const getIndustryName = (industryCategory) =>
        industryCategory?.name?.[i18n.language] ||
        i18n.t("common:category.undisclosed");

    function groupByIndustry(companies) {
        const groups = {};
        for (let { name, industryCategory } of companies) {
            const industry = getIndustryName(industryCategory);
            if (!groups[industry]) groups[industry] = [];
            groups[industry].push(name);
        }
        return groups;
    }

    const highlightTexts = (() => {
        const company = data.find((company) => company.name === highlight.name);
        if (!company) return {};
        return {
            industry: {
                name: getIndustryName(company.industryCategory),
                explanation: highlight.industryExplanation[i18n.language],
            },
            company: {
                name: company.name,
                explanation: highlight.companyExplanation[i18n.language],
            },
        };
    })();

    function createIndustryViewData(data) {
        const companiesByIndustry = groupByIndustry(data);
        const viewData = { padding: 40 };
        viewData.children = Object.entries(companiesByIndustry).map(
            ([industry, names]) => ({
                name: industry,
                children: names.map((name) => ({ name })),
            })
        );
        return viewData;
    }

    const appendBubbleContainer = () => {
        return d3
            .select(bubbleRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("opacity", opacity);
    };

    function appendBubbles(container, data) {
        const root = d3.hierarchy(data).sum(() => 1);

        // This formula needs some revisiting, it was just tinkered
        // together. The idea is that the radius is small enough so that all
        // visualisations here look alright when the amountof companies is at
        // maxCompanies - there must be a more reliable way to achieve that.
        const bubbleRadius = (width * Math.PI) / maxCompanies / 6;

        const packLayout = d3
            .pack()
            .size([width - edgePadding, height - edgePadding])
            .padding((d) => d.data.padding || 1)
            .radius(() => bubbleRadius);
        packLayout(root);

        return container
            .selectAll("circle")
            .data(root.descendants())
            .enter()
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", (d) => d.r);
    }

    function appendBubbleLabel(container, bubble, text) {
        const label = utils.appendLabel(container, text);
        const bounds = label.node().getBBox();
        const lineLength = 8;
        label.attr(
            "transform",
            `translate(${bubble.x}, ${
                bubble.y - bubble.r - bounds.height / 2 - lineLength
            })`
        );
        container
            .append("line")
            .style("stroke", "white")
            .style("stroke-width", 1)
            .attr("x1", bubble.x)
            .attr("y1", bubble.y - bubble.r - lineLength)
            .attr("x2", bubble.x)
            .attr("y2", bubble.y - bubble.r);
    }

    function appendIndustryLabel(container, bubble) {
        const industry = bubble.data.name;
        const count = bubble.data.children.length;
        appendBubbleLabel(container, bubble, `${industry}: ${count}`);
    }

    function appendExplanation(container, highlightedBubble, explanation) {
        const containerRect = container.node().viewBox.baseVal;
        const topExplanation =
            highlightedBubble.y - highlightedBubble.r >
            containerRect.height / 2;
        const explanationWidth = 260;
        const foreignObject = container
            .append("foreignObject")
            .attr("x", (containerRect.width - explanationWidth) / 2)
            .attr("width", explanationWidth);
        const div = foreignObject
            .append("xhtml:div")
            .attr("class", "on-bubble")
            .html(explanation);
        const divHeight = div.node().getBoundingClientRect().height;
        foreignObject
            .attr("y", topExplanation ? 0 : containerRect.height - divHeight)
            .attr("height", divHeight);
    }

    const drawFunctions = {
        flat: (container) => {
            const viewData = {
                children: data.map((company) => ({ name: company })),
            };
            const bubbles = appendBubbles(container, viewData);
            bubbles.filter((d) => d.children).style("fill", "transparent");
            bubbles.filter((d) => !d.children).style("fill", bubbleColor);
        },
        allIndustries: (container) => {
            const viewData = createIndustryViewData(data);
            const bubbles = appendBubbles(container, viewData);

            bubbles.filter((d) => d.children).style("fill", "transparent");

            const industryBubbles = bubbles.filter(
                (d) => d.parent && d.children
            );
            industryBubbles.style("stroke", bubbleColor);

            const companyBubbles = bubbles.filter((d) => !d.children);
            companyBubbles
                .style("fill", bubbleColor)
                .style("fill-opacity", 0.15);

            industryBubbles.each((e) => appendIndustryLabel(container, e));
        },
        industryHighlight: (container) => {
            if (!highlightTexts.industry) return;

            const viewData = createIndustryViewData(data);
            viewData.children.find(
                (industry) => industry.name === highlightTexts.industry.name
            ).highlighted = true;

            const bubbles = appendBubbles(container, viewData);
            bubbles
                .style("fill", (d) =>
                    d.children ? "transparent" : bubbleColor
                )
                .style("fill-opacity", (d) =>
                    d.parent?.data.highlighted ? 1 : 0.15
                );

            let highlightedBubble;
            bubbles
                .filter((d) => d.data.highlighted)
                .each((e) => (highlightedBubble = e));
            appendIndustryLabel(container, highlightedBubble);
            appendExplanation(
                container,
                highlightedBubble,
                highlightTexts.industry.explanation
            );
        },
        companyHighlight: (container) => {
            if (!highlightTexts.company) return;

            const viewData = createIndustryViewData(data);
            viewData.children.forEach(({ children }) => {
                const match = children.find(
                    (company) => company.name === highlightTexts.company.name
                );
                if (match) match.highlighted = true;
            });

            const bubbles = appendBubbles(container, viewData);
            bubbles
                .style("fill", (d) =>
                    d.children ? "transparent" : bubbleColor
                )
                .style("fill-opacity", (d) => (d.data.highlighted ? 1 : 0.15));

            let highlightedBubble;
            bubbles
                .filter((d) => d.data.highlighted)
                .each((e) => (highlightedBubble = e));
            appendBubbleLabel(
                container,
                highlightedBubble,
                highlightedBubble.data.name
            );
            appendExplanation(
                container,
                highlightedBubble,
                highlightTexts.company.explanation
            );
        },
    };

    function draw() {
        const bubbleContainer = appendBubbleContainer();
        const drawFunction = drawFunctions[view];
        if (drawFunction) drawFunction(bubbleContainer);
    }

    useEffect(() => {
        clearSvg();
        draw();
    });

    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default CompanyBubbles;
