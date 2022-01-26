import React from "react";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

import "./overviewBarChart.css";
import { latestActiveUsersValue } from "../../screens/stories/story-utils.js";
const chartColors = {
    primary: "#3aa6ff",
    secondary: "#fff",
};

function Installs({ entities }) {
    const data = entities
        .map(({ name, totalInstalls }) => ({
            title: name,
            value: totalInstalls / 1000000,
        }))
        .filter((data) => data.value);
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
    const data = entities
        .map((product) => ({
            title: product.name,
            value: latestActiveUsersValue(product),
        }))
        .filter((data) => data.value);
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
    const data = entities
        .map((product) => ({
            title: product.name,
            value: latestActiveUsersValue(product),
            group: product.productOwner.some((owner) =>
                owner.includes("Facebook")
            )
                ? "facebook"
                : "other",
        }))
        .filter((data) => data.value);
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
            <Tabs swipe={false}>
                <Tab
                    id="installs"
                    label={i18n.t("clusterStoryCommon:label.installs")}
                >
                    <p>
                        {i18n.t(
                            `clusterMessengerStory:overview.paragraph.installs`
                        )}
                    </p>
                    <Installs entities={entities} />
                </Tab>
                <Tab
                    id="users"
                    label={i18n.t("clusterStoryCommon:label.users")}
                >
                    <p>
                        {i18n.t(
                            `clusterMessengerStory:overview.paragraph.users`
                        )}
                    </p>

                    <Users entities={entities} />
                </Tab>
                <Tab
                    id="part-of"
                    label={i18n.t("clusterStoryCommon:label.partOf")}
                >
                    <p>
                        {i18n.t(
                            `clusterMessengerStory:overview.paragraph.partOf`
                        )}
                    </p>

                    <PartOf entities={entities} />
                </Tab>
            </Tabs>
        </div>
    );
}
