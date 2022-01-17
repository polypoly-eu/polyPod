import React from "react";
import { Tabs, Tab } from "@polypoly-eu/poly-look";

import i18n from "../../i18n.js";

export default function Purposes() {
    return (
        <div className="purposes">
            <Tabs>
                <Tab
                    id="most-mentioned"
                    label={i18n.t(
                        "clusterStoryCommon:label.purposes.mostMentioned"
                    )}
                >
                    <p>TODO</p>
                </Tab>
                <Tab
                    id="multiple-mentions"
                    label={i18n.t(
                        "clusterStoryCommon:label.purposes.multipleMentions"
                    )}
                >
                    <p>TODO</p>
                </Tab>
            </Tabs>
        </div>
    );
}
