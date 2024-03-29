import React, { useState, useContext, useMemo } from "react";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";
import SourceInfoButton from "../sourceInfoButton/sourceInfoButton.jsx";

import i18n from "!silly-i18n";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import "./receivingCompanies.css";

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
    const legend = new IndexedLegend(
        entities.map(({ simpleName }) => simpleName)
    );
    const data = entities.map(({ simpleName, dataRecipients }) => ({
        title: legend.labelOf(simpleName),
        value: dataRecipients.length,
    }));
    return (
        <>
            <PolyChart
                type="vertical-bar-chart"
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
        ([industry, recipients], recipientIndex) => ({
            label: legend.labelOf(industry),
            children: recipients.map((sharingCount, sharingIndex) => ({
                value: sharingCount,
                title: `${recipientIndex}-${sharingIndex}`,
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

export default function ReceivingCompanies({ entities }) {
    const [selectedReceivingEntitiesTab, setSelectedReceivingEntitiesTab] =
        useState("companies-bar-chart-info");
    const switchCompany = (tabId) => {
        if (tabId === "industries")
            setSelectedReceivingEntitiesTab("industries-packed-circle-info");
        else setSelectedReceivingEntitiesTab("companies-bar-chart-info");
    };
    return (
        <div className="receiving-companies">
            <Tabs onTabChange={switchCompany}>
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
            <SourceInfoButton
                infoScreen={selectedReceivingEntitiesTab}
                source={i18n.t("common:source.polyPedia")}
            />
        </div>
    );
}
