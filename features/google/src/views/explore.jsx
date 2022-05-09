import React, { useContext } from "react";
import { PolyImportContext, Screen } from "@polypoly-eu/poly-look";

const ExploreView = () => {
    const { account } = useContext(PolyImportContext);
    return (
        <Screen className="import" layout="poly-standard-layout">
            <div>
                <h1>Activities</h1>
                {account?.activities.map((activity, i) => (
                    <div key={i}>{activity.timestamp.toUTCString()}</div>
                ))}
            </div>
            <div>
                <h1>Place Visits</h1>
                {account?.placeVisits.map((placeVisit, i) => (
                    <div key={i}>{placeVisit.timestamp.toUTCString()}</div>
                ))}
            </div>
            <div>
                <h1>Activity segments</h1>
                {account?.activitySegments.map((activitySegment, i) => (
                    <div key={i}>{activitySegment.timestamp.toUTCString()}</div>
                ))}
            </div>
        </Screen>
    );
};

export default ExploreView;
