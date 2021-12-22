import React, { useContext, useMemo } from "react";
import { Tabs, Tab } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";
import { ExplorerContext } from "../../context/explorer-context.jsx";

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
    const recipients = [].concat.apply(
        [],
        entities.map(({ dataRecipients }) => dataRecipients)
    );

    const companiesPerIndustry = useMemo(() => {
        const map = {};
        for (let recipient of recipients) {
            const industry = companies[recipient]?.industryCategoryName();
            if (!industry) {
                console.error(`Unable to determine industry of ${recipient}`);
                continue;
            }
            map[industry] = (map[industry] || 0) + 1;
        }
        return map;
    }, [entities]);

    return (
        <table>
            <tbody>
                {Object.entries(companiesPerIndustry).map(
                    ([industry, companyCount], index) => (
                        <tr key={index}>
                            <td>{industry}</td>
                            <td>{companyCount}</td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
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
