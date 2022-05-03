import React from "react";

const ExploreView = () => {
    return (
        <div className="explore">
            Explore
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
        </div>
    );
};

export default ExploreView;
