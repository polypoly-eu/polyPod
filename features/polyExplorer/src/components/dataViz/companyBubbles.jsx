import React, { useEffect, useRef, useState } from "react";
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
    const [diagrams, setDiagram] = useState({});
    const [industryCircleLabel, setIndustryCircleLabel] = useState({});
    const [viewState, setViewState] = useState(null);
    const [companyCirclePosition, setCompanyCirclePosition] = useState({});

    const bubbleRef = useRef();
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

    function createViewData() {
        const viewData = {};
        const localDiagram = {};
        const root = getRoot();
        viewData.flat = {
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

        viewData.industryCompanyHighlight = createIndustryViewData(
            companyIndustryMap,
            maxCompanies,
            highlightTexts
        );

        localDiagram.flat = {};
        localDiagram.flat.svg = root
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);
        localDiagram.flat.root = appendBubbles(
            localDiagram.flat.svg,
            viewData.flat
        );
        localDiagram.flat.root
            .filter((d) => d.children)
            .style("fill", "transparent");
        localDiagram.flat.bubbles = localDiagram.flat.root.filter(
            (d) => !d.children
        );

        localDiagram.flat.bubbles.style("fill", bubbleColor);

        const pack = packIndustryViewData(
            viewData.industryCompanyHighlight,
            width,
            height,
            maxCompanies
        );

        setCompanyCirclePosition((state) => {
            return {
                ...state,
                ...pack.children.reduce((acc, child) => {
                    const result = child.children.reduce(
                        (acc2, secondChild) => {
                            return {
                                ...acc2,
                                [secondChild.data.name]: {
                                    x: secondChild.x,
                                    y: secondChild.y,
                                },
                            };
                        },
                        {}
                    );

                    return { ...acc, ...result };
                }, {}),
            };
        });

        for (const industryBubble of pack.children) {
            if (industryBubble.children && industryBubble.children.length > 0) {
                localDiagram.flat.svg
                    .append("circle")
                    .attr("class", "industry-bubble")
                    .attr("cx", industryBubble.x)
                    .attr("cy", industryBubble.y)
                    .attr("r", industryBubble.r)
                    .style("fill", "transparent")
                    .style("stroke", bubbleColor)
                    .style("opacity", 0);
            }
        }

        localDiagram.flat.industriesBubbles = localDiagram.flat.svg.selectAll(
            ".industry-bubble"
        );

        localDiagram.flat.industriesBubbles.each((elem, index) => {
            const d = pack.children[index];
            const industryLabel = appendIndustryLabel(localDiagram.flat.svg, d);
            industryLabel.style("opacity", "0");
            setIndustryCircleLabel((state) => ({
                ...state,
                [d.data.name]: industryLabel,
            }));

            return industryLabel;
        });

        localDiagram.industryHighlight = {};
        localDiagram.industryHighlight.svg = root
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);
        localDiagram.industryHighlight.root = appendBubbles(
            localDiagram.industryHighlight.svg,
            viewData.industryCompanyHighlight
        );

        localDiagram.industryHighlight.root
            .style("fill", (d) => (d.children ? "transparent" : bubbleColor))
            .style("fill-opacity", (d) =>
                d.parent?.data.highlightedIndustry ? 1 : 0.15
            )
            .style("stroke", "transparent");

        localDiagram.industryHighlight.bubbles = utils.findNode(
            localDiagram.industryHighlight.root,
            (d) => d.data.highlightedIndustry
        );

        appendIndustryLabel(
            localDiagram.industryHighlight.svg,
            localDiagram.industryHighlight.bubbles
        );
        appendExplanation(
            localDiagram.industryHighlight.svg,
            localDiagram.industryHighlight.bubbles,
            highlightTexts.industry.explanation
        );

        localDiagram.companyHighlight = {};
        localDiagram.companyHighlight.svg = root
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);
        localDiagram.companyHighlight.root = appendBubbles(
            localDiagram.companyHighlight.svg,
            viewData.industryCompanyHighlight
        );

        localDiagram.companyHighlight.root
            .style("fill", (d) => (d.children ? "transparent" : bubbleColor))
            .style("fill-opacity", (d) =>
                d.data.highlightedCompany ? 1 : 0.15
            );

        localDiagram.companyHighlight.bubbles = utils.findNode(
            localDiagram.companyHighlight.root,
            (d) => d.data.highlightedCompany
        );

        appendBubbleLabel(
            localDiagram.companyHighlight.svg,
            localDiagram.companyHighlight.bubbles,
            highlightTexts.company.explanation
        );

        appendExplanation(
            localDiagram.companyHighlight.svg,
            localDiagram.companyHighlight.bubbles,
            highlightTexts.company.explanation
        );

        for (const diagram in localDiagram) {
            localDiagram[diagram].svg.style("opacity", "0");
            localDiagram[diagram].svg.style("display", "none");
        }

        setDiagram({ ...localDiagram });

        return localDiagram;
    }

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


    function showDiagram(diagramType, diagramDom) {
        if (viewState !== diagramType) {
            if (diagramType === "allIndustries") {
                for (const industryName in companyCirclePosition) {
                    let currentX = 0;
                    let currentY = 0;

                    const nextX = companyCirclePosition[industryName].x;
                    const nextY = companyCirclePosition[industryName].y;

                    const bubbleFound = diagramDom.flat.bubbles.filter(
                        (bubble) => {
                            return bubble.data.name.name === industryName;
                        }
                    );

                    bubbleFound
                        .each((bubble) => {
                            currentX = bubble.x;
                            currentY = bubble.y;
                        })
                        .transition()
                        .duration(1000)
                        .attr(
                            "transform",
                            `translate(${nextX - currentX}, ${
                                nextY - currentY
                            })`
                        );
                }

                diagramDom.flat.industriesBubbles
                    .transition()
                    .delay(1000)
                    .duration(500)
                    .style("opacity", 1);
            } else if (viewState) {
                const pastState =
                    viewState === "allIndustries" ? "flat" : viewState;
                diagramDom[pastState].svg.style("display", "none");

                diagramDom[diagramType].svg
                    .style("display", "block")
                    .transition()
                    .duration(1000)
                    .style("opacity", opacity);
            } else {
                diagramDom[diagramType].svg
                    .style("display", "block")
                    .transition()
                    .duration(1000)
                    .style("opacity", opacity);
            }

            setViewState(diagramType);
        }

        if (diagramType === "allIndustries") {
            for (const industryName in industryCircleLabel) {
                if (showIndustryLabels.includes(industryName)) {
                    industryCircleLabel[industryName]
                        .transition()
                        .delay(1000)
                        .duration(500)
                        .style("opacity", 1);
                } else {
                    industryCircleLabel[industryName]
                        .transition()
                        .duration(1000)
                        .style("opacity", 0);
                }
            }
        }
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

    function render() {
        if (Object.keys(diagrams).length === 0) {
            const diagramResult = createViewData();
            showDiagram(view, diagramResult);
        } else {
            showDiagram(view, diagrams);
        }
    }

    useEffect(render, [view, showIndustryLabels]);
    return <div className="bubble-chart" ref={bubbleRef}></div>;
};

export default CompanyBubbles;
