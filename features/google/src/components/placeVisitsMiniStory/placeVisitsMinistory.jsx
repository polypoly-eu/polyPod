import { PolyChart } from "@polypoly-eu/poly-look";
import React from "react";

import "./placeVisitsMinistory.css";

export const PlaceVisitsMinistorySummary = ({ placeVisits }) => {
    debugger;
    if (placeVisits?.length) return;
    return (
        <>
            <p> The Places you visited</p>
            <PolyChart
                type="horizontal-bar-chart"
                data={placeVisits}
                barWidth={16}
                barColor={"#0c0c3d"}
                barValueColor={"#0c0c3d"}
            />
            <div className="messages-gradient"></div>
            <p className="source">Your google data</p>
        </>
    );
};
