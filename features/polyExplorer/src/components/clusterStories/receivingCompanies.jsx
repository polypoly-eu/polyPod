import React, { useContext, useMemo } from "react";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import "./receivingCompanies.css";

const displayIndex = (i) => (Number.isInteger(i) ? `${i + 1}` : "");

const IndexedLegend = ({ items }) => (
    <div>
        {items.map((item, index) => (
            <p key={index}>
                {displayIndex(index)}: {item}
            </p>
        ))}
    </div>
);

function Companies({ entities }) {
    const entityNames = entities.map(({ name }) => name);
    const data = entities.map(({ name, dataRecipients }) => ({
        title: displayIndex(entityNames.indexOf(name)),
        value: dataRecipients.length,
    }));
    return (
        <>
            <PolyChart
                type="vertical-bar-chart"
                data={data}
                barColor="#7ee8a2"
                barValueColor="#0f1938"
            />
            <IndexedLegend items={entityNames} />
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
    const industries = Object.keys(recipientsPerIndustry);
    const data = Object.entries(recipientsPerIndustry).map(
        ([industry, recipients]) => ({
            label: displayIndex(industries.indexOf(industry)),
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
                bubbleColor={(d) => (d.children ? "transparent" : "#7ee8a2")}
                strokeColor={(d) => (d.children ? "#0f1938" : "transparent")}
                text={(d) => d.data.label}
                textColor="#0f1938"
            />
            <IndexedLegend items={industries} />
        </>
    );
}

export default function ReceivingCompanies({ entities }) {
    return (
        <div className="receiving-companies">
            <Tabs swipe={false}>
                {/* TODO: Clicking tabs doesn't work with swipe=true yet. */}
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
