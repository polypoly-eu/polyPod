import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";
import utils from "./utils.js";
import "./dataViz.css";

const CompanyBubbles = ({
    companyIndustryMap,
    view,
    width,
    height,
    opacity = 1,
    bubbleColor,
    maxCompanies,
    highlight = {},
}) => {
    const bubbleRef = useRef();
    const viewStates = Object.freeze({ flat: 1, industries: 2 });
    const viewState = useRef();

    const getRoot = () => d3.select(bubbleRef.current);

    const getIndustryName = (industryCategory) =>
        industryCategory?.name?.[i18n.language] ||
        i18n.t("common:category.undisclosed");
    const highlightTexts = (() => {
        if (!highlight.name) return {};
        const company = (() => {
            for (let companies of Object.values(companyIndustryMap)) {
                const match = companies.find(
                    (company) => company.name === highlight.name
                );
                if (match) return match;
            }
        })();
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

    function appendBubbles(container, data) {
        const root = d3.hierarchy(data).sum(() => 1);

        // This formula needs some revisiting, it was just tinkered
        // together. The idea is that the radius is small enough so that all
        // visualisations here look alright when the amountof companies is at
        // maxCompanies - there must be a more reliable way to achieve that.
        const bubbleRadius = ((width * Math.PI) / maxCompanies) * 2;

        const edgePadding = 5;
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
            .attr("class", "bubble")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", (d) => d.r);
    }

    const clearAll = () => getRoot().selectAll("svg > *").remove();

    function setUpFlatView(container) {
        const previousState = viewState.current;
        viewState.current = viewStates.flat;
        if (viewState.current === previousState)
            return getRoot().selectAll(".bubble");

        clearAll();
        const viewData = {
            children: Object.values(companyIndustryMap).map((company) => ({
                name: company,
            })),
        };
        return appendBubbles(container, viewData);
    }

    function createIndustryViewData() {
        // This padding is what's currently keeping the industry labels from
        // colliding (for the most part). But we'll need a better solution.
        const viewData = { padding: 40 };
        viewData.children = Object.entries(companyIndustryMap).map(
            ([industry, companies]) => ({
                name: industry,
                children: companies.map((company) => ({
                    name: company.name,
                    highlightedCompany:
                        company.name === highlightTexts?.company?.name,
                })),
                highlightedIndustry:
                    industry === highlightTexts?.industry?.name,
            })
        );

        return viewData;
    }

    function setUpIndustryView(container) {
        const previousState = viewState.current;
        viewState.current = viewStates.industries;
        if (viewState.current === previousState) {
            const root = getRoot();
            root.selectAll(".bubble-label, .explanation").remove();
            return root.selectAll(".bubble");
        }

        clearAll();
        const viewData = createIndustryViewData();
        return appendBubbles(container, viewData);
    }

    function appendBubbleLabel(container, bubble, text) {
        const bubbleLabel = container.append("g").attr("class", "bubble-label");
        const label = utils.appendLabel(bubbleLabel, text, { fontSize: 10 });
        const bounds = label.node().getBBox();
        const lineLength = 8;
        label.attr(
            "transform",
            `translate(${bubble.x}, ${
                bubble.y - bubble.r - bounds.height / 2 - lineLength
            })`
        );
        bubbleLabel
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

    function findNode(nodes, matchFunction) {
        let match = null;
        nodes.filter(matchFunction).each((node) => (match = node));
        return match;
    }

    function appendExplanation(container, highlightedBubble, explanation) {
        const containerRect = container.node().viewBox.baseVal;
        const topExplanation =
            highlightedBubble.y - highlightedBubble.r >
            containerRect.height / 2;
        const explanationWidth = 260;
        const foreignObject = container
            .append("foreignObject")
            .attr("class", "explanation")
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

    const renderFunctions = {
        flat: (container) => {
            const bubbles = setUpFlatView(container);
            bubbles.filter((d) => d.children).style("fill", "transparent");
            bubbles.filter((d) => !d.children).style("fill", bubbleColor);
        },
        allIndustries: (container) => {
            const bubbles = setUpIndustryView(container);
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

            const bubbles = setUpIndustryView(container);
            bubbles
                .style("fill", (d) =>
                    d.children ? "transparent" : bubbleColor
                )
                .style("fill-opacity", (d) =>
                    d.parent?.data.highlightedIndustry ? 1 : 0.15
                )
                .style("stroke", "transparent");

            const highlightedBubble = findNode(
                bubbles,
                (d) => d.data.highlightedIndustry
            );
            appendIndustryLabel(container, highlightedBubble);
            appendExplanation(
                container,
                highlightedBubble,
                highlightTexts.industry.explanation
            );
        },
        companyHighlight: (container) => {
            if (!highlightTexts.company) return;

            const bubbles = setUpIndustryView(container);
            bubbles
                .style("fill", (d) =>
                    d.children ? "transparent" : bubbleColor
                )
                .style("fill-opacity", (d) =>
                    d.data.highlightedCompany ? 1 : 0.15
                );

            const highlightedBubble = findNode(
                bubbles,
                (d) => d.data.highlightedCompany
            );
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

    function render() {
        const root = getRoot();
        let container = root.select("svg");
        if (container.empty()) {
            container = root
                .append("svg")
                .attr("viewBox", `0 0 ${width} ${height}`);
        }
        container.style("opacity", opacity);
        const renderFunction = renderFunctions[view];
        if (renderFunction) renderFunction(container);
    }

    useEffect(render);
    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default CompanyBubbles;
