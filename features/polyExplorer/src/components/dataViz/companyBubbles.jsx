import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import i18n from "../../i18n.js";
import utils from "./utils.js";
import "./dataViz.css";

function createIndustryViewData(companyIndustryMap, highlights = null) {
    // This padding is what's currently keeping the industry labels from
    // colliding (for the most part). But we'll need a better solution.
    const viewData = { padding: 40 };
    viewData.children = Object.entries(companyIndustryMap).map(
        ([industry, companies]) => ({
            name: industry,
            children: companies.map((company) => ({
                name: company.name,
                highlightedCompany: company.name === highlights?.company?.name,
            })),
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
    utils.appendCircleLabel(container, bubble, text, { fontSize: 10 });

function appendIndustryLabel(container, bubble) {
    const industry = bubble.data.name;
    const count = bubble.data.children.length;
    return appendBubbleLabel(container, bubble, `${industry}: ${count}`);
}

function withTemporaryContainer(f) {
    const svg = document.createElementNS(d3.namespaces.svg, "svg");
    document.body.appendChild(svg);
    const container = d3.select(svg);
    f(container);
    document.body.removeChild(svg);
}

function findCollidingIndustryLabels(companyIndustryMap, maxCompanies) {
    const viewData = createIndustryViewData(companyIndustryMap);
    // TODO: Don't hard code width and height here
    const root = packIndustryViewData(viewData, 360, 360, maxCompanies);

    const collidingLabels = [];
    withTemporaryContainer((container) => {
        // TODO: Don't actually draw the bubbles, pass just the necessary data
        //       to appendIndustryLabel
        container
            .selectAll("circle")
            .data(root.descendants())
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", (d) => d.r);
        const industryNodes = container
            .selectAll(".bubble")
            .filter((d) => d.parent && d.children);
        industryNodes.each((e) => appendIndustryLabel(container, e).node());
        const labelRects = [];
        // TODO: .each doesn't seem to work
        container.selectAll(".label")._groups[0].forEach((e) => {
            labelRects.push(utils.calculateElementRect(e));
        });
        // TODO: Determine label collisions and add the offenders to
        //       collidingLabels
    });
    return collidingLabels;
}

export function buildIndustrySets(companyIndustryMap, maxCompanies) {
    // eslint-disable-next-line no-unused-vars
    const collidingLabels = findCollidingIndustryLabels(
        companyIndustryMap,
        maxCompanies
    );

    // TODO: Create more than one set based on collidingLabels
    return [Object.keys(companyIndustryMap)];
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

            industryBubbles
                .filter((d) => showIndustryLabels.includes(d.data.name))
                .each((e) => appendIndustryLabel(container, e));
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
            if (!highlightTexts.company) return;

            const bubbles = setUpIndustryView(container);
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
