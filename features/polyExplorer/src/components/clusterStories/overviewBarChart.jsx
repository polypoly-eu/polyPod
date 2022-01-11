import React, { useContext, useMemo } from "react";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import "./overviewBarChart.css";
const chartColors = {
    primary: "#7ee8a2",
    secondary: "#0f1938",
};

class IndexedLegend {
    constructor(items) {
        this.items = items;
    }

    labelOf(item) {
        const index = this.items.indexOf(item);
        if (index === -1) return "";
        return `${index + 1}`;
    }

    render() {
        return (
            <div className="indexed-legend">
                {this.items.map((item, index) => (
                    <div key={index}>
                        {this.labelOf(item)}: {item}
                    </div>
                ))}
            </div>
        );
    }
}

function Companies({ entities }) {
    const legend = new IndexedLegend(entities.map(({ name }) => name));
    const data = entities.map(({ name, dataRecipients }) => ({
        title: legend.labelOf(name),
        value: dataRecipients.length,
    }));
    return (
        <>
            <PolyChart
                type="horizontal-bar-chart"
                data={data}
                barColor={chartColors.primary}
                barValueColor={chartColors.secondary}
            />
            {legend.render()}
        </>
    );
}

function extractRecipientsPerIndustry(entities, companies) {
    const sharingCounts = {};
    for (let { dataRecipients } of entities)
        for (let recipient of dataRecipients)
            sharingCounts[recipient] = (sharingCounts[recipient] || 0) + 1;

    const result = {};
    for (let [recipient, sharingCount] of Object.entries(sharingCounts)) {
        const industry = companies[recipient]?.industryCategoryName();
        if (!industry) {
            console.error(`Unable to determine industry of ${recipient}`);
            continue;
        }
        result[industry] = (result[industry] || []).concat(sharingCount);
    }
    return result;
}

function Industries({ entities }) {
    const { companies } = useContext(ExplorerContext);
    const recipientsPerIndustry = useMemo(
        () => extractRecipientsPerIndustry(entities, companies),
        [entities]
    );
    const top3Industries = Object.entries(recipientsPerIndustry)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([industry]) => industry)
        .slice(0, 3);
    const legend = new IndexedLegend(top3Industries);
    const data = Object.entries(recipientsPerIndustry).map(
        ([industry, recipients]) => ({
            label: legend.labelOf(industry),
            children: recipients.map((sharingCount) => ({
                value: sharingCount,
            })),
        })
    );
    return (
        <>
            <div>
                <span className="bubble-legend-companies">companies</span>
                <span className="bubble-legend-industries">industries</span>
            </div>
            <PolyChart
                type="bubble-cluster"
                data={data}
                bubbleColor={(d) =>
                    d.children ? "transparent" : chartColors.primary
                }
                strokeColor={(d) =>
                    d.children ? chartColors.secondary : "transparent"
                }
                text={(d) => d.data.label}
                textColor={chartColors.secondary}
            />
            {legend.render()}
        </>
    );
}

export default function OverviewBarChart({ entities }) {
    return (
        <div className="receiving-companies">
            <Tabs>
                <Tab
                    id="companies"
                    label={i18n.t(
                        "clusterStoryCommon:label.receivingCompanies"
                    )}
                >
                    <Companies entities={entities} />
                </Tab>
                <Tab
                    id="industries"
                    label={i18n.t(
                        "clusterStoryCommon:label.receivingIndustries"
                    )}
                >
                    <Industries entities={entities} />
                </Tab>
            </Tabs>
        </div>
    );
}
