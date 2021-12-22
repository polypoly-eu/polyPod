import React, { useContext, useMemo } from "react";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";
import { ExplorerContext } from "../../context/explorer-context.jsx";

function IndustriesChart({ recipientsPerIndustry }) {
    const industries = Object.keys(recipientsPerIndustry);
    const data = Object.entries(recipientsPerIndustry).map(
        ([industry, recipients]) => ({
            label: `${industries.indexOf(industry) + 1}`,
            children: recipients.map((sharingCount) => ({
                value: sharingCount,
            })),
        })
    );
    return (
        <>
            <PolyChart
                type="bubble-cluster"
                data={data}
                bubbleColor={(d) => (d.children ? "transparent" : "#7ee8a2")}
                strokeColor={(d) => (d.children ? "#0f1938" : "transparent")}
                text={(d) => d.data.label}
                textColor="#0f1938"
            />
            <div>
                {industries.map((industry, index) => (
                    <p key={index}>
                        {index + 1}: {industry}
                    </p>
                ))}
            </div>
        </>
    );
}

const Companies = ({ entities }) => (
    <table>
        <tbody>
            {entities.map(({ name, dataRecipients }, index) => (
                <tr key={index}>
                    <td>{name}</td>
                    <td>{dataRecipients.length}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

function Industries({ entities }) {
    const { companies } = useContext(ExplorerContext);

    const recipientSharingCounts = useMemo(() => {
        const result = {};
        for (let { dataRecipients } of entities)
            for (let recipient of dataRecipients)
                result[recipient] = (result[recipient] || 0) + 1;
        return result;
    }, [entities]);

    const recipientsPerIndustry = useMemo(() => {
        const result = {};
        for (let [recipient, sharingCount] of Object.entries(
            recipientSharingCounts
        )) {
            const industry = companies[recipient]?.industryCategoryName();
            if (!industry) {
                console.error(`Unable to determine industry of ${recipient}`);
                continue;
            }
            result[industry] = (result[industry] || []).concat(sharingCount);
        }
        return result;
    }, [entities]);

    return <IndustriesChart recipientsPerIndustry={recipientsPerIndustry} />;
}

export default function ReceivingCompanies({ entities }) {
    return (
        <Tabs swipe={false}>
            {/* TODO: Clicking tabs doesn't work with swipe=true yet. */}
            <Tab
                id="companies"
                label={i18n.t("clusterStoryCommon:label.receivingCompanies")}
            >
                <Companies entities={entities} />
            </Tab>
            <Tab
                id="industries"
                label={i18n.t("clusterStoryCommon:label.receivingIndustries")}
            >
                <Industries entities={entities} />
            </Tab>
        </Tabs>
    );
}
