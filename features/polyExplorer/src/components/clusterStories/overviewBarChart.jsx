import React, { useContext, useMemo } from "react";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./overviewBarChart.css";
const chartColors = {
    primary: "#7ee8a2",
    secondary: "#0f1938",
};

function Installs({ entities }) {
    const data = entities.map(({ name, totalInstalls }) => ({
        title: name,
        value: totalInstalls / 1000000,
    }));
    return (
        <div>
            <PolyChart
                type="horizontal-bar-chart"
                data={data}
                barColor={chartColors.primary}
                barValueColor={chartColors.secondary}
            />
        </div>
    );
}
function Users({ entities }) {
    const data = entities.map(({ name, activeUsers }) => ({
        title: name,
        value:
            activeUsers.values[activeUsers.values.length - 1].user_count /
            1000000,
    }));
    return (
        <div>
            <PolyChart
                type="horizontal-bar-chart"
                data={data}
                barColor={chartColors.primary}
                barValueColor={chartColors.secondary}
            />
        </div>
    );
}
function PartOf({ entities }) {
    const data = entities.map(({ name, activeUsers, productOwner }) => ({
        title: name,
        value:
            activeUsers.values[activeUsers.values.length - 1].user_count /
            1000000,
        group: productOwner.some((owner) => owner.includes("Facebook"))
            ? "facebook"
            : "other",
    }));
    return (
        <div>
            <PolyChart
                type="horizontal-bar-chart"
                data={data}
                barWidth={20}
                groups={[
                    { translation: "Owned By Facebook", id: "facebook" },
                    { translation: "Other", id: "other" },
                ]}
                barColor={chartColors.primary}
                barValueColor={chartColors.secondary}
            />
        </div>
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
                    <Installs entities={entities} />
                </Tab>
                <Tab
                    id="users"
                    label={i18n.t(
                        "clusterStoryCommon:label.receivingIndustries"
                    )}
                >
                    <Users entities={entities} />
                </Tab>
                <Tab
                    id="part-of"
                    label={i18n.t(
                        "clusterStoryCommon:label.receivingIndustries"
                    )}
                >
                    <PartOf entities={entities} />
                </Tab>
            </Tabs>
        </div>
    );
}
