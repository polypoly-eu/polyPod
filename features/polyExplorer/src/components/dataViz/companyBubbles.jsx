import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";
import utils from "./utils.js";
import "./dataViz.css";

function calculateCompanyBubblePadding(companyIndustryMap, maxCompanies) {
    const totalCompanies = Object.values(companyIndustryMap)
        .map((companies) => companies.length)
        .reduce((a, b) => a + b, 0);
    const minPadding = 1;
    const maxPadding = 10;
    return (
        minPadding +
        (1 - totalCompanies / maxCompanies) * (maxPadding - minPadding)
    );
}

function createIndustryViewData(
    companyIndustryMap,
    maxCompanies,
    highlights = null
) {
    const companyBubblePadding = calculateCompanyBubblePadding(
        companyIndustryMap,
        maxCompanies
    );
    const viewData = { padding: 40 };
    viewData.children = Object.entries(companyIndustryMap).map(
        ([industry, companies]) => ({
            name: industry,
            children: companies.map((company) => ({
                name: company.name,
                highlightedCompany: company.name === highlights?.company?.name,
            })),
            padding: companyBubblePadding,
            highlightedIndustry: industry === highlights?.industry?.name,
        })
    );
    return viewData;
}

function packIndustryViewData(data, width, height, maxCompanies) {
    const root = d3.hierarchy(data).sum(() => 1);

    // This formula needs some revisiting, it was just tinkered
    // together. The idea is that the radius is small enough so that all
    // visualisations here look alright when the amount of companies is at
    // maxCompanies - there must be a more reliable way to achieve that.
    const bubbleRadius = ((width * Math.PI) / maxCompanies) * 2;

    const edgePadding = 5;
    const packLayout = d3
        .pack()
        .size([width - edgePadding, height - edgePadding])
        .padding((d) => d.data.padding || 1)
        .radius(() => bubbleRadius);
    packLayout(root);
    return root;
}

const appendBubbleLabel = (container, bubble, text) =>
    utils.appendCircleLabel(container, bubble, text);

function appendIndustryLabel(container, bubble) {
    const industry = bubble.data.name;
    const count = bubble.data.children.length;
    return appendBubbleLabel(container, bubble, `${industry}: ${count}`);
}

function withTemporaryContainer(width, height, f) {
    const svg = document.createElementNS(d3.namespaces.svg, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    document.body.appendChild(svg);
    const container = d3.select(svg);
    f(container);
    document.body.removeChild(svg);
}

function calculateIndustryLabelRects(
    companyIndustryMap,
    width,
    height,
    maxCompanies
) {
    const viewData = createIndustryViewData(companyIndustryMap, maxCompanies);
    const root = packIndustryViewData(viewData, width, height, maxCompanies);
    const rects = {};
    withTemporaryContainer(width, height, (container) => {
        for (let industryCircle of root.children) {
            const labelGroup = appendIndustryLabel(container, industryCircle);
            const label = labelGroup.select(".label").node();
            rects[industryCircle.data.name] = utils.calculateElementRect(label);
        }
    });
    return rects;
}

function findCollidingIndustryLabels(industries, industryLabelRects) {
    const collidingLabels = [];
    const collisionFreeRects = [];
    for (let [industry, rect] of Object.entries(industryLabelRects)) {
        if (!industries.includes(industry)) continue;
        const collides = collisionFreeRects.some((otherRect) =>
            utils.detectRectCollision(rect, otherRect)
        );
        if (collides) {
            collidingLabels.push(industry);
            continue;
        }
        collisionFreeRects.push(rect);
    }
    return collidingLabels;
}

export function buildIndustrySets(
    companyIndustryMap,
    width,
    height,
    maxCompanies
) {
    const industryLabelRects = calculateIndustryLabelRects(
        companyIndustryMap,
        width,
        height,
        maxCompanies
    );
    const sets = [];
    for (
        let industries = Object.keys(companyIndustryMap);
        industries.length;

    ) {
        const collidingLabels = findCollidingIndustryLabels(
            industries,
            industryLabelRects
        );
        sets.push(
            industries.filter((industry) => !collidingLabels.includes(industry))
        );
        industries = collidingLabels;
    }
    return sets;
}

const CompanyBubbles = ({
    companyIndustryMap,
    view,
    width,
    height,
    opacity = 1,
    bubbleColor,
    maxCompanies,
    highlight = {},
    showIndustryLabels = [],
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
        const root = packIndustryViewData(data, width, height, maxCompanies);
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
            padding: calculateCompanyBubblePadding(
                companyIndustryMap,
                maxCompanies
            ),
            children: Object.values(companyIndustryMap)
                .flat()
                .map((company) => ({
                    name: company,
                })),
        };
        return appendBubbles(container, viewData);
    }

    function setUpIndustryView(container) {
        const previousState = viewState.current;
        viewState.current = viewStates.industries;
        if (viewState.current === previousState) {
            const root = getRoot();
            root.selectAll(".circle-label, .explanation").remove();
            return root.selectAll(".bubble");
        }

        clearAll();
        const viewData = createIndustryViewData(
            companyIndustryMap,
            maxCompanies,
            highlightTexts
        );
        return appendBubbles(container, viewData);
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
            .style("padding", "4px")
            .style("background", "rgba(15, 25, 56, 0.7)")
            .style("font-family", "Jost Medium")
            .style("font-weight", "500")
            .style("font-size", "14px")
            .style("line-height", "var(--line-height)")
            .style("color", "var(--color-light)")
            .html(explanation);

        const divHeight =
            div.node().getBoundingClientRect().height /
            utils.scaleFactor(
                containerRect,
                container.node().getBoundingClientRect()
            );
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

            industryBubbles
                .filter((d) => showIndustryLabels.includes(d.data.name))
                .each((e) => appendIndustryLabel(container, e));
        },
        industryHighlight: (container) => {
            const bubbles = setUpIndustryView(container);

            if (!highlightTexts.industry) {
                appendExplanation(container, {}, "MISSING INDUSTRY HIGHLIGHT");
                return;
            }

            bubbles
                .style("fill", (d) =>
                    d.children ? "transparent" : bubbleColor
                )
                .style("fill-opacity", (d) =>
                    d.parent?.data.highlightedIndustry ? 1 : 0.15
                )
                .style("stroke", "transparent");

            const highlightedBubble = utils.findNode(
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
            const bubbles = setUpIndustryView(container);

            if (!highlightTexts.company) {
                appendExplanation(container, {}, "MISSING COMPANY HIGHLIGHT");
                return;
            }

            bubbles
                .style("fill", (d) =>
                    d.children ? "transparent" : bubbleColor
                )
                .style("fill-opacity", (d) =>
                    d.data.highlightedCompany ? 1 : 0.15
                );

            const highlightedBubble = utils.findNode(
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
