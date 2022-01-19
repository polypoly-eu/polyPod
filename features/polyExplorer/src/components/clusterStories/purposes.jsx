import React from "react";
import PurposesBarChart from "../dataViz/purposesBarChart.jsx";

export default function Purposes({ companies }) {
    const purposes = {};

    for (let company of companies) {
        for (let sharedPurpose of company.dataSharingPurposes) {
            const purpose = sharedPurpose["dpv:Purpose"];
            purposes[purpose]
                ? (purposes[purpose].count += sharedPurpose.count)
                : (purposes[purpose] = sharedPurpose);
        }
    }

    const data = Object.values(purposes)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)
        .map((purpose) => ({
            title: purpose["dpv:Purpose"],
            value: purpose.count,
            explanation: purpose.explanation,
            translation: purpose.translation,
        }));

    console.log(data);

    return (
        <div className="purposes">
            <PurposesBarChart data={data} animation={true} />
        </div>
    );
}
