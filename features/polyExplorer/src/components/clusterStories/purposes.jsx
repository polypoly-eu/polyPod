import React from "react";
import { Tabs, Tab } from "@polypoly-eu/poly-look";
import PurposesBarChart from "../dataViz/purposesBarChart.jsx";
import i18n from "../../i18n.js";

export default function Purposes() {
    const data = {
        mostMentioned: [
            { title: "Example A", value: 1079999 },
            { title: "Example B", value: 31 },
            { title: "Example C", value: 63588 },
            { title: "Example for a Longer Label", value: 6400000 },
        ],
        multipleMentions: [
            { title: "Example", value: 1999 },
            { title: "Exa", value: 310 },
            { title: "Example C", value: 638 },
            { title: "Example for a", value: 40000 },
        ],
    };

    const handleAnimation = () => {
        return true;
    };

    return (
        <div className="purposes">
            <Tabs>
                <Tab
                    id="most-mentioned"
                    label={i18n.t(
                        "clusterStoryCommon:label.purposes.mostMentioned"
                    )}
                >
                    <PurposesBarChart
                        data={data.mostMentioned}
                        animation={handleAnimation()}
                    />
                </Tab>
                <Tab
                    id="multiple-mentions"
                    label={i18n.t(
                        "clusterStoryCommon:label.purposes.multipleMentions"
                    )}
                >
                    <PurposesBarChart
                        data={data.multipleMentions}
                        animation={handleAnimation()}
                    />
                </Tab>
            </Tabs>
        </div>
    );
}
