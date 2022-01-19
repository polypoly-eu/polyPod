import React from "react";
import { createFacebookandOtherTreeMapData } from "../../screens/stories/story-utils";
import { BlockLegend, PolyChart } from "@polypoly-eu/poly-look";

import "./messengerTreeMap.css";
import i18n from "../../i18n";

const MessengerTreeMap = ({ messengers, i18nHeader }) => {
    const facebookGroupName = "Facebook (US)";

    const facebookTreeMapColor = "#3749A9";
    const otherTreeMapColor = "#3BA6FF";

    const nameAbbreviations = {
        Telegram: "Tel",
        Signal: "Sig",
        Threema: "Thr",
    };

    const treeMapData = createFacebookandOtherTreeMapData(
        messengers,
        facebookGroupName
    );

    const handleTreeMapColor = (d) =>
        d.parent.data.name == facebookGroupName
            ? facebookTreeMapColor
            : otherTreeMapColor;

    const handleUnfittingText = (d) => {
        return nameAbbreviations[d.data.name];
    };

    return (
        <div className="messenger-tree-map">
            <p>{i18n.t(`${i18nHeader}:details.monthly.active.users.21`)}</p>
            <BlockLegend
                legend={[
                    {
                        description: i18n.t(
                            `${i18nHeader}:details.owned.by.fb`
                        ),
                        color: facebookTreeMapColor,
                    },
                    {
                        description: i18n.t(
                            `${i18nHeader}:details.owned.by.others`
                        ),
                        color: otherTreeMapColor,
                    },
                ]}
            />
            <PolyChart
                type="tree-map"
                data={treeMapData}
                width={300}
                height={300}
                color={handleTreeMapColor}
                onUnfittingText={handleUnfittingText}
            />
            <div className="legend">
                {Object.entries(nameAbbreviations).map(([name, abbr], i) => (
                    <p key={i}>{`${abbr}: ${name}`}</p>
                ))}
            </div>
        </div>
    );
};

export default MessengerTreeMap;
